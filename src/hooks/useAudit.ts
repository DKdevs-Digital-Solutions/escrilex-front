// hooks/useAudit.ts
import { useCallback, useState } from "react";
import { auditRepository, AuditFilters } from "../repository/audit.repository";

export function useAudit() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAudit = useCallback(async (filters: AuditFilters = {}) => {
    setLoading(true);
    try {
      const data = await auditRepository.getAll(filters);
      const list = data?.items || [];
      setItems(list);
      return list;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    loadAudit,
  };
}