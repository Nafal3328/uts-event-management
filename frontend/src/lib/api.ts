const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Request failed" }));
      throw new Error(err.message ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  },

  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
    return data as T;
  },

  put: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
    return data as T;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
    return data as T;
  },
};
