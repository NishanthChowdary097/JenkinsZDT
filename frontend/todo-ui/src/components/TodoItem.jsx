import React, { useState } from "react";
import dayjs from "../lib/dayjs";

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  function save() {
    const t = title.trim();
    if (!t || t === todo.title) return setEditing(false);
    onEdit(todo.id, { title: t });
    setEditing(false);
  }

  return (
    <li className="py-3 flex items-center gap-3">
      <input
        type="checkbox"
        checked={!!todo.is_done}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 accent-zinc-900"
      />

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            className="input h-9"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
        ) : (
          <div
            className={`truncate ${todo.is_done ? "line-through text-zinc-400" : ""}`}
            onDoubleClick={() => setEditing(true)}
            title={todo.title}
          >
            {todo.title}
          </div>
        )}
        <div className="mt-1 text-xs text-zinc-500">
          <span className="badge">id #{todo.id}</span>
          {todo.updated_at && (
            <span className="ml-2">updated {dayjs(todo.updated_at).fromNow() || dayjs(todo.updated_at).format("YYYY-MM-DD HH:mm")}</span>
          )}
        </div>
      </div>

      <button className="btn-outline h-9" onClick={() => setEditing((v) => !v)}>
        {editing ? "Save" : "Edit"}
      </button>
      <button className="btn-outline h-9" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
