import React, { useEffect, useState, useMemo } from "react";
import { useToast } from "../toast";
import { Card, Empty, Loading } from "../ui";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import { useCompanies } from "../hooks/useCompanies";
import { CompanyList } from "../components/CompanyList";
import { CompanyFormModal } from "../components/CompanyFormModal";

interface CompanyForm {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cod: string;
  filial: string;
  grupo: string;
  tributacao: string;
  ieAtual: string;
  dataTributacao: string;
  motivoEntrada: string;
  situacao: string;
  dataSituacao: string;
  ramo: string;
  consultoria: string;
  banco: string;
  perfil: string;
  licitacao: string;
  qtdeFolha: string;
  responsavelComercial: string;
  dataEntrada: string;
  dataInicioCobranca: string;
  dataFimCobranca: string;
}

const EMPTY_FORM: CompanyForm = {
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  cod: "",
  filial: "",
  grupo: "",
  tributacao: "",
  ieAtual: "",
  dataTributacao: "",
  motivoEntrada: "",
  situacao: "",
  dataSituacao: "",
  ramo: "",
  consultoria: "",
  banco: "",
  perfil: "",
  licitacao: "",
  qtdeFolha: "",
  responsavelComercial: "",
  dataEntrada: "",
  dataInicioCobranca: "",
  dataFimCobranca: "",
};

const PAGE_SIZE = 20;

export function Companies({ onOpenCompany }: { onOpenCompany: (id: string) => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterGrupo, setFilterGrupo] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { items, loading, create, buscarCnpj, load, modalOpen,setModalOpen, saving } = useCompanies();

  useEffect(() => {
    setPage(1);
  }, [search, filterSituacao, filterGrupo, filterStatus]);

    useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return items.filter((c) => {
    if (filterSituacao && c.situacao !== filterSituacao) return false;
    if (filterGrupo && c.grupo !== filterGrupo) return false;

    if (filterStatus !== "all" && String(c.active) !== filterStatus) {
      return false;
    }

    if (!q) return true;

    return (
      (c.razaoSocial || "").toLowerCase().includes(q) ||
      (c.nomeFantasia || "").toLowerCase().includes(q) ||
      (c.cnpj || "").replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
      (c.cod || "").toLowerCase().includes(q) ||
      (c.grupo || "").toLowerCase().includes(q)
    );
  });
  }, [items, search, filterSituacao, filterGrupo, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const grupos = useMemo(
    () => [...new Set(items.map((c) => c.grupo).filter(Boolean))].sort() as string[],
    [items]
  );

  const hasFilters = !!(
    search ||
    filterSituacao ||
    filterGrupo ||
    filterStatus !== "all"
  );

  const iStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: 14.5,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    outline: "none",
    color: "#0f172a",
    background: "#fff",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.16s ease",
    height: 50,
  };

  async function handleToggleActive(id: string, active: boolean) {
  try {
    await companyRepository.update(id, { active });

    toast(
      active ? "Empresa ativada com sucesso" : "Empresa desativada",
      "success"
    );

    await load(); // recarrega lista
  } catch (e: any) {
    toast(e.message || "Erro ao atualizar status", "error");
  }
}

  return (
    <div>
      {/* topo premium */}
      <div
        style={{
          marginBottom: 20,
          padding: "22px 24px",
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
           

            <h1
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.1,
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.03em",
              }}
            >
              Gestão de empresas
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14.5,
                color: "#64748b",
                maxWidth: 720,
                lineHeight: 1.6,
              }}
            >
              Visualize, filtre e acompanhe os registros das empresas cadastradas
              em um único painel.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            
            <button
              onClick={() => {
                setForm(EMPTY_FORM);
                setModalOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 18px",
                fontSize: 14,
                fontWeight: 800,
                borderRadius: 14,
                border: "1px solid #BB9F58", // Borda combinando com o fundo
                background: "#BB9F58",       // A cor que você solicitou
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.18s ease",
                // Sombra ajustada para um tom escuro neutro ou quente
                boxShadow: "0 10px 24px rgba(187, 159, 88, 0.3)", 
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "#A38A4A"; // Escurece um pouco no hover
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(187, 159, 88, 0.45)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "#BB9F58"; // Volta para a cor original
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(187, 159, 88, 0.3)";
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.16)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={15} strokeWidth={2.8} />
              </span>
              Nova empresa
            </button>
          </div>
        </div>
      </div>

      {/* filtros */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: "18px 20px",
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
          boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
        }}
      >
        <div style={{ width: "100%", marginBottom: 4 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
              color: "#334155",
            }}
          >
            <SlidersHorizontal size={15} strokeWidth={2.2} />
            Filtros da listagem
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Refine a busca por empresa, situação ou grupo.
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
              pointerEvents: "none",
            }}
          >
            <Search size={15} />
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar razão social, CNPJ, código, grupo..."
            style={{
              ...iStyle,
              width: "100%",
              paddingLeft: 36,
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#2563eb";
              e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.10)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                height: 50,
                transform: "translateY(-15%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <PremiumSelect
          label="Situação"
          value={filterSituacao}
          onChange={setFilterSituacao}
          options={[
            { value: "", label: "Todas situações" },
            { value: "ATIVA", label: "Ativa" },
            { value: "SAIDA", label: "Saída" },
            { value: "SUSPENSA", label: "Suspensa" },
            { value: "ENCERRADA", label: "Encerrada" },
          ]}
        />

         <PremiumSelect
          label="Status"
          value={filterStatus}
          onChange={setFilterStatus}
          variant="active"
          options={[
            { value: "all", label: "Todas empresas" },
            { value: "true", label: "Ativa" },
            { value: "false", label: "Desativada" },
          ]}
        />

        {grupos.length > 0 && (
          <PremiumSelect
            label="Grupo"
            value={filterGrupo}
            onChange={setFilterGrupo}
            options={[
              { value: "", label: "Todos grupos" },
              ...grupos.map((g) => ({ value: g, label: g })),
            ]}
          />
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilterSituacao("");
              setFilterGrupo("");
              setFilterStatus("all");
            }}
            style={{
              height: 52,
              padding: "0 18px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 14,
              border: "1px solid rgba(239,68,68,0.25)",
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(248,113,113,0.08))",
              color: "#ef4444",
              fontSize: 13.5,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.18s ease",
              boxShadow: "0 6px 18px rgba(239,68,68,0.08)",
              backdropFilter: "blur(6px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(239,68,68,0.16), rgba(248,113,113,0.16))";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(239,68,68,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(248,113,113,0.08))";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 18px rgba(239,68,68,0.08)";
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(239,68,68,0.12)",
              }}
            >
              <X size={14} />
            </div>

          </button>
        )}
      </div>

      {/* listagem */}
      <Card
        style={{
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {loading ? (
          <div style={{ padding: 24 }}>
            <Loading message="Carregando empresas..." />
          </div>
        ) : (
          <>
            <CompanyList
              items={paginated}
              loading={loading}
              onOpenCompany={onOpenCompany}
              onToggleActive={handleToggleActive}
            />

           
            {filtered.length > PAGE_SIZE && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderTop: "1px solid #eef2f7",
                  background: "#fafbfc",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de{" "}
                  {filtered.length} resultados
                </span>

                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    style={pageBtn(page === 1)}
                  >
                    <ChevronLeft size={14} strokeWidth={2.5} />
                  </button>

                  {(() => {
                    const pages: number[] = [];

                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else if (page <= 4) {
                      pages.push(1, 2, 3, 4, 5, -1, totalPages);
                    } else if (page >= totalPages - 3) {
                      pages.push(
                        1,
                        -1,
                        totalPages - 4,
                        totalPages - 3,
                        totalPages - 2,
                        totalPages - 1,
                        totalPages
                      );
                    } else {
                      pages.push(1, -1, page - 1, page, page + 1, -2, totalPages);
                    }

                    return pages.map((p, i) =>
                      p < 0 ? (
                        <span
                          key={`e${i}`}
                          style={{
                            padding: "0 4px",
                            color: "#94a3b8",
                            fontSize: 13,
                          }}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          style={pageNumberBtn(p === page)}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    style={pageBtn(page === totalPages)}
                  >
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <CompanyFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        setForm={setForm}
        saving={saving}
        loadingCnpj={loadingCnpj}
        onSubmit={create}
        onBuscarCnpj={buscarCnpj}
        toast={toast}
      />
    </div>
  );
}

function pageBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: disabled ? "#cbd5e1" : "#374151",
    cursor: disabled ? "default" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.16s ease",
    boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
  };
}

function pageNumberBtn(active: boolean): React.CSSProperties {
  return {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: `1px solid ${active ? "#2563eb" : "#e2e8f0"}`,
    background: active ? "#dbeafe" : "#fff",
    color: active ? "#2563eb" : "#374151",
    fontWeight: active ? 800 : 600,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.16s ease",
  };
}


import { ChevronDown } from "lucide-react";
import { companyRepository } from "../repository/company.repository";

type SelectTheme = {
  border: string;
  bg: string;
  icon: string;
  text: string;
  soft: string;
  shadow: string;
  iconShadow: string;
};

const defaultTheme: SelectTheme = {
  border: "#e2e8f0",
  bg: "#fff",
  icon: "#dfdfdf",
  text: "#444",
  soft: "#f7f7f7",
  shadow: "0 4px 12px rgba(0,0,0,0.04)",
  iconShadow: "none",
};

const statusTheme: Record<string, SelectTheme> = {
  ATIVA: {
    ...defaultTheme,
    border: "rgba(34,197,94,0.30)",
    bg: "linear-gradient(135deg, rgba(34,197,94,0.075), #ffffff)",
    icon: "linear-gradient(135deg, #22c55e, #86efac)",
    text: "#15803d",
    soft: "rgba(34,197,94,0.10)",
    iconShadow: "0 5px 12px rgba(34,197,94,0.18)",
  },
  SAIDA: {
    ...defaultTheme,
    border: "rgba(234,179,8,0.32)",
    bg: "linear-gradient(135deg, rgba(234,179,8,0.08), #ffffff)",
    icon: "linear-gradient(135deg, #d97706, #fde68a)",
    text: "#92400e",
    soft: "rgba(234,179,8,0.10)",
    iconShadow: "0 5px 12px rgba(234,179,8,0.18)",
  },
  SUSPENSA: {
    ...defaultTheme,
    border: "rgba(245,158,11,0.34)",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.08), #ffffff)",
    icon: "linear-gradient(135deg, #f59e0b, #fed7aa)",
    text: "#92400e",
    soft: "rgba(245,158,11,0.10)",
    iconShadow: "0 5px 12px rgba(245,158,11,0.18)",
  },
  ENCERRADA: {
    ...defaultTheme,
    border: "rgba(239,68,68,0.30)",
    bg: "linear-gradient(135deg, rgba(239,68,68,0.075), #ffffff)",
    icon: "linear-gradient(135deg, #ef4444, #fca5a5)",
    text: "#991b1b",
    soft: "rgba(239,68,68,0.10)",
    iconShadow: "0 5px 12px rgba(239,68,68,0.18)",
  },
};

const activeTheme: Record<string, SelectTheme> = {
  true: {
    ...defaultTheme,
    border: "rgba(34,197,94,0.30)",
    bg: "linear-gradient(135deg, rgba(34,197,94,0.075), #ffffff)",
    icon: "linear-gradient(135deg, #22c55e, #86efac)",
    text: "#15803d",
    soft: "rgba(34,197,94,0.10)",
    iconShadow: "0 5px 12px rgba(34,197,94,0.18)",
  },
  false: {
    ...defaultTheme,
    border: "rgba(239,68,68,0.30)",
    bg: "linear-gradient(135deg, rgba(239,68,68,0.075), #ffffff)",
    icon: "linear-gradient(135deg, #ef4444, #fca5a5)",
    text: "#991b1b",
    soft: "rgba(239,68,68,0.10)",
    iconShadow: "0 5px 12px rgba(239,68,68,0.18)",
  },
};



function getGroupTheme(name: string): SelectTheme {
  const colors = [
    ["#2563eb", "#93c5fd"],
    ["#7c3aed", "#c4b5fd"],
    ["#059669", "#6ee7b7"],
    ["#0891b2", "#67e8f9"],
  ];

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const [primary, softColor] = colors[Math.abs(hash) % colors.length];

  return {
    ...defaultTheme,
    border: `${primary}45`,
    bg: `linear-gradient(135deg, ${primary}12, #ffffff)`,
    icon: `linear-gradient(135deg, ${primary}, ${softColor})`,
    text: primary,
    soft: `${primary}12`,
    iconShadow: `0 5px 12px ${primary}25`,
  };
}



function PremiumSelect({
  label,
  value,
  onChange,
  options,
  variant = "status",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  variant?: "status" | "group" | "active";
}) {
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ||
    options[0]?.label ||
    "";

  const theme =
    !value || value === "all"
      ? defaultTheme
      : variant === "active"
      ? activeTheme[value] ?? defaultTheme
      : variant === "status"
      ? statusTheme[value] ?? defaultTheme
      : getGroupTheme(value);

  return (
    <div style={{ position: "relative", minWidth: 215, height: 52 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: "100%",
          padding: "20px 46px 7px 48px",
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          background: theme.bg,
          fontSize: 14,
          fontWeight: 700,
          color: "#0f172a",
          outline: "none",
          fontFamily: "inherit",
          appearance: "none",
          boxShadow: theme.shadow,
          transition: "all 0.18s ease",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            style={{ color: "#0f172a" }}
          >
            {opt.label}
          </option>
        ))}
      </select>

      <div
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          width: 26,
          height: 26,
          borderRadius: 8,
          display: "grid",
          placeItems: "center",
          background: theme.icon,
          color: theme.text,
          boxShadow: theme.iconShadow,
          pointerEvents: "none",
          border: "1px solid #e2e8f0",
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 800 }}>
          {selectedLabel?.slice(0, 2).toUpperCase() || "•"}
        </span>
      </div>

      <span
        style={{
          position: "absolute",
          left: 48,
          top: 8,
          fontSize: 10,
          fontWeight: 800,
          color: theme.text,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          pointerEvents: "none",
        }}
      >
        {label}
      </span>

      <div
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          width: 30,
          height: 30,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          background: theme.soft,
          color: theme.text,
          pointerEvents: "none",
          border: "1px solid #e2e8f0",
        }}
      >
        <ChevronDown size={16} strokeWidth={2.4} />
      </div>
    </div>
  );
}