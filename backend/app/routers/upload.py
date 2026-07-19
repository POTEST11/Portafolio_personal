import hashlib
import time

from fastapi import APIRouter, Depends

from app.core.config import settings
from app.core.security import get_current_admin
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/upload", tags=["upload"])


@router.get("/signature")
def get_upload_signature(_admin: AdminUser = Depends(get_current_admin)):
    timestamp = int(time.time())

    params_to_sign = f"timestamp={timestamp}"
    string_to_sign = params_to_sign + settings.cloudinary_api_secret
    signature = hashlib.sha1(string_to_sign.encode("utf-8")).hexdigest()

    return {
        "timestamp": timestamp,
        "signature": signature,
        "api_key": settings.cloudinary_api_key,
        "cloud_name": settings.cloudinary_cloud_name,
    }