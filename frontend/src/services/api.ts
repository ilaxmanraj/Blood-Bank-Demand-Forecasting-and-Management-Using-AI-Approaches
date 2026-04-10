const API_URL = "http://127.0.0.1:8000";

/* ---------------- TYPES ---------------- */

export interface LoginResponse {
  access_token: string;
  role: string;
  name: string;
}

/* ---------------- TOKEN ---------------- */

function getToken() {
  return localStorage.getItem("token");
}

/* ---------------- FETCH HELPER ---------------- */

async function apiFetch(path: string, options: RequestInit = {}) {

  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token && !["/login", "/register"].includes(path)) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {

    if (res.status === 401) {
      console.warn("Unauthorized request:", path);
      localStorage.clear();
      window.location.href = "/auth";
      return;
    }

    if (["/inventory", "/donors", "/requests"].includes(path)) {
      return [];
    }

    throw new Error(data?.detail ?? `Request failed (${res.status})`);
  }

  return data;
}

/* ---------------- LOGIN ---------------- */

export async function loginUser(data: any): Promise<LoginResponse> {

  const result = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify(data)
  });

  localStorage.setItem("token", result.access_token);
  localStorage.setItem("role", result.role);
  localStorage.setItem("name", result.name);

  return result;
}

/* ---------------- REGISTER USER ---------------- */

export async function registerUser(data: any) {

  return apiFetch("/register", {
    method: "POST",
    body: JSON.stringify(data)
  });

}

/* ---------------- DONOR REGISTER ---------------- */

export async function registerDonor(data: any) {

  return apiFetch("/donor/register", {
    method: "POST",
    body: JSON.stringify(data)
  });

}

/* ---------------- INVENTORY ---------------- */

export async function getInventory(): Promise<any[]> {

  const data = await apiFetch("/inventory");

  return Array.isArray(data) ? data : [];

}

/* ---------------- DONORS ---------------- */

export async function getDonors(): Promise<any[]> {

  const data = await apiFetch("/donors");

  return Array.isArray(data) ? data : [];

}

/* ---------------- BLOOD REQUEST ---------------- */

export async function requestBlood(data: any) {

  return apiFetch("/request-blood", {
    method: "POST",
    body: JSON.stringify(data)
  });

}

/* ---------------- REQUEST LIST ---------------- */

export async function getRequests(): Promise<any[]> {

  const token = getToken();

  if (!token) {
    console.warn("No token found, skipping request");
    return [];
  }

  const data = await apiFetch("/requests");

  return Array.isArray(data) ? data : [];

}

/* ---------------- APPROVE REQUEST ---------------- */

export async function approveRequest(requestId: number) {

  return apiFetch(`/request/approve?request_id=${requestId}`, {
    method: "POST"
  });

}

/* ---------------- AI PREDICTION ---------------- */

export async function predictDemand(day: number) {

  return apiFetch("/predict-demand", {
    method: "POST",
    body: JSON.stringify({ day })
  });

}

/* ---------------- LOGOUT ---------------- */

export function logout() {

  localStorage.clear();
  window.location.href = "/auth";

}

/* ---------------- ALERTS ---------------- */

export async function getAlerts(): Promise<any[]> {

  const data = await apiFetch("/admin/alerts");

  return Array.isArray(data) ? data : [];

}