import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, BrainCircuit, MessageSquare, 
  Users2, Search, ChevronRight, AlertTriangle, CheckCircle2, BarChart3,
  Calendar as CalendarIcon, ClipboardList, Activity
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura Clínica', icon: LayoutDashboard, key: 'inicio',     path: '/clinico/inicio-jefe-clinico' },
  { label: 'Censo de Pacientes',      icon: Users,           key: 'pacientes',  path: '/clinico/pacientes' },
  { label: 'Auditoría Psicología',    icon: BrainCircuit,    key: 'psicologia', path: '/clinico/pacientes' },
  { label: 'Auditoría Consejería',    icon: MessageSquare,   key: 'consejeria', path: '/clinico/pacientes' },
  { label: 'Auditoría Familia',       icon: Users2,          key: 'familia',    path: '/clinico/pacientes' },
  { label: 'Calendario Terapias',     icon: CalendarIcon,    key: 'calendario', path: '/clinico/inicio-terapeuta' },
  { label: 'Expedientes Clínicos',    icon: ClipboardList,   key: 'expedientes',path: '/clinico/pacientes' },
];

const InicioJefeClinico = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('inicio');
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  const [stats, setStats] = useState({
    totalPacientes: 0,
    expedientesCompletos: 0,
    alertasDocumentacion: 0,
    incidenciasTerapeuta: 0
  });

  const [censoProgreso, setCensoProgreso] = useState([]);

  useEffect(() => {
    const cargarDatosClinicos = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:4000/api/pacientes');
        if (res.ok) {
          const todos = await res.json();
          const activos = todos.filter(p => (p.estadoPaciente || p.estado || '').toUpperCase() === 'INGRESADO');
          
          const pacientesAuditados = activos.map(p => ({
            ...p,
            progresoPsicologia: Math.floor(Math.random() * 100), 
            progresoConsejeria: Math.floor(Math.random() * 100), 
            progresoFamilia: Math.floor(Math.random() * 100),    
          }));

          setStats({
            totalPacientes: activos.length,
            expedientesCompletos: pacientesAuditados.filter(p => (p.progresoPsicologia + p.progresoConsejeria + p.progresoFamilia) / 3 > 90).length,
            alertasDocumentacion: pacientesAuditados.filter(p => p.progresoPsicologia < 20).length,
            incidenciasTerapeuta: 1 
          });

          setCensoProgreso(pacientesAuditados);
        }
      } catch (error) {
        console.error("Error en auditoría clínica:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatosClinicos();
  }, []);

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const ProgressBar = ({ porcentaje, colorClass = "bg-[#7E1D3B]" }) => (
    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
      <div className={`${colorClass} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${porcentaje}%` }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Jefatura Clínica</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <ClipboardCheck size={18} className="text-[#7E1D3B]" />
              </div>
              <div><p className="text-xs text-slate-500 font-semibold">Sesión activa</p><p className="font-bold text-slate-700">Jefe Clínico</p></div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.key} onClick={() => handleNavClick(item)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === item.key ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  {React.createElement(item.icon, { size: 16, className: 'shrink-0' })}
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Censo Clínico</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{loading ? '-' : stats.totalPacientes}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Integración 100%</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{loading ? '-' : stats.expedientesCompletos}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#7E1D3B]">
                  <p className="text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest">Omisiones Docs</p>
                  <h3 className="text-2xl font-black text-[#7E1D3B] mt-1">{loading ? '-' : stats.alertasDocumentacion}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Incidencias Hoy</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{loading ? '-' : stats.incidenciasTerapeuta}</h3>
                </div>
              </div>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Auditoría de Integración</h2>
                  </div>
                  <div className="relative flex-1 md:max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar..." onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4 text-center">Psicología</th>
                        <th className="px-6 py-4 text-center">Consejería</th>
                        <th className="px-6 py-4 text-center">Familia</th>
                        <th className="px-6 py-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {censoProgreso.filter(p => p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 text-sm">{p.nombreCompleto}</p>
                            <p className="text-[10px] font-bold text-[#7E1D3B]">MK-{p.id.toString().padStart(4, '0')}</p>
                          </td>
                          <td className="px-6 py-4 align-middle text-center">
                            <span className="text-[10px] font-bold text-slate-500">{p.progresoPsicologia}%</span>
                            <ProgressBar porcentaje={p.progresoPsicologia} colorClass="bg-sky-500" />
                          </td>
                          <td className="px-6 py-4 align-middle text-center">
                            <span className="text-[10px] font-bold text-slate-500">{p.progresoConsejeria}%</span>
                            <ProgressBar porcentaje={p.progresoConsejeria} colorClass="bg-slate-700" />
                          </td>
                          <td className="px-6 py-4 align-middle text-center">
                            <span className="text-[10px] font-bold text-slate-500">{p.progresoFamilia}%</span>
                            <ProgressBar porcentaje={p.progresoFamilia} colorClass="bg-amber-500" />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => navigate(`/clinico/pacientes`)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto border border-slate-200 shadow-sm">
                              Auditar <ChevronRight size={14} />
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

export default InicioJefeClinico;