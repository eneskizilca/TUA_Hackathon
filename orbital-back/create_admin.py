from database import SessionLocal
from models import User, UserRole
from routers.auth import hash_password

db = SessionLocal()
try:
    existing = db.query(User).filter(User.email == "admin@admin.com").first()
    if existing:
        existing.is_active = True
        existing.role = UserRole.ADMIN
        existing.hashed_password = hash_password("admin@admin.com")
        db.commit()
        print("Updated existing admin user")
    else:
        user = User(
            email="admin@admin.com",
            hashed_password=hash_password("admin@admin.com"),
            role=UserRole.ADMIN,
            is_active=True,
            full_name="Admin"
        )
        db.add(user)
        db.commit()
        print("Created new admin user")
finally:
    db.close()
