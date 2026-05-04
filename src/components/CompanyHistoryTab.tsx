import React from "react";
import { SectionCard, Empty, Table, Thead, Th, Tr, Td, IconBtn, Badge } from "../ui";
import { History, Maximize2, CalendarClock, PlayCircle, TimerReset } from "lucide-react";

type ChecklistType = "ENTRADA" | "SAIDA";

type Props = {
  historicoType: ChecklistType;
  setHistoricoType: (type: ChecklistType) => void;
  loadHistoricoRuns: (type: ChecklistType) => void | Promise<void>;
  historicoRuns: any[];
  onOpenRun: (runId: string) => void;
  softButtonStyle: (active?: boolean) => React.CSSProperties;
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

function getTypeLabel(type: ChecklistType) {
  return type === "ENTRADA" ? "Entrada" : "Saída";
}

function getFirstActionLabel(run: any) {
  if (run.firstDoneActionCode || run.firstDoneActionText) {
    return `${run.firstDoneActionCode ? run.firstDoneActionCode + " – " : ""}${
      run.firstDoneActionText ?? ""
    }`;
  }
  return null;
}

export function CompanyHistoryTab({
  historicoType,
  setHistoricoType,
  loadHistoricoRuns,
  historicoRuns,
  onOpenRun,
  softButtonStyle,
  cardShellStyle,
  UI,
}: Props) {
  const withAnchorCount = historicoRuns.filter((r) => !!r.anchorAt).length;
  const latestRun = historicoRuns[0];

  return (
    
      <div style={{ display: "grid", gap: 16,  backgroundColor:"#f1f4f9" }}>
        

        <div
      style={{
        padding: 20,
        borderRadius: 20,
        border: `1px solid ${UI.border}`,
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.10), transparent 34%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 260, flex: "1 1 520px" }}>
        

          <div
            style={{
              fontSize: 23,
              fontWeight: 950,
              color: UI.text,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Acompanhe as execuções anteriores
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 13.8,
              color: UI.textSoft,
              maxWidth: 760,
              lineHeight: 1.55,
            }}
          >
            Visualize as execuções já realizadas, consulte a âncora, a primeira ação registrada
            e abra qualquer execução para análise detalhada.
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              padding: "8px 11px",
              borderRadius: 999,
              background: historicoType === "ENTRADA" ? "#eff6ff" : "#f8fafc",
              border: `1px solid ${historicoType === "ENTRADA" ? "#bfdbfe" : "#e2e8f0"}`,
              color: historicoType === "ENTRADA" ? "#2c963e" : "#2563eb",
              fontSize: 12.5,
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: historicoType === "ENTRADA" ? "rgb(70, 186, 89)" : "rgb(98, 115, 198)",
                boxShadow:
                  historicoType === "ENTRADA"
                    ? "0 0 0 4px rgba(37,99,235,0.12)"
                    : "0 0 0 4px rgba(100,116,139,0.10)",
              }}
            />
            Tipo atual: {getTypeLabel(historicoType)}
          </div>
        </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                padding: 6,
                borderRadius: 16,
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
              }}
            >
              {(["ENTRADA", "SAIDA"] as ChecklistType[]).map((t) => {
                const active = historicoType === t;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setHistoricoType(t);
                      loadHistoricoRuns(t);
                    }}
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
                      color: active ? "#fff" : UI.textSoft,
                      fontSize: 13,
                      fontWeight: 850,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "inherit",
                      transition: "all 0.18s ease",
                      boxShadow: active
                        ? t === "ENTRADA"
                          ? "0 8px 18px rgba(37,99,235,0.24)"
                          : "0 8px 18px rgba(71,85,105,0.22)"
                        : "none",
                    }}
                  >
                    <History size={14} strokeWidth={2.4} />
                    {getTypeLabel(t)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>



        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <KpiCard
            icon={<History size={18} color="#22c55e" />}
            label="Execuções"
            value={historicoRuns.length}
            hint={`Total de runs de ${getTypeLabel(historicoType).toLowerCase()}`}
            UI={UI}
          />

          <KpiCard
            icon={<TimerReset size={18} color="#6d28d9" />}
            label="Com âncora"
            value={withAnchorCount}
            hint="Runs com referência definida"
            UI={UI}
          />

          <KpiCard
            icon={<CalendarClock size={18} color="orange" />}
            label="Mais recente"
            value={
              latestRun?.createdAt
                ? new Date(latestRun.createdAt).toLocaleDateString("pt-BR")
                : "—"
            }
            hint="Última execução criada"
            UI={UI}
          />
        </div>

        <div
          style={{
            ...cardShellStyle(),
            overflow: "hidden",
            boxShadow: UI.shadowSm,
          }}
        >
          {historicoRuns.length ? (
            <>
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${UI.border}`,
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
                      Lista de execuções
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 13,
                        color: UI.textSoft,
                      }}
                    >
                      Histórico completo das execuções registradas para este tipo.
                    </div>
                  </div>

                  <Badge label={`${historicoRuns.length} registros`} variant="gray" />
                </div>
              </div>

              <Table>
                <Thead>
                  <tr>
                    <Th>Criado em</Th>
                    <Th>Âncora</Th>
                    <Th>Primeira ação</Th>
                    <Th></Th>
                  </tr>
                </Thead>
                <tbody>
                  {historicoRuns.map((r: any) => {
                    const firstAction = getFirstActionLabel(r);

                    return (
                      <Tr key={r.id}>
                        <Td style={{ fontSize: 13 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span
                              style={{
                                fontWeight: 700,
                                color: UI.text,
                              }}
                            >
                              {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                            <span style={{ color: UI.textSoft }}>
                              {new Date(r.createdAt).toLocaleTimeString("pt-BR")}
                            </span>
                          </div>
                        </Td>

                        <Td style={{ fontSize: 13 }}>
                          {r.anchorAt ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: UI.text,
                                }}
                              >
                                {new Date(r.anchorAt).toLocaleDateString("pt-BR")}
                              </span>
                              <span style={{ color: UI.textSoft }}>
                                {new Date(r.anchorAt).toLocaleTimeString("pt-BR")}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: "#cbd5e1" }}>—</span>
                          )}
                        </Td>

                        <Td style={{ fontSize: 13 }}>
                          {firstAction ? (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 10px",
                                borderRadius: 10,
                                background: UI.surfaceSoft,
                                border: `1px solid ${UI.border}`,
                                maxWidth: 420,
                              }}
                            >
                              <PlayCircle size={15} color={UI.primary} />
                              <span
                                style={{
                                  color: UI.text,
                                  fontWeight: 600,
                                  lineHeight: 1.35,
                                }}
                              >
                                {firstAction}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: "#cbd5e1" }}>—</span>
                          )}
                        </Td>

                        <Td align="right">
                          <IconBtn
                            icon={<Maximize2 size={14} strokeWidth={2} />}
                            title="Abrir run"
                            onClick={() => onOpenRun(r.id)}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          ) : (
            <div style={{ padding: 18 }}>
              <Empty message="Nenhum run criado para este tipo." />
            </div>
          )}
        </div>
      </div>
  );
}