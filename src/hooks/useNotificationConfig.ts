import { useEffect, useState } from "react";
import {
  getNotificationConfig,
  createNotificationConfig,
  updateNotificationConfig,
  deleteNotificationConfig,
  type NotificationConfigPayload,
} from "../repository/notificationConfig.repository";
import { useToast } from "../toast";

const initialForm: NotificationConfigPayload = {
  webhookUrl: "",
  active: true,
};

export function useNotificationConfig() {
  const [form, setForm] = useState<NotificationConfigPayload>(initialForm);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
        });
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

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    form,
    loading,
    saving,
    success,
    error,
    hasConfig,
    updateForm,
    saveConfig,
    removeConfig,
    loadConfig,
  };
}
