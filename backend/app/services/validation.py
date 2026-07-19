from fastapi import HTTPException, status

from app.schemas.section import FieldDefinition

# Which Python types are acceptable for each declared field type.
_TYPE_CHECKS = {
    "text": str,
    "richtext": str,
    "url": str,
    "date": str,
    "image": str,
    "tags": list,
    "icon-list": list,
    "number": (int, float),
}

def validate_item_data(field_schema: list[FieldDefinition], data: dict) -> None:
    """Raises HTTPException(422) if `data` doesn't match `field_schema`."""
    allowed_keys = {field.key for field in field_schema}
    unknown_keys = set(data.keys()) - allowed_keys
    if unknown_keys:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unknown field(s) not defined in this section's schema: {sorted(unknown_keys)}",
        )

    for field in field_schema:
        value = data.get(field.key)

        if field.required and (value is None or value == ""):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Field '{field.key}' is required.",
            )

        if value is not None:
            expected_type = _TYPE_CHECKS[field.type]
            if not isinstance(value, expected_type):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Field '{field.key}' should be of type '{field.type}'.",
                )