import subprocess
import sys
import os
from pathlib import Path


# Run shell command with error handling
def run_command(command, description):
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(
            command, shell=True, check=True, capture_output=True, text=True
        )
        print(f"✅ {description} completed")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed")
        print(f"Error: {e.stderr}")
        return False


# Deploy to production
def deploy_production():

    print("🚀 Starting HomeHero API Production Deployment")

    # Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        return False

    # Run database migrations
    if not run_command("alembic upgrade head", "Running database migrations"):
        return False

    # Run tests
    if not run_command("pytest tests/ -v", "Running tests"):
        print("⚠️ Tests failed, but continuing deployment")

    # Start production server
    print("🔥 Starting production server with Gunicorn")
    gunicorn_cmd = (
        "gunicorn app.main:app "
        "-w 4 "
        "-k uvicorn.workers.UvicornWorker "
        "-b 0.0.0.0:8000 "
        "--access-logfile - "
        "--error-logfile - "
        "--log-level info"
    )

    os.system(gunicorn_cmd)


if __name__ == "__main__":
    deploy_production()
