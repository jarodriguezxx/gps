import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft, Send, ClipboardX, Info, PackageX } from 'lucide-react';

const Paso3Devolucion = ({ setActiveTab, recepcionActiva, datosIncidencia }) => {
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Obtenemos la lista de artículos rechazados desde el objeto de incidencia
  const articulosParaDevolver = datosIncidencia?.articulosRechazados || [];

  const manejarDevolucion = async (e) => {
    e.preventDefault();
    setEnviando(true);
    
    try {
      // Simulación de guardado en la tabla incidencias_almacen de Neon
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Reporte generado con éxito para ${articulosParaDevolver.length} insumo(s).`);
      setActiveTab('dashboard'); 
    } catch (error) {
      alert("Error al registrar la incidencia.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-rose-100 bg-rose-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-rose-900">Paso 3: Registro de Devolución</h2>
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Inconsistencias Detectadas</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('paso2')}
          className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Regresar
        </button>
      </div>

      <div className="flex-1 p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto">
        {/* Lado Izquierdo: Lista de Insumos Inválidos */}
        <div className="lg:w-1/2 space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ClipboardX className="w-4 h-4" />
              Insumos que no corresponden
            </h3>
            
            {/* NUEVA: Lista dinámica de artículos rechazados */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {articulosParaDevolver.length > 0 ? (
                articulosParaDevolver.map((art, idx) => (
                  <div key={idx} className="p-3 bg-white border border-rose-100 rounded-xl flex items-center gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                      <PackageX className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{art.articuloRequisitado}</p>
                      <p className="text-[10px] text-slate-500">Cantidad reportada: {art.articulosSolicitados} {art.unidad}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-white border border-slate-200 rounded-xl text-center italic text-slate-400 text-xs">
                  No se seleccionaron artículos específicos.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Factura:</span>
                <span className="font-bold text-slate-700">{recepcionActiva?.folio || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Proveedor:</span>
                <span className="font-bold text-slate-700">{recepcionActiva?.proveedor || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>Nota Normativa Marakame:</strong> Este reporte será enviado a Recursos Materiales para la gestión de la nota de crédito o sustitución física del material.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Formulario de Reporte */}
        <div className="lg:w-1/2">
          <form onSubmit={manejarDevolucion} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
              Motivo General de la Devolución
            </label>
            <textarea 
              required
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explica brevemente por qué estos artículos no fueron aceptados (ej. caducidad, empaque dañado, no es el gramaje solicitado)..."
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none mb-6"
            />

            <button 
              type="submit"
              disabled={enviando || articulosParaDevolver.length === 0}
              className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold shadow-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {enviando ? 'Registrando...' : 'Confirmar Devolución'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Paso3Devolucion;