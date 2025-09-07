from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.models.booking import BookingStatus


class BookingBase(BaseModel):
    service_type: str
    date_time: datetime
    special_instructions: Optional[str] = None
    estimated_price: Optional[float] = None


class BookingCreate(BookingBase):
    provider_id: UUID


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    final_price: Optional[float] = None
    special_instructions: Optional[str] = None


class BookingResponse(BookingBase):
    booking_id: UUID
    customer_id: UUID
    provider_id: UUID
    status: BookingStatus
    final_price: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class CallbackRequest(BaseModel):
    provider_id: UUID
    preferred_time: str
    message: str
