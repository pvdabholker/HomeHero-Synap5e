from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse
from app.schemas.provider import ProviderResponse
from app.schemas.booking import BookingResponse
from app.controllers.user import UserController
from app.controllers.provider import ProviderController
from app.controllers.booking import BookingController
from app.models.user import User
from app.models.booking import Booking
from app.models.provider import Provider


router = APIRouter()


# verify current user as admin
def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
        )
    return current_user


# approve provider count
@router.post("/providers/{provider_id}/approve", response_model=dict)
async def approve_provider(
    provider_id: str,
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    ProviderController.approve_provider(db, provider_id)
    return {"message": "provider approved"}


# view all bookings admin only
@router.get("/bookings", response_model=List[BookingResponse])
async def get_all_bookings(
    current_user: User = Depends(verify_admin), db: Session = Depends(get_db)
):
    return db.query(Booking).all()


# view all users admin only
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    return UserController.get_users(db, skip, limit)


# view all providers admin only
@router.get("/providers", response_model=List[ProviderResponse])
async def get_all_providers(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    return db.query(Provider).offset(skip).limit(limit).all()


# view all complaints
@router.get("/complaints", response_model=List[dict])
async def get_complaints(
    current_user: User = Depends(verify_admin), db: Session = Depends(get_db)
):
    # TODO: Implement complaints system
    return {"message": "No complaints found"}
