import api from "../services/api";

export const partnerRepository = {
  getAll: async (companyId: string) => {
    const { data } = await api.get(`/api/companies/${companyId}/partners`);
    return data;
  },

  create: async (companyId: string, payload: any) => {
    const { data } = await api.post(
      `/api/companies/${companyId}/partners`,
      payload
    );
    return data;
  },

  update: async (companyId: string, id: string, payload: any) => {
    const { data } = await api.put(
      `/api/companies/${companyId}/partners/${id}`,
      payload
    );
    return data;
  },

  remove: async (companyId: string, id: string) => {
    const { data } = await api.delete(
      `/api/companies/${companyId}/partners/${id}`
    );
    return data;
  },
};