from sqlalchemy.orm import sessionmaker
from src.database import engine
from src import models
import uuid
from datetime import datetime, timezone

Session = sessionmaker(bind=engine)
session = Session()

# Clear existing data to prevent duplicates
session.query(models.Provider).delete()
session.query(models.User).delete()
session.commit()

print("Cleared existing data.")

# --- Create 10 dummy customers with Goan locations ---
for i in range(10):
    user = models.User(
        id=uuid.uuid4(),
        name=f"Customer {i+1}",
        email=f"customer{i+1}@example.com",
        phone=f"12345678{i:02d}",
        user_type="customer",
        address_line=f"{i+1} Main Road",
        city="Margao" if i % 2 == 0 else "Panjim",
        pincode="403601" if i % 2 == 0 else "403001",
        created_at=datetime.now(timezone.utc)
    )
    session.add(user)

print("Created 10 dummy customers.")

# --- Create 10 dummy service providers with Goan locations ---
for i in range(10):
    user = models.User(
        id=uuid.uuid4(),
        name=f"Provider {i+1}",
        email=f"provider{i+1}@example.com",
        phone=f"98765432{i:02d}",
        user_type="provider",
        address_line=f"{i+1} Service Lane",
        city="Vasco" if i % 2 == 0 else "Ponda",
        pincode="403802" if i % 2 == 0 else "403401",
        created_at=datetime.now(timezone.utc)
    )
    session.add(user)
    # We need to commit the user to get the ID before creating the provider profile
    session.commit() 

    provider = models.Provider(
        provider_id=uuid.uuid4(),
        user_id=user.id,
        # We will add services and pricing later
    )
    session.add(provider)

print("Created 10 dummy providers.")

session.commit()
session.close()

print("\nDummy data has been created successfully! ✅")
