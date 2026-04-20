import api from "../services/api";

export const lookupRepository = {
  getSectors: async () => {
    const { data } = await api.get("/api/lookup/sectors");
    return data;
  },

  getUsers: async () => {
    const { data } = await api.get("/api/lookup/users");
    return data;
  },
};