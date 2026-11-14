import type { ScenarioOutput } from '@/types/domain';

interface Props { result: ScenarioOutput | null }

export default function KpiRibbon({ result }: Props) {
  const metrics = [
    { name: 'CO₂ captured', value: result?.captured_co2_t_h, suffix: 't/h' },
    { name: 'Capture fraction', value: result?.capture_percent, suffix: '%' },
    { name: 'Net auxiliary energy', value: result?.net_energy_mw, suffix: 'MW' },
    { name: 'Energy intensity', value: result?.specific_energy_gj_t, suffix: 'GJ/t' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {metrics.map((metric) => (
        <section key={metric.name} className="panel px-5 py-4">
          <div className="text-xs uppercase tracking-wider text-slate-400">{metric.name}</div>
          <div className="mt-4 font-mono text-2xl font-semibold text-mint">
            {metric.value === undefined ? '—' : metric.value.toFixed(2)}
            <span className="ml-2 text-xs font-normal text-slate-400">{metric.suffix}</span>
          </div>
        </section>
      ))}
    </div>
  );
}
