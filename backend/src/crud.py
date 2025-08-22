from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas
from uuid import UUID
from datetime import datetime, timezone

# User Crud Operations


def get_user_id(db: Session, user_id: UUID):
    """
    Fetch single user by user_id
    """
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email_or_phone(db: Session, email: str, phone: str):
    """
    Checks if a user already exists with the given email or phone number.
    """
    return (
        db.query(models.User)
        .filter(or_(models.User.email == email, models.User.phone == phone))
        .first()
    )


def create_user(db: Session, user: schemas.UserCreate):
    """
    Create new user in db
    """
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        user_type=user.user_type,
        created_at=datetime.now(timezone.utc),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_location(
    db: Session, user_id: UUID, location: schemas.UserLocationUpdate
):
    """
    Updates location details for specific user
    """
    db_user = get_user_id(db, user_id)
    if db_user:
        db_user.address_line = location.address_line
        db_user.city = location.city
        db_user.pincode = location.pincode
        db.commit()
        db.refresh(db_user)
    return db_user


def get_providers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Provider).offset(skip).limit(limit).all()


def create_provider(db: Session, provider: schemas.ProviderCreate):
    db_provider = models.Provider(**provider.model_dump())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider
