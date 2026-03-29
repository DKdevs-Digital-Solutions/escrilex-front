import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Input, Select, Badge, Card, SectionCard, Table, Thead, Th, Tr, Td, Empty, Loading, Toggle, IconBtn } from "../ui";
import { Plus, Layers, Trash2, FilePlus, RefreshCw, Check } from "lucide-react";
import { useConfirm } from "../confirm";

type ChecklistType = "ENTRADA" | "SAIDA";
type DueRuleType = "OFFSET_DAYS" | "DAY_OF_NEXT_MONTH";

function PBtn({ children, onClick, disabled, title, variant = "primary", size = "sm" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; title?: string;
  variant?: "primary" | "secondary" | "danger"; size?: "sm" | "xs";
}) {
  const styles = {
    primary:   { bg: "#2563eb", color: "#fff",     border: "#2563eb",  hbg: "#1d4ed8" },
    secondary: { bg: "#fff",    color: "#374151",  border: "#e2e8f0",  hbg: "#f8fafc" },
    danger:    { bg: "#fff",    color: "#dc2626",  border: "#fca5a5",  hbg: "#fef2f2" },
  }[variant];
  const pad = size === "xs" ? "4px 8px" : "5px 11px";
  const fs  = size === "xs" ? 12 : 12.5;
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, padding: pad,
        fontSize: fs, fontWeight: 600, borderRadius: 7, border: `1.5px solid ${styles.border}`,
        background: styles.bg, color: styles.color, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit", transition: "background 0.12s", opacity: disabled ? 0.45 : 1,
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.background = styles.hbg; }}
      onMouseOut={e => { e.currentTarget.style.background = styles.bg; }}
    >
      {children}
    </button>
  );
}

export function Templates() {
  const { toast } = useToast();
  const confirm = useConfirm();
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selected, setSelected] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<ChecklistType>("ENTRADA");
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [addItemSection, setAddItemSection] = useState<string | null>(null);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCode, setNewItemCode] = useState("");
  const [newItemSectorId, setNewItemSectorId] = useState<string>("");
  const [newItemRequired, setNewItemRequired] = useState(false);
  const [newItemRuleType, setNewItemRuleType] = useState<DueRuleType>("OFFSET_DAYS");
  const [newItemRuleParam, setNewItemRuleParam] = useState<string>("");
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [t, s] = await Promise.all([api("/api/templates"), api("/api/lookup/sectors")]);
      setTemplates(t); setSectors(s);
    } finally { setLoading(false); }
  }

  async function loadSelected(id = selectedId) {
    if (!id) return;
    setLoadingDetail(true);
    try { setSelected(await api(`/api/templates/${id}`)); }
    finally { setLoadingDetail(false); }
  }

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (selectedId) loadSelected(selectedId); }, [selectedId]);

  async function createTemplate() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const t = await api("/api/templates", { method: "POST", body: JSON.stringify({ name: newName.trim(), type: newType }) });
      toast("Template criado", "success");
      setNewName(""); setCreateOpen(false);
      await loadAll(); setSelectedId(t.id);
    } catch (e: any) { toast(e.message || "Erro", "error"); }
    finally { setSaving(false); }
  }

  async function saveTemplateMeta(patch: any) {
    if (!selectedId) return;
    try {
      await api(`/api/templates/${selectedId}`, { method: "PUT", body: JSON.stringify(patch) });
      await loadAll(); await loadSelected(selectedId);
    } catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  async function addSection() {
    if (!selectedId || !newSectionName.trim()) return;
    setSaving(true);
    try {
      const order = (selected?.sections?.length || 0) + 1;
      await api(`/api/templates/${selectedId}/sections`, { method: "POST", body: JSON.stringify({ name: newSectionName.trim(), order }) });
      setNewSectionName(""); setAddSectionOpen(false);
      await loadSelected(selectedId);
      toast("Seção adicionada", "success");
    } catch (e: any) { toast(e.message || "Erro", "error"); }
    finally { setSaving(false); }
  }

  async function updateSection(sectionId: string, patch: any) {
    try { await api(`/api/templates/sections/${sectionId}`, { method: "PUT", body: JSON.stringify(patch) }); await loadSelected(selectedId); }
    catch (e: any) { toast(e.message || "Erro ao salvar seção", "error"); }
  }

  async function deleteSection(sectionId: string) {
    const ok = await confirm({ title: "Excluir seção", message: "Todos os itens desta seção serão excluídos permanentemente.", confirmLabel: "Excluir seção", variant: "danger" });
    if (!ok) return;
    try { await api(`/api/templates/sections/${sectionId}`, { method: "DELETE" }); await loadSelected(selectedId); toast("Seção excluída", "warning"); }
    catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  async function addItem(sectionId: string) {
    if (!selectedId || !newItemDesc.trim()) return;
    const dueRuleParam = newItemRuleParam.trim() ? Number(newItemRuleParam.trim()) : null;
    if (newItemRuleParam.trim() && Number.isNaN(dueRuleParam)) return toast("Parâmetro inválido", "error");
    const order = ((selected?.sections.find((s: any) => s.id === sectionId)?.items?.length) || 0) + 1;
    setSaving(true);
    try {
      await api(`/api/templates/${selectedId}/items`, { method: "POST", body: JSON.stringify({
        sectionId, code: newItemCode.trim() || null, description: newItemDesc.trim(),
        order, sectorId: newItemSectorId || null, isRequired: newItemRequired,
        dueRuleType: newItemRuleType, dueRuleParam,
      }) });
      setNewItemCode(""); setNewItemDesc(""); setNewItemSectorId(""); setNewItemRequired(false);
      setNewItemRuleType("OFFSET_DAYS"); setNewItemRuleParam(""); setAddItemSection(null);
      await loadSelected(selectedId);
      toast("Item adicionado", "success");
    } catch (e: any) { toast(e.message || "Erro", "error"); }
    finally { setSaving(false); }
  }

  async function updateItem(itemId: string, patch: any) {
    try { await api(`/api/templates/items/${itemId}`, { method: "PUT", body: JSON.stringify(patch) }); await loadSelected(selectedId); }
    catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  async function deleteItem(itemId: string) {
    const ok = await confirm({ title: "Excluir item", message: "Este item será excluído permanentemente do template.", confirmLabel: "Excluir", variant: "danger" });
    if (!ok) return;
    try { await api(`/api/templates/items/${itemId}`, { method: "DELETE" }); await loadSelected(selectedId); toast("Item excluído", "warning"); }
    catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  const inlineInput: React.CSSProperties = {
    padding: "5px 8px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 7,
    outline: "none", fontFamily: "inherit", color: "#111827", background: "#f8fafc",
    transition: "border-color 0.12s",
  };

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 248, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>Templates</h1>
          <PBtn onClick={() => setCreateOpen(true)} title="Novo template">
            <Plus size={13} strokeWidth={2.5} />
            Novo
          </PBtn>
        </div>

        {loading ? (
          <Loading message="Carregando templates..." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {templates.map(t => {
              const active = t.id === selectedId;
              return (
                <button key={t.id} onClick={() => setSelectedId(t.id)}
                  style={{
                    width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 8,
                    border: "1.5px solid", borderColor: active ? "#2563eb" : "#e2e8f0",
                    background: active ? "#dbeafe" : "#fff",
                    cursor: "pointer", transition: "all 0.12s", fontFamily: "inherit",
                  }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.borderColor = "#cbd5e1"; }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: active ? "#1d4ed8" : "#111827", marginBottom: 5 }}>
                    {t.name}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <Badge label={t.type} variant={t.type === "ENTRADA" ? "green" : "blue"} />
                    <Badge label={`v${t.version}`} variant="gray" />
                    {!t.active && <Badge label="Inativo" variant="gray" />}
                  </div>
                </button>
              );
            })}
            {!templates.length && (
              <div style={{ textAlign: "center", padding: "28px 16px", color: "#9ca3af", fontSize: 13 }}>
                Nenhum template ainda.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Editor ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {!selectedId && <Card><Empty message="Selecione um template para editar." /></Card>}
        {selectedId && loadingDetail && <Loading message="Carregando template..." />}

        {selected && !loadingDetail && (
          <div>
            {/* Header do template */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: "0 0 5px", fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
                  {selected.name}
                </h2>
                <div style={{ display: "flex", gap: 5 }}>
                  <Badge label={selected.type} variant={selected.type === "ENTRADA" ? "green" : "blue"} />
                  <Badge label={`v${selected.version}`} variant="gray" />
                  <Badge label={selected.active ? "Ativo" : "Inativo"} variant={selected.active ? "green" : "gray"} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Toggle
                  checked={!!selected.active}
                  onChange={v => saveTemplateMeta({ active: v })}
                  label="Ativo"
                />
                <PBtn variant="secondary" onClick={() => saveTemplateMeta({ version: (selected.version || 1) + 1 })} title="Incrementar versão">
                  <RefreshCw size={12} strokeWidth={2.5} />
                  Nova versão
                </PBtn>
                <PBtn onClick={() => { setNewSectionName(""); setAddSectionOpen(true); }} title="Adicionar seção">
                  <Layers size={12} strokeWidth={2.5} />
                  Seção
                </PBtn>
              </div>
            </div>

            {/* Dica */}
            <div style={{
              background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8,
              padding: "9px 13px", marginBottom: 20, fontSize: 12.5, color: "#92400e",
            }}>
              <strong>Regras de prazo:</strong> D+N = N dias após a âncora. Dia X = dia X do mês seguinte.
            </div>

            {selected.sections.map((s: any) => (
              <SectionCard
                key={s.id}
                title={s.name}
                action={
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      type="number" value={s.order} title="Ordem" style={{ ...inlineInput, width: 52, textAlign: "center" }}
                      onChange={e => {
                        const next = { ...selected, sections: selected.sections.map((x: any) => x.id === s.id ? { ...x, order: Number(e.target.value) } : x) };
                        setSelected(next);
                      }}
                      onBlur={e => updateSection(s.id, { order: Number(e.target.value) })}
                    />
                    <PBtn onClick={() => {
                      setNewItemCode(""); setNewItemDesc(""); setNewItemSectorId(""); setNewItemRequired(false);
                      setNewItemRuleType("OFFSET_DAYS"); setNewItemRuleParam("");
                      setAddItemSection(s.id);
                    }} title="Adicionar item">
                      <FilePlus size={12} strokeWidth={2.5} />
                      Item
                    </PBtn>
                    <IconBtn icon={<Trash2 size={13} strokeWidth={2} />} title="Excluir seção" onClick={() => deleteSection(s.id)} variant="danger" />
                  </div>
                }
              >
                <div style={{ overflowX: "auto" }}>
                  <Table>
                    <Thead>
                      <tr>
                        <Th style={{ width: 90 }}>Código</Th>
                        <Th>Descrição</Th>
                        <Th style={{ width: 140 }}>Setor</Th>
                        <Th style={{ width: 70 }}>Obrig.</Th>
                        <Th style={{ width: 140 }}>Tipo prazo</Th>
                        <Th style={{ width: 80 }}>Param.</Th>
                        <Th style={{ width: 40 }}></Th>
                      </tr>
                    </Thead>
                    <tbody>
                      {s.items.map((it: any) => (
                        <Tr key={it.id}>
                          <Td>
                            <input defaultValue={it.code || ""}
                              style={{ ...inlineInput, width: 74 }}
                              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; }}
                              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; updateItem(it.id, { code: e.target.value.trim() || null }); }}
                            />
                          </Td>
                          <Td>
                            <input defaultValue={it.description}
                              style={{ ...inlineInput, width: 300, maxWidth: "100%" }}
                              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; }}
                              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; updateItem(it.id, { description: e.target.value }); }}
                            />
                          </Td>
                          <Td>
                            <select defaultValue={it.sectorId || ""} onChange={e => updateItem(it.id, { sectorId: e.target.value || null })}
                              style={{ ...inlineInput, cursor: "pointer" }}>
                              <option value="">(nenhum)</option>
                              {sectors.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
                            </select>
                          </Td>
                          <Td>
                            <Toggle
                              checked={!!it.isRequired}
                              onChange={v => updateItem(it.id, { isRequired: v })}
                            />
                          </Td>
                          <Td>
                            <select defaultValue={it.dueRuleType || "OFFSET_DAYS"} onChange={e => updateItem(it.id, { dueRuleType: e.target.value })}
                              style={{ ...inlineInput, cursor: "pointer" }}>
                              <option value="OFFSET_DAYS">D+N</option>
                              <option value="DAY_OF_NEXT_MONTH">Dia X do mês</option>
                            </select>
                          </Td>
                          <Td>
                            <input type="number" defaultValue={it.dueRuleParam ?? ""}
                              style={{ ...inlineInput, width: 64 }}
                              onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; }}
                              onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; const v = e.target.value.trim(); updateItem(it.id, { dueRuleParam: v ? Number(v) : null }); }}
                            />
                          </Td>
                          <Td align="right">
                            <IconBtn icon={<Trash2 size={13} strokeWidth={2} />} title="Excluir item" onClick={() => deleteItem(it.id)} variant="danger" />
                          </Td>
                        </Tr>
                      ))}
                      {!s.items.length && (
                        <tr><td colSpan={7} style={{ padding: "16px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                          Sem itens. Clique em <strong>Item</strong> para adicionar.
                        </td></tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </SectionCard>
            ))}

            {!selected.sections.length && <Card><Empty message="Sem seções. Clique em 'Seção' para adicionar." /></Card>}
          </div>
        )}
      </div>

      {/* ── Modais ── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo template"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={createTemplate} disabled={!newName.trim() || saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!newName.trim() || saving) ? 0.45 : 1 }}>
              <Check size={14} strokeWidth={2.5} />
              {saving ? "Criando..." : "Criar"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Nome *" placeholder="Ex: Checklist Entrada Padrão" value={newName} onChange={e => setNewName(e.target.value)} />
          <Select label="Tipo" value={newType} onChange={e => setNewType(e.target.value as ChecklistType)}>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </Select>
        </div>
      </Modal>

      <Modal open={addSectionOpen} onClose={() => setAddSectionOpen(false)} title="Adicionar seção"
        footer={
          <>
            <button onClick={() => setAddSectionOpen(false)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={addSection} disabled={!newSectionName.trim() || saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!newSectionName.trim() || saving) ? 0.45 : 1 }}>
              <Layers size={14} strokeWidth={2.5} />
              {saving ? "Adicionando..." : "Adicionar"}
            </button>
          </>
        }
      >
        <Input label="Nome da seção *" placeholder="Ex: Documentação, Equipamentos..." value={newSectionName} onChange={e => setNewSectionName(e.target.value)} />
      </Modal>

      <Modal open={!!addItemSection} onClose={() => setAddItemSection(null)} title="Adicionar item" width={560}
        footer={
          <>
            <button onClick={() => setAddItemSection(null)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={() => addItemSection && addItem(addItemSection)} disabled={!newItemDesc.trim() || saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!newItemDesc.trim() || saving) ? 0.45 : 1 }}>
              <FilePlus size={14} strokeWidth={2.5} />
              {saving ? "Adicionando..." : "Adicionar item"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 100 }}>
              <Input label="Código" placeholder="Ex: A1" value={newItemCode} onChange={e => setNewItemCode(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <Input label="Descrição *" placeholder="Descrição do item" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} />
            </div>
          </div>
          <Select label="Setor" value={newItemSectorId} onChange={e => setNewItemSectorId(e.target.value)}>
            <option value="">(nenhum)</option>
            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Select label="Tipo de prazo" value={newItemRuleType} onChange={e => setNewItemRuleType(e.target.value as DueRuleType)}>
                <option value="OFFSET_DAYS">D+N (dias após âncora)</option>
                <option value="DAY_OF_NEXT_MONTH">Dia X do mês seguinte</option>
              </Select>
            </div>
            <div style={{ width: 110 }}>
              <Input label={newItemRuleType === "OFFSET_DAYS" ? "Dias" : "Dia do mês"} type="number"
                placeholder={newItemRuleType === "OFFSET_DAYS" ? "ex: 30" : "ex: 10"}
                value={newItemRuleParam} onChange={e => setNewItemRuleParam(e.target.value)} />
            </div>
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
            <Toggle checked={newItemRequired} onChange={setNewItemRequired} label="Item obrigatório (define a âncora de prazo)" />
          </label>
        </div>
      </Modal>
    </div>
  );
}
