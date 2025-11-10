from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.services.ai_helper import AIHelper

router = APIRouter()


# get all services
@router.get("/", response_model=List[dict])
async def get_services():
    services = AIHelper.get_popular_services()
    return [{"name": service.replace("-", " ").title()} for service in services]


# get all service categories
@router.get("/categories", response_model=List[str])
async def get_service_categories():
    return AIHelper.get_popular_services()


# get service suggestions based on query
router.get("/suggest/{query}")


async def suggest_service(query: str):
    suggestion = AIHelper.suggest_service(query)
    return {
        "query": query,
        "suggested_service": suggestion,
        "confidence": 0.8 if suggestion else 0.0,
    }
