import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db, Base
from app.models.user import User
from app.models.provider import Provider

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)
    
@pytest.fixture
def sample_customer(db_session):
    user = User(
        name="John Doe",
        email="john@example.com",
        phone="1234567890",
        user_type="customer",
        location="Test City"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def sample_provider_user(db_session):
    user = User(
        name="Jane Smith",
        email="jane@example.com",
        phone="0987654321",
        user_type="provider",
        location="Test City"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def sample_provider(db_session, sample_provider_user):
    provider = Provider(
        user_id=sample_provider_user.id,
        services=["plumber"],
        pricing=500.0,
        availability=True,
        approved=True
    )
    db_session.add(provider)
    db_session.commit()
    db_session.refresh(provider)
    return provider
