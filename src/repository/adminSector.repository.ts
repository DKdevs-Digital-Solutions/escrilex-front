import api from "../services/api";

export interface SectorPayload {
  name: string;
}

export const adminSectorRepository = {
  async getAll() {
    const { data } = await api.get("/api/admin/sectors");
    return data;
  },

  async create(payload: SectorPayload) {
    const { data } = await api.post("/api/admin/sectors", payload);
    return data;
  },

  async update(id: string, payload: SectorPayload) {
    const { data } = await api.put(`/api/admin/sectors/${id}`, payload);
    return data;
  },

  async disable(id: string) {
    const { data } = await api.delete(`/api/admin/sectors/${id}`);
    return data;
  },

  async activate(id: string) {
    const { data } = await api.put(`/api/admin/sectors/${id}/activate`);
    return data;
  },
};