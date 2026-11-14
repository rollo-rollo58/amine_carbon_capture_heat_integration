import type { ScenarioInput, ScenarioOutput } from '@/types/domain';

interface Props { inputs: ScenarioInput; output: ScenarioOutput | null }

export default function HeatRecoveryPanel({ inputs, output }: Props) {
  const recovered = (inputs.heat_recovery_fraction * 100).toFixed(0);
  return (
    <section className="panel p-5">
      <h2 className="panel-title mb-3 text-slate-300">Thermal integration / HXR-301</h2>
      <div className="relative grid grid-cols-2 gap-3 py-3">
        <div className="rounded-lg border border-rust/40 bg-rust/10 p-4 text-center">
          <div className="text-xs text-rust">Hot side</div>
          <div className="mt-2 font-mono text-xl text-white">
            {output?.reboiler_mw.toFixed(1) ?? '—'} MW
          </div>
        </div>
        <div className="rounded-lg border border-mint/40 bg-mint/10 p-4 text-center">
          <div className="text-xs text-mint">Heat recovered</div>
          <div className="mt-2 font-mono text-xl text-white">
            {output?.heat_recovered_mw.toFixed(1) ?? '—'} MW
          </div>
        </div>
        <div className="col-span-2 h-3 overflow-hidden rounded-full bg-ink">
          <div className="h-full bg-mint" style={{ width: `${recovered}%` }} />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">
        Modeled heat recovery: <strong className="text-white">{recovered}%</strong>.
      </p>
    </section>
  );
}
