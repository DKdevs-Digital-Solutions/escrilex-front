import React from "react";
import { Loading } from "../ui";
import { useProcessRun } from "../hooks/useProcessRun";
import { ProcessRunHeader } from "../components/process-run/ProcessRunHeader";
import { ProcessRunMeta } from "../components/process-run/ProcessRunMeta";
import { ProcessRunSection } from "../components/process-run/ProcessRunSection";

export function ProcessRun({
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
  } = useProcessRun(runId);

  if (loading || !run) {
    return <Loading message="Carregando processo..." />;
  }

  return (
    <div>
      <ProcessRunHeader
        run={run}
        pct={pct}
        doneItems={doneItems}
        totalItems={totalItems}
        onBack={onBack}
      />

      <ProcessRunMeta run={run} />

      {run.template.sections.map((section: any) => (
        <ProcessRunSection
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