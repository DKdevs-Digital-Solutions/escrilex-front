import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Input, Card, Table, Thead, Th, Tr, Td, Empty, PageHeader, Badge } from "../ui";
import { SlidersHorizontal } from "lucide-react";

const entityLabel: Record<string, string> = {
  Company: "Empresa", User: "Usuário", Sector: "Setor",
  ChecklistRun: "Checklist", ChecklistItemRun: "Item do checklist",
  ChecklistTemplate: "Template", ChecklistTemplateSection: "Seção",
  ChecklistTemplateItem: "Item do template",
};

const actionLabel: Record<string, string> = {
  LOGIN: "Login", COMPANY_CREATE: "Empresa criada", COMPANY_UPDATE: "Empresa atualizada",
  COMPANY_RESPONSIBLES_SET: "Responsáveis alterados", CHECKLIST_START: "Checklist iniciado",
  CHECKLIST_ITEM_UPDATE: "Checklist atualizado", USER_CREATE: "Usuário criado",
  USER_DISABLE: "Usuário desativado", SECTOR_CREATE: "Setor criado",
  SECTOR_DISABLE: "Setor desativado", TEMPLATE_CREATE: "Template criado",
  TEMPLATE_UPDATE: "Template atualizado", TEMPLATE_SECTION_CREATE: "Seção criada",
  TEMPLATE_SECTION_UPDATE: "Seção atualizada", TEMPLATE_SECTION_DELETE: "Seção excluída",
  TEMPLATE_ITEM_CREATE: "Item criado", TEMPLATE_ITEM_UPDATE: "Item atualizado",
  TEMPLATE_ITEM_DELETE: "Item excluído",
};

const actionBadge: Record<string, any> = {
  LOGIN: "gray", COMPANY_CREATE: "green", COMPANY_UPDATE: "blue",
  USER_CREATE: "blue", USER_DISABLE: "red",
  SECTOR_DISABLE: "red", CHECKLIST_START: "yellow",
  CHECKLIST_ITEM_UPDATE: "green",
};

export function Audit() {
  const [items, setItems] = useState<any[]>([]);
  const [filters, setFilters] = useState({ entity: "", action: "" });

  async function load() {
    const qs = new URLSearchParams();
    if (filters.entity) qs.set("entity", filters.entity);
    if (filters.action) qs.set("action", filters.action);
    const r = await api(`/api/admin/audit?${qs.toString()}`);
    setItems(r.items || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader title="Auditoria" subtitle="Registro histórico de ações no sistema" />

      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
        padding: "16px 20px", marginBottom: 20,
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end",
      }}>
        <div style={{ flex: 1, minWidth: 150 }}>
          <Input label="Entidade" placeholder="Ex: Company, User..." value={filters.entity}
            onChange={e => setFilters(f => ({ ...f, entity: e.target.value }))} />
        </div>
        <div style={{ flex: 1, minWidth: 150 }}>
          <Input label="Ação" placeholder="Ex: USER_CREATE..." value={filters.action}
            onChange={e => setFilters(f => ({ ...f, action: e.target.value }))} />
        </div>
        <button
          onClick={load}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "9px 16px", fontSize: 13.5, fontWeight: 600,
            borderRadius: 9, border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#374151", cursor: "pointer",
            fontFamily: "inherit", transition: "background 0.12s, border-color 0.12s",
            height: 40,
          }}
          onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
          onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filtrar
        </button>
      </div>

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Data / Hora</Th>
              <Th>Usuário</Th>
              <Th>Ação</Th>
              <Th>Entidade</Th>
            </tr>
          </Thead>
          <tbody>
            {items.map(r => (
              <Tr key={r.id}>
                <Td style={{ fontSize: 12.5, color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {new Date(r.createdAt).toLocaleString("pt-BR")}
                </Td>
                <Td>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.actor?.name ?? "—"}</div>
                  <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{r.actor?.email ?? ""}</div>
                </Td>
                <Td>
                  <Badge label={actionLabel[r.action] ?? r.action} variant={actionBadge[r.action] || "gray"} />
                </Td>
                <Td style={{ fontSize: 13, color: "#6b7280" }}>{entityLabel[r.entity] ?? r.entity}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        {!items.length && <Empty message="Nenhum evento encontrado." />}
      </Card>
    </div>
  );
}
