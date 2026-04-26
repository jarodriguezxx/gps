import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, MapPin, Calendar, Package, Snowflake, ShieldAlert, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

const Paso6Inventario = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/almacen/inventario');
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (e) { 
        console.error("Error cargando inventario:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchInventario();
  }, []);

  const filtrados = items.filter(i => 
    i.nombreArticulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Función para calcular visualmente la caducidad
  const estadoCaducidad = (fechaStr) => {
    if (!fechaStr) return { texto: 'Sin caducidad', color: 'text-slate-500', bg: 'bg-slate-100', Icono: Info };
    
    const hoy = new Date();
    const caducidad = new Date(fechaStr);
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

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 animate-in fade-in duration-300">
      {/* Cabecera con Filtros */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            Inventario Maestro <span className="bg-[#7E1D3B] text-white text-[10px] px-2 py-0.5 rounded-full tracking-widest uppercase align-middle">Digital</span>
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Control Total de Insumos en Tiempo Real</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" placeholder="Buscar por nombre o categoría..."
            className="pl-10 pr-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#7E1D3B]/30 focus:ring-4 focus:ring-[#7E1D3B]/5 transition-all w-72 font-medium"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/30">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-10 shadow-sm">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Insumo y Detalles</th>
              <th className="px-6 py-4">Ubicación Física</th>
              <th className="px-6 py-4">Lote y Caducidad</th>
              <th className="px-6 py-4 text-center">Stock Actual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10 text-slate-400 font-medium">Sincronizando base de datos...</td></tr>
            ) : filtrados.length > 0 ? (
              filtrados.map((item) => {
                const estadoStock = item.cantidadDisponible <= (item.nivelMinimoAlerta || 5);
                const cadInfo = estadoCaducidad(item.fechaCaducidad);

                return (
                  <tr key={item.id} className="hover:bg-white transition-colors group bg-transparent">
                    
                    {/* Columna 1: Nombre y Categoría */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{item.nombreArticulo}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.categoria || 'Sin categoría'}
                      </span>
                      {renderCuidadoEspecial(item.cuidadosEspeciales)}
                    </td>

                    {/* Columna 2: Ubicación */}
                    <td className="px-6 py-4">
                      {item.zonaAlmacen ? (
                        <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-lg w-fit border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                          <MapPin size={14} className="text-emerald-500" />
                          <span className="text-xs font-black">Zona {item.zonaAlmacen} - Nivel {item.estante}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 uppercase tracking-wider">
                          Sin Asignar
                        </span>
                      )}
                    </td>

                    {/* Columna 3: Lote y Caducidad (AHORA MUESTRA LA FECHA EXACTA) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Package size={12} className="text-slate-400"/> Lote: {item.lote || 'N/A'}
                        </span>
                        
                        {/* FECHA EXACTA AÑADIDA AQUÍ */}
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                          <Calendar size={12} className="text-slate-400"/> Caduca: {item.fechaCaducidad || 'S/F'}
                        </span>

                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit border ${cadInfo.bg} ${cadInfo.color} border-current/10 mt-1`}>
                          <cadInfo.Icono size={12} />
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {cadInfo.texto}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Columna 4: Stock Visual */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-black ${estadoStock ? 'text-rose-600' : 'text-slate-700'}`}>
                          {item.cantidadDisponible}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.unidadMedida}</span>
                        
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
                <td colSpan="4" className="text-center py-16 text-slate-400">
                  <p className="text-sm font-bold uppercase tracking-widest mb-1">No hay coincidencias</p>
                  <p className="text-xs">Intenta buscar con otro término.</p>
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