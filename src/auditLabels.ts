// Rótulos amigáveis para os códigos de ação da auditoria (AuditLog.action).
// Usado na tela de Auditoria e no detalhamento de alterações do dashboard.
export const actionLabel: Record<string, string> = {
  LOGIN: "Login",
  COMPANY_CREATE: "Empresa criada",
  COMPANY_UPDATE: "Empresa atualizada",
  COMPANY_STATUS_UPDATE: "Status da empresa atualizado",
  COMPANY_INACTIVATE: "Empresa inativada",
  COMPANY_RESPONSIBLES_SET: "Responsáveis alterados",
  COMPANY_PARTNER_CREATE: "Sócio adicionado",
  COMPANY_PARTNER_UPDATE: "Sócio atualizado",
  COMPANY_PARTNER_DELETE: "Sócio removido",
  COMPANY_CLIENT_CONTACT_CREATE: "Contato do cliente adicionado",
  COMPANY_CLIENT_CONTACT_UPDATE: "Contato do cliente atualizado",
  COMPANY_CLIENT_CONTACT_DELETE: "Contato do cliente removido",
  EXPECTATION_MATRIX_UPDATE: "Matriz atualizada",
  PROCESS_START: "Processo iniciado",
  PROCESS_ITEM_UPDATE: "Processo atualizado",
  USER_CREATE: "Usuário criado",
  USER_UPDATE: "Usuário atualizado",
  USER_DISABLE: "Usuário desativado",
  USER_ENABLE: "Usuário reativado",
  SECTOR_CREATE: "Setor criado",
  SECTOR_UPDATE: "Setor atualizado",
  SECTOR_DISABLE: "Setor desativado",
  SECTOR_ENABLE: "Setor reativado",
  TEMPLATE_CREATE: "Template criado",
  TEMPLATE_UPDATE: "Template atualizado",
  TEMPLATE_SECTION_CREATE: "Seção criada",
  TEMPLATE_SECTION_UPDATE: "Seção atualizada",
  TEMPLATE_SECTION_DELETE: "Seção excluída",
  TEMPLATE_ITEM_CREATE: "Item criado",
  TEMPLATE_ITEM_UPDATE: "Item atualizado",
  TEMPLATE_ITEM_DELETE: "Item excluído",
};

// Converte um código técnico (SNAKE_CASE ou camelCase) em texto legível.
export function humanizeCode(code: string) {
  if (!code) return "";
  return String(code)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
}

export function getActionLabel(action: string) {
  return actionLabel[action] ?? humanizeCode(action);
}
