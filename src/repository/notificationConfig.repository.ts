import api from "../services/api";

export type NotificationConfigPayload = {
  webhookUrl: string;
  active: boolean;
  enabledEvents?: string[];
};

// GET - buscar configuração de notificações (Teams)
export async function getNotificationConfig() {
  const response = await api.get("/api/admin/notification-config");
  return response.data;
}

// POST - criar configuração
export async function createNotificationConfig(payload: Partial<NotificationConfigPayload>) {
  const response = await api.post("/api/admin/notification-config", payload);
  return response.data;
}

// PUT - atualizar configuração
export async function updateNotificationConfig(payload: Partial<NotificationConfigPayload>) {
  const response = await api.put("/api/admin/notification-config", payload);
  return response.data;
}

// DELETE - remover configuração
export async function deleteNotificationConfig() {
  const response = await api.delete("/api/admin/notification-config");
  return response.data;
}

// POST - enviar mensagem de teste
export async function testNotificationConfig() {
  const response = await api.post("/api/admin/notification-config/test");
  return response.data;
}
