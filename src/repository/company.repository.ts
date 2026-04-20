import api from "../services/api";

export const companyRepository = {

    async getAll() {
    const { data } = await api.get("/api/companies");
    return data;
  },

  async create(payload: any) {
    const { data } = await api.post("/api/companies", payload);
    return data;
  },

  
  getById: async (id: string) => {
    const { data } = await api.get(`/api/companies/${id}`);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await api.put(`/api/companies/${id}`, payload);
    return data;
  },


  updateResponsibles: async (companyId: string, payload: any[]) => {
  const { data } = await api.put(
    `/api/companies/${companyId}/responsibles`,
    { responsibles: payload }
  );
  return data;
},
};