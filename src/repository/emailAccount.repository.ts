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

export async function createEmailAccount(payload: EmailAccountPayload) {
  const response = await api.post("/api/admin/email-account", payload);
  return response.data;
}