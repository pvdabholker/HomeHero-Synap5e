from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, ARRAY, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    # user roles
    user_type = Column(String, nullable=False, default="customer")

    # Locations -> Tailored for Goa, India
    address_line = Column(String, nullable=True)
    city = Column(String, nullable=True)
    pincode = Column(String, index=True, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    provider = relationship(
        "Provider", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class Provider(Base):
    __tablename__ = "providers"
    provider_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    services = Column(ARRAY(String))
    pricing = Column(Float)
    availability = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    documents = Column(ARRAY(String), nullable=True)
    approved = Column(Boolean, default=False)
    user = relationship("User", back_populates="provider")


class Booking(Base):
    __tablename__ = "bookings"
    booking_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    provider_id = Column(UUID(as_uuid=True), ForeignKey("providers.provider_id"))
    service_type = Column(String)
    status = Column(String, default="pending")
    date_time = Column(DateTime)
    special_instructions = Column(String, nullable=True)
    created_at = Column(DateTime)


class Review(Base):
    __tablename__ = "reviews"
    review_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.booking_id"))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    provider_id = Column(UUID(as_uuid=True), ForeignKey("providers.provider_id"))
    rating = Column(Float)
    comment = Column(String, nullable=True)
    images = Column(ARRAY(String), nullable=True)
