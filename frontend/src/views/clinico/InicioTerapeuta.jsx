import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon, Users, AlertTriangle, Activity, 
  Clock, CheckCircle2, FileWarning, PlusCircle, LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Mi Agenda de Hoy',       icon: LayoutDashboard, key: 'inicio',      path: '/terapeuta/inicio' },
  { label: 'Calendario Mensual',     icon: CalendarIcon,    key: 'calendario',  path: '/terapeuta/calendario' },
  { label: 'Registro de Incidencias',icon: AlertTriangle,   key: 'incidencias', path: '/terapeuta/incidencias' },
  { label: 'Pacientes Activos',      icon: Users,           key: 'pacientes',   path: '/terapeuta/pacientes' },
];

const InicioTerapeuta = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('inicio');
  
  // Datos simulados para la agenda del terapeuta
  const [estadisticas] = useState({
    actividadesHoy: 3,
    pacientesAsignados: 18,
    incidenciasReportadas: 1
  });

  const [agendaHoy] = useState([
    { id: 1, hora: '10:00 AM', actividad: 'Terapia Grupal: Prevención de Recaídas', tipo: 'Grupal', estado: 'Completada', pacientes: 15 },
    { id: 2, hora: '13:00 PM', actividad: 'Terapia de Arte y Expresión Emocional', tipo: 'Taller', estado: 'En curso', pacientes: 18 },
    { id: 3, hora: '17:00 PM', actividad: 'Dinámica de Integración y Reflexión', tipo: 'Dinámica', estado: 'Pendiente', pacientes: 18 }
  ]);

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* HEADER CORPORATIVO */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Operativo: Terapia</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Users size={18} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Terapeuta</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            
            {/* SIDEBAR OFICIAL ROJIZO */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  {React.createElement(icon, { size: 16, className: 'shrink-0' })}
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              
              {/* KPIs OPERATIVOS SOBRIOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-slate-400 transition-colors cursor-default border-l-4 border-l-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-slate-500"><CalendarIcon size={20} /></div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800">{estadisticas.actividadesHoy}</h3>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Actividades Hoy</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-slate-400 transition-colors cursor-default border-l-4 border-l-slate-500">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-slate-500"><Users size={20} /></div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800">{estadisticas.pacientesAsignados}</h3>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pacientes en Grupo</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#7E1D3B]/50 transition-colors cursor-default border-l-4 border-l-[#7E1D3B]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[#7E1D3B]"><FileWarning size={20} /></div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-[#7E1D3B]">{estadisticas.incidenciasReportadas}</h3>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Incidencias Reportadas</p>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* AGENDA DEL DÍA ESTILO CORPORATIVO */}
                <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 p-5 border-b border-slate-200 bg-slate-50/50">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Agenda Programada</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Control de actividades y toma de asistencia</p>
                    </div>
                  </div>
                  
                  <div className="p-0">
                    <div className="divide-y divide-slate-100">
                      {agendaHoy.map(act => (
                        <div key={act.id} className="p-5 hover:bg-slate-50 transition-colors flex items-start gap-5">
                          <div className="w-20 text-center shrink-0">
                            <p className="text-xl font-black text-slate-800">{act.hora.split(' ')[0]}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{act.hora.split(' ')[1]}</p>
                          </div>
                          
                          <div className="flex-1 border-l border-slate-200 pl-5">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{act.tipo}</p>
                                <h3 className="text-sm font-bold text-slate-800">{act.actividad}</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                                  <Users size={14}/> {act.pacientes} pacientes
                                </p>
                              </div>
                              
                              {/* Insignias Sobrias */}
                              {act.estado === 'Completada' && <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12}/> Terminada</span>}
                              {act.estado === 'En curso' && <span className="bg-[#7E1D3B] text-white px-2.5 py-1 rounded shadow-sm text-[10px] font-bold uppercase animate-pulse">En Curso</span>}
                              {act.estado === 'Pendiente' && <span className="bg-white text-slate-400 border border-slate-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase">Pendiente</span>}
                            </div>
                            
                            {act.estado !== 'Completada' && (
                              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                                <button className="text-xs font-bold text-slate-600 border border-slate-200 hover:border-[#7E1D3B] hover:text-[#7E1D3B] bg-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm">
                                  Asistencia y Notas <ChevronRight size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* PANEL DE INCIDENCIAS ESTILO ALERTA CORPORATIVA */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-[#7E1D3B]" /> Incidencias Clínicas
                    </h2>
                  </div>
                  
                  <div className="p-6 flex flex-col h-full justify-between">
                    <div>
                      <p className="text-xs text-slate-600 mb-6 font-medium leading-relaxed">
                        Utilice este módulo únicamente para reportar eventos críticos, altercados o crisis emocionales severas durante las actividades terapéuticas. 
                        <br/><br/>
                        <span className="font-bold text-slate-800">Nota:</span> Estos reportes se anexan directamente al expediente y son notificados a la Jefatura Clínica.
                      </p>
                    </div>
                    
                    <button onClick={() => navigate('/terapeuta/incidencias')} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-[#7E1D3B] text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">
                      <PlusCircle size={16} /> Crear Nuevo Reporte
                    </button>
                  </div>
                </section>

              </div>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default InicioTerapeuta;