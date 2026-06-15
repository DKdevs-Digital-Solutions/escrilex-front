import api from "../services/api";

export type ItemStatus = "PENDENTE" | "CONCLUIDO" | "EM_ANDAMENTO" | "NA";

export async function getProcessRun(runId: string) {
  const { data } = await api.get(`/api/process/run/${runId}`);
  return data;
}

export async function updateProcessItemStatus(
  itemRunId: string,
  status: ItemStatus
) {
  const { data } = await api.patch(`/api/process/item/${itemRunId}`, {
    status,
  });
  return data;
}

export async function updateProcessItemObservation(
  itemRunId: string,
  observation: string
) {
  const { data } = await api.patch(`/api/process/item/${itemRunId}`, {
    observation,
  });
  return data;
}