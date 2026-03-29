import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Input, Select, Badge, Card, Table, Thead, Th, Tr, Td, Empty, PageHeader, FormGrid, Loading } from "../ui";
import { UserPlus, Pencil, UserX, UserCheck } from "lucide-react";


const ROLES = ["ADMIN", "GESTOR_EMPRESA", "OPERADOR", "LEITURA"] as const;
const ROLE_BADGES: Record<string, any> = {
  ADMIN: "dark", GESTOR_EMPRESA: "blue", OPERADOR: "green", LEITURA: "gray",
};

// Icon-only button
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

export function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", sectorId: "", roles: ["OPERADOR"] as string[] });
  const [edit, setEdit] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  async function load() {
    setLoadingData(true);
    try {
      const [u, s] = await Promise.all([api("/api/admin/users"), api("/api/admin/sectors")]);
      setUsers(u); setSectors(s.filter((x: any) => x.active));
    } finally { setLoadingData(false); }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    setSaving(true);
    try {
      await api("/api/admin/users", { method: "POST", body: JSON.stringify({ ...form, sectorId: form.sectorId || undefined }) });
      toast("Usuário criado com sucesso", "success");
      setCreateOpen(false);
      setForm({ name: "", email: "", password: "", sectorId: "", roles: ["OPERADOR"] });
      load();
    } catch (e: any) { toast(e.message || "Erro ao criar usuário", "error"); }
    finally { setSaving(false); }
  }

  async function saveEdit() {
    if (!editUser) return;
    setSaving(true);
    try {
      const payload: any = { name: edit.name, email: edit.email, sectorId: edit.sectorId || null, roles: edit.roles, active: !!edit.active };
      if (edit.password && edit.password.length >= 6) payload.password = edit.password;
      await api(`/api/admin/users/${editUser.id}`, { method: "PUT", body: JSON.stringify(payload) });
      toast("Usuário atualizado", "success");
      setEditUser(null); load();
    } catch (e: any) { toast(e.message || "Erro ao salvar", "error"); }
    finally { setSaving(false); }
  }

  async function disable(id: string) {
    try {
      await api(`/api/admin/users/${id}`, { method: "DELETE" });
      toast("Usuário desativado", "warning"); load();
    } catch (e: any) { toast(e.message || "Erro", "error"); }
  }

  function openEdit(u: any) {
    setEditUser(u);
    setEdit({ name: u.name, email: u.email, sectorId: u.sector?.id ?? "", roles: (u.roles || []).length ? [...u.roles] : ["OPERADOR"], active: !!u.active, password: "" });
  }

  const RolesField = ({ roles, onChange }: { roles: string[]; onChange: (r: string[]) => void }) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {ROLES.map(r => (
        <label key={r} style={{ display: "flex", gap: 7, alignItems: "center", cursor: "pointer", fontSize: 13.5 }}>
          <input type="checkbox" checked={roles.includes(r)}
            onChange={e => onChange(e.target.checked ? [...roles, r] : roles.filter(x => x !== r))} />
          {r}
        </label>
      ))}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Usuários"
        subtitle={`${users.length} registro${users.length !== 1 ? "s" : ""}`}
        action={
          <button
            onClick={() => setCreateOpen(true)}
            title="Adicionar usuário"
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
            <UserPlus size={15} strokeWidth={2} />
            Novo usuário
          </button>
        }
      />

      <Card>
        {loadingData ? <Loading message="Carregando usuários..." /> : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>E-mail</Th>
                  <Th>Setor</Th>
                  <Th>Perfis</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <tbody>
                {users.map(u => (
                  <Tr key={u.id}>
                    <Td style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</Td>
                    <Td style={{ color: "#6b7280", fontSize: 13 }}>{u.email}</Td>
                    <Td style={{ fontSize: 13 }}>{u.sector?.name ?? <span style={{ color: "#d1d5db" }}>—</span>}</Td>
                    <Td>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {(u.roles || []).map((r: string) => <Badge key={r} label={r} variant={ROLE_BADGES[r] || "gray"} />)}
                      </div>
                    </Td>
                    <Td><Badge label={u.active ? "Ativo" : "Inativo"} variant={u.active ? "green" : "gray"} /></Td>
                    <Td align="right">
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <IconBtn icon={<Pencil size={14} strokeWidth={2} />} title="Editar" onClick={() => openEdit(u)} />
                        {u.active && <IconBtn icon={<UserX size={14} strokeWidth={2} />} title="Desativar" onClick={() => disable(u.id)} variant="danger" />}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            {!users.length && <Empty message="Nenhum usuário cadastrado." />}
          </>
        )}
      </Card>

      {/* Modal criar */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Novo usuário" width={540}
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={create} disabled={!form.name || !form.email || form.password.length < 6 || saving}
              style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!form.name || !form.email || form.password.length < 6 || saving) ? 0.45 : 1 }}>
              {saving ? "Salvando..." : "Criar usuário"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormGrid>
            <Input label="Nome *" placeholder="Nome completo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="E-mail *" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </FormGrid>
          <FormGrid>
            <Input label="Senha * (mín. 6 caracteres)" type="password" placeholder="••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <Select label="Setor" value={form.sectorId} onChange={e => setForm(f => ({ ...f, sectorId: e.target.value }))}>
              <option value="">(sem setor)</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </FormGrid>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Perfis de acesso</div>
            <RolesField roles={form.roles} onChange={r => setForm(f => ({ ...f, roles: r }))} />
          </div>
        </div>
      </Modal>

      {/* Modal editar */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title={`Editar — ${editUser?.name || ""}`} width={540}
        footer={
          <>
            <button onClick={() => setEditUser(null)} style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 600, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
            <button onClick={saveEdit} disabled={!edit.name || !edit.email || saving}
              style={{ padding: "8px 16px", fontSize: 13.5, fontWeight: 700, borderRadius: 9, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: (!edit.name || !edit.email || saving) ? 0.45 : 1 }}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormGrid>
            <Input label="Nome *" value={edit.name || ""} onChange={e => setEdit((v: any) => ({ ...v, name: e.target.value }))} />
            <Input label="E-mail *" type="email" value={edit.email || ""} onChange={e => setEdit((v: any) => ({ ...v, email: e.target.value }))} />
          </FormGrid>
          <FormGrid>
            <Input label="Nova senha" type="password" placeholder="Deixe em branco para não alterar"
              value={edit.password || ""} onChange={e => setEdit((v: any) => ({ ...v, password: e.target.value }))}
              hint="Mínimo 6 caracteres" />
            <Select label="Setor" value={edit.sectorId || ""} onChange={e => setEdit((v: any) => ({ ...v, sectorId: e.target.value }))}>
              <option value="">(sem setor)</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </FormGrid>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Perfis de acesso</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {ROLES.map(r => (
                <label key={r} style={{ display: "flex", gap: 7, alignItems: "center", cursor: "pointer", fontSize: 13.5 }}>
                  <input type="checkbox" checked={(edit.roles || []).includes(r)}
                    onChange={e => setEdit((v: any) => ({
                      ...v, roles: e.target.checked ? [...(v.roles || []), r] : (v.roles || []).filter((x: string) => x !== r)
                    }))} />
                  {r}
                </label>
              ))}
            </div>
          </div>
          <Select label="Status" value={edit.active ? "1" : "0"} onChange={e => setEdit((v: any) => ({ ...v, active: e.target.value === "1" }))}>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
