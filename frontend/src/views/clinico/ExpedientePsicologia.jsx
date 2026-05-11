import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain, FileUp, ArrowLeft, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const PASOS_PSICOLOGIA = [
  "Entrevista inicial", "Primera terapia grupal", "Evaluación psicosocial", 
  "Plan de tratamiento psicológico", "Daños por consumo / 10 consecuencias", 
  "Sesión familiar", "Notas de evolución", "Despedida grupal", "Entrevista de cierre"
];

const ExpedientePsicologia = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [docsSubidos, setDocsSubidos] = useState([]); 
  const [subiendoPaso, setSubiendoPaso] = useState(null); // Controla el estado de carga por paso

  const cargarDatos = async () => {
    try {
      const resP = await fetch(`http://localhost:4000/api/pacientes/${id}`);
      const resD = await fetch(`http://localhost:4000/api/documentos/paciente/${id}`);
      if(resP.ok) setPaciente(await resP.json());
      if(resD.ok) setDocsSubidos(await resD.json()); 
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => { cargarDatos(); }, [id]);

  const handleFileUpload = async (e, pasoNombre) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setSubiendoPaso(pasoNombre);

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('pacienteId', id);
    formData.append('nombrePaso', pasoNombre);

    try {
      const response = await fetch('http://localhost:4000/api/documentos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refrescamos los datos para mostrar el check verde
        await cargarDatos();
      } else {
        alert("Error al subir el archivo al servidor.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de red al intentar subir el archivo.");
    } finally {
      setSubiendoPaso(null);
    }
  };

  if (!paciente) return <div className="p-10 text-center font-bold text-slate-400">Cargando expediente...</div>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-bold">Instituto Marakame</p>
                <h1 className="text-xl font-black text-slate-800">Expediente Clínico - Psicología</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Paciente</p>
                <p className="font-black text-slate-800">{paciente.nombreCompleto}</p>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center text-[#7E1D3B]"><Brain size={18} /></div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              <button onClick={() => navigate('/psicologia/inicio')}
                className="w-full rounded-xl px-3 py-3 text-sm font-semibold flex items-center gap-2.5 text-left border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12 transition-colors">
                <ArrowLeft size={16} />
                <span>Mis Pacientes</span>
              </button>
            </aside>

            <main className="space-y-5">
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Documentación Requerida</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-3">
                  {PASOS_PSICOLOGIA.map((paso, i) => {
                    const yaExiste = docsSubidos.some(d => d.nombrePaso === paso);
                    const estaSubiendo = subiendoPaso === paso;
                    
                    return (
                      <div key={i} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${yaExiste ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-[#7E1D3B]/30'}`}>
                        
                        <div className="flex items-center gap-4 mb-3 md:mb-0">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs ${yaExiste ? 'bg-emerald-100 text-emerald-700' : 'bg-[#7E1D3B]/8 text-[#7E1D3B]'}`}>
                            {i + 1}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${yaExiste ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{paso}</p>
                            {yaExiste ? (
                              <span className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1 mt-0.5"><CheckCircle2 size={10} /> Integrado</span>
                            ) : estaSubiendo ? (
                              <span className="text-[10px] font-black uppercase text-[#7E1D3B] flex items-center gap-1 mt-0.5 animate-pulse"><Loader2 size={10} className="animate-spin" /> Subiendo archivo...</span>
                            ) : (
                              <span className="text-[10px] font-black uppercase text-amber-600 flex items-center gap-1 mt-0.5"><Clock size={10} /> Pendiente</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!yaExiste && (
                            <div className="relative">
                              {/* El input file invisible encima del botón para disparar la subida */}
                              <input 
                                type="file" 
                                accept=".pdf,.png,.jpg,.jpeg" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileUpload(e, paso)}
                                disabled={estaSubiendo}
                              />
                              <button className={`px-5 py-2.5 bg-[#7E1D3B] text-white rounded-xl text-xs font-bold hover:bg-[#63162e] transition-all flex items-center gap-2 shadow-sm ${estaSubiendo ? 'opacity-50' : ''}`}>
                                <FileUp size={16}/> {estaSubiendo ? 'Cargando...' : 'Subir Escaneo'}
                              </button>
                            </div>
                          )}
                          {yaExiste && (
                            <span className="px-5 py-2.5 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-[10px] font-black uppercase">
                              Listo en Expediente
                            </span>
                          )}
                        </div>
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