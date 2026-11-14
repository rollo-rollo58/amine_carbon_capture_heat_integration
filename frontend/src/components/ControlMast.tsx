'use client';

interface Props {
  connection: 'connecting' | 'live' | 'offline';
  evaluated: string | null;
}

export default function ControlMast({ connection, evaluated }: Props) {
  const connectionColor = connection === 'live' ? 'bg-mint' : 'bg-rust';
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
      <div>
        <div className="mb-1 text-xs uppercase tracking-[0.34em] text-mint">
          CarbonLoop / Research Facility CL-01
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Amine Capture Control Room
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Experimental flow modelling — not connected to physical equipment.
        </p>
      </div>
      <div className="flex items-center gap-5 rounded-xl border border-line bg-panel px-5 py-3">
        <span className={`h-2.5 w-2.5 rounded-full ${connectionColor}`} />
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Telemetry {connection}
          </div>
          <div className="mt-1 text-xs text-white">
            {evaluated ? `Scenario ${evaluated.slice(0, 8)}` : 'Synthetic signals'}
          </div>
        </div>
      </div>
    </header>
  );
}
