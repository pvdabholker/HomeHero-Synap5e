from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.schemas.user import UserResponse


class ProviderBase(BaseModel):
    services: List[str] = []
    pricing: float = 0.0
    availability: bool = True
    experience_years: int = 0
    service_radius: float = 10.0


class ProviderCreate(ProviderBase):
    pass


class ProviderUpdate(BaseModel):
    services: Optional[List[str]] = None
    pricing: Optional[float] = None
    availability: Optional[bool] = None
    experience_years: Optional[int] = None
    service_radius: Optional[float] = None


class ProviderResponse(ProviderBase):
    provider_id: UUID
    user_id: UUID
    rating: float
    rating_count: int
    approved: bool
    documents: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ProviderWithUser(ProviderResponse):
    user: UserResponse


class PricingUpdate(BaseModel):
    pricing: float


class AvailabilityUpdate(BaseModel):
    available: bool
