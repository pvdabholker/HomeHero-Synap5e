from functools import wraps
from typing import Callable

from app.services.cache import cache


def cached(ttl: int = 3600, key_prefix: str = ""):
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"

            cached_result = cache.get(cache_key)
            if cached_result is not None:
                return cached_result

            result = await func(*args, **kwargs)
            cache.set(cache_key, result, ttl)

            return result

        return wrapper

    return decorator
