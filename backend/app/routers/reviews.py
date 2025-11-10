from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_customer
from app.schemas.review import ReviewResponse, ReviewCreate, ReviewWithCustomer
from app.controllers.review import ReviewController
from app.models.user import User

router = APIRouter()


# submit a review for provider
@router.post("/", response_model=dict)
async def current_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    ReviewController.create_review(db, review_data, str(current_user.id))
    return {"message": "Review submitted"}


# get all reviews for a provider
@router.get("/provider/{provider_id}", response_model=List[ReviewWithCustomer])
async def get_provider_reviews(provider_id: str, db: Session = Depends(get_db)):
    return ReviewController.get_provider_reviews(db, provider_id)


# get review by id
@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ReviewController.get_review(db, review_id)
