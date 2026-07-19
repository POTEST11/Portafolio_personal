import uuid
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

FieldType = Literal["text", "richtext", "url", "date", "image", "tags", "icon-list", "number"]
LayoutVariant = Literal["timeline", "grid-cards", "pill-groups", "stacked", "hero-text"]


class FieldDefinition(BaseModel):
    key: str
    label: str
    type: FieldType
    required: bool = False


class SectionItemBase(BaseModel):
    order: int = 0
    data: dict[str, Any]


class SectionItemCreate(SectionItemBase):
    pass


class SectionItemRead(SectionItemBase):
    id: uuid.UUID
    section_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class SectionBase(BaseModel):
    slug: str
    title: str
    eyebrow: str = ""
    order: int = 0
    is_visible: bool = True
    layout_variant: LayoutVariant
    field_schema: list[FieldDefinition] = Field(default_factory=list)


class SectionCreate(SectionBase):
    pass


class SectionRead(SectionBase):
    id: uuid.UUID
    items: list[SectionItemRead] = []

    model_config = ConfigDict(from_attributes=True)