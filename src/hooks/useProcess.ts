import { useState } from "react";
import { processRepository } from "../repository/process.repository";

export function useProcess(companyId: string) {
  const [runs, setRuns] = useState<any[]>([]);
  const [run, setRun] = useState<any>(null);
  const [loading, setLoadingProcess] = useState(false);

  // ─────────────────────────────
  async function loadRuns(type: string) {
    setLoadingProcess(true);
    try {
      const data = await processRepository.getByCompany(companyId, type);
      setRuns(data);
      return data;
    } finally {
      setLoadingProcess(false);
    }
  }

  async function getRun(id: string) {
    const data = await processRepository.getRun(id);
    setRun(data);
    return data;
  }

  async function startRun(payload: any) {
    const data = await processRepository.start(payload);
    return data;
  }

  async function updateItem(id: string, payload: any) {
    return processRepository.updateItem(id, payload);
  }

  return {
    runs,
    run,
    loading,

    loadRuns,
    getRun,
    startRun,
    updateItem,
    setLoadingProcess
  };
}