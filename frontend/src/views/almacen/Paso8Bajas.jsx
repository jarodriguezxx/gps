import React from 'react';
import { Upload, AlertTriangle, ClipboardList } from 'lucide-react';

const Paso8Bajas = ({ setActiveTab }) => {
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all placeholder:text-slate-300";

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Formulario de Baja ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <Upload className="text-[#7E1D3B]" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800">Registrar Baja de Consumibles</h2>
            <p className="text-xs text-slate-500">Paso 8 — Entradas y Salidas de Almacén</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800 leading-relaxed shrink-0">
          ⚠️ Toda salida de bienes del almacén debe efectuarse mediante el <strong>formato correspondiente</strong> y contener la <strong>firma de autorización</strong> del área solicitante — conforme al manual oficial.
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1 overflow-y-auto pr-2">
          <div>
            <label className={labelClass}>Folio de Baja</label>
            <input type="text" placeholder="BAJ-0090" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha y Hora de Salida</label>
            <input type="datetime-local" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Área Solicitante</label>
            <select className={inputClass}>
              <option>-- Seleccionar Área --</option>
              <option>Consulta Externa</option>
              <option>Internamiento / Hospitalización</option>
              <option>Farmacia Interna</option>
              <option>Cocina / Nutrición</option>
              <option>Trabajo Social</option>
              <option>Dirección / Administración</option>
              <option>Intendencia y Limpieza</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Responsable (Firma)</label>
            <input type="text" placeholder="Nombre de quien autoriza/recibe" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Insumo a Despachar</label>
            <select className={inputClass}>
              <option>Buprenorfina 8mg/2mg — 12 u. disponibles</option>
              <option>Metadona 10mg/mL — 5 frs. disponibles</option>
              <option>Naltrexona 50mg — 40 u. disponibles</option>
              <option>Vendas elásticas — 18 pzs disponibles</option>
              <option>Guantes látex M — 2 cajas disponibles</option>
              <option>Víveres quincena — OK</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Cantidad a Entregar</label>
            <input type="number" placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Unidad</label>
            <select className={inputClass}>
              <option>Tabletas</option>
              <option>Frascos</option>
              <option>Piezas</option>
              <option>Cajas</option>
              <option>Kits</option>
              <option>Raciones</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Motivo / Uso del Consumible</label>
            <select className={inputClass}>
              <option>Uso clínico — Tratamiento de paciente</option>
              <option>Consumo en área (material de curación)</option>
              <option>Consumo en cocina (víveres diarios)</option>
              <option>Uso administrativo (papelería/limpieza)</option>
              <option>Merma / Caducidad (baja por deterioro)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Observaciones</label>
            <textarea 
              rows="2" 
              placeholder="Número de paciente (si aplica), lote consumido, notas de la salida..." 
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>
        </div>

        {/* Verificación antes de despachar */}
        <div className="border-t border-slate-100 pt-5 mb-6 shrink-0">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Verificación Antes de Despachar</h3>
          <div className="space-y-2">
            {[
              'Formato de solicitud de salida firmado por el área',
              'Existencia verificada en inventario digital',
              'Cantidad solicitada disponible físicamente en almacén'
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <input type="checkbox" className="mt-0.5 w-4 h-4 text-[#7E1D3B] rounded border-slate-300 focus:ring-[#7E1D3B]" />
                <p className="text-sm text-slate-700 flex-1">{item}</p>
                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border text-slate-500 bg-white border-slate-200 shrink-0">Obligatorio</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 shrink-0">
          <button onClick={() => setActiveTab('dashboard')} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition shadow-sm text-center">
            Cancelar
          </button>
          <button onClick={() => setActiveTab('dashboard')} className="flex-[2] py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold text-sm hover:bg-[#63162e] transition shadow-sm text-center">
            📤 Registrar Baja y Despachar
          </button>
        </div>
      </div>

      {/* ── Panel Derecho: Solicitudes y Bajas ── */}
      <div className="flex flex-col gap-5">
        
        {/* Solicitudes Pendientes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Solicitudes Pendientes</h3>
          </div>
          
          <div className="p-5 flex flex-col gap-3">
            {/* Solicitud Urgente */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-rose-200 text-rose-700 font-black text-xs flex items-center justify-center shrink-0">!</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-800">Farmacia Interna — Buprenorfina 8mg</p>
                  <span className="px-2 py-1 bg-rose-200 text-rose-800 text-[9px] rounded-full font-bold uppercase shrink-0">Urgente</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Solicitante: Q.F. Ana Méndez · Tratamiento de pacientes activos · Stock crítico (12 u.)</p>
                <p className="text-xs font-black text-rose-700 mt-2">Cantidad: 20 u.</p>
              </div>
            </div>

            {/* Solicitud Normal */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-amber-200 text-amber-700 font-black text-xs flex items-center justify-center shrink-0">!</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-800">Consulta Externa — Material curación</p>
                  <span className="px-2 py-1 bg-amber-200 text-amber-800 text-[9px] rounded-full font-bold uppercase shrink-0">Normal</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Solicitante: Enfermería · Para atención del día</p>
                <p className="text-xs font-black text-amber-700 mt-2">Cantidad: 3 kits</p>
              </div>
            </div>

            {/* Solicitud Normal 2 */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center shrink-0">·</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-800">Cocina / Nutrición — Víveres del día</p>
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] rounded-full font-bold uppercase shrink-0">Normal</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">Solicitante: Nutrióloga · Raciones para pacientes internos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bajas Registradas Hoy */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <ClipboardList size={16} className="text-[#7E1D3B]" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Bajas Registradas Hoy</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Insumo</th>
                  <th className="px-4 py-3">Área</th>
                  <th className="px-4 py-3">Cant.</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-[#7E1D3B] text-xs">BAJ-0088</td>
                  <td className="px-4 py-3 text-slate-700 font-medium text-xs">Mat. curación</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">Consul. Externa</td>
                  <td className="px-4 py-3 font-mono font-bold text-rose-600 text-xs">-5 kits</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase whitespace-nowrap">Despachado</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-[#7E1D3B] text-xs">BAJ-0086</td>
                  <td className="px-4 py-3 text-slate-700 font-medium text-xs">Guantes látex M</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">Internamiento</td>
                  <td className="px-4 py-3 font-mono font-bold text-rose-600 text-xs">-3 cajas</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase whitespace-nowrap">Despachado</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-[#7E1D3B] text-xs">BAJ-0084</td>
                  <td className="px-4 py-3 text-slate-700 font-medium text-xs">Naltrexona 50mg</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">Farmacia Int.</td>
                  <td className="px-4 py-3 font-mono font-bold text-rose-600 text-xs">-10 u.</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase whitespace-nowrap">Despachado</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Paso8Bajas;