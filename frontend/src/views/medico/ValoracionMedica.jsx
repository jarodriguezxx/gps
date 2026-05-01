import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart,
  UserCheck, AlertTriangle, Search, Save, FileSignature
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

// Añadimos "Valoración Inicial" a la estructura de navegación para este contexto
const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Valoración Inicial',    icon: FileSignature,  key: 'valoracion',  path: '/medico/valoracion' },
  { label: 'Expedientes Clínicos',  icon: ClipboardList,  key: 'expedientes', path: '/medico/expedientes' },
  { label: 'Personal Médico',       icon: Stethoscope,    key: 'personal',    path: '/medico/personal' },
  { label: 'Reportes y Estadísticas',icon: FileBarChart,  key: 'reportes',    path: '/medico/reportes' },
];

const ValoracionMedica = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('valoracion');

  // Datos mock del prospecto a evaluar
  const [prospecto] = useState({
    nombreCompleto: "Manuel Uribe",
    edad: 22,
    sexo: "Masculino",
    origen: "Tepic, Nayarit", //[cite: 1]
    residente: "Sí", //[cite: 1]
    escolaridad: "S/E", //[cite: 1]
    ocupacion: "No especificada", //[cite: 1]
    estadoCivil: "Soltero" //[cite: 1]
  });

  const [formulario, setFormulario] = useState({
    tipoValoracion: 'PRESENCIAL', //[cite: 1]
    motivoConsulta: '', //[cite: 1]
    padecimientoActual: '', //[cite: 1]
    sintomasGenerales: '', //[cite: 1]
    tratamientosPrevios: '', //[cite: 1]
    ta: '', fc: '', fr: '', temp: '', peso: '', talla: '', //[cite: 1]
    exploracionAuscultacion: '', //[cite: 1]
    examenMental: '', //[cite: 1]
    diagnostico: '', //[cite: 1]
    pronostico: '', //[cite: 1]
    tratamientoSugerido: '', //[cite: 1]
    observaciones: '', //[cite: 1]
    esAptoParaIngreso: false
  });

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    console.log("Guardando valoración:", formulario);
    alert("Valoración guardada correctamente.");
  };

  // Clase estándar extraída de tus archivos para inputs uniformes
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

            {/* ── Main ── */}
            <main>
              <form onSubmit={handleGuardar} className="space-y-5">
                
                {/* ── Datos del Prospecto ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Hoja de Valoración Médica</h2>
                    </div>
                    
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button 
                        type="button" 
                        onClick={() => setFormulario({...formulario, tipoValoracion: 'PRESENCIAL'})} 
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formulario.tipoValoracion === 'PRESENCIAL' ? 'bg-white text-[#7E1D3B] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Presencial
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setFormulario({...formulario, tipoValoracion: 'TELEFONICA'})} 
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formulario.tipoValoracion === 'TELEFONICA' ? 'bg-white text-[#7E1D3B] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Telefónica
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-5">
                      <h3 className="text-lg font-black text-slate-800">{prospecto.nombreCompleto}</h3>
                      <p className="text-sm font-semibold text-slate-500">
                        {prospecto.edad} años • {prospecto.sexo} • {prospecto.estadoCivil}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origen</p><p className="text-sm font-semibold text-slate-700">{prospecto.origen}</p></div>
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Residente</p><p className="text-sm font-semibold text-slate-700">{prospecto.residente}</p></div>
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Escolaridad</p><p className="text-sm font-semibold text-slate-700">{prospecto.escolaridad}</p></div>
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ocupación</p><p className="text-sm font-semibold text-slate-700">{prospecto.ocupacion}</p></div>
                    </div>
                  </div>
                </section>

                {/* ── 1. Interrogatorio ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">1. Interrogatorio</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Motivo de consulta *</label>
                      <input required type="text" name="motivoConsulta" value={formulario.motivoConsulta} onChange={handleChange} className={inputClass} placeholder="Describa el motivo principal..." />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Padecimiento actual (Inicio y evolución) *</label>
                      <textarea required rows="3" name="padecimientoActual" value={formulario.padecimientoActual} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Describa el inicio y evolución del consumo..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Síntomas generales</label>
                        <textarea rows="3" name="sintomasGenerales" value={formulario.sintomasGenerales} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Intoxicación, abstinencia, efectos secundarios..." />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tratamientos previos</label>
                        <textarea rows="3" name="tratamientosPrevios" value={formulario.tratamientosPrevios} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Especifique tratamientos anteriores..." />
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── 2. Exploración Física ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">2. Exploración Física</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
                    {[{l:'T.A', n:'ta', p:'120/80'}, {l:'F.C', n:'fc', p:'80'}, {l:'F.R', n:'fr', p:'18'}, {l:'Temp', n:'temp', p:'36.5'}, {l:'Peso (kg)', n:'peso', p:'70'}, {l:'Talla (cm)', n:'talla', p:'170'}].map(f => (
                      <div key={f.n}>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{f.l}</label>
                        <input type="text" name={f.n} placeholder={f.p} value={formulario[f.n]} onChange={handleChange} className={`${inputClass} text-center`} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Exploración y auscultación</label>
                      <textarea rows="2" name="exploracionAuscultacion" value={formulario.exploracionAuscultacion} onChange={handleChange} className={`${inputClass} resize-none`} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Examen Mental (Aspecto, actitud, aliño, atención, etc.)</label>
                      <textarea rows="3" name="examenMental" value={formulario.examenMental} onChange={handleChange} className={`${inputClass} resize-none`} />
                    </div>
                  </div>
                </section>

                {/* ── 3, 4 y 5. Diagnóstico y Plan ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">3. Diagnóstico y Tratamiento</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#7E1D3B] uppercase tracking-widest mb-1.5">3. Diagnóstico *</label>
                      <textarea required rows="2" name="diagnostico" value={formulario.diagnostico} onChange={handleChange} className={`${inputClass} resize-none border-[#7E1D3B]/20 bg-rose-50/30`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">4. Pronóstico</label>
                        <textarea rows="2" name="pronostico" value={formulario.pronostico} onChange={handleChange} className={`${inputClass} resize-none`} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">5. Tratamiento Sugerido</label>
                        <textarea rows="2" name="tratamientoSugerido" value={formulario.tratamientoSugerido} onChange={handleChange} className={`${inputClass} resize-none`} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Dictamen y Guardado (Diseño claro) ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                    
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <UserCheck size={18} className="text-[#7E1D3B]" />
                        <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Conclusión (1era Consulta)</h2>
                      </div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Observaciones Finales</label>
                      <textarea rows="2" name="observaciones" value={formulario.observaciones} onChange={handleChange} className={`${inputClass} resize-none`} />
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[260px] w-full md:w-auto">
                      <label className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${formulario.esAptoParaIngreso ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                        <input type="checkbox" name="esAptoParaIngreso" checked={formulario.esAptoParaIngreso} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider">Apto para Ingreso</span>
                          <span className="text-[10px] font-semibold opacity-70">Habilitar pase a admisión</span>
                        </div>
                      </label>

                      <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#63162e] transition-colors">
                        <Save size={18} />
                        GUARDAR VALORACIÓN
                      </button>
                    </div>

                  </div>
                </section>

              </form>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ValoracionMedica;