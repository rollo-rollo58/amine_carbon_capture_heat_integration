import type { ScenarioOutput } from '@/types/domain';

interface Props { result: ScenarioOutput | null }

export default function BalanceNarrative({ result }: Props) {
  if (!result) {
    return <section className="panel p-5 text-sm text-slate-400">
      Evaluate a scenario to inspect the conservation-law summary.
    </section>;
  }
  const mismatch = Math.abs(
    result.feed_co2_t_h - result.captured_co2_t_h - result.emitted_co2_t_h,
  );
  return (
    <section className="panel p-5">
      <h2 className="panel-title mb-4 text-slate-300">Balance reconciliation</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-400">Mass residual</div>
          <div className="mt-1 font-mono text-lg text-mint">{mismatch.toFixed(4)} t/h</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">Recoverable heat</div>
          <div className="mt-1 font-mono text-lg text-mint">
            {result.heat_recovered_mw.toFixed(2)} MW
          </div>
        </div>
      </div>
      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-slate-400">
        Captured carbon is defined as feed less emitted carbon. Thermal duty uses a
        bounded research coefficient; neither output is laboratory validated.
      </p>
    </section>
  );
}
