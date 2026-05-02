import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart, UserPlus,
  Search, AlertTriangle, FileText, FilePlus
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

// Menú de navegación lateral actualizado
const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Historia Médica',       icon: FileText,       key: 'historia',    path: '/medico/historia-medica' }, // <-- NUEVA SECCIÓN
  { label: 'Expedientes Clínicos',  icon: ClipboardList,  key: 'expedientes', path: '/medico/expedientes' },
  { label: 'Personal Médico',       icon: Stethoscope,    key: 'personal',    path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart, key: 'reportes',    path: '/medico/reportes' },
];

const PacientesActivos = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('pacientes');
  const [busqueda, setBusqueda] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/pacientes');
      if (response.ok) {
        setPacientes(await response.json());
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPacientes(); }, []);

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  const pacientesActivos = pacientes.filter(p => {
    const estado = (p.estadoPaciente || p.estado || '').toUpperCase();
    return estado === 'INGRESADO';
  });

  const filtrados = pacientesActivos.filter(p => {
    const termino = busqueda.toLowerCase();
    const idStr = p.id ? p.id.toString() : '';
    return (
      (p.nombreCompleto && p.nombreCompleto.toLowerCase().includes(termino)) ||
      idStr.includes(termino)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

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
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Pacientes Activos en Piso</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Gestione los expedientes y notas clínicas del día</p>
                    </div>
                  </div>
                  <div className="relative flex-1 md:max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar paciente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                        <th className="px-6 py-4">Folio</th>
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4">Sustancia Principal</th>
                        <th className="px-6 py-4 text-right">Acciones Clínicas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {loading ? (
                        <tr><td colSpan="4" className="py-12 text-center text-slate-500 text-sm">Cargando pacientes...</td></tr>
                      ) : filtrados.length === 0 ? (
                        <tr><td colSpan="4" className="py-12 text-center text-slate-500 text-sm">No hay pacientes activos.</td></tr>
                      ) : (
                        filtrados.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4"><span className="font-bold text-[#7E1D3B] text-sm">MK-{p.id.toString().padStart(4, '0')}</span></td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800 text-sm">{p.nombreCompleto || 'Sin nombre registrado'}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{p.edad ? `${p.edad} años` : 'Edad S/E'}</p>
                            </td>
                            <td className="px-6 py-4">
                              {p.sustanciaConsumo ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold">
                                  <AlertTriangle size={12} /> {p.sustanciaConsumo}
                                </span>
                              ) : <span className="text-xs text-slate-400 italic">No especificada</span>}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => navigate(`/medico/expedientes/${p.id}`)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5">
                                  <ClipboardList size={14} /> Expediente
                                </button>
                                <button onClick={() => alert('Notas de Evolución (Pendiente de integrar)')} className="px-3 py-2 bg-[#7E1D3B] text-white rounded-lg hover:bg-[#63162e] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
                                  <FilePlus size={14} /> Evolución
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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

export default PacientesActivos;