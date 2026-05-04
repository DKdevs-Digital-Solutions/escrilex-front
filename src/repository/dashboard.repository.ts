import api from "../services/api";

export type DashboardSummary = {
  period: {
    startDate: string;
    endDate: string;
  };
  cards: {
    newClients: number;
    inactiveClients: number;
    totalActive: number;
    totalInactive: number;
  };
};

export type DashboardSummaryParams = {
  startDate?: string;
  endDate?: string;
};

export async function getDashboardSummary(
  params: DashboardSummaryParams
): Promise<DashboardSummary> {
  const query = new URLSearchParams();

  if (params.startDate) {
    query.append("startDate", new Date(params.startDate).toISOString());
  }

  if (params.endDate) {
    query.append("endDate", new Date(params.endDate).toISOString());
  }

  const response = await api.get<DashboardSummary>(
    `/api/dashboard/summary${query.toString() ? `?${query.toString()}` : ""}`
  );

  return response.data;
}