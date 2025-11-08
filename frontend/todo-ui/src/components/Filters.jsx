import React from "react";

export default function Filters({
  query, setQuery,
  isDone, setIsDone,
  sort, setSort,
  order, setOrder,
  limit, setLimit
}) {
  return (
    <div className="grid md:grid-cols-12 gap-3">
      <div className="md:col-span-5">
        <input
          className="input"
          placeholder="Search title/notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="md:col-span-2">
        <select className="input" value={isDone} onChange={(e) => setIsDone(e.target.value)}>
          <option value="all">All</option>
          <option value="false">Open</option>
          <option value="true">Done</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="created_at">Created</option>
          <option value="updated_at">Updated</option>
          <option value="due_at">Due</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="md:col-span-1">
        <select className="input" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <select className="input" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>
    </div>
  );
}
