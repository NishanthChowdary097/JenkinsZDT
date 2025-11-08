import client from "./client";

export async function listTodos(params = {}) {
  const res = await client.get("/todos", { params });
  // Your API always returns { items, limit, offset }
  return Array.isArray(res.data?.items) ? res.data.items : [];
}


export async function createTodo(payload) {
  const res = await client.post("/todos", payload);
  return res.data;
}

export async function updateTodo(id, patch) {
  const res = await client.patch(`/todos/${id}`, patch);
  return res.data;
}

export async function replaceTodo(id, full) {
  const res = await client.put(`/todos/${id}`, full);
  return res.data;
}

export async function deleteTodo(id) {
  await client.delete(`/todos/${id}`);
  return true;
}

export async function toggleTodo(id) {
  const res = await client.post(`/todos/${id}/toggle`);
  return res.data;
}
