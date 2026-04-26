import React, { useState, useEffect } from 'react';
import { MapPin, Search, PackageSearch, Layers, CheckCircle2, Loader2, Archive } from 'lucide-react';

const Paso5Ubicacion = ({ setActiveTab }) => {
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  const [filtro, setFiltro] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  
  // VARIABLES ACTUALIZADAS a los nombres de la nueva base de datos
  const [zonaAlmacen, setZonaAlmacen] = useState('');
  const [estante, setEstante] = useState('');

  const cargarInventario = async () => {
    try {
      setCargando(true);
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

  useEffect(() => {
    cargarInventario();
  }, []);

  const seleccionarArticulo = (item) => {
    setArticuloSeleccionado(item);
    setZonaAlmacen(item.zonaAlmacen || '');
    setEstante(item.estante || '');
  };

  const guardarUbicacion = async (e) => {
    e.preventDefault();
    if (!zonaAlmacen || !estante) {
      alert("Debes seleccionar una Zona y un Estante.");
      return;
    }

    setGuardando(true);
    try {
      // Enviamos el objeto con los nombres exactos que espera Java
      const response = await fetch(`http://localhost:4000/api/almacen/inventario/${articuloSeleccionado.id}/ubicacion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zonaAlmacen, estante })
      });

      if (!response.ok) throw new Error("Error al guardar la ubicación");

      // Actualizamos la lista visual al instante
      setInventario(inventario.map(item => 
        item.id === articuloSeleccionado.id ? { ...item, zonaAlmacen, estante } : item
      ));
      
      alert(`¡Ubicación guardada! El insumo ahora está en la Zona ${zonaAlmacen}, Estante ${estante}.`);
      setArticuloSeleccionado(null);
      setZonaAlmacen('');
      setEstante('');

    } catch (error) {
      console.error(error);
      alert("No se pudo guardar. Verifica la conexión.");
    } finally {
      setGuardando(false);
    }
  };

  // BUSCADOR ACTUALIZADO: Busca por nombreArticulo
  const inventarioFiltrado = inventario.filter(item => 
    item.nombreArticulo?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#7E1D3B]" />
          Paso 5: Ubicación Física en Almacén
        </h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* COLUMNA IZQUIERDA: Lista de Insumos */}
        <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="Buscar insumo a ubicar..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#7E1D3B] transition-colors"
                value={filtro} onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-2">
            {cargando ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : (
              inventarioFiltrado.map((item) => {
                // ACTUALIZADO: Comprueba si falta la zona o el estante
                const necesitaUbicacion = !item.zonaAlmacen || !item.estante;
                
                return (
                  <button 
                    key={item.id} onClick={() => seleccionarArticulo(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      articuloSeleccionado?.id === item.id 
                        ? 'bg-[#7E1D3B] border-[#7E1D3B] text-white shadow-md' 
                        : 'bg-white border-slate-200 hover:border-[#7E1D3B]/30 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-xs font-bold line-clamp-1 ${articuloSeleccionado?.id === item.id ? 'text-white' : 'text-slate-800'}`}>
                        {item.nombreArticulo}
                      </p>
                      {necesitaUbicacion && <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1"></div>}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${articuloSeleccionado?.id === item.id ? 'text-white/70' : 'text-slate-400'}`}>
                        Stock: {item.cantidadDisponible} {item.unidadMedida}
                      </span>
                      {!necesitaUbicacion ? (
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${articuloSeleccionado?.id === item.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                          {item.zonaAlmacen}-{item.estante}
                        </span>
                      ) : (
                         <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${articuloSeleccionado?.id === item.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                          Sin asignar
                        </span>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Panel de Acomodo */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {articuloSeleccionado ? (
            <div className="p-8 h-full flex flex-col max-w-2xl mx-auto w-full">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex gap-4 items-center">
                <div className="w-14 h-14 bg-[#7E1D3B]/10 rounded-xl flex items-center justify-center text-[#7E1D3B]">
                  <Archive className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asignando lugar a:</p>
                  <h3 className="text-xl font-bold text-slate-800">{articuloSeleccionado.nombreArticulo}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{articuloSeleccionado.cantidadDisponible} unidades en existencia</p>
                </div>
              </div>

              <form onSubmit={guardarUbicacion} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  
                  {/* Selector de Zona */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-500" /> Zona / Pasillo
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['A', 'B', 'C', 'D', 'E', 'F'].map(letra => (
                        <button
                          key={letra} type="button"
                          onClick={() => setZonaAlmacen(letra)}
                          className={`py-3 rounded-xl text-lg font-black border-2 transition-all ${
                            zonaAlmacen === letra 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-slate-100 bg-white text-slate-400 hover:border-blue-200'
                          }`}
                        >
                          {letra}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selector de Estante */}
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-500" /> Nivel de Estante
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['1', '2', '3', '4'].map(num => (
                        <button
                          key={num} type="button"
                          onClick={() => setEstante(num)}
                          className={`py-3 rounded-xl text-lg font-black border-2 transition-all ${
                            estante === num 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                              : 'border-slate-100 bg-white text-slate-400 hover:border-emerald-200'
                          }`}
                        >
                          Nivel {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={guardando || !zonaAlmacen || !estante}
                    className="w-full py-4 bg-[#7E1D3B] text-white font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:bg-[#63162e]"
                  >
                    {guardando ? <Loader2 className="animate-spin" /> : <>Confirmar Ubicación <CheckCircle2 /></>}
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <PackageSearch className="w-10 h-10 opacity-40" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">Selecciona un insumo de la lista</p>
              <p className="text-xs font-medium mt-2">Los insumos con punto <span className="text-amber-500">naranja</span> requieren ubicación.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paso5Ubicacion;