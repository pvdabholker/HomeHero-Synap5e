from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . . import crud, schemas
from . .database import get_db
from uuid import UUID
from typing import List

router = APIRouter(
    prefix="/api/users",
    tags=['Users']
)

@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    A simple endpoint to create a new user (customer or provider).
    """
    db_user = crud.get_user_by_email_or_phone(db, email=user.email, phone=user.phone)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email or phone number already exists."
        )
    return crud.create_user(db=db, user=user)


@router.post("/{user_id}/location", response_model=schemas.UserResponse)
def set_user_location(user_id: UUID, location: schemas.UserLocationUpdate, db: Session = Depends(get_db)):
    """
    Location Setup.
    """
    db_user = crud.get_user_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    updated_user = crud.update_user_location(db=db, user_id=user_id, location=location)
    return updated_user