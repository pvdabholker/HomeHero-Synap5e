# backend/scripts/render_startup.py
from app.core.config import settings  # absolute import


def wait_for_db():
    # Dummy implementation, replace with actual DB check if needed
    return True


def initialize_render_db():
    """Initialize database for Render deployment"""
    print("🚀 Initializing HomeHero database on Render...")

    try:
        if not wait_for_db():
            print("❌ Database not ready.")
            return False

        print("📋 Running database migrations...")
        from alembic.config import Config
        from alembic import command

        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        command.upgrade(alembic_cfg, "head")
        print("✅ Migrations completed!")

        return True

    except Exception as e:
        print(f"💥 Error during initialization: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    initialize_render_db()
