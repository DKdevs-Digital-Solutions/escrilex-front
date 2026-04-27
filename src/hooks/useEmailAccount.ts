import { useState } from "react";
import {
  createEmailAccount,
  type EmailAccountPayload,
} from "../repository/emailAccount.repository";

export function useEmailAccount() {
  const [form, setForm] = useState<EmailAccountPayload>({
    host: "",
    port: 587,
    secure: false,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateForm<K extends keyof EmailAccountPayload>(
    field: K,
    value: EmailAccountPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function saveEmailAccount() {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      await createEmailAccount({
        ...form,
        port: Number(form.port),
      });

      setSuccess("Conta de e-mail cadastrada com sucesso.");
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 409) {
        setError("Já existe uma conta de e-mail cadastrada.");
        return;
      }

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Não foi possível cadastrar a conta de e-mail."
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    saving,
    success,
    error,
    updateForm,
    saveEmailAccount,
  };
}