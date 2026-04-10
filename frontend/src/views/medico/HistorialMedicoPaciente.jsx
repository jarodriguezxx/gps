import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, ClipboardList, ShieldAlert, Users, Stethoscope, BookOpen,
  Save, Upload, Eye, Download, FileText, Activity, Utensils, FlaskConical,
  User, AlertCircle
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio',                       icon: Home,          key: 'inicio',          path: '/medico' },
  { label: 'Historial Médico del paciente', icon: ClipboardList, key: 'historial-pac',   path: '/medico/historial-paciente' },
  { label: 'Valoracion Estado físico',      icon: Activity,      key: 'valoracion',      path: '/medico/valoracion-estado' },
  { label: 'Expedientes',                   icon: FileText,      key: 'expedientes',     path: '/medico/expedientes' },
  { label: 'Historial de evaluaciones',     icon: ClipboardList, key: 'historial-eval',  path: '/medico/historial-evaluaciones' },
  { label: 'Historial de protocolos',       icon: BookOpen,      key: 'historial-proto', path: '/medico/historial-protocolos' },
];

const pacienteMock = {
  nombre:    'Juan Carlos Ramírez López',
  expediente:'EXP-2026-001',
  edad:      '28 años',
  habitacion:'Hab. 12 - Grupo A',
};

const diagnosticos = [
  { codigo: 'F10.2', descripcion: 'Síndrome de dependencia al alcohol', tipo: 'CIE-10', color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { codigo: 'F41.1', descripcion: 'Trastorno de ansiedad generalizada',  tipo: 'CIE-10', color: 'bg-sky-50 border-sky-200 text-sky-800' },
];

const signosVitales = [
  { label: 'Presión Arterial',    valor: '120/80 mmHg' },
  { label: 'Frecuencia Cardíaca', valor: '72 lpm' },
  { label: 'Temperatura',         valor: '36.5 °C' },
  { label: 'Saturación O₂',       valor: '98%' },
];

const notasMock = [
  { fecha: '30/03/2026', hora: '10:20', texto: 'Paciente muestra mejoría en sintomatología ansiosa. Continúa con tratamiento farmacológico.', doctor: 'Dr. Juan Pérez' },
  { fecha: '29/03/2026', hora: '14:15', texto: 'Se realizó ajuste en dieta nutricional. Plan alimenticio aprobado por nutrición.',             doctor: 'Dr. Juan Pérez' },
];

const seccionesDoc = [
  { key: 'psiquiatrica', label: 'Valoración Psiquiátrica',  icon: User,        archivo: 'valoracion_psiquiatrica_001.pdf', fecha: '2025-01-23' },
  { key: 'nutricional',  label: 'Valoración Nutricional',   icon: Utensils,    archivo: 'valoracion_nutricional_001.pdf',  fecha: '2024-01-27' },
  { key: 'estudios',     label: 'Análisis y Estudios',      icon: FlaskConical, archivo: 'analisis_sangre_001.pdf',        fecha: '2024-01-27' },
];

const HistorialMedicoPaciente = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]   = useState('historial-pac');
  const [busqueda, setBusqueda]     = useState('');
  const [paciente]                  = useState(pacienteMock);
  const [nuevaNota, setNuevaNota]   = useState('');
  const [notas, setNotas]           = useState(notasMock);

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const guardarNota = () => {
    if (!nuevaNota.trim()) return;
    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora  = hoy.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    setNotas(prev => [{ fecha, hora, texto: nuevaNota, doctor: 'Dr. Juan Pérez' }, ...prev]);
    setNuevaNota('');
  };

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
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Médico</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Stethoscope size={16} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Médico</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* ── Sidebar ── */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <Icon size={15} className="shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            {/* ── Main ── */}
            <main className="space-y-5">

              {/* Título + buscador */}
              <div>
                <h2 className="text-2xl font-black text-slate-800">Módulo Médico</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide mb-3">Historial Médico del Paciente</p>
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Nombre o expediente..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                               placeholder:text-slate-300 transition-all shadow-sm"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </div>
              </div>

              {/* ── Información del Paciente ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={15} className="text-[#7E1D3B]" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Información del Paciente</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Nombre',      valor: paciente.nombre },
                    { label: 'Expediente',  valor: paciente.expediente },
                    { label: 'Edad',        valor: paciente.edad },
                    { label: 'Habitación',  valor: paciente.habitacion },
                  ].map(({ label, valor }) => (
                    <div key={label}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-800">{valor}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Dos columnas ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Columna izquierda — documentos */}
                <div className="space-y-4">
                  {seccionesDoc.map(({ key, label, icon: Icon, archivo, fecha }) => (
                    <section key={key} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Icon size={15} className="text-[#7E1D3B]" />
                          <h3 className="text-sm font-black text-slate-700">{label}</h3>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white
                                           rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm">
                          <Upload size={12} /> Subir
                        </button>
                      </div>
                      {/* Archivo adjunto */}
                      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-[#7E1D3B] shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{archivo}</p>
                            <p className="text-[10px] text-slate-400">{fecha}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-slate-400 hover:text-slate-600 transition"><Eye size={14} /></button>
                          <button className="text-slate-400 hover:text-slate-600 transition"><Download size={14} /></button>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>

                {/* Columna derecha — signos, diagnóstico, notas */}
                <div className="space-y-4">

                  {/* Signos Vitales */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity size={15} className="text-[#7E1D3B]" />
                      <h3 className="text-sm font-black text-slate-700">Signos Vitales (Últimas 24 hrs)</h3>
                    </div>
                    <div className="space-y-2">
                      {signosVitales.map(({ label, valor }) => (
                        <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <span className="text-sm text-slate-500">{label}</span>
                          <span className="text-sm font-bold text-slate-800">{valor}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 w-full text-xs font-semibold text-[#7E1D3B] hover:underline transition text-center">
                      Ver Historial Completo
                    </button>
                  </section>

                  {/* Diagnóstico Actual */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle size={15} className="text-[#7E1D3B]" />
                      <h3 className="text-sm font-black text-slate-700">Diagnóstico Actual</h3>
                    </div>
                    <div className="space-y-2">
                      {diagnosticos.map(({ codigo, descripcion, tipo, color }) => (
                        <div key={codigo} className={`px-3 py-2.5 rounded-xl border text-sm ${color}`}>
                          <span className="font-bold">{codigo}</span> · {descripcion}
                          <span className="ml-2 text-[10px] font-semibold opacity-60">{tipo}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Notas Médicas Recientes */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText size={15} className="text-[#7E1D3B]" />
                      <h3 className="text-sm font-black text-slate-700">Notas Médicas Recientes</h3>
                    </div>
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
                      {notas.map((n, i) => (
                        <div key={i} className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-[#7E1D3B]">{n.fecha}</span>
                            <span className="text-[10px] text-slate-400">{n.hora}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{n.texto}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{n.doctor}</p>
                        </div>
                      ))}
                    </div>

                    {/* Agregar nota */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Agregar Nota Médica
                      </label>
                      <textarea
                        rows={3}
                        value={nuevaNota}
                        onChange={e => setNuevaNota(e.target.value)}
                        placeholder="Escribe la nota médica..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm resize-none
                                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                   placeholder:text-slate-300 transition-all mb-3"
                      />
                      <div className="flex justify-end">
                        <button onClick={guardarNota}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                                     font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                          <Save size={15} /> Guardar
                        </button>
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default HistorialMedicoPaciente;