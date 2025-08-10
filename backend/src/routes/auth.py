from fastapi import APIRouter
from src import data
import uuid

router = APIRouter()


@router.post("/register")
def register_user(name: str, email: str, phone: str, user_type: str):
    new_user = {
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "phone": phone,
        "user_type": user_type,
        "created_at": "2025-08-10",
    }

    data.users.append(new_user)

    return {"message": "Registerd successfully", "user_id": new_user["id"]}


@router.post("/login")
def login_user(email_or_phone: str, password: str):
    # Skipped auth part will be adding in the future

    return {"accss_token": "dummy_token", "token_type": "Bearer"}
