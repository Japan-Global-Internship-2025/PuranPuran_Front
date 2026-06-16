const BASE_URL = import.meta.env.VITE_API_URL || "";

const headers = () => ({
  "Content-Type": "application/json",
});

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: headers(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  console.log(`${method} ${path} → ${res.status}`);
  if (!res.ok) {
    const err = await res.json();
    console.error(`Error response from ${method} ${path}:`, err);
    throw new HttpError(err.status, err);
  }
  else {
    console.log(`Successful response from ${method} ${path}`);
    const result = await res.json();
    console.log("response data:", result);
    return result && result.success ? result.data : result;
  }
}

class HttpError extends Error {
  constructor(status, obj) {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.data = obj;
  }

  toString() {
    return this.data;
  }
}

// ── Auth ──────────────────────────────────────────────
export const api = {
  auth: {
    signup: (body) => request("POST", "/api/auth/signup", body),
    login: (body) => request("POST", "/api/auth/login", body),
    getUser: () => request("GET", "/api/auth/user"),
    updateUser: (body) => request("PATCH", "/api/auth/user", body),
    deleteUser: () => request("DELETE", "/api/auth/user"),
    getUsername: () => request("GET", `/api/auth/username`),
    logout: () => request("POST", "/api/auth/logout"),
  },

  // ── Travel ───────────────────────────────────────────
  travel: {
    getAll: () => request("GET", "/api/travel"),
    create: (body) => request("POST", "/api/travel/create", body),
    getOne: (id) => request("GET", `/api/travel/${id}`),
    update: (id, body) => request("PATCH", `/api/travel/${id}`, body),
    delete: (id) => request("DELETE", `/api/travel/${id}`),
    recommendPlaces: (id) => request("GET", `/api/travel/${id}/recommendation`),
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
        credentials: "include",
        body: formData,
      }).then(r => {
        if (!r.ok) throw new Error(`POST /api/spending/receipt/upload → ${r.status}`);
        return r.json();
      }).then(res => res && res.success ? res.data : res),
  },

  // ── Exchange Rate ─────────────────────────────────────
  exchangeRate: {
    get: () => request("GET", "/api/exchange-rate"),
  },

  // ── Japanese ─────────────────────────────────────
  japanese: {
    getDaily: () => request("GET", "/api/japanese/daily"),
    refresh: () => request("PATCH", "/api/japanese/refresh"),
  },
};
