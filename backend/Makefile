.PHONY: help install dev test clean docker-build docker-run migrate init-db

# Default target
help:
	@echo "Available commands:"
	@echo "  install     Install dependencies"
	@echo "  dev         Run development server"
	@echo "  test        Run tests"
	@echo "  clean       Clean cache files"
	@echo "  docker-build Build Docker image"
	@echo "  docker-run  Run with Docker Compose"
	@echo "  migrate     Run database migrations"
	@echo "  init-db     Initialize database with sample data"

# Install dependencies
install:
	pip install -r requirements.txt

# Run development server
dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
test:
	pytest tests/ -v

# Clean cache files
clean:
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.pyc" -delete
	find . -type f -name ".coverage" -delete

# Docker commands
docker-build:
	docker-compose build

docker-run:
	docker-compose up --build

docker-down:
	docker-compose down

# Database commands
migrate:
	python scripts/run_migrations.py

create-migration:
	python scripts/run_migrations.py create

init-db:
	python scripts/init_db.py

# Production deployment
deploy-prod:
	@echo "Deploying to production..."
	@echo "Make sure to:"
	@echo "1. Set production environment variables"
	@echo "2. Run migrations: make migrate"
	@echo "3. Use production WSGI server"

# Health check
health:
	curl -f http://localhost:8000/api/health || exit 1
"""
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9
pydantic==2.5.0
pydantic-settings==2.1.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
