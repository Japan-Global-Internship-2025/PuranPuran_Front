const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const token = () => localStorage.getItem("token") || "";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  return res.json().catch(() => null);
}

// ── Auth ──────────────────────────────────────────────
export const api = {
  auth: {
    signup: (body) => request("POST", "/api/auth/signup", body),
    login: (body) => request("POST", "/api/auth/login", body),
    getUser: () => request("GET", "/api/auth/user"),
    updateUser: (body) => request("PATCH", "/api/auth/user", body),
    deleteUser: () => request("DELETE", "/api/auth/user"),
  },

  // ── Travel ───────────────────────────────────────────
  travel: {
    getAll: () => request("GET", "/api/travel"),
    create: (body) => request("POST", "/api/travel/create", body),
    getOne: (id) => request("GET", `/api/travel/${id}`),
    update: (id, body) => request("PATCH", `/api/travel/${id}`, body),
    delete: (id) => request("DELETE", `/api/travel/${id}`),
  },

  // ── Planner ──────────────────────────────────────────
  planner: {
    getAll: (travelId) => request("GET", `/api/planner/${travelId}/all`),
    getOne: (plannerId) => request("GET", `/api/planner/${plannerId}`),
    update: (plannerId, body) => request("PATCH", `/api/planner/${plannerId}`, body),
    delete: (plannerId) => request("DELETE", `/api/planner/${plannerId}`),
    save: (travelId, body) => request("POST", `/api/planner/${travelId}/save`, body),
    generate: (travelId, body) => request("POST", `/api/planner/${travelId}/generate`, body),
    totalSave: (travelId, body) => request("POST", `/api/planner/${travelId}/total/save`, body),
    totalGenerate: (travelId, body) => request("POST", `/api/planner/${travelId}/total/generate`, body),
    totalPlacesSave: (travelId, body) => request("POST", `/api/planner/${travelId}/total/places/save`, body),
  },

  // ── Spending ─────────────────────────────────────────
  spending: {
    getRecent: (travelId) => request("GET", `/api/spending/${travelId}/recent`),
    getCategory: (travelId) => request("GET", `/api/spending/${travelId}/category`),
    getTotal: (travelId) => request("GET", `/api/spending/${travelId}/total`),
    getReceipts: (travelId) => request("GET", `/api/spending/receipt/${travelId}`),
    getReceiptsByDate: (travelId, date) => request("GET", `/api/spending/receipt/${travelId}/date/${date}`),
    getReceiptOne: (travelId, id) => request("GET", `/api/spending/receipt/${travelId}/${id}`),
    createReceipt: (travelId, body) => request("POST", `/api/spending/receipt/${travelId}`, body),
    updateReceipt: (id, body) => request("PATCH", `/api/spending/receipt/${id}`, body),
    deleteReceipt: (id) => request("DELETE", `/api/spending/receipt/${id}`),
    uploadReceipt: (formData) =>
      fetch(`${BASE_URL}/api/spending/receipt/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      }).then(r => r.json()),
  },

  // ── Exchange Rate ─────────────────────────────────────
  exchangeRate: {
    get: () => request("GET", "/api/exchange-rate"),
  },
};
