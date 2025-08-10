from fastapi import APIRouter

router = APIRouter()


@router.put("/profile")
def update_profile():
    return {"message": "Provider profile updated"}


@router.get("/bookings")
def view_bookings():
    return {"message": "List of provider bookings"}
