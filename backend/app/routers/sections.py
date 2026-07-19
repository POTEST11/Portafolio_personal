import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_admin
from app.db.session import get_db
from app.models.admin_user import AdminUser
from app.models.section import Section, SectionItem
from app.schemas.section import (
    SectionCreate,
    SectionRead,
    SectionItemCreate,
    SectionItemRead,
)
from app.schemas.section import FieldDefinition  # add to imports if not present
from app.services.validation import validate_item_data

router = APIRouter(prefix="/sections", tags=["sections"])


def _get_section_or_404(section_id: uuid.UUID, db: Session) -> Section:
    section = db.query(Section).filter(Section.id == section_id).first()
    if section is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found.")
    return section


# ---- Public ----

@router.get("", response_model=list[SectionRead])
def list_sections(db: Session = Depends(get_db)):
    sections = (
        db.query(Section)
        .options(joinedload(Section.items))
        .filter(Section.is_visible.is_(True))
        .order_by(Section.order)
        .all()
    )
    return sections


@router.get("/admin/all", response_model=list[SectionRead])
def list_all_sections(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    sections = (
        db.query(Section)
        .options(joinedload(Section.items))
        .order_by(Section.order)
        .all()
    )
    return sections


# ---- Admin: sections ----

@router.post("", response_model=SectionRead, status_code=status.HTTP_201_CREATED)
def create_section(
    payload: SectionCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    existing = db.query(Section).filter(Section.slug == payload.slug).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A section with slug '{payload.slug}' already exists.",
        )

    section = Section(**payload.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.patch("/{section_id}", response_model=SectionRead)
def update_section(
    section_id: uuid.UUID,
    payload: SectionCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    section = _get_section_or_404(section_id, db)
    for key, value in payload.model_dump().items():
        setattr(section, key, value)
    db.commit()
    db.refresh(section)
    return section


@router.delete("/{section_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_section(
    section_id: uuid.UUID,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    section = _get_section_or_404(section_id, db)
    db.delete(section)
    db.commit()

def _get_item_or_404(section_id: uuid.UUID, item_id: uuid.UUID, db: Session) -> SectionItem:
    item = (
        db.query(SectionItem)
        .filter(SectionItem.id == item_id, SectionItem.section_id == section_id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found.")
    return item


# ---- Admin: items ----



@router.post(
    "/{section_id}/items",
    response_model=SectionItemRead,
    status_code=status.HTTP_201_CREATED,
)
def create_item(
    section_id: uuid.UUID,
    payload: SectionItemCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    section = _get_section_or_404(section_id, db)
    field_schema = [FieldDefinition(**f) for f in section.field_schema]
    validate_item_data(field_schema, payload.data)

    item = SectionItem(section_id=section.id, order=payload.order, data=payload.data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{section_id}/items/{item_id}", response_model=SectionItemRead)
def update_item(
    section_id: uuid.UUID,
    item_id: uuid.UUID,
    payload: SectionItemCreate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    section = _get_section_or_404(section_id, db)
    item = _get_item_or_404(section_id, item_id, db)
    field_schema = [FieldDefinition(**f) for f in section.field_schema]
    validate_item_data(field_schema, payload.data)
    item.order = payload.order
    item.data = payload.data
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{section_id}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    section_id: uuid.UUID,
    item_id: uuid.UUID,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    item = _get_item_or_404(section_id, item_id, db)
    db.delete(item)
    db.commit()