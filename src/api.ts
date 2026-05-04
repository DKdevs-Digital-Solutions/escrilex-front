const API_URL = import.meta.env.VITE_API_URL;

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

type ApiOptions = RequestInit & {
  auth?: boolean; // permite desligar auth se quiser
};

export async function api<T = any>(
  path: string,
  { auth = true, headers, ...options }: ApiOptions = {}
): Promise<T> {
  const token = getToken();

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth && token) {
    (finalHeaders as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: finalHeaders,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    // resposta sem JSON
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      data?.error ||
      response.statusText ||
      "Erro na requisição";

    throw new Error(message);
  }

  return data;
}