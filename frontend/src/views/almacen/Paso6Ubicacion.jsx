import React from 'react';
import { MapPin, ArrowRight, LayoutGrid } from 'lucide-react';

const Paso6Ubicacion = ({ setActiveTab }) => {
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all placeholder:text-slate-300";

  const areasAlmacen = [
    { 
      nombre: '💊 Medicamentos', 
      desc: 'Acceso controlado · Temperatura ambiente o refrigeración', 
      color: 'emerald' 
    },
    { 
      nombre: '🩹 Material de Curación', 
      desc: 'Gasas, vendas, guantes, jeringas', 
      color: 'slate' 
    },
    { 
      nombre: '🥗 Víveres y Alimentos', 
      desc: 'Caducidad mín. 6 meses al ingreso', 
      color: 'amber' 
    },
    { 
      nombre: '🧹 Limpieza y Papelería', 
      desc: 'Temperatura ambiente', 
      color: 'slate' 
    }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Formulario de Ubicación ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <MapPin className="text-[#7E1D3B]" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800">Asignación de Ubicación</h2>
            <p className="text-xs text-slate-500">Paso 6 — Entradas y Salidas de Almacén</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-xs text-blue-800 leading-relaxed shrink-0">
          ℹ️ Una vez recibido de conformidad, el bien se ubica en el <strong>área asignada dentro del almacén</strong> para su adecuado resguardo y conservación.
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 gap-4 mb-6 flex-1 overflow-y-auto pr-2">
          <div>
            <label className={labelClass}>Entrada / Insumo a Ubicar</label>
            <select className={inputClass}>
              <option>ENT-0089 — Buprenorfina 8mg/2mg</option>
              <option>ENT-0088 — Víveres quincena</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Área del Almacén</label>
            <select className={inputClass}>
              <option>Área de Medicamentos (acceso controlado)</option>
              <option>Área de Material de Curación</option>
              <option>Área de Víveres y Alimentos</option>
              <option>Área de Limpieza y Papelería</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Estante / Sección</label>
            <input type="text" placeholder="Ej. Estante A, Nivel 2" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Requiere Condición Especial</label>
            <select className={inputClass}>
              <option>No — Temperatura ambiente</option>
              <option>Sí — Refrigeración 2–8°C</option>
              <option>Sí — Acceso restringido (medicamento controlado)</option>
              <option>Sí — Refrigeración + Acceso restringido</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Observaciones de Almacenaje</label>
            <textarea 
              rows="3" 
              placeholder="Método de rotación (PEPS), condiciones especiales de conservación, notas de temperatura..." 
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-4 border-t border-slate-100 shrink-0 mt-auto">
          <button onClick={() => setActiveTab('paso7')} className="w-full flex items-center justify-center gap-2 py-3 bg-[#7E1D3B] text-white rounded-xl font-bold text-sm hover:bg-[#63162e] transition shadow-sm">
            Ubicado → Notificar a Rec. Materiales <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Panel Derecho: Áreas del Almacén ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <LayoutGrid size={16} className="text-[#7E1D3B]" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Zonas del Almacén</h3>
        </div>
        
        <div className="p-5 flex flex-col gap-3">
          {areasAlmacen.map((area, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition">
              <div className={`mt-0.5 h-3 w-3 rounded-full shrink-0 bg-${area.color}-500 shadow-sm ring-4 ring-${area.color}-100`}></div>
              <div>
                <p className="text-sm font-bold text-slate-800">{area.nombre}</p>
                <p className="text-xs text-slate-500 mt-1">{area.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            💡 Asegúrate de registrar las entradas aplicando el método <strong>PEPS (Primeras Entradas, Primeras Salidas)</strong> colocando la mercancía nueva detrás de la existente.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Paso6Ubicacion;