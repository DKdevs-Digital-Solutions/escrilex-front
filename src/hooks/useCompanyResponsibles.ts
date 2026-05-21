import { useCallback, useState } from "react";
import { companyRepository } from "../repository/company.repository";

export function useCompanyResponsibles(companyId?: string) {
  const [responsibles, setResponsibles] = useState<any[]>([]);
  const [groupedResponsibles, setGroupedResponsibles] = useState<any[]>([]);
  const [loadingResponsibles, setLoadingResponsibles] = useState(false);

  const loadResponsibles = useCallback(async () => {
    if (!companyId) return;

    setLoadingResponsibles(true);

    try {
      const data = await companyRepository.getResponsibles(companyId);

      setResponsibles(data.responsibles ?? []);
      setGroupedResponsibles(data.grouped ?? []);

      return data;
    } finally {
      setLoadingResponsibles(false);
    }
  }, [companyId]);

  return {
    responsibles,
    groupedResponsibles,
    loadingResponsibles,
    loadResponsibles,
  };
}