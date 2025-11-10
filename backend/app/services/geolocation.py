from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from typing import Tuple, Optional, List, Dict
from fastapi import HTTPException, status
import asyncio
from concurrent.futures import ThreadPoolExecutor
import re

from app.core.logging import get_logger
from app.services.cache import cache

logger = get_logger("geolocation")


# handle geolocation and distance calculations
class GeolocationService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="homehero")
        self.executor = ThreadPoolExecutor(max_workers=4)

        # Get coordinates (lat, lng) for an address

    async def get_coordinates(self, address: str) -> Optional[Tuple[float, float]]:
        # check cache first
        cache_key = f"geocode:{address}"
        cached_coords = cache.get(cache_key)
        if cached_coords:
            return cached_coords

        try:
            # run geocoding in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            location = await loop.run_in_executor(
                self.executor, self.geolocator.geocode, address
            )

            if location:
                coords = (location.latitude, location.longitude)
                # cache for 24 hours
                cache.set(cache_key, coords, ttl=86400)
                return coords

            return None

        except Exception as e:
            logger.error(f"Geocoding failed", address=address, error=str(e))
            return None

    # Calculate distance between two coordinates in kilometers
    def calculate_distance(
        self, coords1: Tuple[float, float], coords2: Tuple[float, float]
    ) -> float:
        try:
            distance = geodesic(coords1, coords2).kilometers
            return round(distance, 2)
        except Exception as e:
            logger.error(f"Distance calculation failed", error=str(e))
            return float("inf")

    # find providers within specified distance
    async def find_nearby_providers(
        self,
        customer_location: str,
        providers: List[Dict],
        max_distance_km: float = 25.0,
    ) -> List[Dict]:
        customer_coords = await self.get_coordinates(customer_location)
        if not customer_coords:
            logger.warning(
                f"Could not geocode customer location", location=customer_location
            )

            return providers

        nearby_providers = []

        for provider in providers:
            provider_location = provider.get("location")
            if not provider_location:
                continue

            provider_coords = await self.get_coordinates(provider_location)
            if not provider_coords:
                continue

            distance = self.calculate_distance(customer_coords, provider_coords)

            if distance <= max_distance_km:
                provider["distance_km"] = distance
                nearby_providers.append(provider)

        # sort by distance
        nearby_providers.sort(key=lambda x: x.get("distance_km", float("inf")))

        return nearby_providers

    # get approximate coverage area for a provider
    async def get_service_radius_coverage(
        self, provider_location: str, service_radius_km: float
    ) -> Optional[Dict]:

        coords = await self.get_coordinates(provider_location)
        if not coords:
            return None

        return {
            "center_lat": coords[0],
            "center_lng": coords[1],
            "radius_km": service_radius_km,
            "coverage_area": f"{service_radius_km} km radius from {provider_location}",
        }

    # create searchable location string for Goa, India
    @staticmethod
    def parse_goa_pincode_location(pincode: str, city: str = "") -> str:
        if not pincode or not pincode.isdigit() or len(pincode) != 6:
            return city or ""

        # Goa pincode mapping
        pincode_regions = {
            (403001, 403199): "Panaji, North Goa, Goa, India",
            (403200, 403299): "Mapusa, North Goa, Goa, India",
            (403300, 403399): "Bicholim, Pernem, North Goa, Goa, India",
            (403400, 403499): "Vasco da Gama, Mormugao, South Goa, Goa, India",
            (403500, 403599): "Margao, Salcete, South Goa, Goa, India",
            (403600, 403699): "Quepem, Canacona, South Goa, Goa, India",
            (403700, 403799): "Ponda, Dharbandora, Goa, India",
            (403800, 403899): "Sanguem, Curchorem, South Goa, Goa, India",
            (403900, 403999): "Other Regions, Goa, India",
        }

        pincode_int = int(pincode)
        for (start, end), region in pincode_regions.items():
            if start <= pincode_int <= end:
                return f"{city}, {region}" if city else region

        return f"{city}, {pincode}, Goa, India" if city else f"{pincode}, Goa, India"


# instance
geo_service = GeolocationService()
