import { useEffect, useState } from "react";
import {
  getNotificationConfig,
  createNotificationConfig,
  updateNotificationConfig,
  deleteNotificationConfig,
  testNotificationConfig,
  type NotificationConfigPayload,
} from "../repository/notificationConfig.repository";
import { useToast } from "../toast";

export interface AvailableEvent { key: string; label: string; }

const initialForm: NotificationConfigPayload = {
  webhookUrl: "",
  active: true,
  enabledEvents: [],
};

export function useNotificationConfig() {
  const [form, setForm] = useState<NotificationConfigPayload>(initialForm);
  const [availableEvents, setAvailableEvents] = useState<AvailableEvent[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hasConfig, setHasConfig] = useState(false);

  function updateForm<K extends keyof NotificationConfigPayload>(
    field: K,
    value: NotificationConfigPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function loadConfig() {
    try {
      setLoading(true);
      setError("");

      const data = await getNotificationConfig();

      if (data) {
        setForm({
          webhookUrl: data.webhookUrl ?? "",
          active: data.active ?? true,
          enabledEvents: data.enabledEvents ?? [],
        });
        setAvailableEvents(data.availableEvents ?? []);
        setHasConfig(true);
      } else {
        setHasConfig(false);
        setForm(initialForm);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setHasConfig(false);
        setForm(initialForm);
        return;
      }
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Não foi possível carregar a configuração de notificações."
      );
      toast("Erro ao carregar configuração", "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveConfig() {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      if (hasConfig) {
        await updateNotificationConfig(form);
        setSuccess("Configuração de notificações atualizada com sucesso.");
        toast("Configuração atualizada com sucesso", "success");
      } else {
        await createNotificationConfig(form);
        setHasConfig(true);
        setSuccess("Configuração de notificações cadastrada com sucesso.");
        toast("Configuração cadastrada com sucesso", "success");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Não foi possível salvar a configuração."
      );
      toast("Erro ao salvar configuração", "error");
    } finally {
      setSaving(false);
    }
  }

  async function removeConfig() {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      await deleteNotificationConfig();

      setForm(initialForm);
      setHasConfig(false);
      setSuccess("Configuração de notificações removida com sucesso.");
      toast("Configuração removida com sucesso", "success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Não foi possível remover a configuração."
      );
      toast("Erro ao remover configuração", "error");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setTesting(true);
    setSuccess("");
    setError("");
    try {
      await testNotificationConfig();
      setSuccess("Mensagem de teste enviada com sucesso.");
      toast("Mensagem de teste enviada", "success");
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Erro ao enviar mensagem de teste.";
      setError(msg);
      toast(msg, "error");
    } finally {
      setTesting(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    form,
    availableEvents,
    loading,
    saving,
    testing,
    success,
    error,
    hasConfig,
    updateForm,
    saveConfig,
    removeConfig,
    loadConfig,
    sendTest,
  };
}
