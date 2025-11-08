// App.jsx
import React, { useCallback, useEffect, useState } from "react";
import { listTodos, createTodo, updateTodo, deleteTodo, toggleTodo } from "./api/todos";
import Toast from "./components/Toast";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [query, setQuery] = useState("");
  const [isDone, setIsDone] = useState("all");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formVersion, setFormVersion] = useState(0); // 👈 to force form reset

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit, offset, sort, order };
      if (query) params.q = query;
      if (isDone !== "all") params.is_done = isDone === "true";
      const data = await listTodos(params);
      setTodos(Array.isArray(data) ? data : []);
    } catch (e) {
      setToast({ type: "error", message: e.message });
    } finally {
      setLoading(false);
    }
  }, [limit, offset, sort, order, query, isDone]);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(title) {
    try {
      await createTodo({ title, notes: "", priority: 0 });
      await load();                 // 👈 refresh list
      setFormVersion((v) => v + 1); // 👈 reset form inputs
      setToast({ type: "success", message: "Todo created" });
    } catch (e) {
      setToast({ type: "error", message: e.message });
    }
  }

  async function onToggle(id) {
    try {
      await toggleTodo(id);
      await load(); // 👈 refresh to reflect server truth
    } catch (e) {
      setToast({ type: "error", message: e.message });
    }
  }

  async function onEdit(id, patch) {
    try {
      await updateTodo(id, patch);
      await load(); // 👈 refresh
      setFormVersion((v) => v + 1); // optional: if form mirrors edited fields
      setToast({ type: "success", message: "Updated" });
    } catch (e) {
      setToast({ type: "error", message: e.message });
    }
  }

  async function onDelete(id) {
    try {
      await deleteTodo(id);
      await load(); // 👈 refresh
      setFormVersion((v) => v + 1); // optional
      setToast({ type: "success", message: "Deleted" });
    } catch (e) {
      setToast({ type: "error", message: e.message });
    }
  }

  return (
    <div className="min-h-screen">
            <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Todo</h1>
          <a
            className="btn-outline"
            href={import.meta.env.VITE_API_BASE || "#"}
            target="_blank"
            rel="noreferrer"
            title="Open API base"
          >
            API
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid gap-6">
        <div className="container-card">
          {/* 👇 key forces a remount = clean form every time formVersion changes */}
          <TodoForm key={formVersion} onCreate={onCreate} />
          <div className="mt-6">
            <Filters
              query={query} setQuery={setQuery}
              isDone={isDone} setIsDone={setIsDone}
              sort={sort} setSort={setSort}
              order={order} setOrder={setOrder}
              limit={limit} setLimit={setLimit}
            />
          </div>
        </div>

        <div className="container-card">
          {loading ? (
            <SkeletonList />
          ) : todos.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {todos.map((t) => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Pagination
              offset={offset}
              setOffset={setOffset}
              limit={limit}
              hasNext={todos.length >= limit}
            />
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-sm text-zinc-500">
        Built with Vite + React + Tailwind
      </footer>

      {toast && (
        <Toast
          type={toast.type}
          onClose={() => setToast(null)}
        >
          {toast.message}
        </Toast>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="animate-pulse space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
      ))}
    </ul>
  );
}

function Empty() {
  return (
    <div className="text-center py-12">
      <div className="text-5xl">🎯</div>
      <p className="mt-3 text-zinc-500">No todos yet — add your first task above.</p>
    </div>
  );
}
