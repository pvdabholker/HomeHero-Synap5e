from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError
import jwt
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import timedelta

from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.controllers.user import UserController
from app.models.user import User
from app.core.security import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_token,
)
from app.core.config import settings

router = APIRouter()


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class LoginRequest(BaseModel):
    email_or_phone: str
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class OTPVerification(BaseModel):
    phone: str
    otp: str


# register a new user (customer or provider)
@router.post("/register", response_model=dict)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = UserController.create_user(db, user_data)
        return {"message": "Registered successfully", "user_id": str(user.id)}

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed",
        )


# Authenticate user and return JWT tokens
@router.post("/login", response_model=Token)
async def login_user(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email_or_phone, login_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Account is inactive"
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(subject=user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
    }


# Refresh access token using refresh token
@router.post("/refresh", response_model=Token)
async def refresh_access_token(
    refresh_data: RefreshTokenRequest, db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            refresh_data.refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id = payload.get("sub")
        token_type = payload.get("type")

        if user_id is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
            )

        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
        new_refresh_token = create_refresh_token(subject=user.id)

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "Bearer",
        }

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )


# Verify OTP for phone authentication
@router.post("/verify-otp", response_model=dict)
async def verify_otp(otp_data: OTPVerification, db: Session = Depends(get_db)):
    # TODO: Implement actual OTP verification with Twilio
    # For now, accept 123456 as valid OTP
    if otp_data.otp == "123456":
        # Mark user as verified
        user = db.query(User).filter(User.phone == otp_data.phone).first()
        if user:
            user.is_verified = True
            db.commit()
        return {"message": "OTP verified"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP"
        )


# Logout user
@router.post("/logout", response_model=dict)
async def logout_user():
    return {"message": "Successfully logged out"}
