import type { ScenarioOutput } from '@/types/domain';

interface Props { output: ScenarioOutput | null }

export default function MaterialBalance({ output }: Props) {
  const total = output?.feed_co2_t_h ?? 0;
  const capturedShare = total > 0 ? (output?.captured_co2_t_h ?? 0) / total * 100 : 0;
  return (
    <section className="panel p-5">
      <h2 className="panel-title mb-5 text-slate-300">CO₂ mass balance</h2>
      <div className="flex h-9 overflow-hidden rounded-lg bg-ink">
        <div className="bg-mint" style={{ width: `${capturedShare}%` }} />
        <div className="flex-1 bg-rust" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        {[
          ['Input', output?.feed_co2_t_h, 'text-white'],
          ['Captured', output?.captured_co2_t_h, 'text-mint'],
          ['Emitted', output?.emitted_co2_t_h, 'text-rust'],
        ].map(([label, value, color]) => (
          <div key={String(label)}>
            <div className="text-xs text-slate-400">{label}</div>
            <div className={`mt-2 font-mono text-lg ${color}`}>
              {typeof value === 'number' ? value.toFixed(1) : '—'}
            </div>
            <div className="text-xs text-slate-500">t/h</div>
          </div>
        ))}
      </div>
    </section>
  );
}
