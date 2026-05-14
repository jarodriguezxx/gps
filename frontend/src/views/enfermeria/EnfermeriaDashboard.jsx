import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Pill, History, ShoppingCart } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

import PacientesEnfermeria       from './PacientesEnfermeria';
import MedicamentosEnfermeria    from './MedicamentosEnfermeria';
import HistorialDispensaciones   from './HistorialDispensaciones';

const navItems = [
  { label: 'Pacientes Internados', icon: Users,   key: 'pacientes'   },
  { label: 'Medicamentos',         icon: Pill,    key: 'medicamentos' },
  { label: 'Historial',            icon: History, key: 'historial'   },
];

const getSesion = () => {
  try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
};

const getInitials = (n) =>
  n ? n.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() : '?';

const EnfermeriaDashboard = () => {
  const [activeTab, setActiveTab] = useState('pacientes');
  const sesion = getSesion();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">

          {/* Header */}
          <header className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 bg-white">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Enfermería</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="w-9 h-9 rounded-full bg-[#7E1D3B]/10 border border-[#7E1D3B]/20 flex items-center justify-center text-sm font-bold text-[#7E1D3B]">
                {getInitials(sesion.nombreCompleto || sesion.username)}
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">{sesion.puesto || 'Enfermería'}</p>
                <p className="font-semibold text-sm text-slate-800">
                  {sesion.nombreCompleto || sesion.username || 'Usuario'}
                </p>
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="grid flex-1 gap-4 px-4 py-5 md:grid-cols-[200px_1fr] md:px-6 bg-white min-h-0">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`mb-2 w-full flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    activeTab === key
                      ? 'bg-[#7E1D3B] text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
              <button
                onClick={() => navigate('/medico/requisiciones')}
                className="mb-2 w-full flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12"
              >
                <ShoppingCart size={15} /> Requisiciones
              </button>
            </aside>

            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              {activeTab === 'pacientes'    && <PacientesEnfermeria />}
              {activeTab === 'medicamentos' && <MedicamentosEnfermeria />}
              {activeTab === 'historial'    && <HistorialDispensaciones />}
            </main>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnfermeriaDashboard;
