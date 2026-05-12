import React, { useState } from 'react';
import { Inbox, Building2, FileText, Calendar, ThermometerSnowflake, ArrowRight, Package, Hash, Scale, AlignLeft } from 'lucide-react';

const Paso1Recepcion = ({ setActiveTab, setRecepcionActiva }) => {
  // Datos del Proveedor
  const [proveedor, setProveedor] = useState('');
  const [folio, setFolio] = useState('');
  
  // NUEVO: Detalles de la Recepción
  const [cantidadRecibida, setCantidadRecibida] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('Caja(s)');
  const [descripcionRapida, setDescripcionRapida] = useState('');

  // Especificaciones del Lote
  const [fechaRecepcion, setFechaRecepcion] = useState(new Date().toISOString().split('T')[0]);
  const [caducidad, setCaducidad] = useState('');
  const [cuidadosEspeciales, setCuidadosEspeciales] = useState('Ninguno (Temp. Ambiente)');

  const iniciarRecepcion = (e) => {
    e.preventDefault();
    
    // Guardamos TODA la información en la "maleta" del componente padre
    setRecepcionActiva({
      proveedor,
      folio,
      cantidadRecibida, // <-- Nuevo
      unidadMedida,     // <-- Nuevo
      descripcionRapida,// <-- Nuevo
      fechaRecepcion,
      caducidad,
      cuidadosEspeciales
    });
    
    setActiveTab('paso2');
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <Inbox className="w-5 h-5 text-[#7E1D3B]" />
        <div>
          <h2 className="text-lg font-bold text-slate-800">Paso 1: Recepción de Mercancía</h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Captura de Factura y Lote</p>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center bg-slate-50/30">
        <form onSubmit={iniciarRecepcion} className="w-full max-w-3xl bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
          
          {/* SECCIÓN 1: PROVEEDOR */}
          <h3 className="text-sm font-black text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7E1D3B]" /> Datos del Proveedor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" /> Nombre del Proveedor
              </label>
              <input 
                type="text" required placeholder="Ej. Farmacéutica del Nayar"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all"
                value={proveedor} onChange={(e) => setProveedor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Folio de Factura / Remisión
              </label>
              <input 
                type="text" required placeholder="Ej. FAC-8923"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all font-mono uppercase"
                value={folio} onChange={(e) => setFolio(e.target.value)}
              />
            </div>
          </div>

          {/* SECCIÓN 2: DETALLES DE LA RECEPCIÓN (NUEVO) */}
          <h3 className="text-sm font-black text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" /> Bultos y Cantidades Físicas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Hash className="w-3 h-3" /> Cantidad Recibida
              </label>
              <input 
                type="number" min="1" required placeholder="Ej. 15"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all"
                value={cantidadRecibida} onChange={(e) => setCantidadRecibida(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Scale className="w-3 h-3" /> Unidad de Medida
              </label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all font-medium"
                value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)}
              >
                <option value="Caja(s)">Caja(s)</option>
                <option value="Paquete(s)">Paquete(s)</option>
                <option value="Pieza(s)">Pieza(s)</option>
                <option value="Pallet(s)">Pallet(s)</option>
                <option value="Galón(es)">Galón(es)</option>
                <option value="Bolsa(s)">Bolsa(s)</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <AlignLeft className="w-3 h-3" /> Descripción Rápida / Observaciones
            </label>
            <textarea 
              rows="2" required placeholder="Ej. 5 cajas de jeringas, 2 galones de cloro y 1 paquete de gasas..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all resize-none"
              value={descripcionRapida} onChange={(e) => setDescripcionRapida(e.target.value)}
            />
          </div>

          {/* SECCIÓN 3: ESPECIFICACIONES DEL LOTE */}
          <h3 className="text-sm font-black text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ThermometerSnowflake className="w-4 h-4 text-blue-500" /> Especificaciones de Almacenaje
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Fecha Recepción
              </label>
              <input 
                type="date" required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all"
                value={fechaRecepcion} onChange={(e) => setFechaRecepcion(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-rose-500" /> Fecha Caducidad
              </label>
              <input 
                type="date" required
                className="w-full p-3 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                value={caducidad} onChange={(e) => setCaducidad(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <ThermometerSnowflake className="w-3 h-3 text-blue-500" /> Cuidados Especiales
              </label>
              <select 
                className="w-full p-3 bg-blue-50 border border-blue-200 text-blue-800 font-bold rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                value={cuidadosEspeciales} onChange={(e) => setCuidadosEspeciales(e.target.value)}
              >
                <option value="Ninguno (Temp. Ambiente)">Ninguno (Temp. Ambiente)</option>
                <option value="Refrigeración (Red de Frío)">Refrigeración (Red de Frío)</option>
                <option value="Medicamento Controlado">Medicamento Controlado</option>
                <option value="Material Frágil">Material Frágil</option>
                <option value="Proteger de la Luz">Proteger de la Luz</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="px-8 py-3.5 bg-[#7E1D3B] text-white font-bold rounded-xl shadow-lg shadow-[#7E1D3B]/20 hover:bg-[#63162e] transition-all flex items-center gap-2"
            >
              Continuar a Verificación <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Paso1Recepcion;