import api from "../services/api";

export type DashboardGrowthMetric = {
  current: number;
  previous: number;
  growthPercent: number;
};

export type DashboardChartItem = {
  label: string;
  total: number;
};

export type DashboardResponsibleDepartmentItem = {
  label: string;
  total: number;
  companiesTotal: number;
};

export type DashboardResponsibleChanges = {
  totalCompanies: number;
  byDepartment: DashboardResponsibleDepartmentItem[];
};

export type DashboardSummary = {
  period: {
    startDate: string;
    endDate: string;
    previousStartDate: string;
    previousEndDate: string;
  };

  cards: {
    alterations: number;
    inactiveClients: number;
    newClients: number;
    responsibleChanges: number;
    totalActive: number;
    totalInactive: number;
  };

  comparisons: {
    entries: DashboardGrowthMetric;
    exits: DashboardGrowthMetric;
  };

  charts: {
    taxation: DashboardChartItem[];
    activityBranch: DashboardChartItem[];
    profile: DashboardChartItem[];
    status: DashboardChartItem[];
    alterations: DashboardChartItem[];
    responsibleChanges: DashboardResponsibleChanges;
  };

  drilldownEndpoint: string;
  expectationMatrixEndpoint: string;
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


export async function getDashboardAnalytics(
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
    `/api/dashboard/analytics${query.toString() ? `?${query.toString()}` : ""}`
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
    `/api/dashboard/details?${query.toString()}`
  );

  return response.data;
}