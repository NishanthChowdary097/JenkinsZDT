import React from "react";

export default function Pagination({ offset, setOffset, limit, hasNext }) {
  const canPrev = offset > 0;
  const prev = () => setOffset(Math.max(0, offset - limit));
  const next = () => setOffset(offset + limit);

  return (
    <div className="flex items-center justify-between">
      <button className="btn-outline" disabled={!canPrev} onClick={prev}>
        ← Prev
      </button>
      <div className="text-sm text-zinc-500">
        Offset {offset} • Limit {limit}
      </div>
      <button className="btn-outline" disabled={!hasNext} onClick={next}>
        Next →
      </button>
    </div>
  );
}
