import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { useToast } from "../toast";
import { Badge, Card, SectionCard, Table, Thead, Th, Tr, Td, Empty, Loading } from "../ui";
import { ArrowLeft, ChevronDown, Clock, CheckCircle2, Hash, MinusCircle } from "lucide-react";

type ItemStatus = "PENDENTE" | "CONCLUIDO" | "EM_ANDAMENTO" | "NA";

const STATUS_CONFIG: Record<ItemStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  PENDENTE:     { label: "Pendente",     color: "#64748b", bg: "#f8fafc",  border: "#e2e8f0", icon: <Clock       size={13} strokeWidth={2} /> },
  EM_ANDAMENTO: { label: "Em andamento", color: "#d97706", bg: "#fffbeb",  border: "#fde68a", icon: <Hash       size={13} strokeWidth={2.5} /> },
  CONCLUIDO:        { label: "Concluído",    color: "#16a34a", bg: "#f0fdf4",  border: "#bbf7d0", icon: <CheckCircle2 size={13} strokeWidth={2} /> },
  NA:           { label: "Não se aplica",color: "#94a3b8", bg: "#f1f5f9",  border: "#e2e8f0", icon: <MinusCircle  size={13} strokeWidth={2} /> },
};

function StatusPicker({ value, onChange, disabled }: {
  value: ItemStatus; onChange: (s: ItemStatus) => void; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[value] ?? STATUS_CONFIG.PENDENTE;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 10px 5px 8px", borderRadius: 7,
          border: `1.5px solid ${cfg.border}`,
          background: cfg.bg, color: cfg.color,
          fontSize: 12.5, fontWeight: 600, fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.12s",
          opacity: disabled ? 0.55 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {cfg.icon}
        {cfg.label}
        <ChevronDown size={11} strokeWidth={2.5} style={{ marginLeft: 2, opacity: 0.6 }} />
      </button>

      {open && (() => {
        const el = ref.current?.getBoundingClientRect();
        return (
          <div style={{
            position: "fixed", top: el ? el.bottom + 5 : 0, left: el ? el.left : 0, zIndex: 9999,
            background: "#fff", borderRadius: 10, border: "1.5px solid #e2e8f0",
            boxShadow: "0 8px 24px rgba(15,23,42,0.13)",
            minWidth: 168, overflow: "hidden",
            animation: "dropIn 0.12s ease",
          }}>
            <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }`}</style>
            {(Object.entries(STATUS_CONFIG) as [ItemStatus, typeof STATUS_CONFIG[ItemStatus]][]).map(([k, c]) => (
              <button key={k} onClick={() => { onChange(k); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%",
                  padding: "9px 14px", border: "none", background: k === value ? "#f8fafc" : "#fff",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: k === value ? 700 : 500,
                  color: c.color, textAlign: "left", transition: "background 0.1s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
                onMouseOut={e => { e.currentTarget.style.background = k === value ? "#f8fafc" : "#fff"; }}
              >
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: 6, background: c.bg, border: `1.5px solid ${c.border}`,
                  flexShrink: 0,
                }}>
                  {c.icon}
                </span>
                {c.label}
                {k === value && <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>✓</span>}
              </button>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

function isOverdue(dueDate?: string | null, status?: string) {
  if (!dueDate || status !== "PENDENTE") return false;
  return new Date(dueDate).getTime() < Date.now();
}

export function ChecklistRun({ runId, onBack }: { runId: string; onBack: () => void }) {
  const { toast } = useToast();
  const [run, setRun] = useState<any>(null);
  const [saving, setSaving] = useState<string>("");

  async function load() { setRun(await api(`/api/checklists/run/${runId}`)); }
  useEffect(() => { load(); }, [runId]);

  async function setStatus(itemRunId: string, status: ItemStatus) {
    setSaving(itemRunId);
    try {
      await api(`/api/checklists/item/${itemRunId}`, { method: "PATCH", body: JSON.stringify({ status: status }) });
      await load();
    } catch (e: any) { toast(e.message || "Erro ao atualizar", "error"); }
    finally { setSaving(""); }
  }

  async function setObservation(itemRunId: string, observation: string) {
    setSaving(itemRunId);
    try {
      await api(`/api/checklists/item/${itemRunId}`, { method: "PATCH", body: JSON.stringify({ observation }) });
    } catch (e: any) { toast(e.message || "Erro ao salvar observação", "error"); }
    finally { setSaving(""); }
  }

  if (!run) return <Loading message="Carregando checklist..." />;

  const totalItems = run.template.sections.reduce((a: number, s: any) => a + s.items.length, 0);
  const doneItems = run.template.sections.reduce((a: number, s: any) =>
    a + s.items.filter((it: any) => it.status === "CONCLUIDO" || it.status === "NA").length, 0);
  const pct = totalItems > 0 ? Math.round(doneItems / totalItems * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} title="Voltar"
          style={{
            width: 36, height: 36, borderRadius: 9, border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#64748b", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.12s", flexShrink: 0,
          }}
          onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
          onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 3px", fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Checklist {run.type === "ENTRADA" ? "de Entrada" : "de Saída"}
          </h1>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            {run.company?.cnpj} — {run.company?.razaoSocial ?? run.company?.nomeFantasia ?? "(sem nome)"}
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em", color: pct === 100 ? "#16a34a" : "#0f172a" }}>
            {pct}%
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{doneItems} / {totalItems} itens</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 99,
          background: pct === 100 ? "#22c55e" : "#2563eb",
          transition: "width 0.5s ease",
        }} />
      </div>

      {/* Meta */}
      <div style={{
        background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10,
        padding: "10px 18px", marginBottom: 24,
        display: "flex", gap: 24, flexWrap: "wrap", fontSize: 12.5, color: "#64748b",
      }}>
        <span><span style={{ color: "#94a3b8" }}>Template:</span> {run.template?.name} v{run.template?.version}</span>
        <span><span style={{ color: "#94a3b8" }}>Criado:</span> {new Date(run.createdAt).toLocaleString("pt-BR")}</span>
        <span><span style={{ color: "#94a3b8" }}>Âncora:</span> {run.anchorAt ? new Date(run.anchorAt).toLocaleString("pt-BR") : "—"}</span>
      </div>

      {run.template.sections.map((s: any) => (
        <SectionCard key={s.id} title={s.name}>
          <Table>
            <Thead>
              <tr>
                <Th style={{ width: 80 }}>Código</Th>
                <Th>Item</Th>
                <Th style={{ width: 100 }}>Setor</Th>
                <Th style={{ width: 110 }}>Prazo</Th>
                <Th style={{ width: 180 }}>Status</Th>
                <Th style={{ width: 200 }}>Observação</Th>
              </tr>
            </Thead>
            <tbody>
              {s.items.map((it: any) => {
                const overdue = isOverdue(it.dueDate, it.status);
                const currentStatus: ItemStatus = it.status ?? "PENDENTE";
                return (
                  <Tr key={it.templateItemId} style={{ background: overdue ? "#fffbf9" : undefined }}>
                    <Td>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12 }}>{it.code ?? "—"}</span>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 500, fontSize: 13.5 }}>{it.description}</div>
                      {it.isRequired && <Badge label="Obrigatório" variant="blue" />}
                    </Td>
                    <Td style={{ fontSize: 12.5, color: "#6b7280" }}>{it.sector?.name ?? "—"}</Td>
                    <Td>
                      {it.dueDate ? (
                        <div>
                          <div style={{ fontSize: 12.5 }}>{new Date(it.dueDate).toLocaleDateString("pt-BR")}</div>
                          {overdue && <Badge label="Vencido" variant="red" />}
                        </div>
                      ) : <span style={{ color: "#d1d5db" }}>—</span>}
                    </Td>
                    <Td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <StatusPicker
                          value={currentStatus}
                          disabled={!it.itemRunId || saving === it.itemRunId}
                          onChange={s => setStatus(it.itemRunId, s)}
                        />
                        {it.doneAt && (
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>
                            {new Date(it.doneAt).toLocaleString("pt-BR")}
                          </div>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <input
                        style={{
                          width: "100%", padding: "7px 9px", fontSize: 13,
                          border: "1.5px solid #e2e8f0", borderRadius: 8,
                          fontFamily: "inherit", color: "#0f172a", outline: "none",
                          transition: "border-color 0.12s, box-shadow 0.12s",
                          background: !it.itemRunId ? "#f8fafc" : "#fff",
                        }}
                        placeholder="Observação..."
                        defaultValue={it.observation ?? ""}
                        disabled={!it.itemRunId || saving === it.itemRunId}
                        onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                        onBlur={e => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.boxShadow = "none";
                          if (it.itemRunId) setObservation(it.itemRunId, e.target.value);
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
          {!s.items.length && <Empty message="Sem itens nesta seção." />}
        </SectionCard>
      ))}
    </div>
  );
}
