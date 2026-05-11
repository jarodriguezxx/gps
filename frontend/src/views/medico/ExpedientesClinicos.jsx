import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart,
  Search, Filter, Phone, ArrowRight, User, AlertTriangle,
  ChevronDown, ChevronUp, Briefcase, MapPin, UserPlus, ShoppingCart
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Expedientes Clínicos',    icon: ClipboardList, key: 'expedientes',   path: '/medico/expedientes' },
  { label: 'Requisiciones',           icon: ShoppingCart,  key: 'requisiciones', path: '/medico/requisiciones' },
  { label: 'Personal Médico',         icon: Stethoscope,   key: 'personal',      path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart,  key: 'reportes',      path: '/medico/reportes' },
];

const ExpedientesClinicos = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('expedientes');
  const [busqueda, setBusqueda] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar qué fila está expandida
  const [expandidoId, setExpandidoId] = useState(null);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/pacientes');
      if (response.ok) {
        const data = await response.json();
        setPacientes(data);
      } else {
        console.error('Error al obtener expedientes');
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

  const toggleExpandir = (id) => {
    setExpandidoId(expandidoId === id ? null : id);
  };

  // 1. Primero filtramos para que SOLO aparezcan los que ya ingresaron o egresaron
  const expedientesValidos = pacientes.filter(p => {
    const estado = (p.estadoPaciente || p.estado || '').toUpperCase();
    return estado === 'INGRESADO' || estado === 'EGRESO';
  });

  // 2. Luego aplicamos el buscador sobre esos válidos
  const expedientesFiltrados = expedientesValidos.filter(p => {
    const termino = busqueda.toLowerCase();
    const idStr = p.id ? p.id.toString() : '';
    return (
      (p.nombreCompleto && p.nombreCompleto.toLowerCase().includes(termino)) ||
      idStr.includes(termino) ||
      (p.sustanciaConsumo && p.sustanciaConsumo.toLowerCase().includes(termino))
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

            {/* ── Main: Directorio Expandible ── */}
            <main className="space-y-5">
              
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                
                {/* Cabecera de Búsqueda */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Directorio de Expedientes</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Seleccione un paciente para ver su resumen o abrir su historial</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, folio o sustancia..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className={`${inputClass} pl-9 py-2 text-xs`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Lista Expandible */}
                <div className="flex flex-col bg-slate-50">
                  {/* Encabezados de Lista */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 bg-white">
                    <div className="col-span-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Folio</div>
                    <div className="col-span-4 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Paciente</div>
                    <div className="col-span-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Sustancia Principal</div>
                    <div className="col-span-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 text-right pr-4">Acción</div>
                  </div>

                  {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm bg-white">
                      <div className="animate-spin h-6 w-6 border-2 border-[#7E1D3B] border-t-transparent rounded-full mx-auto mb-3"></div>
                      Cargando expedientes...
                    </div>
                  ) : expedientesFiltrados.length === 0 ? (
                    <div className="py-12 text-center bg-white">
                      <ClipboardList size={32} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium text-sm">No se encontraron expedientes oficiales.</p>
                    </div>
                  ) : (
                    expedientesFiltrados.map((p) => {
                      const folio = p.id ? `MK-${p.id.toString().padStart(4, '0')}` : 'S/F';
                      const isExpanded = expandidoId === p.id;
                      
                      return (
                        <div key={p.id} className="bg-white border-b border-slate-200 last:border-b-0">
                          
                          {/* Fila Principal (Siempre visible) */}
                          <button 
                            onClick={() => toggleExpandir(p.id)}
                            className={`w-full text-left grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center transition-colors ${isExpanded ? 'bg-[#7E1D3B]/5' : 'hover:bg-slate-50'}`}
                          >
                            <div className="md:col-span-2 flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isExpanded ? 'bg-[#7E1D3B] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <User size={14} />
                              </div>
                              <span className="font-bold text-[#7E1D3B] text-sm">{folio}</span>
                            </div>
                            
                            <div className="md:col-span-4">
                              <p className="font-bold text-slate-800 text-sm truncate">{p.nombreCompleto || 'Sin nombre registrado'}</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{p.sexo || 'S/E'} • {p.edad ? `${p.edad} años` : 'Edad N/D'}</p>
                            </div>

                            <div className="md:col-span-3">
                              {p.sustanciaConsumo ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold truncate max-w-full">
                                  <AlertTriangle size={12} className="shrink-0" />
                                  <span className="truncate">{p.sustanciaConsumo}</span>
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 italic">No especificada</span>
                              )}
                            </div>

                            <div className="md:col-span-3 flex justify-end items-center gap-2 text-slate-400 pr-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider hidden md:inline">
                                {isExpanded ? 'Ocultar Resumen' : 'Ver Resumen'}
                              </span>
                              {isExpanded ? <ChevronUp size={18} className="text-[#7E1D3B]" /> : <ChevronDown size={18} />}
                            </div>
                          </button>

                          {/* Panel Expandido (Resumen Clínico Rápido) */}
                          {isExpanded && (
                            <div className="bg-slate-50 px-6 py-5 border-t border-[#7E1D3B]/10 grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-inner">
                              
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-2">Datos de Contacto</h4>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone size={14} className="text-slate-400" />
                                  <span className="font-medium text-slate-700">{p.telefonoContacto || p.telefonoCasa || 'No registrado'}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                  <span className="font-medium text-slate-700 line-clamp-2" title={p.domicilioParticular}>
                                    {p.domicilioParticular || p.origen || 'Sin domicilio registrado'}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-2">Perfil Socioeconómico</h4>
                                <div className="flex items-center gap-2 text-sm">
                                  <Briefcase size={14} className="text-slate-400" />
                                  <span className="font-medium text-slate-700">{p.ocupacion || 'Sin ocupación'}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-slate-500 mr-2">Estado Civil:</span>
                                  <span className="font-medium text-slate-700">{p.estadoCivil || 'S/E'}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-slate-500 mr-2">Escolaridad:</span>
                                  <span className="font-medium text-slate-700">{p.escolaridad || 'S/E'}</span>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center border-l border-slate-200 pl-6">
                                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                  Acceda al expediente completo para visualizar el historial de notas, seguimientos y estudios socioeconómicos en PDF.
                                </p>
                                <button 
                                  onClick={() => navigate(`/medico/expedientes/${p.id}`)}
                                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#7E1D3B] text-white rounded-xl font-bold shadow-sm hover:bg-[#63162e] transition-colors text-sm"
                                >
                                  Abrir Expediente Completo <ArrowRight size={16} />
                                </button>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">Resultados: <span className="font-bold text-slate-700">{expedientesFiltrados.length}</span> expedientes oficiales.</p>
                </div>

              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ExpedientesClinicos;