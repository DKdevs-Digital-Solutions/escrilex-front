import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Input, Badge, Card, Table, Thead, Th, Tr, Td, Empty, PageHeader } from "../ui";
import { Plus, Pencil, PowerOff, Power } from "lucide-react";

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
  const [items, setItems] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() { setItems(await api("/api/admin/sectors")); }
  useEffect(() => { load(); }, []);

  async function create() {
    setSaving(true);
    try {
      await api("/api/admin/sectors", { method: "POST", body: JSON.stringify({ name }) });
      toast("Setor criado", "success");
      setName(""); setCreateOpen(false); load();
    } catch (e: any) { toast(e.message || "Erro ao criar setor", "error"); }
    finally { setSaving(false); }
  }

  async function saveEdit() {
    if (!editItem) return;
    setSaving(true);
    try {
      await api(`/api/admin/sectors/${editItem.id}`, { method: "PUT", body: JSON.stringify({ name: editName }) });
      toast("Setor atualizado", "success");
      setEditItem(null); load();
    } catch (e: any) { toast(e.message || "Erro ao salvar", "error"); }
    finally { setSaving(false); }
  }

  async function disable(id: string) {
    try {
      await api(`/api/admin/sectors/${id}`, { method: "DELETE" });
      toast("Setor desativado", "warning"); load();
    } catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  async function activate(id: string) {
    try {
      await api(`/api/admin/sectors/${id}/activate`, { method: "PUT" });
      toast("Setor reativado", "success"); load();
    } catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  return (
    <div>
      <PageHeader
        title="Setores"
        subtitle={`${items.length} registro${items.length !== 1 ? "s" : ""}`}
        action={
          <button
            onClick={() => { setName(""); setCreateOpen(true); }}
            title="Adicionar setor"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "8px 16px", fontSize: 13.5, fontWeight: 600,
              borderRadius: 9, border: "none", background: "#2563eb", color: "#fff",
              cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
              boxShadow: "0 2px 8px rgba(37,99,235,0.22)",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "#1d4ed8"; }}
            onMouseOut={e => { e.currentTarget.style.background = "#2563eb"; }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Novo setor
          </button>
        }
      />

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Nome</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {items.map(s => (
              <Tr key={s.id}>
                <Td style={{ fontWeight: 600 }}>{s.name}</Td>
                <Td><Badge label={s.active ? "Ativo" : "Inativo"} variant={s.active ? "green" : "gray"} /></Td>
                <Td align="right">
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                    {s.active && <IconBtn icon={<Pencil size={14} strokeWidth={2} />} title="Editar" onClick={() => { setEditItem(s); setEditName(s.name); }} />}
                    {s.active
                      ? <IconBtn icon={<PowerOff size={14} strokeWidth={2} />} title="Desativar" onClick={() => disable(s.id)} variant="danger" />
                      : <IconBtn icon={<Power size={14} strokeWidth={2} />} title="Reativar" onClick={() => activate(s.id)} variant="success" />}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        {!items.length && <Empty message="Nenhum setor cadastrado." />}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo setor"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={create} disabled={!name.trim() || saving} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!name.trim() || saving) ? 0.45 : 1 }}>
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
            <button onClick={() => setEditItem(null)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={saveEdit} disabled={!editName.trim() || saving} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!editName.trim() || saving) ? 0.45 : 1 }}>
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
