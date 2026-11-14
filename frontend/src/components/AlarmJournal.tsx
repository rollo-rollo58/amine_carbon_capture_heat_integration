import type { ScenarioOutput } from '@/types/domain';

interface Props { output: ScenarioOutput | null; message: string | null }

export default function AlarmJournal({ output, message }: Props) {
  const active = output?.alerts ?? [];
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="panel-title text-slate-300">Research alert journal</h2>
        <span className="font-mono text-xs text-rust">{active.length} OPEN</span>
      </div>
      {message && <p role="alert" className="mt-3 rounded bg-rust/10 p-3 text-xs text-rust">
        {message}
      </p>}
      <div className="mt-4 space-y-2">
        {active.length === 0 ? (
          <p className="rounded bg-mint/10 p-3 text-sm text-mint">
            No simulated envelope alerts for this scenario.
          </p>
        ) : active.map((alarm) => (
          <div key={alarm} className="flex items-center gap-3 rounded bg-rust/10 p-3">
            <span className="h-2 w-2 rounded-full bg-rust" />
            <span className="text-xs text-rust">{alarm.replaceAll('_', ' ')}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Research thresholds are illustrative; alarms are not operating instructions.
      </p>
    </section>
  );
}
