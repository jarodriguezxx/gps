import React from 'react';
import { Bell, ArrowRight, FileCheck } from 'lucide-react';

const Paso7Notificacion = ({ setActiveTab }) => {
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all placeholder:text-slate-300";

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Formulario y Checklist ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <Bell className="text-[#7E1D3B]" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800">Notificación a Rec. Materiales</h2>
            <p className="text-xs text-slate-500">Paso 7 — Entradas y Salidas de Almacén</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-xs text-blue-800 leading-relaxed shrink-0">
          ℹ️ Se notifica al <strong>Encargado de Recursos Materiales</strong> la recepción de los consumibles y se entregan las <strong>facturas correspondientes</strong> para que continúen el proceso de pago a proveedores.
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
          <div className="md:col-span-2">
            <label className={labelClass}>Notificar Recepción de</label>
            <select className={inputClass}>
              <option>ENT-0089 — Buprenorfina 8mg — Farm. del Ahorro</option>
              <option>ENT-0088 — Víveres quincena — Prov. Nutrición</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Encargado Rec. Materiales</label>
            <input type="text" placeholder="Nombre de quien recibe" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha de Entrega Física</label>
            <input type="date" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>No. Contra-recibo Emitido</label>
            <input type="text" placeholder="CR-2795" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>No. Factura del Proveedor</label>
            <input type="text" placeholder="FC-2318" className={inputClass} />
          </div>
        </div>

        {/* Lista de Documentos a Entregar */}
        <div className="border-t border-slate-100 pt-5 mb-6 flex-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Documentos Físicos que se Entregan</h3>
          <div className="space-y-2">
            {[
              'Factura original del proveedor (sellada y firmada por almacén)',
              'Copia del contra-recibo emitido',
              'Copia de la requisición de referencia'
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <input type="checkbox" className="mt-0.5 w-4 h-4 text-[#7E1D3B] rounded border-slate-300 focus:ring-[#7E1D3B]" />
                <p className="text-sm text-slate-700 flex-1">{item}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-4 border-t border-slate-100 shrink-0 mt-auto">
          <button onClick={() => setActiveTab('paso8')} className="w-full flex items-center justify-center gap-2 py-3 bg-[#7E1D3B] text-white rounded-xl font-bold text-sm hover:bg-[#63162e] transition shadow-sm">
            Notificación Registrada → Ir a Bajas <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Panel Derecho: Notificaciones del Día ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <FileCheck size={16} className="text-[#7E1D3B]" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Notificaciones de Hoy</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Entrada</th>
                <th className="px-5 py-3">Insumo</th>
                <th className="px-5 py-3">CR Emitido</th>
                <th className="px-5 py-3">Factura</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0087</td>
                <td className="px-5 py-3 text-slate-600 font-medium text-xs">Mat. curación</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">CR-2794</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">NR-0044</td>
                <td className="px-5 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase whitespace-nowrap">Notificado</span></td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0083</td>
                <td className="px-5 py-3 text-slate-600 font-medium text-xs">Guantes látex</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">CR-2790</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">FC-2300</td>
                <td className="px-5 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase whitespace-nowrap">Notificado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-5 bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            💡 Es importante recabar la <strong>firma de acuse de recibo</strong> del personal de Recursos Materiales en tu copia del contra-recibo para amparar la entrega de las facturas originales.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Paso7Notificacion;