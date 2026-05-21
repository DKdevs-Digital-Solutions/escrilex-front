import api from "../services/api";

export type ExpectationMatrixParams = {
  search?: string;
  status?: string;
  grupo?: string;
  tributacao?: string;
  ramo?: string;
  perfil?: string;
  limit?: number;
  offset?: number;
};

export async function getExpectationMatrixOptions() {
  const response = await api.get("/api/expectation-matrix/options");
  return response.data;
}

export async function getExpectationMatrix(params: ExpectationMatrixParams) {
  const response = await api.get("/api/expectation-matrix", {
    params: {
      search: params.search || undefined,
      status: params.status || undefined,
      grupo: params.grupo || undefined,
      tributacao: params.tributacao || undefined,
      ramo: params.ramo || undefined,
      perfil: params.perfil || undefined,
      limit: params.limit ?? 100,
      offset: params.offset ?? 0,
    },
  });

  return response.data;
}

export async function getExpectationMatrixByCompanyId(companyId: string) {
  const response = await api.get(`/api/expectation-matrix/${companyId}`);
  return response.data;
}

export async function updateExpectationMatrix(
  companyId: string,
  payload: Record<string, any>
) {
  const response = await api.patch(`/api/expectation-matrix/${companyId}`, payload);
  return response.data;
}