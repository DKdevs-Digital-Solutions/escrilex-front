import React from "react";
import { Badge, Empty, Loading, Table, Thead, Th, Tr, Td } from "../ui";
import { ClipboardCheck, Maximize2, ListChecks, TimerReset, CheckCircle2 } from "lucide-react";

type ChecklistType = "ENTRADA" | "SAIDA";
type ItemStatusFull = "PENDENTE" | "CONCLUIDO" | "EM_ANDAMENTO" | "NA";

type Props = {
  checklistType: ChecklistType;
  setChecklistType: (type: ChecklistType) => void | Promise<void>;
  loadingChecklist: boolean;
  run?: any;
  onOpenRun: (runId: string) => void;
  doneItems: number;
  totalItems: number;
  pct: number;
  sections: any[];
  savingItem: string;
  draftObs: Record<string, string>;
  setDraftObs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setStatus: (templateItemId: string, itemRunId: string | undefined, status: ItemStatusFull) => void;
  saveObservation: (templateItemId: string, itemRunId?: string) => void;
  fmtDate: (v?: string | null) => string | null;
  isOverdue: (dueDate?: string | null, status?: any) => boolean;
  StatusPicker: React.ComponentType<{
    value: ItemStatusFull;
    onChange: (s: ItemStatusFull) => void;
    disabled?: boolean;
  }>;
  softButtonStyle: (active?: boolean) => React.CSSProperties;
  ghostButtonStyle: () => React.CSSProperties;
  cardShellStyle: () => React.CSSProperties;
  UI: {
    text: string;
    textSoft: string;
    textMuted: string;
    border: string;
    borderSoft: string;
    surface: string;
    surfaceSoft: string;
    primary: string;
    primarySoft: string;
    shadowSm: string;
    shadowMd: string;
    radius: number;
    radiusSm: number;
    bg: string;
  };
  checklistTemplate: any;
};

function KpiCard({
  icon,
  label,
  value,
  hint,
  UI,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
  UI: Props["UI"];
}) {
  return (
    <div
      style={{
        minWidth: 180,
        flex: "1 1 180px",
        padding: "16px 18px",
        borderRadius: 16,
        background: "#fff",
        border: `1px solid ${UI.border}`,
        boxShadow: UI.shadowSm,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: UI.primarySoft,
          color: UI.primary,
          border: `1px solid ${UI.border}`,
          marginBottom: 10,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: UI.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: UI.text,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      {hint && (
        <div
          style={{
            marginTop: 6,
            fontSize: 12.5,
            color: UI.textSoft,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  section,
  UI,
}: {
  section: any;
  UI: Props["UI"];
}) {
  const completed =
    section.items?.filter((it: any) => it.status === "CONCLUIDO" || it.status === "NA").length || 0;
  const total = section.items?.length || 0;

  return (
    <div
      style={{
        padding: "16px 18px",
        borderBottom: `1px solid ${UI.borderSoft}`,
        background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: UI.text,
            }}
          >
            {section.name}
          </div>

          {section.description && (
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: UI.textSoft,
              }}
            >
              {section.description}
            </div>
          )}
        </div>

        <Badge label={`${completed}/${total}`} variant="gray" />
      </div>
    </div>
  );
}

function ChecklistRow({
  item,
  savingItem,
  draftObs,
  setDraftObs,
  setStatus,
  saveObservation,
  fmtDate,
  isOverdue,
  StatusPicker,
  UI,
}: {
  item: any;
  savingItem: string;
  draftObs: Record<string, string>;
  setDraftObs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setStatus: (templateItemId: string, itemRunId: string | undefined, status: ItemStatusFull) => void;
  saveObservation: (templateItemId: string, itemRunId?: string) => void;
  fmtDate: (v?: string | null) => string | null;
  isOverdue: (dueDate?: string | null, status?: any) => boolean;
  StatusPicker: Props["StatusPicker"];
  UI: Props["UI"];
}) {
  const status: ItemStatusFull = (item.status || "PENDENTE") as ItemStatusFull;
  const overdue = isOverdue(item.dueDate, item.status ?? "PENDENTE");
  const itemRunId = item.itemRunId as string | undefined;
  const tplItemId = item.templateItemId ?? item.id ?? item.itemId;
  const obsValue = itemRunId ? draftObs[itemRunId] ?? item.observation ?? "" : "";

  return (
    <Tr key={tplItemId}>
      <Td>
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 12,
            color: UI.textSoft,
            
          }}
        >
          {item.code ?? "—"}
        </span>
      </Td>

      <Td>
        <div style={{ minWidth: 260 }}>
          <div
            style={{
              fontWeight: 700,
              color: UI.text,
              fontSize: 13.5,
              lineHeight: 1.35,
            }}
          >
            {item.description ?? item.name}
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 6,
              flexWrap: "wrap",
            }}
          >
            {item.isRequired && <Badge label="Obrigatório" variant="red" />}
            {item.dueDate && (
              <Badge
                label={`Prazo ${fmtDate(item.dueDate)}`}
                variant={overdue ? "red" : "gray"}
              />
            )}
          </div>
        </div>
      </Td>


      <Td>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StatusPicker
            value={status}
            disabled={savingItem === tplItemId}
            onChange={(next) => setStatus(tplItemId, itemRunId, next)}
          />

          {item.doneAt && (
            <div style={{ fontSize: 11, color: UI.textMuted }}>
              {new Date(item.doneAt).toLocaleString("pt-BR")}
            </div>
          )}
        </div>
      </Td>

      <Td style={{ minWidth: 300 }}>
        <input
          style={{
            width: "100%",
            padding: "9px 10px",
            fontSize: 13,
            border: `1px solid ${UI.border}`,
            borderRadius: 10,
            color: UI.text,
            background: "#fff",
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.12s, box-shadow 0.12s",
          }}
          value={obsValue}
          placeholder={
            itemRunId
              ? "Observação..."
              : "Defina o status antes de adicionar observação"
          }
          onChange={(e) => {
            if (!itemRunId) return;
            const v = e.target.value;
            setDraftObs((prev) => ({ ...prev, [itemRunId]: v }));
          }}
          onFocus={(e) => {
            e.target.style.borderColor = UI.primary;
            e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.10)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = UI.border;
            e.target.style.boxShadow = "none";
            if (itemRunId) saveObservation(tplItemId, itemRunId);
          }}
          disabled={savingItem === tplItemId || !itemRunId}
        />
      </Td>
    </Tr>
  );
}

export function CompanyChecklistTab({
  checklistType,
  setChecklistType,
  loadingChecklist,
  run,
  onOpenRun,
  doneItems,
  totalItems,
  pct,
  sections,
  savingItem,
  draftObs,
  setDraftObs,
  setStatus,
  saveObservation,
  fmtDate,
  isOverdue,
  StatusPicker,
  softButtonStyle,
  ghostButtonStyle,
  cardShellStyle,
  UI,
  checklistTemplate
}: Props) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          ...cardShellStyle(),
          padding: 18,
          background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            

            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: UI.text,
                lineHeight: 1.1,
              }}
            >
              Acompanhe a execução por etapa
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 13.5,
                color: UI.textSoft,
                maxWidth: 760,
              }}
            >
              Visualize o andamento, altere status, registre observações e acompanhe o progresso
              da operação de entrada ou saída com mais clareza.
            </div>
          </div>

          <div
  style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  }}
>
  {/* SEGMENTED CONTROL */}
  <div
    style={{
      display: "flex",
      padding: 6,
      borderRadius: 16,
      background: "rgba(255,255,255,0.85)",
      border: "1px solid #e2e8f0",
      boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
      gap: 6,
    }}
  >
    {(["ENTRADA", "SAIDA"] as ChecklistType[]).map((t) => {
      const active = checklistType === t;

      return (
        <button
          key={t}
          onClick={() => setChecklistType(t)}
          style={{
            height: 40,
            padding: "0 14px",
            borderRadius: 12,
            border: "none",
            background: active
              ? t === "ENTRADA"
                ? "linear-gradient(135deg, rgb(70, 186, 89), rgb(43, 153, 120))"
                : "linear-gradient(135deg, rgb(98, 115, 198), #2563eb)"
              : "transparent",
            color: active ? "#fff" : "#475569",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "inherit",
            transition: "all 0.18s ease",
            boxShadow: active
              ? t === "ENTRADA"
                ? "0 8px 18px rgba(37,99,235,0.25)"
                : "0 8px 18px rgba(71,85,105,0.25)"
              : "none",
          }}
          onMouseEnter={(e) => {
            if (active) return;
            e.currentTarget.style.background = "#f1f5f9";
          }}
          onMouseLeave={(e) => {
            if (active) return;
            e.currentTarget.style.background = "transparent";
          }}
        >
          <ClipboardCheck size={14} strokeWidth={2.4} />
          {t === "ENTRADA"
            ? "Checklist de entrada"
            : "Checklist de saída"}
        </button>
      );
        })}
      </div>

      {/* BOTÃO SECUNDÁRIO */}
      {!loadingChecklist && run?.id && (
        <button
          onClick={() => onOpenRun(run.id)}
          title="Abrir em tela cheia"
          style={{
            height: 55,
            padding: "0 14px",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            background: "#fff",
            color: "#475569",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.18s ease",
            boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "#f8fafc";
            el.style.transform = "translateY(-1px)";
            el.style.boxShadow = "0 8px 20px rgba(15,23,42,0.10)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "#fff";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 4px 12px rgba(15,23,42,0.05)";
          }}
        >
          <Maximize2 size={14} strokeWidth={2.4} />
          Tela cheia
        </button>
      )}
          </div>
        </div>
      </div>

      {!loadingChecklist && (
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <KpiCard
            icon={<ListChecks size={18} color="#22c55e" />}
            label="Itens concluídos"
            value={`${doneItems}/${totalItems}`}
            hint="Total executado"
            UI={UI}
          />
          <KpiCard
            icon={<CheckCircle2 size={18} color="#d45ddf" />}
            label="Progresso"
            value={`${pct}%`}
            hint="Percentual atual"
            UI={UI}
          />
          <KpiCard
            icon={<TimerReset size={18} color="orange" />}
            label="Âncora"
            value={
              run
                ? run.anchorAt
                  ? new Date(run.anchorAt).toLocaleString("pt-BR")
                  : "Não definida"
                : "Ainda não iniciada"
            }
            hint="Referência do checklist"
            UI={UI}
          />
        </div>
      )}

      {!loadingChecklist && (
        <div
          style={{
            ...cardShellStyle(),
            padding: 18,
            background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: UI.textMuted,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                Progresso do checklist
              </div>

              <div style={{ fontSize: 22, fontWeight: 800, color: UI.text }}>
                {doneItems} de {totalItems} itens
              </div>

              <div style={{ fontSize: 13, color: UI.textSoft, marginTop: 5 }}>
                {run
                  ? `Âncora: ${
                      run.anchorAt
                        ? new Date(run.anchorAt).toLocaleString("pt-BR")
                        : "não definida"
                    }`
                  : "O checklist começa no primeiro check"}
              </div>
            </div>

            <div style={{ minWidth: 260, flex: 1, maxWidth: 460 }}>
              <div
                style={{
                  height: 12,
                  background: "#eef2f7",
                  borderRadius: 999,
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    transition: "width 0.25s ease",
                    background:
                      pct >= 100
                        ? "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)"
                        : "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                    borderRadius: 999,
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12.5,
                  color: UI.textMuted,
                  fontWeight: 600,
                }}
              >
                <span>{pct}% concluído</span>
                <span>{totalItems - doneItems} restantes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingChecklist ? (
        <Loading message="Carregando checklist..." />
      ) : checklistTemplate?.sections?.length === 0 ? (
        <Empty message="Nenhum template/checklist encontrado." />
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {checklistTemplate?.sections?.map((section: any) => (
            <div
              key={section.id}
              style={{
                ...cardShellStyle(),
                overflow: "hidden",
              }}
            >
              <SectionHeader section={section} UI={UI} />

              <div style={{ padding: 14 }}>
                <div
                  style={{
                    ...cardShellStyle(),
                    boxShadow: UI.shadowSm,
                    overflow: "hidden",
                  }}
                >
                  <Table>
                    <Thead>
                      <tr>
                        <Th>Código</Th>
                        <Th>Descrição</Th>
                        <Th>Status</Th>
                        <Th>Observação</Th>
                      </tr>
                    </Thead>
                    <tbody>
                    {section.items?.map((item: any) => (
                      <ChecklistRow
                        key={item.templateItemId ?? item.id ?? item.itemId}
                        item={item}
                        savingItem={savingItem}
                        draftObs={draftObs}
                        setDraftObs={setDraftObs}
                        setStatus={setStatus}
                        saveObservation={saveObservation}
                        fmtDate={fmtDate}
                        isOverdue={isOverdue}
                        StatusPicker={StatusPicker}
                        UI={UI}
                      />
                    ))}
                  </tbody>
                  </Table>

                  {!section.items?.length && <Empty message="Nenhum item nesta seção." />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}