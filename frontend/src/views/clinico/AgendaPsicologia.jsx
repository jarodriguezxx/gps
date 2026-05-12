import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, CalendarPlus, Send, History, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Mis Pacientes', icon: Users,        path: '/psicologia/inicio' },
  { label: 'Agendar Cita',  icon: CalendarPlus, path: '/psicologia/agendar' },
];

const AgendaPsicologia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hoy = new Date().toISOString().split('T')[0];

  const [formulario, setFormulario] = useState({ tipo: 'Terapia Individual', paciente: '', motivo: '', fecha: hoy, hora: '', terapeuta: 'Psicología' });
  const [enviando, setEnviando] = useState(false);
  const [misPeticiones, setMisPeticiones] = useState([]);

  const cargarHistorial = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/actividades');
      if (res.ok) setMisPeticiones((await res.json()).filter(a => a.terapeuta === 'Psicología').reverse());
    } catch (e) {}
  };
  useEffect(() => { cargarHistorial(); }, []);

  const enviarCita = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      // Creamos un título compuesto que sea muy claro para el Jefe Clínico
      const tituloCompuesto = `[${formulario.tipo}] ${formulario.paciente} - ${formulario.motivo}`;
      
      const res = await fetch('http://localhost:4000/api/actividades', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
           titulo: tituloCompuesto,
           fecha: formulario.fecha,
           hora: formulario.hora,
           terapeuta: formulario.terapeuta,
           estado: 'Pendiente'
        })
      });
      
      if(res.ok) {
        setFormulario({ ...formulario, paciente: '', motivo: '', hora: '' });
        await cargarHistorial(); 
      }
    } catch (error) { console.error(error); } finally { setEnviando(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-bold">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Departamento de Psicología</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Sesión Activa</p>
                <p className="font-black text-slate-800">Psicólogo Clínico</p>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center text-[#7E1D3B]">
                <CalendarPlus size={18} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
                  <item.icon size={16} className="shrink-0" /><span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">
              
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                  <div>
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Solicitud de Agenda Clínica</h2>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">Sujeto a Validación de Jefatura</p>
                  </div>
                </div>

                <div className="p-6">
                  <form onSubmit={enviarCita} className="space-y-5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Tipo de Actividad</label>
                        <select value={formulario.tipo} onChange={e => setFormulario({...formulario, tipo: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 font-semibold text-slate-700">
                          <option value="Terapia Individual">Terapia Individual</option>
                          <option value="Terapia Grupal">Terapia Grupal</option>
                          <option value="Evaluación Diagnóstica">Evaluación Diagnóstica</option>
                          <option value="Intervención en Crisis">Intervención en Crisis</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Nombre del Paciente(s)</label>
                        <input type="text" placeholder="Ej. Juan Pérez" required 
                          value={formulario.paciente} onChange={e => setFormulario({...formulario, paciente: e.target.value})} 
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Motivo Clínico Breve</label>
                      <input type="text" placeholder="Ej. Seguimiento semanal de ansiedad" required 
                        value={formulario.motivo} onChange={e => setFormulario({...formulario, motivo: e.target.value})} 
                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Fecha Propuesta</label>
                        <input type="date" required min={hoy} 
                          value={formulario.fecha} onChange={e => setFormulario({...formulario, fecha: e.target.value})} 
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 font-semibold" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Horario</label>
                        <input type="time" required min="08:00" max="20:00"
                          value={formulario.hora} onChange={e => setFormulario({...formulario, hora: e.target.value})} 
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 font-semibold" 
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <button type="submit" disabled={enviando} 
                        className="w-full py-4 bg-[#7E1D3B] text-white rounded-xl text-sm font-bold hover:bg-[#63162e] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-95">
                        <Send size={18} /> {enviando ? 'Enviando a Servidor...' : 'Solicitar Aprobación de Jefatura'}
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-slate-500" />
                    <h2 className="text-xs font-black uppercase tracking-[0.1em] text-slate-700">Trazabilidad</h2>
                  </div>
                  <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg shadow-sm">{misPeticiones.length} Solicitudes</span>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50/30">
                  {misPeticiones.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-50 text-slate-400">
                       <CalendarPlus size={32} className="mb-2" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Historial Vacío</p>
                    </div>
                  ) : (
                    misPeticiones.map(p => (
                      <div key={p.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#7E1D3B]/30 transition-colors">
                        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                          <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><Clock size={12} className="text-[#7E1D3B]"/> {p.fecha} • {p.hora}</p>
                          {p.estado === 'Aprobada' && <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1"><CheckCircle2 size={10}/> Aprobada</span>}
                          {p.estado === 'Rechazada' && <span className="bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1"><XCircle size={10}/> Rechazada</span>}
                          {p.estado === 'Pendiente' && <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1"><AlertCircle size={10}/> En Revisión</span>}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{p.titulo}</h4>
                      </div>
                    ))
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

export default AgendaPsicologia;