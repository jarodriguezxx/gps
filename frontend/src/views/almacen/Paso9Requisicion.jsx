import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Send, Search, PackageSearch, Loader2, Sparkles, ShieldAlert, Package, Hash, AlertCircle, User } from 'lucide-react';

const Paso9Requisicion = ({ setActiveTab }) => {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [filtro, setFiltro] = useState('');

  // DATOS DE LA REQUISICIÓN
  const [solicitante, setSolicitante] = useState(''); 
  const [tipoRequisicion, setTipoRequisicion] = useState('Ordinaria'); 
  const [listaPedido, setListaPedido] = useState([]);

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/almacen/inventario');
        if (response.ok) {
          const data = await response.json();
          setInventario(data);
        }
      } catch (error) {
        console.error("Error al cargar inventario:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchInventario();
  }, []);

  const inventarioFiltrado = inventario.filter(item => {
    const nombreSeguro = (item.nombreArticulo || '').toLowerCase();
    const categoriaSegura = (item.categoria || '').toLowerCase();
    const busqueda = filtro.toLowerCase();
    
    return nombreSeguro.includes(busqueda) || categoriaSegura.includes(busqueda);
  });

  const determinarClasificacion = (articulo) => {
    const texto = `${articulo.categoria || ''} ${articulo.nombreArticulo || ''}`.toLowerCase();
    if (texto.includes('literatura') || texto.includes('medalla') || texto.includes('reactivo') || texto.includes('antidoping')) {
      return 'Extraordinaria';
    }
    return 'Ordinaria';
  };

  const agregarALista = (articulo) => {
    if (listaPedido.find(item => item.id === articulo.id)) return;

    const clasificacionArticulo = determinarClasificacion(articulo);

    if (listaPedido.length > 0) {
      if (tipoRequisicion !== clasificacionArticulo) {
        alert(`⛔ ACCIÓN DENEGADA:\n\nNo puedes mezclar compras Ordinarias con Extraordinarias.\n\nTu lista actual es de compras ${tipoRequisicion.toUpperCase()}S, pero intentas agregar un artículo de compra ${clasificacionArticulo.toUpperCase()}.`);
        return;
      }
    } else {
      setTipoRequisicion(clasificacionArticulo);
    }

    setListaPedido([...listaPedido, { 
      id: articulo.id, 
      articuloRequisitado: articulo.nombreArticulo, 
      cantidadSolicitada: 1, 
      unidad: articulo.unidadMedida,
      categoria: articulo.categoria,
      stockActual: articulo.cantidadDisponible,
      clasificacion: clasificacionArticulo 
    }]);
  };

  const removerDeLista = (id) => {
    const nuevaLista = listaPedido.filter(item => item.id !== id);
    setListaPedido(nuevaLista);
    if (nuevaLista.length === 0) setTipoRequisicion('Ordinaria');
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setListaPedido(listaPedido.map(item => 
      item.id === id ? { ...item, cantidadSolicitada: parseInt(nuevaCantidad) || 1 } : item
    ));
  };

  const autocompletarFaltantes = () => {
    const tipoAFiltrar = listaPedido.length > 0 ? tipoRequisicion : 'Ordinaria';
    
    const faltantes = inventario.filter(item => {
      const esCritico = (item.cantidadDisponible || 0) <= (item.nivelMinimoAlerta || 5);
      const esMismoTipo = determinarClasificacion(item) === tipoAFiltrar;
      return esCritico && esMismoTipo;
    });
    
    if (faltantes.length === 0) {
      alert(`No hay artículos de tipo ${tipoAFiltrar} en stock crítico actualmente.`);
      return;
    }

    setTipoRequisicion(tipoAFiltrar);
    const listaActualizada = [...listaPedido];
    
    faltantes.forEach(articulo => {
      if (!listaActualizada.find(item => item.id === articulo.id)) {
        listaActualizada.push({
          id: articulo.id,
          articuloRequisitado: articulo.nombreArticulo,
          cantidadSolicitada: Math.max(10, (articulo.nivelMinimoAlerta || 5) * 2),
          unidad: articulo.unidadMedida,
          categoria: articulo.categoria,
          stockActual: articulo.cantidadDisponible,
          clasificacion: tipoAFiltrar
        });
      }
    });

    setListaPedido(listaActualizada);
  };

  const enviarRequisicion = async (e) => {
    e.preventDefault();
    if (listaPedido.length === 0) {
      alert("Debes agregar al menos un artículo para solicitar.");
      return;
    }

    if (!solicitante.trim()) {
      alert("Por favor, ingresa el nombre del solicitante.");
      return;
    }

    setProcesando(true);

    try {
      const nuevaRequisicion = {
        area: "Almacén General",
        solicitante: solicitante.trim(),
        estado: "PENDIENTE",
        tamanio: "INDEFINIDO",
        // AQUÍ ESTÁ LA MAGIA: Convertimos a mayúsculas cerradas para que Java no se queje
        tipo: tipoRequisicion.toUpperCase(),     
        articulos: listaPedido.map(item => ({
          articuloRequisitado: item.articuloRequisitado,
          articulosSolicitados: item.cantidadSolicitada,
          unidad: item.unidad
        }))
      };

      const response = await fetch('http://localhost:4000/api/requisiciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaRequisicion)
      });

      if (!response.ok) throw new Error("No se pudo generar la requisición.");

      alert(`¡Requisición de tipo ${tipoRequisicion.toUpperCase()} enviada a Compras con éxito!`);
      setListaPedido([]);
      setSolicitante('');
      setTipoRequisicion('Ordinaria');
      if(setActiveTab) setActiveTab('dashboard');

    } catch (error) {
      console.error(error);
      alert("Error al enviar la requisición. Verifica la conexión con Java.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
      <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Generar Requisición de Resurtido
          </h2>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
            Módulo de Compras Institucionales
          </p>
        </div>
        <button 
          onClick={autocompletarFaltantes}
          className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> Auto-completar {listaPedido.length > 0 ? tipoRequisicion : 'Faltantes'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* COLUMNA IZQUIERDA: Buscador Detallado */}
        <div className="w-1/2 lg:w-5/12 border-r border-slate-100 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white shadow-sm z-10 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="Buscar por nombre o categoría..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                value={filtro} onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            
            {listaPedido.length > 0 && (
               <div className={`mt-3 p-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border ${tipoRequisicion === 'Ordinaria' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                 <ShieldAlert size={14}/>
                 Solo puedes agregar artículos de tipo {tipoRequisicion}
               </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar max-h-[450px]">
            {cargando ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-400" /></div>
            ) : inventarioFiltrado.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm font-medium">No se encontraron productos.</div>
            ) : inventarioFiltrado.map((item) => {
              const estaEnLista = listaPedido.some(lp => lp.id === item.id);
              const clasificacion = determinarClasificacion(item);
              const esBloqueado = listaPedido.length > 0 && tipoRequisicion !== clasificacion;
              const nivelMinimo = item.nivelMinimoAlerta || 5;
              const esCritico = (item.cantidadDisponible || 0) <= nivelMinimo;

              return (
                <div key={item.id} className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                  estaEnLista ? 'bg-indigo-50 border-indigo-200 opacity-60' : 
                  esBloqueado ? 'bg-slate-100 border-slate-200 opacity-40 grayscale cursor-not-allowed' : 
                  'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-black ${esBloqueado ? 'text-slate-400' : 'text-slate-800'}`}>{item.nombreArticulo || 'Sin Nombre'}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{item.categoria || 'Almacén General'}</p>
                    </div>
                    <button 
                      onClick={() => agregarALista(item)}
                      disabled={estaEnLista || esBloqueado}
                      className={`p-2 rounded-lg transition-colors shrink-0 ${
                        estaEnLista || esBloqueado ? 'bg-transparent text-slate-300' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md border ${
                      esCritico ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      <Package size={12}/> Stock: {item.cantidadDisponible || 0} / {nivelMinimo}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
                      <Hash size={12}/> {item.unidadMedida || 'Pza'}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-1 rounded uppercase border ml-auto ${clasificacion === 'Ordinaria' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                      {clasificacion}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario de Requisición */}
        <div className="w-1/2 lg:w-7/12 flex flex-col bg-white">
          <form onSubmit={enviarRequisicion} className="flex flex-col h-full">
            
            <div className="p-6 border-b border-slate-100 bg-white grid grid-cols-2 gap-6 shadow-sm z-10 shrink-0">
              
              {/* CAMPO DE SOLICITANTE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                   <User size={14}/> Solicitante
                </label>
                <input 
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-bold border-2 border-slate-200 text-slate-700 focus:border-indigo-400 bg-slate-50 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col justify-center">
                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                   <AlertCircle size={14}/> Clasificación Automática
                 </label>
                 <div className="flex gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase flex-1 text-center border ${
                      tipoRequisicion === 'Extraordinaria' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      Compra {tipoRequisicion}
                    </span>
                 </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar max-h-[350px]">
              <div className="flex justify-between items-end mb-4">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Artículos a Solicitar</h3>
                 <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{listaPedido.length} Ítems</span>
              </div>
              
              {listaPedido.length > 0 ? (
                <div className="space-y-3">
                  {listaPedido.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-300 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{item.articuloRequisitado}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                          {item.categoria || 'Almacén General'} • Stock Físico: {item.stockActual || 0}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <label className="text-[9px] font-bold text-indigo-600 uppercase mb-1">Cantidad a Pedir</label>
                          <div className="flex items-center border border-indigo-200 rounded-lg overflow-hidden bg-indigo-50/50">
                            <input 
                              type="number" min="1" required
                              value={item.cantidadSolicitada}
                              onChange={(e) => actualizarCantidad(item.id, e.target.value)}
                              className="w-16 text-center text-sm font-bold p-1 outline-none bg-transparent text-indigo-900"
                            />
                            <span className="px-2 text-xs text-indigo-600 font-black bg-indigo-100 border-l border-indigo-200 h-full flex items-center">
                              {item.unidad || 'Pza'}
                            </span>
                          </div>
                        </div>
                        <button type="button" onClick={() => removerDeLista(item.id)} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 pb-10 mt-10">
                  <PackageSearch className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium text-slate-400">No has agregado artículos al pedido.</p>
                  <p className="text-[10px] mt-2 max-w-xs text-center font-medium">Recuerda que no puedes mezclar compras ordinarias con extraordinarias en un mismo pedido.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 shadow-sm mt-auto shrink-0">
              <button 
                type="submit"
                disabled={procesando || listaPedido.length === 0 || !solicitante.trim()}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {procesando ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Emitir Solicitud a Compras</>}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Paso9Requisicion;