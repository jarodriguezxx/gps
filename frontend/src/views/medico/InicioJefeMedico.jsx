import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart, UserPlus,
  AlertCircle, Clock, FileText, CheckCircle2, ChevronRight, 
  ActivitySquare, ShieldAlert, BarChart3
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
  
  const CAPACIDAD_TOTAL_CAMAS = 40; 
  const [stats, setStats] = useState({
    ocupacionPorcentaje: 0,
    pacientesActivos: 0,
    prospectosPendientes: 0,
    historiasPendientes: 0,
    alertasCriticas: 0
  });
  
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const cargarTablero = async () => {
      try {
        setLoading(true);
        const nuevasAlertas = [];
        let contadorHistoriasPendientes = 0;
        let contadorAlertasSeveras = 0;

        // 1. OBTENEMOS TODOS LOS PACIENTES EN UNA SOLA PETICIÓN
        const resPacientes = await fetch('http://localhost:4000/api/pacientes');
        if (!resPacientes.ok) throw new Error("Error al obtener pacientes");
        const todosLosPacientes = await resPacientes.json();

        // 2. CÁLCULO EXACTO DE PACIENTES ACTIVOS (Solo INGRESADO)
        const pacientesActivos = todosLosPacientes.filter(p => 
          (p.estadoPaciente || p.estado || '').toUpperCase() === 'INGRESADO'
        );

        // 3. CÁLCULO EXACTO DE PROSPECTOS (Solo PROSPECTO)
        const prospectos = todosLosPacientes.filter(p => 
          (p.estadoPaciente || p.estado || '').toUpperCase() === 'PROSPECTO'
        );

        // Si hay prospectos, creamos la alerta
        if (prospectos.length > 0) {
          nuevasAlertas.push({
            id: 'alerta-prospectos',
            tipo: 'Triage Pendiente',
            severidad: 'baja',
            mensaje: `Existen ${prospectos.length} candidato(s) en espera de valoración médica de viabilidad.`,
            accion: () => navigate('/medico/prospectos')
          });
        }

        // 4. AUDITORÍA CLÍNICA A LOS PACIENTES ACTIVOS
        // Usamos Promise.all para hacer las consultas en paralelo y no trabar la pantalla
        await Promise.all(pacientesActivos.map(async (p) => {
          
          // A) Revisión de Riesgo: Falta sustancia de consumo
          if (!p.sustanciaConsumo || p.sustanciaConsumo.trim() === '') {
            contadorAlertasSeveras++;
            nuevasAlertas.push({
              id: `sus-${p.id}`,
              tipo: 'Riesgo Clínico',
              severidad: 'alta',
              mensaje: `Expediente MK-${p.id}: Ingreso sin sustancia principal. Riesgo de síndrome de abstinencia no tratado.`,
              accion: () => navigate(`/medico/expedientes/${p.id}`)
            });
          }

          // B) Revisión de Historia Médica
          try {
            const hmRes = await fetch(`http://localhost:4000/api/historia-medica/paciente/${p.id}`);
            // Si el servidor responde 404 (o el JSON viene vacío), significa que NO tiene historia médica
            if (!hmRes.ok) {
              contadorHistoriasPendientes++;
              nuevasAlertas.push({
                id: `hm-${p.id}`,
                tipo: 'Incumplimiento Normativo',
                severidad: 'media',
                mensaje: `Paciente ${p.nombreCompleto} no cuenta con Historia Médica de Ingreso en el sistema.`,
                accion: () => navigate(`/medico/historia-medica`)
              });
            } else {
              const hmData = await hmRes.json();
              if (!hmData || !hmData.id) {
                contadorHistoriasPendientes++;
              }
            }
          } catch (e) {
            // Si falla la red, no sumamos falsos positivos
            console.warn(`No se pudo verificar historia de ${p.id}`);
          }
        }));

        // 5. ASIGNACIÓN FINAL DE ESTADÍSTICAS MATEMÁTICAS
        const porcentaje = Math.round((pacientesActivos.length / CAPACIDAD_TOTAL_CAMAS) * 100);

        setStats({
          ocupacionPorcentaje: porcentaje,
          pacientesActivos: pacientesActivos.length,
          prospectosPendientes: prospectos.length,
          historiasPendientes: contadorHistoriasPendientes,
          alertasCriticas: contadorAlertasSeveras
        });

        // Ordenamos la lista de alertas para que las "altas" (rojas) salgan hasta arriba
        const ordenSeveridad = { alta: 1, media: 2, baja: 3 };
        nuevasAlertas.sort((a, b) => ordenSeveridad[a.severidad] - ordenSeveridad[b.severidad]);
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
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Dirección Médica</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Sesión Activa</p>
                <p className="font-black text-slate-800">Jefatura Médica</p>
              </div>
              <div className="h-10 w-10 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center">
                <ShieldAlert size={18} className="text-[#7E1D3B]" />
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

            <main>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-800">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Censo Actual</p>
                    <BarChart3 size={16} className="text-slate-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.ocupacionPorcentaje}%</h3>
                    <p className="text-xs font-bold text-slate-500 mb-1">Ocupación</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{stats.pacientesActivos} de {CAPACIDAD_TOTAL_CAMAS} camas ocupadas</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-slate-400">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Triage Clínico</p>
                    <UserPlus size={16} className="text-slate-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.prospectosPendientes}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Candidatos pendientes de valoración</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Normatividad</p>
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.historiasPendientes}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Historias médicas faltantes</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#7E1D3B]">
                  <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest">Riesgo Clínico</p>
                    <AlertCircle size={16} className="text-[#7E1D3B]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-[#7E1D3B]">{loading ? '-' : stats.alertasCriticas}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Expedientes con omisiones severas</p>
                </div>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                      <ActivitySquare size={16} className="text-slate-500" /> Auditoría Clínica Continua
                    </h2>
                    <span className="text-[10px] font-black bg-slate-200 text-slate-700 px-2 py-1 rounded uppercase">
                      {alertas.length} Eventos Activos
                    </span>
                  </div>
                  
                  <div className="p-0 overflow-y-auto flex-1 bg-white">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                        <div className="animate-spin h-6 w-6 border-2 border-slate-800 border-t-transparent rounded-full"></div>
                        <p className="text-xs font-bold uppercase tracking-widest">Auditando Base de Datos...</p>
                      </div>
                    ) : alertas.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-8">
                        <CheckCircle2 size={40} className="text-slate-300 mb-3" />
                        <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">Sin Observaciones Clínicas</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {alertas.map(alerta => (
                          <div key={alerta.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start group">
                            <div className="pt-0.5">
                              {alerta.severidad === 'alta' && <AlertCircle size={16} className="text-[#7E1D3B]" />}
                              {alerta.severidad === 'media' && <AlertCircle size={16} className="text-amber-500" />}
                              {alerta.severidad === 'baja' && <AlertCircle size={16} className="text-slate-400" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{alerta.tipo}</p>
                              <p className="text-sm font-medium text-slate-800 leading-snug">{alerta.mensaje}</p>
                            </div>
                            <button onClick={alerta.accion} className="text-slate-400 hover:text-[#7E1D3B] p-2 transition-colors border border-transparent hover:border-slate-200 rounded" title="Revisar caso">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-[400px]">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
                    Módulos Operativos
                  </h2>
                  
                  <div className="space-y-2">
                    <button onClick={() => navigate('/medico/pacientes')} className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition-all group">
                      <div className="flex items-center gap-3">
                        <Users size={16} className="text-slate-500 group-hover:text-slate-800" />
                        <span className="text-xs font-bold text-slate-700">Censo de Pacientes</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>

                    <button onClick={() => navigate('/medico/prospectos')} className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition-all group">
                      <div className="flex items-center gap-3">
                        <Stethoscope size={16} className="text-slate-500 group-hover:text-slate-800" />
                        <span className="text-xs font-bold text-slate-700">Valoración Inicial (Triage)</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </button>

                    <button onClick={() => navigate('/medico/reportes')} className="w-full flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition-all group">
                      <div className="flex items-center gap-3">
                        <FileBarChart size={16} className="text-slate-500 group-hover:text-slate-800" />
                        <span className="text-xs font-bold text-slate-700">Inteligencia Epidemiológica</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
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