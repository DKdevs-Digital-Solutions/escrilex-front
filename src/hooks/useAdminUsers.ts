import { useCallback, useEffect, useState } from "react";
import { adminUserRepository, AdminUserPayload } from "../repository/adminUser.repository";
import { adminSectorRepository } from "../repository/adminSector.repository";

export function useAdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, s] = await Promise.all([
        adminUserRepository.getAll(),
        adminSectorRepository.getAll(),
      ]);

      setUsers(u);
      setSectors((s || []).filter((x: any) => x.active));
      return { users: u, sectors: s };
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (payload: AdminUserPayload) => {
    const data = await adminUserRepository.create(payload);
    await load();
    return data;
  }, [load]);

  const updateUser = useCallback(async (id: string, payload: AdminUserPayload) => {
    const data = await adminUserRepository.update(id, payload);
    await load();
    return data;
  }, [load]);

  const disableUser = useCallback(async (id: string) => {
    const data = await adminUserRepository.remove(id);
    await load();
    return data;
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    users,
    sectors,
    loading,
    load,
    createUser,
    updateUser,
    disableUser,
    setLoading
  };
}