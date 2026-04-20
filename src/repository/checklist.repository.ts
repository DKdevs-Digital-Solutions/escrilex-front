import api from "../services/api";

export const checklistRepository = {
  getByCompany: async (companyId: string, type: string) => {
    const { data } = await api.get(
      `/api/companies/${companyId}/checklists?type=${type}`
    );
    return data;
  },

  start: async (payload: any) => {
    const { data } = await api.post("/api/checklists/start", payload);
    return data;
  },

  getRun: async (id: string) => {
    const { data } = await api.get(`/api/checklists/run/${id}`);
    return data;
  },

  updateItem: async (id: string, payload: any) => {
    const { data } = await api.patch(`/api/checklists/item/${id}`, payload);
    return data;
  },

  createItem: async (payload: any) => {
    const { data } = await api.post(`/api/checklists/item`, payload);
    return data;
  },
};