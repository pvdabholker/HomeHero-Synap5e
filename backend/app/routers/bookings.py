from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import (
    get_current_user,
    get_current_customer,
    get_current_provider,
)
from app.schemas.booking import (
    BookingResponse,
    BookingCreate,
    BookingStatusUpdate,
    CallbackRequest,
)
from app.controllers.booking import BookingController
from app.controllers.provider import ProviderController
from app.models.user import User
from app.models.booking import BookingStatus

router = APIRouter()


# create a new booking
@router.post("/", response_model=dict)
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    booking = BookingController.create_booking(db, booking_data, str(current_user.id))
    return {"message": "Booking confirmed", "booking_id": str(booking.booking_id)}


# get current user bookings
@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    if current_user.user_type == "customer":
        return BookingController.get_customer_bookings(db, str(current_user.id))
    else:
        provider = ProviderController.get_provider_by_user(db, str(current_user.id))
        return BookingController.get_provider_bookings(db, str(provider.provider_id))


# get booking status
@router.get("/{booking_id}/status", response_model=dict)
async def get_booking_status(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = BookingController.get_booking(db, booking_id)

    # verify user has access to this booking
    if (
        str(current_user.id) != str(booking.customer_id)
        and current_user.user_type != "admin"
    ):
        if current_user.user_type == "provider":
            provider = ProviderController.get_provider_by_user(db, str(current_user.id))
            if str(provider.provider_id) != str(booking.provider_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
            )

    return {"status": booking.status}


# get booking details
@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = BookingController.get_booking(db, booking_id)

    # verify acess
    if (
        str(current_user.id) != str(booking.customer_id)
        and current_user.user_type != "admin"
    ):
        if current_user.user_type == "provider":
            provider = ProviderController.get_provider_by_user(db, str(current_user.id))
            if str(provider.provider_id) != str(booking.provider_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
            )

    return booking


# send callback request to provider
@router.post("/requests/callback", response_model=dict)
async def request_callback(
    callback_data: CallbackRequest,
    current_user: User = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    # TODO: Implement callback request logic (e.g., send notification)
    return {"message": "Callback request sent"}


# get pending bookings for current provider
@router.get("/provider/pending", response_model=List[BookingResponse])
async def get_pending_bookings(
    current_user: User = Depends(get_current_provider), db: Session = Depends(get_db)
):
    provider = ProviderController.get_provider_by_user(db, str(current_user.id))
    return BookingController.get_pending_bookings(db, str(provider.provider_id))


# accept or decline booking request
@router.post("/{booking_id}/respond", response_model=dict)
async def respond_to_booking(
    booking_id: str,
    status_data: BookingStatusUpdate,
    current_user: User = Depends(get_current_provider),
    db: Session = Depends(get_db),
):
    booking = BookingController.get_booking(db, booking_id)
    provider = ProviderController.get_provider_by_user(db, str(current_user.id))

    # verify if booking belongs to current provider
    if str(booking.provider_id) != str(provider.provider_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Access denied"
        )

    # only allow certain status transitions
    if status_data.status not in [BookingStatus.ACCEPTED, BookingStatus.DECLINED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status. Only 'accepted' or 'declined' allowed",
        )

    BookingController.update_booking_status(db, booking_id, status_data.status)
    return {"message": "Booking updated"}
