import React from "react";
import { SectionCard, Empty } from "../ui";
import {
  Save,
  ShieldCheck,
  Mail,
  Building2,
  Briefcase,
  Scale,
  Landmark,
  Calculator,
  FileText,
  Users,
  Megaphone,
  Factory,
  ClipboardList,
  Headset,
  Truck,
  Wrench,
  FolderKanban,
} from "lucide-react";



type SectorItem = {
  id: string;
  name: string;
};

type UserItem = {
  id: string;
  name: string;
  email?: string | null;
};

type Props = {
  sectors: SectorItem[];
  users: UserItem[];
  responsibleMap: Map<string, string>;
  savingResp?: boolean;
  onSave: () => void;
  onChangeResponsible: (sectorId: string, userId: string) => void;
  primaryButtonStyle: (disabled?: boolean) => React.CSSProperties;
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
  };
};


type SectorVisual = {
  icon: React.ReactNode;
  bg: string;
  color: string;
  border: string;
};

function getSectorVisual(sectorName?: string): SectorVisual {
  const name = (sectorName || "").toLowerCase().trim();

  const presets: { match: string[]; visual: SectorVisual }[] = [
    {
      match: ["financeiro", "finanças", "fiscal"],
      visual: {
        icon: <Landmark size={18} />,
        bg: "#ecfeff",
        color: "#0f766e",
        border: "#99f6e4",
      },
    },
    {
      match: ["contábil", "contabil", "contador", "contabilidade"],
      visual: {
        icon: <Calculator size={18} />,
        bg: "#eff6ff",
        color: "#1d4ed8",
        border: "#bfdbfe",
      },
    },
    {
      match: ["jurídico", "juridico", "legal", "contratos"],
      visual: {
        icon: <Scale size={18} />,
        bg: "#f5f3ff",
        color: "#6d28d9",
        border: "#ddd6fe",
      },
    },
    {
      match: ["rh", "recursos humanos", "pessoas", "dp", "departamento pessoal"],
      visual: {
        icon: <Users size={18} />,
        bg: "#fff7ed",
        color: "#c2410c",
        border: "#fed7aa",
      },
    },
    {
      match: ["comercial", "vendas", "negócios", "negocios"],
      visual: {
        icon: <Briefcase size={18} />,
        bg: "#fefce8",
        color: "#a16207",
        border: "#fde68a",
      },
    },
    {
      match: ["marketing", "mídia", "midia"],
      visual: {
        icon: <Megaphone size={18} />,
        bg: "#fff1f2",
        color: "#be123c",
        border: "#fecdd3",
      },
    },
    {
      match: ["produção", "producao", "industrial", "fábrica", "fabrica"],
      visual: {
        icon: <Factory size={18} />,
        bg: "#f0fdf4",
        color: "#15803d",
        border: "#bbf7d0",
      },
    },
    {
      match: ["operações", "operacoes", "processos"],
      visual: {
        icon: <ClipboardList size={18} />,
        bg: "#f8fafc",
        color: "#334155",
        border: "#cbd5e1",
      },
    },
    {
      match: ["suporte", "atendimento", "customer success", "cs"],
      visual: {
        icon: <Headset size={18} />,
        bg: "#eef2ff",
        color: "#4338ca",
        border: "#c7d2fe",
      },
    },
    {
      match: ["logística", "logistica", "expedição", "expedicao"],
      visual: {
        icon: <Truck size={18} />,
        bg: "#fff7ed",
        color: "#9a3412",
        border: "#fdba74",
      },
    },
    {
      match: ["manutenção", "manutencao", "técnico", "tecnico"],
      visual: {
        icon: <Wrench size={18} />,
        bg: "#fef2f2",
        color: "#b91c1c",
        border: "#fecaca",
      },
    },
    {
      match: ["administrativo", "admin", "gestão", "gestao"],
      visual: {
        icon: <FolderKanban size={18} />,
        bg: "#f8fafc",
        color: "#475569",
        border: "#cbd5e1",
      },
    },
    {
      match: ["documentos", "documentação", "documentacao"],
      visual: {
        icon: <FileText size={18} />,
        bg: "#faf5ff",
        color: "#7e22ce",
        border: "#e9d5ff",
      },
    },
  ];

  const found = presets.find((p) => p.match.some((term) => name.includes(term)));
  if (found) return found.visual;

  return {
    icon: <Building2 size={18} />,
    bg: "#eff6ff",
    color: "#2563eb",
    border: "#bfdbfe",
  };
}

function getInitials(name?: string) {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "—";
}


function RowCard({
  sectorName,
  selectedUserId,
  selectedUser,
  users,
  onChange,
  UI,
}: {
  sectorName: string;
  selectedUserId: string;
  selectedUser: UserItem | null;
  users: UserItem[];
  onChange: (userId: string) => void;
  UI: Props["UI"];
}) {
  const sectorVisual = getSectorVisual(sectorName);

  return (
    <div
    style={{
        display: "grid",
        gridTemplateColumns: "minmax(220px, 1.1fr) minmax(240px, 1fr) minmax(220px, 1fr)",
        gap: 14,
        alignItems: "center",
        padding: 16,
        borderBottom: `1px solid ${UI.borderSoft}`,
        background: `linear-gradient(90deg, ${sectorVisual.bg} 0%, #ffffff 22%)`,
    }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: sectorVisual.bg,
              border: `1px solid ${sectorVisual.border}`,
              color: sectorVisual.color,
              flexShrink: 0,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
            }}
          >
            {sectorVisual.icon}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: UI.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 3,
              }}
            >
              Setor
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: UI.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {sectorName}
            </div>
          </div>
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: UI.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 8,
          }}
        >
          Responsável
        </div>

        <select
          value={selectedUserId}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            minWidth: 180,
            padding: "11px 12px",
            fontSize: 13,
            border: `1px solid ${UI.border}`,
            borderRadius: 12,
            background: "#fff",
            color: UI.text,
            outline: "none",
            fontFamily: "inherit",
            boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
          }}
        >
          <option value="">Selecionar responsável</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: UI.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: 8,
          }}
        >
          Contato
        </div>

        {selectedUser ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: UI.surfaceSoft,
              border: `1px solid ${UI.border}`,
              minHeight: 46,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                border: `1px solid ${UI.border}`,
                color: UI.textSoft,
                fontSize: 11.5,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {getInitials(selectedUser.name)}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: UI.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedUser.name}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: UI.textSoft,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {selectedUser.email || "Sem e-mail cadastrado"}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "#fff",
              border: `1px dashed ${UI.border}`,
              minHeight: 46,
              color: UI.textMuted,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Mail size={15} />
            Nenhum responsável definido
          </div>
        )}
      </div>
    </div>
  );
}



export function CompanyResponsiblesTab({
  sectors,
  users,
  responsibleMap,
  savingResp,
  onSave,
  onChangeResponsible,
  primaryButtonStyle,
  UI,
}: Props) {
  const assignedCount = sectors.filter((s) => responsibleMap.get(s.id)).length;

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
        <button onClick={onSave} disabled={savingResp} style={primaryButtonStyle(savingResp)}>
          <Save size={14} strokeWidth={2} />
          {savingResp ? "Salvando..." : "Salvar responsáveis"}
        </button>
      }
    >
      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            borderRadius: 20,
            border: `1px solid ${UI.border}`,
            background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
            boxShadow: "none",
            padding: 18,
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: UI.primarySoft,
                  color: UI.primary,
                  fontSize: 12,
                  fontWeight: 800,
                  border: `1px solid ${UI.border}`,
                  marginBottom: 10,
                }}
              >
                <ShieldCheck size={14} />
                Organização por setor
              </div>

              <div
                style={{
                  fontSize: 21,
                  fontWeight: 900,
                  color: UI.text,
                  lineHeight: 1.1,
                }}
              >
                Defina os responsáveis de cada área
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 13.5,
                  color: UI.textSoft,
                  maxWidth: 720,
                }}
              >
                Associe cada setor ao colaborador correto para manter a operação organizada,
                clara e fácil de acompanhar.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  minWidth: 140,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#fff",
                  border: `1px solid ${UI.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: UI.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 6,
                  }}
                >
                  Setores
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: UI.text,
                  }}
                >
                  {sectors.length}
                </div>
              </div>

              <div
                style={{
                  minWidth: 140,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "#fff",
                  border: `1px solid ${UI.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: UI.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 6,
                  }}
                >
                  Vinculados
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: UI.primary,
                  }}
                >
                  {assignedCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: 20,
            border: `1px solid ${UI.border}`,
            background: UI.surface,
            boxShadow: UI.shadowSm,
            overflow: "hidden",
          }}
        >
          {sectors.length ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(220px, 1.1fr) minmax(240px, 1fr) minmax(220px, 1fr)",
                  gap: 14,
                  padding: "20px 16px",
                  borderBottom: `1px solid ${UI.border}`,
                  background: "#fafcff",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: UI.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Setor
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: UI.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Responsável
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: UI.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Contato
                </div>
              </div>

              {sectors.map((s) => {
                const userId = responsibleMap.get(s.id) || "";
                const user = userId ? users.find((u) => u.id === userId) || null : null;

                return (
                  <RowCard
                    key={s.id}
                    sectorName={s.name}
                    selectedUserId={userId}
                    selectedUser={user}
                    users={users}
                    onChange={(nextUserId) => onChangeResponsible(s.id, nextUserId)}
                    UI={UI}
                  />
                );
              })}
            </>
          ) : (
            <div style={{ padding: 18 }}>
              <Empty message="Nenhum setor cadastrado." />
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}