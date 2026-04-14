import React from 'react';
import { Inbox } from 'lucide-react';

const Paso1Recepcion = ({ setActiveTab }) => {
  // Clases CSS reutilizables para mantener el diseño uniforme
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all placeholder:text-slate-300";

  // Lógica para detectar si es jueves (Día de recepción oficial)
  const today = new Date();
  const isThursday = today.getDay() === 4; // 0 = Domingo, 4 = Jueves
  const dayName = today.toLocaleDateString('es-MX', { weekday: 'long' });

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Formulario de Recepción ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <Inbox className="text-[#7E1D3B]" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800">Registro de Recepción</h2>
            <p className="text-xs text-slate-500">Paso 1 — Entradas y Salidas de Almacén</p>
          </div>
        </div>

        {/* Alerta dinámica de día de recepción */}
        {!isThursday ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-xs text-rose-800 leading-relaxed shrink-0">
            ⛔ <strong>Hoy es {dayName}.</strong> El horario de recepción del almacén es únicamente los <strong>jueves de 9:00 a 14:00 hrs</strong> conforme al manual oficial.
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-xs text-emerald-800 leading-relaxed shrink-0">
            ✅ <strong>Hoy es jueves</strong> — Recepción habilitada de 9:00 a 14:00 hrs.
          </div>
        )}

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1 overflow-y-auto pr-2">
          <div>
            <label className={labelClass}>Folio de Entrada</label>
            <input type="text" placeholder="ENT-0090" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha y Hora de Recepción</label>
            <input type="datetime-local" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Proveedor</label>
            <input type="text" placeholder="Nombre o razón social del proveedor" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>No. de Factura</label>
            <input type="text" placeholder="Folio de la factura" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Monto Factura ($)</label>
            <input type="number" placeholder="0.00" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción General</label>
            <input type="text" placeholder="Tipo de bien o consumible recibido" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cantidad Recibida</label>
            <input type="number" placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Unidad de Medida</label>
            <select className={inputClass}>
              <option>Tabletas</option>
              <option>Frascos</option>
              <option>Cajas</option>
              <option>Piezas</option>
              <option>Kits</option>
              <option>Kilogramos</option>
              <option>Lotes</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Orden de Compra Ref.</label>
            <input type="text" placeholder="OC-023" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Requisición Ref.</label>
            <input type="text" placeholder="REQ-017" className={inputClass} />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 shrink-0">
          <button onClick={() => setActiveTab('dashboard')} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition text-center">
            Cancelar
          </button>
          <button onClick={() => setActiveTab('paso2')} className="flex-[2] py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold text-sm hover:bg-[#63162e] transition shadow-sm text-center">
            Continuar → Revisar vs Requisición
          </button>
        </div>
      </div>

      {/* ── Panel Derecho: Pedidos Recibidos ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pedidos Recibidos Esta Semana</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Folio</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3">Insumo</th>
                <th className="px-4 py-3">Factura</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0089</td>
                <td className="px-4 py-3 text-slate-600 text-xs">Farm. del Ahorro</td>
                <td className="px-4 py-3 text-slate-700 font-medium text-xs">Buprenorfina 8mg</td>
                <td className="px-4 py-3 font-mono text-slate-500 text-xs">FC-2318</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] rounded-full font-bold whitespace-nowrap">En revisión</span></td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0088</td>
                <td className="px-4 py-3 text-slate-600 text-xs">Prov. Nutrición</td>
                <td className="px-4 py-3 text-slate-700 font-medium text-xs">Víveres quincena</td>
                <td className="px-4 py-3 font-mono text-slate-500 text-xs">FC-2312</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] rounded-full font-bold whitespace-nowrap">En revisión</span></td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0087</td>
                <td className="px-4 py-3 text-slate-600 text-xs">Lab. Pisa S.A.</td>
                <td className="px-4 py-3 text-slate-700 font-medium text-xs">Mat. curación</td>
                <td className="px-4 py-3 font-mono text-slate-500 text-xs">NR-0044</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold whitespace-nowrap">Aceptado</span></td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-mono font-bold text-[#7E1D3B] text-xs">ENT-0085</td>
                <td className="px-4 py-3 text-slate-600 text-xs">Lab. Pisa S.A.</td>
                <td className="px-4 py-3 text-slate-700 font-medium text-xs">Metadona 10mg/mL</td>
                <td className="px-4 py-3 font-mono text-slate-500 text-xs">NR-0040</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-rose-100 text-rose-700 text-[9px] rounded-full font-bold whitespace-nowrap">Devuelto</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Paso1Recepcion;