import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, HeartHandshake, FileUp, CheckCircle2, Loader2, AlertCircle, ShieldCheck, Clock } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const PASOS = [ "Historia de vida", "Autodiagnóstico", "Plan de consejería", "Prevención de recaídas", "Plan de vida", "Notas de evolución", "Entrevista final" ];

const ExpedienteConsejeria = () => {
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
      if (resD.ok) setDocsSubidos((await resD.json()).filter(d => d.departamento === 'Consejería'));
    } catch (e) { console.warn("Error cargando"); }
  };
  useEffect(() => { cargarDatos(); }, [id]);

  const handleUpload = async (e, paso) => {
    setErrorLocal('');
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setErrorLocal(`Archivo excede 5MB.`);
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) return setErrorLocal(`Solo PDF, JPG y PNG.`);

    setSubiendo(paso);
    const fd = new FormData(); 
    fd.append('archivo', file); fd.append('pacienteId', id); fd.append('nombrePaso', paso);
    fd.append('departamento', 'Consejería'); // <--- CLAVE PARA EL BACKEND

    try {
      await fetch('http://localhost:4000/api/documentos/upload', { method: 'POST', body: fd });
      await cargarDatos();
    } catch (err) { setErrorLocal("Error de conexión"); } finally { setSubiendo(null); e.target.value = ''; }
  };

  if(!paciente) return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border p-1" />
              <div><p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-bold">Instituto Marakame</p><h1 className="text-xl font-black text-slate-800">Carga Documental</h1></div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Paciente</p>
              <p className="font-black text-slate-800">{paciente.nombreCompleto}</p>
            </div>
          </div>
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              <button onClick={() => navigate('/consejeria/inicio')} className="w-full rounded-xl px-3 py-3 text-sm font-semibold border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] flex items-center gap-2"><ArrowLeft size={16} /> Volver a Directorio</button>
            </aside>
            <main className="space-y-4">
              {errorLocal && <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-700 shadow-sm"><AlertCircle size={20} /><p className="text-sm font-bold">{errorLocal}</p></div>}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-6 pb-4 border-b flex items-center gap-2">
                  <div className="h-6 w-1.5 rounded-full bg-slate-700" />
                  <div><h2 className="text-lg font-black uppercase tracking-[0.15em] text-slate-800">Expediente de Consejería</h2><p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1"><ShieldCheck size={12}/> Cumplimiento Normativo</p></div>
                </div>
                <div className="space-y-3">
                  {PASOS.map((paso, i) => {
                    const docInfo = docsSubidos.find(d => d.nombrePaso === paso);
                    const existe = !!docInfo;
                    const cargaActiva = subiendo === paso;
                    return (
                      <div key={i} className={`flex flex-col md:flex-row justify-between items-center p-4 border rounded-xl transition-all ${existe ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white hover:border-[#7E1D3B]/40'}`}>
                        <div className="flex items-center gap-4 w-full md:w-auto mb-3 md:mb-0">
                           <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs shadow-sm ${existe ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</div>
                           <div><p className={`text-sm font-bold ${existe ? 'text-slate-600' : 'text-slate-800'}`}>{paso}</p>{existe && docInfo.fechaSubida && <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5"><Clock size={10}/> Registrado: {new Date(docInfo.fechaSubida).toLocaleString('es-MX')}</p>}</div>
                        </div>
                        {!existe ? (
                           <div className="relative w-full md:w-auto">
                             <input type="file" accept=".pdf,.png,.jpg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => handleUpload(e, paso)} disabled={cargaActiva} />
                             <button className={`w-full md:w-auto px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-sm ${cargaActiva ? 'opacity-50' : ''}`}>{cargaActiva ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16}/>} {cargaActiva ? 'Subiendo...' : 'Anexar Documento'}</button>
                           </div>
                        ) : (<div className="w-full md:w-auto px-5 py-2.5 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-black uppercase flex justify-center items-center gap-2"><CheckCircle2 size={16}/> Verificado</div>)}
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
export default ExpedienteConsejeria;