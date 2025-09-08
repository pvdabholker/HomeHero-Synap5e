from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException, status
import redis
from typing import Callable
import asyncio

from app.core.config import settings

# initialize redis connection for rate limiting
redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)

# limiter = Limiter(
#     key_func=get_remote_address,
#     storage_uri=settings.REDIS_URL,
#     default_limits=[f"{settings.RATE_LIMIT_REQUESTS}/hour"],
# )

limiter = Limiter(
    key_func=lambda: "global",  # Simple key
    default_limits=["1000/hour"],  # High limit
    storage_uri="memory://",  # Use memory instead of Redis
)


# custom rate limit exceeded handler
def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    response = HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail={
            "error": "Rate Limit Exceeded",
            "message": f"Too many requests, try again in {exc.retry_after} seconds",
            "retry_after": exc.retry_after,
        },
    )

    return response


# Custom rate limiters for different endpoints
class CustomRateLimits:
    # strict rate limiting for auth endpoints
    @staticmethod
    def auth_endpoints():
        return "5/minute"

    # rate limiting for search enpoints
    @staticmethod
    def search_endpoints():
        return "30/minute"

    # rate limiting for booking creation
    @staticmethod
    def booking_endpoints():
        return "10/minute"

    # rate limiting for review submission
    @staticmethod
    def review_endpoints():
        return "5/minute"
