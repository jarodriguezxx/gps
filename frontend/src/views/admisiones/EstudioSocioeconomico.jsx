import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Search, User, Briefcase, Wallet, Heart, Home, Users, Info, CheckCircle2, Circle } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const EstudioSocioeconomico = () => {
  const navigate = useNavigate();
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState('solicitante');
  const [isDirty, setIsDirty] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nombreSolicitante: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    edad: '',
    sexo: '',
    escolaridad: '',
    ocupacion: '',
    estadoCivil: '',
    direccion: '',
    telefonoCasa: '',
    telefonoCelular: '',
    habitantesDomicilio: '',
  });

  // Pestañas basadas en tu boceto
  const tabs = [
    { id: 'solicitante', label: 'Solicitante', icon: <Info size={16}/> },
    { id: 'paciente', label: 'Paciente', icon: <User size={16}/> },
    { id: 'laboral', label: 'Laboral', icon: <Briefcase size={16}/> },
    { id: 'economico', label: 'Económico', icon: <Wallet size={16}/> },
    { id: 'salud', label: 'Salud', icon: <Heart size={16}/> },
    { id: 'vivienda', label: 'Vivienda', icon: <Home size={16}/> },
    { id: 'familiar', label: 'Familiar', icon: <Users size={16}/> },
  ];

  const sectionRequiredFields = {
    solicitante: [
      'nombreSolicitante',
      'fechaNacimiento',
      'edad',
      'sexo',
      'escolaridad',
      'estadoCivil',
      'direccion',
      'telefonoCelular',
    ],
    paciente: [],
    laboral: [],
    economico: [],
    salud: [],
    vivienda: [],
    familiar: [],
  };

  const stepNumber = tabs.findIndex((tab) => tab.id === activeTab) + 1;

  const validateField = (name, value) => {
    const requiredInCurrentTab = sectionRequiredFields[activeTab]?.includes(name);
    if (requiredInCurrentTab && !String(value || '').trim()) {
      return 'Este campo es obligatorio.';
    }

    if (name === 'edad' && value && Number(value) < 0) {
      return 'La edad no puede ser negativa.';
    }

    if ((name === 'telefonoCasa' || name === 'telefonoCelular') && value && !/^[0-9\-\s()+]{7,20}$/.test(value)) {
      return 'Formato de teléfono no válido.';
    }

    return '';
  };

  const handleChange = (name, value) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const msg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const validateCurrentTab = () => {
    const reqFields = sectionRequiredFields[activeTab] || [];
    const newErrors = {};

    reqFields.forEach((name) => {
      const msg = validateField(name, formData[name]);
      if (msg) newErrors[name] = msg;
    });

    setTouched((prev) => {
      const updates = { ...prev };
      reqFields.forEach((field) => {
        updates[field] = true;
      });
      return updates;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const completedTabs = tabs.reduce((acc, tab) => {
    const fields = sectionRequiredFields[tab.id] || [];
    if (fields.length === 0) return acc;

    const done = fields.every((name) => String(formData[name] || '').trim() !== '');
    return done ? acc + 1 : acc;
  }, 0);

  const progressPercent = Math.round((completedTabs / tabs.length) * 100);

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('Tienes cambios sin guardar. ¿Deseas salir de todos modos?');
      if (!confirmed) return;
    }
    setFormData({
      nombreSolicitante: '',
      fechaNacimiento: '',
      lugarNacimiento: '',
      edad: '',
      sexo: '',
      escolaridad: '',
      ocupacion: '',
      estadoCivil: '',
      direccion: '',
      telefonoCasa: '',
      telefonoCelular: '',
      habitantesDomicilio: '',
    });
    setTouched({});
    setErrors({});
    setIsDirty(false);
    navigate('/admisiones');
  };

  const handleSaveDraft = () => {
    // Base para escalado: aquí luego se puede guardar sección por sección en backend.
    setIsDirty(false);
    window.alert(`Borrador guardado para la sección "${activeTab}".`);
  };

  const handleSaveStudy = () => {
    const isValid = validateCurrentTab();
    if (!isValid) {
      window.alert('Completa los campos obligatorios marcados antes de guardar.');
      return;
    }

    // Base para escalado: preparado para guardar expediente completo.
    setIsDirty(false);
    window.alert('Estudio guardado correctamente.');
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(126,29,59,0.10),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] flex flex-col font-sans">
      
      {/* --- HEADER DE ACCIÓN --- */}
        <header className="bg-white/95 border-b border-slate-200 px-4 py-4 md:px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm backdrop-blur">
        <div className="flex items-center gap-4">
          <img
            src={marakameLogo}
            alt="Logo Nayarit Marakame"
            className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
          />
          <div>
            <h1 className="text-xl font-black text-[#7E1D3B] uppercase tracking-tight">Estudio Socioeconómico</h1>
            <p className="text-xs text-slate-500 font-medium">Formulario de Ingreso Institucional</p>
            <p className="text-[11px] text-[#7E1D3B] font-bold uppercase tracking-[0.2em] mt-1">
              Paso {stepNumber} de {tabs.length} • {tabs[stepNumber - 1]?.label}
            </p>
          </div>
        </div>
          <div className="flex flex-wrap gap-3 justify-end">
          
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-slate-200"
          >
            <X size={18}/> Cancelar
          </button>
            <button
            onClick={handleSaveDraft}
              className="px-6 py-2 bg-white text-[#7E1D3B] border border-[#7E1D3B]/20 font-bold rounded-xl shadow-sm hover:bg-[#7E1D3B]/8 transition-all flex items-center gap-2"
          >
            <Save size={18}/> Guardar borrador
          </button>
          <button
            onClick={handleSaveStudy}
            className="px-6 py-2 bg-[#7E1D3B] text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 hover:bg-[#63162e] transition-all flex items-center gap-2"
          >
            <Save size={18}/> Guardar Estudio
          </button>
        </div>
      </header>

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* --- BUSCADOR DE SOLICITANTE --- */}
        <section className="mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7E1D3B] transition-colors" size={20}/>
            <input 
              type="text" 
              placeholder="Buscar Solicitante por Nombre o Folio..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/20 focus:border-[#7E1D3B] transition-all text-sm hover:shadow-md"
            />
          </div>
        </section>

        {/* --- NAVEGACIÓN DE PESTAÑAS (TABS) --- */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm" aria-label="Progreso por secciones">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Avance por secciones</span>
            <span>{completedTabs}/{tabs.length} completas</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-[#7E1D3B] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 mb-8 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-[#7E1D3B] text-white shadow-sm scale-[1.01]' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              {(sectionRequiredFields[tab.id]?.length ?? 0) > 0 && sectionRequiredFields[tab.id].every((field) => String(formData[field] || '').trim() !== '') ? (
                <CheckCircle2 size={14} />
              ) : (
                <Circle size={14} />
              )}
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* --- CONTENEDOR DEL FORMULARIO --- */}
          <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rose-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-14 h-32 w-32 rounded-full bg-slate-100 blur-2xl" />
          
          {/* Solo llenamos SOLICITANTE como pediste */}
          {activeTab === 'solicitante' && (
              <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <Info size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Información del Solicitante</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Captura inicial</p>
                </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup label="Nombre Completo del Solicitante" name="nombreSolicitante" value={formData.nombreSolicitante} error={errors.nombreSolicitante} required onChange={handleChange} onBlur={handleBlur} placeholder="Escribe el nombre completo..." />
                <InputGroup label="Fecha de Nacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} error={errors.fechaNacimiento} required onChange={handleChange} onBlur={handleBlur} type="date" />
                
                <InputGroup label="Lugar de Nacimiento" name="lugarNacimiento" value={formData.lugarNacimiento} error={errors.lugarNacimiento} onChange={handleChange} onBlur={handleBlur} placeholder="Estado / Municipio" />
                <InputGroup label="Edad" name="edad" value={formData.edad} error={errors.edad} required onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" />

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Sexo <span className="text-[#7E1D3B]">*</span></label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all group">
                      <input
                        type="radio"
                        name="sexo"
                        value="masculino"
                        checked={formData.sexo === 'masculino'}
                        onChange={(e) => handleChange('sexo', e.target.value)}
                        onBlur={() => handleBlur('sexo')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">Masculino</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                      <input
                        type="radio"
                        name="sexo"
                        value="femenino"
                        checked={formData.sexo === 'femenino'}
                        onChange={(e) => handleChange('sexo', e.target.value)}
                        onBlur={() => handleBlur('sexo')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">Femenino</span>
                    </label>
                  </div>
                  {errors.sexo && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.sexo}</p>}
                </div>

                <SelectGroup
                  label="Grado de Escolaridad"
                  name="escolaridad"
                  value={formData.escolaridad}
                  error={errors.escolaridad}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={['Primaria', 'Secundaria', 'Preparatoria', 'Licenciatura', 'Postgrado', 'Ninguno']}
                />
                
                <InputGroup label="Ocupación Actual" name="ocupacion" value={formData.ocupacion} error={errors.ocupacion} onChange={handleChange} onBlur={handleBlur} placeholder="A qué se dedica..." />
                <SelectGroup
                  label="Estado Civil"
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  error={errors.estadoCivil}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Unión Libre']}
                />

                <div className="md:col-span-2">
                  <InputGroup label="Dirección Actual" name="direccion" value={formData.direccion} error={errors.direccion} required onChange={handleChange} onBlur={handleBlur} placeholder="Calle, Número, Colonia, C.P." />
                </div>

                <InputGroup label="Número Telefónico (Casa)" name="telefonoCasa" value={formData.telefonoCasa} error={errors.telefonoCasa} onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />
                <InputGroup label="Teléfono Celular" name="telefonoCelular" value={formData.telefonoCelular} error={errors.telefonoCelular} required onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />

                  <div className="md:col-span-2 bg-rose-50/70 p-4 rounded-2xl border border-rose-100/70">
                   <InputGroup label="Personas que habitan en el domicilio" name="habitantesDomicilio" value={formData.habitantesDomicilio} error={errors.habitantesDomicilio} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. 4 personas (Padres y hermanos)" />
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'solicitante' && (
            <div className="p-20 text-center flex flex-col items-center justify-center text-slate-300 bg-slate-50/40">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <ClipboardList size={48}/>
              </div>
              <p className="font-bold uppercase tracking-widest text-sm">Próximamente</p>
              <p className="text-xs">Esta sección se activará al recibir los requerimientos.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- COMPONENTES AUXILIARES PARA LIMPIEZA ---
const InputGroup = ({ label, placeholder, type = 'text', name, value, required = false, error, onChange, onBlur }) => (
  <div className="flex flex-col">
    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5 ml-1 tracking-widest" htmlFor={name}>
      {label} {required && <span className="text-[#7E1D3B]">*</span>}
    </label>
    <input 
      id={name}
      name={name}
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full bg-slate-50 border p-3.5 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 transition-all font-medium hover:border-slate-200 min-h-[48px] ${
        error
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
          : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
      }`}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs font-semibold text-rose-700">
        {error}
      </p>
    )}
  </div>
);

const SelectGroup = ({ label, options, name, value, required = false, error, onChange, onBlur }) => (
  <div className="flex flex-col">
    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5 ml-1 tracking-widest" htmlFor={name}>
      {label} {required && <span className="text-[#7E1D3B]">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full bg-slate-50 border p-3.5 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 transition-all font-medium appearance-none cursor-pointer hover:border-slate-200 min-h-[48px] ${
        error
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
          : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
      }`}
    >
      <option value="">Seleccionar...</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs font-semibold text-rose-700">
        {error}
      </p>
    )}
  </div>
);

const ClipboardList = ({size}) => <Users size={size}/>;

export default EstudioSocioeconomico;