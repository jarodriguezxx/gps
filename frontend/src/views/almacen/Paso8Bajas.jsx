import React, { useState, useEffect } from 'react';
import { PackageMinus, Search, Plus, Trash2, Building, ArrowRight, ClipboardList, AlertCircle, Loader2 } from 'lucide-react';

const Paso8Bajas = ({ setActiveTab }) => {
  // Ahora inicia vacío, esperando la base de datos
  const [inventario, setInventario] = useState([]);
  const [cargandoInventario, setCargandoInventario] = useState(true);

  const [filtro, setFiltro] = useState('');
  const [areaDestino, setAreaDestino] = useState('');
  const [quienRecibe, setQuienRecibe] = useState('');
  
  const [listaSalida, setListaSalida] = useState([]);
  const [procesando, setProcesando] = useState(false);

  // NUEVO: Cargar el inventario real al abrir la pantalla
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/almacen/inventario');
        if (response.ok) {
          const data = await response.json();
          // ACTUALIZADO: Usamos cantidadDisponible en lugar de stock
          setInventario(data.filter(item => item.cantidadDisponible > 0));
        }
      } catch (error) {
        console.error("Error al cargar inventario real:", error);
      } finally {
        setCargandoInventario(false);
      }
    };
    fetchInventario();
  }, []);

  // ACTUALIZADO: Usamos nombreArticulo
  const inventarioFiltrado = inventario.filter(item => 
    item.nombreArticulo?.toLowerCase().includes(filtro.toLowerCase()) ||
    item.categoria?.toLowerCase().includes(filtro.toLowerCase())
  );

  const agregarALista = (articulo) => {
    if (listaSalida.find(item => item.id === articulo.id)) return;
    setListaSalida([...listaSalida, { ...articulo, cantidadSalida: 1 }]);
  };

  const removerDeLista = (id) => {
    setListaSalida(listaSalida.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad) || 0;
    setListaSalida(listaSalida.map(item => {
      if (item.id === id) {
        // ACTUALIZADO: Usamos cantidadDisponible
        const cantFinal = cantidad > item.cantidadDisponible ? item.cantidadDisponible : cantidad;
        return { ...item, cantidadSalida: cantFinal };
      }
      return item;
    }));
  };

  const ejecutarBaja = async (e) => {
    e.preventDefault();
    if (listaSalida.length === 0) {
      alert("Debes agregar al menos un artículo para registrar la salida.");
      return;
    }
    
    setProcesando(true);
    
    try {
      // Ajustamos los nombres para el backend (Java SalidaAlmacen espera articuloNombre)
      const salidasParaBackend = listaSalida.map(item => ({
        articuloNombre: item.nombreArticulo, 
        cantidad: item.cantidadSalida,
        areaDestino: areaDestino,
        quienRecibe: quienRecibe
      }));

      const response = await fetch('http://localhost:4000/api/almacen/salidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salidasParaBackend)
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg);
      }

      alert(`Salida registrada con éxito. Se actualizó el inventario.`);
      setListaSalida([]);
      setAreaDestino('');
      setQuienRecibe('');
      setActiveTab('dashboard'); // Regresa al inicio para ver las stats actualizadas
      
    } catch (error) {
      console.error("Fallo:", error);
      alert(error.message || "No se pudo conectar con la base de datos.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-orange-100 bg-orange-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2">
            <PackageMinus className="w-5 h-5" />
            Paso 8: Baja de Consumibles
          </h2>
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">
            Salida de Almacén a Departamentos
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* COLUMNA IZQUIERDA: Buscador de Inventario */}
        <div className="w-1/2 lg:w-5/12 border-r border-slate-100 flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar en inventario (ej: Cloro, Jeringa)..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none shadow-sm transition-all"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {inventarioFiltrado.map((item) => {
              const estaEnLista = listaSalida.some(ls => ls.id === item.id);
              return (
                <div key={item.id} className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                  estaEnLista ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-orange-300'
                }`}>
                  <div>
                    {/* ACTUALIZADO: item.nombreArticulo */}
                    <p className="text-sm font-bold text-slate-700">{item.nombreArticulo}</p>
                    <div className="flex gap-3 mt-1">
                      {/* ACTUALIZADO: item.cantidadDisponible y item.unidadMedida */}
                      <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        Stock: {item.cantidadDisponible} {item.unidadMedida}
                      </span>
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded uppercase">
                        {item.categoria}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => agregarALista(item)}
                    disabled={estaEnLista || item.cantidadDisponible === 0}
                    className={`p-2 rounded-lg transition-colors ${
                      estaEnLista || item.cantidadDisponible === 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
            
            {inventarioFiltrado.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <p className="text-xs font-bold uppercase tracking-widest">No hay coincidencias</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario de Salida */}
        <div className="w-1/2 lg:w-7/12 flex flex-col bg-white">
          <form onSubmit={ejecutarBaja} className="flex flex-col h-full">
            
            {/* Datos de Entrega */}
            <div className="p-6 border-b border-slate-100 bg-white grid grid-cols-2 gap-4 shadow-sm z-10">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Building className="w-3 h-3" /> Área Destino
                </label>
                <select 
                  required
                  value={areaDestino}
                  onChange={(e) => setAreaDestino(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                >
                  <option value="">Seleccione un área...</option>
                  <option value="Médico / Enfermería">Médico / Enfermería</option>
                  <option value="Cocina / Comedor">Cocina / Comedor</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Administración">Administración</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <ClipboardList className="w-3 h-3" /> Nombre de quien recibe
                </label>
                <input 
                  required
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={quienRecibe}
                  onChange={(e) => setQuienRecibe(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>
            </div>

            {/* Lista de Artículos a entregar (Carrito) */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Lista de Artículos a Entregar
              </h3>
              
              {listaSalida.length > 0 ? (
                <div className="space-y-3">
                  {listaSalida.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                      <div className="flex-1">
                        {/* ACTUALIZADO: item.nombreArticulo */}
                        <p className="text-sm font-bold text-slate-800">{item.nombreArticulo}</p>
                        {/* ACTUALIZADO: item.cantidadDisponible y item.unidadMedida */}
                        <p className="text-[10px] text-slate-500 mt-1">Disponible: {item.cantidadDisponible} {item.unidadMedida}</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {/* Selector de Cantidad */}
                        <div className="flex flex-col items-end">
                          <label className="text-[9px] font-bold text-slate-400 uppercase mb-1">Cantidad salida</label>
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <input 
                              type="number"
                              min="1"
                              max={item.cantidadDisponible} // ACTUALIZADO
                              value={item.cantidadSalida}
                              onChange={(e) => actualizarCantidad(item.id, e.target.value)}
                              className="w-16 text-center text-sm font-bold p-1 outline-none bg-transparent"
                            />
                            <span className="px-2 text-xs text-slate-500 font-medium bg-slate-100 border-l border-slate-200 h-full flex items-center">
                              {item.unidadMedida /* ACTUALIZADO */}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={() => removerDeLista(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 pb-10">
                  <PackageMinus className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No se han agregado artículos a la salida.</p>
                  <p className="text-[10px] uppercase tracking-wider mt-2">Busca y selecciona artículos en el panel izquierdo.</p>
                </div>
              )}
            </div>

            {/* Botón de Confirmación */}
            <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              {listaSalida.length > 0 && (
                <div className="mb-3 flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-tight font-medium">
                    Al confirmar, estos insumos se descontarán del inventario y se generará un vale de salida firmado por <strong>{quienRecibe || 'el receptor'}</strong>.
                  </p>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={procesando || listaSalida.length === 0 || !areaDestino || !quienRecibe}
                className="w-full py-3.5 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {procesando ? 'Procesando salida...' : (
                  <>
                    Autorizar Salida de Almacén
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Paso8Bajas;