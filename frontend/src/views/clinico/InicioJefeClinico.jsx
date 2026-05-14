import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, UserCog, Activity,
  TrendingUp, Clock, UserX, ChevronRight, CalendarClock, ShoppingCart, BadgeCheck
} from 'lucide-react';
import { API_BASE } from '../../config/api';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Tablero de Control',     icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Auditoría Clínica',      icon: Users,           path: '/clinico/directorio' },
  { label: 'Asignación Terapéutica', icon: UserCog,         path: '/clinico/asignaciones' },
  { label: 'Validación Terapéutica', icon: ClipboardCheck,  path: '/clinico/calendario' },
  { label: 'Requisiciones',          icon: ShoppingCart,    path: '/clinico/requisiciones' },
  { label: 'Validar Requisiciones',  icon: BadgeCheck,      path: '/clinico/validar-requisiciones' },
];

const InicioJefeClinico = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes,    setPacientes]    = useState([]);
  const [actividades,  setActividades]  = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/pacientes`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API_BASE}/actividades`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API_BASE}/asignaciones-clinico`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([pacs, acts, asigs]) => {
      setPacientes((Array.isArray(pacs) ? pacs : []).filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO'));
      setActividades(Array.isArray(acts) ? acts : []);
      setAsignaciones(Array.isArray(asigs) ? asigs : []);
    });
  }, []);

  const pendientes = actividades.filter(a => a.estado === 'Pendiente');

  // Patients with fewer than 3 department assignments
  const sinAsignar = pacientes.filter(p => {
    const deps = new Set(asignaciones.filter(a => a.pacienteId === p.id).map(a => a.departamento));
    return deps.size < 3;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Dirección Clínica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Tablero de Control</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Activity size={18} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Jefe Clínico</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    location.pathname === item.path
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <item.icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              {/* Stat cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#7E1D3B]">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ocupación actual</p>
                    <Users size={16} className="text-slate-400" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">{pacientes.length}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><TrendingUp size={12}/> Pacientes ingresados</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">A validar</p>
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">{pendientes.length}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Dinámicas pendientes de revisar</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Sin asignación completa</p>
                    <UserX size={16} className="text-rose-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">{sinAsignar.length}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Pacientes sin terapeuta(s)</p>
                </div>
              </div>

              {/* Two columns: pending proposals + unassigned patients */}
              <div className="grid gap-4 md:grid-cols-2">

                {/* Pending proposals */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-1 rounded-full bg-amber-500" />
                      <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-700">Dinámicas Pendientes</h2>
                    </div>
                    <button onClick={() => navigate('/clinico/calendario')}
                      className="text-xs text-[#7E1D3B] font-bold hover:underline flex items-center gap-1">
                      Ver todas <ChevronRight size={13} />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {pendientes.length === 0 ? (
                      <p className="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-widest">Sin propuestas pendientes</p>
                    ) : (
                      pendientes.slice(0, 6).map(a => (
                        <div key={a.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                          <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                            <CalendarClock size={14} className="text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{a.titulo}</p>
                            <p className="text-[10px] text-slate-500">{a.terapeuta} · {a.fecha} {a.hora}</p>
                          </div>
                          <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">Pendiente</span>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Unassigned patients */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-1 rounded-full bg-rose-500" />
                      <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-700">Requieren Asignación</h2>
                    </div>
                    <button onClick={() => navigate('/clinico/asignaciones')}
                      className="text-xs text-[#7E1D3B] font-bold hover:underline flex items-center gap-1">
                      Gestionar <ChevronRight size={13} />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {sinAsignar.length === 0 ? (
                      <p className="text-center py-8 text-xs text-emerald-600 font-bold uppercase tracking-widest">Todos con asignación completa</p>
                    ) : (
                      sinAsignar.slice(0, 6).map(p => {
                        const asigCount = new Set(asignaciones.filter(a => a.pacienteId === p.id).map(a => a.departamento)).size;
                        return (
                          <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                              <UserX size={14} className="text-rose-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{p.nombreCompleto}</p>
                              <p className="text-[10px] text-slate-500">MK-{p.id.toString().padStart(4,'0')}</p>
                            </div>
                            <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full shrink-0">{asigCount}/3</span>
                          </div>
                        );
                      })
                    )}
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

export default InicioJefeClinico;
