import type { ScenarioInput, ScenarioOutput } from '@/types/domain';

interface Props { inputs: ScenarioInput; output: ScenarioOutput | null }

export default function StripperSection({ inputs, output }: Props) {
  const temperature = inputs.stripper_temperature_c;
  const fraction = Math.min(100, ((temperature - 85) / 70) * 100);
  return (
    <section className="panel p-5">
      <h2 className="panel-title mb-4 text-slate-300">Regenerator / STR-201</h2>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <span className="text-sm text-slate-400">Stripper temperature</span>
        <strong className="font-mono text-xl text-rust">{temperature.toFixed(1)} °C</strong>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-ink">
        <div className="h-full rounded-full bg-rust" style={{ width: `${fraction}%` }} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-400">Reboiler duty</div>
          <div className="mt-1 font-mono text-lg text-white">
            {output?.reboiler_mw.toFixed(2) ?? '—'} MW
          </div>
        </div>
        <div>
          <div className="text-slate-400">Recovered heat</div>
          <div className="mt-1 font-mono text-lg text-mint">
            {output?.heat_recovered_mw.toFixed(2) ?? '—'} MW
          </div>
        </div>
      </div>
    </section>
  );
}
