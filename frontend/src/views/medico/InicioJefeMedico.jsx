import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart, UserPlus,
  AlertTriangle, TrendingUp, Clock, FileText, CheckCircle2, ChevronRight, FileWarning
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Historia Médica',       icon: FileText,       key: 'historia',    path: '/medico/historia-medica' },
  { label: 'Expedientes Clínicos',  icon: ClipboardList,  key: 'expedientes', path: '/medico/expedientes' },
  { label: 'Personal Médico',       icon: Stethoscope,    key: 'personal',    path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart, key: 'reportes',    path: '/medico/reportes' },
];

const InicioJefeMedico = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('inicio');
  const [loading, setLoading] = useState(true);
  
  // Estados para nuestros datos reales
  const [stats, setStats] = useState({
    activos: 0,
    prospectos: 0,
    expedientesIncompletos: 0,
    notasHoy: 0
  });
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const cargarTablero = async () => {
      try {
        setLoading(true);
        const nuevasAlertas = [];
        let contadorIncompletos = 0;

        // 1. CARGAMOS PACIENTES REALES
        const resPacientes = await fetch('http://localhost:4000/api/pacientes');
        let pacientesActivos = [];
        if (resPacientes.ok) {
          const pacientes = await resPacientes.json();
          pacientesActivos = pacientes.filter(p => (p.estadoPaciente || p.estado || '').toUpperCase() === 'INGRESADO');
          
          // Auditoría automática de expedientes
          pacientesActivos.forEach(p => {
            let faltaDato = false;
            if (!p.sustanciaConsumo) {
              faltaDato = true;
              nuevasAlertas.push({
                id: `sus-${p.id}`,
                tipo: 'Auditoría Clínica',
                severidad: 'alta',
                mensaje: `El paciente ${p.nombreCompleto} ingresó sin sustancia principal registrada.`,
                accion: () => navigate(`/medico/expedientes/${p.id}`)
              });
            }
            if (!p.edad || !p.telefonoContacto) {
              faltaDato = true;
              nuevasAlertas.push({
                id: `dat-${p.id}`,
                tipo: 'Expediente',
                severidad: 'media',
                mensaje: `Faltan datos personales (Edad o Teléfono) en el expediente de ${p.nombreCompleto}.`,
                accion: () => navigate(`/medico/expedientes/${p.id}`)
              });
            }
            if (faltaDato) contadorIncompletos++;
          });
        }

        // 2. CARGAMOS PROSPECTOS REALES
        let conteoProspectos = 0;
        try {
          const resProspectos = await fetch('http://localhost:4000/api/prospectos');
          if (resProspectos.ok) {
            const prospectos = await resProspectos.json();
            // Asumimos que los que importan son los que no han sido ingresados
            const prospectosPendientes = prospectos.filter(p => (p.estado || '').toUpperCase() !== 'INGRESADO');
            conteoProspectos = prospectosPendientes.length;
            
            if (conteoProspectos > 0) {
              nuevasAlertas.unshift({ // Ponemos esta alerta al principio
                id: 'alerta-prospectos',
                tipo: 'Valoración Pendiente',
                severidad: 'alta',
                mensaje: `Tienes ${conteoProspectos} prospecto(s) en espera de valoración médica para su ingreso.`,
                accion: () => navigate('/medico/prospectos')
              });
            }
          }
        } catch (e) { console.log("No se pudo cargar prospectos, omitiendo por ahora."); }

        // Actualizamos nuestro tablero
        setStats({
          activos: pacientesActivos.length,
          prospectos: conteoProspectos,
          expedientesIncompletos: contadorIncompletos,
          notasHoy: 0 // Este lo dejaremos en 0 temporalmente hasta hacer el endpoint de "Contar Notas"
        });

        setAlertas(nuevasAlertas);

      } catch (error) {
        console.error("Error cargando tablero:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarTablero();
  }, [navigate]);

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
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
            {/* Sidebar */}
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

            {/* Main Content */}
            <main>
              {/* Tarjetas de Estadísticas (KPIs Reales) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-emerald-300 transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                      <Users size={20} />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <TrendingUp size={12}/> Ocupación
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.activos}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Pacientes en Piso</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-amber-300 transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
                      <Clock size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.prospectos}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Prospectos Pendientes</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-rose-300 transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-rose-100 p-2.5 rounded-xl text-rose-700">
                      <FileWarning size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-rose-600">{loading ? '-' : stats.expedientesIncompletos}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Expedientes c/ Faltantes</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-sky-300 transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-sky-100 p-2.5 rounded-xl text-sky-700">
                      <FileText size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.notasHoy}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Notas Clínicas Hoy</p>
                  </div>
                </div>

              </div>

              {/* Sección Inferior: Alertas y Accesos */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Panel de Alertas */}
                <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                  <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-1 rounded-full bg-rose-500" />
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Supervisión Médica Automática</h2>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {alertas.length} Observaciones
                    </span>
                  </div>
                  
                  <div className="p-5 overflow-y-auto flex-1 space-y-3 bg-slate-50">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                        <div className="animate-spin h-8 w-8 border-4 border-[#7E1D3B] border-t-transparent rounded-full"></div>
                        <p className="text-sm font-medium">Auditando expedientes clínicos...</p>
                      </div>
                    ) : alertas.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-500 mt-8">
                        <CheckCircle2 size={48} className="text-emerald-400 mb-3" />
                        <p className="font-bold text-slate-700">Control Clínico Perfecto</p>
                        <p className="text-sm mt-1">Todos los expedientes están completos y sin alertas.</p>
                      </div>
                    ) : (
                      alertas.map(alerta => (
                        <div key={alerta.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex gap-4 items-start hover:border-rose-200 transition-colors">
                          <div className={`p-2 rounded-lg mt-0.5 ${
                            alerta.severidad === 'alta' ? 'bg-rose-100 text-rose-600' : 
                            alerta.severidad === 'media' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <AlertTriangle size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{alerta.tipo}</p>
                            <p className="text-sm font-bold text-slate-700 leading-snug">{alerta.mensaje}</p>
                          </div>
                          <button onClick={alerta.accion} className="text-[#7E1D3B] bg-[#7E1D3B]/5 hover:bg-[#7E1D3B]/10 p-2 rounded-lg transition-colors" title="Ir al Expediente">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Accesos Rápidos */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[400px]">
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 mb-5 border-b border-slate-100 pb-3">Accesos Rápidos</h2>
                  
                  <div className="space-y-3">
                    <button onClick={() => navigate('/medico/pacientes')} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#7E1D3B]/40 hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                          <FileText size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Pacientes Activos</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-[#7E1D3B]" />
                    </button>

                    <button onClick={() => navigate('/medico/prospectos')} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#7E1D3B]/40 hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                          <Stethoscope size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Valorar Prospectos</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-[#7E1D3B]" />
                    </button>

                    <button onClick={() => navigate('/medico/reportes')} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#7E1D3B]/40 hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-50 p-2 rounded-lg text-amber-600 group-hover:bg-amber-100 transition-colors">
                          <FileBarChart size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Generar Reporte Mensual</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-[#7E1D3B]" />
                    </button>
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

export default InicioJefeMedico;