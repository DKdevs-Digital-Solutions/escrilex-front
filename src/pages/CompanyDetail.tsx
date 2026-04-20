import React, { useEffect, useMemo, useState } from "react";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import {
  Badge,
  Card,
  SectionCard,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Empty,
  Loading,
  Tabs,
  Input,
  FormGrid,
  IconBtn,
} from "../ui";
import {
  Maximize2,
  Save,
  ClipboardCheck,
  Users,
  ChevronDown,
  Clock,
  CheckCircle2,
  Hash,
  MinusCircle,
  Sparkles,
  Building2,
  ShieldCheck,
  History,
} from "lucide-react";
import { useConfirm } from "../confirm";
import { useCompanyDetail } from "../hooks/useCompanyDetail";
import { useChecklist } from "../hooks/useChecklist";
import { useTemplate } from "../hooks/useTemplate";
import { CompanyDetailHeader } from "../components/CompanyDetailHeader";
import { CompanyDataTab } from "../components/CompanyDataTab";
import { CompanyPartnersTab } from "../components/CompanyPartnersTab";
import { CompanyResponsiblesTab } from "../components/CompanyResponsiblesTab";
import { CompanyChecklistTab } from "../components/CompanyChecklistTab";
import { CompanyHistoryTab } from "../components/CompanyHistoryTab";

type ItemStatusFull = "PENDENTE" | "CONCLUIDO" | "EM_ANDAMENTO" | "NA";
type ChecklistType = "ENTRADA" | "SAIDA";
type ItemStatus = "EM_ANDAMENTO" | "PENDENTE" | "CONCLUIDO" | "NA";
type TabId = "dados" | "socios" | "responsaveis" | "checklist" | "historico";

const UI = {
  bg: "#f8fafc",
  surface: "#ffffff",
  surfaceSoft: "#fcfdff",
  border: "#e2e8f0",
  borderSoft: "#eef2f7",
  text: "#0f172a",
  textSoft: "#475569",
  textMuted: "#94a3b8",
  primary: "#2563eb",
  primarySoft: "#eff6ff",
  shadowSm: "0 1px 2px rgba(15, 23, 42, 0.04)",
  shadowMd: "0 10px 30px rgba(15, 23, 42, 0.06)",
  radius: 16,
  radiusSm: 10,
};

const STATUS_CFG: Record<
  ItemStatusFull,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  PENDENTE: {
    label: "Pendente",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    icon: <Clock size={12} strokeWidth={2} />,
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: <Hash size={12} strokeWidth={2.5} />,
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: <CheckCircle2 size={12} strokeWidth={2} />,
  },
  NA: {
    label: "Não se aplica",
    color: "#94a3b8",
    bg: "#f1f5f9",
    border: "#e2e8f0",
    icon: <MinusCircle size={12} strokeWidth={2} />,
  },
};

function fmtDate(v?: string | null) {
  if (!v) return null;
  try {
    return new Date(v).toLocaleDateString("pt-BR");
  } catch {
    return v;
  }
}

function isOverdue(dueDate?: string | null, status?: ItemStatus) {
  if (!dueDate || status !== "PENDENTE") return false;
  return new Date(dueDate).getTime() < Date.now();
}

function softButtonStyle(active = false): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: active ? 700 : 600,
    borderRadius: 10,
    border: `1px solid ${active ? UI.primary : UI.border}`,
    background: active ? UI.primary : UI.surface,
    color: active ? "#fff" : UI.textSoft,
    cursor: "pointer",
    transition: "all 0.18s ease",
    fontFamily: "inherit",
    boxShadow: active ? "0 8px 20px rgba(37,99,235,0.18)" : "none",
  };
}

function ghostButtonStyle(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 5,
    border: `1px solid ${UI.border}`,
    background: UI.surface,
    color: UI.textSoft,
    cursor: "pointer",
    transition: "all 0.18s ease",
    fontFamily: "inherit",
  };
}

function primaryButtonStyle(disabled?: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "15px 20px",
    fontSize: 13,
    fontWeight: 700,
    borderRadius: 10,
    border: "none",
    background: UI.primary,
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.18s ease",
    fontFamily: "inherit",
    opacity: disabled ? 0.5 : 1,
    boxShadow: "0 10px 24px rgba(37,99,235,0.20)",
  };
}

function cardShellStyle(): React.CSSProperties {
  return {
    background: UI.surface,
    border: `1px solid ${UI.border}`,
    borderRadius: UI.radius,
    boxShadow: UI.shadowMd,
  };
}

function SummaryCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div
      style={{
        ...cardShellStyle(),
        padding: 16,
        minHeight: 100,
        display: "flex",
        alignItems: "flex-start",
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
          background: UI.primarySoft,
          color: UI.primary,
          border: "1px solid #dbeafe",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: UI.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: UI.text, lineHeight: 1.1 }}>
          {value}
        </div>
        {hint && (
          <div style={{ fontSize: 12.5, color: UI.textMuted, marginTop: 6 }}>{hint}</div>
        )}
      </div>
    </div>
  );
}

function TopPanel({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        ...cardShellStyle(),
        padding: 18,
        marginBottom: 18,
        background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #dbeafe",
              background: "#f8fbff",
              color: UI.primary,
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            <Sparkles size={13} />
            Visão geral
          </div>

          <div style={{ fontSize: 21, fontWeight: 800, color: UI.text }}>{title}</div>
          {subtitle && (
            <div style={{ marginTop: 6, color: UI.textSoft, fontSize: 13.5 }}>{subtitle}</div>
          )}
        </div>

        {right}
      </div>
    </div>
  );
}

function StatusPicker({
  value,
  onChange,
  disabled,
}: {
  value: ItemStatusFull;
  onChange: (s: ItemStatusFull) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const cfg = STATUS_CFG[value] ?? STATUS_CFG.PENDENTE;

  React.useEffect(() => {
    if (!open) return;

    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 11px 7px 9px",
          borderRadius: 999,
          border: `1px solid ${cfg.border}`,
          background: cfg.bg,
          color: cfg.color,
          fontSize: 12.5,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.12s",
          opacity: disabled ? 0.55 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {cfg.icon}
        {cfg.label}
        <ChevronDown size={11} strokeWidth={2.5} style={{ marginLeft: 2, opacity: 0.7 }} />
      </button>

      {open &&
        (() => {
          const el = ref.current?.getBoundingClientRect();

          const menuWidth = 190;
          const estimatedMenuHeight = 220;
          const margin = 8;

          const left = el
            ? Math.min(
                Math.max(el.left, margin),
                window.innerWidth - menuWidth - margin
              )
            : margin;

          const shouldOpenUp =
            !!el && el.bottom + estimatedMenuHeight > window.innerHeight - margin;

          const top = el
            ? shouldOpenUp
              ? Math.max(margin, el.top - estimatedMenuHeight - 6)
              : el.bottom + 6
            : margin;

          return (
            <div
              style={{
                position: "fixed",
                top,
                left,
                zIndex: 9999,
                background: "#fff",
                borderRadius: 14,
                border: `1px solid ${UI.border}`,
                boxShadow: "0 20px 40px rgba(15,23,42,0.14)",
                minWidth: menuWidth,
                overflow: "hidden",
              }}
            >
              {(Object.entries(STATUS_CFG) as [
                ItemStatusFull,
                typeof STATUS_CFG[ItemStatusFull]
              ][]).map(([k, c]) => (
                <button
                  key={k}
                  onClick={() => {
                    onChange(k);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 13px",
                    border: "none",
                    background: k === value ? "#f8fafc" : "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: k === value ? 700 : 500,
                    color: c.color,
                    textAlign: "left",
                    transition: "background 0.1s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = k === value ? "#f8fafc" : "#fff";
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: c.bg,
                      border: `1px solid ${c.border}`,
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </span>

                  {c.label}

                  {k === value && (
                    <span style={{ marginLeft: "auto", fontSize: 11, color: UI.textMuted }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          );
        })()}
    </div>
  );
}

export function CompanyDetail({
  companyId,
  isAdmin,
  userRoles,
  onBack,
  onOpenRun,
}: {
  companyId: string;
  isAdmin: boolean;
  userRoles?: string[];
  onBack: () => void;
  onOpenRun: (runId: string) => void;
}) {
  const { toast } = useToast();
  const confirm = useConfirm();

  const [checklistType, setChecklistType] = useState<ChecklistType>("ENTRADA");
  const [historicoType, setHistoricoType] = useState<ChecklistType>("ENTRADA");
  const [historicoRuns, setHistoricoRuns] = useState<any[]>([]);
  const [savingItem, setSavingItem] = useState<string>("");
  const [draftObs, setDraftObs] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabId>("dados");
  const [savingResp, setSavingResp] = useState(false);

  const canEdit = isAdmin || (userRoles || []).includes("GESTOR_EMPRESA");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  const [socioModal, setSocioModal] = useState(false);
  const [editSocio, setEditSocio] = useState<any>(null);
  const [socioForm, setSocioForm] = useState({
    nomeCompleto: "",
    whatsapp: "",
    email: "",
    telefoneEmpresa: "",
    dataNascimento: "",
    outros: "",
  });
  const [savingSocio, setSavingSocio] = useState(false);

  const {
    company,
    sectors,
    users,
    socios,
    loading: loadingDetails,
    updateCompany,
    savePartner,
    deletePartner,
    saveResponsibles,
    setResponsibleLocal,
    extractObs,
  } = useCompanyDetail(companyId);

  const {
    createItem,
    updateItem,
    getRun,
    loadRuns,
    run,
    startRun,
    loading: loadingChecklist,
    setLoadingChecklist,
  } = useChecklist(companyId);

  const { defaultTemplate, loadDefaultTemplate } = useTemplate();

  async function loadHistoricoRuns(nextType: ChecklistType) {
    const r = await loadRuns(nextType);
    setHistoricoRuns(r);
    return r;
  }

  async function refreshForType(nextType: ChecklistType) {
    setLoadingChecklist(true);

    try {
      const [rlist, defT] = await Promise.all([
        loadRuns(nextType),
        loadDefaultTemplate(nextType),
      ]);

      const latest = rlist?.[0];
      if (!latest?.id) return;

      const r = await getRun(latest.id);

      if (r?.template?.sections?.length) {
        setDraftObs(extractObs(r.template.sections));
        return;
      }

      if (defT?.sections?.length) {
        const itemRunMap: Record<string, any> = {};

        r.itemRuns?.forEach((ir: any) => {
          itemRunMap[ir.templateItemId] = ir;
        });

        const mergedSections = defT.sections.map((s: any) => ({
          ...s,
          items: s.items.map((it: any) => {
            const ir = itemRunMap[it.id];
            return ir
              ? {
                  ...it,
                  templateItemId: it.id,
                  itemRunId: ir.id,
                  status: ir.status,
                  observation: ir.observation,
                }
              : { ...it, templateItemId: it.id };
          }),
        }));

        r.template = { ...defT, sections: mergedSections };
        setDraftObs(extractObs(mergedSections));
      }
    } finally {
      setLoadingChecklist(false);
    }
  }

  useEffect(() => {
    if (activeTab === "checklist") refreshForType(checklistType);
  }, [checklistType, companyId]);

  useEffect(() => {
    if (activeTab === "checklist") refreshForType(checklistType);
    else if (activeTab === "historico") loadHistoricoRuns(historicoType);
  }, [activeTab]);

  const responsibleMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of company?.responsibles || []) m.set(r.sectorId, r.userId);
    return m;
  }, [company]);

  function setResponsible(sectorId: string, userId: string) {
    setResponsibleLocal(sectorId, userId);
  }

  async function ensureRunExists() {
    if (run?.id) {
      const fresh = await getRun(run.id);
      const map: Record<string, string> = {};

      for (const s of fresh?.template?.sections ?? []) {
        for (const it of s.items) {
          if (it.itemRunId) {
            map[it.templateItemId ?? it.id] = it.itemRunId;
          }
        }
      }

      return { runId: run.id, itemRunMap: map };
    }

    const r = await startRun({
      companyId,
      type: checklistType,
    });

    await loadRuns(checklistType);
    await getRun(r.runId);

    return { runId: r.runId, itemRunMap: r.itemRunMap || {} };
  }

  async function setStatus(
    templateItemId: string,
    itemRunId: string | undefined,
    status: ItemStatusFull
  ) {
    setSavingItem(templateItemId);

    try {
      let id = itemRunId;
      let currentRunId = run?.id;

      if (!id) {
        const ensured = await ensureRunExists();
        currentRunId = ensured?.runId;
        id = ensured?.itemRunMap?.[templateItemId];
      }

      if (!id) {
        const created = await createItem({
          runId: currentRunId,
          templateItemId,
          status,
        });

        id = created?.id;
      }

      if (!id) return;

      await updateItem(id, { status });
      await refreshForType(checklistType);
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    } finally {
      setSavingItem("");
    }
  }

  async function saveObservation(templateItemId: string, itemRunId?: string) {
    if (!itemRunId) {
      toast("Defina o status antes de adicionar observação.", "warning");
      return;
    }

    setSavingItem(templateItemId);

    try {
      await updateItem(itemRunId, {
        observation: draftObs[itemRunId] ?? "",
      });
      await refreshForType(checklistType);
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    } finally {
      setSavingItem("");
    }
  }

  function startEdit() {
    setEditForm({
      razaoSocial: company.razaoSocial || "",
      nomeFantasia: company.nomeFantasia || "",
      cod: company.cod || "",
      filial: company.filial || "",
      grupo: company.grupo || "",
      tributacao: company.tributacao || "",
      ieAtual: company.ieAtual || "",
      dataTributacao: company.dataTributacao?.slice(0, 10) || "",
      motivoEntrada: company.motivoEntrada || "",
      situacao: company.situacao || "",
      dataSituacao: company.dataSituacao?.slice(0, 10) || "",
      ramo: company.ramo || "",
      consultoria: company.consultoria || "",
      banco: company.banco || "",
      perfil: company.perfil || "",
      licitacao: company.licitacao || "",
      qtdeFolha: company.qtdeFolha ?? "",
      responsavelComercial: company.responsavelComercial || "",
      dataEntrada: company.dataEntrada?.slice(0, 10) || "",
      dataInicioCobranca: company.dataInicioCobranca?.slice(0, 10) || "",
      dataFimCobranca: company.dataFimCobranca?.slice(0, 10) || "",
    });
    setEditing(true);
  }

  async function saveEdit() {
    setSavingEdit(true);
    try {
      await updateCompany({
        ...editForm,
        qtdeFolha: editForm.qtdeFolha ? Number(editForm.qtdeFolha) : undefined,
      });

      toast("Dados salvos", "success");
      setEditing(false);
    } catch (e: any) {
      toast(e.message || "Erro ao salvar", "error");
    } finally {
      setSavingEdit(false);
    }
  }

  function ef(field: string) {
    return (v: string) => setEditForm((p: any) => ({ ...p, [field]: v }));
  }

  async function handleSaveSocio() {
    setSavingSocio(true);

    const payload = {
      nomeCompleto: socioForm.nomeCompleto.trim(),
      whatsapp: socioForm.whatsapp.trim() || null,
      email: socioForm.email.trim() || null,
      telefoneEmpresa: socioForm.telefoneEmpresa.trim() || null,
      dataNascimento: socioForm.dataNascimento || null,
      outros: socioForm.outros.trim() || null,
    };

    try {
      await savePartner(payload, editSocio?.id);

      toast(editSocio ? "Sócio atualizado" : "Sócio adicionado", "success");

      setSocioModal(false);
      setEditSocio(null);
      setSocioForm({
        nomeCompleto: "",
        whatsapp: "",
        email: "",
        telefoneEmpresa: "",
        dataNascimento: "",
        outros: "",
      });
    } catch (e: any) {
      toast(e.message || "Erro ao salvar sócio", "error");
    } finally {
      setSavingSocio(false);
    }
  }

  async function handleDeleteSocio(id: string) {
    const ok = await confirm({
      title: "Remover sócio",
      message: "Esta ação não pode ser desfeita.",
      confirmLabel: "Remover",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await deletePartner(id);
      toast("Sócio removido", "warning");
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    }
  }

  async function handleSaveResponsibles() {
    setSavingResp(true);

    try {
      await saveResponsibles(
        sectors
          .map((s) => ({
            sectorId: s.id,
            userId: responsibleMap.get(s.id),
          }))
          .filter((x) => x.userId)
      );

      toast("Responsáveis salvos com sucesso", "success");
    } catch (e: any) {
      toast(e.message || "Erro ao salvar responsáveis", "error");
    } finally {
      setSavingResp(false);
    }
  }

  if (loadingDetails) return <Loading message="Carregando empresa..." />;
  if (!company) return <Loading message="Carregando..." />;

  const rawSections = run?.template?.sections ?? [];
  const sections = (() => {
    if (rawSections.length > 0) return rawSections;
    if (!defaultTemplate?.sections) return [];
    return defaultTemplate.sections;
  })();

  const totalItems = sections.reduce((a: number, s: any) => a + s.items.length, 0);
  const doneItems = sections.reduce(
    (a: number, s: any) =>
      a + s.items.filter((it: any) => it.status === "CONCLUIDO" || it.status === "NA").length,
    0
  );
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const TABS: { id: TabId; label: string; count?: number }[] = [
    { id: "dados", label: "Dados" },
    { id: "socios", label: "Sócios", count: socios.length },
    { id: "responsaveis", label: "Responsáveis", count: sectors.length },
    { id: "checklist", label: "Checklist" },
    ...(isAdmin
      ? [{ id: "historico" as TabId, label: "Histórico", count: historicoRuns.length }]
      : []),
  ];

  return (
    <div
      style={{
        background: 'transparent',
        minHeight: "100%",
        padding: 0,
      }}
    >
      <CompanyDetailHeader company={company} onBack={onBack} />

      <div style={{ marginTop: 16 }}>
        <TopPanel
          title={company.nomeFantasia || company.razaoSocial || "Empresa"}
          subtitle="Uma visão mais clara, elegante e organizada dos dados, responsáveis e checklists."
          right={
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1px solid ${UI.border}`,
                  background: UI.surface,
                  color: UI.textSoft,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Building2 size={15} />
                {company.cod || "Sem código"}
              </div>

              {company.situacao && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid #dcfce7",
                    background: "#f0fdf4",
                    color: "#166534",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck size={15} />
                  {company.situacao}
                </div>
              )}
            </div>
          }
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 14,
            marginBottom: 18,
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <SummaryCard
              icon={<Building2 size={18} />}
              label="Empresa"
              value={company.nomeFantasia || company.razaoSocial || "—"}
              hint={company.grupo || "Sem grupo informado"}
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <SummaryCard
              icon={<Users size={18} />}
              label="Sócios"
              value={socios.length}
              hint="Cadastros vinculados"
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <SummaryCard
              icon={<ClipboardCheck size={18} />}
              label="Checklist"
              value={`${pct}%`}
              hint={`${doneItems}/${totalItems} itens concluídos`}
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <SummaryCard
              icon={<History size={18} />}
              label="Responsáveis"
              value={sectors.length}
              hint="Setores configuráveis"
            />
          </div>
        </div>

        <div
          style={{
            ...cardShellStyle(),
            padding: 5,
            marginBottom: 18,
            width: "100%",
          }}
        >
          <Tabs active={activeTab} onChange={setActiveTab} tabs={TABS} />
        </div>

        {activeTab === "dados" && (
          <div style={{ ...cardShellStyle(), padding: 0 }}>
            <CompanyDataTab
              company={company}
              canEdit={canEdit}
              editing={editing}
              editForm={editForm}
              setEditing={setEditing}
              savingEdit={savingEdit}
              onStartEdit={startEdit}
              onSaveEdit={saveEdit}
              ef={ef}
              fmtDate={fmtDate}
            />
          </div>
        )}

        {activeTab === "socios" && (
          <div style={{ ...cardShellStyle(), padding: 14 }}>
            <CompanyPartnersTab
              socios={socios}
              onAdd={() => {
                setEditSocio(null);
                setSocioForm({
                  nomeCompleto: "",
                  whatsapp: "",
                  email: "",
                  telefoneEmpresa: "",
                  dataNascimento: "",
                  outros: "",
                });
                setSocioModal(true);
              }}
              onEdit={(s) => {
                setEditSocio(s);
                setSocioForm({
                  nomeCompleto: s.nomeCompleto || "",
                  whatsapp: s.whatsapp || "",
                  email: s.email || "",
                  telefoneEmpresa: s.telefoneEmpresa || "",
                  dataNascimento: s.dataNascimento
                    ? new Date(s.dataNascimento).toISOString().slice(0, 10)
                    : "",
                  outros: s.outros || "",
                });
                setSocioModal(true);
              }}
              onDelete={handleDeleteSocio}
            />
          </div>
        )}

        {activeTab === "responsaveis" && (
        <CompanyResponsiblesTab
          sectors={sectors}
          users={users}
          responsibleMap={responsibleMap}
          savingResp={savingResp}
          onSave={handleSaveResponsibles}
          onChangeResponsible={setResponsible}
          primaryButtonStyle={primaryButtonStyle}
          UI={UI}
        />
      )}

        {activeTab === "checklist" && (
        <CompanyChecklistTab
          checklistType={checklistType}
          setChecklistType={setChecklistType}
          loadingChecklist={loadingChecklist}
          run={run}
          onOpenRun={onOpenRun}
          doneItems={doneItems}
          totalItems={totalItems}
          pct={pct}
          sections={sections}
          savingItem={savingItem}
          draftObs={draftObs}
          setDraftObs={setDraftObs}
          setStatus={setStatus}
          saveObservation={saveObservation}
          fmtDate={fmtDate}
          isOverdue={isOverdue}
          StatusPicker={StatusPicker}
          softButtonStyle={softButtonStyle}
          ghostButtonStyle={ghostButtonStyle}
          cardShellStyle={cardShellStyle}
          UI={UI}
        />
      )}


        {activeTab === "historico" && isAdmin && (
        <CompanyHistoryTab
          historicoType={historicoType}
          setHistoricoType={setHistoricoType}
          loadHistoricoRuns={loadHistoricoRuns}
          historicoRuns={historicoRuns}
          onOpenRun={onOpenRun}
          softButtonStyle={softButtonStyle}
          cardShellStyle={cardShellStyle}
          UI={UI}
        />
      )}
      </div>

      <Modal
        open={socioModal}
        onClose={() => {
          setSocioModal(false);
          setEditSocio(null);
        }}
        title={editSocio ? "Editar sócio" : "Adicionar sócio"}
        width={560}
        footer={
          <>
            <button
              onClick={() => {
                setSocioModal(false);
                setEditSocio(null);
              }}
              style={ghostButtonStyle()}
            >
              Cancelar
            </button>

            <button
              onClick={handleSaveSocio}
              disabled={!socioForm.nomeCompleto.trim() || savingSocio}
              style={primaryButtonStyle(!socioForm.nomeCompleto.trim() || savingSocio)}
            >
              <Users size={14} strokeWidth={2} />
              {savingSocio ? "Salvando..." : editSocio ? "Salvar" : "Adicionar"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input
            label="Nome completo *"
            placeholder="Nome completo do sócio"
            value={socioForm.nomeCompleto}
            onChange={(e) =>
              setSocioForm((p) => ({ ...p, nomeCompleto: e.target.value }))
            }
          />

          <FormGrid>
            <Input
              label="WhatsApp"
              placeholder="(00) 00000-0000"
              value={socioForm.whatsapp}
              onChange={(e) =>
                setSocioForm((p) => ({ ...p, whatsapp: e.target.value }))
              }
            />
            <Input
              label="Telefone empresa"
              placeholder="(00) 0000-0000"
              value={socioForm.telefoneEmpresa}
              onChange={(e) =>
                setSocioForm((p) => ({ ...p, telefoneEmpresa: e.target.value }))
              }
            />
          </FormGrid>

          <FormGrid>
            <Input
              label="E-mail"
              type="email"
              placeholder="email@exemplo.com"
              value={socioForm.email}
              onChange={(e) =>
                setSocioForm((p) => ({ ...p, email: e.target.value }))
              }
            />
            <Input
              label="Data de nascimento"
              type="date"
              value={socioForm.dataNascimento}
              onChange={(e) =>
                setSocioForm((p) => ({ ...p, dataNascimento: e.target.value }))
              }
            />
          </FormGrid>

          <Input
            label="Outros"
            placeholder="Informações adicionais..."
            value={socioForm.outros}
            onChange={(e) =>
              setSocioForm((p) => ({ ...p, outros: e.target.value }))
            }
          />
        </div>
      </Modal>
    </div>
  );
}
