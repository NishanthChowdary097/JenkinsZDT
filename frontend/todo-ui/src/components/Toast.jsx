import React, { useEffect } from "react";

export default function Toast({ type = "info", children, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 2200);
    return () => clearTimeout(id);
  }, [onClose]);

  const base =
    "fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg border text-sm";
  const styles = {
    success: "bg-emerald-600 text-white border-emerald-500",
    error: "bg-rose-600 text-white border-rose-500",
    info: "bg-zinc-900 text-white border-zinc-800",
  };

  return <div className={`${base} ${styles[type] || styles.info}`}>{children}</div>;
}
