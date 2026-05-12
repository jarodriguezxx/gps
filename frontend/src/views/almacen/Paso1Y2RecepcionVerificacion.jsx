import React, { useState, useEffect } from 'react';
import { Inbox, Search, Building2, FileText, Calendar, ThermometerSnowflake, CheckCircle2, ClipboardList, AlertCircle, ArrowRight, Package, Hash, Tag, AlertTriangle } from 'lucide-react';

const CATEGORIAS_INVENTARIO = [
  'Medicamentos',
  'Material de Curación',
  'Reactivos de Laboratorio',
  'Papelería y Oficina',
  'Aseo y Limpieza',
  'Alimentos y Cocina',
  'Literatura y Material Didáctico',
  'Mobiliario y Equipo'
];

const Paso1Y2RecepcionVerificacion = ({ setActiveTab, setRecepcionActiva, setArticulosParaInventario, setDatosIncidencia }) => {
  // --- ESTADOS DE FACTURA ---
  const [proveedor, setProveedor] = useState('');
  const [folio, setFolio] = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState(new Date().toISOString().split('T')[0]);
  
  const [proveedoresCertificados, setProveedoresCertificados] = useState([
    'Farmacéutica del Nayar',
    'Distribuidora Médica del Centro',
    'Insumos Hospitalarios S.A. de C.V.',
    'Papelería y Oficinas Marakame',
    'Laboratorios y Reactivos Especializados'
  ]);

  // --- ESTADOS DE REQUISICIÓN ---
  const [requisiciones, setRequisiciones] = useState([]);
  const [reqSeleccionada, setReqSeleccionada] = useState(null);
  const [articulosChecklist, setArticulosChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/requisiciones')
      .then(res => res.json())
      .then(data => {
        setRequisiciones(data.filter(r => r.estado === 'AUTORIZADA' || r.estado === 'PENDIENTE' || r.estado === 'INCOMPLETA'));
        setLoading(false);
      })
      .catch(err => console.error("Error cargando requisiciones:", err));

    fetch('http://localhost:4000/api/proveedores')
      .then(res => res.json())
      .then(data => {
        if(data && data.length > 0) setProveedoresCertificados(data.map(p => p.nombre || p.razonSocial));
      }).catch(() => console.log("Usando proveedores por defecto."));
  }, []);

  const seleccionarRequisicion = (req) => {
    setReqSeleccionada(req);
    const items = req.articulos.map(a => {
      const solicitados = parseInt(a.articulos_solicitados || a.articulosSolicitados || 0);
      const entregadosAnteriormente = parseInt(a.articulos_entregados || a.articulosEntregados || 0);
      const pendientes = a.articulos_pendientes !== undefined ? parseInt(a.articulos_pendientes) : (solicitados - entregadosAnteriormente);
      
      return { 
        ...a, 
        marcado: false,
        cantidadRecibida: pendientes,
        categoriaSeleccionada: '',
        cuidadosSeleccionados: 'Ninguno (Ambiente)',
        caducidadIndividual: '' // <-- NUEVO: Inicializamos la caducidad individual vacía
      };
    });
    setArticulosChecklist(items);
  };

  const toggleCheck = (index) => {
    const nuevos = [...articulosChecklist];
    nuevos[index].marcado = !nuevos[index].marcado;
    setArticulosChecklist(nuevos);
  };

  const actualizarCampoArticulo = (index, campo, valor) => {
    const nuevos = [...articulosChecklist];
    nuevos[index][campo] = valor;
    setArticulosChecklist(nuevos);
  };

  const articulosMarcados = articulosChecklist.filter(a => a.marcado);
  const totalRevisados = articulosMarcados.length;
  
  // --- LÓGICA DE ENTREGA PARCIAL / INCOMPLETA ---
  const hayArticulosSinMarcar = articulosChecklist.some(a => !a.marcado);
  const hayEntregasParciales = articulosMarcados.some(a => {
    const solicitados = parseInt(a.articulos_solicitados || a.articulosSolicitados || 0);
    const entregadosAnteriormente = parseInt(a.articulos_entregados || a.articulosEntregados || 0);
    const pendientes = a.articulos_pendientes !== undefined ? parseInt(a.articulos_pendientes) : (solicitados - entregadosAnteriormente);
    return parseInt(a.cantidadRecibida) < pendientes;
  });
  
  const esIncompleta = hayArticulosSinMarcar || hayEntregasParciales;

  // Validaciones: Se requiere categoría Y caducidad (si aplica)
  const categoriasCompletas = totalRevisados > 0 && articulosMarcados.every(a => a.categoriaSeleccionada !== '');
  const todoListo = categoriasCompletas && proveedor && folio;

  const procesarEntrada = async () => {
    setGuardando(true);

    try {
      const promesasUpdateArticulos = articulosMarcados.map(art => {
        const entregadosAnteriores = parseInt(art.articulos_entregados || art.articulosEntregados || 0);
        const entregadosNuevos = parseInt(art.cantidadRecibida || 0);
        const totalEntregadoHistorico = entregadosAnteriores + entregadosNuevos;

        return fetch(`http://localhost:4000/api/requisiciones/articulos/${art.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articulos_entregados: totalEntregadoHistorico 
          })
        }).then(res => {
          if (!res.ok) throw new Error(`Error en artículo ${art.id}`);
          return res.json();
        });
      });

      const nuevoEstado = esIncompleta ? 'INCOMPLETA' : 'RECIBIDA';

      const promesaEstadoReq = fetch(`http://localhost:4000/api/requisiciones/${reqSeleccionada.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      await Promise.all([...promesasUpdateArticulos, promesaEstadoReq]);

      const datosRecepcion = {
        proveedor, 
        folio, 
        fechaRecepcion, 
        requisicionId: reqSeleccionada.id,
        estadoFinal: nuevoEstado
      };
      setRecepcionActiva(datosRecepcion);

      // Enviamos la caducidad individual al inventario
      const articulosAceptados = articulosMarcados.map(a => ({
          articuloNombre: a.articuloRequisitado || a.articulo_requisitado,
          stock: parseInt(a.cantidadRecibida),
          unidad: a.unidad,
          categoria: a.categoriaSeleccionada,
          cuidadosEspeciales: a.cuidadosSeleccionados,
          caducidad: a.caducidadIndividual // <-- NUEVO: Pasamos la caducidad específica de este artículo
      }));
      
      setArticulosParaInventario(articulosAceptados);
      setActiveTab('paso4'); 

    } catch (error) {
      console.error("Error al procesar la entrada:", error);
      alert("Hubo un error al guardar. Verifica que el servidor Java esté aceptando los nuevos estados.");
    } finally {
      setGuardando(false);
    }
  };

  const reportarIncidencia = () => {
    setRecepcionActiva({ proveedor, folio });
    setDatosIncidencia({
        requisicionFolio: reqSeleccionada.id,
        articulosFaltantes: articulosChecklist.filter(a => !a.marcado)
    });
    setActiveTab('paso3');
  };

  return (
    <div className="flex flex-col bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      
      {/* CABECERA: FACTURA (Quité el campo de caducidad general porque ahora es individual) */}
      <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm z-10">
        <div>
          <label className="block text-[10px] font-black text-[#7E1D3B] uppercase mb-1">Proveedor Certificado</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <select 
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#7E1D3B] appearance-none" 
              value={proveedor} onChange={e => setProveedor(e.target.value)}
            >
              <option value="">Seleccionar proveedor...</option>
              {proveedoresCertificados.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-[#7E1D3B] uppercase mb-1">Folio Factura</label>
          <div className="relative">
            <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none focus:border-[#7E1D3B]" 
                   placeholder="FAC-000" value={folio} onChange={e => setFolio(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* COLUMNA IZQUIERDA: REQUISICIONES */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={14}/> Requisiciones Pendientes
            </h3>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar max-h-[380px]">
            {loading ? <div className="text-center py-10 font-bold text-slate-400">Cargando lista...</div> :
              requisiciones.map(req => {
                let totalEntregados = 0;
                let totalPendientes = 0;

                if (req.articulos) {
                  req.articulos.forEach(art => {
                    const solicitados = parseInt(art.articulos_solicitados || art.articulosSolicitados || 0);
                    const entregados = parseInt(art.articulos_entregados || art.articulosEntregados || 0);
                    const pendientes = art.articulos_pendientes !== undefined ? parseInt(art.articulos_pendientes) : (solicitados - entregados);
                    
                    totalEntregados += entregados;
                    totalPendientes += pendientes;
                  });
                }

                const esReqIncompleta = req.estado === 'INCOMPLETA';

                return (
                  <button key={req.id} onClick={() => seleccionarRequisicion(req)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      reqSeleccionada?.id === req.id 
                        ? 'bg-[#7E1D3B] border-[#7E1D3B] text-white shadow-lg scale-[1.02]' 
                        : 'bg-white border-slate-200 hover:border-[#7E1D3B]/30'
                    }`}>
                    
                    <div className="flex justify-between items-start">
                       <p className="text-[10px] font-black uppercase opacity-60">Área: {req.area}</p>
                       {esReqIncompleta && (
                          <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider animate-pulse border ${
                            reqSeleccionada?.id === req.id 
                              ? 'bg-white/20 text-white border-white/30' 
                              : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>
                            Entrega Parcial
                          </span>
                       )}
                    </div>
                    
                    <p className="text-sm font-black mt-1">Solicita: {req.solicitante}</p>
                    
                    <div className="flex justify-between items-center mt-3 mb-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${reqSeleccionada?.id === req.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>ID: {req.id.substring(0,8)}</span>
                      <span className="text-[9px] font-bold uppercase">{req.articulos.length} artículos</span>
                    </div>

                    {esReqIncompleta && (
                      <div className={`mt-3 grid grid-cols-2 gap-2 border-t pt-3 ${reqSeleccionada?.id === req.id ? 'border-white/20' : 'border-slate-100'}`}>
                        <div className={`rounded-lg p-2 flex flex-col items-center border ${
                          reqSeleccionada?.id === req.id ? 'bg-white/10 border-white/20 text-white' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        }`}>
                          <span className="text-[8px] uppercase font-black opacity-70">Ya Entraron</span>
                          <span className="text-lg font-black">{totalEntregados}</span>
                        </div>
                        <div className={`rounded-lg p-2 flex flex-col items-center border ${
                          reqSeleccionada?.id === req.id ? 'bg-black/20 border-black/20 text-white' : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                          <span className="text-[8px] uppercase font-black opacity-70">Faltan</span>
                          <span className="text-lg font-black">{totalPendientes}</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })
            }
          </div>
        </div>

        {/* COLUMNA DERECHA: CHECKLIST */}
        <div className="flex-1 flex flex-col bg-white">
          {reqSeleccionada ? (
            <>
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Verificar Entradas</h3>
                  <p className="text-xs text-slate-500 font-medium">Asigna cantidades, categoría, cuidados y caducidad</p>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-3">
                     {esIncompleta && articulosMarcados.length > 0 && (
                        <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md uppercase border border-amber-200 flex items-center gap-1 animate-pulse">
                           <AlertTriangle size={12}/> Recepción Incompleta
                        </span>
                     )}
                     <p className="text-2xl font-black text-[#7E1D3B]">{totalRevisados} / {articulosChecklist.length}</p>
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">En Revisión</p>
                </div>
              </div>

              <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar max-h-[380px]">
                {articulosChecklist.map((art, idx) => {
                  const cantSolicitada = parseInt(art.articulosSolicitados || art.articulos_solicitados || 0);
                  const entregadosAnteriormente = parseInt(art.articulos_entregados || art.articulosEntregados || 0);
                  const pendientesOriginales = art.articulos_pendientes !== undefined ? parseInt(art.articulos_pendientes) : (cantSolicitada - entregadosAnteriormente);
                  
                  const cantRecibida = parseInt(art.cantidadRecibida) || 0;
                  const faltantesFinales = pendientesOriginales - cantRecibida;
                  
                  const esParcial = cantRecibida < pendientesOriginales;
                  const yaEntregado = pendientesOriginales <= 0;

                  return (
                  <div key={idx} className={`rounded-2xl border-2 transition-all overflow-hidden ${
                    art.marcado ? 'bg-emerald-50/30 border-emerald-500 shadow-sm' : 
                    yaEntregado ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-100'
                  }`}>
                    
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => !yaEntregado && toggleCheck(idx)}>
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                          yaEntregado ? 'bg-slate-200 border-slate-300 text-slate-500' :
                          art.marcado ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-slate-50'
                        }`}>
                          {(art.marcado || yaEntregado) && <CheckCircle2 size={16} />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${art.marcado ? 'text-emerald-900' : yaEntregado ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                            {art.articuloRequisitado || art.articulo_requisitado}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-1">
                             {yaEntregado ? (
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Completado previamente</p>
                             ) : (
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                 Solicitado: <span className="text-slate-600">{cantSolicitada}</span> | 
                                 <span className="text-rose-500 font-black ml-1">Faltan: {pendientesOriginales} {art.unidad || 'Pza'}</span>
                               </p>
                             )}
                             
                             {art.marcado && esParcial && !yaEntregado && (
                               <span className="text-[9px] font-black text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 uppercase animate-pulse">
                                 Faltarán: {faltantesFinales}
                               </span>
                             )}
                          </div>
                        </div>
                      </div>
                      {art.marcado && <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-100 px-2 py-1 rounded">Desplegado ▼</span>}
                    </div>

                    {art.marcado && !yaEntregado && (
                      <div className="px-4 pb-4 pt-2 border-t border-emerald-100 bg-emerald-50/50 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                        
                        <div>
                          <label className={`block text-[9px] font-black uppercase mb-1.5 flex items-center gap-1 ${esParcial ? 'text-amber-600' : 'text-emerald-700'}`}>
                            <Hash size={12}/> Cantidad que Ingresa
                          </label>
                          <div className={`flex items-center bg-white border rounded-lg overflow-hidden focus-within:ring-2 ${esParcial ? 'border-amber-300 focus-within:ring-amber-500/20' : 'border-emerald-200 focus-within:ring-emerald-500/20'}`}>
                            <input 
                              type="number" min="0" max={pendientesOriginales}
                              value={art.cantidadRecibida}
                              onChange={(e) => actualizarCampoArticulo(idx, 'cantidadRecibida', e.target.value)}
                              className={`w-full p-2 text-sm font-black text-center outline-none ${esParcial ? 'text-amber-700' : 'text-emerald-900'}`}
                            />
                            <span className={`px-3 text-xs font-bold h-full flex items-center border-l ${esParcial ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                              {art.unidad || 'Pza'}
                            </span>
                          </div>
                        </div>

                        <div>
                           <label className="block text-[9px] font-black text-emerald-700 uppercase mb-1.5 flex items-center gap-1"><Tag size={12}/> Categoría</label>
                           <select 
                             className={`w-full p-2 bg-white border rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none ${
                               art.categoriaSeleccionada === '' ? 'border-rose-300 text-rose-500' : 'border-emerald-200 text-emerald-800'
                             }`}
                             value={art.categoriaSeleccionada}
                             onChange={(e) => actualizarCampoArticulo(idx, 'categoriaSeleccionada', e.target.value)}
                           >
                             <option value="" disabled>Requerida...</option>
                             {CATEGORIAS_INVENTARIO.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                           </select>
                        </div>

                        <div>
                           <label className="block text-[9px] font-black text-emerald-700 uppercase mb-1.5 flex items-center gap-1"><ThermometerSnowflake size={12}/> Cuidados Especiales</label>
                           <select 
                             className="w-full p-2 bg-white border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
                             value={art.cuidadosSeleccionados}
                             onChange={(e) => actualizarCampoArticulo(idx, 'cuidadosSeleccionados', e.target.value)}
                           >
                             <option>Ninguno (Ambiente)</option>
                             <option>Refrigeración (2-8°C)</option>
                             <option>Medicamento Controlado</option>
                           </select>
                        </div>

                        {/* === CAMPO NUEVO: CADUCIDAD INDIVIDUAL === */}
                        <div>
                          <label className="block text-[9px] font-black text-emerald-700 uppercase mb-1.5 flex items-center gap-1">
                            <Calendar size={12}/> Caducidad (Lote)
                          </label>
                          <input 
                            type="date"
                            className="w-full p-2 bg-white border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            value={art.caducidadIndividual}
                            onChange={(e) => actualizarCampoArticulo(idx, 'caducidadIndividual', e.target.value)}
                          />
                        </div>

                      </div>
                    )}
                  </div>
                )})}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-20">
              <ClipboardList size={60} className="mb-4 opacity-10" />
              <p className="text-lg font-bold">Selecciona una requisición de la izquierda</p>
              <p className="text-sm">Para comenzar el proceso de revisión física.</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center px-8 z-10 shrink-0">
        <button onClick={reportarIncidencia} disabled={!reqSeleccionada}
          className="px-6 py-3 bg-rose-50 text-rose-600 font-black rounded-xl text-xs hover:bg-rose-100 transition-all disabled:opacity-30 flex items-center gap-2">
          <AlertCircle size={16}/> Rechazar Factura por Faltante
        </button>

        <div className="flex items-center gap-4">
            {!todoListo && reqSeleccionada && (
              <p className="text-[10px] text-rose-500 font-black uppercase text-right leading-tight">
                Faltan datos de factura, <br/>seleccionar artículos o categorías
              </p>
            )}
            <button onClick={procesarEntrada} disabled={!todoListo || guardando}
            className={`px-10 py-3 rounded-xl font-black text-sm shadow-lg transition-all flex items-center gap-2 ${
                todoListo && !guardando ? 'bg-[#7E1D3B] text-white hover:scale-105' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}>
              {guardando ? 'Guardando...' : 'Guardar y Continuar'} <ArrowRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default Paso1Y2RecepcionVerificacion;