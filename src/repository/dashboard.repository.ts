import api from "../services/api";

export type DashboardGrowthMetric = {
  total: number;
  previous: number;
  growthPercent: number;
};

export type DashboardChartItem = {
  key: string;
  total: number;
};

export type DashboardResponsibleByDepartment = {
  department: string;
  total: number;
};

export type DashboardSummary = {
  period: {
    startDate: string;
    endDate: string;
    previousStart: string;
    previousEnd: string;
  };

  cards: {
    entries: DashboardGrowthMetric;
    exits: DashboardGrowthMetric;
    totalActive: number;
    totalInactive: number;
    companyChanges: number;
    responsibleChanges: number;
  };

  charts: {
    tributacao: DashboardChartItem[];
    ramo: DashboardChartItem[];
    perfil: DashboardChartItem[];
    exitReasons: DashboardChartItem[];
    responsibleByDepartment: DashboardResponsibleByDepartment[];
  };
};

export type DashboardSummaryParams = {
  startDate?: string;
  endDate?: string;
};


export type DashboardDrilldownParams = {
  type: string;
  key?: string;
  period?: "7d" | "30d" | "90d" | string;
  startDate?: string;
  endDate?: string;
};

export type DashboardDrilldown = {
  period?: {
    startDate: string;
    endDate: string;
  };
  type?: string;
  key?: string;
  items?: any[];
  data?: any[];
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


export async function getDashboardDrilldown(
  params: DashboardDrilldownParams
): Promise<DashboardDrilldown> {
  const query = new URLSearchParams();

  query.append("type", params.type);

  if (params.key) {
    query.append("key", params.key);
  }

  if (params.period) {
    query.append("period", params.period);
  }

  if (params.startDate) {
    query.append("startDate", new Date(params.startDate).toISOString());
  }

  if (params.endDate) {
    query.append("endDate", new Date(params.endDate).toISOString());
  }

  const response = await api.get<DashboardDrilldown>(
    `/api/dashboard/drilldown?${query.toString()}`
  );

  return response.data;
}