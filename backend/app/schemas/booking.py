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
    date_time: Optional[datetime] = None  # allow resheduling


class BookingResponse(BookingBase):
    booking_id: UUID
    customer_id: UUID
    provider_id: UUID
    status: BookingStatus
    final_price: Optional[float]
    cancellation_reason: Optional[str] = None
    canceled_by: Optional[str] = None
    canceled_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class BookingCancellation(BaseModel):
    reason: str

    class Config:
        schema_extra = {
            "example": {"reason": "Change of plans, need to reschedule for next week"}
        }


class BookingReshedule(BaseModel):
    new_date_time: datetime
    reason: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "new_date_time": "2024-12-02T14:00:00",
                "reason": "Emergency came up, need to reschedule",
            }
        }


class CallbackRequest(BaseModel):
    provider_id: UUID
    preferred_time: str
    message: str
