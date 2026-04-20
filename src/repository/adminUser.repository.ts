import api from "../services/api";

export interface AdminUserPayload {
  name: string;
  email: string;
  password?: string;
  sectorId?: string | null;
  roles: string[];
  active?: boolean;
}

export const adminUserRepository = {
  async getAll() {
    const { data } = await api.get("/api/admin/users");
    return data;
  },

  async create(payload: AdminUserPayload) {
    const { data } = await api.post("/api/admin/users", payload);
    return data;
  },

  async update(id: string, payload: AdminUserPayload) {
    const { data } = await api.put(`/api/admin/users/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/api/admin/users/${id}`);
    return data;
  },
};