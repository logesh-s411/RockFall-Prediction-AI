from contextlib import asynccontextmanager
from datetime import datetime, timezone
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.api import api_router

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("rockfall.main")

# Auto-initialize database tables immediately
init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure initialized on lifespan entry
    logger.info("Initializing database and verifying tables...")
    init_db()
    logger.info("Rockfall Risk AI System Backend Ready!")
    logger.info("Configured CORS Allowed Origins: %s", settings.CORS_ORIGINS)
    yield
    logger.info("Shutting down Rockfall Risk Backend...")
    try:
        from app.services.simulation_service import simulation_service
        simulation_service.pause()
    except Exception:
        pass


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multi-Modal Rockfall Risk Prediction and Early Warning System Prototype (Student / Hackathon Project)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")


@app.get("/health", tags=["System Health"])
def health_check():
    """System health check endpoint for monitoring uptime and readiness."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "demo_mode": True,
        "disclaimer": "PROTOTYPE SYSTEM: Uses synthetic/simulated multi-modal sensor streams for software evaluation."
    }


@app.get("/", tags=["System Health"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs",
        "health_check": "/health",
        "api_prefix": "/api"
    }
