import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, ClipboardList, FileBarChart, Apple, AlertTriangle, ChevronRight, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Nutrición',      icon: Activity,       key: 'inicio',      path: '/nutriologo/inicio' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/nutriologo/pacientes' },
  { label: 'Expedientes Nutrición', icon: ClipboardList,  key: 'expedientes', path: '/nutriologo/expedientes' },
  { label: 'Reportes',              icon: FileBarChart,   key: 'reportes',    path: '/nutriologo/reportes' },
];

const InicioNutricion = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('inicio');
  const [stats, setStats] = useState({ activos: 0, evaluacionesPendientes: 0 });
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTablero = async () => {
      try {
        const resPacientes = await fetch('http://localhost:4000/api/pacientes');
        if (resPacientes.ok) {
          const pacientes = await resPacientes.json();
          const ingresados = pacientes.filter(p => (p.estadoPaciente || p.estado || '').toUpperCase() === 'INGRESADO');
          
          let pendientes = 0;
          const nuevasAlertas = [];

          for (let p of ingresados) {
            const resNutri = await fetch(`http://localhost:4000/api/nutricion/${p.id}`);
            const dataNutri = await resNutri.json();
            
            if (!dataNutri.id) {
              pendientes++;
              nuevasAlertas.push({
                id: p.id,
                tipo: 'Auditoría Nutricional',
                severidad: 'alta',
                mensaje: `Paciente ${p.nombreCompleto} requiere Evaluación Nutricional Inicial.`,
                accion: () => navigate(`/nutriologo/evaluacion/${p.id}`)
              });
            }
          }

          setStats({ activos: ingresados.length, evaluacionesPendientes: pendientes });
          setAlertas(nuevasAlertas);
        }
      } catch (error) {
        console.error("Error cargando tablero", error);
      } finally {
        setLoading(false);
      }
    };
    cargarTablero();
  }, [navigate]);

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Apple size={18} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">{JSON.parse(localStorage.getItem('marakame_user')||'{}').nombreCompleto||'Usuario'}</p>
                <p className="text-xs text-slate-500">{JSON.parse(localStorage.getItem('marakame_user')||'{}').puesto||'Sin puesto'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <Icon size={16} className="shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            <main>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-emerald-300 transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700"><Users size={20} /></div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md"><TrendingUp size={12}/> Ocupación</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.activos}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pacientes en Piso</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-rose-300 transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-rose-100 p-2.5 rounded-xl text-rose-700"><Clock size={20} /></div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-rose-600">{loading ? '-' : stats.evaluacionesPendientes}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Evaluaciones Pendientes</p>
                  </div>
                </div>
              </div>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Supervisión Nutricional</h2>
                  </div>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {alertas.length} Observaciones
                  </span>
                </div>
                
                <div className="p-5 overflow-y-auto flex-1 space-y-3 bg-slate-50">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                      <div className="animate-spin h-8 w-8 border-4 border-[#7E1D3B] border-t-transparent rounded-full"></div>
                    </div>
                  ) : alertas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 mt-8">
                      <CheckCircle2 size={48} className="text-emerald-400 mb-3" />
                      <p className="font-bold text-slate-700">Control Clínico Perfecto</p>
                      <p className="text-sm mt-1">Todos los expedientes nutricionales están completos.</p>
                    </div>
                  ) : (
                    alertas.map(alerta => (
                      <div key={alerta.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex gap-4 items-start hover:border-rose-200 transition-colors">
                        <div className="p-2 rounded-lg mt-0.5 bg-rose-100 text-rose-600"><AlertTriangle size={18} /></div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{alerta.tipo}</p>
                          <p className="text-sm font-bold text-slate-700 leading-snug">{alerta.mensaje}</p>
                        </div>
                        <button onClick={alerta.accion} className="text-[#7E1D3B] bg-[#7E1D3B]/5 hover:bg-[#7E1D3B]/10 p-2 rounded-lg transition-colors" title="Ir al Expediente">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default InicioNutricion;