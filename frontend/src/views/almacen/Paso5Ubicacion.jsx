import React, { useState, useEffect } from 'react';
import { MapPin, Archive, Stethoscope, Search, CheckCircle2, ArrowRight, Package, AlertCircle, Snowflake, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

const Paso5Ubicacion = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para la asignación
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [tipoAlmacen, setTipoAlmacen] = useState('General'); 
  const [zona, setZona] = useState('');
  const [estante, setEstante] = useState('');
  const [guardando, setGuardando] = useState(false);

  // NUEVO: Estados para la paginación (6 items por página)
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  // Opciones dinámicas según el almacén
  const opcionesZonaGeneral = ['Pasillo A', 'Pasillo B', 'Pasillo C', 'Zona de Tarimas', 'Cuarto de Limpieza'];
  const opcionesZonaMedica = ['Anaquel Principal', 'Red de Frío (Refrigerador)', 'Gaveta Controlados', 'Vitrina Curación'];

  const cargarInventario = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/almacen/inventario');
      if (res.ok) {
        const data = await res.json();
        setInventario(data);
      }
    } catch (e) {
      console.error("Error al cargar inventario:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // 1. Primero filtramos todos los items según la búsqueda
  const itemsFiltrados = inventario.filter(item => {
    const texto = `${item.nombreArticulo} ${item.categoria}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  }).sort((a, b) => {
    if (!a.zonaAlmacen && b.zonaAlmacen) return -1;
    if (a.zonaAlmacen && !b.zonaAlmacen) return 1;
    return 0;
  });

  // 2. Calculamos la paginación sobre los items filtrados
  const totalPaginas = Math.ceil(itemsFiltrados.length / itemsPorPagina);
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsPaginados = itemsFiltrados.slice(indicePrimerItem, indiceUltimoItem); // <--- Aquí cortamos a 6

  // Manejador de búsqueda para regresar siempre a la página 1 al buscar
  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const seleccionarItem = (item) => {
    setItemSeleccionado(item);
    if (item.zonaAlmacen) {
      if (item.zonaAlmacen.includes('Médico')) setTipoAlmacen('Medico');
      else setTipoAlmacen('General');
      
      setZona(item.zonaAlmacen.replace('Médico - ', '').replace('General - ', ''));
      setEstante(item.estante || '');
    } else {
      if (['Medicamentos', 'Material de Curación', 'Reactivos'].includes(item.categoria)) {
        setTipoAlmacen('Medico');
      } else {
        setTipoAlmacen('General');
      }
      setZona('');
      setEstante('');
    }
  };

  const guardarUbicacion = async () => {
    if (!zona || !estante) return alert('Por favor selecciona una zona y un estante/nivel.');
    
    setGuardando(true);
    const zonaFormateada = `${tipoAlmacen === 'Medico' ? 'Médico' : 'General'} - ${zona}`;

    try {
      const res = await fetch(`http://localhost:4000/api/almacen/inventario/${itemSeleccionado.id}/ubicacion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          zonaAlmacen: zonaFormateada,
          estante: estante
        })
      });

      if (!res.ok) throw new Error('Error al guardar la ubicación');

      const nuevosItems = inventario.map(item => 
        item.id === itemSeleccionado.id 
          ? { ...item, zonaAlmacen: zonaFormateada, estante: estante } 
          : item
      );
      setInventario(nuevosItems);
      setItemSeleccionado(null);
      
    } catch (error) {
      console.error(error);
      alert('Hubo un problema de conexión al asignar la ubicación.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 animate-in fade-in duration-300">
      
      {/* CABECERA */}
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <MapPin className="text-[#7E1D3B]" /> Asignación de Ubicaciones
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Organiza los insumos en el almacén físico
          </p>
        </div>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" placeholder="Buscar insumo para ubicar..."
            className="w-full pl-10 pr-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-[#7E1D3B]/40 focus:ring-4 focus:ring-[#7E1D3B]/10 transition-all"
            value={busqueda} onChange={manejarBusqueda}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50 min-h-[500px]">
        
        {/* COLUMNA IZQUIERDA: LISTA DE ITEMS */}
        <div className="w-full md:w-1/2 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur z-10 flex justify-between items-center">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
               Inventario Físico ({itemsFiltrados.length})
             </span>
             <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200 uppercase flex items-center gap-1">
               <AlertCircle size={10}/> Prioridad: Sin Asignar
             </span>
          </div>
          
          {/* AQUÍ RENDERIZAMOS SOLO LOS 6 ITEMS PAGINADOS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10 text-slate-400 font-bold">Cargando...</div>
            ) : itemsPaginados.map(item => (
              <button 
                key={item.id} 
                onClick={() => seleccionarItem(item)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group ${
                  itemSeleccionado?.id === item.id 
                    ? 'border-[#7E1D3B] bg-[#7E1D3B]/5' 
                    : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <div className="pr-4">
                  <p className="text-sm font-black text-slate-800 line-clamp-1">{item.nombreArticulo}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 flex items-center gap-1.5">
                    <Package size={12}/> {item.categoria || 'Sin Categoría'}
                  </p>
                </div>
                
                <div className="shrink-0 text-right">
                  {item.zonaAlmacen ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
                      <CheckCircle2 size={12}/> Ubicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-200 animate-pulse">
                      <MapPin size={12}/> Pendiente
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* CONTROLES DE PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              <button 
                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Página {paginaActual} de {totalPaginas}
              </span>
              
              <button 
                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaActual === totalPaginas}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: FORMULARIO DE ASIGNACIÓN */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-slate-50/50">
          
          {!itemSeleccionado ? (
            <div className="text-center opacity-40 flex flex-col items-center">
              <MapPin size={64} className="mb-4 text-slate-400" />
              <p className="text-lg font-black text-slate-600">Selecciona un Insumo</p>
              <p className="text-sm font-medium text-slate-500 mt-1">Elige un artículo de la lista para asignarle un lugar.</p>
            </div>
          ) : (
            <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-xl animate-in zoom-in-95 duration-300">
              
              <div className="mb-6 pb-4 border-b border-slate-100">
                <p className="text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest mb-1">Insumo a Ubicar</p>
                <h3 className="text-lg font-black text-slate-800 leading-tight">{itemSeleccionado.nombreArticulo}</h3>
                <div className="flex gap-2 mt-2">
                   <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">Stock: {itemSeleccionado.cantidadDisponible} {itemSeleccionado.unidadMedida || 'Pza'}</span>
                   {itemSeleccionado.cuidadosEspeciales !== 'Ninguno (Ambiente)' && itemSeleccionado.cuidadosEspeciales && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1"><Snowflake size={10}/> Cuidado Especial</span>
                   )}
                </div>
              </div>

              {/* SELECTOR DE ALMACÉN (TABS) */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button 
                  onClick={() => { setTipoAlmacen('General'); setZona(''); setEstante(''); }}
                  className={`p-3 rounded-xl border-2 font-black text-xs uppercase flex flex-col items-center gap-2 transition-all ${
                    tipoAlmacen === 'General' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Archive size={20} />
                  Almacén General
                </button>
                <button 
                  onClick={() => { setTipoAlmacen('Medico'); setZona(''); setEstante(''); }}
                  className={`p-3 rounded-xl border-2 font-black text-xs uppercase flex flex-col items-center gap-2 transition-all ${
                    tipoAlmacen === 'Medico' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope size={20} />
                  Almacén Médico
                </button>
              </div>

              {/* CAMPOS DE ZONA Y ESTANTE */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-[10px] font-black uppercase mb-1.5 flex items-center gap-1 ${tipoAlmacen === 'Medico' ? 'text-teal-700' : 'text-amber-700'}`}>
                    <Layers size={14}/> Área / Zona ({tipoAlmacen})
                  </label>
                  <select 
                    className={`w-full p-3 bg-slate-50 border-2 rounded-xl text-sm font-bold outline-none transition-colors appearance-none ${tipoAlmacen === 'Medico' ? 'border-teal-100 focus:border-teal-400' : 'border-amber-100 focus:border-amber-400'}`}
                    value={zona} onChange={(e) => setZona(e.target.value)}
                  >
                    <option value="">Selecciona el área...</option>
                    {(tipoAlmacen === 'General' ? opcionesZonaGeneral : opcionesZonaMedica).map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] font-black uppercase mb-1.5 ${tipoAlmacen === 'Medico' ? 'text-teal-700' : 'text-amber-700'}`}>
                    Estante / Nivel / Charola
                  </label>
                  <input 
                    type="text" placeholder="Ej. Nivel 3, Charola B..."
                    className={`w-full p-3 bg-slate-50 border-2 rounded-xl text-sm font-bold outline-none transition-colors ${tipoAlmacen === 'Medico' ? 'border-teal-100 focus:border-teal-400' : 'border-amber-100 focus:border-amber-400'}`}
                    value={estante} onChange={(e) => setEstante(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <button 
                  onClick={guardarUbicacion}
                  disabled={!zona || !estante || guardando}
                  className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                    zona && estante && !guardando 
                      ? tipoAlmacen === 'Medico' ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {guardando ? 'Registrando...' : 'Confirmar Ubicación'} <ArrowRight size={16}/>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Paso5Ubicacion;