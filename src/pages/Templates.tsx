import React, { useEffect, useState } from "react";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Input, Select, Empty, Loading, Toggle } from "../ui";
import { Layers, FilePlus, Check } from "lucide-react";
import { useConfirm } from "../confirm";
import { useTemplate } from "../hooks/useTemplate";
import { lookupRepository } from "../repository/lookup.repository";
import { TemplateSidebar } from "../components/TemplateSidebar";
import { TemplateEditorHeader } from "../components/TemplateEditorHeader";
import { TemplateSections } from "../components/TemplateSections";

type ChecklistType = "ENTRADA" | "SAIDA";
type DueRuleType = "OFFSET_DAYS" | "DAY_OF_NEXT_MONTH";

export function Templates() {
  const { toast } = useToast();
  const confirm = useConfirm();

  const [selectedId, setSelectedId] = useState<string>("");
  const [sectors, setSectors] = useState<any[]>([]);
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
  const [newItemRuleParam, setNewItemRuleParam] = useState("");
  const [saving, setSaving] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 999);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 999);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const {
    templates,
    selectedTemplate,
    loadTemplates,
    loadTemplateById,
    createTemplate: createTemplateHook,
    updateTemplate,
    addSection,
    removeSection,
    editItem,
    removeItem,
    loading,
    setLoading,
    addItem,
    editSection,
  } = useTemplate();

  async function loadAll() {
    setLoading(true);
    try {
      const [_, s] = await Promise.all([
        loadTemplates(),
        lookupRepository.getSectors(),
      ]);
      setSectors(s);
    } finally {
      setLoading(false);
    }
  }

  async function loadSelected(id = selectedId) {
    if (!id) return;
    setLoadingDetail(true);
    try {
      await loadTemplateById(id);
    } finally {
      setLoadingDetail(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (selectedId) loadSelected(selectedId);
  }, [selectedId]);

  async function createTemplate() {
    if (!newName.trim()) return;

    setSaving(true);
    try {
      const t = await createTemplateHook({
        name: newName.trim(),
        type: newType,
      });

      if (!t) return;

      toast("Template criado", "success");
      setNewName("");
      setCreateOpen(false);

      await loadAll();
      setSelectedId(t.id);
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    } finally {
      setSaving(false);
    }
  }

  async function saveTemplateMeta(patch: any) {
    if (!selectedId) return;

    try {
      await updateTemplate(selectedId, patch);
      await loadAll();
      await loadSelected(selectedId);
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    }
  }

  async function addSections() {
    if (!selectedId || !newSectionName.trim()) return;

    setSaving(true);
    try {
      const order = (selectedTemplate?.sections?.length || 0) + 1;
      await addSection(selectedId, { name: newSectionName.trim(), order });
      setNewSectionName("");
      setAddSectionOpen(false);
      await loadSelected(selectedId);
      toast("Seção adicionada", "success");
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    } finally {
      setSaving(false);
    }
  }

  async function updateSectionOrder(sectionId: string, value: number) {
    try {
      await editSection(selectedId, sectionId, { order: value });
    } catch (e: any) {
      toast(e.message || "Erro ao salvar seção", "error");
    }
  }

  async function deleteSection(sectionId: string) {
    const ok = await confirm({
      title: "Excluir seção",
      message: "Todos os itens desta seção serão excluídos permanentemente.",
      confirmLabel: "Excluir seção",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await removeSection(selectedId, sectionId);
      toast("Seção excluída", "warning");
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    }
  }

  async function addItems(sectionId: string) {
    if (!selectedId || !newItemDesc.trim()) return;

    const dueRuleParam = newItemRuleParam.trim()
      ? Number(newItemRuleParam.trim())
      : null;

    if (newItemRuleParam.trim() && Number.isNaN(dueRuleParam)) {
      return toast("Parâmetro inválido", "error");
    }

    const order =
      ((selectedTemplate?.sections?.find((s: any) => s.id === sectionId)?.items?.length) || 0) + 1;

    setSaving(true);
    try {
      await addItem(selectedId, {
        sectionId,
        code: newItemCode.trim() || null,
        description: newItemDesc.trim(),
        order,
        sectorId: newItemSectorId || null,
        isRequired: newItemRequired,
        dueRuleType: newItemRuleType,
        dueRuleParam,
      });

      setNewItemCode("");
      setNewItemDesc("");
      setNewItemSectorId("");
      setNewItemRequired(false);
      setNewItemRuleType("OFFSET_DAYS");
      setNewItemRuleParam("");
      setAddItemSection(null);

      await loadSelected(selectedId);
      toast("Item adicionado", "success");
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    } finally {
      setSaving(false);
    }
  }

  async function updateItem(itemId: string, patch: any) {
    if (!selectedId) return;
    try {
      await editItem(selectedId, itemId, patch);
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    }
  }

  async function deleteItem(itemId: string) {
    if (!selectedId) return;

    const ok = await confirm({
      title: "Excluir item",
      message: "Este item será excluído permanentemente do processo.",
      confirmLabel: "Excluir",
      variant: "danger",
    });

    if (!ok) return;

    try {
      await removeItem(selectedId, itemId);
      toast("Item excluído", "warning");
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    }
  }

  const inlineInput: React.CSSProperties = {
    padding: "7px 10px",
    fontSize: 13,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    outline: "none",
    fontFamily: "inherit",
    color: "#111827",
    background: "#f8fafc",
  };

  return (
    <div
        className="template-section"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 14 : 22,
          alignItems: "flex-start",
          width: "100%",
        }}
      >
      <TemplateSidebar
        templates={templates}
        loading={loading}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onCreate={() => setCreateOpen(true)}
      />

      <div
          style={{
            flex: 1,
            minWidth: 0,
            width: "100%",
          }}
        >
        {!selectedId && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
              padding: 24,
            }}
          >
            <Empty message="Selecione um processo para editar." />
          </div>
        )}

        {selectedId && loadingDetail && <Loading message="Carregando processo..." />}

        {selectedTemplate && !loadingDetail && (
          <>
            <TemplateEditorHeader
              template={selectedTemplate}
              onToggleActive={(v) => saveTemplateMeta({ active: v })}
              onNewVersion={() =>
                saveTemplateMeta({ version: (selectedTemplate.version || 1) + 1 })
              }
              onAddSection={() => {
                setNewSectionName("");
                setAddSectionOpen(true);
              }}
            />

            <TemplateSections
              sections={selectedTemplate.sections || []}
              sectors={sectors}
              inlineInput={inlineInput}
              onSectionOrderChange={updateSectionOrder}
              onAddItem={(sectionId) => {
                setNewItemCode("");
                setNewItemDesc("");
                setNewItemSectorId("");
                setNewItemRequired(false);
                setNewItemRuleType("OFFSET_DAYS");
                setNewItemRuleParam("");
                setAddItemSection(sectionId);
              }}
              onDeleteSection={deleteSection}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
            />
          </>
        )}
      </div>

      {/* modal novo template */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo Processo"
        footer={
          <>
            <button style={secondaryBtn} onClick={() => setCreateOpen(false)}>
              Cancelar
            </button>
            <button
              onClick={createTemplate}
              disabled={!newName.trim() || saving}
              style={{
                ...primaryBtn,
                opacity: !newName.trim() || saving ? 0.45 : 1,
              }}
            >
              <Check size={14} strokeWidth={2.5} />
              {saving ? "Criando..." : "Criar"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input
            label="Nome *"
            placeholder="Ex: Checklist Entrada Padrão"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Select
            label="Tipo"
            value={newType}
            onChange={(e) => setNewType(e.target.value as ChecklistType)}
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </Select>
        </div>
      </Modal>

      {/* modal seção */}
      <Modal
        open={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        title="Adicionar seção"
        footer={
          <>
            <button style={secondaryBtn} onClick={() => setAddSectionOpen(false)}>
              Cancelar
            </button>
            <button
              onClick={addSections}
              disabled={!newSectionName.trim() || saving}
              style={{
                ...primaryBtn,
                opacity: !newSectionName.trim() || saving ? 0.45 : 1,
              }}
            >
              <Layers size={14} strokeWidth={2.5} />
              {saving ? "Adicionando..." : "Adicionar"}
            </button>
          </>
        }
      >
        <Input
          label="Nome da seção *"
          placeholder="Ex: Documentação, Equipamentos..."
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
        />
      </Modal>

      {/* modal item */}
      <Modal
        open={!!addItemSection}
        onClose={() => setAddItemSection(null)}
        title="Adicionar item"
        width={560}
        footer={
          <>
            <button style={secondaryBtn} onClick={() => setAddItemSection(null)}>
              Cancelar
            </button>
            <button
              onClick={() => addItemSection && addItems(addItemSection)}
              disabled={!newItemDesc.trim() || saving}
              style={{
                ...primaryBtn,
                opacity: !newItemDesc.trim() || saving ? 0.45 : 1,
              }}
            >
              <FilePlus size={14} strokeWidth={2.5} />
              {saving ? "Adicionando..." : "Adicionar item"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 10,
              }}
            >
            <div style={{ width: isMobile ? "100%" : 100 }}>
              <Input
                label="Código"
                placeholder="Ex: A1"
                value={newItemCode}
                onChange={(e) => setNewItemCode(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Descrição *"
                placeholder="Descrição do item"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
              />
            </div>
          </div>

          <Select
            label="Setor"
            value={newItemSectorId}
            onChange={(e) => setNewItemSectorId(e.target.value)}
          >
            <option value="">(nenhum)</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Select
                label="Tipo de prazo"
                value={newItemRuleType}
                onChange={(e) => setNewItemRuleType(e.target.value as DueRuleType)}
              >
                <option value="OFFSET_DAYS">D+N (dias após âncora)</option>
                <option value="DAY_OF_NEXT_MONTH">Dia X do mês seguinte</option>
              </Select>
            </div>

            <div style={{ width: isMobile ? "100%" : 120 }}>
              <Input
                label={newItemRuleType === "OFFSET_DAYS" ? "Dias" : "Dia do mês"}
                type="number"
                placeholder={newItemRuleType === "OFFSET_DAYS" ? "Ex: 30" : "Ex: 10"}
                value={newItemRuleParam}
                onChange={(e) => setNewItemRuleParam(e.target.value)}
              />
            </div>
          </div>

          <Toggle
            checked={newItemRequired}
            onChange={setNewItemRequired}
            label="Item obrigatório (define a âncora de prazo)"
          />
        </div>
      </Modal>
    </div>
  );
}


const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 16px",
  borderRadius: 10,
  border: "none",
  background: "#012942", // Dourado para o destaque principal
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(187, 159, 88, 0.25)",
};

const secondaryBtn: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 10,
  border: "2px solid #ccc", // Borda no azul marinho
  background: "transparent",
  color: "#012942",             // Texto no azul marinho
  fontWeight: 600,
  cursor: "pointer",
};