import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart,
  Search, Phone, MapPin, Calendar, FileSignature, UserPlus, ArrowRight, ShoppingCart
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

// Menú actualizado con "Prospectos" en lugar de la valoración directa
const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Expedientes Clínicos',    icon: ClipboardList, key: 'expedientes',   path: '/medico/expedientes' },
  { label: 'Requisiciones',           icon: ShoppingCart,  key: 'requisiciones', path: '/medico/requisiciones' },
  { label: 'Personal Médico',         icon: Stethoscope,   key: 'personal',      path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart,  key: 'reportes',      path: '/medico/reportes' },
];

const DirectorioProspectos = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('prospectos');
  const [busqueda, setBusqueda] = useState('');
  const [prospectos, setProspectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/pacientes');
      if (response.ok) {
        const data = await response.json();
        setProspectos(data);
      } else {
        console.error('Error al obtener prospectos');
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

  const esProspecto = (paciente) => {
    const estado = (paciente.estadoPaciente || paciente.estado || 'PROSPECTO').toUpperCase();
    return estado === 'PROSPECTO';
  };

  const prospectosPendientes = prospectos.filter(esProspecto);

  const prospectosFiltrados = prospectosPendientes.filter((p) => {
    const termino = busqueda.toLowerCase();
    return (
      (p.nombreCompleto && p.nombreCompleto.toLowerCase().includes(termino)) ||
      (p.origen && p.origen.toLowerCase().includes(termino)) ||
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
                  type="button" 
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

            {/* ── Main: Tabla de Prospectos ── */}
            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Prospectos en Evaluación</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Personas con estado PROSPECTO en la base de datos</p>
                    </div>
                  </div>

                  <div className="relative md:w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar prospecto..." 
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className={`${inputClass} pl-9 py-2 text-xs`} 
                    />
                  </div>
                </div>
                
                {/* Tabla */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Prospecto</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Contacto / Origen</th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Registro</th>
                        <th className="px-5 py-3.5 text-right text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="px-5 py-12 text-center text-slate-500">
                            Cargando prospectos desde el servidor...
                          </td>
                        </tr>
                      ) : prospectosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-5 py-12 text-center text-slate-500">
                            No hay pacientes con estado PROSPECTO en este momento.
                          </td>
                        </tr>
                      ) : (
                        prospectosFiltrados.map((p, i) => (
                          <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                            
                            {/* Datos Básicos */}
                            <td className="px-5 py-4">
                              <p className="font-bold text-slate-800">{p.nombreCompleto || 'Sin nombre registrado'}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{p.edad ? `${p.edad} años` : 'Edad N/D'} • {p.sexo || 'S/E'}</p>
                            </td>
                            
                            {/* Contacto */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                                <Phone size={13} className="text-slate-400" />
                                <span>{p.telefonoContacto || p.telefonoCasa || 'Sin teléfono'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <MapPin size={13} className="text-slate-400" />
                                <span>{p.origen || p.domicilioParticular || 'Origen no registrado'}</span>
                              </div>
                            </td>
                            
                            {/* Fecha */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                <Calendar size={13} className="text-slate-400" />
                                <span>{p.fechaRegistro || p.createdAt || 'Sin fecha'}</span>
                              </div>
                            </td>
                            
                            {/* Botón de Acción */}
                            <td className="px-5 py-4 text-right">
                              {/* AQUÍ ESTÁ LA MAGIA DE LA NAVEGACIÓN */}
                              <button 
                                onClick={() => navigate(`/medico/valoracion/${p.id}`)}
                                className="inline-flex items-center gap-2 bg-rose-50 text-[#7E1D3B] hover:bg-[#7E1D3B] hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-rose-100 shadow-sm"
                              >
                                <FileSignature size={14} />
                                Iniciar Valoración
                              </button>
                            </td>
                            
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-500 font-medium">Mostrando <span className="font-bold text-slate-700">{prospectosFiltrados.length}</span> prospectos con estado PROSPECTO.</p>
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default DirectorioProspectos;