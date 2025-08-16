from fastapi import APIRouter

router = APIRouter()


@router.get("/services")
def browse_services():
    return {"message": "List of available services"}


@router.get("/providers")
def search_providers(service: str, location: str):
    return {"message": "Provider for service"}


@router.post("/bookings")
def book_service(provider_id: str, service_type: str):
    return {"message": "Booking created with provier"}
