import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Trash2, Send, ArrowLeft } from 'lucide-react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';

const UNIDADES = ['Pza', 'Caja', 'Paquete', 'Litro', 'Kg', 'Servicio', 'Botella', 'Bulto', 'Resma'];
const PRIORIDADES = ['Normal', 'Urgente', 'Crítica'];
export const STORAGE_KEY_SOL = 'mrkm_solicitudes_almacen_v1';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const crearArt = () => ({ id: genId(), producto: '', cantidad: 1, unidad: 'Pza' });

const getFolio = () => {
  const n = parseInt(localStorage.getItem('mrkm_sol_count') || '0') + 1;
  localStorage.setItem('mrkm_sol_count', String(n));
  return `SOL-${new Date().getFullYear()}-${String(n).padStart(3, '0')}`;
};

const ESTADO_BADGE = {
  PENDIENTE:        { label: 'Pendiente',         cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  EN_REVISION:      { label: 'En revisión',        cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  COMPLETADA:       { label: 'Surtida ✓',          cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PARCIAL:          { label: 'Parcial',             cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  ENVIADA_COMPRAS:  { label: 'Enviada a Compras',   cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const PRIORIDAD_ESTILOS = {
  Normal:   'bg-slate-100 text-slate-600',
  Urgente:  'bg-amber-100 text-amber-700',
  Crítica:  'bg-rose-100 text-rose-700',
};

const SolicitudAlmacen = () => {
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([crearArt()]);
  const [form, setForm] = useState({ solicitante: '', prioridad: 'Normal', observaciones: '' });
  const [folioExito, setFolioExito] = useState('');
  const [error, setError] = useState('');

  // Re-lee historial cada vez que se guarda una nueva
  const solicitudes = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SOL) || '[]'); }
    catch { return []; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folioExito]);

  const actualizarForm = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const actualizarArt = (id, campo, valor) =>
    setArticulos(prev => prev.map(a => a.id === id ? { ...a, [campo]: valor } : a));

  const agregarArt = () => setArticulos(p => [...p, crearArt()]);

  const eliminarArt = (id) =>
    setArticulos(p => { const s = p.filter(a => a.id !== id); return s.length ? s : [crearArt()]; });

  const enviar = () => {
    setError('');
    if (!form.solicitante.trim()) { setError('Escribe el nombre del solicitante.'); return; }
    const validos = articulos.filter(a => a.producto.trim());
    if (!validos.length) { setError('Agrega al menos un producto.'); return; }

    const folio = getFolio();
    const nueva = {
      id: genId(),
      folio,
      area: 'Admisiones',
      solicitante: form.solicitante.trim(),
      prioridad: form.prioridad,
      observaciones: form.observaciones.trim(),
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE',
      articulos: validos.map(a => ({
        id: genId(),
        producto: a.producto.trim(),
        cantidad: Number(a.cantidad) || 1,
        unidad: a.unidad,
        estadoAlmacen: 'pendiente',
        cantidadSurtida: null,
      })),
      fechaRevision: null,
      notasAlmacen: '',
    };

    const actuales = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SOL) || '[]'); } catch { return []; }
    })();
    localStorage.setItem(STORAGE_KEY_SOL, JSON.stringify([nueva, ...actuales]));

    setForm({ solicitante: '', prioridad: 'Normal', observaciones: '' });
    setArticulos([crearArt()]);
    setFolioExito(folio);
    setTimeout(() => setFolioExito(''), 5000);
  };

  const misolicitudes = solicitudes.filter(s => s.area === 'Admisiones');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <AdminHeader submodule="Solicitud a Almacén" />

        <main>
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <aside><AdmisionesSidebar /></aside>

            <section className="space-y-5">

              {/* ── Encabezado ── */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Admisiones → Almacén</p>
                      <h2 className="text-2xl font-black text-slate-900">Solicitud de Insumos</h2>
                      <p className="text-sm text-slate-500">Solicita artículos del almacén para tu área.</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/admisiones')}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                    <ArrowLeft size={15} /> Regresar
                  </button>
                </div>
              </div>

              {/* ── Mensajes ── */}
              {folioExito && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
                  Solicitud <span className="font-black">{folioExito}</span> enviada a Almacén. Puedes ver su estado abajo.
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-800">
                  {error}
                </div>
              )}

              {/* ── Datos generales ── */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Datos de la solicitud</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Área</label>
                    <div className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-semibold text-slate-500">
                      Admisiones
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Solicitante</label>
                    <input type="text" name="solicitante" value={form.solicitante} onChange={actualizarForm}
                      placeholder="Nombre de quien solicita"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Prioridad</label>
                    <select name="prioridad" value={form.prioridad} onChange={actualizarForm}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15">
                      {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Observaciones</label>
                  <textarea name="observaciones" value={form.observaciones} onChange={actualizarForm}
                    rows={2} placeholder="Notas adicionales para almacén (opcional)…"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15" />
                </div>
              </div>

              {/* ── Tabla de artículos ── */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Detalle</p>
                    <h3 className="text-lg font-black text-slate-900">Artículos requeridos</h3>
                  </div>
                  <button onClick={agregarArt}
                    className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#63162e]">
                    <Plus size={15} /> Agregar
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[#7E1D3B] text-white">
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Producto / Artículo</th>
                        <th className="w-28 px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Cantidad</th>
                        <th className="w-32 px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Unidad</th>
                        <th className="w-12 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {articulos.map((art, idx) => (
                        <tr key={art.id} className={`border-t border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="px-4 py-3">
                            <input type="text" value={art.producto}
                              onChange={e => actualizarArt(art.id, 'producto', e.target.value)}
                              placeholder="Ej. Papel bond carta, Bolígrafo azul…"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15" />
                          </td>
                          <td className="px-4 py-3">
                            <input type="number" min="1" value={art.cantidad}
                              onChange={e => actualizarArt(art.id, 'cantidad', Number(e.target.value))}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15" />
                          </td>
                          <td className="px-4 py-3">
                            <select value={art.unidad} onChange={e => actualizarArt(art.id, 'unidad', e.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15">
                              {UNIDADES.map(u => <option key={u}>{u}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => eliminarArt(art.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={enviar}
                  className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#63162e]">
                  <Send size={16} /> Enviar solicitud a Almacén
                </button>
              </div>

              {/* ── Historial ── */}
              {misolicitudes.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Seguimiento</p>
                    <h3 className="text-lg font-black text-slate-900">Mis solicitudes enviadas</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Folio</th>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Fecha</th>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Solicitante</th>
                          <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Prioridad</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Artículos</th>
                          <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {misolicitudes.map(s => {
                          const badge = ESTADO_BADGE[s.estado] || ESTADO_BADGE.PENDIENTE;
                          return (
                            <tr key={s.id} className="transition hover:bg-slate-50">
                              <td className="px-4 py-3 text-xs font-black tracking-wide text-[#7E1D3B]">{s.folio}</td>
                              <td className="px-4 py-3 text-xs text-slate-500">
                                {new Date(s.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-700">{s.solicitante}</td>
                              <td className="px-4 py-3">
                                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${PRIORIDAD_ESTILOS[s.prioridad]}`}>
                                  {s.prioridad}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-slate-500">{s.articulos.length}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${badge.cls}`}>
                                  {badge.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SolicitudAlmacen;
