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

import { Modal } from "../Modal";

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
  municipio: string;
  uf: string;
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
  municipio: "",
  uf: "",
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

const UF_LIST = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const DEFAULT_VISIBLE_COLUMNS = [
  "codigo",
  "empresa",
  "cnpjCpf",
  "grupo",
  "municipio",
  "uf",
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
  const [filterUf, setFilterUf] = useState("");
  const [filterGrupo, setFilterGrupo] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftSituacao, setDraftSituacao] = useState("");
  const [draftUf, setDraftUf] = useState("");
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
      : item.Comercial || "-",

    Compliance: Array.isArray(item.Compliance)
      ? item.Compliance.join(", ")
      : item.Compliance || "-",

    Contábil: Array.isArray(item.Contábil)
      ? item.Contábil.join(", ")
      : item.Contábil || "-",

    Fiscal: Array.isArray(item.Fiscal)
      ? item.Fiscal.join(", ")
      : item.Fiscal || "-",

    Societário: Array.isArray(item.Societário)
      ? item.Societário.join(", ")
      : item.Societário || "-",
  }));
}, [matrixItems]);

const filtered = useMemo(() => {
  const q = search.toLowerCase().trim();
  const qNumbers = q.replace(/\D/g, "");

  return normalizedItems.filter((c: any) => {
    if (filterSituacao && c.status !== filterSituacao) return false;
    if (filterUf && String(c.uf || "").toUpperCase() !== filterUf) return false;
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
    const municipio = String(c.municipio || "").toLowerCase();
    const uf = String(c.uf || "").toLowerCase();

    return (
      razaoSocial.includes(q) ||
      nomeFantasia.includes(q) ||
      cod.includes(q) ||
      grupo.includes(q) ||
      municipio.includes(q) ||
      uf.includes(q) ||
      (qNumbers && cnpj.includes(qNumbers))
    );
  });
}, [normalizedItems, search, filterSituacao, filterUf, filterGrupo, filterStatus]);

  // Código exibido sempre do menor para o maior (numérico; não numéricos por último)
  const paginated = useMemo(() => {
    const codeOf = (c: any) => {
      const digits = String(c.codigo ?? c.cod ?? "").replace(/[^0-9]/g, "");
      return digits ? Number(digits) : Number.POSITIVE_INFINITY;
    };

    return [...filtered].sort((a: any, b: any) => {
      const codeA = codeOf(a);
      const codeB = codeOf(b);

      const numericA = Number.isFinite(codeA);
      const numericB = Number.isFinite(codeB);

      if (numericA && numericB && codeA !== codeB) return codeA - codeB;
      if (numericA !== numericB) return numericA ? -1 : 1;

      return String(a.codigo ?? a.cod ?? "").localeCompare(
        String(b.codigo ?? b.cod ?? ""),
        "pt-BR",
        { numeric: true }
      );
    });
  }, [filtered]);

  const hasActiveFilters = !!(filterSituacao || filterUf);

  const grupos = useMemo(
    () =>
      [...new Set(items.map((c: any) => c.grupo).filter(Boolean))].sort() as string[],
    [items]
  );

  const hasFilters = !!(
    search ||
    filterSituacao ||
    filterUf ||
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // header do app (70px) + padding vertical do <main> (28px x2)
        height: "calc(100vh - 126px)",
        maxHeight: "calc(100vh - 126px)",
        minHeight: 420,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          marginBottom: 12,
          padding: "16px 20px",
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
          flexShrink: 0,
          marginBottom: 12,
          padding: "0px",
          borderRadius: 20,
        }}
      >
        <MatrixStats
          items={items}
          total={total}
          visibleColumnsCount={visibleColumns.length}
          compact
        />
      </div>

      <Card
        style={{
          borderRadius: 20,
          border: "2px solid #e2e8f0",
          background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
          overflow: "hidden",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
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
              filters={
                <>
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

              <button
                type="button"
                onClick={() => {
                  setDraftSituacao(filterSituacao);
                  setDraftUf(filterUf);
                  setFiltersOpen(true);
                }}
                title="Filtros"
                aria-label="Filtros"
                style={{
                  position: "relative",
                  width: 50,
                  height: 50,
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  border: `1px solid ${hasActiveFilters ? "#BB9F58" : "#e2e8f0"}`,
                  background: hasActiveFilters
                    ? "linear-gradient(135deg, rgba(187,159,88,.14), rgba(250,204,21,.10))"
                    : "#fff",
                  color: hasActiveFilters ? "#7c5c00" : "#334155",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .18s ease",
                }}
              >
                <SlidersHorizontal size={18} strokeWidth={2.4} />

                {hasActiveFilters && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: "#BB9F58",
                    }}
                  />
                )}
              </button>
                </>
              }
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
                flexShrink: 0,
                marginTop: 0,
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

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros da listagem"
        width={460}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setDraftSituacao("");
                setDraftUf("");
              }}
              style={{
                marginRight: "auto",
                height: 40,
                padding: "0 14px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Limpar
            </button>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#334155",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterSituacao(draftSituacao);
                setFilterUf(draftUf);
                setFiltersOpen(false);
              }}
              style={{
                height: 40,
                padding: "0 18px",
                borderRadius: 12,
                border: "none",
                background: "#012942",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Aplicar
            </button>
          </>
        }
      >
        {/* altura reservada para os dropdowns abrirem sem cortar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 380 }}>
          <PremiumSelect
            label="Status"
            value={draftSituacao}
            onChange={setDraftSituacao}
            options={[
              { value: "", label: "Todas situações" },
              { value: "ATIVA", label: "Ativa" },
              { value: "SUSPENSA", label: "Suspensa" },
              { value: "ENCERRADA", label: "Encerrada" },
              { value: "SEM_MOVIMENTO", label: "Sem Movimento" },
              { value: "EM_SAIDA", label: "Em Saída" },
              { value: "BAIXADA", label: "Baixada" },
              { value: "PENDENTE", label: "Pendente de Documentação" },
              { value: "BLOQUEADO", label: "Bloqueado" },
            ]}
          />

          <PremiumSelect
            label="UF"
            value={draftUf}
            onChange={setDraftUf}
            options={[
              { value: "", label: "Todas UFs" },
              ...UF_LIST.map((uf) => ({ value: uf, label: uf })),
            ]}
          />
        </div>
      </Modal>

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
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

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

  // Fecha ao clicar fora.
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 215, height: 52 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          height: "100%",
          textAlign: "left",
          padding: "20px 46px 7px 48px",
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          background: theme.bg,
          fontSize: 14,
          fontWeight: 700,
          color: "#0f172a",
          outline: "none",
          fontFamily: "inherit",
          boxShadow: theme.shadow,
          transition: "all 0.18s ease",
          cursor: "pointer",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {selectedLabel}
      </button>

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
          transition: "transform 0.18s ease",
        }}
      >
        <ChevronDown
          size={16}
          strokeWidth={2.4}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s ease" }}
        />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            boxShadow: "0 20px 40px rgba(15,23,42,0.14)",
            maxHeight: 260,
            overflowY: "auto",
            padding: 6,
          }}
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: active ? "#f1f5f9" : "transparent",
                  color: "#0f172a",
                  fontSize: 13.5,
                  fontWeight: active ? 800 : 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = active ? "#f1f5f9" : "transparent";
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}