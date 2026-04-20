import { useState, useEffect } from "react";
import { partnerRepository } from "../repository/partner.repository";

export function usePartners(companyId: string) {
  const [socios, setSocios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────
  // LOAD
  // ─────────────────────────────
  async function loadPartners() {
    setLoading(true);
    try {
      const data = await partnerRepository.getAll(companyId);
      setSocios(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────
  // CREATE / UPDATE
  // ─────────────────────────────
  async function savePartner(payload: any, id?: string) {
    if (id) {
      await partnerRepository.update(companyId, id, payload);
    } else {
      await partnerRepository.create(companyId, payload);
    }

    await loadPartners();
  }

  // ─────────────────────────────
  // DELETE
  // ─────────────────────────────
  async function deletePartner(id: string) {
    await partnerRepository.remove(companyId, id);
    await loadPartners();
  }

  // ─────────────────────────────
  useEffect(() => {
    if (companyId) loadPartners();
  }, [companyId]);

  return {
    socios,
    loading,

    loadPartners,
    savePartner,
    deletePartner,
  };
}