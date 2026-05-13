import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Activity, Users, ClipboardList, FileBarChart, ChevronRight, ChevronLeft, HeartPulse, Apple, Scale, AlertTriangle, ArrowLeft, History, ShoppingCart } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Nutrición',      icon: Activity,       key: 'inicio',      path: '/nutriologo/inicio' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/nutriologo/pacientes' },
  { label: 'Expedientes Nutrición', icon: ClipboardList,  key: 'expedientes', path: '/nutriologo/expedientes' },
  { label: 'Requisiciones',         icon: ShoppingCart,   key: 'requisiciones', path: '/nutriologo/requisiciones' },
  { label: 'Reportes',              icon: FileBarChart,   key: 'reportes',    path: '/nutriologo/reportes' },
];

const LISTA_SINTOMAS = [
  "Dolores de cabeza", "Dificultad para ver", "Dificultad para leer", "Usar anteojos", "Dificultad para oir", "Usas aparato auditivo", "Catarros frecuentes", "Dolores en los oidos", "Mareos", "Problemas dentales", "Dificultad para tragar", "Indigestión frecuente", "Acidez o gases", "Nauseas o arqueo", "Constipación", "Vomito", "Diarrea", "Hemorroides", "Dolores abdominales", "Perdida de apetito", "Vomito con sangre", "Incremento de peso", "Perdida de peso", "Dolores de pecho", "Corto de aliento", "Palpitaciones", "Presion sanguínea alta o baja", "Hinchazon de tobillos", "Tos", "Salpullido", "Orinar con frecuencia", "Ardor al orinar", "Orina con sangre", "Secrecion inusual", "Orinar por la noche", "Problemas de próstata", "Problemas menstruales", "Nerviosismo, ansiedad", "Dificultad para decidirte", "Confusión mental", "Dificultad para recordar", "Depresión o soledad", "Llorar con frecuencia", "Desesperanza", "Dificultad para descansar", "Tendencia a la preocupación", "Sueños/pensamientos extraños", "Tendencia a ser timido, sensible", "Aversión a ser criticado", "Enojo frecuente", "Irritabilidad por cosas pequeñas", "Preocupación por el trabajo", "Preocupaciones familiares", "Problemas en la piel", "Moretones con facilidad", "Entumecimiento facial", "Movimiento limitado", "Perdida de sueño", "Calambres", "Heridas que no sanan", "Heridas presentes", "Piojos o ladillas", "Pie de atleta", "Usas prótesis", "Fiebre reumática", "Poliomielitis", "Tifoidea", "Viruela", "Prob. hepáticos", "Prob. renales", "Ulceras", "Artritis", "Sífilis", "Gonorrea", "Hepatitis", "Cancer", "Diabetes", "Infarto", "Prob. cardiacos", "Enfermedad mental", "Tuberculosis", "Examen TB positivo", "Sarampión", "Escarlata", "Paperas", "Varicela", "Temblores", "Dolores de cuello/espalda", "Dolor de articulaciones", "Usas baston, muletas"
];

const PREGUNTAS_RIESGO = [
  { key: 'expuestoSida', label: 'Estoy preocupado, ya que he estado expuesto al virus del SIDA' },
  { key: 'transfusion', label: '¿Alguna vez ha recibido sangre en forma intravenosa?' },
  { key: 'drogasNoPrescritas', label: '¿Alguna vez te has inyectado droga no prescrita por un médico?' },
  { key: 'contactoDrogadicto', label: '¿Has tenido contacto sexual con alguien que se inyecte drogas?' },
  { key: 'prostitucion', label: '¿Has tenido relaciones sexuales a cambio de dinero o drogas desde 1977?' },
  { key: 'hsh', label: 'HOMBRES: ¿Has tenido contacto sexual con otro hombre desde 1977?' },
  { key: 'mujerContactoBisexual', label: 'MUJERES: ¿Has tenido contacto sexual con un hombre bisexual desde 1977?' },
  { key: 'tatuajes', label: '¿Te has puesto algún tatuaje desde 1977?' },
  { key: 'multiplesParejas', label: '¿Has tenido múltiples parejas sexuales en los últimos 5 años?' },
  { key: 'contactoInfectado', label: '¿Has tenido contacto sexual con alguien infectado con el virus del SIDA?' }
];

const emptyFormData = {
  sintomas: {}, 
  riesgos: {},
  antecedentes: {
    madre: '', padre: '', hermanos: '', hijos: '', conyuge: '',
    familiaEnfermedades: { cancer: false, cardiacos: false, diabetes: false, abusoDrogas: false, infarto: false, tb: false, mental: false, alcoholismo: false, hta: false, hipercolesterolemia: false, hipertrigliceridemia: false, gastrointestinales: false },
    padresViven: '', relacionParejaHijos: '', padresJuntos: '', edadSeparacion: '', relacionFamiliares: '',
    cigarrosDiarios: '', fumasCigarrillos: false, alergias: '', medicamentosActuales: '',
    operacionesFracturas: '', tratamientoPsiquiatrico: '', fechaUltimoExamen: '', fechaUltimaConsulta: '',
    otrosInternamientos: '', consumoAlcohol: '', consumoTabaco: '', consumoOtras: ''
  },
  antropometria: {
    peso: '', estatura: '', imc: '', masaGrasa: '', pesoIdeal: '', caloriasDieta: '',
    pesoHabitual: '', pesoMaximo: '', pesoMinimo: '',
    haceEjercicio: '', tipoEjercicio: '', inicioEjercicio: '', frecuenciaEjercicio: '', duracionEjercicio: ''
  },
  dietetica: {
    comidasAlDia: '', preparaAlimentos: '', comeEntreComidas: false, queComeEntreComidas: '',
    alimentosNoAgradan: '', alimentosMalestar: '', intoleranciaAlimento: false, cualesIntolerancias: '',
    tomaSuplemento: false, cualSuplemento: '', dietaEspecial: '',
    aguaLitros: '', tazasCafe: '', refrescosCola: '', bebidasEnergetizantes: '',
    embarazoActual: false, anticonceptivos: false, menstruacionPrimer: '', menstruacionUltimo: '', ultimoPapanicolau: '',
    observacionesLab: ''
  }
};

const EvaluacionNutricional = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeNav, setActiveNav] = useState('pacientes');
  const [activeTab, setActiveTab] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    fetch(`http://localhost:4000/api/pacientes/${id}`).then(res => res.json()).then(data => setPaciente(data));
    fetch(`http://localhost:4000/api/nutricion/${id}`).then(res => res.json()).then(data => {
      if (data && data.id) {
        setFormData({
          sintomas: data.sintomasJson ? JSON.parse(data.sintomasJson) : {},
          riesgos: data.riesgosJson ? JSON.parse(data.riesgosJson) : {},
          antecedentes: data.antecedentesJson ? JSON.parse(data.antecedentesJson) : emptyFormData.antecedentes,
          antropometria: data.antropometriaJson ? JSON.parse(data.antropometriaJson) : emptyFormData.antropometria,
          dietetica: data.dieteticaJson ? JSON.parse(data.dieteticaJson) : emptyFormData.dietetica
        });
      }
    });
  }, [id]);

  const handleChange = (section, field, value, subfield = null) => {
    setFormData(prev => {
      if (subfield) return { ...prev, [section]: { ...prev[section], [field]: { ...prev[section][field], [subfield]: value } } };
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  };

  const calcularIMC = () => {
    const p = parseFloat(formData.antropometria.peso), a = parseFloat(formData.antropometria.estatura);
    if (p && a) handleChange('antropometria', 'imc', (p / ((a > 3 ? a / 100 : a) ** 2)).toFixed(2));
  };

  const handleGuardar = async () => {
    setIsSaving(true);
    try {
      const payload = { 
        pacienteId: id, 
        sintomasJson: JSON.stringify(formData.sintomas), 
        riesgosJson: JSON.stringify(formData.riesgos), 
        antecedentesJson: JSON.stringify(formData.antecedentes),
        antropometriaJson: JSON.stringify(formData.antropometria), 
        dieteticaJson: JSON.stringify(formData.dietetica),
        alergias: formData.antecedentes.alergias,
        medicamentosActuales: formData.antecedentes.medicamentosActuales
      };
      const res = await fetch(`http://localhost:4000/api/nutricion/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Error');
      alert("Expediente Clínico y Nutricional Guardado Exitosamente.");
      navigate(`/nutriologo/pacientes`); 
    } catch (e) { alert("Error al guardar."); } finally { setIsSaving(false); }
  };

  const inputClass = "w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs focus:ring-1 focus:ring-[#7E1D3B]/40 transition-all";
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button onClick={() => navigate('/nutriologo/pacientes')} className="px-4 py-2 mr-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex gap-2">
                <ArrowLeft size={14} /> Volver
              </button>
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Apple size={18} className="text-[#7E1D3B]" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => { setActiveNav(key); navigate(path); }}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${activeNav === key ? 'bg-[#7E1D3B] text-white shadow-md' : 'text-[#7E1D3B] hover:bg-[#7E1D3B]/10'}`}>
                  <Icon size={16} className="shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Evaluación: {paciente?.nombreCompleto}</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Folio: MK-{id} • Expediente Completo</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex bg-slate-50 rounded-xl shadow-inner border border-slate-200 p-1 mb-6 overflow-x-auto">
                    {[{id:1, t:'Salud y Riesgos', i:HeartPulse}, {id:2, t:'Antecedentes', i:History}, {id:3, t:'Medidas y Ejercicio', i:Scale}, {id:4, t:'Dietética y Lab', i:Apple}].map(tb => (
                      <button key={tb.id} onClick={()=>setActiveTab(tb.id)} className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tb.id ? 'bg-[#7E1D3B] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                        <tb.i size={14}/> {tb.t}
                      </button>
                    ))}
                  </div>

                  {/* PESTAÑA 1: CUESTIONARIO SALUD Y VIH */}
                  {activeTab === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div>
                        <h3 className="text-sm font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-2 mb-3">Síntomas y Enfermedades (Último Mes)</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-80 overflow-y-auto shadow-inner">
                          {LISTA_SINTOMAS.map(s => (
                            <label key={s} className="flex gap-2 text-[10px] font-bold cursor-pointer text-slate-600 hover:bg-slate-200 p-1 rounded transition-colors leading-tight">
                              <input type="checkbox" checked={formData.sintomas[s]||false} onChange={()=>setFormData(p=>({...p,sintomas:{...p.sintomas,[s]:!p.sintomas[s]}}))} className="accent-[#7E1D3B]" /> 
                              {s}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                        <h3 className="text-xs font-black text-rose-800 uppercase tracking-widest border-b border-rose-200 pb-2 mb-3 flex items-center gap-2"><AlertTriangle size={16}/> Cuestionario Confidencial de Riesgo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {PREGUNTAS_RIESGO.map(q => (
                            <label key={q.key} className="flex items-start gap-2 text-[11px] font-bold text-slate-700 cursor-pointer">
                              <input type="checkbox" checked={formData.riesgos[q.key]||false} onChange={e=>handleChange('riesgos',q.key,e.target.checked)} className="mt-0.5 accent-rose-600" />
                              <span className="leading-tight">{q.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 2: ANTECEDENTES Y CONSUMO */}
                  {activeTab === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* Familia Inmediata Ampliada */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-2 mb-3">Familia Inmediata (Edad, enfermedades actuales o causa de fallecimiento)</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div><label className={labelClass}>Madre</label><textarea rows="2" placeholder="Ej. 65 años, hipertensión. / Falleció a los 60 por infarto." value={formData.antecedentes.madre} onChange={e=>handleChange('antecedentes','madre',e.target.value)} className={inputClass}/></div>
                          <div><label className={labelClass}>Padre</label><textarea rows="2" placeholder="Ej. 70 años, sano." value={formData.antecedentes.padre} onChange={e=>handleChange('antecedentes','padre',e.target.value)} className={inputClass}/></div>
                          <div><label className={labelClass}>Hermanos (Cantidad y edades detalladas)</label><textarea rows="2" placeholder="Ej. 2 hermanos (30 y 32 años), ambos sanos." value={formData.antecedentes.hermanos} onChange={e=>handleChange('antecedentes','hermanos',e.target.value)} className={inputClass}/></div>
                          <div><label className={labelClass}>Hijos (Cantidad y edades detalladas)</label><textarea rows="2" placeholder="Ej. 1 hija de 10 años, asma." value={formData.antecedentes.hijos} onChange={e=>handleChange('antecedentes','hijos',e.target.value)} className={inputClass}/></div>
                          <div className="md:col-span-2"><label className={labelClass}>Cónyuge / Pareja</label><textarea rows="1" placeholder="Edad y enfermedades..." value={formData.antecedentes.conyuge} onChange={e=>handleChange('antecedentes','conyuge',e.target.value)} className={inputClass}/></div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <label className={labelClass}>¿Alguien de tu familia ha tenido?</label>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                            {Object.keys(formData.antecedentes.familiaEnfermedades).map(k => (
                              <label key={k} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 capitalize"><input type="checkbox" checked={formData.antecedentes.familiaEnfermedades[k]} onChange={e=>handleChange('antecedentes','familiaEnfermedades',e.target.checked,k)} className="accent-[#7E1D3B]"/> {k.replace(/([A-Z])/g, ' $1')}</label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Dinámica y Psiquiatría */}
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                            <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1">Dinámica Familiar</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="col-span-2"><label className={labelClass}>¿Tus padres viven?</label><select value={formData.antecedentes.padresViven} onChange={e=>handleChange('antecedentes','padresViven',e.target.value)} className={inputClass}><option value="">-- Seleccionar --</option><option value="Ambos">Ambos</option><option value="Solo Madre">Solo Madre</option><option value="Solo Padre">Solo Padre</option><option value="Ninguno">Ninguno</option></select></div>
                              <div><label className={labelClass}>¿Juntos o separados?</label><select value={formData.antecedentes.padresJuntos} onChange={e=>handleChange('antecedentes','padresJuntos',e.target.value)} className={inputClass}><option value="">--</option><option value="Juntos">Juntos</option><option value="Separados">Separados</option></select></div>
                              <div><label className={labelClass}>Edad al separarse</label><input type="number" value={formData.antecedentes.edadSeparacion} onChange={e=>handleChange('antecedentes','edadSeparacion',e.target.value)} className={inputClass} disabled={formData.antecedentes.padresJuntos !== 'Separados'} placeholder="Años"/></div>
                              <div className="col-span-2"><label className={labelClass}>Relación y comunicación con PAREJA E HIJOS</label><textarea rows="2" value={formData.antecedentes.relacionParejaHijos} onChange={e=>handleChange('antecedentes','relacionParejaHijos',e.target.value)} className={inputClass}/></div>
                              <div className="col-span-2"><label className={labelClass}>Relación y comunicación con FAMILIARES</label><textarea rows="2" value={formData.antecedentes.relacionFamiliares} onChange={e=>handleChange('antecedentes','relacionFamiliares',e.target.value)} className={inputClass}/></div>
                            </div>
                          </div>
                          <div><label className={labelClass}>Tratamiento Psiquiátrico / Químico-Dependencia (Incluir motivo)</label><textarea rows="2" value={formData.antecedentes.tratamientoPsiquiatrico} onChange={e=>handleChange('antecedentes','tratamientoPsiquiatrico',e.target.value)} className={inputClass} placeholder="Especifique fechas y motivos..."/></div>
                          <div><label className={labelClass}>Operaciones, fracturas o lesiones</label><textarea rows="2" value={formData.antecedentes.operacionesFracturas} onChange={e=>handleChange('antecedentes','operacionesFracturas',e.target.value)} className={inputClass}/></div>
                        </div>

                        {/* Consumo y Generales */}
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                            <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1">Historial de Consumo</h3>
                            <div><label className={labelClass}>Otros internamientos (Cuándo, Días, Tiempo de abstinencia)</label><textarea rows="2" value={formData.antecedentes.otrosInternamientos} onChange={e=>handleChange('antecedentes','otrosInternamientos',e.target.value)} className={inputClass} placeholder="Ej. En 2023, por 30 días. Abstinencia de 6 meses."/></div>
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sustancias (Indicar Edad inicio, Frecuencia y Cantidad)</label>
                              <div><label className="text-[10px] font-bold text-slate-400">Alcohol</label><textarea rows="1" value={formData.antecedentes.consumoAlcohol} onChange={e=>handleChange('antecedentes','consumoAlcohol',e.target.value)} className={inputClass} placeholder="Ej. Inicio a 15 años, 3 veces por semana..."/></div>
                              <div><label className="text-[10px] font-bold text-slate-400">Tabaco (Detallar si fuma cigarrillos y cuántos)</label><textarea rows="1" value={formData.antecedentes.consumoTabaco} onChange={e=>handleChange('antecedentes','consumoTabaco',e.target.value)} className={inputClass} placeholder="Ej. 1 cajetilla diaria desde los 18..."/></div>
                              <div><label className="text-[10px] font-bold text-slate-400">Otras Sustancias</label><textarea rows="1" value={formData.antecedentes.consumoOtras} onChange={e=>handleChange('antecedentes','consumoOtras',e.target.value)} className={inputClass} placeholder="Cristal, Marihuana, etc..."/></div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1">Alergias y Fechas</h3>
                            <div><label className={labelClass}>Alergias a ALIMENTOS, DROGAS O INHALANTES</label><textarea rows="2" value={formData.antecedentes.alergias} onChange={e=>handleChange('antecedentes','alergias',e.target.value)} className={inputClass} placeholder="Especifique reacciones..."/></div>
                            <div><label className={labelClass}>¿Qué medicamentos tomas actualmente?</label><textarea rows="2" value={formData.antecedentes.medicamentosActuales} onChange={e=>handleChange('antecedentes','medicamentosActuales',e.target.value)} className={inputClass}/></div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className={labelClass}>Fecha Último Examen Médico</label><input type="date" value={formData.antecedentes.fechaUltimoExamen} onChange={e=>handleChange('antecedentes','fechaUltimoExamen',e.target.value)} className={inputClass}/></div>
                              <div><label className={labelClass}>Fecha Última Consulta</label><input type="date" value={formData.antecedentes.fechaUltimaConsulta} onChange={e=>handleChange('antecedentes','fechaUltimaConsulta',e.target.value)} className={inputClass}/></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 3: ANTROPOMETRÍA Y EJERCICIO */}
                  {activeTab === 3 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1">Medidas Actuales</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div><label className={labelClass}>Peso (kg)</label><input type="number" value={formData.antropometria.peso} onChange={e=>handleChange('antropometria','peso',e.target.value)} onBlur={calcularIMC} className={inputClass}/></div>
                            <div><label className={labelClass}>Estatura (m)</label><input type="number" step="0.01" value={formData.antropometria.estatura} onChange={e=>handleChange('antropometria','estatura',e.target.value)} onBlur={calcularIMC} className={inputClass}/></div>
                            <div><label className={labelClass}>IMC</label><input type="text" readOnly value={formData.antropometria.imc} className={`${inputClass} bg-[#7E1D3B]/5 font-black border-[#7E1D3B]/20 text-[#7E1D3B]`}/></div>
                            <div><label className={labelClass}>% Masa Grasa</label><input type="text" value={formData.antropometria.masaGrasa} onChange={e=>handleChange('antropometria','masaGrasa',e.target.value)} className={inputClass}/></div>
                            <div><label className={labelClass}>Peso Ideal</label><input type="text" value={formData.antropometria.pesoIdeal} onChange={e=>handleChange('antropometria','pesoIdeal',e.target.value)} className={inputClass}/></div>
                            <div><label className={labelClass}>Dieta (Calorías)</label><input type="number" value={formData.antropometria.caloriasDieta} onChange={e=>handleChange('antropometria','caloriasDieta',e.target.value)} className={inputClass}/></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1">Historia del Peso</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div><label className={labelClass}>Peso Habitual</label><input type="number" value={formData.antropometria.pesoHabitual} onChange={e=>handleChange('antropometria','pesoHabitual',e.target.value)} className={inputClass}/></div>
                            <div><label className={labelClass}>Peso Máximo</label><input type="number" value={formData.antropometria.pesoMaximo} onChange={e=>handleChange('antropometria','pesoMaximo',e.target.value)} className={inputClass}/></div>
                            <div><label className={labelClass}>Peso Mínimo</label><input type="number" value={formData.antropometria.pesoMinimo} onChange={e=>handleChange('antropometria','pesoMinimo',e.target.value)} className={inputClass}/></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1 mb-3">Actividad Física</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div><label className={labelClass}>¿Ejercicio?</label><select value={formData.antropometria.haceEjercicio} onChange={e=>handleChange('antropometria','haceEjercicio',e.target.value)} className={inputClass}><option value="">--</option><option value="Si">Sí</option><option value="No">No</option></select></div>
                          <div><label className={labelClass}>Tipo</label><input type="text" value={formData.antropometria.tipoEjercicio} onChange={e=>handleChange('antropometria','tipoEjercicio',e.target.value)} className={inputClass} disabled={formData.antropometria.haceEjercicio !== 'Si'}/></div>
                          <div><label className={labelClass}>¿Cuándo inicio?</label><input type="text" value={formData.antropometria.inicioEjercicio} onChange={e=>handleChange('antropometria','inicioEjercicio',e.target.value)} className={inputClass} disabled={formData.antropometria.haceEjercicio !== 'Si'}/></div>
                          <div><label className={labelClass}>Frecuencia</label><input type="text" value={formData.antropometria.frecuenciaEjercicio} onChange={e=>handleChange('antropometria','frecuenciaEjercicio',e.target.value)} className={inputClass} disabled={formData.antropometria.haceEjercicio !== 'Si'}/></div>
                          <div><label className={labelClass}>Duración</label><input type="text" value={formData.antropometria.duracionEjercicio} onChange={e=>handleChange('antropometria','duracionEjercicio',e.target.value)} className={inputClass} disabled={formData.antropometria.haceEjercicio !== 'Si'}/></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 4: DIETÉTICA, GINECOLOGÍA Y LAB */}
                  {activeTab === 4 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1">Hábitos Alimenticios</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div><label className={labelClass}>Comidas/Día</label><input type="number" value={formData.dietetica.comidasAlDia} onChange={e=>handleChange('dietetica','comidasAlDia',e.target.value)} className={inputClass}/></div>
                            <div><label className={labelClass}>¿Quién prepara alimentos?</label><input type="text" value={formData.dietetica.preparaAlimentos} onChange={e=>handleChange('dietetica','preparaAlimentos',e.target.value)} className={inputClass}/></div>
                          </div>
                          
                          <div className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-100">
                            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 whitespace-nowrap"><input type="checkbox" checked={formData.dietetica.comeEntreComidas} onChange={e=>handleChange('dietetica','comeEntreComidas',e.target.checked)} className="accent-[#7E1D3B]"/> ¿Come entre comidas?</label>
                            <input type="text" placeholder="¿Qué alimentos?" value={formData.dietetica.queComeEntreComidas} onChange={e=>handleChange('dietetica','queComeEntreComidas',e.target.value)} className={`${inputClass} mt-0 flex-1`} disabled={!formData.dietetica.comeEntreComidas}/>
                          </div>
                          
                          <div><label className={labelClass}>Alimentos que NO AGRADAN o NO ACOSTUMBRA</label><textarea rows="2" value={formData.dietetica.alimentosNoAgradan} onChange={e=>handleChange('dietetica','alimentosNoAgradan',e.target.value)} className={inputClass}/></div>
                          <div><label className={labelClass}>Alimentos que CAUSAN MALESTAR</label><textarea rows="2" value={formData.dietetica.alimentosMalestar} onChange={e=>handleChange('dietetica','alimentosMalestar',e.target.value)} className={inputClass}/></div>
                          
                          <div className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-100">
                            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 whitespace-nowrap"><input type="checkbox" checked={formData.dietetica.intoleranciaAlimento} onChange={e=>handleChange('dietetica','intoleranciaAlimento',e.target.checked)} className="accent-[#7E1D3B]"/> ¿Alérgico/Intolerante?</label>
                            <input type="text" placeholder="¿A cuáles alimentos?" value={formData.dietetica.cualesIntolerancias} onChange={e=>handleChange('dietetica','cualesIntolerancias',e.target.value)} className={`${inputClass} mt-0 flex-1`} disabled={!formData.dietetica.intoleranciaAlimento}/>
                          </div>

                          <div className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-100">
                            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 whitespace-nowrap"><input type="checkbox" checked={formData.dietetica.tomaSuplemento} onChange={e=>handleChange('dietetica','tomaSuplemento',e.target.checked)} className="accent-[#7E1D3B]"/> ¿Toma suplemento/comp.?</label>
                            <input type="text" placeholder="¿Cuál?" value={formData.dietetica.cualSuplemento} onChange={e=>handleChange('dietetica','cualSuplemento',e.target.value)} className={`${inputClass} mt-0 flex-1`} disabled={!formData.dietetica.tomaSuplemento}/>
                          </div>

                          <div><label className={labelClass}>¿Ha llevado alguna dieta especial?</label><textarea rows="1" value={formData.dietetica.dietaEspecial} onChange={e=>handleChange('dietetica','dietaEspecial',e.target.value)} className={inputClass}/></div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                            <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest border-b pb-1">Bebidas (Diario o Semana)</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div><label className={labelClass}>Agua al día</label><input type="text" placeholder="Ej. 2 Litros" value={formData.dietetica.aguaLitros} onChange={e=>handleChange('dietetica','aguaLitros',e.target.value)} className={inputClass}/></div>
                              <div><label className={labelClass}>Tazas de Café</label><input type="text" placeholder="Ej. 3 a la semana" value={formData.dietetica.tazasCafe} onChange={e=>handleChange('dietetica','tazasCafe',e.target.value)} className={inputClass}/></div>
                              <div><label className={labelClass}>Refrescos de Cola</label><input type="text" placeholder="Ej. 1 vaso diario" value={formData.dietetica.refrescosCola} onChange={e=>handleChange('dietetica','refrescosCola',e.target.value)} className={inputClass}/></div>
                              <div><label className={labelClass}>Bebidas Energetizantes</label><input type="text" placeholder="Ej. Red Bull, Bomba..." value={formData.dietetica.bebidasEnergetizantes} onChange={e=>handleChange('dietetica','bebidasEnergetizantes',e.target.value)} className={inputClass}/></div>
                            </div>
                          </div>

                          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 space-y-3">
                            <h3 className="text-xs font-black text-rose-800 uppercase tracking-widest border-b border-rose-200 pb-1">Aspectos Ginecológicos</h3>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700"><input type="checkbox" checked={formData.dietetica.embarazoActual} onChange={e=>handleChange('dietetica','embarazoActual',e.target.checked)} className="accent-rose-600"/> Embarazo Actual</label>
                              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700"><input type="checkbox" checked={formData.dietetica.anticonceptivos} onChange={e=>handleChange('dietetica','anticonceptivos',e.target.checked)} className="accent-rose-600"/> Anticonceptivos Orales</label>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div><label className={labelClass}>Edad 1er Periodo</label><input type="text" placeholder="Años" value={formData.dietetica.menstruacionPrimer} onChange={e=>handleChange('dietetica','menstruacionPrimer',e.target.value)} className={inputClass}/></div>
                              <div><label className={labelClass}>Último Periodo</label><input type="date" value={formData.dietetica.menstruacionUltimo} onChange={e=>handleChange('dietetica','menstruacionUltimo',e.target.value)} className={inputClass}/></div>
                              <div><label className={labelClass}>Último Papanicolau</label><input type="date" value={formData.dietetica.ultimoPapanicolau} onChange={e=>handleChange('dietetica','ultimoPapanicolau',e.target.value)} className={inputClass}/></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <label className={labelClass}>Observaciones / Laboratorio</label>
                        <textarea rows="3" value={formData.dietetica.observacionesLab} onChange={e=>handleChange('dietetica','observacionesLab',e.target.value)} className={inputClass} placeholder="Anotaciones finales del evaluador u observaciones de estudios de laboratorio..."/>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-8 border-t border-slate-200 pt-5">
                    <button disabled={activeTab===1} onClick={()=>setActiveTab(p=>p-1)} className="px-5 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-bold flex gap-2 hover:bg-slate-50"><ChevronLeft size={16}/> Anterior</button>
                    {activeTab < 4 ? (
                      <button onClick={()=>setActiveTab(p=>p+1)} className="px-5 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-bold flex gap-2 hover:bg-slate-700">Siguiente <ChevronRight size={16}/></button>
                    ) : (
                      <button onClick={handleGuardar} disabled={isSaving} className="px-6 py-2.5 bg-[#7E1D3B] text-white rounded-lg text-sm font-bold flex gap-2 shadow-md hover:bg-[#63162e]"><Save size={16}/> Guardar Expediente Final</button>
                    )}
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

export default EvaluacionNutricional;