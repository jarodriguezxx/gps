import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, CalendarPlus, Send, History, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [{ label: 'Mis Pacientes', icon: Users, path: '/familia/inicio' }, { label: 'Agendar Cita', icon: CalendarPlus, path: '/familia/agendar' }];

const AgendaFamilia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hoy = new Date().toISOString().split('T')[0];
  const [formulario, setFormulario] = useState({ tipo: 'Entrevista Familiar', titulo: '', fecha: hoy, hora: '', terapeuta: 'Familia' }); // <--- CLAVE
  const [enviando, setEnviando] = useState(false);
  const [misPeticiones, setMisPeticiones] = useState([]);

  const cargarHistorial = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/actividades');
      if (res.ok) setMisPeticiones((await res.json()).filter(a => a.terapeuta === 'Familia').reverse());
    } catch (e) {}
  };
  useEffect(() => { cargarHistorial(); }, []);

  const enviarCita = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch('http://localhost:4000/api/actividades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formulario, titulo: `[${formulario.tipo}] ${formulario.titulo}`, estado: 'Pendiente' }) });
      if(res.ok) { setFormulario({ ...formulario, titulo: '', hora: '' }); await cargarHistorial(); }
    } catch (error) {} finally { setEnviando(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex justify-between px-6 py-4 border-b"><div className="flex items-center gap-3"><img src={marakameLogo} alt="Logo" className="h-12 w-auto border p-1 rounded-xl" /><div><h1 className="text-xl font-black text-slate-800">Departamento de Familia</h1></div></div></div>
          <div className="grid gap-6 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold flex gap-2.5 ${location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md' : 'border border-[#7E1D3B]/20 text-[#7E1D3B]'}`}>
                  <item.icon size={16} /><span>{item.label}</span>
                </button>
              ))}
            </aside>
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <section className="bg-white rounded-2xl border shadow-sm flex flex-col">
                <div className="p-5 border-b bg-slate-50/50 flex gap-2"><div className="h-5 w-1 rounded-full bg-[#A13D5A]" /><h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Solicitud de Agenda</h2></div>
                <div className="p-6">
                  <form onSubmit={enviarCita} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Actividad</label>
                      <select value={formulario.tipo} onChange={e => setFormulario({...formulario, tipo: e.target.value})} className="w-full p-3 rounded-xl border bg-slate-50 text-sm font-semibold">
                        <option value="Entrevista Familiar">Entrevista Familiar</option><option value="Terapia de Pareja">Terapia de Pareja</option><option value="Escuela para Padres">Escuela para Padres</option>
                      </select>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descripción</label><input type="text" required value={formulario.titulo} onChange={e => setFormulario({...formulario, titulo: e.target.value})} className="w-full p-3 rounded-xl border bg-slate-50 text-sm" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Fecha</label><input type="date" required min={hoy} value={formulario.fecha} onChange={e => setFormulario({...formulario, fecha: e.target.value})} className="w-full p-3 rounded-xl border bg-slate-50 text-sm font-semibold" /></div>
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hora</label><input type="time" required value={formulario.hora} onChange={e => setFormulario({...formulario, hora: e.target.value})} className="w-full p-3 rounded-xl border bg-slate-50 text-sm font-semibold" /></div>
                    </div>
                    <button type="submit" disabled={enviando} className="w-full mt-6 py-3.5 bg-[#7E1D3B] text-white rounded-xl text-sm font-bold flex justify-center gap-2 shadow-sm"><Send size={18} /> Enviar</button>
                  </form>
                </div>
              </section>
              <section className="bg-white rounded-2xl border shadow-sm flex flex-col h-full max-h-[550px]">
                <div className="p-5 border-b bg-slate-50/50 flex justify-between"><h2 className="text-sm font-black uppercase tracking-[0.1em] text-slate-700">Historial</h2><span className="text-[10px] font-black bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{misPeticiones.length} Registros</span></div>
                <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50/30">
                  {misPeticiones.length === 0 ? <div className="text-center text-slate-400 mt-10 text-[10px] font-black uppercase">Sin solicitudes</div> : misPeticiones.map(p => (
                    <div key={p.id} className="p-4 bg-white border rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2"><p className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> {p.fecha} a las {p.hora}</p>
                        {p.estado === 'Aprobada' && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[9px] font-black uppercase flex gap-1"><CheckCircle2 size={10}/> Aprobada</span>}
                        {p.estado === 'Pendiente' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[9px] font-black uppercase flex gap-1"><AlertCircle size={10}/> Revisión</span>}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{p.titulo}</h4>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};
export default AgendaFamilia;