#!/usr/bin/env python3
"""
Run database migrations
"""

import subprocess
import sys
import os


def run_command(command):
    try:
        result = subprocess.run(
            command, shell=True, check=True, capture_output=True, text=True
        )
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"Output: {e.stdout}")
        print(f"Error: {e.stderr}")
        return False


def main():
    print("🔄 Running database migrations...")

    # Create migration if needed
    if len(sys.argv) > 1 and sys.argv[1] == "create":
        message = input("Enter migration message: ")
        if run_command(f'alembic revision --autogenerate -m "{message}"'):
            print("✅ Migration created successfully!")
        else:
            print("❌ Failed to create migration")
            return

    # Run migrations
    if run_command("alembic upgrade head"):
        print("✅ Migrations applied successfully!")
    else:
        print("❌ Failed to apply migrations")


if __name__ == "__main__":
    main()
