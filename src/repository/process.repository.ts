import api from "../services/api";

export const processRepository = {
  getByCompany: async (companyId: string, type: string) => {
    const { data } = await api.get(
      `/api/companies/${companyId}/process?type=${type}`
    );
    return data;
  },

  start: async (payload: any) => {
    const { data } = await api.post("/api/process/start", payload);
    return data;
  },

  getRun: async (id: string) => {
    const { data } = await api.get(`/api/process/run/${id}`);
    return data;
  },

  updateItem: async (id: string, payload: any) => {
    const { data } = await api.patch(`/api/process/item/${id}`, payload);
    return data;
  },
};