from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class User(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    user_type: str
    location: Optional[str] = None
    created_at: datetime


class Provider(BaseModel):
    provider_id: str
    user_id: str
    services: List[str]
    pricing: float
    availability: bool
    rating: float
    documents: List[str]
    approved: bool


class Booking(BaseModel):
    booking_id: str
    customer_id: str
    provider_id: str
    service_type: str
    status: str
    date_time: datetime
    special_instructions: Optional[str] = None
    created_at: datetime


class Review(BaseModel):
    review_id: str
    booking_id: str
    customer_id: str
    provider_id: str
    rating: float
    comment: str
    images: List[str]
