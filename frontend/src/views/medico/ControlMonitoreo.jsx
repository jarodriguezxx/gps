import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Droplet, HeartPulse, Calendar, Edit2, CheckCircle2, FileText
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const DIAS_SEMANA = [
  { id: 'L', nombre: 'Lunes' }, { id: 'M', nombre: 'Martes' }, { id: 'X', nombre: 'Miércoles' },
  { id: 'J', nombre: 'Jueves' }, { id: 'V', nombre: 'Viernes' }, { id: 'S', nombre: 'Sábado' }, { id: 'D', nombre: 'Domingo' }
];

const ControlMonitoreo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState('glucosa');

  // --- ESTADOS PARA GLUCOSA ---
  const [planGlucosa, setPlanGlucosa] = useState({ id: null, fechaInicio: '', fechaFin: '', hora: '', dias: [], ayuno: true, configurado: false });
  const [editandoPlanGlucosa, setEditandoPlanGlucosa] = useState(true);
  const [registrosGlucosa, setRegistrosGlucosa] = useState([]);
  const [nuevaGlucosa, setNuevaGlucosa] = useState({ fecha: '', hora: '', resultado: '' });

  // --- ESTADOS PARA T.A. ---
  const [planTA, setPlanTA] = useState({ id: null, fechaInicio: '', fechaFin: '', hora: '', dias: [], configurado: false });
  const [editandoPlanTA, setEditandoPlanTA] = useState(true);
  const [registrosTA, setRegistrosTA] = useState([]);
  const [nuevaTA, setNuevaTA] = useState({ fecha: '', hora: '', resultado: '', firma: 'Jefe Médico' });

useEffect(() => {
    // 1. Cargar los datos del paciente para el encabezado
    fetch(`http://localhost:4000/api/pacientes/${id}/expediente`)
      .then(res => res.json())
      .then(data => setPaciente(data.paciente))
      .catch(err => console.error(err));

    // 2. Cargar los planes y registros guardados previamente
    fetch(`http://localhost:4000/api/monitoreo/${id}`)
      .then(res => res.json())
      .then(data => {
        // Restaurar Glucosa si existe
        if (data.planGlucosa) {
          setPlanGlucosa({
            id: data.planGlucosa.id,
            fechaInicio: data.planGlucosa.fechaInicio,
            fechaFin: data.planGlucosa.fechaFin || '',
            hora: data.planGlucosa.hora.substring(0, 5), // Cortamos los segundos
            dias: data.planGlucosa.dias ? data.planGlucosa.dias.split(',') : [],
            ayuno: data.planGlucosa.ayuno,
            configurado: true
          });
          setEditandoPlanGlucosa(false); // Ocultamos el formulario
          if (data.registrosGlucosa) {
            setRegistrosGlucosa(data.registrosGlucosa.map(r => ({...r, fecha: r.fechaToma, hora: r.horaToma.substring(0, 5)})));
          }
        }

        // Restaurar Tensión Arterial si existe
        if (data.planTA) {
          setPlanTA({
            id: data.planTA.id,
            fechaInicio: data.planTA.fechaInicio,
            fechaFin: data.planTA.fechaFin || '',
            hora: data.planTA.hora.substring(0, 5),
            dias: data.planTA.dias ? data.planTA.dias.split(',') : [],
            configurado: true
          });
          setEditandoPlanTA(false);
          if (data.registrosTA) {
            setRegistrosTA(data.registrosTA.map(r => ({...r, fecha: r.fechaToma, hora: r.horaToma.substring(0, 5)})));
          }
        }
      })
      .catch(err => console.error("Error cargando el monitoreo:", err));
  }, [id]);

  const toggleDia = (diaId, plan, setPlan) => {
    const nuevosDias = plan.dias.includes(diaId) ? plan.dias.filter(d => d !== diaId) : [...plan.dias, diaId];
    setPlan({ ...plan, dias: nuevosDias });
  };

  // ==========================================
  // CONEXIÓN A BASE DE DATOS: PLANES
  // ==========================================
  const confirmarPlanGlucosa = async () => {
    if (!planGlucosa.fechaInicio || !planGlucosa.hora || planGlucosa.dias.length === 0) {
      return alert("Faltan datos para establecer el plan.");
    }
    try {
      const res = await fetch('http://localhost:4000/api/monitoreo/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteId: id, tipo: 'GLUCOSA', fechaInicio: planGlucosa.fechaInicio, fechaFin: planGlucosa.fechaFin, hora: planGlucosa.hora, dias: planGlucosa.dias.join(','), ayuno: planGlucosa.ayuno })
      });
      if (res.ok) {
        const data = await res.json();
        setPlanGlucosa({ ...planGlucosa, id: data.id, configurado: true });
        setEditandoPlanGlucosa(false);
      }
    } catch (error) { console.error("Error guardando plan:", error); }
  };

  const confirmarPlanTA = async () => {
    if (!planTA.fechaInicio || !planTA.hora || planTA.dias.length === 0) {
      return alert("Faltan datos para establecer el plan.");
    }
    try {
      const res = await fetch('http://localhost:4000/api/monitoreo/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteId: id, tipo: 'TA', fechaInicio: planTA.fechaInicio, fechaFin: planTA.fechaFin, hora: planTA.hora, dias: planTA.dias.join(','), ayuno: false })
      });
      if (res.ok) {
        const data = await res.json();
        setPlanTA({ ...planTA, id: data.id, configurado: true });
        setEditandoPlanTA(false);
      }
    } catch (error) { console.error("Error guardando plan:", error); }
  };

  // ==========================================
  // CONEXIÓN A BASE DE DATOS: REGISTROS (TOMAS)
  // ==========================================
  const agregarRegistroGlucosa = async () => {
    if (!nuevaGlucosa.fecha || !nuevaGlucosa.resultado) return alert("Faltan datos");
    try {
      const res = await fetch('http://localhost:4000/api/monitoreo/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: planGlucosa.id, fecha: nuevaGlucosa.fecha, hora: nuevaGlucosa.hora, resultado: nuevaGlucosa.resultado, firma: 'Jefe Médico' })
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrosGlucosa([{ ...data, fecha: data.fechaToma, hora: data.horaToma }, ...registrosGlucosa]);
        setNuevaGlucosa({ fecha: '', hora: '', resultado: '' });
      }
    } catch (error) { console.error("Error al registrar:", error); }
  };

  const agregarRegistroTA = async () => {
    if (!nuevaTA.fecha || !nuevaTA.resultado) return alert("Faltan datos");
    try {
      const res = await fetch('http://localhost:4000/api/monitoreo/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: planTA.id, fecha: nuevaTA.fecha, hora: nuevaTA.hora, resultado: nuevaTA.resultado, firma: nuevaTA.firma })
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrosTA([{ ...data, fecha: data.fechaToma, hora: data.horaToma }, ...registrosTA]);
        setNuevaTA({ fecha: '', hora: '', resultado: '', firma: 'Jefe Médico' });
      }
    } catch (error) { console.error("Error al registrar:", error); }
  };

  // ==========================================
  // DESCARGA DE PDF
  // ==========================================
  const descargarFormatoPDF = async (tipoMonitoreo) => {
    try {
      const response = await fetch(`http://localhost:4000/api/monitoreo/${id}/pdf/${tipoMonitoreo}`);
      if (!response.ok) throw new Error("Error al generar PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Hoja_Control_${tipoMonitoreo}_MK-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Hubo un problema al generar el documento PDF.");
      console.error(error);
    }
  };

  const inputClass = "w-full mt-1 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all bg-slate-50 focus:bg-white";
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-10">
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 p-1" />
            <div>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-widest">Plan de Monitoreo Físico</h1>
              <p className="text-sm font-bold text-[#7E1D3B]">Paciente: {paciente?.nombreCompleto || 'Cargando...'} | Clave: {id}</p>
            </div>
          </div>
          <button onClick={() => navigate('/medico/pacientes')} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#7E1D3B] flex items-center gap-2 transition-colors shadow-sm">
            <ArrowLeft size={14} /> Volver a Pacientes
          </button>
        </div>

        {/* TABS */}
        <div className="flex p-1.5 bg-slate-200/50 rounded-xl mb-6 w-fit shadow-inner">
          <button onClick={() => setPestañaActiva('glucosa')} className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2.5 ${pestañaActiva === 'glucosa' ? 'bg-white text-[#7E1D3B] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
            <Droplet size={18} /> Control de Glicemia
          </button>
          <button onClick={() => setPestañaActiva('ta')} className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2.5 ${pestañaActiva === 'ta' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
            <HeartPulse size={18} /> Tensión Arterial
          </button>
        </div>

        {/* MAIN CONTAINER */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* --- PESTAÑA GLUCOSA --- */}
          {pestañaActiva === 'glucosa' && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col border-t-4 border-t-[#7E1D3B]/70 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#7E1D3B]/10 p-2 rounded-xl"><Droplet size={20} className="text-[#7E1D3B]" /></div>
                  <h2 className="text-base font-black uppercase tracking-[0.1em] text-slate-800">Control de Glicemia</h2>
                </div>
                {!editandoPlanGlucosa && (
                  <button onClick={() => setEditandoPlanGlucosa(true)} className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Edit2 size={14} /> Modificar Plan
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 space-y-8">
                {editandoPlanGlucosa ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
                      <Calendar size={16} /> Programar Plan Estructurado
                    </h3>
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className={labelClass}>Fecha de Inicio *</label>
                        <input type="date" value={planGlucosa.fechaInicio} onChange={e => setPlanGlucosa({...planGlucosa, fechaInicio: e.target.value})} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Fecha de Fin (Opcional)</label>
                        <input type="date" value={planGlucosa.fechaFin} onChange={e => setPlanGlucosa({...planGlucosa, fechaFin: e.target.value})} className={inputClass} />
                      </div>
                    </div>
                    <div className="mb-5">
                      <label className={`${labelClass} mb-3 block`}>Días de Toma *</label>
                      <div className="flex gap-3">
                        {DIAS_SEMANA.map(dia => (
                          <button key={dia.id} onClick={() => toggleDia(dia.id, planGlucosa, setPlanGlucosa)} className={`w-12 h-12 rounded-xl text-sm font-bold border transition-all ${planGlucosa.dias.includes(dia.id) ? 'bg-[#7E1D3B] text-white border-[#7E1D3B] shadow-md scale-105' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}>{dia.id}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end gap-5 mb-6">
                      <div className="flex-1">
                        <label className={labelClass}>Hora de la Toma *</label>
                        <input type="time" value={planGlucosa.hora} onChange={e => setPlanGlucosa({...planGlucosa, hora: e.target.value})} className={inputClass} />
                      </div>
                      <label className="flex items-center gap-3 cursor-pointer pb-3 flex-1 bg-white border border-slate-200 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={planGlucosa.ayuno} onChange={e => setPlanGlucosa({...planGlucosa, ayuno: e.target.checked})} className="w-5 h-5 text-[#7E1D3B] rounded focus:ring-[#7E1D3B]" />
                        <span className="text-sm font-bold text-slate-700 uppercase">Toma en Ayuno</span>
                      </label>
                    </div>
                    <button onClick={confirmarPlanGlucosa} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors">Fijar Plan en BD</button>
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 size={28} className="text-emerald-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1.5">Plan Activo</h3>
                        <p className="text-base font-medium text-slate-700">Toma a las <strong className="text-slate-900">{planGlucosa.hora} hrs</strong> los días <strong className="text-slate-900">{planGlucosa.dias.join(', ')}</strong>. {planGlucosa.ayuno && <span className="ml-2 text-[#7E1D3B] font-bold bg-white px-2 py-0.5 rounded border border-[#7E1D3B]/20">(En Ayuno)</span>}</p>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Inicia: {planGlucosa.fechaInicio} {planGlucosa.fechaFin ? `| Termina: ${planGlucosa.fechaFin}` : '| Indefinido'}</p>
                      </div>
                    </div>
                    <button onClick={() => descargarFormatoPDF('GLUCOSA')} className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition-all shadow-sm group">
                      <FileText size={20} className="text-slate-400 group-hover:text-sky-600 transition-colors" />
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-sky-700">Imprimir Hoja</span>
                    </button>
                  </div>
                )}

                <div className={!planGlucosa.configurado ? 'opacity-40 pointer-events-none' : ''}>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Registrar Toma</h3>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 items-end mb-6 shadow-sm">
                    <div className="flex-1">
                      <label className={labelClass}>Fecha / Hora de toma real</label>
                      <div className="flex gap-2 mt-1">
                        <input type="date" value={nuevaGlucosa.fecha} onChange={e => setNuevaGlucosa({...nuevaGlucosa, fecha: e.target.value})} className={inputClass} />
                        <input type="time" value={nuevaGlucosa.hora} onChange={e => setNuevaGlucosa({...nuevaGlucosa, hora: e.target.value})} className={inputClass} />
                      </div>
                    </div>
                    <div className="w-32">
                      <label className={labelClass}>Resultado</label>
                      <input type="text" placeholder="Ej. 95" value={nuevaGlucosa.resultado} onChange={e => setNuevaGlucosa({...nuevaGlucosa, resultado: e.target.value})} className={inputClass} />
                    </div>
                    <button onClick={agregarRegistroGlucosa} className="bg-[#7E1D3B] text-white p-3 rounded-lg hover:bg-[#63162e] transition-colors"><Plus size={20}/></button>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px]">
                          <th className="p-4 font-bold border-b border-slate-200">Fecha y Hora</th>
                          <th className="p-4 font-bold border-b border-slate-200">Nivel de Glucosa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {registrosGlucosa.map(reg => (
                          <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 text-slate-600">{reg.fecha} a las <span className="font-bold text-slate-800">{reg.hora}</span></td>
                            <td className="p-4 font-black text-[#7E1D3B] text-base">{reg.resultado} mg/dL</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* --- PESTAÑA TA --- */}
          {pestañaActiva === 'ta' && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col border-t-4 border-t-slate-800 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-xl"><HeartPulse size={20} className="text-slate-800" /></div>
                  <h2 className="text-base font-black uppercase tracking-[0.1em] text-slate-800">Control de Tensión Arterial</h2>
                </div>
                {!editandoPlanTA && (
                  <button onClick={() => setEditandoPlanTA(true)} className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Edit2 size={14} /> Modificar Plan
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 space-y-8">
                {editandoPlanTA ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
                      <Calendar size={16} /> Programar Plan Estructurado
                    </h3>
                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className={labelClass}>Fecha de Inicio *</label>
                        <input type="date" value={planTA.fechaInicio} onChange={e => setPlanTA({...planTA, fechaInicio: e.target.value})} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Fecha de Fin (Opcional)</label>
                        <input type="date" value={planTA.fechaFin} onChange={e => setPlanTA({...planTA, fechaFin: e.target.value})} className={inputClass} />
                      </div>
                    </div>
                    <div className="mb-5">
                      <label className={`${labelClass} mb-3 block`}>Días de Toma *</label>
                      <div className="flex gap-3">
                        {DIAS_SEMANA.map(dia => (
                          <button key={dia.id} onClick={() => toggleDia(dia.id, planTA, setPlanTA)} className={`w-12 h-12 rounded-xl text-sm font-bold border transition-all ${planTA.dias.includes(dia.id) ? 'bg-slate-800 text-white border-slate-800 shadow-md scale-105' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}>{dia.id}</button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6 w-1/2">
                      <label className={labelClass}>Hora de la Toma *</label>
                      <input type="time" value={planTA.hora} onChange={e => setPlanTA({...planTA, hora: e.target.value})} className={inputClass} />
                    </div>
                    <button onClick={confirmarPlanTA} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-colors">Fijar Plan en BD</button>
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 size={28} className="text-emerald-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1.5">Plan Activo</h3>
                        <p className="text-base font-medium text-slate-700">Toma a las <strong className="text-slate-900">{planTA.hora} hrs</strong> los días <strong className="text-slate-900">{planTA.dias.join(', ')}</strong>.</p>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Inicia: {planTA.fechaInicio} {planTA.fechaFin ? `| Termina: ${planTA.fechaFin}` : '| Indefinido'}</p>
                      </div>
                    </div>
                    <button onClick={() => descargarFormatoPDF('TA')} className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition-all shadow-sm group">
                      <FileText size={20} className="text-slate-400 group-hover:text-sky-600 transition-colors" />
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-sky-700">Imprimir Hoja</span>
                    </button>
                  </div>
                )}

                <div className={!planTA.configurado ? 'opacity-40 pointer-events-none' : ''}>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Registrar Toma</h3>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 items-end mb-6 shadow-sm">
                    <div className="flex-1">
                      <label className={labelClass}>Fecha / Hora real</label>
                      <div className="flex gap-2 mt-1">
                        <input type="date" value={nuevaTA.fecha} onChange={e => setNuevaTA({...nuevaTA, fecha: e.target.value})} className={inputClass} />
                        <input type="time" value={nuevaTA.hora} onChange={e => setNuevaTA({...nuevaTA, hora: e.target.value})} className={inputClass} />
                      </div>
                    </div>
                    <div className="w-32">
                      <label className={labelClass}>Resultado</label>
                      <input type="text" placeholder="Ej. 120/80" value={nuevaTA.resultado} onChange={e => setNuevaTA({...nuevaTA, resultado: e.target.value})} className={inputClass} />
                    </div>
                    <button onClick={agregarRegistroTA} className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700 transition-colors"><Plus size={20}/></button>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px]">
                          <th className="p-4 font-bold border-b border-slate-200">Fecha y Hora</th>
                          <th className="p-4 font-bold border-b border-slate-200">Resultado</th>
                          <th className="p-4 font-bold border-b border-slate-200">Firma</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {registrosTA.map(reg => (
                          <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 text-slate-600">{reg.fecha} a las <span className="font-bold text-slate-800">{reg.hora}</span></td>
                            <td className="p-4 font-black text-slate-800 text-base">{reg.resultado}</td>
                            <td className="p-4 text-xs text-slate-400 uppercase">{reg.firma}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => { navigate(`/medico/expedientes/${id}`); }} 
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#7E1D3B] hover:bg-[#63162e] shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save size={18} /> Guardar Avance y Volver al Expediente
          </button>
        </div>

      </div>
    </div>
  );
};

export default ControlMonitoreo;