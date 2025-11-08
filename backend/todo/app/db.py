import sqlite3
from flask import current_app, g
from pathlib import Path

def get_db():
    if "db" not in g:
        db_path = current_app.config["DATABASE"]
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(db_path, detect_types=sqlite3.PARSE_DECLTYPES)
        conn.row_factory = sqlite3.Row
        g.db = conn
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def _run_schema(db):
    with current_app.open_resource("schema.sql") as f:
        db.executescript(f.read().decode("utf-8"))
    db.commit()

def ensure_schema():
    """Create tables if they do not exist."""
    db = get_db()
    row = db.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='todos'"
    ).fetchone()
    if row is None:
        _run_schema(db)

def init_db_command():
    """CLI: flask init-db"""
    db = get_db()
    _run_schema(db)
    return "Initialized the database."

def init_app(app):
    app.teardown_appcontext(close_db)

    @app.cli.command("init-db")
    def _init_db():
        print(init_db_command())
