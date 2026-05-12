import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, Save, FileText, Activity, HeartPulse, BrainCircuit, Users, ChevronRight, ChevronLeft,
  History as HistoryIcon, ClipboardList, FileBarChart, UserPlus, CheckCircle, ShoppingCart
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Historia Médica',       icon: FileText,       key: 'historia',    path: '/medico/historia-medica' },
  { label: 'Expedientes Clínicos',    icon: ClipboardList, key: 'expedientes',   path: '/medico/expedientes' },
  { label: 'Requisiciones',           icon: ShoppingCart,  key: 'requisiciones', path: '/medico/requisiciones' },
  { label: 'Personal Médico',         icon: Stethoscope,   key: 'personal',      path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart,  key: 'reportes',      path: '/medico/reportes' },
];

const emptyFormData = {
  datosGenerales: {
    fecha: new Date().toISOString().split('T')[0],
    nombre: '', expediente: '', edad: '', sexo: '', estadoCivil: '',
    religion: '', lugarResidencia: '', lugarOrigen: '', ocupacion: '', escolaridad: ''
  },
  historiaConsumo: '',
  antecedentes: {
    alergias: '', enfermedades: '', quirurgicos: '', transfusiones: '',
    sexuales: { parejas: '', venereas: '', metodos: '', disfuncion: false, aceptaVIH: null },
    suicidas: { ideas: '', planes: '' }, familiares: { padre: '', madre: '', hermanos: '', esposa: '', hijos: '' }
  },
  interrogatorio: {
    cabeza: { cefalea: false, lentes: false, fosfenos: false, visionBorrosa: false, tinitus: false, epistaxis: false },
    cardio: { palpitaciones: false, dolorPrecordial: false, edema: false, tosSeca: false, disnea: false, mareos: false, hipertension: false, expectoracion: false },
    gastro: { apetito: '', intolerancias: '', evacuaciones: '', vomito: false, gastritis: false, dolorAbdominal: false, melena: false, nauseas: false, colitis: false, diarrea: false, estrenimiento: false },
    genito: { menarca: '', dias: '', vidaSexual: '', gestas: '', abortos: '', cesareas: '', fur: '', menopausia: '', partos: '', secreciones: false, disuria: false, hematuria: false, poliuria: false },
    endocrino: { intoleranciaFrioCalor: false, perdidaConocimiento: false, perdidaEquilibrio: '', convulsiones: false, alucinaciones: false, lagunasMentales: '' },
    signosVitales: { presion: '', frecResp: '', peso: '', frecCard: '', temp: '', estatura: '' }
  },
  exploracionFisica: {
    habitus: '', cabeza: { normocefalo: false, pupilas: false, reflejos: '', cicatrices: false, isometricas: false, movOculares: '', fondoOjo: '' },
    orl: { oidosSecrecion: false, tapones: false, narizCongestion: false }, orofaringe: { hiperemicas: false, hipertrofia: false, caries: false },
    cuello: { corto: false, adenopatias: false }, torax: { normolineo: false, deformidades: false, cicatrices: false },
    pulmones: { murmullos: false, sibilancias: false, crepitantes: false }, corazon: { ritmoRegular: false, arritmias: false },
    abdomen: { blando: false, globoso: false, dolor: false, ascitis: false, plano: false, cicatrices: false, tumoracion: false, peristalsis: '' },
    extremidades: { isometricas: false, edema: false, deformidad: '', pulso: '', cianosis: false, varices: false, reflejos: '', movimientos: '' },
    neurologico: { nerviosNormales: false, reflejosTendinosos: '', funcionCerebral: '' }
  },
  examenMental: { orientado: '', lenguaje: '', afecto: '', pensamiento: '', alteraciones: '', memoria: '', cognicion: '' },
  diagnostico: { dx1: '', dx2: '', dx3: '', plan1: '', plan2: '', firmaMedico: '', cedula: '' }
};

const HistoriaMedica = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('historia');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  
  const [pacientesPendientes, setPacientesPendientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  const [formData, setFormData] = useState(emptyFormData);

  const fetchPendientes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/pacientes');
      const data = await res.json();
      
      const ingresados = data.filter(p => (p.estadoPaciente || p.estado || '').toUpperCase() === 'INGRESADO');

      const pendientes = [];
      for (let p of ingresados) {
        try {
          const checkRes = await fetch(`http://localhost:4000/api/historia-medica/paciente/${p.id}`);
          if (!checkRes.ok) pendientes.push(p);
        } catch (e) {
          pendientes.push(p); 
        }
      }
      setPacientesPendientes(pendientes);
    } catch (error) {
      console.error("Error cargando pacientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendientes(); }, []);

  const handleSelectPaciente = (e) => {
    const pid = e.target.value;
    setSelectedPacienteId(pid);
    
    if (pid) {
      const paciente = pacientesPendientes.find(p => p.id.toString() === pid);
      if (paciente) {
        setFormData(prev => ({
          ...emptyFormData, 
          datosGenerales: {
            ...emptyFormData.datosGenerales,
            nombre: paciente.nombreCompleto || '',
            expediente: `MK-${paciente.id.toString().padStart(4, '0')}`,
            edad: paciente.edad || '',
            sexo: paciente.sexo || '',
            estadoCivil: paciente.estadoCivil || '',
            lugarOrigen: paciente.origen || '',
            ocupacion: paciente.ocupacion || '',
            escolaridad: paciente.escolaridad || ''
          }
        }));
        setActiveTab(1);
      }
    } else {
      setFormData(emptyFormData);
    }
  };

  // Función 100% segura e inmutable para el manejo del estado
  const handleChange = (section, field, value, subfield = null) => {
    setFormData(prev => {
      if (section === 'raiz') return { ...prev, [field]: value };
      if (subfield) {
        return { ...prev, [section]: { ...prev[section], [field]: { ...prev[section][field], [subfield]: value } } };
      }
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  };
  
  const handleGuardar = async () => {
    setIsSaving(true);
    try {
      const payload = {
        pacienteId: Number(selectedPacienteId),
        medicoAsignado: formData.diagnostico.firmaMedico || "Jefe Médico",
        diagnosticoFinal: formData.diagnostico.dx1,
        datosClinicosJson: JSON.stringify(formData) 
      };

      const response = await fetch('http://localhost:4000/api/historia-medica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Fallo al guardar en el servidor');
      }
      
      alert("Historia Médica archivada exitosamente.");
      
      setSelectedPacienteId('');
      setFormData(emptyFormData);
      fetchPendientes(); 
      
    } catch (error) {
      console.error(error);
      alert("Error al guardar la Historia Médica. Verifica que el servidor esté corriendo.");
    } finally {
      setIsSaving(false);
    }
  };

  

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  const tabs = [
    { id: 1, title: 'Datos y Consumo', icon: Users },
    { id: 2, title: 'Antecedentes', icon: HistoryIcon },
    { id: 3, title: 'Interrogatorio', icon: Activity },
    { id: 4, title: 'Exploración F.', icon: HeartPulse },
    { id: 5, title: 'Ex. Mental y Dx', icon: BrainCircuit }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

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

            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Historia Médica Integral (24h)</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Evaluación profunda a realizar en las primeras 24 horas de ingreso.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="py-12 text-center text-slate-500 text-sm">
                      <div className="animate-spin h-6 w-6 border-2 border-[#7E1D3B] border-t-transparent rounded-full mx-auto mb-3"></div>
                      Buscando pacientes pendientes...
                    </div>
                  ) : pacientesPendientes.length === 0 ? (
                    <div className="py-16 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                      <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                      <h3 className="text-lg font-black text-emerald-800 mb-1">¡Todo al día!</h3>
                      <p className="text-sm font-medium text-emerald-600">No hay pacientes de piso pendientes de Historia Médica.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Seleccione un paciente pendiente:</label>
                        <select 
                          value={selectedPacienteId}
                          onChange={handleSelectPaciente}
                          className="w-full max-w-md p-3 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:ring-2 focus:ring-[#7E1D3B]/40 outline-none"
                        >
                          <option value="">-- Seleccionar Paciente --</option>
                          {pacientesPendientes.map(p => (
                            <option key={p.id} value={p.id}>
                              MK-{p.id.toString().padStart(4, '0')} - {p.nombreCompleto} ({p.sustanciaConsumo || 'Sustancia N/D'})
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedPacienteId && (
                        <div className="animate-fadeIn">
                          
                          <div className="flex bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-1.5 mb-6 overflow-x-auto">
                            {tabs.map(t => (
                              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === t.id ? 'bg-[#7E1D3B] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                                <t.icon size={14} /> {t.title}
                              </button>
                            ))}
                          </div>

                          {activeTab === 1 && (
                            <div className="space-y-6">
                              <h2 className="text-lg font-black text-[#7E1D3B] border-b pb-2">Historia de Consumo</h2>
                              <textarea rows="5" placeholder="Inicie cronológicamente..." value={formData.historiaConsumo} onChange={(e) => handleChange('raiz', 'historiaConsumo', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none text-sm" />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase">Religión</label>
                                  <select value={formData.datosGenerales.religion} onChange={(e) => handleChange('datosGenerales', 'religion', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                    <option value="">Seleccionar...</option>
                                    <option value="Católico">Católico</option>
                                    <option value="Cristiano Evangélico">Cristiano Evangélico</option>
                                    <option value="Testigo de Jehová">Testigo de Jehová</option>
                                    <option value="Otra">Otra / Ninguna</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase">Lugar de Residencia</label>
                                  <select value={formData.datosGenerales.lugarResidencia} onChange={(e) => handleChange('datosGenerales', 'lugarResidencia', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                    <option value="">Seleccionar...</option>
                                    <option value="Tepic">Tepic</option>
                                    <option value="Xalisco">Xalisco</option>
                                    <option value="Compostela">Compostela</option>
                                    <option value="Otro">Otro municipio/Estado</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === 2 && (
                            <div className="space-y-6">
                              <h2 className="text-lg font-black text-[#7E1D3B] border-b pb-2">Antecedentes Personales</h2>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase">Alergias</label>
                                  <input type="text" value={formData.antecedentes.alergias} onChange={(e) => handleChange('antecedentes', 'alergias', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase">Ant. Quirúrgicos</label>
                                  <input type="text" value={formData.antecedentes.quirurgicos} onChange={(e) => handleChange('antecedentes', 'quirurgicos', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                </div>
                              </div>
                              <h2 className="text-lg font-black text-[#7E1D3B] border-b pb-2 mt-4">Familiares (Patologías)</h2>
                              <div className="grid md:grid-cols-2 gap-4">
                                {['padre', 'madre', 'hermanos', 'esposa', 'hijos'].map(fam => (
                                  <div key={fam}>
                                    <label className="text-xs font-bold text-slate-500 uppercase capitalize">{fam}</label>
                                    <input type="text" value={formData.antecedentes.familiares[fam]} onChange={(e) => handleChange('antecedentes', 'familiares', e.target.value, fam)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeTab === 3 && (
                            <div className="space-y-6">
                              <h2 className="text-lg font-black text-[#7E1D3B] border-b pb-2">Interrogatorio por Aparatos y Sistemas</h2>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  <h3 className="font-bold text-slate-700 mb-3 uppercase text-xs">Cabeza</h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.keys(formData.interrogatorio.cabeza).map(key => (
                                      <label key={key} className="flex items-center gap-2 text-sm text-slate-600 capitalize cursor-pointer">
                                        <input type="checkbox" checked={formData.interrogatorio.cabeza[key]} onChange={(e) => handleChange('interrogatorio', 'cabeza', e.target.checked, key)} className="accent-[#7E1D3B]" /> {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  <h3 className="font-bold text-slate-700 mb-3 uppercase text-xs">Cardiorrespiratorio</h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.keys(formData.interrogatorio.cardio).map(key => (
                                      <label key={key} className="flex items-center gap-2 text-sm text-slate-600 capitalize cursor-pointer">
                                        <input type="checkbox" checked={formData.interrogatorio.cardio[key]} onChange={(e) => handleChange('interrogatorio', 'cardio', e.target.checked, key)} className="accent-[#7E1D3B]" /> {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === 4 && (
                            <div className="space-y-6">
                              <h2 className="text-lg font-black text-[#7E1D3B] border-b pb-2">Exploración Física</h2>
                              <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Habitus Exterior</label>
                                <textarea rows="3" value={formData.exploracionFisica.habitus} onChange={(e) => handleChange('exploracionFisica', 'habitus', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
                              </div>
                            </div>
                          )}

                          {activeTab === 5 && (
                            <div className="space-y-6">
                              <h2 className="text-lg font-black text-[#7E1D3B] border-b pb-2">Diagnóstico y Plan</h2>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase">Diagnóstico Principal</label>
                                  <input type="text" value={formData.diagnostico.dx1} onChange={(e) => handleChange('diagnostico', 'dx1', e.target.value)} className="w-full mt-1 p-3 bg-white border border-[#7E1D3B]/40 rounded-xl outline-none" />
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase">Plan</label>
                                  <textarea rows="3" value={formData.diagnostico.plan1} onChange={(e) => handleChange('diagnostico', 'plan1', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Médico Tratante</label>
                                    <input type="text" value={formData.diagnostico.firmaMedico} onChange={(e) => handleChange('diagnostico', 'firmaMedico', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Cédula</label>
                                    <input type="text" value={formData.diagnostico.cedula} onChange={(e) => handleChange('diagnostico', 'cedula', e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-8 border-t border-slate-200 pt-5">
                            <button disabled={activeTab === 1} onClick={() => setActiveTab(p => p - 1)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 rounded-lg font-bold shadow-sm border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-sm">
                              <ChevronLeft size={16} /> Anterior
                            </button>
                            
                            {activeTab < 5 ? (
                              <button onClick={() => setActiveTab(p => p + 1)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-lg font-bold shadow-sm hover:bg-slate-700 text-sm">
                                Siguiente <ChevronRight size={16} />
                              </button>
                            ) : (
                              <button onClick={handleGuardar} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-[#7E1D3B] text-white rounded-lg font-bold shadow-sm hover:bg-[#63162e] disabled:opacity-50 text-sm">
                                <Save size={16} /> {isSaving ? 'Guardando...' : 'Guardar y Archivar'}
                              </button>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default HistoriaMedica;