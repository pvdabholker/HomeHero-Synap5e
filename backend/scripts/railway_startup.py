#!/usr/bin/env python3
"""
Railway startup script - runs after deployment
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from sqlalchemy.orm import sessionmaker
from app.core.database import engine, Base
from scripts.create_dummy_data import create_dummy_data


def initialize_production():
    """Initialize production database"""
    print("🚀 Initializing HomeHero production database...")
    
    try:
        # Create all tables
        print("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Create dummy data
        print("🏠 Creating dummy data for Goa...")
        success = create_dummy_data()
        
        if success:
            print("✅ Production initialization completed!")
            return True
        else:
            print("❌ Failed to create dummy data")
            return False
            
    except Exception as e:
        print(f"💥 Error during initialization: {e}")
        return False


if __name__ == "__main__":
    success = initialize_production()
    sys.exit(0 if success else 1)