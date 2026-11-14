'use client';

import type { ScenarioInput } from '@/types/domain';

interface Props {
  inputs: ScenarioInput;
  onChange: (next: ScenarioInput) => void;
  onRun: () => void;
  busy: boolean;
}

const CONTROLS: Array<{
  name: keyof ScenarioInput;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = [
  { name: 'flue_gas_kmol_h', label: 'Flue gas flow', min: 1000, max: 60000, step: 500,
    unit: 'kmol/h' },
  { name: 'co2_mole_fraction', label: 'CO₂ feed fraction', min: 0.04, max: 0.30, step: 0.01,
    unit: 'mol/mol' },
  { name: 'lean_solvent_m3_h', label: 'Lean solvent circulation', min: 100, max: 2400,
    step: 25, unit: 'm³/h' },
  { name: 'stripper_temperature_c', label: 'Regeneration temperature', min: 90,
    max: 150, step: 1, unit: '°C' },
  { name: 'storage_pressure_bar', label: 'Storage pressure', min: 35, max: 180,
    step: 5, unit: 'bar' },
  { name: 'heat_recovery_fraction', label: 'Heat recovery fraction', min: 0, max: 0.8,
    step: 0.05, unit: 'ratio' },
];

export default function ScenarioWorkbench({ inputs, onChange, onRun, busy }: Props) {
  return (
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="panel-title text-slate-200">What-if operating envelope</h2>
          <p className="mt-2 text-xs text-slate-500">Change variables, then evaluate.</p>
        </div>
        <span className="rounded bg-mint/10 px-2 py-1 text-xs text-mint">SIMULATION</span>
      </div>
      <div className="mt-6 space-y-5">
        {CONTROLS.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-2 flex justify-between gap-2 text-xs">
              <span className="text-slate-300">{field.label}</span>
              <strong className="font-mono text-mint">
                {inputs[field.name].toFixed(field.step < 1 ? 2 : 0)} {field.unit}
              </strong>
            </span>
            <input aria-label={field.label} className="w-full accent-emerald-300"
              type="range" min={field.min} max={field.max} step={field.step}
              value={inputs[field.name]}
              onChange={(event) => onChange({
                ...inputs, [field.name]: Number(event.target.value),
              })} />
          </label>
        ))}
      </div>
      <button type="button" onClick={onRun} disabled={busy}
        className="mt-7 w-full rounded-lg bg-mint px-5 py-3 font-semibold text-ink
          transition hover:bg-emerald-200 disabled:opacity-40">
        {busy ? 'Evaluating scenario…' : 'Evaluate capture train'}
      </button>
    </section>
  );
}
