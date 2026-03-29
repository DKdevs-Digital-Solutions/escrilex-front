const API_URL = "http://localhost:3000";
export function getToken() { return localStorage.getItem("token"); }
export function setToken(t: string | null) { t ? localStorage.setItem("token", t) : localStorage.removeItem("token"); }
export async function api(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const headers: any = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API_URL + path, { ...opts, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || body.error || res.statusText);
  }
  return res.json();
}
