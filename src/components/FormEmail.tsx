import React from "react";
import {
  Mail,
  Info,
  Server,
  Lock,
  Send,
  Save,
  ShieldCheck,
  Sparkles,
  Wifi,
  KeyRound,
  Settings2,
  UserRound,
  BadgeCheck,
} from "lucide-react";
import { useEmailAccount } from "../hooks/useEmailAccount";

export function EmailNotificationsSettings() {
  const { 
    form, 
    saving, 
    success, 
    error, 
    updateForm, 
    saveEmailAccount 
  } = useEmailAccount();

  return (
    <div
      style={{
        minHeight: "100%",
        padding: 0,
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: 8,
      }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            .email-header {
              padding: 20px !important;
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .email-header-content {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .email-main-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }

            .email-form-wrap {
              padding: 18px !important;
            }

            .email-form-grid {
              grid-template-columns: 1fr !important;
            }

            .email-aside {
              padding: 0 !important;
            }

            .email-actions {
              flex-direction: column !important;
            }

            .email-button {
              width: 100% !important;
              max-width: none !important;
            }
          }
        `}
      </style>

      <div
        style={{
          width: "100%",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          className="email-header"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: 28,
            background:
              "linear-gradient(135deg, #012942 0%, #073b5f 52%, #012942 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            borderRadius:8
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -70,
              right: -60,
              width: 190,
              height: 190,
              borderRadius: "50%",
              background: "rgba(125,211,252,.13)",
            }}
          />

          <div
            className="email-header-content"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, rgba(56,189,248,.30), rgba(34,197,94,.20))",
                border: "1px solid rgba(255,255,255,.28)",
                display: "grid",
                placeItems: "center",
                
              }}
            >
              <Mail size={26} color="#7dd3fc" />
            </div>

            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                  padding: "5px 10px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,.12)",
                  border: "1px solid rgba(255,255,255,.18)",
                  color: "#fde68a",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={12} color="#facc15" />
                Conta SMTP
              </div>

              <h2 style={{ margin: 0, fontSize: 25, fontWeight: 900 }}>
                Conta de e-mail
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,.76)",
                  fontSize: 13.5,
                  maxWidth: 590,
                  lineHeight: 1.5,
                }}
              >
                Cadastre a conta única responsável pelo envio automático de
                notificações do sistema.
              </p>
            </div>
          </div>

          <span
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 12px",
              borderRadius:8,
              background: form.active
                ? "rgba(16,185,129,.16)"
                : "rgba(148,163,184,.16)",
              color: form.active ? "#d1fae5" : "#e2e8f0",
              fontSize: 12,
              fontWeight: 900,
              border: form.active
                ? "1px solid rgba(167,243,208,.32)"
                : "1px solid rgba(226,232,240,.28)",
              whiteSpace: "nowrap",
            }}
          >
            <ShieldCheck
              color={form.active ? "#00ff7b" : "#cbd5e1"}
              size={15}
            />
            {form.active ? "Conta ativa" : "Conta inativa"}
          </span>
        </div>

        <div
          className="email-main-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: 18,
            padding: "25px 0px",
          }}
        >
          <div
            className="email-form-wrap"
            style={{
              padding: 24,
              borderRadius: 15,
              background: "#fff",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                marginBottom: 20,
                padding: 18,
                borderRadius: 18,
                background: "linear-gradient(180deg, #f8fafc, #ffffff)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 4,
                }}
              >
                <Settings2 size={18} color="#2563eb" />
                <strong
                  style={{
                    color: "#0f172a",
                    fontSize: 15,
                    fontWeight: 900,
                  }}
                >
                  Configuração da conta
                </strong>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                Preencha os dados do servidor SMTP, credenciais e informações do
                remetente.
              </p>
            </div>

            {success && (
              <Alert type="success" message={success} />
            )}

            {error && (
              <Alert type="error" message={error} />
            )}

            <div
              className="email-form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
                maxWidth: 780,
              }}
            >
              <Field
                label="Servidor SMTP"
                icon={<Server size={15} color="#2563eb" />}
              >
                <input
                  style={inputStyle}
                  placeholder="smtp.seudominio.com.br"
                  value={form.host}
                  onChange={(e) => updateForm("host", e.target.value)}
                />
              </Field>

              <Field label="Porta">
                <input
                  type="number"
                  style={inputStyle}
                  placeholder="587"
                  value={form.port}
                  onChange={(e) => updateForm("port", Number(e.target.value))}
                />
              </Field>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="Usuário SMTP"
                  icon={<UserRound size={15} color="#0891b2" />}
                >
                  <input
                    style={inputStyle}
                    placeholder="usuario@seudominio.com.br"
                    value={form.username}
                    onChange={(e) => updateForm("username", e.target.value)}
                  />
                </Field>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="Senha SMTP"
                  icon={<KeyRound size={15} color="#9333ea" />}
                >
                  <input
                    type="password"
                    style={inputStyle}
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={(e) => updateForm("password", e.target.value)}
                  />
                </Field>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="E-mail remetente"
                  icon={<Mail size={15} color="#0891b2" />}
                >
                  <input
                    type="email"
                    style={inputStyle}
                    placeholder="notificacoes@seudominio.com.br"
                    value={form.fromEmail}
                    onChange={(e) => updateForm("fromEmail", e.target.value)}
                  />
                </Field>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="Nome do remetente"
                  icon={<BadgeCheck size={15} color="#2563eb" />}
                >
                  <input
                    style={inputStyle}
                    placeholder="Escrilex"
                    value={form.fromName}
                    onChange={(e) => updateForm("fromName", e.target.value)}
                  />
                </Field>
              </div>

              <ToggleRow
                icon={<Lock size={16} color={form.secure ? "#f59e0b" : "#94a3b8"} />}
                title="Utilizar SSL"
                description="Recomendado para conexões SMTP seguras."
                checked={form.secure}
                onChange={(checked) => updateForm("secure", checked)}
              />

              <ToggleRow
                icon={
                  <ShieldCheck
                    size={16}
                    color={form.active ? "#10b981" : "#94a3b8"}
                  />
                }
                title="Conta ativa"
                description="Define se esta conta poderá enviar notificações."
                checked={form.active}
                onChange={(checked) => updateForm("active", checked)}
              />

              <div
                className="email-actions"
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 8,
                  gridColumn: "1 / -1",
                }}
              >
                <button
                  type="button"
                  className="email-button"
                  style={secondaryButton}
                >
                  <Send size={15} color="#2563eb" />
                  Enviar teste
                </button>

                <button
                  type="button"
                  className="email-button"
                  style={{
                    ...primaryButton,
                    opacity: saving ? 0.75 : 1,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                  disabled={saving}
                  onClick={saveEmailAccount}
                >
                  <Save size={16} color="#7dd3fc" />
                  {saving ? "Salvando..." : "Salvar configurações"}
                </button>
              </div>
            </div>
          </div>

          <aside className="email-aside" style={{ padding: 0 }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 15,
                padding: 22,
                height: "100%",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                border: "1px solid #e2e8f0",
               
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -42,
                  right: -42,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: form.active
                    ? "rgba(16,185,129,.18)"
                    : "rgba(148,163,184,.16)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 19,
                    background: form.active
                      ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
                      : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: form.active
                      ? "0 14px 30px rgba(16,185,129,.25)"
                      : "0 10px 24px rgba(100,116,139,.12)",
                  }}
                >
                  <Wifi
                    size={25}
                    color={form.active ? "#10b981" : "#64748b"}
                  />
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: form.active ? "#ecfdf5" : "#f1f5f9",
                    color: form.active ? "#047857" : "#64748b",
                    border: form.active
                      ? "1px solid #bbf7d0"
                      : "1px solid #e2e8f0",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: form.active ? "#22c55e" : "#94a3b8",
                      boxShadow: form.active
                        ? "0 0 0 5px rgba(34,197,94,.14)"
                        : "none",
                    }}
                  />
                  {form.active ? "Ativa" : "Inativa"}
                </span>
              </div>

              <h3
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: 17,
                  fontWeight: 900,
                  letterSpacing: -0.2,
                }}
              >
                Resumo da conta
              </h3>

              <p
                style={{
                  margin: "8px 0 18px",
                  color: "#64748b",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                Esta conta será usada como remetente para notificações e
                mensagens automáticas.
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                <StatusCard
                  label="Host SMTP"
                  value={form.host || "Não informado"}
                  active={Boolean(form.host)}
                />

                <StatusCard
                  label="Porta"
                  value={String(form.port || "-")}
                  active={Boolean(form.port)}
                />

                <StatusCard
                  label="SSL"
                  value={form.secure ? "Ativo" : "Inativo"}
                  active={form.secure}
                />

                <StatusCard
                  label="Remetente"
                  value={form.fromName || "Não informado"}
                  active={Boolean(form.fromName)}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

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
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: "#1e293b",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
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
        background: checked
          ? "linear-gradient(135deg, #ffffff, #f0fdf4)"
          : "#f8fafc",
        color: checked ? "#334155" : "#94a3b8",
        cursor: "pointer",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}

        <span>
          <strong style={{ display: "block", fontSize: 13 }}>
            {title}
          </strong>
          <small style={{ color: "#64748b" }}>{description}</small>
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function Alert({ type, message }: { type: "success" | "error"; message: string }) {
  const success = type === "success";

  return (
    <div
      style={{
        marginBottom: 16,
        padding: "12px 14px",
        borderRadius: 14,
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

function StatusCard({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 7,
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid",
        borderColor: active ? "#bbf7d0" : "#e2e8f0",
        background: active
          ? "linear-gradient(135deg, #f0fdf4, #ecfdf5)"
          : "#f8fafc",
        boxShadow: active ? "0 6px 14px rgba(16,185,129,.12)" : "none",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>
        {label}
      </span>

      <strong
        style={{
          fontSize: 13,
          fontWeight: 900,
          color: active ? "#047857" : "#64748b",
          wordBreak: "break-word",
        }}
      >
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
  borderRadius: 14,
  border: "1px solid #012942",
  background: "#012942",
  color: "#fff",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 22px rgba(1, 41, 66, 0.24)",
  width: "210px",
  maxWidth: "210px",
  justifyContent: "center",
};

const secondaryButton: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#334155",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
  width: "210px",
  maxWidth: "210px",
  justifyContent: "center",
};