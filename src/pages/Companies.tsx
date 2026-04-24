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
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterGrupo, setFilterGrupo] = useState("");
  const [page, setPage] = useState(1);

  const { items, loading, create, buscarCnpj } = useCompanies();

  useEffect(() => {
    setPage(1);
  }, [search, filterSituacao, filterGrupo]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return items.filter((c) => {
      if (filterSituacao && c.situacao !== filterSituacao) return false;
      if (filterGrupo && c.grupo !== filterGrupo) return false;
      if (!q) return true;

      return (
        (c.razaoSocial || "").toLowerCase().includes(q) ||
        (c.nomeFantasia || "").toLowerCase().includes(q) ||
        (c.cnpj || "").replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
        (c.cod || "").toLowerCase().includes(q) ||
        (c.grupo || "").toLowerCase().includes(q)
      );
    });
  }, [items, search, filterSituacao, filterGrupo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const grupos = useMemo(
    () => [...new Set(items.map((c) => c.grupo).filter(Boolean))].sort() as string[],
    [items]
  );

  const hasFilters = !!(search || filterSituacao || filterGrupo);

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

        <select
          value={filterSituacao}
          onChange={(e) => setFilterSituacao(e.target.value)}
          style={{ ...iStyle, minWidth: 170 }}
        >
          <option value="">Situação (todas)</option>
          <option value="ATIVA">Ativa</option>
          <option value="SAIDA">Saída</option>
          <option value="SUSPENSA">Suspensa</option>
          <option value="ENCERRADA">Encerrada</option>
        </select>

        {grupos.length > 0 && (
          <select
            value={filterGrupo}
            onChange={(e) => setFilterGrupo(e.target.value)}
            style={{ ...iStyle, minWidth: 170 }}
          >
            <option value="">Grupo (todos)</option>
            {grupos.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}

        {hasFilters && (
          <button
            onClick={() => {
              setSearch("");
              setFilterSituacao("");
              setFilterGrupo("");
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: 700,
              height: 50,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#64748b",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.16s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#f8fafc";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#fff";
            }}
          >
            <X size={13} />
            Limpar filtros
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