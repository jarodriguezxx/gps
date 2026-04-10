import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ClipboardList, ShieldAlert, Users, Stethoscope, BookOpen, Save } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio',                      icon: Home,          key: 'inicio',          path: '/medico' },
  { label: 'Historial de evaluaciones',   icon: ClipboardList, key: 'historial-eval',  path: '/medico/historial-evaluaciones' },
  { label: 'Protocolo de desintoxicación',icon: ShieldAlert,   key: 'protocolo',       path: '/medico/protocolo-desintoxicacion' },
  { label: 'Pacientes activos',           icon: Users,         key: 'pacientes',       path: '/medico/pacientes-activos' },
  { label: 'Evaluación médica',           icon: Stethoscope,   key: 'evaluacion',      path: '/medico/evaluacion-medica' },
  { label: 'Historial de protocolos',     icon: BookOpen,      key: 'historial-proto', path: '/medico/historial-protocolos' },
];

const InputField = ({ label, required, type = 'text', placeholder = '', colSpan = '' }) => (
  <div className={colSpan}>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
      {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                 placeholder:text-slate-300 transition-all"
    />
  </div>
);

const TextAreaField = ({ label, required, rows = 4, colSpan = '' }) => (
  <div className={colSpan}>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
      {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
    </label>
    <textarea
      rows={rows}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 resize-none
                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                 placeholder:text-slate-300 transition-all"
    />
  </div>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const EvaluacionEnfermeria = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('evaluacion');

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    navigate(item.path);
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
                <p className="font-semibold text-slate-700">Enfermero</p>
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

              {/* Título */}
              <div>
                <h2 className="text-2xl font-black text-slate-800">Módulo Médico</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Evaluación de enfermería</p>
              </div>

              {/* ── Datos del paciente ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Datos del Paciente" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InputField label="Nombre"          required colSpan="col-span-2 md:col-span-1" />
                  <InputField label="Fecha de Ingreso" required type="date" />
                  <InputField label="Edad"             required type="number" />
                  <InputField label="Clave"            required />
                </div>
              </section>

              {/* ── Somatometría ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Somatometría" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <InputField label="Tensión arterial (mmHg)" required />
                  <InputField label="Peso (kg)"               required type="number" />
                  <InputField label="Pulso (lpm)"             required type="number" />
                  <InputField label="Talla (cm)"              required type="number" />
                  <InputField label="Respiración (rpm)"       required type="number" />
                  <InputField label="Temperatura (C°)"        required type="number" />
                  <InputField label="Última visita médica"    type="date" />
                  <InputField label="Resultado del toxicólogo" />
                </div>
              </section>

              {/* ── Antecedentes médicos ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Antecedentes Médicos" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Columna izquierda */}
                  <div className="space-y-4">
                    <TextAreaField label="Problema(s) médico(s) presente(s)" required rows={4} />
                    <TextAreaField label="Problema(s) médico(s) pasado(s)"   rows={4} />
                    <TextAreaField label="Alergias (medicamentos o alimentos)" rows={4} />
                  </div>

                  {/* Columna central */}
                  <div className="space-y-4">
                    <TextAreaField label="Problemas oculares"   rows={4} />
                    <TextAreaField label="Problemas auditivos"  rows={4} />
                    <TextAreaField label="Problemas dentales"   rows={4} />
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-4">
                    <TextAreaField label="Medicamentos presentes" required rows={4} />

                    {/* Botón guardar alineado abajo a la derecha */}
                    <div className="flex justify-end pt-2">
                      <button className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                                         font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                        <Save size={16} /> Guardar evaluación
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

export default EvaluacionEnfermeria;