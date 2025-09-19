#!/usr/bin/env python3
import sys
import os

# Load .env before any app imports
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

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


def run_migrations():
    """Run database migrations"""
    print("🔄 Running database migrations...")
    try:
        from alembic.config import Config
        from alembic import command
        from app.core.config import settings
        
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        
        # Run migrations to head
        command.upgrade(alembic_cfg, "head")
        print("✅ Database migrations completed!")
        return True
        
    except Exception as e:
        print(f"⚠️  Migration failed: {e}")
        # For now, continue even if migrations fail
        return False


def add_missing_columns_manually():
    """Manually add missing columns if migrations fail"""
    print("🔧 Manually adding missing booking columns...")
    try:
        from app.core.database import engine
        from sqlalchemy import text
        
        with engine.connect() as connection:
            # Check if columns exist, if not add them
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='bookings' AND column_name IN ('cancellation_reason', 'canceled_by', 'canceled_at')
            """))
            
            existing_columns = [row[0] for row in result]
            
            if 'cancellation_reason' not in existing_columns:
                connection.execute(text("ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT"))
                print("➕ Added cancellation_reason column")
            
            if 'canceled_by' not in existing_columns:
                connection.execute(text("ALTER TABLE bookings ADD COLUMN canceled_by VARCHAR"))
                print("➕ Added canceled_by column")
            
            if 'canceled_at' not in existing_columns:
                connection.execute(text("ALTER TABLE bookings ADD COLUMN canceled_at TIMESTAMP WITH TIME ZONE"))
                print("➕ Added canceled_at column")
            
            connection.commit()
            print("✅ Missing columns added successfully!")
            return True
            
    except Exception as e:
        print(f"❌ Failed to add columns manually: {e}")
        return False


def initialize_render_db():
    """Initialize database for Render deployment"""
    print("🚀 Initializing HomeHero database on Render...")
    
    try:
        # Wait for database to be ready
        if not wait_for_db():
            return False
        
        # Try running migrations first
        migration_success = run_migrations()
        
        # If migrations fail, try manual column addition
        if not migration_success:
            print("🔧 Attempting manual column addition...")
            add_missing_columns_manually()
        
        # Import after database is ready
        from app.core.database import engine, Base
        from scripts.create_dummy_data import create_dummy_data
        
        # Create all tables (this will create new tables but won't modify existing ones)
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