import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, UserPlus, UserMinus, Tag, ShieldCheck } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',      icon: UserPlus,   key: 'alta' },
  { label: 'Baja de Personal',      icon: UserMinus,  key: 'baja' },
  { label: 'Catálogo de Roles',     icon: Tag,        key: 'catalogo' },
  { label: 'Asignación de Roles',   icon: ShieldCheck,key: 'asignacion' },
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

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    {Icon && <Icon size={15} className="text-[#7E1D3B]" />}
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const AltaPersonal = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('alta');
  const [sexo, setSexo] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img
                src={marakameLogo}
                alt="Logo Nayarit Marakame"
                className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo de Recursos Humanos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <span className="text-sm font-black text-[#7E1D3B]">RH</span>
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Recursos Humanos</p>
              </div>
            </div>
          </div>

          {/* ── Layout: sidebar + main ── */}
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* ── Sidebar nav ── */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key }) => (
                <button
                  key={key}
                  onClick={() => setActiveNav(key)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </aside>

            {/* ── Main form ── */}
            <main className="space-y-5">

              {/* Page title */}
              <div>
                <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Alta de Personal</p>
              </div>

              {/* ── Datos Personales ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Datos Personales" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="Nombre (s)"        required />
                  <InputField label="Apellido Paterno"  required />
                  <InputField label="Apellido Materno"  required />
                  <InputField label="CURP"              required />
                  <InputField label="RFC"               required />
                  <InputField label="Fecha de Nacimiento" required type="date" />

                  {/* Sexo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Sexo<span className="text-[#7E1D3B] ml-0.5">*</span>
                    </label>
                    <div className="flex flex-col gap-1.5 pt-1">
                      {['Masculino', 'Femenino', 'Indistinto'].map((op) => (
                        <label key={op} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="sexo"
                            value={op}
                            checked={sexo === op}
                            onChange={() => setSexo(op)}
                            className="accent-[#7E1D3B] w-3.5 h-3.5"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Estado Civil */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Estado Civil<span className="text-[#7E1D3B] ml-0.5">*</span>
                    </label>
                    <div className="flex flex-col gap-1.5 pt-1">
                      {['Soltera/o', 'Casada/o', 'Otro'].map((op) => (
                        <label key={op} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="estadoCivil"
                            value={op}
                            checked={estadoCivil === op}
                            onChange={() => setEstadoCivil(op)}
                            className="accent-[#7E1D3B] w-3.5 h-3.5"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── Contacto + Datos del Puesto ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Contacto */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <SectionTitle title="Contacto" />
                  <div className="grid grid-cols-1 gap-4">
                    <InputField label="Teléfono"          required type="tel" />
                    <InputField label="Correo Electrónico" required type="email" />
                    <InputField label="Domicilio"          required />
                  </div>
                </section>

                {/* Datos del Puesto */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <SectionTitle title="Datos del Puesto" />
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Departamento"  required />
                      <InputField label="Puesto / Rol"  required />
                    </div>
                    <InputField label="Fecha de Ingreso"      required type="date" />
                    <InputField label="Tipo de Contrato"      required />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Escolaridad"         required />
                      <InputField label="Años de Experiencia" type="number" />
                    </div>
                  </div>
                </section>
              </div>

              {/* ── Actions ── */}
              <div className="flex justify-end gap-3 pb-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold shadow-sm text-sm"
                >
                  <X size={16} /> Cancelar
                </button>
                <button className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                  <Save size={16} /> Registrar Personal
                </button>
              </div>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default AltaPersonal;