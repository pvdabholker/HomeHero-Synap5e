from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import timezone, datetime
import re


# Custom validator
def validate_indian_phone_number(phone: str) -> str:
    pattern = re.compile(r"^(?:\+91)?[6-9]\d{9}$")
    if not pattern.match(phone):
        raise ValueError(
            "Invalid Indian phone number format. Must be 10 digits, optionally starting with +91."
        )
    if phone.startswith("+91"):
        return phone[3:]
    return phone


def validate_indian_pincode(pincode: str) -> str:
    pattern = re.compile(r"^\d{6}$")
    if not pattern.match(pincode):
        raise ValueError("Pincode must be exactly 6 digits.")
    return pincode


# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    user_type: str

    @field_validator("phone")
    def phone_validator(cls, v):
        return validate_indian_phone_number(v)


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    phone: str
    user_type: str
    address_line: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    created_at: datetime = datetime.now(timezone.utc)

    model_config = ConfigDict(from_attributes=True)


class UserLocationUpdate(BaseModel):
    address_line: str
    city: str
    pincode: str

    @field_validator("pincode")
    def pincode_validator(cls, v):
        return validate_indian_pincode(v)


# Provider schemas
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

    model_config = ConfigDict(from_attributes=True)


# Booking Schemas
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

    model_config = ConfigDict(from_attributes=True)


# reviews schemas
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

    model_config = ConfigDict(from_attributes=True)


# authentication
class LoginRequest(BaseModel):
    email_or_phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

    @field_validator("phone")
    def phone_validator(cls, v):
        validate_indian_phone_number(v)
