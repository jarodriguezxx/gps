import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, 
  Activity, Search, UserCheck, AlertTriangle, FileBarChart
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Expedientes Clínicos',  icon: ClipboardList,  key: 'expedientes', path: '/medico/expedientes' },
  { label: 'Personal Médico',       icon: Stethoscope,    key: 'personal',    path: '/medico/personal' },
  { label: 'Reportes y Estadísticas',icon: FileBarChart,  key: 'reportes',    path: '/medico/reportes' },
];

const pacientesMock = [
  { id: 1, exp: 'EXP-1042', nombre: 'Carlos Ruiz', fase: 'Desintoxicación', medico: 'Dr. Hernández', estado: 'Crítico' },
  { id: 2, exp: 'EXP-1045', nombre: 'Ana López', fase: 'Rehabilitación',  medico: 'Dra. Silva',      estado: 'Estable' },
  { id: 3, exp: 'EXP-1048', nombre: 'Luis Torres', fase: 'Seguimiento',     medico: 'Dr. Hernández', estado: 'Mejora' },
  { id: 4, exp: 'EXP-1051', nombre: 'María Gómez', fase: 'Rehabilitación',  medico: 'Dr. Robles',      estado: 'Estable' },
];

const alertasMock = [
  { id: 1, tipo: 'Crítica', mensaje: 'Paciente EXP-1042 presentó alteración en signos vitales.', fecha: 'Hace 15 min' },
  { id: 2, tipo: 'Administrativa', mensaje: 'Falta firma del Dr. Robles en el alta del paciente EXP-1030.', fecha: 'Hace 2 horas' },
  { id: 3, tipo: 'Insumos', mensaje: 'Nivel bajo de medicamentos controlados en el inventario de urgencias.', fecha: 'Hace 5 horas' },
];

const estadoClass = {
  'Crítico': 'bg-rose-100 text-rose-700',
  'Estable': 'bg-emerald-100 text-emerald-700',
  'Mejora':  'bg-blue-100 text-blue-700',
};

const alertaClass = {
  'Crítica': 'border-rose-200 bg-rose-50 text-rose-800',
  'Administrativa': 'border-amber-200 bg-amber-50 text-amber-800',
  'Insumos': 'border-blue-200 bg-blue-50 text-blue-800',
};

const InicioJefeMedico = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('inicio');
  const [pacientes] = useState(pacientesMock);
  const [alertas] = useState(alertasMock);

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                      focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                      placeholder:text-slate-300 transition-all`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Jefatura Médica</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Stethoscope size={18} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Jefe Médico</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* ── Sidebar ── */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  {React.createElement(icon, { size: 16, className: 'shrink-0' })}
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            {/* ── Main ── */}
            <main className="space-y-5">

              {/* ── Tabla de Pacientes Activos (Arriba) ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Pacientes Activos en Piso</h2>
                  </div>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar expediente..." className={`${inputClass} pl-9 py-1.5 text-xs w-64`} />
                  </div>
                </div>
                
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['Expediente', 'Paciente', 'Fase', 'Médico Asignado', 'Estado Clínico'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.map((p, i) => (
                      <tr key={p.id}
                        className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-5 py-3 font-bold text-[#7E1D3B]">{p.exp}</td>
                        <td className="px-5 py-3 text-slate-700 font-medium">{p.nombre}</td>
                        <td className="px-5 py-3 text-slate-600">{p.fase}</td>
                        <td className="px-5 py-3 text-slate-600 flex items-center gap-2">
                          <UserCheck size={14} className="text-slate-400" /> {p.medico}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${estadoClass[p.estado] || 'bg-slate-100 text-slate-500'}`}>
                            {p.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-500 font-medium">Mostrando {pacientes.length} pacientes bajo supervisión médica.</p>
                </div>
              </section>

              {/* ── Alertas Clínicas (Abajo) ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Alertas Clínicas y Administrativas</h2>
                  </div>
                  <button className="text-xs font-bold text-[#7E1D3B] hover:underline">Ver todas</button>
                </div>

                <div className="grid gap-3">
                  {alertas.map(alerta => (
                    <div key={alerta.id} className={`flex items-start gap-3 p-4 border rounded-xl ${alertaClass[alerta.tipo]}`}>
                      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold uppercase tracking-wider">{alerta.tipo}</p>
                          <span className="text-[11px] font-semibold opacity-70">{alerta.fecha}</span>
                        </div>
                        <p className="text-sm font-medium">{alerta.mensaje}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default InicioJefeMedico;