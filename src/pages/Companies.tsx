import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Input, Select, Card, Table, Thead, Th, Tr, Td, Empty, PageHeader, FormGrid, Divider, Badge, Loading } from "../ui";
import { Plus, FolderOpen, Search, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CompanyForm {
  cnpj: string; razaoSocial: string; nomeFantasia: string; cod: string; filial: string; grupo: string;
  tributacao: string; ieAtual: string; dataTributacao: string;
  motivoEntrada: string; situacao: string; dataSituacao: string;
  ramo: string; consultoria: string; banco: string; perfil: string; licitacao: string; qtdeFolha: string;
  responsavelComercial: string; dataEntrada: string; dataInicioCobranca: string; dataFimCobranca: string;
}

const EMPTY_FORM: CompanyForm = {
  cnpj: "", razaoSocial: "", nomeFantasia: "", cod: "", filial: "", grupo: "",
  tributacao: "", ieAtual: "", dataTributacao: "", motivoEntrada: "", situacao: "", dataSituacao: "",
  ramo: "", consultoria: "", banco: "", perfil: "", licitacao: "", qtdeFolha: "",
  responsavelComercial: "", dataEntrada: "", dataInicioCobranca: "", dataFimCobranca: "",
};

function formatCnpj(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length === 14) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  if (d.length >= 12)  return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4");
  if (d.length >= 9)   return d.replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
  if (d.length >= 6)   return d.replace(/^(\d{2})(\d{3})/, "$1.$2");
  return d;
}

const PAGE_SIZE = 20;

export function Companies({ onOpenCompany }: { onOpenCompany: (id: string) => void }) {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CompanyForm>(EMPTY_FORM);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSituacao, setFilterSituacao] = useState("");
  const [filterGrupo, setFilterGrupo] = useState("");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    try { setItems(await api("/api/companies")); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [search, filterSituacao, filterGrupo]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter(c => {
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
  const grupos = useMemo(() => [...new Set(items.map(c => c.grupo).filter(Boolean))].sort() as string[], [items]);
  const hasFilters = !!(search || filterSituacao || filterGrupo);

  function set(field: keyof CompanyForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function buscarCnpj() {
    const cnpj = form.cnpj.replace(/\D/g, "");
    if (cnpj.length < 8) return;
    setLoadingCnpj(true);
    try {
      const r = await api(`/api/integrations/cnpj/${cnpj}`);
      setForm(p => ({ ...p, razaoSocial: r.razaoSocial || p.razaoSocial, nomeFantasia: r.nomeFantasia || p.nomeFantasia, ieAtual: r.ie || p.ieAtual, situacao: r.situacao || p.situacao, ramo: r.cnaePrincipal?.descricao || p.ramo }));
      toast("Dados do CNPJ carregados", "success");
    } catch (e: any) { toast(e.message || "Erro ao buscar CNPJ", "error"); }
    finally { setLoadingCnpj(false); }
  }

  async function create() {
    const cnpj = form.cnpj.replace(/\D/g, "");
    setSaving(true);
    try {
      await api("/api/companies", { method: "POST", body: JSON.stringify({ cnpj, razaoSocial: form.razaoSocial || undefined, nomeFantasia: form.nomeFantasia || undefined, cod: form.cod || undefined, filial: form.filial || undefined, grupo: form.grupo || undefined, tributacao: form.tributacao || undefined, ieAtual: form.ieAtual || undefined, dataTributacao: form.dataTributacao || undefined, motivoEntrada: form.motivoEntrada || undefined, situacao: form.situacao || undefined, dataSituacao: form.dataSituacao || undefined, ramo: form.ramo || undefined, consultoria: form.consultoria || undefined, banco: form.banco || undefined, perfil: form.perfil || undefined, licitacao: form.licitacao || undefined, qtdeFolha: form.qtdeFolha ? Number(form.qtdeFolha) : undefined, responsavelComercial: form.responsavelComercial || undefined, dataEntrada: form.dataEntrada || undefined, dataInicioCobranca: form.dataInicioCobranca || undefined, dataFimCobranca: form.dataFimCobranca || undefined }) });
      toast("Empresa cadastrada com sucesso", "success");
      setModalOpen(false); setForm(EMPTY_FORM); load();
    } catch (e: any) { toast(e.message || "Erro ao criar empresa", "error"); }
    finally { setSaving(false); }
  }

  const iStyle: React.CSSProperties = { padding: "9px 12px", fontSize: 13.5, borderRadius: 9, border: "1.5px solid #e2e8f0", outline: "none", color: "#0f172a", background: "#f8fafc", fontFamily: "inherit", cursor: "pointer" };

  return (
    <div>
      <PageHeader
        title="Empresas"
        subtitle={loading ? "" : `${filtered.length} de ${items.length} empresa${items.length !== 1 ? "s" : ""}`}
        action={
          <button onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s", boxShadow: "0 2px 8px rgba(37,99,235,0.22)" }}
            onMouseOver={e => { e.currentTarget.style.background = "#1d4ed8"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#2563eb"; }}>
            <Plus size={15} strokeWidth={2.5} /> Nova empresa
          </button>
        }
      />

      {/* Filtros */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
          <div style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }}>
            <Search size={14} />
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar razão social, CNPJ, código, grupo..."
            style={{ ...iStyle, width: "100%", paddingLeft: 34, boxSizing: "border-box" as const }}
            onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.10)"; }}
            onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
              <X size={14} />
            </button>
          )}
        </div>
        <select value={filterSituacao} onChange={e => setFilterSituacao(e.target.value)} style={{ ...iStyle, minWidth: 160 }}>
          <option value="">Situação (todas)</option>
          <option value="ATIVA">Ativa</option>
          <option value="SAIDA">Saída</option>
          <option value="SUSPENSA">Suspensa</option>
          <option value="ENCERRADA">Encerrada</option>
        </select>
        {grupos.length > 0 && (
          <select value={filterGrupo} onChange={e => setFilterGrupo(e.target.value)} style={{ ...iStyle, minWidth: 150 }}>
            <option value="">Grupo (todos)</option>
            {grupos.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
        {hasFilters && (
          <button onClick={() => { setSearch(""); setFilterSituacao(""); setFilterGrupo(""); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "9px 13px", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", fontFamily: "inherit" }}
            onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}>
            <X size={13} /> Limpar filtros
          </button>
        )}
      </div>

      <Card>
        {loading ? (
          <Loading message="Carregando empresas..." />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th style={{ width: 50 }}>Cod.</Th><Th>Razão social</Th><Th>Nome fantasia</Th><Th>CNPJ</Th>
                  <Th>Grupo</Th><Th>Situação</Th><Th>Perfil</Th><Th></Th>
                </tr>
              </Thead>
              <tbody>
                {paginated.map(c => (
                  <Tr key={c.id}>
                    <Td style={{ fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}>{c.cod ?? "—"}</Td>
                    <Td style={{ fontWeight: 600 }}>{c.razaoSocial ?? <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td style={{ color: "#6b7280" }}>{c.nomeFantasia ?? <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td><span style={{ fontFamily: "monospace", fontSize: 12 }}>{c.cnpj}</span></Td>
                    <Td style={{ color: "#6b7280" }}>{c.grupo ?? <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td>{c.situacao ? <Badge label={c.situacao} variant={c.situacao === "SAIDA" || c.situacao === "ENCERRADA" ? "red" : c.situacao === "ATIVA" ? "green" : "yellow"} /> : <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td style={{ fontSize: 12.5 }}>{c.perfil ?? <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td align="right">
                      <button title="Abrir empresa" onClick={() => onOpenCompany(c.id)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s" }}
                        onMouseOver={e => { e.currentTarget.style.background = "#f0f0ff"; e.currentTarget.style.borderColor = "#93c5fd"; (e.currentTarget as any).style.color = "#2563eb"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; (e.currentTarget as any).style.color = "#374151"; }}>
                        <FolderOpen size={14} strokeWidth={2} />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            {!paginated.length && <Empty message={hasFilters ? "Nenhuma empresa encontrada para esse filtro." : "Nenhuma empresa cadastrada."} />}

            {/* Paginação */}
            {filtered.length > PAGE_SIZE && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
                <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
                </span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    style={{ width: 32, height: 32, borderRadius: 7, border: "1.5px solid #e2e8f0", background: "#fff", color: page === 1 ? "#d1d5db" : "#374151", cursor: page === 1 ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronLeft size={14} strokeWidth={2.5} />
                  </button>
                  {(() => {
                    const pages: number[] = [];
                    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
                    else if (page <= 4)  { pages.push(1,2,3,4,5,-1,totalPages); }
                    else if (page >= totalPages - 3) { pages.push(1,-1,totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages); }
                    else { pages.push(1,-1,page-1,page,page+1,-2,totalPages); }
                    return pages.map((p, i) =>
                      p < 0 ? <span key={`e${i}`} style={{ padding: "0 3px", color: "#94a3b8", fontSize: 13 }}>…</span> :
                      <button key={p} onClick={() => setPage(p)}
                        style={{ width: 32, height: 32, borderRadius: 7, border: `1.5px solid ${p === page ? "#2563eb" : "#e2e8f0"}`, background: p === page ? "#dbeafe" : "#fff", color: p === page ? "#2563eb" : "#374151", fontWeight: p === page ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        {p}
                      </button>
                    );
                  })()}
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                    style={{ width: 32, height: 32, borderRadius: 7, border: "1.5px solid #e2e8f0", background: "#fff", color: page === totalPages ? "#d1d5db" : "#374151", cursor: page === totalPages ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal cadastro */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova empresa" width={640}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={create} disabled={form.cnpj.replace(/\D/g, "").length < 8 || saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (form.cnpj.replace(/\D/g, "").length < 8 || saving) ? 0.45 : 1 }}>
              <Plus size={14} strokeWidth={2.5} />
              {saving ? "Salvando..." : "Cadastrar"}
            </button>
          </>
        }>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Input label="CNPJ *" placeholder="00.000.000/0000-00" value={form.cnpj} onChange={e => setForm(p => ({ ...p, cnpj: formatCnpj(e.target.value) }))} />
            </div>
            <button onClick={buscarCnpj} disabled={loadingCnpj || form.cnpj.replace(/\D/g, "").length < 8}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit", height: 42, flexShrink: 0, opacity: (loadingCnpj || form.cnpj.replace(/\D/g, "").length < 8) ? 0.45 : 1 }}>
              <Search size={14} strokeWidth={2} />{loadingCnpj ? "Buscando..." : "Consultar"}
            </button>
          </div>
          <Divider label="Identificação" />
          <FormGrid cols={3}><div style={{ gridColumn: "span 2" }}><Input label="Razão social" value={form.razaoSocial} onChange={set("razaoSocial")} /></div><Input label="Cód." value={form.cod} onChange={set("cod")} /></FormGrid>
          <FormGrid><Input label="Nome fantasia" value={form.nomeFantasia} onChange={set("nomeFantasia")} /><Input label="Grupo" value={form.grupo} onChange={set("grupo")} /></FormGrid>
          <FormGrid><Select label="Filial" value={form.filial} onChange={set("filial")}><option value="">Selecione...</option><option value="Matriz">Matriz</option><option value="Filial">Filial</option></Select><Input label="Resp. Comercial" value={form.responsavelComercial} onChange={set("responsavelComercial")} /></FormGrid>
          <Divider label="Fiscal / Tributação" />
          <FormGrid cols={3}><Select label="Tributação" value={form.tributacao} onChange={set("tributacao")}><option value="">Selecione...</option><option value="SIMPLES">Simples Nacional</option><option value="PRESUMIDO">Lucro Presumido</option><option value="REAL">Lucro Real</option><option value="MEI">MEI</option><option value="ISENTO">Isento</option></Select><Input label="IE Atual" value={form.ieAtual} onChange={set("ieAtual")} /><Input label="Data Tributação" type="date" value={form.dataTributacao} onChange={set("dataTributacao")} /></FormGrid>
          <Divider label="Situação" />
          <FormGrid cols={3}><Select label="Motivo de Entrada" value={form.motivoEntrada} onChange={set("motivoEntrada")}><option value="">Selecione...</option><option value="CONSTITUIÇÃO">Constituição</option><option value="TRANSFERÊNCIA">Transferência</option><option value="INDICAÇÃO">Indicação</option><option value="OUTROS">Outros</option></Select><Select label="Situação" value={form.situacao} onChange={set("situacao")}><option value="">Selecione...</option><option value="ATIVA">Ativa</option><option value="SAIDA">Saída</option><option value="SUSPENSA">Suspensa</option><option value="ENCERRADA">Encerrada</option></Select><Input label="Data da Situação" type="date" value={form.dataSituacao} onChange={set("dataSituacao")} /></FormGrid>
          <Divider label="Operacional" />
          <FormGrid cols={3}><Input label="Ramo" value={form.ramo} onChange={set("ramo")} /><Input label="Consultoria" value={form.consultoria} onChange={set("consultoria")} /><Input label="Qtde Folha" type="number" value={form.qtdeFolha} onChange={set("qtdeFolha")} /></FormGrid>
          <FormGrid cols={3}><Select label="Banco" value={form.banco} onChange={set("banco")}><option value="">Selecione...</option><option value="SIM">Sim</option><option value="NÃO">Não</option></Select><Select label="Licitação" value={form.licitacao} onChange={set("licitacao")}><option value="">Selecione...</option><option value="SIM">Sim</option><option value="NÃO">Não</option></Select><Input label="Perfil" value={form.perfil} onChange={set("perfil")} /></FormGrid>
          <Divider label="Datas" />
          <FormGrid cols={3}><Input label="Data de Entrada" type="date" value={form.dataEntrada} onChange={set("dataEntrada")} /><Input label="Início Cobrança" type="date" value={form.dataInicioCobranca} onChange={set("dataInicioCobranca")} /><Input label="Fim Cobrança" type="date" value={form.dataFimCobranca} onChange={set("dataFimCobranca")} /></FormGrid>
        </div>
      </Modal>
    </div>
  );
}
