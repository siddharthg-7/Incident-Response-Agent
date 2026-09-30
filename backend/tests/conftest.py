import asyncio
import os
import sys
from pathlib import Path

# Ensure backend is in Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.config import settings
from app.db.session import Base, get_db
from app.models.incident import IncidentModel  # Ensure tables registered in Base.metadata
from app.main import app
from app.hindsight.mock_adapter import MockHindsightAdapter
from app.hindsight.service import HindsightService, get_hindsight_service

# Dedicated test database file guaranteeing async transaction isolation across thread boundaries
TEST_DB_FILE = Path(__file__).parent / "test_suite.db"
TEST_DATABASE_URL = f"sqlite+aiosqlite:///{TEST_DB_FILE.as_posix()}"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False
)
TestingSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)




@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True)
async def prepare_database():
    """Create all tables before each test and drop them afterward."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
def mock_hindsight():
    """Provides a fresh isolated mock Hindsight service."""
    adapter = MockHindsightAdapter()
    service = HindsightService(adapter=adapter)
    return service


@pytest.fixture
async def client(mock_hindsight):
    """Provides an async test client with overridden DB and Hindsight dependencies."""
    async def override_get_db():
        async with TestingSessionLocal() as session:
            yield session

    # Override get_db dependency
    app.dependency_overrides[get_db] = override_get_db
    
    # Override global Hindsight service
    import app.hindsight.service as hs_module
    old_service = hs_module._default_hindsight_service
    hs_module._default_hindsight_service = mock_hindsight

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    # Clean up overrides
    app.dependency_overrides.clear()
    hs_module._default_hindsight_service = old_service


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_database():
    yield
    # Safely remove test sqlite file after entire test run
    if TEST_DB_FILE.exists():
        try:
            TEST_DB_FILE.unlink(missing_ok=True)
        except Exception:
            pass

