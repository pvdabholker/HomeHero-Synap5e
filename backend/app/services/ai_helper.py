from typing import List, Dict, Optional


# smart suggestion
class AIHelper:

    SERVICE_KEYWORDS = {
        "plumber": [
            "plumber",
            "plumbing",
            "pipe",
            "water",
            "leak",
            "tap",
            "faucet",
            "toilet",
            "geyser",
            "heater",
        ],
        "electrician": [
            "electrician",
            "electrical",
            "wiring",
            "light",
            "fan",
            "switch",
            "power",
            "electricity",
            "repair",
        ],
        "carpenter": [
            "carpenter",
            "wood",
            "furniture",
            "door",
            "window",
            "cabinet",
            "repair",
            "fix",
        ],
        "painter": [
            "painter",
            "paint",
            "wall",
            "color",
            "brush",
            "interior",
            "exterior",
        ],
        "cleaner": ["cleaning", "clean", "house", "home", "maid", "sweep", "mop"],
        "ac_technician": [
            "ac",
            "air conditioner",
            "cooling",
            "hvac",
            "refrigerator",
            "fridge",
        ],
        "gardener": ["garden", "lawn", "plants", "trees", "landscaping", "grass"],
    }

    # suggest service using keyword
    @staticmethod
    def suggest_service(query: str) -> Optional[str]:
        query_lower = query.lower()

        for service, keywords in AIHelper.SERVICE_KEYWORDS.items():
            if any(keyword in query_lower for keyword in keywords):
                return service

        return None

    # get smart suggestions based on query and location
    @staticmethod
    def get_smart_suggestions(query: str, location: Optional[str] = None) -> Dict:
        suggested_service = AIHelper.suggest_service(query)

        return {
            "suggested_service": suggested_service,
            "query": query,
            "location": location,
            "confidence": 0.8 if suggested_service else 0.0,
        }

    # get popular services
    def get_popular_services() -> List[str]:
        return list(AIHelper.SERVICE_KEYWORDS.keys())
