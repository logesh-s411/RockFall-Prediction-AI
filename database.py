from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes tables and seeds initial data."""
    # Import all models to register with Base.metadata
    from app.models import risk, sensor, alert, explanation  # noqa: F401
    Base.metadata.create_all(bind=engine)
    
    # Non-destructive SQLite schema migration for alerts table
    if settings.DATABASE_URL.startswith("sqlite"):
        try:
            with engine.connect() as conn:
                from sqlalchemy import text
                res = conn.execute(text("PRAGMA table_info(alerts)")).fetchall()
                existing_cols = {row[1] for row in res}
                if "risk_score" not in existing_cols:
                    conn.execute(text("ALTER TABLE alerts ADD COLUMN risk_score FLOAT DEFAULT 0.0"))
                if "risk_level" not in existing_cols:
                    conn.execute(text("ALTER TABLE alerts ADD COLUMN risk_level VARCHAR"))
                if "message" not in existing_cols:
                    conn.execute(text("ALTER TABLE alerts ADD COLUMN message VARCHAR"))
                if "acknowledged" not in existing_cols:
                    conn.execute(text("ALTER TABLE alerts ADD COLUMN acknowledged BOOLEAN DEFAULT 0"))
                if "source" not in existing_cols:
                    conn.execute(text("ALTER TABLE alerts ADD COLUMN source VARCHAR DEFAULT 'MODEL'"))
                conn.commit()
        except Exception as e:
            pass

    from app.services.risk_service import risk_service
    db = SessionLocal()
    try:
        risk_service.seed_initial_data_if_empty(db)
    finally:
        db.close()
