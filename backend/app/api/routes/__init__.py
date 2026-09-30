from app.api.routes.health import router as health_router
from app.api.routes.incidents import router as incidents_router
from app.api.routes.memory import router as memory_router
from app.api.routes.demo import router as demo_router

__all__ = ["health_router", "incidents_router", "memory_router", "demo_router"]

