import os
from pathlib import Path

class Config:
    BASE_DIR = Path(__file__).resolve().parent
    INSTANCE_DIR = Path(os.environ.get("INSTANCE_DIR", BASE_DIR / ".." / "instance"))
    INSTANCE_DIR.mkdir(parents=True, exist_ok=True)

    # SQLite DB path (instance/todos.db by default)
    DATABASE = str(INSTANCE_DIR / "todos.db")

    # Flask
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    JSON_SORT_KEYS = False
