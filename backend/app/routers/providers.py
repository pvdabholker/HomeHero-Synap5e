from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
    Query,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_provider
from app.core.rate_limiter import limiter, CustomRateLimits
from app.core.logging import get_logger
from app.schemas.provider import (
    ProviderResponse,
    ProviderCreate,
    PricingUpdate,
    PricingUpdate,
    AvailabilityUpdate,
    ProviderWithUser,
    ProviderUpdate,
)
from app.controllers.provider import ProviderController
from app.models.user import User
from app.services.ai_helper import AIHelper
from app.services.file_upload import FileUploadService
from app.services.cache import cache


router = APIRouter()
file_service = FileUploadService()
logger = get_logger("providers")


# enhanced provider search with geolocation, filtering and sorting
@router.get("/search", response_model=List[ProviderWithUser])
@limiter.limit(CustomRateLimits.search_endpoints())
async def enhanced_provider_search(
    request: Request,
    service: Optional[str] = Query(None, description="Service type to filter by"),
    location: Optional[str] = Query(None, description="Location to search near"),
    max_distance: Optional[float] = Query(
        25.0, ge=1, le=100, description="Maximum distance in km"
    ),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    available_only: bool = Query(True, description="Show only available providers"),
    sort_by: str = Query("distance", description="Sort by: distance, rating, price"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    db: Session = Depends(get_db),
):
    try:
        providers = await ProviderController.search_providers_with_location(
            db=db,
            service=service,
            location=location,
            min_rating=min_rating,
            max_distance_km=max_distance,
            available_only=available_only,
            skip=skip,
            limit=limit,
        )

        # Handle None return value
        if providers is None:
            logger.warning("Provider search returned None, returning empty list")
            return []

        # Ensure providers is a list
        if not isinstance(providers, list):
            logger.warning(f"Provider search returned unexpected type: {type(providers)}")
            return []

        if max_price:
            providers = [p for p in providers if p.pricing and p.pricing <= max_price]

        if sort_by == "rating":
            providers.sort(key=lambda x: x.rating or 0, reverse=True)
        elif sort_by == "price":
            providers.sort(key=lambda x: x.pricing or float('inf'))
        elif sort_by == "distance" and location:
            providers.sort(key=lambda x: getattr(x, "distance_km", float("inf")))

        return providers

    except Exception as e:
        logger.error("Provider search failed", error=str(e))
        # Return empty list instead of raising exception
        return []


# upload portfolio images for provider
@router.post("/portfolio", response_model=dict)
@limiter.limit("10/minute")
async def upload_provider_portfolio(
    request: Request,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_provider),
    db: Session = Depends(get_db),
):
    try:
        # upload multiple images
        uploaded_files = await file_service.upload_multiple_images(
            files=files, folder="homehero/portfolios", max_files=10
        )

        # update provider with portfolio urls
        provider = ProviderController.get_provider_by_user(db, str(current_user.id))
        portfolio_urls = [file["url"] for file in uploaded_files]

        # Add existing portfolio
        existing_portfolio = provider.documents or []
        updated_portfolio = existing_portfolio + portfolio_urls

        ProviderController.update_provider(
            db, str(provider.provider_id), ProviderUpdate(documents=updated_portfolio)
        )

        return {
            "message": f"Uploaded {len(uploaded_files)} images successfully",
            "uploaded_files": uploaded_files,
            "total_portfolio_images": len(updated_portfolio),
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Portfolio upload failed: {str(e)}",
        )


# create provider profile
@router.post("/", response_model=ProviderResponse)
async def create_provider_profile(
    provider_data: ProviderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.user_type != "provider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only provider accounts can create provider profiles",
        )

    return ProviderController.create_provider(db, provider_data, str(current_user.id))


# Search providers by service and location
@router.get("/", response_model=List[ProviderWithUser])
async def search_providers(
    service: Optional[str] = Query(None, description="Service type to filter by"),
    location: Optional[str] = Query(None, description="Location to filter by"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    available_only: bool = Query(True, description="Show only available providers"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of records to return"),
    db: Session = Depends(get_db),
):
    providers = ProviderController.search_provider(
        db, service, location, min_rating, available_only, skip, limit
    )

    return providers


# current user's provider profile
@router.get("/me", response_model=ProviderResponse)
async def get_my_provider_profile(
    current_user: User = Depends(get_current_provider), db: Session = Depends(get_db)
):
    return ProviderController.get_provider_by_user(db, str(current_user.id))


# Update current user's provider profile
@router.put("/me", response_model=ProviderResponse)
async def update_my_provider_profile(
    provider_data: ProviderUpdate,
    current_user: User = Depends(get_current_provider),
    db: Session = Depends(get_db),
):
    provider = ProviderController.get_provider_by_user(db, str(current_user.id))
    return ProviderController.update_provider(
        db, str(provider.provider_id), provider_data
    )


# get provider profile using id
@router.get("/{provider_id}", response_model=ProviderWithUser)
async def get_provider_profile(provider_id: str, db: Session = Depends(get_db)):
    return ProviderController.get_provider(db, provider_id)


# update service pricing
@router.put("/pricing", response_model=dict)
async def update_pricing(
    pricing_data: PricingUpdate,
    current_user: User = Depends(get_current_provider),
    db: Session = Depends(get_db),
):
    provider = ProviderController.get_provider_by_user(db, str(current_user.id))
    ProviderController.update_provider(
        db, str(provider.provider_id), ProviderUpdate(pricing=pricing_data.pricing)
    )
    return {"message": "Pricing updated"}


# toggle provider avaibility
@router.put("/availability", response_model=dict)
async def update_availability(
    availability_data: AvailabilityUpdate,
    current_user: User = Depends(get_current_provider),
    db: Session = Depends(get_db),
):
    provider = ProviderController.get_provider_by_user(db, str(current_user.id))
    ProviderController.update_provider(
        db,
        str(provider.provider_id),
        ProviderUpdate(availability=availability_data.available),
    )
    return {"message": "Availability updated"}


# service suggestions
@router.get("/suggest/{query}")
async def get_service_suggestions(query: str):
    suggestions = AIHelper.get_smart_suggestions(query)
    return suggestions
