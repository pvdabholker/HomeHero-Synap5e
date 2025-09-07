import redis
import json
from typing import Any, Optional, Union
from datetime import timedelta
import pickle

from app.core.config import settings

# Redis based caching service
class CacheService:
    def __init__(self):
        self.redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=False)
        self.default_ttl = 3600 # 1 hr
        
    # set value in cache
    def set(
        self,
        key:str,
        value:Any,
        ttl: Optional[Union[int, timedelta]] = None
    ) -> bool:
        try:
            if ttl is None:
                ttl = self.default_ttl
            elif isinstance(ttl, timedelta):
                ttl = int(ttl.total_seconds())
                
            serialized_value = pickle.dumps(value)
            
            return self.redis_client.setex(key, ttl, serialized_value)
        except Exception:
            return False
        
    # get a value from cache
    def get(self, key:str) -> Optional[Any]:
        try:
            cached_value = self.redis_client.get(key)
            if cached_value is None:
                return None
            
            return pickle.loads(cached_value)
        except Exception:
            return None
        
    # delete a key from cache
    def delete(self, key:str)->bool:
        try:
            return bool(self.redis_client.delete(key))
        except Exception:
            return False
        
    # check if key exists in cache
    def exists(self, key: str)-> bool:
        try:
            return bool(self.redis_client.exists(key))
        except Exception:
            return False
    
    # set JSON value in cache
    def set_json(self, key:str, value:dict, ttl: Optional[int]=None)-> bool:
        try:
            if ttl is None:
                ttl = self.default_ttl
                
            json_value = json.dumps(value)
            return self.redis_client.setex(key, ttl, json_value)
        except Exception:
            return False
        
    # get json value from cache
    def get_json(self, key:str)->Optional[dict]:
        try:
            cached_value = self.redis_client.get(key)
            if cached_value is None:
                return None
            
            return json.load(cached_value.decode()) 
        except Exception:
            return None
        
    
    # invalid all keys matching pattern
    def invalidate_pattern(self, pattern:str)->int:
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception:
            return 0


# cache instance
cache = CacheService()
    