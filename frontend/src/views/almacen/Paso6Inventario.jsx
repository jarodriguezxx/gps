import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, MapPin, Calendar, Package, Snowflake, ShieldAlert, CheckCircle2, AlertOctagon, Info, Filter, Edit2, Save, X, Archive, Stethoscope } from 'lucide-react';

const Paso6Inventario = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // FILTROS
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos'); 

  const [editandoId, setEditandoId] = useState(null);
  const [nuevoStockMinimo, setNuevoStockMinimo] = useState('');

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/almacen/inventario');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setItems(data);
          else setItems([]);
        }
      } catch (e) { 
        console.error("Error cargando inventario:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchInventario();
  }, []);

  const determinarClasificacion = (articulo) => {
    const texto = `${articulo.categoria || ''} ${articulo.nombreArticulo || ''}`.toLowerCase();
    if (texto.includes('literatura') || texto.includes('medalla') || texto.includes('reactivo') || texto.includes('antidoping')) {
      return 'Extraordinaria';
    }
    return 'Ordinaria';
  };

  const iniciarEdicion = (item) => {
    setEditandoId(item.id);
    setNuevoStockMinimo(item.nivelMinimoAlerta || 0);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNuevoStockMinimo('');
  };

  const guardarStockMinimo = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/almacen/inventario/stock-minimo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nivelMinimoAlerta: parseInt(nuevoStockMinimo) })
      });

      if (!res.ok) throw new Error('Error al actualizar el stock mínimo');

      const nuevosItems = items.map(item => 
        item.id === id ? { ...item, nivelMinimoAlerta: parseInt(nuevoStockMinimo) } : item
      );
      setItems(nuevosItems);
      setEditandoId(null);

    } catch (error) {
      console.error(error);
      alert('Hubo un problema al guardar el stock mínimo.');
    }
  };

  const filtrados = items.filter(item => {
    const nombreSeguro = (item.nombreArticulo || '').toLowerCase();
    const categoriaSegura = (item.categoria || '').toLowerCase();
    const textoBusqueda = busqueda.toLowerCase();
    
    const coincideTexto = nombreSeguro.includes(textoBusqueda) || categoriaSegura.includes(textoBusqueda);
    const clasificacionActual = determinarClasificacion(item);
    const coincideTipo = filtroTipo === 'Todos' || clasificacionActual === filtroTipo;

    return coincideTexto && coincideTipo;
  });

  const estadoCaducidad = (fechaData) => {
    if (!fechaData) return { texto: 'Sin caducidad', color: 'text-slate-500', bg: 'bg-slate-100', Icono: Info };
    
    let caducidad;
    if (Array.isArray(fechaData)) {
      caducidad = new Date(fechaData[0], fechaData[1] - 1, fechaData[2]);
    } else {
      caducidad = new Date(fechaData);
    }

    const hoy = new Date();
    const diffDias = Math.ceil((caducidad - hoy) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) return { texto: '¡Caducado!', color: 'text-rose-700', bg: 'bg-rose-100', Icono: AlertOctagon };
    if (diffDias <= 30) return { texto: `Vence en ${diffDias} días`, color: 'text-amber-700', bg: 'bg-amber-100', Icono: AlertTriangle };
    return { texto: 'Vigente', color: 'text-emerald-700', bg: 'bg-emerald-100', Icono: CheckCircle2 };
  };

  const renderCuidadoEspecial = (cuidado) => {
    if (!cuidado || cuidado.includes('Ninguno')) return null;
    if (cuidado.includes('Refrigeración')) return <span className="flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase border border-blue-100 mt-1 w-fit"><Snowflake size={10}/> Red de Frío</span>;
    if (cuidado.includes('Controlado')) return <span className="flex items-center gap-1 text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase border border-purple-100 mt-1 w-fit"><ShieldAlert size={10}/> Controlado</span>;
    return <span className="flex items-center gap-1 text-[9px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-md uppercase border border-slate-200 mt-1 w-fit"><Info size={10}/> {cuidado}</span>;
  };

  // NUEVO: Lógica para renderizar la ubicación de forma visual y clasificada
  const renderUbicacion = (zona, estante) => {
    if (!zona) return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 uppercase tracking-wider">
        <MapPin size={12} /> Sin Asignar
      </span>
    );

    const esMedico = zona.includes('Médico');
    const nombreZona = zona.replace('Médico - ', '').replace('General - ', '');
    
    return (
      <div className="flex flex-col gap-1.5">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit border ${
          esMedico ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          {esMedico ? <Stethoscope size={12} /> : <Archive size={12} />}
          <span className="text-[10px] font-black uppercase tracking-wider">
            Almacén {esMedico ? 'Médico' : 'General'}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-slate-600 ml-0.5">
          <MapPin size={12} className="text-slate-400" />
          <span className="text-[10px] font-bold tracking-wide">
            {nombreZona} <span className="text-slate-300 mx-1">|</span> Nvl: {estante || 'N/A'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 animate-in fade-in duration-300">
      
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            Inventario Maestro <span className="bg-[#7E1D3B] text-white text-[10px] px-2 py-0.5 rounded-full tracking-widest uppercase align-middle">Digital</span>
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Control Total de Insumos en Tiempo Real</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
             <Filter className="absolute left-3 w-4 h-4 text-slate-400" />
             <select 
               className="pl-9 pr-8 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#7E1D3B]/30 font-bold text-slate-600 transition-all appearance-none cursor-pointer"
               value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
             >
               <option value="Todos">Todas las compras</option>
               <option value="Ordinaria">Solo Ordinarias</option>
               <option value="Extraordinaria">Solo Extraordinarias</option>
             </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" placeholder="Buscar insumo..."
              className="pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#7E1D3B]/30 focus:ring-4 focus:ring-[#7E1D3B]/5 transition-all w-64 font-medium"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/30">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-10 shadow-sm">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4 w-1/3">Insumo y Detalles</th>
              <th className="px-6 py-4">Ubicación Física</th>
              <th className="px-6 py-4">Lote y Caducidad</th>
              <th className="px-6 py-4 text-center">Mínimo (Alerta)</th>
              <th className="px-6 py-4 text-center">Stock Actual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-medium">Sincronizando base de datos...</td></tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-16 text-slate-400">
                  <p className="text-sm font-bold uppercase tracking-widest mb-1">Tu inventario está vacío</p>
                  <p className="text-xs">No hay registros en la base de datos.</p>
                </td>
              </tr>
            ) : filtrados.length > 0 ? (
              filtrados.map((item) => {
                const nivelMinimo = item.nivelMinimoAlerta || 0;
                const estadoStock = item.cantidadDisponible <= nivelMinimo;
                const cadInfo = estadoCaducidad(item.fechaCaducidad);
                const clasificacion = determinarClasificacion(item);

                return (
                  <tr key={item.id} className="hover:bg-white transition-colors group bg-transparent">
                    
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800 mb-1.5">{item.nombreArticulo || 'Sin nombre'}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="inline-block text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.categoria || 'Almacén General'}
                        </span>
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                          clasificacion === 'Ordinaria' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {clasificacion}
                        </span>
                      </div>
                      {renderCuidadoEspecial(item.cuidadosEspeciales)}
                    </td>

                    {/* COLUMNA ACTUALIZADA: UBICACIÓN VISUAL */}
                    <td className="px-6 py-4 align-top">
                      {renderUbicacion(item.zonaAlmacen, item.estante)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Package size={12} className="text-slate-400"/> Lote: {item.lote || 'N/A'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Calendar size={12} className="text-slate-400"/> Caduca: {
                            Array.isArray(item.fechaCaducidad) 
                              ? `${item.fechaCaducidad[0]}-${String(item.fechaCaducidad[1]).padStart(2, '0')}-${String(item.fechaCaducidad[2]).padStart(2, '0')}`
                              : (item.fechaCaducidad || 'S/F')
                          }
                        </span>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit border ${cadInfo.bg} ${cadInfo.color} border-current/10 mt-1`}>
                          <cadInfo.Icono size={12} />
                          <span className="text-[10px] font-black uppercase tracking-wider">{cadInfo.texto}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {editandoId === item.id ? (
                        <div className="flex items-center gap-1 justify-center animate-in fade-in zoom-in-95">
                          <input 
                            type="number" min="0"
                            className="w-16 p-1.5 text-center text-sm font-bold border-2 border-[#7E1D3B]/40 rounded-lg outline-none focus:border-[#7E1D3B] bg-rose-50"
                            value={nuevoStockMinimo} onChange={(e) => setNuevoStockMinimo(e.target.value)} autoFocus
                          />
                          <div className="flex flex-col gap-1">
                            <button onClick={() => guardarStockMinimo(item.id)} className="p-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition">
                              <Save size={12} />
                            </button>
                            <button onClick={cancelarEdicion} className="p-1 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition">
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => iniciarEdicion(item)}>
                          <span className="text-sm font-bold text-slate-600 border-b border-dashed border-slate-400 pb-0.5">{nivelMinimo}</span>
                          <Edit2 size={12} className="text-slate-300 group-hover:text-[#7E1D3B] transition-colors" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-black ${estadoStock ? 'text-rose-600' : 'text-slate-700'}`}>
                          {item.cantidadDisponible || 0}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.unidadMedida || 'Pza'}</span>
                        {estadoStock && (
                          <span className="mt-1 flex items-center gap-1 text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase border border-rose-100">
                            <AlertTriangle size={10}/> Stock Crítico
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-16 text-slate-400">
                  <p className="text-sm font-bold uppercase tracking-widest mb-1">No hay coincidencias</p>
                  <p className="text-xs">Intenta cambiar los filtros o el término de búsqueda.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Paso6Inventario;