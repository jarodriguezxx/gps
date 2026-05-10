import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Activity, Users, ClipboardList, FileBarChart, ArrowLeft, Printer, Edit, HeartPulse, Scale, Apple, History, AlertTriangle } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Nutrición',      icon: Activity,       key: 'inicio',      path: '/nutriologo/inicio' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/nutriologo/pacientes' },
  { label: 'Expedientes Nutrición', icon: ClipboardList,  key: 'expedientes', path: '/nutriologo/expedientes' },
  { label: 'Reportes',              icon: FileBarChart,   key: 'reportes',    path: '/nutriologo/reportes' },
];

const PREGUNTAS_RIESGO = {
  expuestoSida: 'Expuesto al virus del SIDA',
  transfusion: 'Transfusión intravenosa previa',
  drogasNoPrescritas: 'Uso de drogas inyectadas no prescritas',
  contactoDrogadicto: 'Contacto sexual con usuario de drogas inyectables',
  prostitucion: 'Prostitución / Sexo por dinero o drogas (Post 1977)',
  hsh: 'HOMBRES: Contacto sexual con otro hombre (Post 1977)',
  mujerContactoBisexual: 'MUJERES: Contacto sexual con hombre bisexual (Post 1977)',
  tatuajes: 'Tatuajes (Post 1977)',
  multiplesParejas: 'Múltiples parejas sexuales (Últimos 5 años)',
  contactoInfectado: 'Contacto sexual con infectado de VIH/SIDA'
};

const VistaExpedienteNutricion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeNav, setActiveNav] = useState('expedientes');
  const [paciente, setPaciente] = useState(null);
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPac, resNutri] = await Promise.all([ fetch(`http://localhost:4000/api/pacientes/${id}`), fetch(`http://localhost:4000/api/nutricion/${id}`) ]);
        setPaciente(await resPac.json());
        const nutriData = await resNutri.json();
        
        if (nutriData && nutriData.id) {
          setDatos({
            ...nutriData,
            sintomas: nutriData.sintomasJson ? JSON.parse(nutriData.sintomasJson) : {},
            riesgos: nutriData.riesgosJson ? JSON.parse(nutriData.riesgosJson) : {},
            antecedentes: nutriData.antecedentesJson ? JSON.parse(nutriData.antecedentesJson) : {},
            antropometria: nutriData.antropometriaJson ? JSON.parse(nutriData.antropometriaJson) : {},
            dietetica: nutriData.dieteticaJson ? JSON.parse(nutriData.dieteticaJson) : {}
          });
        }
      } catch (error) { console.error("Error al cargar expediente:", error); } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Cargando expediente exhaustivo...</div>;
  if (!datos) return <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 font-bold"><h3>El paciente no tiene evaluación nutricional.</h3><button onClick={() => navigate('/nutriologo/expedientes')} className="mt-4 text-[#7E1D3B] underline">Volver</button></div>;

  // Filtrar listas para mostrar solo lo positivo (lo que marcó como Sí)
  const sintomasPresentes = Object.keys(datos.sintomas).filter(s => datos.sintomas[s]);
  const riesgosPresentes = Object.keys(datos.riesgos).filter(r => datos.riesgos[r]);
  const enfFamiliares = datos.antecedentes?.familiaEnfermedades || {};
  const enfermedadesFamPresentes = Object.keys(enfFamiliares).filter(k => enfFamiliares[k]);

  const tdClass = "text-sm text-slate-800 p-2 border-b border-slate-100";
  const thClass = "text-[10px] font-black uppercase text-slate-400 p-2 border-b border-slate-100 align-top w-1/3 bg-slate-50";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative print:bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 print:p-0 print:max-w-full">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5 print:shadow-none print:border-none print:mb-0">
          
          {/* BARRA SUPERIOR (Se oculta al imprimir) */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 print:hidden">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button onClick={() => window.print()} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex gap-2"><Printer size={14} /> Imprimir</button>
              <button onClick={() => navigate(`/nutriologo/evaluacion/${id}`)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex gap-2"><Edit size={14} /> Editar</button>
              <button onClick={() => navigate('/nutriologo/expedientes')} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 flex gap-2"><ArrowLeft size={14} /> Volver</button>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6 print:block print:p-0">
            {/* SIDEBAR (Se oculta al imprimir) */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start print:hidden">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${activeNav === key ? 'bg-[#7E1D3B] text-white shadow-md' : 'text-[#7E1D3B] hover:bg-[#7E1D3B]/10'}`}>
                  <Icon size={16} className="shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            {/* DOCUMENTO PRINCIPAL */}
            <main className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm print:border-none print:shadow-none print:p-4">
              
              <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase">Evaluación Clínica y Nutricional</h2>
                  <p className="text-sm font-bold text-slate-500 mt-1">Folio Único: MK-{id} • Fecha de Documento: {datos.fechaEvaluacion}</p>
                </div>
                {/* Logo visible solo en impresión */}
                <img src={marakameLogo} alt="Logo" className="h-16 hidden print:block" />
              </div>

              {/* Ficha de Identificación */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 print:bg-transparent print:border-slate-800">
                <div className="md:col-span-2"><p className="text-[10px] font-black uppercase text-slate-400">Paciente</p><p className="font-bold text-slate-800">{paciente?.nombreCompleto}</p></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400">Edad</p><p className="font-bold text-slate-800">{paciente?.edad} años</p></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400">Sexo</p><p className="font-bold text-slate-800">{paciente?.sexo}</p></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400">Estado Civil</p><p className="font-bold text-slate-800">{paciente?.estadoCivil || 'N/D'}</p></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400">Escolaridad</p><p className="font-bold text-slate-800">{paciente?.escolaridad || 'N/D'}</p></div>
                <div className="md:col-span-2"><p className="text-[10px] font-black uppercase text-slate-400">Ocupación</p><p className="font-bold text-slate-800">{paciente?.ocupacion || 'N/D'}</p></div>
              </div>

              {/* I. SALUD Y RIESGOS */}
              <section className="mb-8 break-inside-avoid">
                <h3 className="flex items-center gap-2 font-black text-[#7E1D3B] border-b border-slate-300 pb-2 mb-4"><HeartPulse size={18}/> I. Historial de Salud y Cuestionario</h3>
                
                <div className="mb-4">
                  <p className="text-[11px] font-black uppercase text-slate-500 mb-2">Síntomas / Padecimientos (Último mes):</p>
                  {sintomasPresentes.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {sintomasPresentes.map(s => <span key={s} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">{s}</span>)}
                    </div>
                  ) : <p className="text-sm text-slate-500 italic">Negados o no reportados.</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div><p className="text-[11px] font-black uppercase text-slate-500">Alergias:</p><p className="text-sm text-slate-800">{datos.alergias || 'Ninguna'}</p></div>
                  <div><p className="text-[11px] font-black uppercase text-slate-500">Medicamentos Actuales:</p><p className="text-sm text-slate-800">{datos.medicamentosActuales || 'Ninguno'}</p></div>
                </div>

                {riesgosPresentes.length > 0 && (
                  <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100 print:border-slate-200 mt-4">
                    <p className="text-[11px] font-black uppercase text-rose-800 mb-2 flex items-center gap-1.5"><AlertTriangle size={14}/> Riesgos Confidenciales Afirmativos:</p>
                    <ul className="list-disc pl-5 text-xs font-bold text-slate-700 space-y-1">
                      {riesgosPresentes.map(r => <li key={r}>{PREGUNTAS_RIESGO[r]}</li>)}
                    </ul>
                  </div>
                )}
              </section>

              {/* II. ANTECEDENTES Y CONSUMO */}
              <section className="mb-8 break-inside-avoid">
                <h3 className="flex items-center gap-2 font-black text-[#7E1D3B] border-b border-slate-300 pb-2 mb-4"><History size={18}/> II. Antecedentes y Consumo</h3>
                <table className="w-full border-collapse mb-4">
                  <tbody>
                    <tr><td className={thClass}>Madre</td><td className={tdClass}>{datos.antecedentes?.madre || '-'}</td></tr>
                    <tr><td className={thClass}>Padre</td><td className={tdClass}>{datos.antecedentes?.padre || '-'}</td></tr>
                    <tr><td className={thClass}>Hermanos</td><td className={tdClass}>{datos.antecedentes?.hermanos || '-'}</td></tr>
                    <tr><td className={thClass}>Hijos / Cónyuge</td><td className={tdClass}>{datos.antecedentes?.hijos || '-'} {datos.antecedentes?.conyuge ? `| Cónyuge: ${datos.antecedentes.conyuge}` : ''}</td></tr>
                    <tr><td className={thClass}>Enfermedades Familiares</td><td className={tdClass}>{enfermedadesFamPresentes.length > 0 ? enfermedadesFamPresentes.join(', ').replace(/([A-Z])/g, ' $1').toLowerCase() : 'Ninguna'}</td></tr>
                    <tr><td className={thClass}>Dinámica Familiar</td><td className={tdClass}>Padres: {datos.antecedentes?.padresViven || 'N/D'} ({datos.antecedentes?.padresJuntos || 'N/D'}).<br/>Relación familiar/pareja: {datos.antecedentes?.relacionFamiliares || 'N/D'}</td></tr>
                    <tr><td className={thClass}>Tratamiento Psiquiátrico</td><td className={tdClass}>{datos.antecedentes?.tratamientoPsiquiatrico || 'Negado'}</td></tr>
                    <tr><td className={thClass}>Operaciones/Fracturas</td><td className={tdClass}>{datos.antecedentes?.operacionesFracturas || 'Negadas'}</td></tr>
                    <tr><td className={thClass}>Historial de Consumo</td><td className={tdClass}>
                      <span className="font-bold">Alcohol:</span> {datos.antecedentes?.consumoAlcohol || 'N/D'}<br/>
                      <span className="font-bold">Tabaco:</span> {datos.antecedentes?.consumoTabaco || 'N/D'}<br/>
                      <span className="font-bold">Otras:</span> {datos.antecedentes?.consumoOtras || 'N/D'}<br/>
                      <span className="font-bold">Internamientos:</span> {datos.antecedentes?.otrosInternamientos || 'Ninguno'}
                    </td></tr>
                  </tbody>
                </table>
              </section>

              {/* III. ANTROPOMETRÍA */}
              <section className="mb-8 break-inside-avoid">
                <h3 className="flex items-center gap-2 font-black text-[#7E1D3B] border-b border-slate-300 pb-2 mb-4"><Scale size={18}/> III. Antropometría y Actividad Física</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 print:bg-transparent">
                  <div><p className="text-[10px] font-black uppercase text-slate-400">Peso</p><p className="text-base font-black text-slate-800">{datos.antropometria?.peso || '--'} kg</p></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400">Estatura</p><p className="text-base font-black text-slate-800">{datos.antropometria?.estatura || '--'} m</p></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400">IMC</p><p className="text-base font-black text-[#7E1D3B]">{datos.antropometria?.imc || '--'}</p></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400">% Grasa</p><p className="text-base font-black text-slate-800">{datos.antropometria?.masaGrasa || '--'} %</p></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400">Peso Ideal</p><p className="text-base font-black text-slate-800">{datos.antropometria?.pesoIdeal || '--'} kg</p></div>
                  <div><p className="text-[10px] font-black uppercase text-slate-400">Dieta</p><p className="text-base font-black text-[#7E1D3B]">{datos.antropometria?.caloriasDieta || '--'} kcal</p></div>
                </div>
                <div className="text-sm text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p><span className="font-bold">Historia de Peso:</span> Habitual: {datos.antropometria?.pesoHabitual || '--'}kg | Máx: {datos.antropometria?.pesoMaximo || '--'}kg | Mín: {datos.antropometria?.pesoMinimo || '--'}kg</p>
                  <p><span className="font-bold">Actividad Física:</span> {datos.antropometria?.haceEjercicio === 'Si' ? `${datos.antropometria.tipoEjercicio} (${datos.antropometria.frecuenciaEjercicio}, ${datos.antropometria.duracionEjercicio}). Inició: ${datos.antropometria.inicioEjercicio}` : 'No realiza'}</p>
                </div>
              </section>

              {/* IV. DIETÉTICA */}
              <section className="mb-8 break-inside-avoid">
                <h3 className="flex items-center gap-2 font-black text-[#7E1D3B] border-b border-slate-300 pb-2 mb-4"><Apple size={18}/> IV. Dietética y Ginecología</h3>
                <table className="w-full border-collapse mb-4">
                  <tbody>
                    <tr><td className={thClass}>Hábitos Base</td><td className={tdClass}>{datos.dietetica?.comidasAlDia || '-'} comidas/día. Prepara: {datos.dietetica?.preparaAlimentos || '-'}. Come entre comidas: {datos.dietetica?.comeEntreComidas ? `Sí (${datos.dietetica.queComeEntreComidas})` : 'No'}</td></tr>
                    <tr><td className={thClass}>Aversiones / Malestar</td><td className={tdClass}>No agrada: {datos.dietetica?.alimentosNoAgradan || '-'}.<br/>Causan malestar: {datos.dietetica?.alimentosMalestar || '-'}</td></tr>
                    <tr><td className={thClass}>Intolerancias / Suplementos</td><td className={tdClass}>Alérgico/Intolerante: {datos.dietetica?.intoleranciaAlimento ? datos.dietetica.cualesIntolerancias : 'No'}.<br/>Suplementos: {datos.dietetica?.tomaSuplemento ? datos.dietetica.cualSuplemento : 'No'}</td></tr>
                    <tr><td className={thClass}>Bebidas</td><td className={tdClass}>Agua: {datos.dietetica?.aguaLitros || '0'} L. Café: {datos.dietetica?.tazasCafe || '-'}. Refresco: {datos.dietetica?.refrescosCola || '-'}. Energéticas: {datos.dietetica?.bebidasEnergetizantes || '-'}</td></tr>
                    
                    {paciente?.sexo?.toLowerCase() === 'femenino' || paciente?.sexo?.toLowerCase() === 'mujer' || datos.dietetica?.embarazoActual ? (
                      <tr><td className={thClass}>Ginecología</td><td className={tdClass}>
                        Embarazo: {datos.dietetica?.embarazoActual ? 'SÍ' : 'No'}. Anticonceptivos: {datos.dietetica?.anticonceptivos ? 'SÍ' : 'No'}.<br/>
                        1er Periodo: {datos.dietetica?.menstruacionPrimer || '-'}. Último Periodo: {datos.dietetica?.menstruacionUltimo || '-'}. Último Papanicolaou: {datos.dietetica?.ultimoPapanicolau || '-'}
                      </td></tr>
                    ) : null}
                  </tbody>
                </table>

                {datos.dietetica?.observacionesLab && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-[11px] font-black uppercase text-amber-800 mb-1">Observaciones Finales / Laboratorio:</p>
                    <p className="text-sm text-slate-800">{datos.dietetica.observacionesLab}</p>
                  </div>
                )}
              </section>

              <div className="mt-16 text-center text-sm font-bold text-slate-500 print:block">
                <div className="w-64 border-t-2 border-slate-400 mx-auto mb-2"></div>
                <p>Nombre y Firma del Nutriólogo</p>
                <p className="text-xs font-normal">Instituto Marakame</p>
              </div>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default VistaExpedienteNutricion;