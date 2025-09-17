from app.core.database import engine, Base
from app.core.config import settings


def wait_for_db():
    # Dummy implementation, replace with actual DB check if needed
    return True


def initialize_render_db():
    """Initialize database for Render deployment"""
    print("🚀 Initializing HomeHero database on Render...")

    try:
        # Wait for database to be ready
        if not wait_for_db():
            print("❌ Database not ready.")
            return False

        # RUN MIGRATIONS FIRST
        print("📋 Running database migrations...")
        from alembic.config import Config
        from alembic import command

        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        command.upgrade(alembic_cfg, "head")
        print("✅ Migrations completed!")

        # Then create tables (if needed, usually not required after migrations)
        # Base.metadata.create_all(bind=engine)

        # Rest of your existing code...
        # Check if data already exists, create dummy data, etc.

        return True

    except Exception as e:
        print(f"💥 Error during initialization: {e}")
        import traceback

        traceback.print_exc()
        return False
