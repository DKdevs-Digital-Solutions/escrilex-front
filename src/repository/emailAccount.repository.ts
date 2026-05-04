import api from "../services/api";

export type EmailAccountPayload = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  active: boolean;
};

// 🔍 GET - buscar conta
export async function getEmailAccount() {
  const response = await api.get("/api/admin/email-account");
  return response.data;
}

// ➕ POST - criar conta
export async function createEmailAccount(payload: EmailAccountPayload) {
  const response = await api.post("/api/admin/email-account", payload);
  return response.data;
}

// ✏️ PUT - atualizar conta
export async function updateEmailAccount(payload: EmailAccountPayload) {
  const response = await api.put("/api/admin/email-account", payload);
  return response.data;
}

// ❌ DELETE - remover conta
export async function deleteEmailAccount() {
  const response = await api.delete("/api/admin/email-account");
  return response.data;
}