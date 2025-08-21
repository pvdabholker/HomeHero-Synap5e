from fastapi import FastAPI
from .database import engine
from . import models
from .routes import customers, providers, admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(customers.router, prefix="/api", tags=["customer"])
app.include_router(providers.router, prefix="/api", tags=["provider"])
app.include_router(admin.router, prefix="/api", tags=["admin"])


@app.get("/")
def read_root():
    return {"message": "Welcome to HomeHero API"}
