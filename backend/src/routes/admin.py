from fastapi import APIRouter

router = APIRouter()


@router.post("/providers/{provider_id}/approve")
def approve_provider(provider_id: str):
    return {"message": f"Provider {provider_id} approved"}


@router.get("/users")
def view_users():
    return {"message": "List of all users"}
