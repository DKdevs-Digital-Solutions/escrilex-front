import React from "react";
import { Badge, Empty, SectionCard, Table, Thead, Th, Tr, Td } from "../../ui";
import { StatusPicker, ItemStatus } from "./StatusPicker";
import { ClipboardList, CalendarClock, Building2 } from "lucide-react";

function isOverdue(dueDate?: string | null, status?: string) {
  if (!dueDate || status !== "PENDENTE") return false;
  return new Date(dueDate).getTime() < Date.now();
}

export function ChecklistRunSection({
  section,
  saving,
  onSetStatus,
  onSetObservation,
}: {
  section: any;
  saving: string;
  onSetStatus: (itemRunId: string, status: ItemStatus) => void;
  onSetObservation: (itemRunId: string, observation: string) => void;
}) {
  const totalItems = section.items?.length || 0;
  const doneItems =
    section.items?.filter((it: any) => it.status === "CONCLUIDO" || it.status === "NA").length || 0;

  return (
    <SectionCard
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eff6ff",
              color: "#BB9F58",
              border: "1px solid #dbeafe",
              flexShrink: 0,
            }}
          >
            <ClipboardList size={16} />console
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {section.name}
            </div>

            {section.description && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12.5,
                  color: "#64748b",
                  lineHeight: 1.35,
                }}
              >
                {section.description}
              </div>
            )}
          </div>
        </div>
      }
      action={
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 999,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            fontSize: 12,
            fontWeight: 800,
            color: "#475569",
            whiteSpace: "nowrap",
          }}
        >
          {doneItems}/{totalItems}
        </div>
      }
    >
      {section.items?.length ? (
        <div
          style={{
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Table>
            <Thead>
              <tr>
                <Th style={{ width: 90 }}>Código</Th>
                <Th>Item</Th>
                <Th style={{ width: 130 }}>Setor</Th>
                <Th style={{ width: 130 }}>Prazo</Th>
                <Th style={{ width: 190 }}>Status</Th>
                <Th style={{ width: 240 }}>Observação</Th>
              </tr>
            </Thead>

            <tbody>
              {section.items.map((it: any) => {
                const overdue = isOverdue(it.dueDate, it.status);
                const currentStatus: ItemStatus = it.status ?? "PENDENTE";

                return (
                  <Tr
                    key={it.templateItemId}
                    style={{
                      background: overdue ? "#fff8f6" : "#fff",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <Td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 58,
                          padding: "5px 8px",
                          borderRadius: 9,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          fontFamily: "monospace",
                          fontWeight: 800,
                          fontSize: 12,
                          color: "#334155",
                        }}
                      >
                        {it.code ?? "—"}
                      </span>
                    </Td>

                    <Td>
                      <div style={{ minWidth: 220 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13.5,
                            color: "#0f172a",
                            lineHeight: 1.4,
                          }}
                        >
                          {it.description}
                        </div>

                        {/* <div
                          style={{
                            display: "flex",
                            gap: 6,
                            marginTop: 7,
                            flexWrap: "wrap",
                          }}
                        >
                          {it.isRequired && <Badge label="Obrigatório" variant="blue" />}
                        </div> */}
                      </div>
                    </Td>

                    <Td>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 9px",
                          borderRadius: 10,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          color: "#475569",
                          fontSize: 12.5,
                          fontWeight: 700,
                          maxWidth: "100%",
                        }}
                      >
                        <Building2 size={13} />
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {it.sector?.name ?? "—"}
                        </span>
                      </div>
                    </Td>

                    <Td>
                      {it.dueDate ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: overdue ? "#b91c1c" : "#334155",
                            }}
                          >
                            <CalendarClock size={13} />
                            {new Date(it.dueDate).toLocaleDateString("pt-BR")}
                          </div>

                          {overdue && <Badge label="Vencido" variant="red" />}
                        </div>
                      ) : (
                        <span style={{ color: "#d1d5db" }}>—</span>
                      )}
                    </Td>

                    <Td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <StatusPicker
                          value={currentStatus}
                          disabled={true}
                          onChange={(status) => onSetStatus(it.itemRunId, status)}
                        />

                        {it.doneAt && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#94a3b8",
                              lineHeight: 1.35,
                            }}
                          >
                            {new Date(it.doneAt).toLocaleString("pt-BR")}
                          </div>
                        )}
                      </div>
                    </Td>

                    <Td>
                      <input
                      
                        style={{
                          width: "100%",
                          padding: "9px 11px",
                          fontSize: 13,
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          fontFamily: "inherit",
                          color: "#0f172a",
                          outline: "none",
                          background: !it.itemRunId ? "#f8fafc" : "#fff",
                          transition: "border-color 0.12s ease, box-shadow 0.12s ease",
                          boxSizing: "border-box",
                        }}
                        placeholder="Adicionar observação..."
                        defaultValue={it.observation ?? ""}
                        disabled={true}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2563eb";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.10)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.boxShadow = "none";
                          if (it.itemRunId) onSetObservation(it.itemRunId, e.target.value);
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <Empty message="Sem itens nesta seção." />
      )}
    </SectionCard>
  );
}