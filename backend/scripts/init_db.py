#!/usr/bin/env python3
"""
Initialize database with sample data for development
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import sessionmaker
from app.core.database import engine, Base
from app.models.user import User
from app.models.provider import Provider
from app.models.service import ServiceCategory
from app.core.security import get_password_hash
from app.services.cache import cache


SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(bind=engine)

cache.redis_client.flushdb()


def init_sample_data():
    db = SessionLocal()

    try:
        # Create admin user
        admin = User(
            name="Admin",
            email="homeheroappsynape@gmail.com",
            phone="8600980846",
            user_type="admin",
            location="System",
            hashed_password=get_password_hash("admin123"),  # Add this line
            is_active=True,
            is_verified=True,
        )
        db.add(admin)

        # Create sample customer
        customer = User(
            name="John Customer",
            email="customer@example.com",
            phone="1234567890",
            user_type="customer",
            location="Mumbai",
            pincode="400001",
        )
        db.add(customer)

        # Create sample provider user
        provider_user = User(
            name="Mike Plumber",
            email="mike@example.com",
            phone="0987654321",
            user_type="provider",
            location="Mumbai",
            pincode="400001",
        )
        db.add(provider_user)
        db.flush()  # Get the ID

        # Create provider profile
        provider = Provider(
            user_id=provider_user.id,
            services=["plumber", "water_heater_repair"],
            pricing=500.0,
            availability=True,
            approved=True,
            experience_years=5,
            service_radius=15.0,
        )
        db.add(provider)

        # Create service categories
        categories = [
            ServiceCategory(
                name="plumber",
                description="Plumbing services including pipe repair, installation",
                keywords=["plumber", "pipe", "water", "leak", "tap", "geyser"],
            ),
            ServiceCategory(
                name="electrician",
                description="Electrical services and repairs",
                keywords=["electrician", "wiring", "light", "fan", "power"],
            ),
            ServiceCategory(
                name="carpenter",
                description="Wood work and furniture services",
                keywords=["carpenter", "wood", "furniture", "door", "cabinet"],
            ),
        ]

        for category in categories:
            db.add(category)

        db.commit()
        print("✅ Sample data initialized successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error initializing data: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    init_sample_data()
