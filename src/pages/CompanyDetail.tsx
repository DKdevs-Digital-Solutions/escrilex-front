import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Badge, Card, SectionCard, Table, Thead, Th, Tr, Td, Empty, Loading, Toggle, Tabs, Input, Select, FormGrid, Divider, IconBtn } from "../ui";
import { ArrowLeft, Maximize2, Save, ClipboardCheck, Pencil, Trash2, UserPlus, Users } from "lucide-react";
import { useConfirm } from "../confirm";
import { ChevronDown, Clock, CheckCircle2, Hash, MinusCircle } from "lucide-react";

type ItemStatusFull = "PENDENTE" | "CONCLUIDO" | "EM_ANDAMENTO" | "NA";

const STATUS_CFG: Record<ItemStatusFull, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  PENDENTE:     { label: "Pendente",     color: "#64748b", bg: "#f8fafc",  border: "#e2e8f0", icon: <Clock        size={12} strokeWidth={2} /> },
  EM_ANDAMENTO: { label: "Em andamento", color: "#d97706", bg: "#fffbeb",  border: "#fde68a", icon: <Hash        size={12} strokeWidth={2.5} /> },
  CONCLUIDO:        { label: "Concluído",    color: "#16a34a", bg: "#f0fdf4",  border: "#bbf7d0", icon: <CheckCircle2  size={12} strokeWidth={2} /> },
  NA:           { label: "Não se aplica",color: "#94a3b8", bg: "#f1f5f9",  border: "#e2e8f0", icon: <MinusCircle   size={12} strokeWidth={2} /> },
};

function StatusPicker({ value, onChange, disabled }: {
  value: ItemStatusFull; onChange: (s: ItemStatusFull) => void; disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const cfg = STATUS_CFG[value] ?? STATUS_CFG.PENDENTE;
  React.useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 9px 5px 7px", borderRadius: 7, border: `1.5px solid ${cfg.border}`, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.12s", opacity: disabled ? 0.55 : 1, whiteSpace: "nowrap" }}>
        {cfg.icon}{cfg.label}<ChevronDown size={10} strokeWidth={2.5} style={{ marginLeft: 1, opacity: 0.6 }} />
      </button>
      {open && (() => {
        const el = ref.current?.getBoundingClientRect();
        return (
          <div style={{ position: "fixed", top: el ? el.bottom + 5 : 0, left: el ? el.left : 0, zIndex: 9999, background: "#fff", borderRadius: 10, border: "1.5px solid #e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.13)", minWidth: 168, overflow: "hidden", animation: "dropIn 0.12s ease" }}>
            <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }`}</style>
            {(Object.entries(STATUS_CFG) as [ItemStatusFull, typeof STATUS_CFG[ItemStatusFull]][]).map(([k, c]) => (
              <button key={k} onClick={() => { onChange(k); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 13px", border: "none", background: k === value ? "#f8fafc" : "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: k === value ? 700 : 500, color: c.color, textAlign: "left", transition: "background 0.1s" }}
                onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
                onMouseOut={e => { e.currentTarget.style.background = k === value ? "#f8fafc" : "#fff"; }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 5, background: c.bg, border: `1.5px solid ${c.border}`, flexShrink: 0 }}>{c.icon}</span>
                {c.label}
                {k === value && <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>✓</span>}
              </button>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

type ChecklistType = "ENTRADA" | "SAIDA";
type ItemStatus = "EM_ANDAMENTO" | "PENDENTE" | "CONCLUIDO" | "NA";
type TabId = "dados" | "socios" | "responsaveis" | "checklist" | "historico";

function fmtDate(v?: string | null) {
  if (!v) return null;
  try { return new Date(v).toLocaleDateString("pt-BR"); } catch { return v; }
}

function isOverdue(dueDate?: string | null, status?: ItemStatus) {
  if (!dueDate || status !== "PENDENTE") return false;
  return new Date(dueDate).getTime() < Date.now();
}

function SituacaoBadge({ v }: { v?: string }) {
  if (!v) return <span style={{ color: "#d1d5db" }}>—</span>;
  const variant = v === "SAIDA" || v === "ENCERRADA" ? "red" : v === "ATIVA" ? "green" : "yellow";
  return <Badge label={v} variant={variant} />;
}

// ─── Editar campo inline ────────────────────────────────────────────────────────
function DataField({ label, value, editing, editValue, onEditChange, type = "text" }: {
  label: string; value?: React.ReactNode; editing?: boolean;
  editValue?: string; onEditChange?: (v: string) => void; type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      {editing && onEditChange !== undefined ? (
        <input
          type={type} value={editValue ?? ""} onChange={e => onEditChange(e.target.value)}
          style={{
            padding: "7px 10px", fontSize: 13, borderRadius: 8, border: "1.5px solid #2563eb",
            outline: "none", fontFamily: "inherit", background: "#fff", color: "#0f172a",
            boxShadow: "0 0 0 3px rgba(37,99,235,0.10)", width: "100%", boxSizing: "border-box" as const,
          }}
        />
      ) : (
        <span style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 500 }}>
          {value ?? <span style={{ color: "#cbd5e1" }}>—</span>}
        </span>
      )}
    </div>
  );
}

function SelectField({ label, value, editing, editValue, onEditChange, options }: {
  label: string; value?: React.ReactNode; editing?: boolean;
  editValue?: string; onEditChange?: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      {editing && onEditChange !== undefined ? (
        <select value={editValue ?? ""} onChange={e => onEditChange(e.target.value)}
          style={{ padding: "7px 10px", fontSize: 13, borderRadius: 8, border: "1.5px solid #2563eb", outline: "none", fontFamily: "inherit", background: "#fff", color: "#0f172a", boxShadow: "0 0 0 3px rgba(37,99,235,0.10)", width: "100%" }}>
          <option value="">Selecione...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <span style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 500 }}>
          {value ?? <span style={{ color: "#cbd5e1" }}>—</span>}
        </span>
      )}
    </div>
  );
}

export function CompanyDetail({ companyId, isAdmin, userRoles, onBack, onOpenRun }: {
  companyId: string; isAdmin: boolean; userRoles?: string[];
  onBack: () => void; onOpenRun: (runId: string) => void;
}) {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [company, setCompany] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [socios, setSocios] = useState<any[]>([]);
  const [checklistType, setChecklistType] = useState<ChecklistType>("ENTRADA");
  const [historicoType, setHistoricoType] = useState<ChecklistType>("ENTRADA");
  const [runs, setRuns] = useState<any[]>([]);
  const [historicoRuns, setHistoricoRuns] = useState<any[]>([]);
  const [defaultTemplate, setDefaultTemplate] = useState<any>(null);
  const [run, setRun] = useState<any>(null);
  const [savingItem, setSavingItem] = useState<string>("");
  const [draftObs, setDraftObs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabId>("dados");
  const [savingResp, setSavingResp] = useState(false);
  const [loadingBase, setLoadingBase] = useState(true);
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  // ── Edição de dados ──
  const canEdit = isAdmin || (userRoles || []).includes("GESTOR_EMPRESA");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  // ── Sócios ──
  const [socioModal, setSocioModal] = useState(false);
  const [editSocio, setEditSocio] = useState<any>(null);
  const [socioForm, setSocioForm] = useState({ nomeCompleto: "", whatsapp: "", email: "", telefoneEmpresa: "", dataNascimento: "", outros: "" });
  const [savingSocio, setSavingSocio] = useState(false);

  async function loadBase() {
    setLoadingBase(true);
    try {
      const [c, s, u] = await Promise.all([
        api(`/api/companies/${companyId}`),
        api("/api/lookup/sectors"),
        api("/api/lookup/users"),
      ]);
      setCompany(c); setSectors(s); setUsers(u);
      // Sócios: tenta carregar, ignora 404
      try { setSocios(await api(`/api/companies/${companyId}/partners`)); }
      catch { setSocios([]); }
    } finally { setLoadingBase(false); }
  }

  async function loadRuns(nextType: ChecklistType) {
    const r = await api(`/api/companies/${companyId}/checklists?type=${nextType}`);
    setRuns(r); return r;
  }

  async function loadHistoricoRuns(nextType: ChecklistType) {
    const r = await api(`/api/companies/${companyId}/checklists?type=${nextType}`);
    setHistoricoRuns(r); return r;
  }

  async function loadDefaultTemplate(nextType = type) {
    try {
      const t = await api(`/api/templates/default/by-type/${nextType}`);
      setDefaultTemplate(t); return t;
    } catch {
      setDefaultTemplate(null); return null;
    }
  }

  async function loadRunDetail(runId: string) {
    const r = await api(`/api/checklists/run/${runId}`);
    // Se o run retornou sem seções no template, tenta buscar o template padrão
    // e injeta os itemRunIds do run nos itens correspondentes
    if ((!r.template?.sections || r.template.sections.length === 0)) {
      try {
        const defT = await api(`/api/templates/default/by-type/${checklistType}`);
        // Flatten dos itemRuns retornados pelo run (se tiver itemRuns direto)
        const itemRunMap: Record<string, any> = {};
        if (r.itemRuns) for (const ir of r.itemRuns) itemRunMap[ir.templateItemId] = ir;
        // Injetar nos itens do defaultTemplate
        const mergedSections = defT.sections.map((s: any) => ({
          ...s,
          items: s.items.map((it: any) => {
            const ir = itemRunMap[it.id];
            return ir ? { ...it, templateItemId: it.id, itemRunId: ir.id, status: ir.status, observation: ir.observation, doneAt: ir.doneAt } : { ...it, templateItemId: it.id };
          }),
        }));
        r.template = { ...defT, sections: mergedSections };
        setDefaultTemplate(defT);
      } catch { /* mantém sem seções */ }
    }
    setRun(r);
    const next: Record<string, string> = {};
    for (const s of (r.template?.sections ?? []))
      for (const it of s.items)
        if (it.itemRunId) next[it.itemRunId] = it.observation ?? "";
    setDraftObs(next);
    return r;
  }

  async function refreshForType(nextType: ChecklistType) {
    setLoadingChecklist(true);
    setRun(null);
    try {
      const [rlist, defT] = await Promise.all([loadRuns(nextType), loadDefaultTemplate(nextType)]);
      const latest = rlist?.[0];
      if (latest?.id) {
        const r = await api(`/api/checklists/run/${latest.id}`);
        const runSections = r?.template?.sections;
        // Se o run tem seções, usar direto; senão mergear com defaultTemplate
        if (runSections && runSections.length > 0) {
          setRun(r);
          const next: Record<string, string> = {};
          for (const s of runSections)
            for (const it of s.items)
              if (it.itemRunId) next[it.itemRunId] = it.observation ?? "";
          setDraftObs(next);
        } else if (defT?.sections?.length > 0) {
          // Tentar cruzar itemRuns do run com itens do defaultTemplate
          const itemRunMap: Record<string, any> = {};
          if (r.itemRuns) for (const ir of r.itemRuns) itemRunMap[ir.templateItemId] = ir;
          const mergedSections = defT.sections.map((s: any) => ({
            ...s,
            items: s.items.map((it: any) => {
              const ir = itemRunMap[it.id];
              return ir
                ? { ...it, templateItemId: it.id, itemRunId: ir.id, status: ir.status, observation: ir.observation, doneAt: ir.doneAt }
                : { ...it, templateItemId: it.id };
            }),
          }));
          setRun({ ...r, template: { ...defT, sections: mergedSections } });
          const next: Record<string, string> = {};
          for (const s of mergedSections)
            for (const it of s.items)
              if (it.itemRunId) next[it.itemRunId] = it.observation ?? "";
          setDraftObs(next);
        } else {
          setRun(r);
          setDraftObs({});
        }
      } else {
        setRun(null); setDraftObs({});
      }
    } finally { setLoadingChecklist(false); }
  }

  useEffect(() => { loadBase(); }, [companyId]);
  useEffect(() => { if (activeTab === "checklist") refreshForType(checklistType); }, [checklistType, companyId]);
  useEffect(() => { if (activeTab === "checklist") refreshForType(checklistType); else if (activeTab === "historico") loadHistoricoRuns(historicoType); }, [activeTab]);

  const responsibleMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of company?.responsibles || []) m.set(r.sectorId, r.userId);
    return m;
  }, [company]);

  function setResponsible(sectorId: string, userId: string) {
    const current = [...(company?.responsibles || [])];
    const idx = current.findIndex((r: any) => r.sectorId === sectorId);
    if (idx >= 0) current[idx] = { ...current[idx], userId };
    else current.push({ sectorId, userId });
    setCompany({ ...company, responsibles: current });
  }

  async function saveResponsibles() {
    setSavingResp(true);
    const responsibles = sectors.map(s => ({ sectorId: s.id, userId: responsibleMap.get(s.id) || "" })).filter(x => x.userId);
    try {
      await api(`/api/companies/${companyId}/responsibles`, { method: "PUT", body: JSON.stringify({ responsibles }) });
      await loadBase(); toast("Responsáveis salvos", "success");
    } catch (e: any) { toast(e.message || "Erro ao salvar", "error"); }
    finally { setSavingResp(false); }
  }

  async function ensureRunExists() {
    if (run?.id) {
      // Run já existe — buscar o itemRunMap atual do backend
      const fresh = await api(`/api/checklists/run/${run.id}`);
      const map: Record<string, string> = {};
      for (const s of fresh?.template?.sections ?? [])
        for (const it of s.items)
          if (it.itemRunId) map[it.templateItemId ?? it.id] = it.itemRunId;
      return { runId: run.id, itemRunMap: map };
    }
    const r = await api("/api/checklists/start", { method: "POST", body: JSON.stringify({ companyId, type: checklistType }) });
    await loadRuns(checklistType); await loadRunDetail(r.runId);
    return { runId: r.runId, itemRunMap: r.itemRunMap || {} };
  }

  async function setStatus(templateItemId: string, itemRunId: string | undefined, status: ItemStatusFull) {
    setSavingItem(templateItemId);
    try {
      let id = itemRunId;
      if (!id) {
        // Buscar ou criar o run e obter o mapa de itemRunIds
        const ensured = await ensureRunExists();
        if (!ensured) return;
        id = ensured.itemRunMap?.[templateItemId];
      }
      if (!id) {
        // itemRun ainda não existe — criar via POST com runId + templateItemId
        const runId = run?.id || (await api(`/api/companies/${companyId}/checklists?type=${checklistType}`))?.[0]?.id;
        if (!runId) return toast("Run não encontrado. Recarregue.", "error");
        const created = await api(`/api/checklists/item`, {
          method: "POST",
          body: JSON.stringify({ runId, templateItemId, status }),
        });
        id = created?.id;
      }
      if (!id) return toast("Não foi possível localizar o item. Recarregue.", "error");
      await api(`/api/checklists/item/${id}`, { method: "PATCH", body: JSON.stringify({ status: status }) });
      // Recarregar o run para refletir o novo estado
      const currentRunId = run?.id || (await api(`/api/companies/${companyId}/checklists?type=${checklistType}`))[0]?.id;
      if (currentRunId) await refreshForType(checklistType);
    } catch (e: any) { toast(e.message || "Erro", "error"); }
    finally { setSavingItem(""); }
  }

  async function saveObservation(templateItemId: string, itemRunId: string | undefined) {
    if (!itemRunId) { toast("Defina o status antes de adicionar observação.", "warning"); return; }
    setSavingItem(templateItemId);
    try {
      await api(`/api/checklists/item/${itemRunId}`, { method: "PATCH", body: JSON.stringify({ observation: draftObs[itemRunId] ?? "" }) });
    } catch (e: any) { toast(e.message || "Erro", "error"); }
    finally { setSavingItem(""); }
  }

  // ── Editar dados da empresa ──
  function startEdit() {
    setEditForm({
      razaoSocial: company.razaoSocial || "", nomeFantasia: company.nomeFantasia || "",
      cod: company.cod || "", filial: company.filial || "", grupo: company.grupo || "",
      tributacao: company.tributacao || "", ieAtual: company.ieAtual || "",
      dataTributacao: company.dataTributacao?.slice(0,10) || "",
      motivoEntrada: company.motivoEntrada || "", situacao: company.situacao || "",
      dataSituacao: company.dataSituacao?.slice(0,10) || "",
      ramo: company.ramo || "", consultoria: company.consultoria || "",
      banco: company.banco || "", perfil: company.perfil || "",
      licitacao: company.licitacao || "", qtdeFolha: company.qtdeFolha ?? "",
      responsavelComercial: company.responsavelComercial || "",
      dataEntrada: company.dataEntrada?.slice(0,10) || "",
      dataInicioCobranca: company.dataInicioCobranca?.slice(0,10) || "",
      dataFimCobranca: company.dataFimCobranca?.slice(0,10) || "",
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSavingEdit(true);
    try {
      await api(`/api/companies/${companyId}`, { method: "PUT", body: JSON.stringify({ ...editForm, qtdeFolha: editForm.qtdeFolha ? Number(editForm.qtdeFolha) : undefined }) });
      toast("Dados salvos", "success");
      setEditing(false);
      await loadBase();
    } catch (e: any) { toast(e.message || "Erro ao salvar", "error"); }
    finally { setSavingEdit(false); }
  }

  function ef(field: string) {
    return (v: string) => setEditForm((p: any) => ({ ...p, [field]: v }));
  }

  // ── Sócios ──
  async function saveSocio() {
    setSavingSocio(true);
    const EMPTY_SOCIO = { nomeCompleto: "", whatsapp: "", email: "", telefoneEmpresa: "", dataNascimento: "", outros: "" };
    const payload = {
      nomeCompleto:    socioForm.nomeCompleto.trim(),
      whatsapp:        socioForm.whatsapp.trim()        || null,
      email:           socioForm.email.trim()           || null,
      telefoneEmpresa: socioForm.telefoneEmpresa.trim() || null,
      dataNascimento:  socioForm.dataNascimento         || null,
      outros:          socioForm.outros.trim()          || null,
    };
    try {
      if (editSocio) {
        await api(`/api/companies/${companyId}/partners/${editSocio.id}`, { method: "PUT", body: JSON.stringify(payload) });
        toast("Sócio atualizado", "success");
      } else {
        await api(`/api/companies/${companyId}/partners`, { method: "POST", body: JSON.stringify(payload) });
        toast("Sócio adicionado", "success");
      }
      setSocioModal(false); setEditSocio(null);
      setSocioForm(EMPTY_SOCIO);
      try { setSocios(await api(`/api/companies/${companyId}/partners`)); } catch {}
    } catch (e: any) { toast(e.message || "Erro ao salvar sócio", "error"); }
    finally { setSavingSocio(false); }
  }

  async function deleteSocio(id: string) {
    const ok = await confirm({ title: "Remover sócio", message: "Esta ação não pode ser desfeita. O sócio será removido permanentemente.", confirmLabel: "Remover", variant: "danger" });
    if (!ok) return;
    try {
      await api(`/api/companies/${companyId}/partners/${id}`, { method: "DELETE" });
      toast("Sócio removido", "warning");
      try { setSocios(await api(`/api/companies/${companyId}/partners`)); } catch { setSocios(s => s.filter((x: any) => x.id !== id)); }
    } catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  if (loadingBase) return <Loading message="Carregando empresa..." />;
  if (!company) return <Loading message="Carregando..." />;

  // Se temos um run, usar suas seções (com status/itemRunId)
  // Se run.template.sections está vazio mas temos defaultTemplate, cruzar os dados
  const rawSections = run?.template?.sections ?? [];
  const sections = (() => {
    if (rawSections.length > 0) return rawSections;
    if (!defaultTemplate?.sections) return [];
    // Run existe mas template do run não tem seções (template antigo/sem seções)
    // Usar defaultTemplate mas sem itemRunIds (sem status persistido)
    return defaultTemplate.sections;
  })();
  const totalItems = sections.reduce((a: number, s: any) => a + s.items.length, 0);
  const doneItems = sections.reduce((a: number, s: any) => a + s.items.filter((it: any) => it.status === "CONCLUIDO" || it.status === "NA").length, 0);
  const pct = totalItems > 0 ? Math.round(doneItems / totalItems * 100) : 0;

  const TABS: { id: TabId; label: string; count?: number }[] = [
    { id: "dados", label: "Dados" },
    { id: "socios", label: "Sócios", count: socios.length },
    { id: "responsaveis", label: "Responsáveis", count: sectors.length },
    { id: "checklist", label: "Checklist" },
    ...(isAdmin ? [{ id: "historico" as TabId, label: "Histórico", count: historicoRuns.length }] : []),
  ];

  const selStyle: React.CSSProperties = { padding: "7px 10px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#f8fafc", color: "#0f172a", outline: "none", fontFamily: "inherit", cursor: "pointer" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
        <button onClick={onBack} title="Voltar"
          style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.12s", flexShrink: 0 }}
          onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
          onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}>
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 5px", fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
            {company.razaoSocial ?? company.nomeFantasia ?? company.cnpj}
          </h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>{company.cnpj}</span>
            {company.nomeFantasia && company.razaoSocial && <span style={{ fontSize: 13, color: "#64748b" }}>{company.nomeFantasia}</span>}
            {company.cod && <span style={{ fontSize: 12, color: "#94a3b8" }}>Cod. {company.cod}</span>}
            <SituacaoBadge v={company.situacao} />
            {company.perfil && <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: 700, background: "#1e293b", color: "#fff" }}>{company.perfil}</span>}
          </div>
        </div>
      </div>

      <Tabs active={activeTab} onChange={setActiveTab} tabs={TABS} />

      {/* ── Tab: Dados ── */}
      {activeTab === "dados" && (
        <div>
          <Card>
            {/* Header do card com botão editar */}
            <div style={{ padding: "14px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fafbfc" }}>
              <span style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>Informações cadastrais</span>
              {canEdit && (
                editing ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditing(false)}
                      style={{ padding: "5px 14px", fontSize: 12.5, fontWeight: 600, borderRadius: 7, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", fontFamily: "inherit" }}>
                      Cancelar
                    </button>
                    <button onClick={saveEdit} disabled={savingEdit}
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 14px", fontSize: 12.5, fontWeight: 700, borderRadius: 7, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: savingEdit ? 0.5 : 1 }}>
                      <Save size={13} strokeWidth={2} />
                      {savingEdit ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                ) : (
                  <button onClick={startEdit}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", fontSize: 12.5, fontWeight: 600, borderRadius: 7, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit", transition: "background 0.12s" }}
                    onMouseOver={e => { e.currentTarget.style.background = "#f1f5f9"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}>
                    <Pencil size={12} strokeWidth={2} />
                    Editar
                  </button>
                )
              )}
            </div>
            {/* Identificação */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Identificação</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px 24px" }}>
                <DataField label="Razão social" value={company.razaoSocial} editing={editing} editValue={editForm.razaoSocial} onEditChange={ef("razaoSocial")} />
                <DataField label="Nome fantasia" value={company.nomeFantasia} editing={editing} editValue={editForm.nomeFantasia} onEditChange={ef("nomeFantasia")} />
                <DataField label="CNPJ" value={<span style={{ fontFamily: "monospace" }}>{company.cnpj}</span>} />
                <DataField label="Cód." value={company.cod} editing={editing} editValue={editForm.cod} onEditChange={ef("cod")} />
                <SelectField label="Filial" value={company.filial} editing={editing} editValue={editForm.filial} onEditChange={ef("filial")} options={[{value:"Matriz",label:"Matriz"},{value:"Filial",label:"Filial"}]} />
                <DataField label="Grupo" value={company.grupo} editing={editing} editValue={editForm.grupo} onEditChange={ef("grupo")} />
              </div>
            </div>

            {/* Fiscal */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Fiscal / Tributação</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px 24px" }}>
                <SelectField label="Tributação" value={company.tributacao} editing={editing} editValue={editForm.tributacao} onEditChange={ef("tributacao")} options={[{value:"SIMPLES",label:"Simples Nacional"},{value:"PRESUMIDO",label:"Lucro Presumido"},{value:"REAL",label:"Lucro Real"},{value:"MEI",label:"MEI"},{value:"ISENTO",label:"Isento"}]} />
                <DataField label="IE Atual" value={company.ieAtual} editing={editing} editValue={editForm.ieAtual} onEditChange={ef("ieAtual")} />
                <DataField label="Data Tributação" value={fmtDate(company.dataTributacao)} editing={editing} editValue={editForm.dataTributacao} onEditChange={ef("dataTributacao")} type="date" />
              </div>
            </div>

            {/* Situação */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Situação no escritório</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px 24px" }}>
                <SelectField label="Motivo de Entrada" value={company.motivoEntrada} editing={editing} editValue={editForm.motivoEntrada} onEditChange={ef("motivoEntrada")} options={[{value:"CONSTITUIÇÃO",label:"Constituição"},{value:"TRANSFERÊNCIA",label:"Transferência"},{value:"INDICAÇÃO",label:"Indicação"},{value:"OUTROS",label:"Outros"}]} />
                <SelectField label="Situação" value={<SituacaoBadge v={company.situacao} />} editing={editing} editValue={editForm.situacao} onEditChange={ef("situacao")} options={[{value:"ATIVA",label:"Ativa"},{value:"SAIDA",label:"Saída"},{value:"SUSPENSA",label:"Suspensa"},{value:"ENCERRADA",label:"Encerrada"}]} />
                <DataField label="Data da Situação" value={fmtDate(company.dataSituacao)} editing={editing} editValue={editForm.dataSituacao} onEditChange={ef("dataSituacao")} type="date" />
              </div>
            </div>

            {/* Operacional */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Operacional / Comercial</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px 24px" }}>
                <DataField label="Ramo" value={company.ramo} editing={editing} editValue={editForm.ramo} onEditChange={ef("ramo")} />
                <DataField label="Consultoria" value={company.consultoria} editing={editing} editValue={editForm.consultoria} onEditChange={ef("consultoria")} />
                <SelectField label="Banco" value={company.banco} editing={editing} editValue={editForm.banco} onEditChange={ef("banco")} options={[{value:"SIM",label:"Sim"},{value:"NÃO",label:"Não"}]} />
                <SelectField label="Licitação" value={company.licitacao} editing={editing} editValue={editForm.licitacao} onEditChange={ef("licitacao")} options={[{value:"SIM",label:"Sim"},{value:"NÃO",label:"Não"}]} />
                <DataField label="Perfil" value={company.perfil} editing={editing} editValue={editForm.perfil} onEditChange={ef("perfil")} />
                <DataField label="Qtde Folha" value={company.qtdeFolha} editing={editing} editValue={String(editForm.qtdeFolha ?? "")} onEditChange={ef("qtdeFolha")} type="number" />
                <DataField label="Resp. Comercial" value={company.responsavelComercial} editing={editing} editValue={editForm.responsavelComercial} onEditChange={ef("responsavelComercial")} />
              </div>
            </div>

            {/* Datas */}
            <div style={{ padding: "18px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>Datas</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px 24px" }}>
                <DataField label="Data de Entrada" value={fmtDate(company.dataEntrada)} editing={editing} editValue={editForm.dataEntrada} onEditChange={ef("dataEntrada")} type="date" />
                <DataField label="Início Cobrança" value={fmtDate(company.dataInicioCobranca)} editing={editing} editValue={editForm.dataInicioCobranca} onEditChange={ef("dataInicioCobranca")} type="date" />
                <DataField label="Fim Cobrança" value={fmtDate(company.dataFimCobranca)} editing={editing} editValue={editForm.dataFimCobranca} onEditChange={ef("dataFimCobranca")} type="date" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Tab: Sócios ── */}
      {activeTab === "socios" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Sócios / Responsáveis legais</h3>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#94a3b8" }}>{socios.length} sócio{socios.length !== 1 ? "s" : ""} cadastrado{socios.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => { setEditSocio(null); setSocioForm({ nomeCompleto: "", whatsapp: "", email: "", telefoneEmpresa: "", dataNascimento: "", outros: "" }); setSocioModal(true); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(37,99,235,0.22)" }}
              onMouseOver={e => { e.currentTarget.style.background = "#1d4ed8"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#2563eb"; }}>
              <UserPlus size={14} strokeWidth={2.5} /> Adicionar sócio
            </button>
          </div>

          {socios.length === 0 ? (
            <Card>
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Users size={24} color="#94a3b8" strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Nenhum sócio cadastrado</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>Adicione os sócios e responsáveis legais desta empresa.</div>
              </div>
            </Card>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {socios.map((s: any) => (
                <Card key={s.id}>
                  {/* Card header */}
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#dbeafe", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#1d4ed8", fontWeight: 800, fontSize: 16 }}>
                      {(s.nomeCompleto || "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, fontWeight: 700, fontSize: 14.5, color: "#0f172a", letterSpacing: "-0.02em" }}>{s.nomeCompleto}</div>
                    <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      <IconBtn icon={<Pencil size={13} strokeWidth={2} />} title="Editar sócio" onClick={() => {
                        setEditSocio(s);
                        setSocioForm({ nomeCompleto: s.nomeCompleto || "", whatsapp: s.whatsapp || "", email: s.email || "", telefoneEmpresa: s.telefoneEmpresa || "", dataNascimento: s.dataNascimento ? new Date(s.dataNascimento).toISOString().slice(0,10) : "", outros: s.outros || "" });
                        setSocioModal(true);
                      }} />
                      <IconBtn icon={<Trash2 size={13} strokeWidth={2} />} title="Remover sócio" onClick={() => deleteSocio(s.id)} variant="danger" />
                    </div>
                  </div>
                  {/* Card body — campos do backend */}
                  <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                    {([
                      { label: "WhatsApp",        value: s.whatsapp },
                      { label: "E-mail",           value: s.email },
                      { label: "Telefone empresa", value: s.telefoneEmpresa },
                      { label: "Nascimento",       value: s.dataNascimento ? new Date(s.dataNascimento).toLocaleDateString("pt-BR") : null },
                      { label: "Outros",           value: s.outros },
                    ] as {label:string;value:string|null|undefined}[]).filter(f => f.value).map((f, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{f.label}</span>
                        <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Responsáveis ── */}
      {activeTab === "responsaveis" && (
        <SectionCard
          title="Responsáveis por setor"
          action={
            <button onClick={saveResponsibles} disabled={savingResp}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit", opacity: savingResp ? 0.5 : 1 }}
              onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}>
              <Save size={13} strokeWidth={2} />
              {savingResp ? "Salvando..." : "Salvar"}
            </button>
          }
        >
          <Table>
            <Thead><tr><Th>Setor</Th><Th>Responsável</Th><Th>E-mail</Th></tr></Thead>
            <tbody>
              {sectors.map(s => {
                const userId = responsibleMap.get(s.id) || "";
                const user = userId ? users.find(u => u.id === userId) : null;
                return (
                  <Tr key={s.id}>
                    <Td style={{ fontWeight: 500 }}>{s.name}</Td>
                    <Td>
                      <select value={userId} onChange={e => setResponsible(s.id, e.target.value)} style={{ ...selStyle, minWidth: 180 }}>
                        <option value="">(nenhum)</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                    </Td>
                    <Td style={{ color: "#6b7280", fontSize: 13 }}>{user?.email ?? "—"}</Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
          {!sectors.length && <Empty message="Nenhum setor cadastrado." />}
        </SectionCard>
      )}

      {/* ── Tab: Checklist ── */}
      {activeTab === "checklist" && (
        <div>
          {/* Controles */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {/* Botões Entrada / Saída */}
            {(["ENTRADA", "SAIDA"] as ChecklistType[]).map(t => (
              <button key={t} onClick={() => setChecklistType(t)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", fontSize: 13, fontWeight: checklistType === t ? 700 : 500, borderRadius: 8, border: `1.5px solid ${checklistType === t ? "#2563eb" : "#e2e8f0"}`, background: checklistType === t ? "#2563eb" : "#fff", color: checklistType === t ? "#fff" : "#64748b", cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s" }}>
                <ClipboardCheck size={13} strokeWidth={2} />
                {t === "ENTRADA" ? "Entrada" : "Saída"}
              </button>
            ))}

            {/* Barra de progresso */}
            {!loadingChecklist && totalItems > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden", maxWidth: 200 }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: pct === 100 ? "#22c55e" : "#2563eb", transition: "width 0.5s ease" }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? "#16a34a" : "#2563eb" }}>{pct}%</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{doneItems}/{totalItems}</span>
              </div>
            )}

            {!loadingChecklist && run?.id && (
              <button onClick={() => onOpenRun(run.id)} title="Abrir em tela cheia"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", fontSize: 13, fontWeight: 600, borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", cursor: "pointer", fontFamily: "inherit", transition: "background 0.12s" }}
                onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}>
                <Maximize2 size={13} strokeWidth={2} /> Tela cheia
              </button>
            )}

            {!loadingChecklist && (
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto" }}>
                {run ? `Âncora: ${run.anchorAt ? new Date(run.anchorAt).toLocaleString("pt-BR") : "não definida"}` : "Inicia no 1º check"}
              </span>
            )}
          </div>

          {loadingChecklist ? (
            <Loading message="Carregando checklist..." />
          ) : (
            <>
              {sections.map((s: any) => (
                <div key={s.id} style={{ marginBottom: 16, borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "visible" }}>
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", background: "#fafbfc", borderRadius: "12px 12px 0 0" }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{s.name}</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
                    <thead style={{ background: "#fafbfc", borderBottom: "1px solid #e2e8f0" }}>
                      <tr>
                        <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", width: 80 }}>Código</th>
                        <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Descrição</th>
                        <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", width: 180 }}>Status</th>
                        <th style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", width: 240 }}>Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.items.map((it: any) => {
                        const status: ItemStatusFull = (it.status ?? "PENDENTE") as ItemStatusFull;
                        const overdue = isOverdue(it.dueDate, it.status ?? "PENDENTE");
                        const itemRunId = it.itemRunId as string | undefined;
                        const tplItemId = it.templateItemId ?? it.id ?? it.itemId;
                        const obsValue = itemRunId ? (draftObs[itemRunId] ?? it.observation ?? "") : "";
                        return (
                          <tr key={tplItemId}
                            style={{ background: overdue ? "#fef9f9" : undefined, transition: "background 0.1s" }}
                            onMouseOver={e => { if (!overdue) (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc"; }}
                            onMouseOut={e => { (e.currentTarget as HTMLTableRowElement).style.background = overdue ? "#fef9f9" : ""; }}>
                            <td style={{ padding: "13px 18px", color: "#334155", verticalAlign: "middle", borderBottom: "1px solid #f1f5f9" }}><span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12 }}>{it.code ?? "—"}</span></td>
                            <td style={{ padding: "13px 18px", color: "#334155", verticalAlign: "middle", borderBottom: "1px solid #f1f5f9" }}>
                              <div style={{ fontWeight: 500, fontSize: 13.5 }}>{it.description}</div>
                              <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                                {it.isRequired && <Badge label="Obrigatório" variant="blue" />}
                                {it.dueDate && <Badge label={`Prazo ${fmtDate(it.dueDate)}`} variant={overdue ? "red" : "gray"} />}
                              </div>
                            </td>
                            <td style={{ padding: "13px 18px", verticalAlign: "middle", borderBottom: "1px solid #f1f5f9" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <StatusPicker
                                  value={status as ItemStatusFull}
                                  disabled={savingItem === tplItemId}
                                  onChange={s => setStatus(tplItemId, itemRunId, s)}
                                />
                                {it.doneAt && <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(it.doneAt).toLocaleString("pt-BR")}</div>}
                              </div>
                            </td>
                            <td style={{ padding: "13px 18px", verticalAlign: "middle", borderBottom: "1px solid #f1f5f9" }}>
                              <input
                                style={{ width: "100%", padding: "7px 9px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8, color: "#0f172a", background: "#fff", outline: "none", fontFamily: "inherit", transition: "border-color 0.12s" }}
                                value={obsValue} placeholder="Observação..."
                                onChange={e => { if (!itemRunId) return; const v = e.target.value; setDraftObs(prev => ({ ...prev, [itemRunId]: v })); }}
                                onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.10)"; }}
                                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; saveObservation(tplItemId, itemRunId); }}
                                disabled={savingItem === tplItemId}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                  {!s.items.length && <Empty message="Sem itens nesta seção." />}
                </div>
              ))}
              {!sections.length && <Card><Empty message="Nenhum template ativo para este tipo." /></Card>}
            </>
          )}
        </div>
      )}

      {/* ── Tab: Histórico ── */}
      {activeTab === "historico" && isAdmin && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {(["ENTRADA", "SAIDA"] as ChecklistType[]).map(t => (
              <button key={t} onClick={() => { setHistoricoType(t); loadHistoricoRuns(t); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", fontSize: 13, fontWeight: historicoType === t ? 700 : 500, borderRadius: 8, border: `1.5px solid ${historicoType === t ? "#2563eb" : "#e2e8f0"}`, background: historicoType === t ? "#2563eb" : "#fff", color: historicoType === t ? "#fff" : "#64748b", cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s" }}>
                <ClipboardCheck size={13} strokeWidth={2} />
                {t === "ENTRADA" ? "Entrada" : "Saída"}
              </button>
            ))}
          </div>
          <SectionCard title={`Runs — ${historicoType === "ENTRADA" ? "Entrada" : "Saída"} (${historicoRuns.length})`}>
            <Table>
              <Thead><tr><Th>Criado em</Th><Th>Âncora</Th><Th>Primeira ação</Th><Th></Th></tr></Thead>
              <tbody>
                {historicoRuns.map((r: any) => (
                  <Tr key={r.id}>
                    <Td style={{ fontSize: 13, color: "#6b7280" }}>{new Date(r.createdAt).toLocaleString("pt-BR")}</Td>
                    <Td style={{ fontSize: 13 }}>{r.anchorAt ? new Date(r.anchorAt).toLocaleString("pt-BR") : <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td style={{ fontSize: 13 }}>{r.firstDoneActionCode || r.firstDoneActionText ? `${r.firstDoneActionCode ? r.firstDoneActionCode + " – " : ""}${r.firstDoneActionText ?? ""}` : <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td align="right">
                      <IconBtn icon={<Maximize2 size={14} strokeWidth={2} />} title="Abrir run" onClick={() => onOpenRun(r.id)} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            {!historicoRuns.length && <Empty message="Nenhum run criado para este tipo." />}
          </SectionCard>
        </div>
      )}

      {/* ── Modal sócio ── */}
      <Modal open={socioModal} onClose={() => { setSocioModal(false); setEditSocio(null); }} title={editSocio ? "Editar sócio" : "Adicionar sócio"} width={560}
        footer={
          <>
            <button onClick={() => { setSocioModal(false); setEditSocio(null); }} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={saveSocio} disabled={!socioForm.nomeCompleto.trim() || savingSocio}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!socioForm.nomeCompleto.trim() || savingSocio) ? 0.45 : 1 }}>
              <Users size={14} strokeWidth={2} />
              {savingSocio ? "Salvando..." : (editSocio ? "Salvar" : "Adicionar")}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Nome completo *" placeholder="Nome completo do sócio" value={socioForm.nomeCompleto} onChange={e => setSocioForm(p => ({ ...p, nomeCompleto: e.target.value }))} />
          <FormGrid>
            <Input label="WhatsApp" placeholder="(00) 00000-0000" value={socioForm.whatsapp} onChange={e => setSocioForm(p => ({ ...p, whatsapp: e.target.value }))} />
            <Input label="Telefone empresa" placeholder="(00) 0000-0000" value={socioForm.telefoneEmpresa} onChange={e => setSocioForm(p => ({ ...p, telefoneEmpresa: e.target.value }))} />
          </FormGrid>
          <FormGrid>
            <Input label="E-mail" type="email" placeholder="email@exemplo.com" value={socioForm.email} onChange={e => setSocioForm(p => ({ ...p, email: e.target.value }))} />
            <Input label="Data de nascimento" type="date" value={socioForm.dataNascimento} onChange={e => setSocioForm(p => ({ ...p, dataNascimento: e.target.value }))} />
          </FormGrid>
          <Input label="Outros" placeholder="Informações adicionais..." value={socioForm.outros} onChange={e => setSocioForm(p => ({ ...p, outros: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
