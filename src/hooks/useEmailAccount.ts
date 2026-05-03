import { useEffect, useState } from "react";
import {
  getEmailAccount,
  createEmailAccount,
  updateEmailAccount,
  deleteEmailAccount,
  type EmailAccountPayload,
} from "../repository/emailAccount.repository";
import { useToast } from "../toast";

const initialForm: EmailAccountPayload = {
  host: "",
  port: 587,
  secure: false,
  username: "",
  password: "",
  fromEmail: "",
  fromName: "",
  active: true,
};

export function useEmailAccount() {
  const [form, setForm] = useState<EmailAccountPayload>(initialForm);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [hasAccount, setHasAccount] = useState(false);

  function updateForm<K extends keyof EmailAccountPayload>(
    field: K,
    value: EmailAccountPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function loadEmailAccount() {
    try {
      setLoading(true);
      setError("");

      const data = await getEmailAccount();

      if (data) {
        setForm({
          host: data.host ?? "",
          port: Number(data.port ?? 587),
          secure: Boolean(data.secure),
          username: data.username ?? "",
          password: data.password ?? "",
          fromEmail: data.fromEmail ?? "",
          fromName: data.fromName ?? "",
          active: data.active ?? true,
        });

        setHasAccount(true);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setHasAccount(false);
        setForm(initialForm);
        return;
      }

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Não foi possível carregar a conta de e-mail."
      );
      toast("Erro ao carregar conta de e-mail", "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveEmailAccount() {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const payload = {
        ...form,
        port: Number(form.port),
      };

      if (hasAccount) {
        await updateEmailAccount(payload);
        setSuccess("Conta de e-mail atualizada com sucesso.");
        toast("Conta de e-mail atualizada com sucesso", "success");
      } else {
        await createEmailAccount(payload);
        setHasAccount(true);
        setSuccess("Conta de e-mail cadastrada com sucesso.");
        toast("Conta de e-mail cadastrada com sucesso", "success");
      }
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 409) {
        setError("Já existe uma conta de e-mail cadastrada.");
        toast("Já existe uma conta de e-mail cadastrada.", "error");
        setHasAccount(true);
        return;
      }

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Não foi possível salvar a conta de e-mail."
      );
      toast("Erro ao salvar conta de e-mail", "error");
    } finally {
      setSaving(false);
    }
  }

  async function removeEmailAccount() {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      await deleteEmailAccount();

      setForm(initialForm);
      setHasAccount(false);
      setSuccess("Conta de e-mail excluída com sucesso.");
      toast("Conta de e-mail excluída com sucesso", "success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Não foi possível excluir a conta de e-mail."
      );
      toast("Erro ao excluir conta de e-mail", "error");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadEmailAccount();
  }, []);

  return {
    form,
    loading,
    saving,
    success,
    error,
    hasAccount,
    updateForm,
    saveEmailAccount,
    removeEmailAccount,
    loadEmailAccount,
  };
}