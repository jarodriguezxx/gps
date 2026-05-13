import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, ClipboardList, FileBarChart, Apple, HardHat, ShoppingCart } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Nutrición',      icon: Activity,       key: 'inicio',      path: '/nutriologo/inicio' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/nutriologo/pacientes' },
  { label: 'Expedientes Nutrición', icon: ClipboardList,  key: 'expedientes', path: '/nutriologo/expedientes' },
  { label: 'Requisiciones',         icon: ShoppingCart,   key: 'requisiciones', path: '/nutriologo/requisiciones' },
  { label: 'Reportes',              icon: FileBarChart,   key: 'reportes',    path: '/nutriologo/reportes' },
];

const ReportesNutricion = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('reportes');

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Nutrición Clínica</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Apple size={18} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Nutriología</p>
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

            <main className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-20">
              <div className="bg-[#7E1D3B]/10 p-6 rounded-full mb-6">
                <HardHat size={64} className="text-[#7E1D3B]" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Módulo en Construcción</h2>
              <p className="text-slate-500 text-center max-w-md">
                El área de reportes estadísticos y gráficas poblacionales para Nutrición será implementada en la siguiente fase del desarrollo.
              </p>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ReportesNutricion;