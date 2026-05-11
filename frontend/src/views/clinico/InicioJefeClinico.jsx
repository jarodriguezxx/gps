import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, Activity, BarChart3
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',        icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Directorio Auditoría',   icon: Users,           path: '/clinico/directorio' },
  { label: 'Validar Actividades',    icon: ClipboardCheck,   path: '/clinico/calendario' },
];

const InicioJefeClinico = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ total: 0, completos: 0, alertas: 0, incidencias: 1 });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Dirección Clínica</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Sesión Activa</p>
                <p className="font-black text-slate-800">Jefatura Clínica</p>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <ClipboardCheck size={18} className="text-[#7E1D3B]" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <item.icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>
            <main className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Censo Clínico</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">12</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Auditoría 100%</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">8</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#7E1D3B]">
                  <p className="text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest">Exp. Incompletos</p>
                  <h3 className="text-3xl font-black text-[#7E1D3B] mt-1">4</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Alertas Hoy</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.incidencias}</h3>
                </div>
              </div>
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <Activity size={16} className="text-slate-500" /> Auditoría Clínica
                  </h2>
                </div>
                <div className="p-6">
                  <div className="h-48 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
                    <p className="text-xs font-bold text-slate-400 italic text-center">Monitor de cumplimiento: Psicología, Consejería y Familia.</p>
                  </div>
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