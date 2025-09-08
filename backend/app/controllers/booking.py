from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from datetime import datetime

from app.models.booking import Booking, BookingStatus
from app.schemas.booking import BookingCreate, BookingUpdate


class BookingController:
    # create new booking
    @staticmethod
    def create_booking(
        db: Session, booking_data: BookingCreate, customer_id: str
    ) -> Booking:
        booking = Booking(**booking_data.model_dump(), customer_id=customer_id)
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking

    # get booking using booking id
    @staticmethod
    def get_booking(db: Session, booking_id: str) -> Booking:
        booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
            )
        return booking

    # update booking status
    @staticmethod
    def update_booking_status(
        db: Session, booking_id: str, status: BookingStatus
    ) -> Booking:
        booking = BookingController.get_booking(db, booking_id)
        booking.status = status
        db.commit()
        db.refresh(booking)
        return booking

    # get customer bookings
    @staticmethod
    def get_customer_bookings(db: Session, customer_id: str) -> List[Booking]:
        return db.query(Booking).filter(Booking.customer_id == customer_id).all()

    # get provider bookings
    @staticmethod
    def get_provider_bookings(db: Session, provider_id: str) -> List[Booking]:
        return db.query(Booking).filter(Booking.provider_id == provider_id).all()

    # get pending bookings
    @staticmethod
    def get_pending_bookings(db: Session, provider_id: str) -> List[Booking]:
        return (
            db.query(Booking)
            .filter(
                Booking.provider_id == provider_id,
                Booking.status == BookingStatus.PENDING,
            )
            .all()
        )
