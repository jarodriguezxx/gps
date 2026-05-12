import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, FileUp, CheckCircle2, Loader2, AlertCircle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const PASOS = [ "Entrevista inicial", "Primera terapia grupal", "Evaluación psicosocial", "Plan de tratamiento", "Daños por consumo", "Sesión familiar", "Notas de evolución", "Despedida grupal", "Entrevista de cierre" ];

const ExpedientePsicologia = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [docsSubidos, setDocsSubidos] = useState([]);
  const [subiendo, setSubiendo] = useState(null);
  const [errorLocal, setErrorLocal] = useState('');

  const cargarDatos = async () => {
    try {
      const resP = await fetch(`http://localhost:4000/api/pacientes/${id}`);
      if (resP.ok) setPaciente(await resP.json());
      const resD = await fetch(`http://localhost:4000/api/documentos/paciente/${id}`);
      if (resD.ok) setDocsSubidos((await resD.json()).filter(d => d.departamento === 'Psicología')); 
    } catch (e) { console.warn("Error en red al cargar"); }
  };
  useEffect(() => { cargarDatos(); }, [id]);

  const handleUpload = async (e, paso) => {
    setErrorLocal('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) return setErrorLocal(`El archivo "${file.name}" excede el límite de 5MB.`);
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) return setErrorLocal(`Formato inválido. Solo PDF, JPG y PNG.`);

    setSubiendo(paso);
    const fd = new FormData(); 
    fd.append('archivo', file); fd.append('pacienteId', id); fd.append('nombrePaso', paso); fd.append('departamento', 'Psicología');

    try {
      const res = await fetch('http://localhost:4000/api/documentos/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error("Fallo en el servidor");
      await cargarDatos();
    } catch (err) { setErrorLocal("Error de conexión al subir el archivo."); } 
    finally { setSubiendo(null); e.target.value = ''; }
  };

  if(!paciente) return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-400">Cargando expediente...</div>;

  // Calculo de progreso específico
  const pasosCompletados = new Set(docsSubidos.map(d => d.nombrePaso)).size;
  const porcentaje = Math.round((pasosCompletados / PASOS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-bold">Instituto Marakame</p>
                <h1 className="text-xl font-black text-slate-800">Carga Documental</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 self-end md:self-auto">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Paciente Activo</p>
                <p className="font-black text-slate-800">{paciente.nombreCompleto}</p>
                <p className="text-[10px] font-bold text-[#7E1D3B]">Folio: MK-{paciente.id.toString().padStart(4, '0')}</p>
              </div>
              {/* Círculo de progreso radial simplificado */}
              <div className="h-12 w-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative bg-white shadow-sm">
                 <span className={`text-[11px] font-black ${porcentaje === 100 ? 'text-emerald-600' : 'text-slate-700'}`}>{porcentaje}%</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              <button onClick={() => navigate('/psicologia/inicio')} className="w-full rounded-xl px-3 py-3 text-sm font-semibold border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12 flex items-center gap-2 transition-all shadow-sm">
                <ArrowLeft size={16} /> Volver a Directorio
              </button>
            </aside>

            <main className="space-y-4">
              {errorLocal && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-700 shadow-sm animate-in fade-in">
                  <AlertCircle size={20} className="shrink-0" /> <p className="text-sm font-bold">{errorLocal}</p>
                </div>
              )}

              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6 pb-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1.5 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-[0.15em] text-slate-800">Expediente Psicológico</h2>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1"><ShieldCheck size={12}/> {pasosCompletados} de {PASOS.length} documentos obligatorios</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {PASOS.map((paso, i) => {
                    const docInfo = docsSubidos.find(d => d.nombrePaso === paso);
                    const existe = !!docInfo;
                    const cargaActiva = subiendo === paso;
                    
                    return (
                      <div key={i} className={`flex flex-col md:flex-row justify-between items-center p-4 border rounded-xl transition-all ${existe ? 'bg-slate-50 border-emerald-200 shadow-sm' : 'bg-white hover:border-[#7E1D3B]/40 shadow-sm'}`}>
                        <div className="flex items-center gap-4 w-full md:w-auto mb-3 md:mb-0">
                           <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs shadow-sm ${existe ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{i + 1}</div>
                           <div>
                             <p className={`text-sm font-bold ${existe ? 'text-slate-800' : 'text-slate-700'}`}>{paso}</p>
                             {existe && docInfo.fechaSubida && (
                               <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={10}/> Subido el: {new Date(docInfo.fechaSubida).toLocaleDateString('es-MX')} a las {new Date(docInfo.fechaSubida).toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'})}</p>
                             )}
                           </div>
                        </div>
                        
                        {!existe ? (
                           <div className="relative w-full md:w-auto">
                             <input type="file" accept=".pdf,.png,.jpg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => handleUpload(e, paso)} disabled={cargaActiva} />
                             <button className={`w-full md:w-auto px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-sm transition-all ${cargaActiva ? 'opacity-50' : 'hover:bg-[#63162e] active:scale-95'}`}>
                               {cargaActiva ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16}/>} {cargaActiva ? 'Subiendo...' : 'Anexar Escaneo'}
                             </button>
                           </div>
                        ) : (
                          <div className="w-full md:w-auto flex gap-2">
                            {/* BOTÓN NUEVO: Permite al psicólogo ver el archivo que ya subió */}
                            <a href={`http://localhost:4000/${docInfo.rutaArchivo}`} target="_blank" rel="noreferrer" 
                              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-[#7E1D3B] hover:border-[#7E1D3B]/30 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition-all shadow-sm">
                              <ExternalLink size={14}/> Ver Archivo
                            </a>
                            <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-black uppercase flex justify-center items-center gap-1.5 shadow-sm">
                              <CheckCircle2 size={16}/> Listo
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ExpedientePsicologia;