import React from 'react';
import { Search } from 'lucide-react';

const Paso2Verificacion = ({ setActiveTab }) => {
  // Clases CSS reutilizables
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all placeholder:text-slate-300";

  // Lista de verificación (Checklist)
  const checklistItems = [
    { text: 'Tipo de bien correcto (corresponde a requisición)', req: 'Obligatorio' },
    { text: 'Cantidad entregada coincide con lo pedido', req: 'Obligatorio' },
    { text: 'Presentación correcta (tabletas / frascos / cajas)', req: 'Obligatorio' },
    { text: 'Condición del empaque: sin daños visibles', req: 'Obligatorio' },
    { text: 'Bienes son exactamente los de la orden de compra', req: 'Obligatorio' },
    { text: 'Fecha de caducidad ≥ 6 meses de vigencia', req: 'Alimentos' },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Verificación y Decisión ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <Search className="text-[#7E1D3B]" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800">Verificación vs Requisición</h2>
            <p className="text-xs text-slate-500">Paso 2 — Entradas y Salidas de Almacén</p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6 text-xs text-sky-800 leading-relaxed shrink-0">
          ℹ️ Se verifica que el bien entregado por el proveedor corresponda exactamente a lo solicitado en la requisición: <strong>tipo de bien, cantidad, presentación y condición del empaque</strong>.
        </div>

        {/* Selección de entrada */}
        <div className="grid grid-cols-1 gap-4 mb-6 shrink-0">
          <div>
            <label className={labelClass}>Entrada a Revisar</label>
            <select className={inputClass}>
              <option>ENT-0089 — Buprenorfina 8mg — Farm. del Ahorro</option>
              <option>ENT-0088 — Víveres quincena — Prov. Nutrición</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Requisición de Referencia</label>
            <input type="text" placeholder="Ej. REQ-017" className={inputClass} />
          </div>
        </div>

        {/* Lista de Verificación */}
        <div className="border-t border-slate-100 pt-5 mb-6 flex-1 overflow-y-auto pr-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Lista de Verificación — Inspección Visual</h3>
          <div className="space-y-2">
            {checklistItems.map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-[#7E1D3B]/30 hover:bg-[#7E1D3B]/5 cursor-pointer transition group">
                <input type="checkbox" className="mt-0.5 w-4 h-4 text-[#7E1D3B] rounded border-slate-300 focus:ring-[#7E1D3B]" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700 group-hover:text-slate-900 transition">{item.text}</p>
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border shrink-0 ${
                  item.req === 'Obligatorio' 
                    ? 'text-slate-500 bg-white border-slate-200' 
                    : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                  {item.req}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Decisiones Finales (Routing a otros pasos) ── */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shrink-0 mt-2">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
            ⚖️ ¿El pedido corresponde a la requisición?
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            {/* Opción SÍ */}
            <div className="p-4 text-center hover:bg-emerald-50 transition cursor-pointer group" onClick={() => setActiveTab('paso4')}>
              <p className="text-sm font-black text-emerald-600 mb-1">✅ SÍ CORRESPONDE</p>
              <p className="text-[10px] text-slate-500 mb-3 px-2">Recibir artículos y expedir contra-recibo.</p>
              <button className="w-full py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg group-hover:bg-emerald-200 transition shadow-sm">
                Ir a Contra-recibo →
              </button>
            </div>
            
            {/* Opción NO */}
            <div className="p-4 text-center hover:bg-rose-50 transition cursor-pointer group" onClick={() => setActiveTab('paso3')}>
              <p className="text-sm font-black text-rose-600 mb-1">❌ NO CORRESPONDE</p>
              <p className="text-[10px] text-slate-500 mb-3 px-2">Devolver por no cumplir con características.</p>
              <button className="w-full py-2 bg-rose-100 text-rose-700 text-xs font-bold rounded-lg group-hover:bg-rose-200 transition shadow-sm">
                Devolver Proveedor →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel Derecho: Historial de Revisiones ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Historial de Revisiones</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Entrada</th>
                <th className="px-5 py-3">Insumo</th>
                <th className="px-5 py-3">Resultado</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0087</td>
                <td className="px-5 py-3 text-slate-600 font-medium text-xs">Mat. curación</td>
                <td className="px-5 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase">Aceptado</span></td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">Hoy</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0085</td>
                <td className="px-5 py-3 text-slate-600 font-medium text-xs">Metadona 10mg/mL</td>
                <td className="px-5 py-3"><span className="px-2 py-1 bg-rose-100 text-rose-700 text-[9px] rounded-full font-bold uppercase">Devuelto</span></td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">Hoy</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0080</td>
                <td className="px-5 py-3 text-slate-600 font-medium text-xs">Guantes látex M</td>
                <td className="px-5 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase">Aceptado</span></td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">Jue 18/03</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0075</td>
                <td className="px-5 py-3 text-slate-600 font-medium text-xs">Víveres quincena</td>
                <td className="px-5 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase">Aceptado</span></td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">Jue 11/03</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Paso2Verificacion;