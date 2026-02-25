import logging

from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError

from app.config import get_settings

logger = logging.getLogger(__name__)

_settings = get_settings()

# echo=True only in non-production environments — avoids leaking query data in prod logs
_echo_sql = _settings.environment != "production"

engine = create_async_engine(
    _settings.database_url,
    echo=_echo_sql,
    future=True,
    # Pool settings tuned for Neon serverless (short-lived connections)
    pool_pre_ping=True,         # verify connection is alive before use
    pool_recycle=300,           # recycle connections after 5 minutes
)

# Session factory used by deps.py
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_async_session():
    """Async generator yielding a database session (used by auth routes directly)."""
    async with AsyncSession(engine) as session:
        yield session


async def init_db():
    """Create all database tables on startup. Crashes the process on failure."""
    from app.models.user import User  # noqa: F401
    from app.models.task import Task  # noqa: F401
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Database tables created/verified successfully")
    except SQLAlchemyError as e:
        logger.critical("FATAL: Failed to initialize database tables: %s", e)
        raise  # crash the process — do not serve requests with a broken DB
