import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart,
  Search, UserCheck, Phone, MapPin, RefreshCw, UserPlus
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Expedientes Clínicos',  icon: ClipboardList,  key: 'expedientes', path: '/medico/expedientes' },
  { label: 'Personal Médico',       icon: Stethoscope,    key: 'personal',    path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart, key: 'reportes',    path: '/medico/reportes' },
];

const PacientesActivos = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('pacientes');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Fetch a la API de Marakame para obtener pacientes activos
  const fetchPacientes = async () => {
    setLoading(true);
    try {
      // Reemplazar URL con la correcta de tu entorno si difiere
      const response = await fetch('http://localhost:4000/api/pacientes/activos');
      if (response.ok) {
        const data = await response.json();
        setPacientes(data);
      } else {
        console.error('Error al obtener pacientes');
      }
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
  };

  const pacientesFiltrados = pacientes.filter(p => {
    const termino = busqueda.toLowerCase();
    return (
      (p.nombreCompleto && p.nombreCompleto.toLowerCase().includes(termino)) ||
      (p.sustanciaConsumo && p.sustanciaConsumo.toLowerCase().includes(termino)) ||
      (p.id && p.id.toString().includes(termino))
    );
  });

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
                <button 
                  key={key} 
                  type="button" /* <--- CORRECCIÓN AQUÍ */
                  onClick={() => handleNavClick({ key, path })}
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

              {/* ── Directorio de Pacientes Activos ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Pacientes Internados</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Listado general de pacientes activos en tratamiento</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={fetchPacientes} 
                      className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-[#7E1D3B] transition-colors"
                      title="Actualizar datos"
                    >
                      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, sustancia o ID..." 
                        value={busqueda}
                        onChange={handleSearch}
                        className={`${inputClass} pl-9 py-2 text-xs md:w-72`} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 w-24">ID / Folio</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Paciente</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Detalles Demográficos</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Contacto / Origen</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Sustancia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="px-5 py-8 text-center text-slate-500 text-sm">
                            Cargando pacientes desde el servidor...
                          </td>
                        </tr>
                      ) : pacientesFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-5 py-8 text-center text-slate-500 text-sm">
                            No se encontraron pacientes activos.
                          </td>
                        </tr>
                      ) : (
                        pacientesFiltrados.map((p, i) => (
                          <tr key={p.id}
                            className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                            
                            <td className="px-5 py-4 font-bold text-[#7E1D3B] text-xs">
                              {p.id ? `MK-${p.id.toString().padStart(4, '0')}` : 'N/A'}
                            </td>
                            
                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-700">{p.nombreCompleto || 'Sin nombre registrado'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                  {p.estadoCivil || 'S/E'}
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500">{p.ocupacion || 'Sin ocupación'}</span>
                              </div>
                            </td>
                            
                            <td className="px-5 py-4">
                              <p className="text-xs text-slate-600 font-medium">Edad: <span className="font-bold text-slate-800">{p.edad ? `${p.edad} años` : 'N/D'}</span></p>
                              <p className="text-xs text-slate-500 mt-0.5">Sexo: {p.sexo || 'N/D'} • Hijos: {p.cantidadHijos !== null ? p.cantidadHijos : 'N/D'}</p>
                            </td>
                            
                            <td className="px-5 py-4">
                              <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-1">
                                <Phone size={13} className="text-slate-400 mt-0.5 shrink-0" />
                                <span>{p.telefonoContacto || p.telefonoCasa || 'Sin teléfono'}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-xs text-slate-500">
                                <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
                                <span className="line-clamp-1" title={p.origen}>{p.origen || 'Origen no registrado'}</span>
                              </div>
                            </td>
                            
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                                {p.sustanciaConsumo || 'No especificada'}
                              </span>
                            </td>
                            
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">Mostrando <span className="font-bold text-slate-700">{pacientesFiltrados.length}</span> pacientes en tratamiento.</p>
                  <button className="text-xs font-bold text-[#7E1D3B] hover:underline flex items-center gap-1">
                    Exportar listado <UserCheck size={14} />
                  </button>
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