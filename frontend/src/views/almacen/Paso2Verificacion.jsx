import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, CheckCircle, FileText, Loader2, Filter } from 'lucide-react';

// FÍJATE AQUÍ: Ahora usamos setArticulosParaInventario
const Paso2Verificacion = ({ setActiveTab, setArticulosParaInventario, recepcionActiva, setDatosIncidencia }) => {
  const [requisiciones, setRequisiciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reqSeleccionada, setReqSeleccionada] = useState(null);
  const [articulosVerificados, setArticulosVerificados] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const cargarRequisiciones = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/requisiciones');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          const activas = data.filter(r => 
            r.estado === 'AUTORIZADA' || r.estado === 'PRE-AUTORIZADA' || r.estado === 'PENDIENTE'
          );
          setRequisiciones(activas);
        }
      } catch (err) {
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    cargarRequisiciones();
  }, []);

  const requisicionesFiltradas = requisiciones.filter(r => 
    r.area.toLowerCase().includes(filtro.toLowerCase()) ||
    r.solicitante.toLowerCase().includes(filtro.toLowerCase()) ||
    r.id.toLowerCase().includes(filtro.toLowerCase())
  );

  const seleccionarRequisicion = (req) => {
    setReqSeleccionada(req);
    setArticulosVerificados([]);
  };

  const reportarIncidencia = () => {
    const todosLosArticulos = reqSeleccionada.articulos || [];
    const rechazados = todosLosArticulos.filter((_, idx) => !articulosVerificados.includes(idx));
    const listaFinal = rechazados.length > 0 ? rechazados : todosLosArticulos;

    if (typeof setDatosIncidencia === 'function') {
      setDatosIncidencia({
        articulosRechazados: listaFinal
      });
    }
    setActiveTab('paso3');
  };

  const toggleArticulo = (index) => {
    setArticulosVerificados(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // FUNCIÓN MAGICA: Prepara todos los artículos y los envía al Dashboard
  const confirmarYTransferir = () => {
    if (articulosVerificados.length === 0) return;
    
    // Verificamos que el componente padre nos haya pasado la función correcta
    if (typeof setArticulosParaInventario === 'function') {
      const listaDeArticulos = articulosVerificados.map(idx => {
        const art = reqSeleccionada.articulos[idx] || {};
        return {
          articuloNombre: art.articuloRequisitado || reqSeleccionada.justificacion || 'Insumo sin nombre',
          stock: parseInt(art.articulosSolicitados) || 1,
          unidad: art.unidad || 'PZA',
          categoria: 'Almacén General'
        };
      });
      
      console.log("📦 EMPACANDO EN PASO 2:", listaDeArticulos); // Chismoso para la consola
      setArticulosParaInventario(listaDeArticulos); // Mandamos la maleta al Padre
    } else {
      console.error("❌ ERROR: El Padre no me mandó setArticulosParaInventario");
    }
    
    setActiveTab('paso4');
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#7E1D3B]" />
            Verificación de Requisiciones
          </h2>
        </div>
        {recepcionActiva && (
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">Factura: {recepcionActiva.folio}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar área o folio..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none shadow-sm"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 pb-4 flex-1">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-72">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requisiciones en Espera</span>
              </div>
              <div className="overflow-y-auto p-2 space-y-2 flex-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Loader2 className="animate-spin w-6 h-6 mb-2" />
                  </div>
                ) : requisicionesFiltradas.length > 0 ? (
                  requisicionesFiltradas.map((req) => (
                    <button 
                      key={req.id}
                      onClick={() => seleccionarRequisicion(req)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        reqSeleccionada?.id === req.id 
                          ? 'bg-[#7E1D3B] border-[#7E1D3B] text-white shadow-md' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-[#7E1D3B]/30 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          reqSeleccionada?.id === req.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {req.area}
                        </span>
                        <span className="text-[9px] opacity-60">#{req.id.substring(0, 5)}</span>
                      </div>
                      <p className="text-xs font-bold leading-tight line-clamp-1 mt-1">
                        {req.justificacion || 'Insumos Generales'}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Filter className="w-6 h-6 text-slate-200 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Sin resultados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          {reqSeleccionada ? (
            <div className="flex flex-col h-full">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex justify-between items-end mb-6 border-b border-slate-50 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#7E1D3B] uppercase tracking-widest">Verificando artículos</span>
                    <h3 className="text-lg font-bold text-slate-800">{reqSeleccionada.area}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-300">
                      {articulosVerificados.length}<span className="text-sm text-slate-400">/{reqSeleccionada.articulos?.length || 1}</span>
                    </span>
                  </div>
                </div>

                <div className="grid gap-3">
                  {(reqSeleccionada.articulos || []).map((art, idx) => {
                    const verificado = articulosVerificados.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleArticulo(idx)}
                        className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                          verificado 
                            ? 'border-emerald-500 bg-emerald-50/50' 
                            : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            verificado ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-100'
                          }`}>
                            {verificado ? <CheckCircle className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                          </div>
                          <div className="text-left">
                            <p className={`text-sm font-bold ${verificado ? 'text-emerald-900' : 'text-slate-700'}`}>
                              {art.articuloRequisitado}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Solicitado: <span className="font-bold text-slate-700">{art.articulosSolicitados} {art.unidad}</span>
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={reportarIncidencia}
                  className="px-6 py-3 bg-white text-red-500 text-xs font-bold rounded-xl border border-red-100 hover:bg-red-50 transition-colors"
                >
                  Reportar Incidencia
                </button>
                <button 
                  onClick={confirmarYTransferir}
                  disabled={articulosVerificados.length === 0}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs shadow-lg transition-all ${
                    articulosVerificados.length > 0
                      ? 'bg-[#7E1D3B] text-white hover:shadow-[#7E1D3B]/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar y Cargar Inventario
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                <Search className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">Selecciona una requisición</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paso2Verificacion;