from sqlalchemy import (
    Column,
    String,
    DateTime,
    Text,
    Enum as SQLEnum,
    ForeignKey,
    Float,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum
import uuid

from app.core.database import Base


class BookingStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    COMPLETED = "completed"
    CANCELED = "canceled"
    DECLINED = "declined"
    CANCELED_BY_CUSTOMER = "canceled_by_customer"  # new
    CANCELED_BY_PROVIDER = "canceled_by_provider"  # new


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    provider_id = Column(
        UUID(as_uuid=True), ForeignKey("providers.provider_id"), nullable=False
    )
    service_type = Column(String, nullable=False)
    status = Column(SQLEnum(BookingStatus), default=BookingStatus.PENDING)
    date_time = Column(DateTime(timezone=True), nullable=False)
    special_instructions = Column(Text)
    estimated_price = Column(Float)
    final_price = Column(Float)

    cancellation_reason = Column(Text)
    canceled_by = Column(String)
    canceled_at = Column(DateTime(timezone=True))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    customer = relationship("User", foreign_keys=[customer_id])
    provider = relationship("Provider", foreign_keys=[provider_id])
