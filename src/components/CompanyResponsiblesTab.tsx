import React, { useState } from "react";
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
import { toUserIds } from "../pages/CompanyDetail";



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
  responsibleMap: Map<string, string[]>;
  savingResp?: boolean;
  onSave: () => void;
  onChangeResponsible: (sectorId: string, userIds: string[]) => void;
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


  function getInitial(name: string) {
    return name?.trim()?.charAt(0)?.toUpperCase() || "?";
  }

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

  const found = presets.find((p) =>
  p.match.some((term) => name.toLowerCase().includes(term))
);

const visual = found?.visual || {
  bg: "#eff6ff",
  color: "#2563eb",
  border: "#bfdbfe",
};

return {
  ...visual,
  icon: (
    <div
      style={{
        width: 18,
        height: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 800,
        color: visual.color,
      }}
    >
      {getInitial(name)}
    </div>
  ),
};
}

function getInitials(name?: string) {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "—";
}


function RowCard({
  sectorId,
  sectorName,
  selectedUserIds,
  selectedUsers,
  users,
  open,
  onToggleOpen,
  onClose,
  onChange,
  UI,
  openUp
}: {
  sectorId: string;
  sectorName: string;
  selectedUserIds: string[];
  selectedUsers: UserItem[];
  users: UserItem[];
  open: boolean;
  onToggleOpen: () => void;
  openUp: boolean;
  onClose: () => void;
  onChange: (userIds: string[]) => void;
  UI: Props["UI"];
}) {
  const sectorVisual = getSectorVisual(sectorName);
  const [openUsers, setOpenUsers] = useState(false);

  return (
    <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 14,
      alignItems: "stretch",
      padding: 16,
      borderBottom: "1px solid #e2e8f0",
      width:"99%",
      margin:"0 auto",  
    }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            top:"5px",
            position:"relative"
          }}
        >
          <div
            style={{
              width: 40,
              height: 60,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: sectorVisual.bg,
              border: `2px solid ${sectorVisual.border}`,
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

       <div style={{ position: "relative" }}>
    <button
      type="button"
      onClick={onToggleOpen}
      style={{
        width: "100%",
        minHeight: 46,
        padding: "0 14px",
        border: `1px solid ${UI.border}`,
        borderRadius: 12,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
      }}
    >
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: selectedUserIds.length
          ? UI.text
          : UI.textMuted,

        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
     Selecionar responsáveis
    </span>

    <span
      style={{
        fontSize: 11,
        color: UI.textSoft,
      }}
    >
      ▼
    </span>
  </button>

  {open && (
    <div
      style={{
        position: "absolute",

        top: openUp ? "auto" : "calc(100% + 8px)",
        bottom: openUp ? "calc(100% + 8px)" : "auto",

        left: 0,
        right: 0,
        zIndex: 50,
        display: "grid",
        gap: 6,
        maxHeight: 240,
        overflowY: "auto",
        padding: 8,
        border: `1px solid ${UI.border}`,
        borderRadius: 14,
        background: "#fff",
        boxShadow: "0 20px 40px rgba(15,23,42,.12)",
      }}
    >
      {users.map((u) => {
  const currentIds = Array.isArray(selectedUserIds)
    ? selectedUserIds
    : selectedUserIds
    ? [selectedUserIds]
    : [];

  const checked = currentIds.includes(u.id);

  return (
    <label
      key={u.id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        cursor: "pointer",
        background: checked ? "rgba(1,41,66,.08)" : "transparent",
        border: checked
          ? "1px solid rgba(1,41,66,.16)"
          : "1px solid transparent",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          const nextUserIds = e.target.checked
            ? [...currentIds, u.id]
            : currentIds.filter((id) => id !== u.id);

          onChange(nextUserIds);
        }}
        style={{
          width: 16,
          height: 16,
          cursor: "pointer",

          accentColor: "#bb9f58",
        }}
      />

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: UI.text }}>
          {u.name}
        </div>

        <div style={{ fontSize: 11.5, color: UI.textSoft, marginTop: 2 }}>
          {u.email || "Sem e-mail"}
        </div>
      </div>
    </label>
  );
})}
    </div>
  )}
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
          Contato
        </div>

       {selectedUsers.length ? (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center",
      padding: "8px 10px",
      borderRadius: 12,
      background: UI.surfaceSoft,
      border: `1px solid ${UI.border}`,
      minHeight: 46,
    }}
  >
    {selectedUsers.map((user) => (
      <div
        key={user.id}
        title={user.email || user.name}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          maxWidth: 210,
          padding: "6px 9px 6px 6px",
          borderRadius: 999,
          background: "#fff",
          border: `1px solid ${UI.border}`,
          color: UI.text,
          boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#bb9f58",
            color: "#fff",
            fontSize: 10,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {getInitials(user.name)}
        </span>

        <span
          style={{
            minWidth: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: 12.5,
            fontWeight: 800,
          }}
        >
          {user.name}
        </span>
      </div>
    ))}
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
  const [openSectorId, setOpenSectorId] = useState<string | null>(null);

 return (
  <div
    style={{
      display: "grid",
      gap: 14,
    }}
  >
    <div
      style={{
        borderRadius: 15,
        border: "2px solid #e2e8f0",
        background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 260, flex: "1 1 520px" }}>
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

        <button
          onClick={onSave}
          disabled={savingResp}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 44,
            padding: "0 18px",
            borderRadius: 12,
            border: "none",
            background: "#012942",
            color: "#fff",
            fontSize: 13.5,
            fontWeight: 800,
            cursor: savingResp ? "not-allowed" : "pointer",
            transition: "all 0.18s ease",
            boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
          }}
        >
          <Save size={15} strokeWidth={2.5} />
          {savingResp ? "Salvando..." : "Salvar responsáveis"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 18,
        }}
      >

    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <StatCard
        label="Setores"
        value={sectors.length}
        color="#2563eb"
        icon={<Building2 size={18} />}
      />

      <StatCard
        label="Vinculados"
        value={assignedCount}
        color="#16a34a"
        icon={<ShieldCheck size={18} />}
      />
    </div>
       
      </div>
    </div>

    <div
      style={{
        borderRadius: 15,
        border: "2px solid #e2e8f0",
        background: UI.surface,
        overflow: "hidden",
      }}
    >
      {sectors.length ? (
        <>
          <div
            className="title-section"
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
            <div style={headerCellStyle(UI)}>Setor</div>
            <div style={headerCellStyle(UI)}>Responsável</div>
            <div style={headerCellStyle(UI)}>Contato</div>
          </div>

          {sectors.map((s, index) => {
            const userIds = toUserIds(responsibleMap.get(s.id));
            const selectedUsers = users.filter((u) => userIds.includes(u.id));
            const shouldOpenUp = index >= sectors.length - 2;

            return (
              <RowCard
                key={s.id}
                sectorId={s.id}
                sectorName={s.name}
                selectedUserIds={userIds}
                selectedUsers={selectedUsers}
                users={users}
                open={openSectorId === s.id}
                openUp={shouldOpenUp}
                onToggleOpen={() =>
                  setOpenSectorId((prev) => (prev === s.id ? null : s.id))
                }
                onClose={() => setOpenSectorId(null)}
                onChange={(nextUserIds) => onChangeResponsible(s.id, nextUserIds)}
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
);


function headerCellStyle(UI: Props["UI"]): React.CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 800,
    color: UI.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };
}
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        minWidth: 160,
        padding: "16px 18px",
        borderRadius: 16,
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        border: `1px solid #ccc`,
        boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.18s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 12px 30px rgba(15,23,42,0.10)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 8px 22px rgba(15,23,42,0.06)";
      }}
    >
      {/* Ícone */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}15`,
          color,
          border: `1px solid ${color}30`,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Texto */}
      <div>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}