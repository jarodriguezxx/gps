import React from 'react';
import { Undo2, ArrowLeft } from 'lucide-react';

const Paso3Devolucion = ({ setActiveTab }) => {
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-900/30 focus:border-rose-900/50 transition-all placeholder:text-slate-300";

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Formulario de Devolución ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Undo2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Devolución al Proveedor</h2>
            <p className="text-xs text-slate-500">Paso 3a — No corresponde a Requisición</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-xs text-rose-800 leading-relaxed shrink-0">
          ❌ El pedido <strong>no cumple</strong> con las características descritas en la requisición. Los consumibles se devuelven al proveedor y el procedimiento termina para esta entrada.
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1 overflow-y-auto pr-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Entrada a Devolver</label>
            <select className={inputClass}>
              <option>ENT-0085 — Metadona 10mg/mL — Lab. Pisa</option>
              <option>ENT-0089 — Buprenorfina 8mg — Farm. del Ahorro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Fecha de Devolución</label>
            <input type="date" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Motivo Principal</label>
            <select className={inputClass}>
              <option>Tipo de bien incorrecto (no corresponde a requisición)</option>
              <option>Cantidad entregada incorrecta</option>
              <option>Presentación no corresponde a lo solicitado</option>
              <option>Empaque dañado o abierto</option>
              <option>Producto caducado o menos de 6 meses de vigencia</option>
              <option>Bien distinto al de la orden de compra</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción Detallada del Problema</label>
            <textarea 
              rows="3" 
              placeholder="Explicar detalladamente por qué se rechaza la mercancía..." 
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>
          <div>
            <label className={labelClass}>Representante Proveedor</label>
            <input type="text" placeholder="Nombre de quien recoge" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Factura Devuelta</label>
            <input type="text" placeholder="No. de factura" className={inputClass} />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-4 border-t border-slate-100 shrink-0 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition shadow-sm shadow-rose-600/20">
            <Undo2 size={16} /> Confirmar Devolución al Proveedor
          </button>
          <button onClick={() => setActiveTab('paso2')} className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition">
            <ArrowLeft size={16} /> Regresar a Verificación
          </button>
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 text-center">
          📌 <strong>TERMINA PROCEDIMIENTO</strong>. Se notificará automáticamente a Recursos Materiales para gestionar la reposición.
        </div>
      </div>

      {/* ── Panel Derecho: Devoluciones Registradas ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Historial de Devoluciones</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Entrada</th>
                <th className="px-5 py-3">Proveedor</th>
                <th className="px-5 py-3">Motivo</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0085</td>
                <td className="px-5 py-3 text-slate-600 text-xs">Lab. Pisa S.A.</td>
                <td className="px-5 py-3 text-rose-600 font-medium text-xs">Presentación incorrecta</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">Hoy</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0061</td>
                <td className="px-5 py-3 text-slate-600 text-xs">Prov. Nutrición</td>
                <td className="px-5 py-3 text-rose-600 font-medium text-xs">Caducidad &lt; 6 meses</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">12/03</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0042</td>
                <td className="px-5 py-3 text-slate-600 text-xs">Farm. del Ahorro</td>
                <td className="px-5 py-3 text-rose-600 font-medium text-xs">Cantidad incorrecta</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">15/02</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Paso3Devolucion;