import { useState } from "react";
import { getDashboardDrilldown } from "../repository/dashboard.repository";

type UseDashboardDrilldownParams = {
  type: string;
  initialKey?: string;
  startDate?: string;
  endDate?: string;
};

export function useDashboardDrilldown({
  type,
  initialKey,
  startDate,
  endDate,
}: UseDashboardDrilldownParams) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [key, setKey] = useState<string | undefined>(initialKey);

  async function loadDrilldown(
    overrideType?: string,
    overrideKey?: string
  ) {
    try {
      setLoading(true);
      setError("");
      setData(null); // limpa antes de carregar o novo

      const response = await getDashboardDrilldown({
        type: overrideType ?? type,
        key: overrideKey,
        startDate,
        endDate,
      });

      setData(response);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar detalhamento.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function clearDrilldown() {
    setData(null);
    setError("");
    setKey(undefined);
  }

  return {
    data,
    loading,
    error,
    key,
    setKey,
    loadDrilldown,
    clearDrilldown,
  };
}