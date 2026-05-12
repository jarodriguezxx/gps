import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, Loader2, History } from 'lucide-react';
import { API_BASE } from '../../config/api';

const PanelGeneral = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalArticulos: 0,
    totalSalidas: 0,
    pendientes: 0,
    contrarecibosHoy: 0
  });
  const [ultimasSalidas, setUltimasSalidas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        // 1. Cargamos las estadísticas resumidas
        const resStats = await fetch(`${API_BASE}/almacen/stats/resumen`);
        if (resStats.ok) {
          const dataStats = await resStats.json();
          setStats(dataStats);
        }

        // 2. Cargamos las últimas salidas
        const resSalidas = await fetch(`${API_BASE}/almacen/salidas`);
        if (resSalidas.ok) {
          const dataSalidas = await resSalidas.json();
          // Verificamos que sea un array antes de hacer reverse
          if (Array.isArray(dataSalidas)) {
            setUltimasSalidas([...dataSalidas].reverse().slice(0, 4));
          }
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatosDashboard();
  }, []);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* ── KPIs Dinámicos ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Insumos en Stock', value: stats.totalArticulos, sub: 'Artículos registrados', color: 'emerald' },
          { title: 'Pendientes Revisión', value: stats.pendientes, sub: 'Por verificar vs requisición', color: 'amber' },
          { title: 'Salidas Registradas', value: stats.totalSalidas, sub: 'Bajas totales del sistema', color: 'rose' },
          { title: 'Contra-recibos', value: stats.contrarecibosHoy, sub: 'Procesados hoy', color: 'indigo' }
        ].map((kpi, i) => (
          <div key={i} className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm border-b-4 border-b-${kpi.color}-500 transition-all hover:shadow-md`}>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{kpi.title}</p>
            <div className="flex items-baseline gap-2">
               <p className={`text-3xl font-black text-${kpi.color}-600`}>
                 {cargando ? "..." : kpi.value}
               </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        
        {/* ── Panel: Procedimiento Operativo ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#7E1D3B]" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Acceso Rápido a Procesos</h3>
          </div>
          
          <div className="p-5 space-y-3">
             <button onClick={() => setActiveTab('paso1')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition group">
                <div className="flex gap-3 items-center">
                   <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                   <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">Recepción de Mercancía</p>
                      <p className="text-xs text-slate-500">Inicia el flujo con factura en mano</p>
                   </div>
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-emerald-500 transition" size={18} />
             </button>

             <button onClick={() => setActiveTab('paso5')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition group">
                <div className="flex gap-3 items-center">
                   <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">5</div>
                   <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">Consultar Inventario</p>
                      <p className="text-xs text-slate-500">Ver existencias y stock crítico</p>
                   </div>
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-blue-500 transition" size={18} />
             </button>

             <button onClick={() => setActiveTab('paso8')} className="w-full flex items-center justify-between p-4 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 transition group">
                <div className="flex gap-3 items-center">
                   <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-700 flex items-center justify-center font-bold">8</div>
                   <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">Baja de Consumibles</p>
                      <p className="text-xs text-slate-600 font-medium">Registrar salidas a departamentos</p>
                   </div>
                </div>
                <ArrowRight className="text-rose-400 group-hover:translate-x-1 transition" size={18} />
             </button>
          </div>
        </div>

        {/* ── Panel: Últimos Movimientos Reales ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <History size={16} className="text-[#7E1D3B]" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Salidas Recientes</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Insumo</th>
                  <th className="px-5 py-3">Destino</th>
                  <th className="px-5 py-3 text-right">Cant.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ultimasSalidas.length > 0 ? (
                  ultimasSalidas.map((salida) => (
                    <tr key={salida.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3 text-slate-700 font-medium">{salida.articuloNombre}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{salida.areaDestino}</td>
                      <td className="px-5 py-3 text-right font-bold text-rose-600">-{salida.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-5 py-10 text-center text-slate-400 italic">
                      {cargando ? "Sincronizando..." : "No hay salidas registradas."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PanelGeneral;