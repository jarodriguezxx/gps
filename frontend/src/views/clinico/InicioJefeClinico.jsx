import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ClipboardCheck, Activity, 
  AlertCircle, TrendingUp, Clock, FileWarning, ChevronRight
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Tablero de Control',     icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Auditoría Clínica',      icon: Users,           path: '/clinico/directorio' },
  { label: 'Validación Terapéutica', icon: ClipboardCheck,  path: '/clinico/calendario' },
];

const InicioJefeClinico = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ total: 0, propuestasPendientes: 3, expedientesIncompletos: 5 });

  useEffect(() => {
    fetch('http://localhost:4000/api/pacientes')
      .then(res => res.json())
      .then(data => setStats(prev => ({ ...prev, total: data.filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO').length })));
  }, []);

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
                    location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <item.icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#7E1D3B]">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ocupación Actual</p>
                    <Users size={16} className="text-slate-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800">{stats.total}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><TrendingUp size={12}/> Capacidad Estable</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">A Validar</p>
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800">{stats.propuestasPendientes}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Dinámicas pendientes de revisar</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Alertas</p>
                    <AlertCircle size={16} className="text-rose-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800">{stats.expedientesIncompletos}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Expedientes incompletos</p>
                </div>
              </div>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-rose-500" />
                  <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Reporte de Excepciones</h2>
                </div>
                <div className="p-0 overflow-y-auto bg-white">
                  <div className="divide-y divide-slate-100">
                    <div className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-center group">
                      <FileWarning size={20} className="text-rose-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">Paciente: Juan Pérez</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Falta: Evaluación Psicosocial (Retraso 48h)</p>
                      </div>
                      <button onClick={() => navigate('/clinico/directorio')} className="text-slate-400 hover:text-[#7E1D3B] p-2 transition-colors border border-transparent hover:border-slate-200 rounded-lg">
                        <ChevronRight size={18} />
                      </button>
                    </div>
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