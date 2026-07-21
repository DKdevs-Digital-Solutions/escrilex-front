import React from "react";
import { Info, Save, ShieldCheck, Link2, Webhook, Send, Braces } from "lucide-react";
import type { NotificationConfigPayload } from "../repository/notificationConfig.repository";
import type { AvailableEvent } from "../hooks/useNotificationConfig";

type Props = {
  form: NotificationConfigPayload;
  availableEvents?: AvailableEvent[];
  loading: boolean;
  saving: boolean;
  testing?: boolean;
  success: string;
  error: string;
  hasConfig: boolean;
  updateForm: <K extends keyof NotificationConfigPayload>(
    field: K,
    value: NotificationConfigPayload[K]
  ) => void;
  saveConfig: () => void;
  removeConfig: () => void;
  sendTest?: () => void;
};

export function TeamsNotificationsSettings({
  form,
  availableEvents = [],
  saving,
  testing = false,
  success,
  error,
  hasConfig,
  updateForm,
  saveConfig,
  removeConfig,
  sendTest,
}: Props) {

  function toggleEvent(key: string) {
    const current = form.enabledEvents ?? [];
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    updateForm("enabledEvents", next);
  }

  return (
    <div style={{ minHeight: "100%", padding: 0, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>
        {`@media (max-width: 768px){
          .teams-main-grid{grid-template-columns:1fr !important;gap:14px !important;}
        }`}
      </style>

      <div
        style={{
          padding: "15px 24px",
          borderRadius: 20,
          border: "2px solid #e2e8f0",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.1, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Notificações do Teams
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 14.5, color: "#64748b", maxWidth: 700, lineHeight: 1.6 }}>
              Configure o webhook do Microsoft Teams para receber avisos automáticos (prazos vencidos, empresa bloqueada) em um canal.
            </p>
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 14px",
              borderRadius: 10,
              background: form.active
                ? "linear-gradient(135deg, #36ad62 0%, #53b577 100%)"
                : "rgba(148,163,184,.16)",
              color: form.active ? "#ffffff" : "#64748b",
              fontSize: 12,
              fontWeight: 900,
              border: form.active ? "1px solid rgba(255,255,255,.18)" : "1px solid #cbd5e1",
              whiteSpace: "nowrap",
            }}
          >
            <ShieldCheck color={form.active ? "#ffffff" : "#94a3b8"} size={15} />
            {form.active ? "Notificações ativas" : "Notificações inativas"}
          </span>
        </div>
      </div>

      <div
        className="teams-main-grid"
        style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 18, padding: "25px 0px" }}
      >
        <div style={{ padding: 24, borderRadius: 15, background: "#fff", border: "2px solid #e2e8f0" }}>
          <div
            style={{
              marginBottom: 20,
              padding: 18,
              borderRadius: 18,
              background: "linear-gradient(180deg, #f8fafc, #ffffff)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <Webhook size={18} color="#2563eb" />
              <strong style={{ color: "#0f172a", fontSize: 15, fontWeight: 900 }}>Webhook do canal</strong>
            </div>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
              Crie um fluxo no Power Automate / Workflows (ou um Incoming Webhook) no canal do Teams e cole a URL gerada abaixo.
            </p>
          </div>

          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} />}

          <div style={{ display: "grid", gap: 18, maxWidth: 780 }}>
            <Field
              label="URL do Webhook"
              icon={<Link2 size={15} color="#2563eb" />}
              hint="URL gerada no fluxo do Power Automate / Workflows ou no Incoming Webhook do canal."
            >
              <input
                style={inputStyle}
                placeholder="https://prod-XX.westus.logic.azure.com:443/workflows/..."
                value={form.webhookUrl}
                onChange={(e) => updateForm("webhookUrl", e.target.value)}
              />
            </Field>

            <ToggleRow
              icon={<ShieldCheck size={16} color={form.active ? "#10b981" : "#94a3b8"} />}
              title="Notificações ativas"
              description="Define se o sistema deve enviar notificações ao Teams."
              checked={form.active}
              onChange={(checked) => updateForm("active", checked)}
            />

            {availableEvents.length > 0 && (
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <strong style={{ fontSize: 13, color: "#1e293b" }}>Eventos que disparam notificações</strong>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 10px" }}>
                    Sem seleção: todos os eventos são notificados.
                  </p>
                </div>
                {availableEvents.map((ev) => (
                  <label
                    key={ev.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      background: (form.enabledEvents ?? []).includes(ev.key) ? "#f0fdf4" : "#f8fafc",
                      cursor: "pointer",
                      fontSize: 13.5,
                      color: "#334155",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(form.enabledEvents ?? []).includes(ev.key)}
                      onChange={() => toggleEvent(ev.key)}
                    />
                    {ev.label}
                  </label>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
              <button
                type="button"
                style={{ ...primaryButton, opacity: saving ? 0.75 : 1, cursor: saving ? "not-allowed" : "pointer" }}
                disabled={saving}
                onClick={saveConfig}
              >
                <Save size={16} color="#7dd3fc" />
                {saving ? "Salvando..." : hasConfig ? "Atualizar configurações" : "Salvar configurações"}
              </button>

              {sendTest && (
                <button
                  type="button"
                  style={{ ...secondaryButton, opacity: testing || !form.webhookUrl ? 0.6 : 1, cursor: testing || !form.webhookUrl ? "not-allowed" : "pointer" }}
                  disabled={testing || !form.webhookUrl}
                  onClick={sendTest}
                  title={!form.webhookUrl ? "Informe a URL do webhook primeiro" : undefined}
                >
                  <Send size={15} />
                  {testing ? "Enviando..." : "Enviar teste"}
                </button>
              )}

              {hasConfig && (
                <button
                  type="button"
                  style={{ ...secondaryButton, border: "1px solid #fecaca", color: "#b91c1c" }}
                  onClick={removeConfig}
                  disabled={saving}
                >
                  Remover configuração
                </button>
              )}
            </div>
          </div>
        </div>

        <aside style={{ padding: 0 }}>
          <div
            style={{
              borderRadius: 15,
              padding: 22,
              height: "100%",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
              border: "2px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: 0, color: "#0f172a", fontSize: 17, fontWeight: 900 }}>Resumo</h3>
            <p style={{ margin: "8px 0 18px", color: "#64748b", fontSize: 13, lineHeight: 1.55 }}>
              As notificações automáticas são publicadas no canal do Teams via webhook.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <StatusCard label="Webhook" value={form.webhookUrl ? "Configurado" : "Não informado"} active={Boolean(form.webhookUrl)} />
              <StatusCard label="Status" value={form.active ? "Ativo" : "Inativo"} active={form.active} />
            </div>
          </div>
        </aside>
      </div>

      <PayloadReference />
    </div>
  );
}

// ── Referência do payload enviado ao webhook ─────────────────────────────────
// Mantido em sincronia com src/teams.js (buildPayload) e os hooks das rotas.
const BASE_FIELDS: { key: string; desc: string }[] = [
  { key: "evento",       desc: "Chave do evento (ex.: company_created)" },
  { key: "titulo",       desc: "Título legível (ex.: Novo cliente cadastrado)" },
  { key: "data",         desc: "Data/hora do disparo" },
  { key: "responsaveis", desc: "E-mails separados por vírgula — nulo quando não há" },
  { key: "descricao",    desc: "Texto livre — preenchido apenas no envio de teste" },
];

const EVENT_FIELDS: { event: string; label: string; fields: string[] }[] = [
  { event: "company_created",     label: "Novo cliente cadastrado", fields: ["empresa", "cnpj"] },
  { event: "process_started",     label: "Processo iniciado",       fields: ["empresa", "cnpj", "tipo", "template"] },
  { event: "process_completed",   label: "Processo concluído",      fields: ["empresa", "cnpj", "tipo"] },
  { event: "process_overdue",     label: "Processo atrasado",       fields: ["empresa", "cnpj", "setor", "responsavel", "item?", "vencimento?"] },
  { event: "responsible_changed", label: "Alteração de responsável", fields: ["empresa", "cnpj", "alterado_por"] },
  { event: "company_blocked",     label: "Empresa bloqueada",       fields: ["empresa", "cnpj", "alterado_por"] },
  { event: "company_unblocked",   label: "Empresa desbloqueada",    fields: ["empresa", "cnpj", "alterado_por"] },
];

function PayloadReference() {
  return (
    <div style={{ padding: 24, borderRadius: 15, background: "#fff", border: "2px solid #e2e8f0", marginBottom: 25 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Braces size={18} color="#2563eb" />
        <strong style={{ color: "#0f172a", fontSize: 15, fontWeight: 900 }}>Dados enviados ao webhook</strong>
      </div>
      <p style={{ margin: "0 0 18px", color: "#64748b", fontSize: 13, lineHeight: 1.55 }}>
        O sistema envia um JSON plano. No Power Automate, use{" "}
        <code style={codeStyle}>{"@{triggerBody()?['campo']}"}</code> para inserir um valor no meio de um texto.
        Campos marcados com <strong>?</strong> podem não vir preenchidos.
      </p>

      <div style={{ marginBottom: 20 }}>
        <strong style={{ fontSize: 13, color: "#1e293b" }}>Sempre presentes</strong>
        <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
          {BASE_FIELDS.map((f) => (
            <div
              key={f.key}
              style={{
                display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap",
                padding: "8px 12px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0",
              }}
            >
              <code style={codeStyle}>{f.key}</code>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <strong style={{ fontSize: 13, color: "#1e293b" }}>Campos adicionais por evento</strong>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          {EVENT_FIELDS.map((e) => (
            <div
              key={e.event}
              style={{ padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "#334155", marginBottom: 6 }}>
                {e.label}{" "}
                <code style={{ ...codeStyle, fontWeight: 600, background: "#eef2ff", color: "#4338ca" }}>{e.event}</code>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {e.fields.map((f) => (
                  <code key={f} style={codeStyle}>{f}</code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong style={{ fontSize: 13, color: "#1e293b" }}>Exemplo de mensagem no fluxo</strong>
        <pre
          style={{
            marginTop: 10, padding: "14px 16px", borderRadius: 10, overflowX: "auto",
            background: "#0f172a", color: "#e2e8f0", fontSize: 12.5, lineHeight: 1.7,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >{`Situação: @{triggerBody()?['titulo']}
Empresa: @{triggerBody()?['empresa']}
CNPJ: @{triggerBody()?['cnpj']}
Data: @{triggerBody()?['data']}
Responsáveis: @{coalesce(triggerBody()?['responsaveis'], 'Não informado')}`}</pre>
      </div>
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  padding: "2px 7px",
  borderRadius: 6,
  background: "#eef6ff",
  border: "1px solid #dbeafe",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 800,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  whiteSpace: "nowrap",
};

function Field({
  label,
  hint,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#1e293b", fontSize: 13, fontWeight: 800 }}>
        {icon}
        {label}
        {hint && (
          <span title={hint} style={{ color: "#38bdf8", display: "flex" }}>
            <Info size={14} />
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        padding: "15px 16px",
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        background: checked ? "linear-gradient(135deg, #ffffff, #f0fdf4)" : "#f8fafc",
        color: checked ? "#334155" : "#94a3b8",
        cursor: "pointer",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <span>
          <strong style={{ display: "block", fontSize: 13 }}>{title}</strong>
          <small style={{ color: "#64748b" }}>{description}</small>
        </span>
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function Alert({ type, message }: { type: "success" | "error"; message: string }) {
  const success = type === "success";
  return (
    <div
      style={{
        marginBottom: 20,
        padding: "12px 14px",
        borderRadius: 8,
        background: success ? "#ecfdf5" : "#fef2f2",
        border: success ? "1px solid #bbf7d0" : "1px solid #fecaca",
        color: success ? "#047857" : "#991b1b",
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {message}
    </div>
  );
}

function StatusCard({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 7,
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid",
        borderColor: active ? "#bbf7d0" : "#e2e8f0",
        background: active ? "linear-gradient(135deg, #f0fdf4, #ecfdf5)" : "#f8fafc",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>{label}</span>
      <strong style={{ fontSize: 13, fontWeight: 900, color: active ? "#047857" : "#64748b", wordBreak: "break-word" }}>
        {value}
      </strong>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  padding: "0 13px",
  fontSize: 14,
  outline: "none",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

const primaryButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 18px",
  borderRadius: 8,
  border: "1px solid #012942",
  background: "#012942",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 22px rgba(1, 41, 66, 0.24)",
  minWidth: 240,
  justifyContent: "center",
};

const secondaryButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 16px",
  borderRadius: 8,
  border: "2px solid #ccc",
  background: "#fff",
  color: "#334155",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
  justifyContent: "center",
};
