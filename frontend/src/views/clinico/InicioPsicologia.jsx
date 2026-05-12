import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Brain, ChevronRight, CalendarPlus, Search, CheckCircle2, Clock, Activity } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Mis Pacientes', icon: Users,        path: '/psicologia/inicio' },
  { label: 'Agendar Cita',  icon: CalendarPlus, path: '/psicologia/agendar' },
];

const PASOS_REQUERIDOS = [ "Entrevista inicial", "Primera terapia grupal", "Evaluación psicosocial", "Plan de tratamiento", "Daños por consumo", "Sesión familiar", "Notas de evolución", "Despedida grupal", "Entrevista de cierre" ];
const TOTAL_PASOS = PASOS_REQUERIDOS.length;

const InicioPsicologia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('TODOS'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resP = await fetch('http://localhost:4000/api/pacientes');
        if (!resP.ok) throw new Error("Error en red");
        const dataP = await resP.json();
        const pacientesIngresados = dataP.filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO');

        const pacientesConProgresoReal = await Promise.all(
          pacientesIngresados.map(async (p) => {
            let progresoReal = 0;
            try {
              const resD = await fetch(`http://localhost:4000/api/documentos/paciente/${p.id}`);
              if (resD.ok) {
                const docsPsi = (await resD.json()).filter(d => d.departamento === 'Psicología');
                const pasosCompletados = new Set(docsPsi.map(d => d.nombrePaso)).size;
                progresoReal = Math.round((pasosCompletados / TOTAL_PASOS) * 100);
                if (progresoReal > 100) progresoReal = 100;
              }
            } catch (err) { console.warn(`Error al verificar MK-${p.id}`); }
            return { ...p, progreso: progresoReal };
          })
        );
        setPacientes(pacientesConProgresoReal);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const pacientesFiltrados = pacientes.filter(p => {
    const coincideTexto = p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === 'TODOS' ? true : filtro === 'COMPLETOS' ? p.progreso === 100 : p.progreso < 100;
    return coincideTexto && coincideFiltro;
  });

  // Cálculo de KPIs
  const totalAsignados = pacientes.length;
  const expedientesCompletos = pacientes.filter(p => p.progreso === 100).length;
  const expedientesEnProceso = totalAsignados - expedientesCompletos;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-bold">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Departamento de Psicología</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Sesión Activa</p>
                <p className="font-black text-slate-800">Psicólogo Clínico</p>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center text-[#7E1D3B]"><Brain size={18} /></div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
                  <item.icon size={16} className="shrink-0" /><span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-4">
              
              {/* KPIs de Rendimiento (NUEVO Y ROBUSTO) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center"><Users size={24}/></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pacientes Asignados</p><h3 className="text-2xl font-black text-slate-800">{loading ? '-' : totalAsignados}</h3></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={24}/></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Expedientes 100%</p><h3 className="text-2xl font-black text-slate-800">{loading ? '-' : expedientesCompletos}</h3></div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center"><Clock size={24}/></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">En Proceso</p><h3 className="text-2xl font-black text-slate-800">{loading ? '-' : expedientesEnProceso}</h3></div>
                </div>
              </div>

              {/* Tabla Principal */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div><h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Censo de Trabajo</h2></div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Buscar paciente..." onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" />
                    </div>
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full md:w-auto py-2 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#7E1D3B]/30 font-semibold text-slate-600 outline-none">
                      <option value="TODOS">Ver Todos</option><option value="COMPLETOS">Solo 100%</option><option value="INCOMPLETOS">Incompletos</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Paciente</th>
                        <th className="px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Progreso Documental</th>
                        <th className="px-6 py-3.5 text-right text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr><td colSpan="3" className="py-10 text-center font-bold text-slate-400 animate-pulse">Analizando base de datos...</td></tr>
                      ) : pacientesFiltrados.length === 0 ? (
                        <tr><td colSpan="3" className="py-10 text-center font-bold text-slate-400">Sin coincidencias.</td></tr>
                      ) : pacientesFiltrados.map((p, i) => (
                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 text-sm">{p.nombreCompleto}</p>
                            <p className="text-[10px] font-bold text-[#7E1D3B] mt-0.5">MK-{p.id.toString().padStart(4, '0')}</p>
                          </td>
                          <td className="px-6 py-4 w-64">
                            <div className="flex items-center gap-3">
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${p.progreso === 100 ? 'bg-emerald-500' : p.progreso >= 50 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${p.progreso}%` }}></div>
                              </div>
                              <span className="text-xs font-black text-slate-600 w-10 text-right">{p.progreso}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => navigate(`/psicologia/expediente/${p.id}`)} 
                              className="inline-flex items-center gap-2 bg-[#7E1D3B] text-white hover:bg-[#63162e] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95">
                              Expediente <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default InicioPsicologia;