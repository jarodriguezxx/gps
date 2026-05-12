import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart,
  UserCheck, AlertTriangle, Search, Save, FileSignature, CheckCircle2, XCircle, ShoppingCart
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

// Añadimos "Valoración Inicial" a la estructura de navegación para este contexto
const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: Users,          key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Valoración Inicial',    icon: FileSignature,  key: 'valoracion',  path: '/medico/valoracion' },
  { label: 'Expedientes Clínicos',    icon: ClipboardList, key: 'expedientes',   path: '/medico/expedientes' },
  { label: 'Requisiciones',           icon: ShoppingCart,  key: 'requisiciones', path: '/medico/requisiciones' },
  { label: 'Personal Médico',         icon: Stethoscope,   key: 'personal',      path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart,  key: 'reportes',      path: '/medico/reportes' },
];

const ValoracionMedica = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeNav, setActiveNav] = useState('valoracion');
  const [prospecto, setProspecto] = useState(null);
  const [cargandoPaciente, setCargandoPaciente] = useState(true);
  const [errorPaciente, setErrorPaciente] = useState('');
  
  // Nuevos estados para control de guardado
  const [yaValorado, setYaValorado] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const cargarPaciente = async () => {
      if (!id) {
        setErrorPaciente('No se recibió el identificador del paciente.');
        setCargandoPaciente(false);
        return;
      }

      setCargandoPaciente(true);
      try {
        // 1. Cargar datos del prospecto
        const response = await fetch(`http://localhost:4000/api/pacientes/${id}`);
        if (!response.ok) throw new Error('No se pudo cargar el paciente.');
        const data = await response.json();
        setProspecto(data);

        // 2. PREGUNTAR SI YA ESTÁ VALORADO
        const valRes = await fetch(`http://localhost:4000/api/valoraciones/paciente/${id}`);
        if (valRes.ok) {
          setYaValorado(true); // ¡Ya tiene valoración!
        }
        
        setErrorPaciente('');
      } catch (error) {
        setErrorPaciente(error.message);
      } finally {
        setCargandoPaciente(false);
      }
    };

    cargarPaciente();
  }, [id]);

  const [formulario, setFormulario] = useState({
    tipoValoracion: 'PRESENCIAL',
    motivoConsulta: '',
    padecimientoActual: '',
    sintomasGenerales: '',
    tratamientosPrevios: '',
    ta: '', fc: '', fr: '', temp: '', peso: '', talla: '',
    exploracionAuscultacion: '',
    examenMental: '',
    diagnostico: '',
    pronostico: '',
    tratamientoSugerido: '',
    observaciones: '',
    dictamen: null,
    motivoRechazo: ''
  });

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.key === 'valoracion' ? `/medico/valoracion/${id}` : item.path); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const seleccionarDictamen = (dictamen) => {
    setFormulario((prev) => ({
      ...prev,
      dictamen,
      motivoRechazo: dictamen === 'RECHAZADO' ? prev.motivoRechazo : '',
    }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    // 1. Validaciones básicas antes de enviar
    if (!formulario.motivoConsulta || !formulario.padecimientoActual || !formulario.diagnostico) {
      alert("Por favor, llena los campos obligatorios: Motivo de consulta, Padecimiento y Diagnóstico.");
      return;
    }

    if (!formulario.dictamen) {
      alert('Selecciona un dictamen para continuar.');
      return;
    }

    if (formulario.dictamen === 'RECHAZADO' && !formulario.motivoRechazo.trim()) {
      alert('Captura el motivo del rechazo clínico para continuar.');
      return;
    }

    try {
      setIsSaving(true);
      const esRechazo = formulario.dictamen === 'RECHAZADO';
      const observacionesCompletas = [
        formulario.observaciones?.trim(),
        esRechazo ? `Motivo del rechazo clínico: ${formulario.motivoRechazo.trim()}` : '',
      ].filter(Boolean).join('\n\n');

      // 2. Preparamos los datos tal como los espera la entidad ValoracionMedica
      const payload = {
        tipoValoracion: formulario.tipoValoracion,
        motivoConsulta: formulario.motivoConsulta,
        padecimientoActual: formulario.padecimientoActual,
        sintomasGenerales: formulario.sintomasGenerales,
        tratamientosPrevios: formulario.tratamientosPrevios,
        ta: formulario.ta,
        fc: formulario.fc,
        fr: formulario.fr,
        temp: formulario.temp,
        peso: formulario.peso,
        talla: formulario.talla,
        exploracionAuscultacion: formulario.exploracionAuscultacion,
        examenMental: formulario.examenMental,
        diagnostico: formulario.diagnostico,
        pronostico: formulario.pronostico,
        tratamientoSugerido: formulario.tratamientoSugerido,
        observaciones: observacionesCompletas,
        esAptoParaIngreso: formulario.dictamen === 'APTO',
        medicoAsignado: "Jefe Médico", 
      };

      // 3. Enviamos la petición POST
      const response = await fetch(`http://localhost:4000/api/valoraciones/paciente/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // 4. Manejamos la respuesta
      if (response.ok) {
        if (esRechazo) {
          const estadoResponse = await fetch(`http://localhost:4000/api/pacientes/${id}/estado`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 'DENEGADO' }),
          });

          if (!estadoResponse.ok) {
            const estadoError = await estadoResponse.json().catch(() => ({}));
            throw new Error(estadoError.error || 'No se pudo actualizar el estado del paciente a DENEGADO.');
          }
        }

        alert("¡Valoración guardada correctamente! El equipo de Admisiones ya puede verla.");
        navigate('/medico/prospectos'); 
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.error || 'Verifica los datos'}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Hubo un problema de conexión con el servidor. Revisa que el backend esté encendido.");
    } finally {
      setIsSaving(false);
    }
  };

  // Clase estándar extraída de tus archivos
  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                      focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                      placeholder:text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed`;

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
                <p className="font-semibold text-slate-700">{JSON.parse(localStorage.getItem('marakame_user')||'{}').nombreCompleto||'Usuario'}</p>
                <p className="text-xs text-slate-500">{JSON.parse(localStorage.getItem('marakame_user')||'{}').puesto||'Sin puesto'}</p>
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
                
                {/* ── Mensaje de Alerta si ya fue valorado ── */}
                {yaValorado && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-amber-800">Valoración ya completada</p>
                      <p className="text-sm text-amber-700">Este prospecto ya fue evaluado. Está en espera de que Admisiones confirme su pago e ingreso.</p>
                    </div>
                  </div>
                )}

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
                        disabled={yaValorado}
                        onClick={() => setFormulario({...formulario, tipoValoracion: 'PRESENCIAL'})} 
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formulario.tipoValoracion === 'PRESENCIAL' ? 'bg-white text-[#7E1D3B] shadow-sm' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-50`}>
                        Presencial
                      </button>
                      <button 
                        type="button" 
                        disabled={yaValorado}
                        onClick={() => setFormulario({...formulario, tipoValoracion: 'TELEFONICA'})} 
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formulario.tipoValoracion === 'TELEFONICA' ? 'bg-white text-[#7E1D3B] shadow-sm' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-50`}>
                        Telefónica
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-5">
                      <h3 className="text-lg font-black text-slate-800">{prospecto?.nombreCompleto || prospecto?.nombres || 'Sin nombre registrado'}</h3>
                      <p className="text-sm font-semibold text-slate-500">
                        {prospecto?.edad ? `${prospecto.edad} años` : 'Edad N/D'} • {prospecto?.sexo || 'S/E'} • {prospecto?.estadoCivil || 'S/E'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Origen</p><p className="text-sm font-semibold text-slate-700">{prospecto?.origen || prospecto?.domicilioParticular || 'Sin dato'}</p></div>
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Residente</p><p className="text-sm font-semibold text-slate-700">{prospecto?.residente || 'S/N'}</p></div>
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Escolaridad</p><p className="text-sm font-semibold text-slate-700">{prospecto?.escolaridad || 'S/E'}</p></div>
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ocupación</p><p className="text-sm font-semibold text-slate-700">{prospecto?.ocupacion || 'No especificada'}</p></div>
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
                      <input required disabled={yaValorado} type="text" name="motivoConsulta" value={formulario.motivoConsulta} onChange={handleChange} className={inputClass} placeholder="Describa el motivo principal..." />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Padecimiento actual (Inicio y evolución) *</label>
                      <textarea required disabled={yaValorado} rows="3" name="padecimientoActual" value={formulario.padecimientoActual} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Describa el inicio y evolución del consumo..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Síntomas generales</label>
                        <textarea disabled={yaValorado} rows="3" name="sintomasGenerales" value={formulario.sintomasGenerales} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Intoxicación, abstinencia, efectos secundarios..." />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tratamientos previos</label>
                        <textarea disabled={yaValorado} rows="3" name="tratamientosPrevios" value={formulario.tratamientosPrevios} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Especifique tratamientos anteriores..." />
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
                        <input disabled={yaValorado} type="text" name={f.n} placeholder={f.p} value={formulario[f.n]} onChange={handleChange} className={`${inputClass} text-center`} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Exploración y auscultación</label>
                      <textarea disabled={yaValorado} rows="2" name="exploracionAuscultacion" value={formulario.exploracionAuscultacion} onChange={handleChange} className={`${inputClass} resize-none`} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Examen Mental (Aspecto, actitud, aliño, atención, etc.)</label>
                      <textarea disabled={yaValorado} rows="3" name="examenMental" value={formulario.examenMental} onChange={handleChange} className={`${inputClass} resize-none`} />
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
                      <textarea disabled={yaValorado} required rows="2" name="diagnostico" value={formulario.diagnostico} onChange={handleChange} className={`${inputClass} resize-none border-[#7E1D3B]/20 bg-rose-50/30`} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">4. Pronóstico</label>
                        <textarea disabled={yaValorado} rows="2" name="pronostico" value={formulario.pronostico} onChange={handleChange} className={`${inputClass} resize-none`} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">5. Tratamiento Sugerido</label>
                        <textarea disabled={yaValorado} rows="2" name="tratamientoSugerido" value={formulario.tratamientoSugerido} onChange={handleChange} className={`${inputClass} resize-none`} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Dictamen y Guardado ── */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-end">
                    
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <UserCheck size={18} className="text-[#7E1D3B]" />
                        <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Conclusión (1era Consulta)</h2>
                      </div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Observaciones Finales</label>
                      <textarea disabled={yaValorado} rows="2" name="observaciones" value={formulario.observaciones} onChange={handleChange} className={`${inputClass} resize-none`} />
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[280px] w-full md:w-auto">
                      <div className="grid gap-3">
                        <button
                          type="button"
                          disabled={yaValorado}
                          onClick={() => seleccionarDictamen('APTO')}
                          className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${formulario.dictamen === 'APTO' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'} ${yaValorado ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-emerald-600 border border-emerald-100 shrink-0">
                            <CheckCircle2 size={22} />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-wider">Apto para Ingreso</span>
                            <span className="text-[10px] font-semibold opacity-70">Habilitar pase a admisión</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          disabled={yaValorado}
                          onClick={() => seleccionarDictamen('RECHAZADO')}
                          className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${formulario.dictamen === 'RECHAZADO' ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'} ${yaValorado ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-rose-600 border border-rose-100 shrink-0">
                            <XCircle size={22} />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-wider">Rechazo Médico</span>
                            <span className="text-[10px] font-semibold opacity-70">Bloquear ingreso y registrar motivo</span>
                          </span>
                        </button>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ${formulario.dictamen === 'RECHAZADO' ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                        <label className="mt-1 block text-[11px] font-bold text-rose-700 uppercase tracking-widest mb-1.5">Motivo del Rechazo Clínico *</label>
                        <textarea
                          disabled={yaValorado}
                          rows="4"
                          name="motivoRechazo"
                          value={formulario.motivoRechazo}
                          onChange={handleChange}
                          className={`${inputClass} resize-none border-rose-200 bg-rose-50/40 focus:ring-2 focus:ring-rose-200`}
                          placeholder="Explique de forma clínica y clara el motivo del rechazo..."
                        />
                      </div>

                      <button type="submit" disabled={isSaving || yaValorado} className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#63162e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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