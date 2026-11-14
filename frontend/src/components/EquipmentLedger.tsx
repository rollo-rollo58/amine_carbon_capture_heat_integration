import type { Equipment } from '@/types/domain';

interface Props { equipment: Equipment[] }

export default function EquipmentLedger({ equipment }: Props) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h2 className="panel-title text-slate-300">Equipment qualification ledger</h2>
      </div>
      <div className="overflow-x-auto soft-scroll">
        <table className="w-full min-w-[580px] text-left text-xs">
          <thead className="bg-ink text-slate-400">
            <tr><th className="p-3">Tag</th><th className="p-3">Service</th>
              <th className="p-3">Pressure / bar</th><th className="p-3">Temp / °C</th></tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.tag} className="border-t border-line/70 hover:bg-white/5">
                <td className="p-3 font-mono text-mint">{item.tag}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3 font-mono">{item.design_pressure_bar.toFixed(1)}</td>
                <td className="p-3 font-mono">{item.design_temperature_c.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
