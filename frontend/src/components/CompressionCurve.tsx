import type { ScenarioInput, ScenarioOutput } from '@/types/domain';

interface Props { inputs: ScenarioInput; output: ScenarioOutput | null }

export default function CompressionCurve({ inputs, output }: Props) {
  const pressure = inputs.storage_pressure_bar;
  const heights = [0.17, 0.39, 0.66, 1].map((fraction) => 24 + pressure * fraction * 0.72);
  return (
    <section className="panel p-5">
      <h2 className="panel-title mb-3 text-slate-300">Compression train / CMP-501</h2>
      <svg viewBox="0 0 390 190" className="w-full" role="img">
        <title>Illustrative pressure increase across four compressor stages</title>
        {[1, 2, 3, 4].map((stage, index) => (
          <g key={stage}>
            <rect x={38 + index * 91} y={168 - heights[index]} width="47"
              height={heights[index]} fill="#87ebc1" opacity={0.25 + stage * 0.16} rx="4" />
            <text x={61 + index * 91} y="182" textAnchor="middle" fill="#a4c7bd"
              fontSize="11">ST{stage}</text>
            <text x={61 + index * 91} y={160 - heights[index]}
              textAnchor="middle" fill="#e3f6ee" fontSize="11">
              {(pressure * stage / 4).toFixed(0)}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-3 flex justify-between border-t border-line pt-3 text-xs">
        <span className="text-slate-400">Estimated compression power</span>
        <strong className="font-mono text-mint">{output?.compressor_mw.toFixed(2) ?? '—'} MW</strong>
      </div>
    </section>
  );
}
