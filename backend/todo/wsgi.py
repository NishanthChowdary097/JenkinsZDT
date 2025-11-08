from backend.todo.app import create_app

app = create_app()

# Allow local testing via `python wsgi.py`
if __name__ == "__main__":
    app.run(debug=False,port=8000,host='0.0.0.0')