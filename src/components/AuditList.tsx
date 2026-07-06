import React from "react";
import { Card, Empty, Badge } from "../ui";
import {
  ShieldCheck,
  History,
  UserCircle2,
  Boxes,
  User,
  Building2,
  FolderKanban,
  ClipboardList,
  LayoutPanelTop,
  Activity,
} from "lucide-react";
import { createPortal } from "react-dom";

const entityLabel: Record<string, string> = {
  Company: "Empresa",
  User: "Usuário",
  Sector: "Setor",
  ProcessRun: "Processo",
  ProcessItemRun: "Item do processo",
  ProcessTemplate: "Template",
  ProcessTemplateSection: "Seção",
  ProcessTemplateItem: "Item do template",
};

const actionLabel: Record<string, string> = {
  LOGIN: "Login",
  COMPANY_CREATE: "Empresa criada",
  COMPANY_UPDATE: "Empresa atualizada",
  COMPANY_STATUS_UPDATE: "Status da empresa atualizado",
  COMPANY_INACTIVATE: "Empresa inativada",
  COMPANY_RESPONSIBLES_SET: "Responsáveis alterados",
  COMPANY_PARTNER_CREATE: "Sócio adicionado",
  COMPANY_PARTNER_UPDATE: "Sócio atualizado",
  COMPANY_PARTNER_DELETE: "Sócio removido",
  COMPANY_CLIENT_CONTACT_CREATE: "Contato do cliente adicionado",
  COMPANY_CLIENT_CONTACT_UPDATE: "Contato do cliente atualizado",
  COMPANY_CLIENT_CONTACT_DELETE: "Contato do cliente removido",
  EXPECTATION_MATRIX_UPDATE: "Matriz atualizada",
  PROCESS_START: "Processo iniciado",
  PROCESS_ITEM_UPDATE: "Processo atualizado",
  USER_CREATE: "Usuário criado",
  USER_UPDATE: "Usuário atualizado",
  USER_DISABLE: "Usuário desativado",
  USER_ENABLE: "Usuário reativado",
  SECTOR_CREATE: "Setor criado",
  SECTOR_UPDATE: "Setor atualizado",
  SECTOR_DISABLE: "Setor desativado",
  SECTOR_ENABLE: "Setor reativado",
  TEMPLATE_CREATE: "Template criado",
  TEMPLATE_UPDATE: "Template atualizado",
  TEMPLATE_SECTION_CREATE: "Seção criada",
  TEMPLATE_SECTION_UPDATE: "Seção atualizada",
  TEMPLATE_SECTION_DELETE: "Seção excluída",
  TEMPLATE_ITEM_CREATE: "Item criado",
  TEMPLATE_ITEM_UPDATE: "Item atualizado",
  TEMPLATE_ITEM_DELETE: "Item excluído",
};

// Rótulos amigáveis para os nomes de campo exibidos nas alterações da auditoria.
const fieldLabel: Record<string, string> = {
  razaoSocial: "Razão social",
  nomeFantasia: "Nome fantasia",
  cnpj: "CNPJ",
  cod: "Código",
  grupo: "Grupo",
  municipio: "Município",
  uf: "UF",
  filial: "Matriz / Filial",
  matrizFilial: "Matriz / Filial",
  tributacao: "Tributação",
  ieAtual: "Inscrição estadual",
  ie: "Inscrição estadual",
  ramo: "Ramo",
  perfil: "Perfil comercial",
  perfilComercial: "Perfil comercial",
  consultoria: "Consultoria",
  banco: "Banco",
  licitacao: "Licitação",
  responsavelComercial: "Responsável comercial",
  situacao: "Status",
  status: "Status",
  dataCadastro: "Data de cadastro",
  dataEntrada: "Data de entrada",
  entrada: "Data de entrada",
  dataSituacao: "Data do status",
  dataTributacao: "Data da tributação",
  dataInicioCobranca: "Início da cobrança",
  dataFimCobranca: "Fim da cobrança",
  motivoEntrada: "Motivo da entrada",
  motivoSaida: "Motivo da saída",
  motivoSaidaResumo: "Motivo da saída",
  observacoes: "Observações",
  active: "Empresa ativa",
  inactivatedAt: "Inativada em",
  bloqueadoAt: "Bloqueada em",
  bloqueadoPor: "Bloqueada por",
  statusBloqueadoAt: "Bloqueada em",
  qtdeInicialFolha: "Qtde. inicial de folha",
  quantidadeFolha: "Quantidade de folha",
  qtdeFolha: "Quantidade de folha",
  reunioesFechamentos: "Reuniões de fechamento",
  fechamentoContabil: "Fechamento contábil",
  analiseCompliance: "Análise de compliance",
  cobrancaServExtras: "Cobrança de serviços extras",
  complexidadeFiscal: "Complexidade fiscal",
  complexidadeContabil: "Complexidade contábil",
  dataSaida: "Data de saída",
  dataEntradaFiscal: "Entrada — Fiscal",
  dataSaidaFiscal: "Saída — Fiscal",
  dataEntradaContabil: "Entrada — Contábil",
  dataSaidaContabil: "Saída — Contábil",
  dataEntradaFolha: "Entrada — Folha",
  dataSaidaFolha: "Saída — Folha",
  dataEntradaConsultoria: "Entrada — Consultoria",
  dataSaidaConsultoria: "Saída — Consultoria",
  dataInicioCobrancaFiscal: "Início cobrança — Fiscal",
  dataFimCobrancaFiscal: "Fim cobrança — Fiscal",
  dataInicioCobrancaContabil: "Início cobrança — Contábil",
  dataFimCobrancaContabil: "Fim cobrança — Contábil",
  dataInicioCobrancaFolha: "Início cobrança — Folha",
  dataFimCobrancaFolha: "Fim cobrança — Folha",
  dataInicioCobrancaConsultoria: "Início cobrança — Consultoria",
  dataFimCobrancaConsultoria: "Fim cobrança — Consultoria",
  responsibles: "Responsáveis",
  updated: "Responsáveis",
  name: "Nome",
  email: "E-mail",
  acessos: "Acessos",
};

// Converte um código técnico (SNAKE_CASE ou camelCase) em texto legível.
function humanizeCode(code: string) {
  if (!code) return "";
  return String(code)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}

function getActionLabel(action: string) {
  return actionLabel[action] ?? humanizeCode(action);
}

function getFieldLabel(campo: string) {
  if (fieldLabel[campo]) return fieldLabel[campo];
  // Ignora índices numéricos (ex.: diffs de arrays) exibindo um rótulo genérico.
  if (/^\d+$/.test(campo)) return `Item ${Number(campo) + 1}`;
  return humanizeCode(campo);
}

const actionBadge: Record<string, any> = {
  LOGIN: "gray",
  COMPANY_CREATE: "green",
  COMPANY_UPDATE: "blue",
  USER_CREATE: "blue",
  USER_DISABLE: "red",
  SECTOR_DISABLE: "red",
  PROCESS_START: "yellow",
  PROCESS_ITEM_UPDATE: "green",
};

type AuditItem = {
  id: string;

  data: string;
  hora: string;

  nomeEmpresa: string | null;

  usuarioResponsavel: {
    id: string;
    name: string;
    email: string;
  } | null;

  action: string;

  entity: string;
  entityId: string;

  camposAlterados: {
    campo: string;
    valorAnterior: unknown;
    novoValor: unknown;
  }[];

  valorAnterior: unknown;
  novoValor: unknown;

  ip: string | null;
  userAgent: string | null;
};

type AuditFilterType = "all" | "login" | "user_actions" | "unidentified";

type AuditListProps = {
  items: AuditItem[];
};

function getEntityVisual(entity: string) {


  

  const map: Record<
    string,
    {
      icon: React.ElementType;
      bg: string;
      color: string;
      border: string;
    }
  > = {
    Company: {
      icon: Building2,
      bg: "rgba(37,99,235,0.10)",
      color: "#2563eb",
      border: "rgba(37,99,235,0.18)",
    },
    User: {
      icon: User,
      bg: "rgba(22,163,74,0.10)",
      color: "#16a34a",
      border: "rgba(22,163,74,0.18)",
    },
    Sector: {
      icon: Boxes,
      bg: "rgba(234,88,12,0.10)",
      color: "#ea580c",
      border: "rgba(234,88,12,0.18)",
    },
    ProcessRun: {
      icon: ClipboardList,
      bg: "rgba(124,58,237,0.10)",
      color: "#7c3aed",
      border: "rgba(124,58,237,0.18)",
    },
    ProcessItemRun: {
      icon: ClipboardList,
      bg: "rgba(99,102,241,0.10)",
      color: "#4f46e5",
      border: "rgba(99,102,241,0.18)",
    },
    ProcessTemplate: {
      icon: FolderKanban,
      bg: "rgba(8,145,178,0.10)",
      color: "#0891b2",
      border: "rgba(8,145,178,0.18)",
    },
    ProcessTemplateSection: {
      icon: LayoutPanelTop,
      bg: "rgba(217,119,6,0.10)",
      color: "#d97706",
      border: "rgba(217,119,6,0.18)",
    },
    ProcessTemplateItem: {
      icon: FolderKanban,
      bg: "rgba(190,24,93,0.10)",
      color: "#be185d",
      border: "rgba(190,24,93,0.18)",
    },
  };

  return (
    map[entity] || {
      icon: History,
      bg: "rgba(100,116,139,0.10)",
      color: "#64748b",
      border: "rgba(100,116,139,0.18)",
    }
  );
}

function StatCard({
  label,
  value,
  helper,
  color,
  softBg,
  softBorder,
  icon,
  active = false,
  onClick,
}: {
  label: string;
  value: number;
  helper: string;
  color: string;
  softBg: string;
  softBorder: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: 170,
        flex: 1,
        padding: "30px 16px",
        borderRadius: 18,
        background: active ? softBg : "#fff",
        border: `2px solid ${active ? color : softBorder}`,
        boxShadow: active
          ? `0 10px 24px ${softBg}`
          : "0 8px 20px rgba(15,23,42,0.05)",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.18s ease",
        fontFamily: "inherit",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: active ? color : "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {label}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 26,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {value}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12.5,
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            {helper}
          </div>
        </div>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: softBg,
            border: `1px solid ${softBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </button>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0 14px 6px 14px",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#94a3b8",
  fontWeight: 800,
};

const tdStyle: React.CSSProperties = {
  padding: "16px 14px",
  borderTop: "1px solid #ccc",
  borderBottom: "1px solid #ccc",
};

const tdLeftStyle: React.CSSProperties = {
  borderTopLeftRadius: 16,
  borderBottomLeftRadius: 16,
  borderLeft: "1px solid #ccc",
};

const tdRightStyle: React.CSSProperties = {
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
  borderRight: "1px solid #ccc ",
};

export function AuditList({ items }: AuditListProps) {
  const [cardFilter, setCardFilter] = React.useState<AuditFilterType>("all");

  const loginCount = React.useMemo(
    () => items.filter((item) => item.action === "LOGIN").length,
    [items]
  );

  const userActionsCount = React.useMemo(
    () =>
      items.filter((item) =>
        String(item.entity || "").toLowerCase().includes("user")
      ).length,
    [items]
  );

  const unidentifiedCount = React.useMemo(
  () => items.filter((item) => !entityLabel[item.entity]).length,
  [items]
  );

  const entityCount = React.useMemo(() => {
    const unique = new Set(items.map((item) => item.entity).filter(Boolean));
    return unique.size;
  }, [items]);

    const filteredItems = React.useMemo(() => {
    if (cardFilter === "login") {
        return items.filter((item) => item.action === "LOGIN");
    }

    if (cardFilter === "user_actions") {
        return items.filter((item) =>
        String(item.entity || "").toLowerCase().includes("user")
        );
    }

    if (cardFilter === "unidentified") {
        return items.filter((item) => !entityLabel[item.entity]);
    }

    return items;
    }, [items, cardFilter]);


      function getInitial(name?: string) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
    }

    function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const colors = [
    "#2563eb", // azul
    "#16a34a", // verde
    "#9333ea", // roxo
    "#ea580c", // laranja
    "#dc2626", // vermelho
    "#0891b2", // cyan
    "#7c3aed", // violeta
  ];

  return colors[Math.abs(hash) % colors.length];
}


const [isMobile, setIsMobile] = React.useState(false);

React.useEffect(() => {
  const check = () => setIsMobile(window.innerWidth <= 999);
  check();

  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);




function formatAuditValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  if (typeof value === "string") {
    const isDate = /^\d{4}-\d{2}-\d{2}T/.test(value);

    if (isDate) {
      return new Date(value).toLocaleString("pt-BR");
    }

    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    // Resumo legível: tenta extrair nomes/e-mails de cada item.
    const parts = value
      .map((item) => summarizeEntry(item))
      .filter(Boolean);
    if (parts.length) return parts.join(", ");
    return `${value.length} registro${value.length === 1 ? "" : "s"}`;
  }

  if (typeof value === "object") {
    const summary = summarizeEntry(value);
    if (summary) return summary;
    return "—";
  }

  return String(value);
}

// Extrai um texto curto e legível de um item (objeto) de alteração,
// evitando exibir "Objeto alterado" sempre que possível.
function summarizeEntry(item: unknown): string {
  if (item === null || item === undefined) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);

  const obj = item as any;

  // Responsável por setor: "Setor: Fulano"
  const sectorName = obj?.sector?.name ?? obj?.sectorName;
  const userName = obj?.user?.name ?? obj?.user?.email ?? obj?.name ?? obj?.email;
  if (sectorName && userName) return `${sectorName}: ${userName}`;

  return (
    obj?.name ??
    obj?.email ??
    obj?.razaoSocial ??
    obj?.nomeFantasia ??
    obj?.label ??
    obj?.title ??
    sectorName ??
    userName ??
    ""
  );
}

function AuditChangesTooltip({ item }: { item: AuditItem }) {
  const changes = item.camposAlterados || [];

  const [position, setPosition] = React.useState<"top" | "bottom">("bottom");

  const [tooltipRect, setTooltipRect] = React.useState<DOMRect | null>(null);

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);

  const isLogin = item.action?.toUpperCase() === "LOGIN";

  function handleMouseEnter() {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBottom = window.innerHeight - rect.bottom;

    setTooltipRect(rect);
    setPosition(spaceBottom < 420 ? "top" : "bottom");
    setOpen(true);
  }

  if (isLogin || !changes.length) {
    return (
      <span style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8" }}>
        Sem alterações
      </span>
    );
  }

  return (
   <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setOpen(false)}
      className="audit-wrapper"
      style={{
        position: "relative",
        display: "inline-flex",
       
      }}
    >
      <button
        type="button"
        style={{
          padding: "8px 11px",
          borderRadius: 999,
          border: "1px solid rgba(37,99,235,.20)",
          background: "linear-gradient(135deg,#eff6ff,#ffffff)",
          color: "#1d4ed8",
          fontSize: 12,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        {changes.length} alteração{changes.length === 1 ? "" : "es"}
      </button>

    {open &&
  tooltipRect &&
  createPortal(
    <div
      className="audit-tooltip"
      style={{
        position: "fixed",
        right: window.innerWidth - tooltipRect.right,
        top:
          position === "bottom"
            ? tooltipRect.bottom - 4
            : undefined,
        bottom:
          position === "top"
            ? window.innerHeight - tooltipRect.top - 4
            : undefined,

        zIndex: 99999,

        width: 420,
        maxHeight: 360,
        overflowY: "auto",

        padding: 14,
        borderRadius: 5,
        background: "rgba(15,23,42,.98)",
        border: "1px solid rgba(255,255,255,.10)",
        boxShadow: "0 28px 80px rgba(15,23,42,.35)",

        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",

        transform:
          position === "bottom"
            ? "translateY(5px)"
            : "translateY(-5px)",

        transition:
          "opacity .18s ease, transform .18s ease, visibility .18s",
      }}
    >
        <div
          style={{
            marginBottom: 12,
            fontSize: 11,
            fontWeight: 950,
            color: "#93c5fd",
            textTransform: "uppercase",
            letterSpacing: ".12em",
          }}
        >
          Valores alterados
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {changes.map((change, index) => (
            <div
              key={`${change.campo}-${index}`}
              style={{
                padding: 12,
                borderRadius: 16,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.10)",
              }}
            >
              <div
                style={{
                  marginBottom: 9,
                  fontSize: 12,
                  fontWeight: 950,
                  color: "#fff",
                }}
              >
                {getFieldLabel(change.campo)}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#fca5a5",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      marginBottom: 4,
                    }}
                  >
                    Antes
                  </div>

                  <div
                    style={{
                      padding: "8px 9px",
                      borderRadius: 12,
                      background: "rgba(239,68,68,.10)",
                      color: "#fee2e2",
                      fontSize: 11.5,
                      fontWeight: 750,
                      lineHeight: 1.35,
                      wordBreak: "break-word",
                    }}
                  >
                    {formatAuditValue(change.valorAnterior)}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#86efac",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      marginBottom: 4,
                    }}
                  >
                    Depois
                  </div>

                  <div
                    style={{
                      padding: "8px 9px",
                      borderRadius: 12,
                      background: "rgba(34,197,94,.10)",
                      color: "#dcfce7",
                      fontSize: 11.5,
                      fontWeight: 750,
                      lineHeight: 1.35,
                      wordBreak: "break-word",
                    }}
                  >
                    {formatAuditValue(change.novoValor)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>,
      document.body
  )}

    </div>
  );
}


  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard
          label="Eventos"
          value={items.length}
          helper="registros retornados"
          color="#2563eb"
          softBg="rgba(37,99,235,0.10)"
          softBorder="rgba(37,99,235,0.18)"
          icon={<History size={18} strokeWidth={2.2} />}
          active={cardFilter === "all"}
          onClick={() => setCardFilter("all")}
        />

        <StatCard
          label="Logins"
          value={loginCount}
          helper="acessos registrados"
          color="#16a34a"
          softBg="rgba(22,163,74,0.10)"
          softBorder="rgba(22,163,74,0.18)"
          icon={<ShieldCheck size={18} strokeWidth={2.2} />}
          active={cardFilter === "login"}
          onClick={() => setCardFilter("login")}
        />

        <StatCard
          label="Ações de usuário"
          value={userActionsCount}
          helper="movimentações relacionadas"
          color="#ea580c"
          softBg="rgba(234,88,12,0.10)"
          softBorder="rgba(234,88,12,0.18)"
          icon={<UserCircle2 size={18} strokeWidth={2.2} />}
          active={cardFilter === "user_actions"}
          onClick={() => setCardFilter("user_actions")}
        />

       {/* <StatCard
        label="Não identificados"
        value={unidentifiedCount}
        helper="registros sem mapeamento"
        color="#7c3aed"
        softBg="rgba(124,58,237,0.10)"
        softBorder="rgba(124,58,237,0.18)"
        icon={<Activity size={18} strokeWidth={2.2} />}
        active={cardFilter === "unidentified"}
        onClick={() => setCardFilter("unidentified")}
        /> */}
      </div>

      <Card
        style={{
          borderRadius: 20,
          border: "2px solid #e2e8f0",
          background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
          overflow: "hidden",
          padding: 0,
        }}
      >
        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #eef2f7",
            background:
              "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Eventos registrados
          </div>

         <div
            style={{
                marginTop: 4,
                fontSize: 13,
                color: "#64748b",
            }}
            >
            {cardFilter === "all"
                ? "Histórico detalhado das ações executadas no sistema"
                : cardFilter === "login"
                ? "Exibindo apenas eventos de login"
                : cardFilter === "user_actions"
                ? "Exibindo apenas ações relacionadas a usuários"
                : "Exibindo apenas registros com tipo não identificado"}
            </div>
        </div>

       {!filteredItems.length ? (
      <div style={{ padding: 28 }}>
        <Empty message="Nenhum evento encontrado para esse filtro." />
      </div>
    ) : isMobile ? (
      <div
        style={{
          padding: 14,
          display: "grid",
          gap: 12,
        }}
      >
        {filteredItems.map((r) => {
          const visual = getEntityVisual(r.entity);
          const EntityIcon = visual.icon;

      return (
        <div
          key={r.id}
          style={{
            padding: 14,
            borderRadius: 18,
            background: "#fff",
            border: "2px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: stringToColor(r.usuarioResponsavel?.name || ""),
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 15,
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              {getInitial(r.usuarioResponsavel?.name)}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.usuarioResponsavel?.name ?? "—"}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  marginTop: 3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.usuarioResponsavel?.email ?? ""}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Data / Hora
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#475569",
                  fontWeight: 700,
                }}
              >
                {/* {new Date(r.createdAt).toLocaleString("pt-BR")} */}
                {r.data}, {r.hora}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Badge
                label={getActionLabel(r.action)}
                variant={actionBadge[r.action] || "gray"}
              />

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 10px",
                  borderRadius: 999,
                  background: visual.bg,
                  border: `1px solid ${visual.border}`,
                  color: visual.color,
                  fontSize: 12,
                  fontWeight: 800,
                  maxWidth: "100%",
                }}
              >
                <EntityIcon size={13} strokeWidth={2.2} />

                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {entityLabel[r.entity] ?? r.entity}
                </span>
              </div>

              <div style={{ marginTop: 12 }}>
                <AuditChangesTooltip item={r} />
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div style={{ padding: 14 }}>
    <div style={{ width: "100%" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 10px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Usuário</th>
            <th style={thStyle}>Data / Hora</th>
            <th style={thStyle}>Ação</th>
            <th style={thStyle}>Alterações</th>
            <th style={thStyle}>Entidade</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.map((r) => {
            const visual = getEntityVisual(r.entity);
            const EntityIcon = visual.icon;

            return (
              <tr
                key={r.id}
                style={{
                  background: "#ffffff",
                  boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
                  cursor: "pointer",
                }}
              >
                <td style={{ ...tdStyle, ...tdLeftStyle }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "20%",
                        background: stringToColor(r.usuarioResponsavel?.name || ""),
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {getInitial(r.usuarioResponsavel?.name)}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13.5,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {r.usuarioResponsavel?.name ?? "—"}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          marginTop: 4,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {r.usuarioResponsavel?.email ?? ""}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#64748b",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {/* {new Date(r.createdAt).toLocaleString("pt-BR")} */}
                    {r.data}, {r.hora}
                  </div>
                </td>

                <td style={tdStyle}>
                  <Badge
                    label={getActionLabel(r.action)}
                    variant={actionBadge[r.action] || "gray"}
                  />
                </td>

                <td style={tdStyle}>
                  <AuditChangesTooltip item={r} />
                </td>

               <td style={{ ...tdStyle, ...tdRightStyle }}>
                  <div
                    title={
                      r.entity === "Company" && r?.nomeEmpresa
                        ? `${entityLabel[r.entity] ?? r.entity} • ${r.nomeEmpresa}`
                        : entityLabel[r.entity] ?? r.entity
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 8 : 10,

                      width: "100%",
                      maxWidth: isMobile ? "100%" : 280,

                      padding: isMobile ? "9px 10px" : "8px 11px",

                      borderRadius: 16,
                      background: visual.bg,
                      border: `1px solid ${visual.border}`,
                      color: visual.color,

                      boxSizing: "border-box",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? 28 : 30,
                        height: isMobile ? 28 : 30,
                        borderRadius: 12,
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <EntityIcon size={14} strokeWidth={2.4} />
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? 12 : 12.5,
                          fontWeight: 900,
                          lineHeight: 1.1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {entityLabel[r.entity] ?? r.entity}
                      </div>

                      {r.entity === "Company" && r?.nomeEmpresa && (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: isMobile ? 11 : 11.5,
                            fontWeight: 800,
                            lineHeight: 1.2,
                            color: "#334155",

                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {r.nomeEmpresa}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
      </Card>
    </>
  );
}