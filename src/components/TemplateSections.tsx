import React from "react";
import { SectionCard, Table, Thead, Th, Tr, Td, Empty, Toggle, IconBtn, Badge } from "../ui";
import { Trash2, FilePlus, FolderTree, Hash, CalendarClock, ShieldCheck } from "lucide-react";

type Props = {
  sections: any[];
  sectors: any[];
  inlineInput: React.CSSProperties;
  onSectionOrderChange: (sectionId: string, value: number) => void;
  onAddItem: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onUpdateItem: (itemId: string, patch: any) => void;
  onDeleteItem: (itemId: string) => void;
};

const thStyle: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 800,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "0 16px 8px 16px",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderTop: "1px solid #eef2f7",
  borderBottom: "1px solid #eef2f7",
  background: "#fff",
};

function PrimaryMiniBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "13.5px 12px",
        fontSize: 12.5,
        fontWeight: 700,
        borderRadius: 10,
        border: "1px solid",
        background: "#012942",
        color: "#fff",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.16s ease",
      }}
      
    >
      {children}
    </button>
  );
}

export function TemplateSections({
  sections,
  sectors,
  inlineInput,
  onSectionOrderChange,
  onAddItem,
  onDeleteSection,
  onUpdateItem,
  onDeleteItem,
}: Props) {
  if (!sections?.length) {
    return (
      <SectionCard title="Seções">
        <Empty message="Sem seções. Clique em 'Nova seção' para adicionar." />
      </SectionCard>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {sections.map((s: any, index: number) => (
        <SectionCard
          key={s.id}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "#012942",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 18px rgba(37,99,235,0.20)",
                  flexShrink: 0,
                }}
              >
                <FolderTree size={15} strokeWidth={2.2} style={{color:"#fff"}} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  Seção {index + 1} • {s.items?.length || 0} item(ns)
                </div>
              </div>
            </div>
          }
          action={
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent:"flex-end" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 10px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#64748b",
                  }}
                >
                  Ordem
                </span>
                <input
                  type="number"
                  value={s.order}
                  title="Ordem"
                  style={{
                    ...inlineInput,
                    width: 56,
                    textAlign: "center",
                    padding: "6px 8px",
                    background: "#fff",
                  }}
                  onChange={(e) => onSectionOrderChange(s.id, Number(e.target.value))}
                />
              </div>

              <PrimaryMiniBtn onClick={() => onAddItem(s.id)}>
                <FilePlus size={15} strokeWidth={2.4} />
                Novo item
              </PrimaryMiniBtn>

              <IconBtn
                icon={<Trash2 size={13} strokeWidth={2} />}
                title="Excluir seção"
                onClick={() => onDeleteSection(s.id)}
                variant="danger"
              />
            </div>
          }
        >
          <div style={{ overflowX: "auto" }}>
            <Table
             
            >
              <Thead>
                <tr style={{position:"relative", margin:"10px", top:"5px"}}>
                  <Th style={{ ...thStyle, width: 100 }}>Código</Th>
                  <Th style={thStyle}>Descrição</Th>
                  <Th style={{ ...thStyle, width: 180 }}>Setor</Th>
                  <Th style={{ ...thStyle, width: 100 }}>Obrig.</Th>
                  <Th style={{ ...thStyle, width: 180 }}>Prazo</Th>
                  <Th style={{ ...thStyle, width: 90 }}>Param.</Th>
                  <Th style={{ ...thStyle, width: 60 }}></Th>
                </tr>
              </Thead>

              <tbody>
                {s.items.map((it: any) => (
                  <Tr
                    key={it.id}
                    style={{
                      transition: "all 0.16s ease",
                    }}
                   
                  >
                    <Td
                      style={{
                        ...tdStyle,
                        borderLeft: "1px solid #eef2f7",
                        borderTopLeftRadius: 14,
                        borderBottomLeftRadius: 14,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Hash size={13} strokeWidth={2.2} color="#94a3b8" />
                        <input
                          defaultValue={it.code || ""}
                          style={{
                            ...inlineInput,
                            width: 76,
                            background: "#fff",
                          }}
                          onBlur={(e) =>
                            onUpdateItem(it.id, { code: e.target.value.trim() || null })
                          }
                        />
                      </div>
                    </Td>

                    <Td style={tdStyle}>
                      <input
                        defaultValue={it.description}
                        style={{
                          ...inlineInput,
                          width: "100%",
                          minWidth: 260,
                          background: "#fff",
                        }}
                        onBlur={(e) =>
                          onUpdateItem(it.id, { description: e.target.value })
                        }
                      />
                    </Td>

                    <Td style={tdStyle}>
                      <select
                        defaultValue={it.sectorId || ""}
                        onChange={(e) =>
                          onUpdateItem(it.id, { sectorId: e.target.value || null })
                        }
                        style={{
                          ...inlineInput,
                          width: 150,
                          cursor: "pointer",
                          background: "#fff",
                          
                        }}
                      >
                        <option value="">(nenhum)</option>
                        {sectors.map((sec) => (
                          <option key={sec.id} value={sec.id}>
                            {sec.name}
                          </option>
                        ))}
                      </select>
                    </Td>

                    <Td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Toggle
                          checked={!!it.isRequired}
                          onChange={(v) => onUpdateItem(it.id, { isRequired: v })}
                        />
                        {/* <Badge
                          label={it.isRequired ? "Obrigatório" : "Opcional"}
                          variant={it.isRequired ? "green" : "gray"}
                        /> */}
                      </div>
                    </Td>

                    <Td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <select
                          defaultValue={it.dueRuleType || "OFFSET_DAYS"}
                          onChange={(e) =>
                            onUpdateItem(it.id, { dueRuleType: e.target.value })
                          }
                          style={{
                            ...inlineInput,
                            width: 150,
                            cursor: "pointer",
                            background: "#fff",
                          }}
                        >
                          <option value="OFFSET_DAYS">D+N</option>
                          <option value="DAY_OF_NEXT_MONTH">Dia X do mês</option>
                        </select>
                      </div>
                    </Td>

                    <Td style={tdStyle}>
                      <input
                        type="number"
                        defaultValue={it.dueRuleParam ?? ""}
                        style={{
                          ...inlineInput,
                          width: 72,
                          background: "#fff",
                        }}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          onUpdateItem(it.id, {
                            dueRuleParam: v ? Number(v) : null,
                          });
                        }}
                      />
                    </Td>

                    <Td
                      align="right"
                      style={{
                        ...tdStyle,
                        borderRight: "1px solid #eef2f7",
                        borderTopRightRadius: 14,
                        borderBottomRightRadius: 14,
                      }}
                    >
                      <IconBtn
                        icon={<Trash2 size={13} strokeWidth={2} />}
                        title="Excluir item"
                        onClick={() => onDeleteItem(it.id)}
                        variant="danger"
                      />
                    </Td>
                  </Tr>
                ))}

                {!s.items.length && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: 13,
                        border: "1px dashed #e2e8f0",
                        borderRadius: 14,
                        background: "#fcfdff",
                      }}
                    >
                      Sem itens nesta seção. Clique em <strong>Novo item</strong> para adicionar.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}