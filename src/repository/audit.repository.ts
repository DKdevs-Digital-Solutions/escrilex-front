// repository/audit.repository.ts
import api from "../services/api";

export interface AuditFilters {
  entity?: string;
  action?: string;
}

export const auditRepository = {
  async getAll(filters: AuditFilters = {}) {
    const qs = new URLSearchParams();

    if (filters.entity) qs.set("entity", filters.entity);
    if (filters.action) qs.set("action", filters.action);

    const { data } = await api.get(`/api/admin/audit?${qs.toString()}`);
    return data;
  },
};