import type { ScenarioOutput } from '@/types/domain';

interface Props { output: ScenarioOutput | null; ageDays: number }

export default function SolventHealthGauge({ output, ageDays }: Props) {
  const score = Math.min(1, output?.solvent_degradation_index ?? 0);
  const color = score > 0.55 ? '#e8a46a' : '#87ebc1';
  return (
    <section className="panel p-5">
      <h2 className="panel-title text-slate-300">Solvent exposure / research index</h2>
      <svg viewBox="0 0 270 150" className="mx-auto mt-3 w-full max-w-[280px]" role="img">
        <title>Solvent exposure radial gauge</title>
        <path d="M 43 125 A 92 92 0 0 1 227 125" fill="none" stroke="#2d4646"
          strokeWidth="19" strokeLinecap="round" />
        <path d="M 43 125 A 92 92 0 0 1 227 125" fill="none" stroke={color}
          strokeWidth="19" strokeLinecap="round" pathLength="100"
          strokeDasharray={`${score * 100} 100`} />
        <text x="135" y="104" textAnchor="middle" fill="#fff" fontSize="32">
          {(score * 100).toFixed(1)}
        </text>
        <text x="135" y="128" textAnchor="middle" fill="#9cbbb6" fontSize="11">
          INDEX / 100
        </text>
      </svg>
      <p className="text-center text-xs text-slate-400">
        Modeled exposure after {ageDays.toFixed(0)} service days; not a lab assay.
      </p>
    </section>
  );
}
