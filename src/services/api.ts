import { getUserId } from "../lib/userId";

const userName = import.meta.env.VITE_USER_NAME || "Utilisateur anonyme";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Erreur ${response.status}`,
    );
  }
  return response.json() as Promise<T>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-user-id": getUserId(),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(path, { ...options, headers }).then((res) =>
    handleResponse<T>(res),
  );
  return response;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: Record<string, unknown>) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify({ ...body, userName }),
    }),

  put: <T>(path: string, body: Record<string, unknown>) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify({ ...body, userName }),
    }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
