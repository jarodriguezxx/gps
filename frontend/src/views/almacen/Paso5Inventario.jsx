import React from 'react';
import { MonitorSmartphone, ArrowRight, RotateCcw } from 'lucide-react';

const Paso5Inventario = ({ setActiveTab }) => {
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all placeholder:text-slate-300";

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Formulario de Inventario ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <MonitorSmartphone className="text-[#7E1D3B]" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800">Registro en Inventario Digital</h2>
            <p className="text-xs text-slate-500">Paso 5 — Entradas y Salidas de Almacén</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-xs text-blue-800 leading-relaxed shrink-0">
          ℹ️ Se registra la mercancía recibida en el <strong>archivo de inventario digital</strong> para mantener actualizado el control de existencias del almacén.
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1 overflow-y-auto pr-2">
          <div>
            <label className={labelClass}>Entrada Ref.</label>
            <input type="text" placeholder="ENT-0089" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contra-recibo</label>
            <input type="text" placeholder="CR-2795" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre del Insumo (Genérico)</label>
            <input type="text" placeholder="Ej. Buprenorfina / Naloxona 8mg/2mg tableta sublingual" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Tipo de Consumible</label>
            <select className={inputClass}>
              <option>Medicamento</option>
              <option>Material de curación</option>
              <option>Víveres y alimentos</option>
              <option>Material de limpieza</option>
              <option>Papelería y útiles</option>
              <option>Equipo médico menor</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Cantidad Ingresada</label>
            <input type="number" placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Unidad</label>
            <select className={inputClass}>
              <option>Tabletas</option>
              <option>Frascos</option>
              <option>Cajas</option>
              <option>Piezas</option>
              <option>Kits</option>
              <option>Kilogramos</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Número de Lote</label>
            <input type="text" placeholder="Ej. BUP-2026-L03" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha de Caducidad</label>
            <input type="date" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Proveedor</label>
            <input type="text" placeholder="Nombre del proveedor" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Observaciones</label>
            <textarea 
              rows="2" 
              placeholder="Condición del producto, método de rotación (PEPS)..." 
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 shrink-0">
          <button className="flex items-center justify-center gap-2 flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition shadow-sm">
            <RotateCcw size={16} /> Limpiar
          </button>
          <button onClick={() => setActiveTab('paso6')} className="flex items-center justify-center gap-2 flex-[2] py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold text-sm hover:bg-[#63162e] transition shadow-sm">
            Registrado → Ubicar en Almacén <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Panel Derecho: Inventario Actual ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Inventario Actual</h3>
          <button className="text-xs font-bold text-[#7E1D3B] hover:bg-[#7E1D3B]/10 px-3 py-1.5 rounded-lg transition">
            Exportar
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Insumo</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Existencia</th>
                <th className="px-5 py-3">Lote</th>
                <th className="px-5 py-3">Cad.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-semibold text-slate-800 text-xs">Buprenorfina 8mg</td>
                <td className="px-5 py-3 text-slate-500 text-xs">Medicamento</td>
                <td className="px-5 py-3 font-mono font-bold text-emerald-600 text-xs">12 u.</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">BUP-L03</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">12/2028</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-semibold text-slate-800 text-xs">Metadona 10mg/mL</td>
                <td className="px-5 py-3 text-slate-500 text-xs">Medicamento</td>
                <td className="px-5 py-3 font-mono font-bold text-rose-600 text-xs">5 frs.</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">MET-L01</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">06/2027</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-semibold text-slate-800 text-xs">Naltrexona 50mg</td>
                <td className="px-5 py-3 text-slate-500 text-xs">Medicamento</td>
                <td className="px-5 py-3 font-mono font-bold text-emerald-600 text-xs">40 u.</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">NAL-L02</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">09/2027</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-semibold text-slate-800 text-xs">Vendas elásticas</td>
                <td className="px-5 py-3 text-slate-500 text-xs">Curación</td>
                <td className="px-5 py-3 font-mono font-bold text-amber-500 text-xs">18 pzs</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">—</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">—</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-semibold text-slate-800 text-xs">Guantes látex M</td>
                <td className="px-5 py-3 text-slate-500 text-xs">Curación</td>
                <td className="px-5 py-3 font-mono font-bold text-amber-500 text-xs">2 cajas</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">—</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">—</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-5 py-3 font-semibold text-slate-800 text-xs">Víveres quincena</td>
                <td className="px-5 py-3 text-slate-500 text-xs">Alimentos</td>
                <td className="px-5 py-3 font-mono font-bold text-emerald-600 text-xs">OK</td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">—</td>
                <td className="px-5 py-3 font-mono text-slate-500 text-xs">≥6m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Paso5Inventario;