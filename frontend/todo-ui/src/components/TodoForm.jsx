// TodoForm.jsx
import React, { useState } from "react";

export default function TodoForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t || busy) return;
    try {
      setBusy(true);
      await onCreate(t);
      setTitle(""); // 👈 reset after successful add
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="input"
        placeholder="Add a task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn-primary" type="submit" disabled={busy}>
        {busy ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
