#!/usr/bin/env python3
"""
Render startup script - initializes database on first deployment
"""
import sys
import os
import time

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def wait_for_db():
    """Wait for database to be ready"""
    print("⏳ Waiting for database connection...")
    import psycopg2
    from app.core.config import settings
    
    max_retries = 30
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Try to connect to database
            conn = psycopg2.connect(settings.DATABASE_URL)
            conn.close()
            print("✅ Database connection established!")
            return True
        except Exception as e:
            retry_count += 1
            print(f"🔄 Database not ready yet (attempt {retry_count}/{max_retries})")
            time.sleep(2)
    
    print("❌ Could not connect to database after 30 attempts")
    return False


def initialize_render_db():
    """Initialize database for Render deployment"""
    print("🚀 Initializing HomeHero database on Render...")
    
    try:
        # Wait for database to be ready
        if not wait_for_db():
            return False
        
        # Import after database is ready
        from app.core.database import engine, Base
        from scripts.create_dummy_data import create_dummy_data
        
        # Create all tables
        print("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Check if data already exists
        from app.core.database import SessionLocal
        from app.models.user import User
        
        db = SessionLocal()
        existing_users = db.query(User).count()
        db.close()
        
        if existing_users == 0:
            # Create dummy data only if database is empty
            print("🏠 Creating dummy data for Goa...")
            success = create_dummy_data()
            
            if success:
                print("✅ Database initialization completed!")
                return True
            else:
                print("❌ Failed to create dummy data")
                return False
        else:
            print(f"📊 Database already has {existing_users} users - skipping dummy data creation")
            return True
            
    except Exception as e:
        print(f"💥 Error during initialization: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = initialize_render_db()
    if success:
        print("🎉 Ready to start FastAPI server!")
    else:
        print("⚠️  Database initialization failed, but continuing...")
    
    # Always exit with success code to allow server to start
    sys.exit(0)