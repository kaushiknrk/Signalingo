const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("signalingo_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("signalingo_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("signalingo_token");
    localStorage.removeItem("signalingo_user");
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiFetch<{ access_token: string; token_type: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("signalingo_user", JSON.stringify(res.user));
    }
    return res;
  },

  register: async (data: { email: string; password: string; first_name: string; last_name: string; role_name?: string }) => {
    const res = await apiFetch<{ access_token: string; token_type: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setAuthToken(res.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("signalingo_user", JSON.stringify(res.user));
    }
    return res;
  },

  getMe: async () => {
    return apiFetch<any>("/auth/me");
  },

  changePassword: async (data: { old_password: string; new_password: string }) => {
    return apiFetch<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore network errors during client logout
    } finally {
      removeAuthToken();
    }
  },
};

export const signsApi = {
  getAll: async (contentType?: string) => {
    const query = contentType ? `?content_type=${contentType}` : "";
    return apiFetch<any[]>(`/signs${query}`);
  },
};

export const lessonsApi = {
  getAll: async () => {
    return apiFetch<any[]>("/lessons");
  },
  getDetail: async (id: number) => {
    return apiFetch<any>(`/lessons/${id}`);
  },
};

export const progressApi = {
  getMe: async () => {
    return apiFetch<any[]>("/progress/me");
  },
  getUserProgress: async (target_user_id: number) => {
    return apiFetch<any[]>(`/progress/user/${target_user_id}`);
  },
  update: async (lesson_id: number, score: number, completed = true) => {
    return apiFetch<any>("/progress/update", {
      method: "POST",
      body: JSON.stringify({ lesson_id, score, completed }),
    });
  },
};

export const practiceApi = {
  recordAttempt: async (content_id: number | null, result: "correct" | "incorrect", score: number) => {
    return apiFetch<any>("/practice/attempt", {
      method: "POST",
      body: JSON.stringify({ content_id, result, score }),
    });
  },
  getHistory: async () => {
    return apiFetch<any[]>("/practice/history");
  },
};

export const streaksApi = {
  getMe: async () => {
    return apiFetch<any>("/streaks/me");
  },
};

export const familyApi = {
  getLearners: async () => {
    return apiFetch<any[]>("/family/learners");
  },
  requestAccess: async (learner_email: string) => {
    return apiFetch<any>("/family/request", {
      method: "POST",
      body: JSON.stringify({ learner_email }),
    });
  },
};

export const adminApi = {
  getStats: async () => {
    return apiFetch<{
      total_users: number;
      total_learners: number;
      total_family_members: number;
      total_admins: number;
      total_signs: number;
      total_lessons: number;
      total_practice_attempts: number;
      total_family_links: number;
    }>("/admin/stats");
  },
  getLogs: async (limit: number = 50) => {
    return apiFetch<any[]>(`/admin/logs?limit=${limit}`);
  },
  getUsers: async () => {
    return apiFetch<any[]>("/admin/users");
  },
  createSign: async (data: { label: string; content_type: string; description?: string; difficulty?: string }) => {
    return apiFetch<any>("/admin/signs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  deleteUser: async (user_id: number) => {
    return apiFetch<any>(`/admin/users/${user_id}`, {
      method: "DELETE",
    });
  },
};

export const recognitionApi = {
  getInfo: async () => {
    return apiFetch<any>("/recognition/info");
  },
};
