# For dummy data

from sqlalchemy.orm import sessionmaker
from src.database import engine
from src import models
import uuid
from datetime import datetime

Session = sessionmaker(bind=engine)
session = Session()

# Create 10 dummy users
for i in range(10):
    user = models.User(
        id=uuid.uuid4(),
        name=f"Customer {i+1}",
        email=f"customer{i+1}@example.com",
        phone=f"12345678{i:02d}",
        user_type="customer",
        created_at=datetime.utcnow()
    )
    session.add(user)

# Create 10 dummy service providers
for i in range(10):
    user = models.User(
        id=uuid.uuid4(),
        name=f"Provider {i+1}",
        email=f"provider{i+1}@example.com",
        phone=f"98765432{i:02d}",
        user_type="provider",
        created_at=datetime.utcnow()
    )
    session.add(user)
    session.commit()

    provider = models.Provider(
        provider_id=uuid.uuid4(),
        user_id=user.id,
        services=["Plumbing", "Electrical"],
        pricing=50.0 + i,
        availability=True,
        rating=4.5,
        approved=True
    )
    session.add(provider)

session.commit()
session.close()

print("Dummy data has been created successfully!")