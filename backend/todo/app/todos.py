from flask import Blueprint, request, jsonify, abort
from datetime import datetime
from .db import get_db

bp = Blueprint("todos", __name__)

def row_to_dict(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "notes": row["notes"],
        "is_done": bool(row["is_done"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "due_at": row["due_at"],
        "priority": row["priority"],
    }

@bp.get("/todos")
def list_todos():
    """List todos with basic filters & pagination."""
    db = get_db()
    q = "SELECT * FROM todos WHERE 1=1"
    params = []

    # Optional filters
    is_done = request.args.get("is_done")
    if is_done is not None:
        q += " AND is_done = ?"
        params.append(1 if is_done.lower() in ("1", "true", "yes") else 0)

    search = request.args.get("q")
    if search:
        q += " AND (title LIKE ? OR notes LIKE ?)"
        like = f"%{search}%"
        params.extend([like, like])

    # Sorting
    sort = request.args.get("sort", "created_at")
    order = request.args.get("order", "desc").lower()
    if sort not in {"created_at", "updated_at", "due_at", "priority", "title"}:
        sort = "created_at"
    if order not in {"asc", "desc"}:
        order = "desc"
    q += f" ORDER BY {sort} {order}"

    # Pagination
    try:
        limit = min(int(request.args.get("limit", 50)), 200)
        offset = max(int(request.args.get("offset", 0)), 0)
    except ValueError:
        abort(400, description="limit/offset must be integers")
    q += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    rows = db.execute(q, params).fetchall()
    data = [row_to_dict(r) for r in rows]
    return jsonify({"items": data, "limit": limit, "offset": offset})

@bp.post("/todos")
def create_todo():
    """Create a new todo."""
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    notes = (payload.get("notes") or "").strip()
    due_at = payload.get("due_at")  # ISO string or None
    priority = payload.get("priority", 0)

    if not title:
        abort(400, description="title is required")
    if not isinstance(priority, int):
        abort(400, description="priority must be an integer")

    now = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    db = get_db()
    cur = db.execute(
        """
        INSERT INTO todos (title, notes, is_done, created_at, updated_at, due_at, priority)
        VALUES (?, ?, 0, ?, ?, ?, ?)
        """,
        (title, notes, now, now, due_at, priority),
    )
    db.commit()
    todo = db.execute("SELECT * FROM todos WHERE id = ?", (cur.lastrowid,)).fetchone()
    return row_json(todo), 201

@bp.get("/todos/<int:todo_id>")
def get_todo(todo_id):
    db = get_db()
    row = db.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    if not row:
        abort(404, description="todo not found")
    return row_json(row)

@bp.patch("/todos/<int:todo_id>")
def patch_todo(todo_id):
    """Partial update: title, notes, is_done, due_at, priority."""
    payload = request.get_json(silent=True) or {}
    fields = []
    params = []
    allowed = {"title", "notes", "is_done", "due_at", "priority"}

    for key, val in payload.items():
        if key not in allowed:
            abort(400, description=f"invalid field: {key}")
        if key == "is_done":
            val = 1 if bool(val) else 0
        if key == "priority" and not isinstance(val, int):
            abort(400, description="priority must be an integer")
        fields.append(f"{key} = ?")
        params.append(val)

    if not fields:
        abort(400, description="no fields to update")

    now = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    q = f"UPDATE todos SET {', '.join(fields)}, updated_at = ? WHERE id = ?"
    params.extend([now, todo_id])

    db = get_db()
    cur = db.execute(q, params)
    if cur.rowcount == 0:
        abort(404, description="todo not found")
    db.commit()

    row = db.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    return row_json(row)

@bp.put("/todos/<int:todo_id>")
def replace_todo(todo_id):
    """Full replace."""
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    notes = (payload.get("notes") or "").strip()
    due_at = payload.get("due_at")
    priority = payload.get("priority", 0)
    is_done = 1 if bool(payload.get("is_done", False)) else 0

    if not title:
        abort(400, description="title is required")
    if not isinstance(priority, int):
        abort(400, description="priority must be an integer")

    now = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    db = get_db()
    cur = db.execute(
        """
        UPDATE todos SET title=?, notes=?, is_done=?, due_at=?, priority=?, updated_at=?
        WHERE id = ?
        """,
        (title, notes, is_done, due_at, priority, now, todo_id),
    )
    if cur.rowcount == 0:
        abort(404, description="todo not found")
    db.commit()

    row = db.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    return row_json(row)

@bp.delete("/todos/<int:todo_id>")
def delete_todo(todo_id):
    db = get_db()
    cur = db.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    if cur.rowcount == 0:
        abort(404, description="todo not found")
    db.commit()
    return "", 204

@bp.post("/todos/<int:todo_id>/toggle")
def toggle_todo(todo_id):
    db = get_db()
    row = db.execute("SELECT is_done FROM todos WHERE id = ?", (todo_id,)).fetchone()
    if not row:
        abort(404, description="todo not found")
    new_val = 0 if row["is_done"] else 1
    now = datetime.utcnow().isoformat(timespec="seconds") + "Z"
    db.execute("UPDATE todos SET is_done=?, updated_at=? WHERE id=?", (new_val, now, todo_id))
    db.commit()
    row = db.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    return row_json(row)

def row_json(row):
    return jsonify(row_to_dict(row))
