import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, UserCog, ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Tablero de Control',     icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Auditoría Clínica',      icon: Users,           path: '/clinico/directorio' },
  { label: 'Asignación Terapéutica', icon: UserCog,         path: '/clinico/asignaciones' },
  { label: 'Validación Terapéutica', icon: ClipboardCheck,  path: '/clinico/calendario' },
];

const CalendarioJefeClinico = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fechaActual, setFechaActual] = useState(new Date());
  const [propuestas, setPropuestas] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const obtenerDiasMes = () => {
    const año = fechaActual.getFullYear(), mes = fechaActual.getMonth();
    const primerDia = new Date(año, mes, 1).getDay(), diasEnMes = new Date(año, mes + 1, 0).getDate();
    const dias = [];
    for (let i = 0; i < primerDia; i++) dias.push(null);
    for (let i = 1; i <= diasEnMes; i++) dias.push(new Date(año, mes, i));
    return dias;
  };

  const cargarActividades = () => {
    fetch('http://localhost:4000/api/actividades')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPropuestas(Array.isArray(data) ? data : []))
      .catch(() => setPropuestas([]));
  };
  useEffect(() => { cargarActividades(); }, []);

  const cambiarMes = (offset) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + offset, 1));
    setDiaSeleccionado(null);
  };

  const resolverActividad = async (id, estado) => {
    await fetch(`http://localhost:4000/api/actividades/${id}/estado`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado })
    });
    cargarActividades();
  };

  const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const getActividadesDia = (fecha) => {
    if (!fecha) return [];
    return propuestas.filter(p => p.fecha === toYMD(fecha));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Validación de Actividades</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <CalendarIcon size={18} className="text-[#7E1D3B]" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <item.icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
                    <h2 className="font-black text-[#7E1D3B] uppercase tracking-widest text-sm">
                      {fechaActual.toLocaleString('es-MX', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                      <button onClick={() => cambiarMes(-1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"><ChevronLeft size={16}/></button>
                      <button onClick={() => cambiarMes(1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"><ChevronRight size={16}/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 border-b bg-slate-50">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                      <div key={d} className="py-2 text-center text-[10px] font-black uppercase text-slate-400">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 bg-white">
                    {obtenerDiasMes().map((dia, i) => {
                      const acts = getActividadesDia(dia);
                      const esSeleccionado = dia && diaSeleccionado && dia.toDateString() === diaSeleccionado.toDateString();
                      return (
                        <div key={i} onClick={() => dia && setDiaSeleccionado(dia)}
                          className={`h-24 border-b border-r border-slate-100 p-2 cursor-pointer transition-all relative ${!dia ? 'bg-slate-50/50' : 'hover:bg-slate-50'} ${esSeleccionado ? 'bg-[#7E1D3B]/5 ring-2 ring-inset ring-[#7E1D3B]' : ''}`}>
                          {dia && (
                            <>
                              <span className="text-xs font-bold text-slate-500">{dia.getDate()}</span>
                              <div className="mt-2 space-y-1">
                                {acts.slice(0, 3).map((a, idx) => (
                                  <div key={idx} className={`h-1.5 w-full rounded-full ${a.estado === 'Aprobada' ? 'bg-emerald-400' : a.estado === 'Pendiente' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="text-xs font-black uppercase tracking-[0.1em] text-slate-700">Agenda Seleccionada</h2>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    {!diaSeleccionado ? (
                      <p className="text-center py-10 text-xs font-bold text-slate-400 uppercase tracking-widest">Toca un día</p>
                    ) : getActividadesDia(diaSeleccionado).length === 0 ? (
                      <p className="text-center py-10 text-xs font-bold text-slate-400 italic">Sin actividades</p>
                    ) : (
                      getActividadesDia(diaSeleccionado).map(a => (
                        <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                          <p className="text-[10px] font-black text-[#7E1D3B] uppercase mb-1">{a.terapeuta}</p>
                          <h4 className="text-sm font-bold text-slate-800 leading-tight">{a.titulo}</h4>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> {a.hora}</p>
                            {a.duracion && (
                              <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{a.duracion}</span>
                            )}
                          </div>
                          <div className="mt-2 border-t border-slate-200 pt-2">
                            {a.descripcion
                              ? <p className="text-[11px] text-slate-600 leading-snug">{a.descripcion}</p>
                              : <p className="text-[10px] text-slate-300 italic">Sin descripción</p>
                            }
                          </div>
                          {a.estado === 'Pendiente' ? (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                              <button onClick={() => resolverActividad(a.id, 'Rechazada')} className="py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-[10px] font-black uppercase hover:bg-rose-50 shadow-sm flex items-center justify-center gap-1"><XCircle size={14}/> Rechazar</button>
                              <button onClick={() => resolverActividad(a.id, 'Aprobada')} className="py-2 bg-[#7E1D3B] text-white rounded-lg text-[10px] font-black uppercase hover:bg-[#63162e] shadow-sm flex items-center justify-center gap-1"><CheckCircle2 size={14}/> Aprobar</button>
                            </div>
                          ) : (
                            <div className={`mt-3 py-1.5 text-center rounded-lg text-[9px] font-black uppercase border ${a.estado === 'Aprobada' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'}`}>
                              Actividad {a.estado}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default CalendarioJefeClinico;