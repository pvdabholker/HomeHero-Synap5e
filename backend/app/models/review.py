from sqlalchemy import Column, DateTime, String, Float, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(
        UUID(as_uuid=True),
        ForeignKey("bookings.booking_id"),
        unique=True,
        nullable=False,
    )
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    provider_id = Column(
        UUID(as_uuid=True), ForeignKey("providers.provider_id"), nullable=False
    )
    rating = Column(Float, nullable=False)
    comment = Column(Text)
    images = Column(ARRAY(String), default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    booking = relationship("Booking")
    customer = relationship("User", foreign_keys=[customer_id])
    provider = relationship("Provider", foreign_keys=[provider_id])
