from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.rate_limiter import limiter
from app.schemas.user import UserResponse, UserUpdate, LocationUpdate
from app.controllers.user import UserController
from app.services.file_upload import FileUploadService
from app.models.user import User


router = APIRouter()
file_service = FileUploadService()


# get current user
@router.get("/me", response_model=UserResponse)
@limiter.limit("30/minute")
async def get_current_user_profile(
    request: Request, current_user: User = Depends(get_current_user)
):
    return current_user


# update current user profile
@router.put("/me", response_model=UserResponse)
@limiter.limit("10/minute")
async def update_current_user(
    request: Request,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return UserController.update_user(db, str(current_user.id), user_data)


# upload user pfp
@router.post("/me/avatar", response_model=dict)
@limiter.limit("5/minute")
async def upload_user_avatar(
    request: Request,
    avatar: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # upload to cloudinary
        result = await file_service.upload_image(avatar, folder="homehero/avatars")

        # upload user profile with avatar url
        user_update = UserUpdate(avatar_url=result["url"])
        UserController.update_user(db, str(current_user.id), user_update)

        return {
            "message": "Avatar uploaded successfully",
            "avatar_url": result["url"],
            "public_id": result["public_id"],
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Avatar upload failed: {str(e)}",
        )


# update user location
@router.post("/location", response_model=dict)
@limiter.limit("20/minute")
async def update_user_location(
    request: Request,
    location_data: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    UserController.update_location(
        db, str(current_user.id), location_data.location, location_data.pincode
    )

    return {"message": "Location Updated"}


# get user by id admin only or own profile
@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if str(current_user.id) != user_id and current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    return UserController.get_user(db, user_id)
