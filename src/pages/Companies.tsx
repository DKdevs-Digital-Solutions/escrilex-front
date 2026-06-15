import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "../toast";
import { Card, Loading } from "../ui";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

import { useCompanies } from "../hooks/useCompanies";
import { useExpectationMatrix } from "../hooks/useExpectationMatrix";

import { CompanyList } from "../components/CompanyList";
import { CompanyFormModal } from "../components/CompanyFormModal";
import { companyRepository } from "../repository/company.repository";

import { ColumnsPanel } from "../components/ColumnsPanel";
import { MatrixDrawer } from "../components/MatrixDrawer";
import { MatrixStats } from "../components/ExpectationMatrix/MatrixStats";

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

const DEFAULT_VISIBLE_COLUMNS = [
  "codigo",
  "empresa",
  "cnpjCpf",
  "grupo",
  "status",
];

export function Companies({
  onOpenCompany,
}: {
  onOpenCompany: (id: string) => void;
}) {
  const { toast } = useToast();

  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const [loadingCnpj, setLoadingCnpj] = useState(false);

  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterGrupo, setFilterGrupo] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const STORAGE_KEY = "expectation-matrix-visible-columns";

  const [visibleKeys, setVisibleKeys] = useState<string[]>(() => {
  try {
    const saved = localStorage.getItem(
      "expectation-matrix-visible-columns"
    );

    return saved
      ? JSON.parse(saved)
      : DEFAULT_VISIBLE_COLUMNS;
  } catch {
    return DEFAULT_VISIBLE_COLUMNS;
  }
});




useEffect(() => {
  try {
    localStorage.setItem(
      "expectation-matrix-visible-columns",
      JSON.stringify(visibleKeys)
    );
  } catch {}
}, [visibleKeys]);


  const {
    create,
    buscarCnpj,
    load,
    modalOpen,
    setModalOpen,
  } = useCompanies();

  const {
    items,
    total,
    limit,
    offset,
    page,
    totalPages,
    loading,
    loadingOptions,
    saving,
    error,
    columns,
    options,
    users,
    search,
    setSearch,
    status,
    setStatus,
    grupo,
    setGrupo,
    tributacao,
    setTributacao,
    ramo,
    setRamo,
    perfil,
    setPerfil,
    loadMatrix,
    clearFilters,
    saveMatrix,
    goToPage,
    changeLimit,
    sections,
    sectorColumns
  } = useExpectationMatrix();


 

  useEffect(() => {
  const timeout = setTimeout(() => {
    loadMatrix({ offset: 0 });
  }, 500);

  return () => clearTimeout(timeout);
}, [search, grupo]);

  const visibleColumns = useMemo(() => {
    const allColumns = [
      ...columns,
      ...sectorColumns,
    ];

    return allColumns.filter((column: any) =>
      visibleKeys.includes(column.key)
    );
  }, [columns, sectorColumns, visibleKeys]);

  function toggleColumn(key: string) {
    setVisibleKeys((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  }

const matrixItems = useMemo(() => {
  return items ?? [];
}, [items]);

const normalizedItems = useMemo(() => {
  return matrixItems.map((item: any) => ({
    ...item,

    id: item.companyId,
    companyId: item.companyId,

    cod: item.codigo,
    razaoSocial: item.empresa,
    cnpj: item.cnpjCpf,
    filial: item.matrizFilial,
    perfil: item.perfilComercial,
    situacao: item.status,
    dataEntrada: item.entrada,

    Comercial: Array.isArray(item.Comercial)
      ? item.Comercial.join(", ")
      : item.Comercial || "—",

    Compliance: Array.isArray(item.Compliance)
      ? item.Compliance.join(", ")
      : item.Compliance || "—",

    Contábil: Array.isArray(item.Contábil)
      ? item.Contábil.join(", ")
      : item.Contábil || "—",

    Fiscal: Array.isArray(item.Fiscal)
      ? item.Fiscal.join(", ")
      : item.Fiscal || "—",

    Societário: Array.isArray(item.Societário)
      ? item.Societário.join(", ")
      : item.Societário || "—",
  }));
}, [matrixItems]);

const filtered = useMemo(() => {
  const q = search.toLowerCase().trim();
  const qNumbers = q.replace(/\D/g, "");

  return normalizedItems.filter((c: any) => {
    if (filterSituacao && c.status !== filterSituacao) return false;
    if (filterGrupo && c.grupo !== filterGrupo) return false;

    if (filterStatus !== "all" && String(c.active) !== filterStatus) {
      return false;
    }

    if (!q) return true;

    const razaoSocial = String(c.empresa || "").toLowerCase();
    const nomeFantasia = String(c.nomeFantasia || "").toLowerCase();
    const cnpj = String(c.cnpjCpf || "").replace(/\D/g, "");
    const cod = String(c.codigo || "").toLowerCase();
    const grupo = String(c.grupo || "").toLowerCase();

    return (
      razaoSocial.includes(q) ||
      nomeFantasia.includes(q) ||
      cod.includes(q) ||
      grupo.includes(q) ||
      (qNumbers && cnpj.includes(qNumbers))
    );
  });
}, [normalizedItems, search, filterSituacao, filterGrupo, filterStatus]);

  const paginated = filtered;

  const grupos = useMemo(
    () =>
      [...new Set(items.map((c: any) => c.grupo).filter(Boolean))].sort() as string[],
    [items]
  );

  const hasFilters = !!(
    search ||
    filterSituacao ||
    filterGrupo ||
    filterStatus !== "all"
  );

  async function handleToggleActive(id: string, active: boolean) {
    try {
      await companyRepository.update(id, {
        active,
        situacao: active ? "ATIVA" : "ENCERRADA",
      });

      toast(
        active ? "Empresa ativada com sucesso" : "Empresa encerrada",
        "success"
      );

      await load();
    } catch (e: any) {
      toast(e.message || "Erro ao atualizar status", "error");
    }
  }

  function exportCompaniesToExcel() {
    const headers = visibleColumns.map((column: any) => column.label);

    const rows = filtered.map((company: any) => {
      return visibleColumns.map((column: any) => {
        const value = company[column.key];

        if (!value) return "";

        if (column.type === "date") {
          return formatDateBR(value);
        }

        if (column.type === "user") {
          const user = users.find((u: any) => u.id === value);
          return user?.name || "";
        }

        return String(value);
      });
    });

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          <table>
            <thead>
              <tr>
                ${headers.map((h: string) => `<th>${escapeHtml(h)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows
        .map(
          (row: any[]) => `
                    <tr>
                      ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                    </tr>
                  `
        )
        .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "empresas.xls";
    link.click();

    URL.revokeObjectURL(url);
  }

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

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          padding: "22px 24px",
          borderRadius: 20,
          border: "2px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)",
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
              border: "1px solid #BB9F58",
              background: "#BB9F58",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.18s ease",
              boxShadow: "0 10px 24px rgba(187, 159, 88, 0.3)",
            }}
          >
            Cadastrar Empresa
          </button>
        </div>

      
      </div>

      <div
        style={{
          marginBottom: 0,
          padding: "0px",
          borderRadius: 20,
         
        }}
      >
        <MatrixStats
          items={items}
          total={total}
          visibleColumnsCount={visibleColumns.length}
        />
        <br />
      </div>



      <div
        style={{
          background: "#fff",
          border: "2px solid #e2e8f0",
          borderRadius: 18,
          padding: "18px 20px",
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
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

        <div
          style={{
            flex: 1,
            minWidth: 240,
            maxWidth: 500,
            position: "relative",
          }}
        >
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
            placeholder="Buscar por empresa, código, CNPJ ou grupo..."
            style={{
              ...iStyle,
              width: "100%",
              paddingLeft: 36,
              boxSizing: "border-box",
            }}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 15,
                top: "50%",
                transform: "translateY(-50%)",
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
          label="Status"
          value={filterSituacao}
          onChange={setFilterSituacao}
          options={[
            { value: "", label: "Todas situações" },
            { value: "ATIVA", label: "Ativa" },
            { value: "SAIDA", label: "Saída" },
            { value: "SUSPENSA", label: "Suspensa" },
            { value: "ENCERRADA", label: "Encerrada" },
            { value: "SEM_MOVIMENTO", label: "Sem Movimento" },
            { value: "EM_SAIDA", label: "Em Saída" },
            { value: "BAIXADA", label: "Baixada" },
            { value: "PENDENTE", label: "Pendente de Documentação" },
            { value: "BLOQUEADO", label: "Bloqueado" },
          ]}
        />

        {/* {grupos.length > 0 && (
          <PremiumSelect
            label="Grupo"
            value={filterGrupo}
            onChange={setFilterGrupo}
            variant="group"
            options={[
              { value: "", label: "Todos grupos" },
              ...grupos.map((g) => ({ value: g, label: g })),
            ]}
          />
        )} */}

        {/* {hasFilters && (
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
              padding: "0 16px",
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
            }}
          >
            <X size={14} />
            Limpar
          </button>
        )} */}
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
        {loading || loadingOptions ? (
          <div style={{ padding: 24 }}>
            <Loading message="Carregando empresas..." />
          </div>
        ) : (
          <>
            <CompanyList
              items={paginated}
              loading={loading}
              visibleColumns={visibleColumns}
              users={users}
              onOpenCompany={onOpenCompany}
              onToggleActive={handleToggleActive}
              onOpenColumns={() => setColumnsOpen(true)}
              onExportExcel={exportCompaniesToExcel}
            />

            {total > limit && (
              <div
              style={{
                marginTop: 18,
                padding: "14px 18px",
                borderRadius: 1,
                border: "2px solid rgba(226,232,240,.9)",
                background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}
                >
                  Registros
                </span>

                <strong style={{ color: "#0f172a", fontSize: 14, fontWeight: 900 }}>
                  Mostrando{" "}
                  <span style={{ color: "#BB9F58" }}>
                    {total === 0 ? 0 : offset + 1}-{Math.min(offset + limit, total)}
                  </span>{" "}
                  de {total.toLocaleString("pt-BR")}
                </strong>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <select
                  value={limit}
                  onChange={(e) => changeLimit(Number(e.target.value))}
                  style={{
                    height: 42,
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    padding: "0 14px",
                    background: "#fff",
                    fontWeight: 800,
                    color: "#0f172a",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value={25}>25 linhas</option>
                  <option value={50}>50 linhas</option>
                  <option value={100}>100 linhas</option>
                </select>

                <button
                  disabled={page === 1 || loading}
                  onClick={() => goToPage(page - 1)}
                  style={{
                    height: 42,
                    minWidth: 42,
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    background: "#ccc",
                    color: page === 1 || loading ? "#fff" : "#0f172a",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: page === 1 || loading ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronLeft size={18} strokeWidth={3} />
                </button>

                <div
                  style={{
                    minWidth: 84,
                    height: 42,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg, rgba(187,159,88,.12), rgba(250,204,21,.08))",
                    border: "1px solid rgba(187,159,88,.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#7c5c00",
                  }}
                >
                  {page} / {totalPages}
                </div>

                <button
                  disabled={page === totalPages || loading}
                  onClick={() => goToPage(page + 1)}
                  style={{
                    height: 42,
                    minWidth: 42,
                    borderRadius: 14,
                    border: "1px solid #e2e8f0",
                    background: "#ccc",
                    color: page === totalPages || loading ? "#cbd5e1" : "#0f172a",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: page === totalPages || loading ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
            )}
          </>
        )}
      </Card>

      {columnsOpen && (
        <ColumnsPanel
          sections={[
            ...sections,
            {
              name: "Responsáveis",
              columns: sectorColumns,
            },
          ]}
          visibleKeys={visibleKeys}
          setVisibleKeys={setVisibleKeys}
          toggleColumn={toggleColumn}
          onClose={() => setColumnsOpen(false)}
        />
      )}

      {selectedRow && (
        <MatrixDrawer
          row={selectedRow}
          columns={columns}
          users={users}
          options={options}
          saving={false}
          onSave={async () => { }}
          onClose={() => setSelectedRow(null)}
          readOnly
        />
      )}

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDateBR(value: any) {
  if (!value) return "";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [year, month, day] = value.slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR");
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
  variant?: "status" | "group";
}) {
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ||
    options[0]?.label ||
    "";

  const theme =
    !value
      ? defaultTheme
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
          <option key={opt.value} value={opt.value} style={{ color: "#0f172a" }}>
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