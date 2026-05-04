import React from "react";
import { Loading } from "../ui";
import { useChecklistRun } from "../hooks/useChecklistRun";
import { ChecklistRunHeader } from "../components/checklist-run/ChecklistRunHeader";
import { ChecklistRunMeta } from "../components/checklist-run/ChecklistRunMeta";
import { ChecklistRunSection } from "../components/checklist-run/ChecklistRunSection";

export function ChecklistRun({
  runId,
  onBack,
}: {
  runId: string;
  onBack: () => void;
}) {
  const {
    run,
    loading,
    saving,
    setStatus,
    setObservation,
    doneItems,
    totalItems,
    pct,
  } = useChecklistRun(runId);

  if (loading || !run) {
    return <Loading message="Carregando checklist..." />;
  }

  return (
    <div>
      <ChecklistRunHeader
        run={run}
        pct={pct}
        doneItems={doneItems}
        totalItems={totalItems}
        onBack={onBack}
      />

      <ChecklistRunMeta run={run} />

      {run.template.sections.map((section: any) => (
        <ChecklistRunSection
          key={section.id}
          section={section}
          saving={saving}
          onSetStatus={setStatus}
          onSetObservation={setObservation}
        />
      ))}
    </div>
  );
}