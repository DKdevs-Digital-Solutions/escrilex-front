import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Input, Badge, Card, Table, Thead, Th, Tr, Td, Empty, PageHeader } from "../ui";
import { Plus, Pencil, PowerOff, Power } from "lucide-react";
import { useAdminSectors } from "../hooks/useAdminSectors";
import { SectorList } from "../components/SectorList";

function IconBtn({ icon, title, onClick, variant = "secondary" }: {
  icon: React.ReactNode; title: string; onClick: () => void; variant?: "secondary" | "danger" | "success";
}) {
  const base = {
    secondary: { bg: "#fff", color: "#374151", border: "#e2e8f0", hover: "#f8fafc", hoverBorder: "#cbd5e1" },
    danger:    { bg: "#fff", color: "#dc2626", border: "#fca5a5", hover: "#fef2f2", hoverBorder: "#fca5a5" },
    success:   { bg: "#fff", color: "#16a34a", border: "#bbf7d0", hover: "#f0fdf4", hoverBorder: "#bbf7d0" },
  }[variant];
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${base.border}`,
        background: base.bg, color: base.color, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.12s, border-color 0.12s",
        fontFamily: "inherit",
      }}
      onMouseOver={e => { e.currentTarget.style.background = base.hover; e.currentTarget.style.borderColor = base.hoverBorder; }}
      onMouseOut={e => { e.currentTarget.style.background = base.bg; e.currentTarget.style.borderColor = base.border; }}
    >
      {icon}
    </button>
  );
}

export function AdminSectors() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const {
  items,
  loading,
  createSector,
  updateSector,
  disableSector,
  activateSector,
  load
  } = useAdminSectors();

  useEffect(() => { load(); }, []);

  async function create() {
    setSaving(true);
    try {
      await createSector({ name });
      toast("Setor criado", "success");
      setName("");
      setCreateOpen(false);
    } catch (e: any) {
      toast(e.message || "Erro ao criar setor", "error");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
  if (!editItem) return;

  setSaving(true);
  try {
    await updateSector(editItem.id, { name: editName });
    toast("Setor atualizado", "success");
    setEditItem(null);
  } catch (e: any) {
    toast(e.message || "Erro ao salvar", "error");
  } finally {
    setSaving(false);
  }
  }

  async function disable(id: string) {
    try {
    await disableSector(id);
    toast("Setor desativado", "warning");
  } catch (e: any) {
    toast(e.message || "Erro", "error");
  }
  }

  async function activate(id: string) {
    try {
    await activateSector(id);
    toast("Setor reativado", "success");
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    }
  }

   function handleEdit(sector: any) {
    setEditItem(sector);
    setEditName(sector.name);
  }

  return (
    <div>
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
        Gestão de setores
      </h1>

      <p
        style={{
          margin: "10px 0 0",
          fontSize: 14.5,
          color: "#64748b",
          maxWidth: 620,
          lineHeight: 1.6,
        }}
      >
        Organize, acompanhe e mantenha atualizados os setores cadastrados no sistema.
        Centralize a estrutura da operação em um único painel.
      </p>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginLeft: "auto",
      }}
    >
      

        <button
          onClick={() => {
            setName("");
            setCreateOpen(true);
          }}
          title="Adicionar setor"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 18px",
            fontSize: 14,
            fontWeight: 800,
            borderRadius: 14,
            border: "1px solid #ccc",
            background: "#BB9F58",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.18s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.filter = "brightness(1.03)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.filter = "brightness(1)";
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
          Novo setor
        </button>
      </div>
    </div>
  </div>

     <SectorList
        items={items}
        onEdit={handleEdit}
        onDisable={disable}
        onActivate={activate}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo setor"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "2px solid #ccc", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={create} disabled={!name.trim() || saving} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#012942", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!name.trim() || saving) ? 0.45 : 1 }}>
              {saving ? "Salvando..." : "Criar setor"}
            </button>
          </>
        }
      >
        <Input label="Nome do setor" placeholder="Ex: Financeiro, TI, Operações..." value={name} onChange={e => setName(e.target.value)} />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Editar — ${editItem?.name || ""}`}
        footer={
          <>
            <button onClick={() => setEditItem(null)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "2px solid #ccc", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={saveEdit} disabled={!editName.trim() || saving} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#012942", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!editName.trim() || saving) ? 0.45 : 1 }}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </>
        }
      >
        <Input label="Nome" value={editName} onChange={e => setEditName(e.target.value)} />
      </Modal>
    </div>
  );
}
