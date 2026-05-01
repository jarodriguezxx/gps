import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HeartPulse, Clipboard, CheckCircle2, Stethoscope, 
  History, FileText, ArrowLeft, UserCircle, Clock, 
  Activity, FilePlus 
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const DetalleExpediente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('historial');
  const [showModal, setShowModal] = useState(false);
  const [paso, setPaso] = useState(1);

  const [nuevaNota, setNuevaNota] = useState({
    ta: '', temp: '', fc: '', fr: '', peso: '', talla: '',
    evolucionCuadroClinico: '', exploracionFisica: '', resultadosEstudios: '',
    diagnosticoProblemas: '', pronosticos: '', tratamientoIndicaciones: '',
    observaciones: '', fechaProximaSesion: '', medicoAsignado: 'Jefe Médico'
  });

  const fetchExpediente = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/pacientes/${id}/expediente`);
      if (!response.ok) throw new Error('No se pudo conectar con el servidor.');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchExpediente(); }, [id]);

  const handleGuardarNota = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/pacientes/${id}/notas-evolucion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaNota)
      });

      if (response.ok) {
        setShowModal(false);
        setPaso(1);
        setNuevaNota({
          ta: '', temp: '', fc: '', fr: '', peso: '', talla: '',
          evolucionCuadroClinico: '', exploracionFisica: '', resultadosEstudios: '',
          diagnosticoProblemas: '', pronosticos: '', tratamientoIndicaciones: '',
          observaciones: '', fechaProximaSesion: '', medicoAsignado: 'Jefe Médico'
        });
        fetchExpediente();
      } else {
        alert("Error al guardar la nota. Verifica los datos.");
      }
    } catch (err) {
      alert("Error de red al intentar guardar.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-[#7E1D3B]">Cargando Expediente...</div>;
  if (error) return <div className="h-screen flex flex-col items-center justify-center text-red-500 font-bold"><p>Error: {error}</p><button onClick={fetchExpediente} className="mt-4 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg">Reintentar</button></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      {/* HEADER DE ACCIÓN */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/medico/expedientes')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#7E1D3B] transition-colors">
          <ArrowLeft size={20} /> Regresar a Pacientes
        </button>
        <div className="flex items-center gap-4">
          <span className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase">
            Folio: {data?.expediente?.numero}
          </span>
          <button onClick={() => setShowModal(true)} className="bg-[#7E1D3B] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md hover:bg-[#63162e] transition-all">
            <FilePlus size={18} /> Nueva Nota Médica
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* PERFIL DEL PACIENTE */}
        <aside className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm h-fit">
          <div className="text-center mb-6">
            <div className="h-24 w-24 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center mb-4">
              <UserCircle size={60} className="text-[#7E1D3B]" />
            </div>
            <h2 className="text-xl font-black text-slate-800 leading-tight">{data?.paciente?.nombreCompleto || 'Desconocido'}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase mt-2">{data?.paciente?.sexo || 'N/A'} • {data?.paciente?.edad || 'N/A'} Años</p>
          </div>
        </aside>

        {/* HISTORIAL CLÍNICO */}
        <main className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
            <button onClick={() => setPestañaActiva('historial')} className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all ${pestañaActiva === 'historial' ? 'bg-white text-[#7E1D3B] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}>
              NOTAS DE EVOLUCIÓN
            </button>
            <button onClick={() => setPestañaActiva('docs')} className={`flex-1 py-4 text-xs font-black rounded-2xl transition-all ${pestañaActiva === 'docs' ? 'bg-white text-[#7E1D3B] shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`}>
              DOCUMENTOS PDF
            </button>
          </div>

          <div className="p-8">
            {pestañaActiva === 'historial' && (
              <div className="space-y-8">
                {data?.notasEvolucion && data.notasEvolucion.length > 0 ? (
                  data.notasEvolucion.map((nota) => (
                    <div key={nota.id} className="border-l-4 border-[#7E1D3B] bg-slate-50 p-6 rounded-r-2xl relative shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#7E1D3B] text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase">
                            {new Date(nota.fechaRegistro).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <Clock size={12} /> {new Date(nota.fechaRegistro).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase italic">Dr. {nota.medicoAsignado}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4 pb-4 border-b border-slate-200">
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">T.A</p><p className="text-xs font-black">{nota.ta || '-'}</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Temp</p><p className="text-xs font-black">{nota.temp || '-'}°C</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">F.C</p><p className="text-xs font-black">{nota.fc || '-'}</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">F.R</p><p className="text-xs font-black">{nota.fr || '-'}</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Peso</p><p className="text-xs font-black">{nota.peso || '-'}kg</p></div>
                        <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Talla</p><p className="text-xs font-black">{nota.talla || '-'}cm</p></div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-[10px] font-black text-[#7E1D3B] uppercase mb-1">Evolución Cuadro Clínico:</h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{nota.evolucionCuadroClinico}</p>
                        </div>
                        {nota.diagnosticoProblemas && (
                          <div className="bg-white p-4 rounded-xl border border-slate-200 border-dashed">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Diagnóstico Final:</h4>
                            <p className="text-xs text-slate-600 font-bold">"{nota.diagnosticoProblemas}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-slate-300">
                    <Clipboard size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold uppercase tracking-widest text-sm">Sin historial médico</p>
                  </div>
                )}
              </div>
            )}
            {pestañaActiva === 'docs' && (
                <div className="text-center py-20 text-slate-300">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-bold uppercase tracking-widest text-sm">Archivos PDF estarán aquí</p>
                </div>
            )}
          </div>
        </main>
      </div>

      {/* WIZARD DE NUEVA NOTA */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#7E1D3B] p-8 text-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-tighter">Registro de Evolución</h3>
                <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Paso {paso} de 3</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${paso >= n ? 'bg-white' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>

            <div className="p-10">
              {paso === 1 && (
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4"><HeartPulse className="text-[#7E1D3B]"/> Signos Vitales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[{l:'T.A', n:'ta'}, {l:'TEMP', n:'temp'}, {l:'F.C', n:'fc'}, {l:'F.R', n:'fr'}, {l:'PESO', n:'peso'}, {l:'TALLA', n:'talla'}].map(f => (
                      <div key={f.n}>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">{f.l}</label>
                        <input type="text" className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold focus:border-[#7E1D3B]/40 outline-none transition-colors"
                          value={nuevaNota[f.n]} onChange={(e) => setNuevaNota({...nuevaNota, [f.n]: e.target.value})} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-slate-400 uppercase text-xs">Cancelar</button>
                    <button onClick={() => setPaso(2)} className="flex-[2] py-4 bg-[#7E1D3B] text-white font-black rounded-xl uppercase text-xs shadow-md">Siguiente Paso</button>
                  </div>
                </div>
              )}

              {paso === 2 && (
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4"><Clipboard className="text-[#7E1D3B]"/> Análisis Clínico</h4>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase block ml-1">Evolución del Cuadro Clínico</label>
                    <textarea rows="4" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#7E1D3B]/40 transition-colors"
                      value={nuevaNota.evolucionCuadroClinico} onChange={(e) => setNuevaNota({...nuevaNota, evolucionCuadroClinico: e.target.value})} />
                    <label className="text-[10px] font-black text-slate-400 uppercase block ml-1">Exploración Física</label>
                    <textarea rows="3" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#7E1D3B]/40 transition-colors"
                      value={nuevaNota.exploracionFisica} onChange={(e) => setNuevaNota({...nuevaNota, exploracionFisica: e.target.value})} />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setPaso(1)} className="flex-1 py-4 font-black text-slate-400 uppercase text-xs">Atrás</button>
                    <button onClick={() => setPaso(3)} className="flex-[2] py-4 bg-[#7E1D3B] text-white font-black rounded-xl uppercase text-xs shadow-md">Ir a Diagnóstico</button>
                  </div>
                </div>
              )}

              {paso === 3 && (
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4"><CheckCircle2 className="text-[#7E1D3B]"/> Plan de Acción</h4>
                  <div className="space-y-4">
                    <textarea placeholder="Diagnóstico Final o Problemas Clínicos..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#7E1D3B]/40 transition-colors"
                      value={nuevaNota.diagnosticoProblemas} onChange={(e) => setNuevaNota({...nuevaNota, diagnosticoProblemas: e.target.value})} />
                    <textarea placeholder="Tratamiento e indicaciones médicas..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-[#7E1D3B]/40 transition-colors"
                      value={nuevaNota.tratamientoIndicaciones} onChange={(e) => setNuevaNota({...nuevaNota, tratamientoIndicaciones: e.target.value})} />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setPaso(2)} className="flex-1 py-4 font-black text-slate-400 uppercase text-xs">Atrás</button>
                    <button onClick={handleGuardarNota} className="flex-[2] py-4 bg-[#7E1D3B] text-white font-black rounded-xl uppercase text-xs shadow-md hover:bg-[#63162e]">Finalizar y Guardar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleExpediente;