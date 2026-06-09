import { useState } from "react";
import { getDashboardAnalytics } from "../repository/dashboard.repository";

type UseDashboardAnalyticsParams = {
  startDate?: string;
  endDate?: string;
};

export function useDashboardAnalytics({
  startDate,
  endDate,
}: UseDashboardAnalyticsParams) {
  const [dataAnalytics, setDataAnalytics] = useState<any | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState("");

  async function loadDashboardAnalytics(
    overrideStartDate?: string,
    overrideEndDate?: string
  ) {
    try {
      setLoadingAnalytics(true);
      setErrorAnalytics("");
      setDataAnalytics(null);

      const response = await getDashboardAnalytics({
        startDate: overrideStartDate ?? startDate,
        endDate: overrideEndDate ?? endDate,
      });

      setDataAnalytics(response);
    } catch (err: any) {
      setErrorAnalytics(err?.message || "Erro ao carregar analytics.");
      setDataAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }

  function clearDashboardAnalytics() {
    setDataAnalytics(null);
    setErrorAnalytics("");
  }

  return {
    dataAnalytics,
    loadingAnalytics,
    errorAnalytics,
    loadDashboardAnalytics,
    clearDashboardAnalytics,
  };
}