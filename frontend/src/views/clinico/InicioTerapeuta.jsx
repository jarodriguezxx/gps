import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, LayoutDashboard, CheckCircle, Calendar, Clock, AlignLeft, Sparkles, Info, Timer, ShoppingCart } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const FORM_VACIO = { titulo: '', fecha: '', hora: '', duracion: '', descripcion: '' };

const Label = ({ children }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1.5">{children}</p>
);

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/40 transition placeholder:text-slate-400";

const InicioTerapeuta = () => {
  const navigate = useNavigate();
  const usuario = (() => { try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; } })();
  const nombreTerapeuta = usuario.nombre || usuario.nombreCompleto || usuario.puesto || 'Terapeuta Operativo';
  const iniciales = nombreTerapeuta.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const [form, setForm] = useState(FORM_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('http://localhost:4000/api/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, terapeuta: nombreTerapeuta }),
      });
      setExito(true);
      setForm(FORM_VACIO);
      setTimeout(() => setExito(false), 4000);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* Header */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Área Terapéutica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Propuesta de Dinámicas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <span className="text-[13px] font-black text-[#7E1D3B]">{iniciales}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700 text-sm">{nombreTerapeuta}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-5 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* Sidebar */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              <button className="mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold bg-[#7E1D3B] text-white shadow-md flex items-center gap-2.5 text-left">
                <LayoutDashboard size={16} className="shrink-0" />
                <span>Proponer Dinámica</span>
              </button>
              <button
                onClick={() => navigate('/clinico/requisiciones')}
                className="mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12 transition flex items-center gap-2.5 text-left"
              >
                <ShoppingCart size={16} className="shrink-0" />
                <span>Requisiciones</span>
              </button>
            </aside>

            {/* Main */}
            <main className="grid gap-5 lg:grid-cols-[1fr_280px]">

              {/* Form card */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                  <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-700">Nueva Propuesta</h2>
                </div>

                <form onSubmit={enviar} className="p-5 space-y-4">

                  {/* Título */}
                  <div>
                    <Label>Nombre de la dinámica</Label>
                    <div className="relative">
                      <Sparkles size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Ej. Terapia grupal de integración" required
                        value={form.titulo} onChange={e => set('titulo', e.target.value)}
                        className={`${inputCls} pl-9`} />
                    </div>
                  </div>

                  {/* Fecha + Hora + Duración en grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Fecha</Label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="date" required value={form.fecha}
                          onChange={e => set('fecha', e.target.value)}
                          className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <Label>Hora de inicio</Label>
                      <div className="relative">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="time" required value={form.hora}
                          onChange={e => set('hora', e.target.value)}
                          className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                  </div>

                  {/* Duración */}
                  <div>
                    <Label>Duración</Label>
                    <div className="relative">
                      <Timer size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select value={form.duracion} onChange={e => set('duracion', e.target.value)}
                        className={`${inputCls} pl-9`}>
                        <option value="">— Seleccionar duración —</option>
                        <option value="30 min">30 minutos</option>
                        <option value="45 min">45 minutos</option>
                        <option value="60 min">1 hora</option>
                        <option value="90 min">1 hora 30 min</option>
                        <option value="120 min">2 horas</option>
                        <option value="Día completo">Día completo</option>
                      </select>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <Label>Descripción de la actividad</Label>
                    <div className="relative">
                      <AlignLeft size={14} className="absolute left-3 top-3 text-slate-400" />
                      <textarea rows={4} placeholder="Describe el objetivo, materiales necesarios o cualquier detalle relevante para la jefatura..."
                        value={form.descripcion} onChange={e => set('descripcion', e.target.value)}
                        className={`${inputCls} pl-9 resize-none`} />
                    </div>
                  </div>

                  {/* Feedback éxito */}
                  {exito && (
                    <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-semibold">
                      <CheckCircle size={16} className="shrink-0" />
                      Propuesta enviada a jefatura correctamente
                    </div>
                  )}

                  <button type="submit" disabled={enviando}
                    className="w-full py-3 bg-[#7E1D3B] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#63162e] transition-colors disabled:opacity-60">
                    <Send size={15} /> {enviando ? 'Enviando...' : 'Enviar a Jefatura'}
                  </button>
                </form>
              </section>

              {/* Info lateral */}
              <aside className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
                    <Info size={14} className="text-[#7E1D3B]" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-700">Flujo de Aprobación</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { n: '1', label: 'Terapeuta propone', desc: 'Completa el formulario y envía la dinámica.' },
                      { n: '2', label: 'Jefatura revisa', desc: 'El Jefe Clínico la aprueba o rechaza desde el calendario.' },
                      { n: '3', label: 'Confirmación', desc: 'La actividad queda registrada con su estado final.' },
                    ].map(s => (
                      <div key={s.n} className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-[#7E1D3B]/10 border border-[#7E1D3B]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-black text-[#7E1D3B]">{s.n}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">{s.label}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#7E1D3B]/5 border border-[#7E1D3B]/15 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#7E1D3B] mb-1">Propuesto como</p>
                  <p className="text-sm font-bold text-slate-800">{nombreTerapeuta}</p>
                </div>
              </aside>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default InicioTerapeuta;
