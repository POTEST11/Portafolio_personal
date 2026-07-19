import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.admin_user import AdminUser


def create_admin(email: str, password: str):
    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.email == email).first()
        if existing is not None:
            print(f"Admin with email '{email}' already exists — nothing to do.")
            return

        admin = AdminUser(email=email, hashed_password=hash_password(password))
        db.add(admin)
        db.commit()
        print(f"Created admin user: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    email = input("Admin email: ").strip()
    password = input("Admin password: ").strip()
    create_admin(email, password)