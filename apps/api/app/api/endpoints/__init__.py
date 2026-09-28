from app.api.endpoints.health import router as health_router
from app.api.endpoints.incidents import router as incidents_router

__all__ = ["health_router", "incidents_router"]
