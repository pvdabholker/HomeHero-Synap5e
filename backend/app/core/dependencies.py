from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User

security = HTTPBearer()


# get current authenticated user from jwt token
async def get_current_user(
    token: str = Depends(security), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # extract token from bearer format
    token_str = token.credentials if hasattr(token, "credentials") else str(token)

    user_id = verify_token(token_str)
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user


# Ensure current user is a customer
async def get_current_customer(current_user: User = Depends(get_current_user)) -> User:

    if current_user.user_type != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Customer access required"
        )
    return current_user


# Ensure current user is a provider
async def get_current_provider(current_user: User = Depends(get_current_user)) -> User:

    if current_user.user_type != "provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Provider access required"
        )
    return current_user


# Ensure current user is a admin
async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:

    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
        )
    return current_user
