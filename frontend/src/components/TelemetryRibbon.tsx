'use client';

import type { Telemetry } from '@/types/domain';

interface Props { samples: Telemetry[] }

export default function TelemetryRibbon({ samples }: Props) {
  const path = samples.map((sample, index) => {
    const x = 5 + index * 8.5;
    const y = 82 - sample.capture_percent * 0.60;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="panel-title text-slate-300">Capture trend / live synthetic feed</h2>
        <div className="text-xs text-slate-500">{samples.length} recent samples</div>
      </div>
      <svg viewBox="0 0 365 100" className="mt-4 h-32 w-full" role="img">
        <title>Latest synthetic capture efficiency trend</title>
        {[20, 50, 80].map((y) => <line key={y} x1="0" x2="365" y1={y} y2={y}
          stroke="#375251" strokeDasharray="3 6" />)}
        <path d={path} fill="none" stroke="#87ebc1" strokeWidth="2.4"
          strokeLinejoin="round" />
      </svg>
    </section>
  );
}
