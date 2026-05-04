import React, { useEffect, useState } from "react";
import { useToast } from "../toast";
import { Modal } from "../Modal";
import { Input, Select, FormGrid } from "../ui";
import { UserPlus } from "lucide-react";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { UserList } from "../components/UserList";

const ROLES = ["ADMIN", "GESTOR_EMPRESA", "OPERADOR", "LEITURA"] as const;

export function AdminUsers() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    sectorId: "",
    roles: ["OPERADOR"] as string[],
  });
  const [edit, setEdit] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const {
    users,
    sectors,
    loading,
    createUser,
    updateUser,
    disableUser,
    load,
  } = useAdminUsers();

  useEffect(() => {
    load();
  }, []);

  async function create() {
    setSaving(true);
    try {
      await createUser({
        ...form,
        sectorId: form.sectorId || undefined,
      });

      toast("Usuário criado com sucesso", "success");
      setCreateOpen(false);
      setForm({
        name: "",
        email: "",
        password: "",
        sectorId: "",
        roles: ["OPERADOR"],
      });
    } catch (e: any) {
      toast(e.message || "Erro ao criar usuário", "error");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!editUser) return;

    setSaving(true);
    try {
      const payload: any = {
        name: edit.name,
        email: edit.email,
        sectorId: edit.sectorId || null,
        roles: edit.roles,
        active: !!edit.active,
      };

      if (edit.password && edit.password.length >= 6) {
        payload.password = edit.password;
      }

      await updateUser(editUser.id, payload);

      toast("Usuário atualizado", "success");
      setEditUser(null);
    } catch (e: any) {
      toast(e.message || "Erro ao salvar", "error");
    } finally {
      setSaving(false);
    }
  }

  async function disable(id: string) {
    try {
      await disableUser(id);
      toast("Usuário desativado", "warning");
    } catch (e: any) {
      toast(e.message || "Erro", "error");
    }
  }

  function openEdit(u: any) {
    setEditUser(u);
    setEdit({
      name: u.name,
      email: u.email,
      sectorId: u.sector?.id ?? "",
      roles: (u.roles || []).length ? [...u.roles] : ["OPERADOR"],
      active: !!u.active,
      password: "",
    });
  }

  const RolesField = ({
    roles,
    onChange,
  }: {
    roles: string[];
    onChange: (r: string[]) => void;
  }) => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {ROLES.map((r) => (
        <label
          key={r}
          style={{
            display: "flex",
            gap: 7,
            alignItems: "center",
            cursor: "pointer",
            fontSize: 13.5,
          }}
        >
          <input
            type="checkbox"
            checked={roles.includes(r)}
            onChange={(e) =>
              onChange(
                e.target.checked
                  ? [...roles, r]
                  : roles.filter((x) => x !== r)
              )
            }
          />
          {r}
        </label>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #2563eb",
              animation: "spin 0.9s linear infinite",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Carregando usuários
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Aguarde enquanto buscamos os dados...
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
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
              Gestão de usuários
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
              Gerencie usuários, permissões de acesso e vínculos com setores em
              um único painel.
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            title="Adicionar usuário"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 18px",
              fontSize: 14,
              fontWeight: 800,
              borderRadius: 14,
              border: "1px solid ",
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
              <UserPlus size={15} strokeWidth={2.8} />
            </span>
            Novo usuário
          </button>
        </div>
      </div>

      <UserList users={users} onEdit={openEdit} onDisable={disable} />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo usuário"
        width={540}
        footer={
          <>
            <button
              onClick={() => setCreateOpen(false)}
              style={secondaryBtn}
            >
              Cancelar
            </button>

            <button
              onClick={create}
              disabled={
                !form.name || !form.email || form.password.length < 6 || saving
              }
              style={{
                ...primaryBtn,
                opacity:
                  !form.name || !form.email || form.password.length < 6 || saving
                    ? 0.45
                    : 1,
              }}
            >
              {saving ? "Salvando..." : "Criar usuário"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormGrid>
            <Input
              label="Nome *"
              placeholder="Nome completo"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <Input
              label="E-mail *"
              type="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </FormGrid>

          <FormGrid>
            <Input
              label="Senha * (mín. 6 caracteres)"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            <Select
              label="Setor"
              value={form.sectorId}
              onChange={(e) =>
                setForm((f) => ({ ...f, sectorId: e.target.value }))
              }
            >
              <option value="">(sem setor)</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormGrid>

          <div>
            <div style={sectionLabel}>Perfis de acesso</div>
            <RolesField
              roles={form.roles}
              onChange={(r) => setForm((f) => ({ ...f, roles: r }))}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title={`Editar — ${editUser?.name || ""}`}
        width={540}
        footer={
          <>
            <button onClick={() => setEditUser(null)} style={secondaryBtn}>
              Cancelar
            </button>

            <button
              onClick={saveEdit}
              disabled={!edit.name || !edit.email || saving}
              style={{
                ...primaryBtn,
                opacity: !edit.name || !edit.email || saving ? 0.45 : 1,
              }}
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormGrid>
            <Input
              label="Nome *"
              value={edit.name || ""}
              onChange={(e) =>
                setEdit((v: any) => ({ ...v, name: e.target.value }))
              }
            />
            <Input
              label="E-mail *"
              type="email"
              value={edit.email || ""}
              onChange={(e) =>
                setEdit((v: any) => ({ ...v, email: e.target.value }))
              }
            />
          </FormGrid>

          <FormGrid>
            <Input
              label="Nova senha"
              type="password"
              placeholder="Deixe em branco para não alterar"
              value={edit.password || ""}
              onChange={(e) =>
                setEdit((v: any) => ({ ...v, password: e.target.value }))
              }
              hint="Mínimo 6 caracteres"
            />
            <Select
              label="Setor"
              value={edit.sectorId || ""}
              onChange={(e) =>
                setEdit((v: any) => ({ ...v, sectorId: e.target.value }))
              }
            >
              <option value="">(sem setor)</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormGrid>

          <div>
            <div style={sectionLabel}>Perfis de acesso</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {ROLES.map((r) => (
                <label
                  key={r}
                  style={{
                    display: "flex",
                    gap: 7,
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 13.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={(edit.roles || []).includes(r)}
                    onChange={(e) =>
                      setEdit((v: any) => ({
                        ...v,
                        roles: e.target.checked
                          ? [...(v.roles || []), r]
                          : (v.roles || []).filter((x: string) => x !== r),
                      }))
                    }
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <Select
            label="Status"
            value={edit.active ? "1" : "0"}
            onChange={(e) =>
              setEdit((v: any) => ({ ...v, active: e.target.value === "1" }))
            }
          >
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 10,
};

const secondaryBtn: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 13.5,
  fontWeight: 600,
  borderRadius: 9,
  border: "2px solid #ccc",
  background: "#fff",
  color: "#475569",
  cursor: "pointer",
  fontFamily: "inherit",
};

const primaryBtn: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 13.5,
  fontWeight: 700,
  borderRadius: 9,
  border: "none",
  background: "#012942",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "inherit",
};