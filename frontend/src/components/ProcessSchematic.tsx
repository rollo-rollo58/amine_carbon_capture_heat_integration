'use client';

import { useState } from 'react';

type Node = { id: string; label: string; tag: string; x: number; y: number };

const NODES: Node[] = [
  { id: 'flue', label: 'FLUE GAS', tag: 'FG-001', x: 95, y: 180 },
  { id: 'absorber', label: 'ABSORBER', tag: 'ABS-101', x: 300, y: 180 },
  { id: 'stripper', label: 'STRIPPER', tag: 'STR-201', x: 520, y: 90 },
  { id: 'dryer', label: 'DRYER', tag: 'DRY-601', x: 720, y: 90 },
  { id: 'compressor', label: 'COMPRESSOR', tag: 'CMP-501', x: 910, y: 90 },
  { id: 'solvent', label: 'SOLVENT LOOP', tag: 'PMP-401', x: 520, y: 265 },
];

export default function ProcessSchematic() {
  const [focused, setFocused] = useState('absorber');
  const active = NODES.find((node) => node.id === focused);
  return (
    <section className="panel overflow-hidden p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="panel-title text-slate-200">Process topology / PFD-01</h2>
        <span className="text-xs text-mint">Click equipment to inspect</span>
      </div>
      <div className="overflow-x-auto soft-scroll">
        <svg viewBox="0 0 1060 335" className="min-w-[780px]" role="img">
          <title>Research carbon capture process flow diagram</title>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#87ebc1" />
            </marker>
          </defs>
          <path d="M 151 180 H 244 M 356 180 H 410 V 90 H 462"
            fill="none" stroke="#87ebc1" strokeWidth="3" markerEnd="url(#arrow)" />
          <path d="M 578 90 H 662 M 778 90 H 852"
            fill="none" stroke="#87ebc1" strokeWidth="3" markerEnd="url(#arrow)" />
          <path d="M 520 146 V 214 M 463 265 H 300 V 235"
            fill="none" stroke="#e8a46a" strokeWidth="3" strokeDasharray="9 7" />
          {NODES.map((node) => (
            <g key={node.id} tabIndex={0} role="button"
              aria-label={`Inspect ${node.label}`}
              onClick={() => setFocused(node.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') setFocused(node.id);
              }}>
              <rect x={node.x - 56} y={node.y - 31} width="112" height="62" rx="8"
                fill={focused === node.id ? '#245345' : '#183135'}
                stroke={focused === node.id ? '#87ebc1' : '#476568'} />
              <text x={node.x} y={node.y - 5} textAnchor="middle" fill="#e7f3ee"
                fontSize="11" fontWeight="700">{node.label}</text>
              <text x={node.x} y={node.y + 13} textAnchor="middle" fill="#9cbbb6"
                fontSize="10">{node.tag}</text>
            </g>
          ))}
          <text x="22" y="32" fill="#87ebc1" fontSize="12">CO₂ PRODUCT PATH</text>
          <text x="290" y="315" fill="#e8a46a" fontSize="12">CLOSED AMINE CIRCULATION</text>
        </svg>
      </div>
      <div className="mt-3 border-t border-line pt-3 text-sm text-slate-300">
        Selected: <strong className="text-mint">{active?.label}</strong>
        <span className="ml-3 font-mono text-xs text-slate-500">{active?.tag}</span>
      </div>
    </section>
  );
}
