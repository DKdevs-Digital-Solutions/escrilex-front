import { useCallback, useEffect, useState } from "react";
import { adminSectorRepository, SectorPayload } from "../repository/adminSector.repository";

export function useAdminSectors() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminSectorRepository.getAll();
      setItems(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSector = useCallback(async (payload: SectorPayload) => {
    const data = await adminSectorRepository.create(payload);
    await load();
    return data;
  }, [load]);

  const updateSector = useCallback(async (id: string, payload: SectorPayload) => {
    const data = await adminSectorRepository.update(id, payload);
    await load();
    return data;
  }, [load]);

  const disableSector = useCallback(async (id: string) => {
    const data = await adminSectorRepository.disable(id);
    await load();
    return data;
  }, [load]);

  const activateSector = useCallback(async (id: string) => {
    const data = await adminSectorRepository.activate(id);
    await load();
    return data;
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    items,
    loading,
    load,
    createSector,
    updateSector,
    disableSector,
    activateSector,
  };
}