import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HeartPulse, Clipboard, CheckCircle2, FileText, 
  ArrowLeft, Clock, Activity, FilePlus, Phone, MapPin, 
  History as HistoryIcon, UserCircle, Stethoscope
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg'; // Asegúrate de que la ruta sea correcta

const DetalleExpediente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('historial');
  
  // Estados del Modal
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
      if (!response.ok) throw new Error('Expediente no encontrado.');
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
    const payload = { ...nuevaNota };
    if (payload.fechaProximaSesion === '') payload.fechaProximaSesion = null;

    try {
      const response = await fetch(`http://localhost:4000/api/pacientes/${id}/notas-evolucion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-[#7E1D3B] font-bold uppercase tracking-widest text-sm">Cargando datos...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500 font-bold uppercase tracking-widest text-sm">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      
      {/* ========================================== */}
      {/* NAVBAR SUPERIOR (ESTILO MARAKAME OFICIAL)  */}
      {/* ========================================== */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* Logo y Títulos */}
            <div className="flex items-center gap-6">
              <img src={marakameLogo} alt="Instituto Marakame" className="h-14 w-auto object-contain" />
              <div className="hidden sm:block border-l border-slate-200 pl-6">
                <p className="text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest mb-0.5">Instituto Marakame</p>
                <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">Sistema de Gestión Clínica</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Módulo Jefatura Médica</p>
              </div>
            </div>

            {/* Perfil de Usuario */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesión activa</p>
                <p className="text-sm font-black text-slate-800">Jefe Médico</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#7E1D3B]">
                <Stethoscope size={24} />
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* ========================================== */}
      {/* CONTENIDO DE LA PÁGINA                     */}
      {/* ========================================== */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER DE LA SECCIÓN */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1.5 h-6 bg-[#7E1D3B] rounded-sm"></div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Detalle de Expediente</h2>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-4">
              Folio: <span className="text-[#7E1D3B]">{data?.expediente?.numero}</span>
            </p>
          </div>
          <button onClick={() => navigate('/medico/expedientes')} className="text-slate-500 hover:text-[#7E1D3B] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Volver al Directorio
          </button>
        </div>

        {/* TARJETA DE RESUMEN DEL PACIENTE */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-full bg-[#7E1D3B] flex items-center justify-center text-white font-black text-2xl shadow-sm">
                {data?.paciente?.nombreCompleto?.charAt(0).toUpperCase() || 'P'}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">{data?.paciente?.nombreCompleto}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {data?.paciente?.edad} AÑOS • {data?.paciente?.estadoCivil} • {data?.paciente?.sexo}
                </p>
              </div>
            </div>
            
            <div className="flex gap-12">
              <div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Sustancia Principal</p>
                 <p className="text-sm font-bold text-slate-700 uppercase">{data?.paciente?.sustanciaConsumo || 'NO ESPECIFICADA'}</p>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Contacto</p>
                 <p className="text-sm font-bold text-slate-700 uppercase">{data?.paciente?.telefonoContacto || 'S/N'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PESTAÑAS Y BOTÓN DE ACCIÓN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
          <div className="flex gap-6">
            <button 
              onClick={() => setPestañaActiva('historial')} 
              className={`pb-4 -mb-[17px] text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${pestañaActiva === 'historial' ? 'text-[#7E1D3B] border-b-2 border-[#7E1D3B]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <HistoryIcon size={16} /> Historial Clínico
            </button>
            <button 
              onClick={() => setPestañaActiva('docs')} 
              className={`pb-4 -mb-[17px] text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${pestañaActiva === 'docs' ? 'text-[#7E1D3B] border-b-2 border-[#7E1D3B]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FileText size={16} /> Documentos y Estudios
            </button>
          </div>
          
          <button onClick={() => setShowModal(true)} className="bg-[#7E1D3B] hover:bg-[#63162e] text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm">
            <FilePlus size={16} /> Crear Nota Médica
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL (TARJETAS DE NOTAS) */}
        <div className="bg-transparent">
          {pestañaActiva === 'historial' && (
            <div className="space-y-6">
              {data?.notasEvolucion && data.notasEvolucion.length > 0 ? (
                data.notasEvolucion.map((nota) => (
                  <div key={nota.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    
                    {/* Cabecera de la Nota */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="bg-rose-50 text-[#7E1D3B] px-3 py-1 rounded text-xs font-black uppercase tracking-widest">
                          {new Date(nota.fechaRegistro).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase">
                          <Clock size={14} /> {new Date(nota.fechaRegistro).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded bg-slate-50">
                        Médico: {nota.medicoAsignado}
                      </span>
                    </div>
                    
                    {/* Signos Vitales */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">T.A</p><p className="text-sm font-bold text-slate-800">{nota.ta || '-'}</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temp</p><p className="text-sm font-bold text-slate-800">{nota.temp || '-'}°C</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">F.C</p><p className="text-sm font-bold text-slate-800">{nota.fc || '-'}</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">F.R</p><p className="text-sm font-bold text-slate-800">{nota.fr || '-'}</p></div>
                      <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Peso/Talla</p><p className="text-sm font-bold text-slate-800">{nota.peso || '-'}kg / {nota.talla || '-'}cm</p></div>
                    </div>

                    {/* Textos Médicos */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clipboard size={12}/> Evolución y Cuadro Clínico</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{nota.evolucionCuadroClinico}</p>
                      </div>
                      {nota.diagnosticoProblemas && (
                        <div className="pt-2">
                          <h4 className="text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest mb-1 flex items-center gap-1.5"><CheckCircle2 size={12}/> Diagnóstico</h4>
                          <p className="text-sm text-slate-800 font-bold">{nota.diagnosticoProblemas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                  <FileText size={32} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aún no hay notas médicas registradas</p>
                </div>
              )}
            </div>
          )}

          {pestañaActiva === 'docs' && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <FileText size={32} className="mx-auto text-slate-300 mb-4" />
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aún no hay documentos adjuntos</p>
            </div>
          )}
        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL: NUEVA NOTA                          */}
      {/* ========================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#7E1D3B] rounded-sm"></div>
                <div>
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Nueva Nota de Evolución</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paciente: {data?.paciente?.nombreCompleto}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
              <div className="flex gap-4 mb-6 border-b border-slate-200 pb-2">
                 {['Signos Vitales', 'Evaluación', 'Diagnóstico'].map((label, i) => (
                    <button key={i} onClick={() => setPaso(i+1)} className={`text-[10px] font-black uppercase tracking-widest pb-2 -mb-[9px] ${paso === i+1 ? 'text-[#7E1D3B] border-b-2 border-[#7E1D3B]' : 'text-slate-400'}`}>
                      {i+1}. {label}
                    </button>
                 ))}
              </div>

              {paso === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
                  {[{l:'Tensión Arterial', n:'ta', p:'120/80'}, {l:'Temp. (°C)', n:'temp', p:'36.5'}, {l:'F.C. (lpm)', n:'fc', p:'80'}, {l:'F.R. (rpm)', n:'fr', p:'18'}, {l:'Peso (kg)', n:'peso', p:'75.5'}, {l:'Talla (cm)', n:'talla', p:'170'}].map(f => (
                    <div key={f.n}>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{f.l}</label>
                      <input type="text" placeholder={f.p} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-[#7E1D3B] focus:ring-1 focus:ring-[#7E1D3B] outline-none transition-all"
                        value={nuevaNota[f.n]} onChange={(e) => setNuevaNota({...nuevaNota, [f.n]: e.target.value})} />
                    </div>
                  ))}
                </div>
              )}

              {paso === 2 && (
                <div className="space-y-6 bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
                  <div>
                    <label className="block text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest mb-2">Evolución del Cuadro Clínico *</label>
                    <textarea rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-medium text-slate-700 focus:border-[#7E1D3B] outline-none resize-none"
                      value={nuevaNota.evolucionCuadroClinico} onChange={(e) => setNuevaNota({...nuevaNota, evolucionCuadroClinico: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Exploración Física</label>
                    <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-medium text-slate-700 focus:border-[#7E1D3B] outline-none resize-none"
                      value={nuevaNota.exploracionFisica} onChange={(e) => setNuevaNota({...nuevaNota, exploracionFisica: e.target.value})} />
                  </div>
                </div>
              )}

              {paso === 3 && (
                <div className="space-y-6 bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
                  <div>
                    <label className="block text-[10px] font-black text-[#7E1D3B] uppercase tracking-widest mb-2">Diagnóstico Final</label>
                    <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-bold text-slate-800 focus:border-[#7E1D3B] outline-none resize-none"
                      value={nuevaNota.diagnosticoProblemas} onChange={(e) => setNuevaNota({...nuevaNota, diagnosticoProblemas: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tratamiento e Indicaciones</label>
                    <textarea rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-medium text-slate-700 focus:border-[#7E1D3B] outline-none resize-none"
                      value={nuevaNota.tratamientoIndicaciones} onChange={(e) => setNuevaNota({...nuevaNota, tratamientoIndicaciones: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
              <button onClick={() => setShowModal(false)} className="text-[11px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest px-4 py-2">
                Cancelar
              </button>
              <div className="flex gap-3">
                {paso > 1 && (
                  <button onClick={() => setPaso(paso - 1)} className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-colors">
                    Atrás
                  </button>
                )}
                {paso < 3 ? (
                  <button onClick={() => setPaso(paso + 1)} className="bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-slate-700 transition-colors">
                    Siguiente
                  </button>
                ) : (
                  <button onClick={handleGuardarNota} className="bg-[#7E1D3B] text-white px-6 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-[#63162e] transition-colors shadow-sm">
                    Guardar Nota
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleExpediente;