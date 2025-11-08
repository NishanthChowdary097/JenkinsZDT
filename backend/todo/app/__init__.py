from flask import Flask
from flask_cors import CORS
from .db import init_app as init_db, ensure_schema
from .todos import bp as todos_bp

def create_app(config_object="backend.todo.config.Config"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    CORS(app, supports_credentials=True)
    init_db(app)

    # Ensure schema exists on first boot
    with app.app_context():
        ensure_schema()

    app.register_blueprint(todos_bp, url_prefix="/api")

    @app.get("/healthz")
    def health():
        return {"status": "ok"}, 200

    return app
