from database.connection import engine
from database.models import Base

def init_db():
    """Creates all tables if they don't exist."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

if __name__ == "__main__":
    init_db()