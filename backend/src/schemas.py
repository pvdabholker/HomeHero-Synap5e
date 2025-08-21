from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


# User
class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    user_type: str
    location: Optional[str] = None


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


# Provider
class ProviderBase(BaseModel):
    services: List[str]
    pricing: float
    availability: bool
    rating: float
    documents: Optional[List[str]] = None
    approved: bool


class ProviderCreate(ProviderBase):
    user_id: UUID


class Provider(ProviderBase):
    provider_id: UUID
    user_id: UUID

    model_config = {"from_attributes": True}


# Bookings
class BookingBase(BaseModel):
    customer_id: UUID
    provider_id: UUID
    service_type: str
    status: str
    date_time: datetime
    special_instructions: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    booking_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


# Reviews
class ReviewBase(BaseModel):
    booking_id: UUID
    customer_id: UUID
    provider_id: UUID
    rating: float
    comment: Optional[str] = None
    images: Optional[List[str]] = None


class ReviewCreate(ReviewBase):
    pass


class Review(ReviewBase):
    review_id: UUID

    model_config = {"from_attributes": True}
