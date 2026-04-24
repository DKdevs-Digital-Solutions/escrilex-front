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
    <SectionCard
        title=""
        style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
            marginBottom: 0,
        }}
        headerStyle={{
            background: "transparent",
            borderBottom: "none",
            padding: "10px 0 18px 0",
        }}
      action={
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: "100%", justifyContent: "flex-end", padding: "5px 0 18px 0" }}>
          {(["ENTRADA", "SAIDA"] as ChecklistType[]).map((t) => (
            <button
            className="btn"
              key={t}
              onClick={() => {
                setHistoricoType(t);
                loadHistoricoRuns(t);
              }}
              style={softButtonStyle(historicoType === t)}
            >
              <History size={14} strokeWidth={2} />
              {getTypeLabel(t)}
            </button>
          ))}
        </div>
      }
    >
      <div style={{ display: "grid", gap: 16,  backgroundColor:"#f1f4f9" }}>
        <div
          style={{
            padding: 18,
            background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
            borderRadius: "0px 0px 10px 10px",
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
            <div style={{ minWidth: 0}}>
              

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: UI.text,
                  lineHeight: 1.1,
                }}
              >
                Acompanhe as execuções anteriores
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 13.5,
                  color: UI.textSoft,
                  maxWidth: 760,
                }}
              >
                Visualize as execuções já realizadas, consulte a âncora, a primeira ação registrada
                e abra qualquer execução para análise detalhada.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Badge
                label={`Tipo: ${getTypeLabel(historicoType)}`}
                variant={historicoType === "ENTRADA" ? "blue" : "gray"}
              />
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
    </SectionCard>
  );
}