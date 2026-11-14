import type { ScenarioInput, ScenarioOutput } from '@/types/domain';

interface Props { inputs: ScenarioInput; output: ScenarioOutput | null }

export default function AbsorberSection({ inputs, output }: Props) {
  const capture = output?.capture_percent ?? 0;
  return (
    <section className="panel p-5">
      <h2 className="panel-title mb-5 text-slate-300">Absorber / ABS-101</h2>
      <div className="flex items-center gap-6">
        <div className="relative h-48 w-20 rounded-2xl border-2 border-mint/50 bg-ink">
          <div className="absolute inset-x-1 bottom-1 rounded-xl bg-mint/20"
            style={{ height: `${Math.min(95, capture)}%` }} />
          {[20, 40, 60, 80].map((level) => (
            <div key={level} className="absolute inset-x-2 border-t border-dashed border-mint/40"
              style={{ bottom: `${level}%` }} />
          ))}
          <div className="absolute inset-0 flex items-center justify-center text-xs text-mint">
            {capture.toFixed(1)}%
          </div>
        </div>
        <dl className="flex-1 space-y-4 text-sm">
          <div><dt className="text-slate-400">Flue gas flow</dt>
            <dd className="font-mono text-white">{inputs.flue_gas_kmol_h.toLocaleString()} kmol/h</dd></div>
          <div><dt className="text-slate-400">CO₂ mole fraction</dt>
            <dd className="font-mono text-white">{(inputs.co2_mole_fraction * 100).toFixed(1)}%</dd></div>
          <div><dt className="text-slate-400">Lean/rich loading span</dt>
            <dd className="font-mono text-white">
              {(inputs.rich_loading - inputs.lean_loading).toFixed(3)} mol/mol
            </dd></div>
        </dl>
      </div>
    </section>
  );
}
