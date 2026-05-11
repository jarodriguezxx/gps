import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, CheckCircle2, XCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',        icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Directorio Auditoría',   icon: Users,           path: '/clinico/directorio' },
  { label: 'Validar Actividades',    icon: ClipboardCheck,  path: '/clinico/calendario' },
];

const CalendarioJefeClinico = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR DATOS REALES DEL BACKEND
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/actividades');
        if (response.ok) {
          const data = await response.json();
          // Opcional: Filtrar para que solo se vean las Pendientes o mostrar todo el historial
          setPropuestas(data);
        }
      } catch (error) {
        console.error('Error cargando actividades:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActividades();
  }, []);

  // 2. ENVIAR LA APROBACIÓN/RECHAZO AL BACKEND
  const resolver = async (id, accion) => {
    try {
      const response = await fetch(`http://localhost:4000/api/actividades/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: accion })
      });

      if (response.ok) {
        // Si el backend responde OK, actualizamos la pantalla
        setPropuestas(propuestas.map(p => p.id === id ? { ...p, estado: accion } : p));
      } else {
        alert("Hubo un error al actualizar el estado en la base de datos.");
      }
    } catch (error) {
      console.error('Error actualizando actividad:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <h1 className="text-xl font-black text-slate-800">Validación de Calendario</h1>
            </div>
             <div className="flex items-center gap-3 self-end md:self-auto">
               <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center text-[#7E1D3B]"><CalendarIcon size={18} /></div>
               <p className="text-sm font-bold text-slate-700">Supervisor Clínico</p>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </aside>
            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                   <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-amber-500" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Propuestas de Terapeutas</h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="text-center py-10 text-slate-400 font-bold">Cargando actividades desde el servidor...</div>
                  ) : propuestas.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 font-bold">No hay actividades registradas.</div>
                  ) : (
                    propuestas.map(p => (
                      <div key={p.id} className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${p.estado === 'Pendiente' ? 'bg-white border-slate-200 shadow-sm' : p.estado === 'Aprobada' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Terapeuta: {p.terapeuta}</p>
                          <h3 className="text-base font-bold text-slate-800">{p.titulo}</h3>
                          <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1"><Clock size={12}/> {p.fecha} • {p.hora}</p>
                        </div>

                        {p.estado === 'Pendiente' ? (
                          <div className="flex gap-2">
                            <button onClick={() => resolver(p.id, 'Rechazada')} className="p-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><XCircle size={18}/></button>
                            <button onClick={() => resolver(p.id, 'Aprobada')} className="px-5 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-bold text-xs uppercase hover:bg-[#63162e] shadow-md flex items-center gap-2 transition-all">Aprobar</button>
                          </div>
                        ) : (
                          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${p.estado === 'Aprobada' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                            {p.estado}
                          </div>
                        )}
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

export default CalendarioJefeClinico;