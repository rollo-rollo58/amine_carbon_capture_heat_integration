'use client';

import { useEffect, useState } from 'react';
import AbsorberSection from '@/components/AbsorberSection';
import AlarmJournal from '@/components/AlarmJournal';
import BalanceNarrative from '@/components/BalanceNarrative';
import CompressionCurve from '@/components/CompressionCurve';
import ControlMast from '@/components/ControlMast';
import EquipmentLedger from '@/components/EquipmentLedger';
import HeatRecoveryPanel from '@/components/HeatRecoveryPanel';
import KpiRibbon from '@/components/KpiRibbon';
import MaterialBalance from '@/components/MaterialBalance';
import ProcessSchematic from '@/components/ProcessSchematic';
import ScenarioWorkbench from '@/components/ScenarioWorkbench';
import SolventHealthGauge from '@/components/SolventHealthGauge';
import StripperSection from '@/components/StripperSection';
import TelemetryRibbon from '@/components/TelemetryRibbon';
import { getPlant, runScenario } from '@/lib/api-client';
import { usePlantTelemetry } from '@/hooks/usePlantTelemetry';
import { DEFAULT_INPUTS } from '@/types/domain';
import type { Equipment, ScenarioInput, ScenarioOutput } from '@/types/domain';

export default function ControlRoom() {
  const [inputs, setInputs] = useState<ScenarioInput>(DEFAULT_INPUTS);
  const [result, setResult] = useState<ScenarioOutput | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { state, samples } = usePlantTelemetry();

  useEffect(() => {
    void getPlant().then((plant) => setEquipment(plant.equipment))
      .catch(() => setError('The equipment inventory API is unavailable.'));
  }, []);

  async function evaluate() {
    setBusy(true);
    setError(null);
    try {
      const response = await runScenario(inputs);
      setResult(response.outputs);
      setEvaluation(response.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to evaluate scenario');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1650px] space-y-6 px-4 pb-12 pt-7 lg:px-8">
      <ControlMast connection={state} evaluated={evaluation} />
      <KpiRibbon result={result} />
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="space-y-5">
          <ProcessSchematic />
          <div className="grid gap-5 lg:grid-cols-3">
            <AbsorberSection inputs={inputs} output={result} />
            <StripperSection inputs={inputs} output={result} />
            <SolventHealthGauge output={result} ageDays={inputs.solvent_age_days} />
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <CompressionCurve inputs={inputs} output={result} />
            <HeatRecoveryPanel inputs={inputs} output={result} />
            <MaterialBalance output={result} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <TelemetryRibbon samples={samples} />
            <BalanceNarrative result={result} />
          </div>
          <EquipmentLedger equipment={equipment} />
        </div>
        <aside className="space-y-5">
          <ScenarioWorkbench inputs={inputs} onChange={setInputs}
            onRun={() => void evaluate()} busy={busy} />
          <AlarmJournal output={result} message={error} />
        </aside>
      </div>
      <footer className="border-t border-line pt-5 text-xs text-slate-500">
        CarbonLoop experimental process twin / All outputs are simulated.
      </footer>
    </main>
  );
}
