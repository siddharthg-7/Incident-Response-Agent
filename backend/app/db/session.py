from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

Base = declarative_base()

# Async database engine (supports sqlite+aiosqlite or postgresql+asyncpg)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db():
    """Dependency that yields an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Initialize database tables and ensure all model columns exist."""
    # Ensure models are registered with Base.metadata
    from app.models.incident import IncidentModel  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        def _migrate(sync_conn):
            from sqlalchemy import text
            try:
                res = sync_conn.execute(text("PRAGMA table_info(incidents)"))
                cols = [row[1] for row in res.fetchall()]
                if cols and "analyst_assigned" not in cols:
                    sync_conn.execute(text("ALTER TABLE incidents ADD COLUMN analyst_assigned VARCHAR(128) DEFAULT 'soc_lead_analyst'"))
            except Exception:
                pass

        await conn.run_sync(_migrate)


