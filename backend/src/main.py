from fastapi import FastAPI
from src.routes import auth, customers, providers, admin

app = FastAPI(
    title="HomeHero", description="API documentation for HomeHero", version="1.0.0"
)

# Register routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(providers.router, prefix="/api", tags=["Customers"])
app.include_router(providers.router, prefix="/api/provider", tags=["Providers"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/")
def root():
    return {"message": "Welcome to HomeHero App"}
