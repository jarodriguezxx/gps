import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Printer, Trash2, Save, ArrowLeft, Clock } from 'lucide-react';
import { AdminHeader } from '../layout/AdminLayout';
import { API_BASE } from '../../config/api';

const UNIDADES = [
  { value: 'PIEZA',     label: 'Pieza' },
  { value: 'CAJA',      label: 'Caja' },
  { value: 'PAQUETE',   label: 'Paquete' },
  { value: 'LITRO',     label: 'Litro' },
  { value: 'KILOGRAMO', label: 'Kg' },
  { value: 'SERVICIO',  label: 'Servicio' },
  { value: 'BOTELLA',   label: 'Botella' },
  { value: 'BULTO',     label: 'Bulto' },
  { value: 'OTRO',      label: 'Otro' },
];

const TIPOS = [
  { value: 'ORDINARIA',      label: 'Ordinaria',      desc: 'Insumos de uso diario' },
  { value: 'EXTRAORDINARIA', label: 'Extraordinaria',  desc: 'Compra especial (literatura, medallas, reactivos…)' },
];

const pad = (v) => String(v).padStart(2, '0');
const toInputDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const moneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

const createLinea = () => ({
  id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  cantidad: '1',
  unidad: 'PIEZA',
  producto: '',
  descripcion: '',
  precioUnitario: '0.00',
});

const ventanaAbierta = () => true;

const proximaVentana = () => {
  const ahora = new Date();
  const diasHastaMartes = (2 - ahora.getDay() + 7) % 7 || 7;
  const martes = new Date(ahora);
  martes.setDate(ahora.getDate() + diasHastaMartes);
  return martes.toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long' });
};

// ─────────────────────────────────────────────────────────────────
// Props:
//   sidebar          — componente sidebar del módulo (JSX)
//   moduleName       — nombre del módulo para header ("Admisiones", "Médico"…)
//   departamentoFijo — departamento fijo del módulo (read-only)
// ─────────────────────────────────────────────────────────────────
const RequisicionForm = ({ sidebar, moduleName = 'Módulo', departamentoFijo = '' }) => {
  const navigate = useNavigate();
  const fechaSistema = useMemo(() => toInputDate(new Date()), []);
  const puedeEnviar = ventanaAbierta();

  const session = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
  }, []);

  const [lineas, setLineas] = useState([createLinea()]);
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [formulario, setFormulario] = useState({
    fecha: fechaSistema,
    tipo: 'ORDINARIA',
    observaciones: '',
  });

  const totales = useMemo(() => {
    const subtotal = lineas.reduce(
      (acc, l) => acc + (Number(l.cantidad) || 0) * (Number(l.precioUnitario) || 0), 0
    );
    const iva = subtotal * 0.16;
    return { subtotal, iva, total: subtotal + iva };
  }, [lineas]);

  const actualizarFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarLinea = (id, campo, valor) =>
    setLineas((prev) => prev.map((l) => (l.id === id ? { ...l, [campo]: valor } : l)));

  const agregarLinea = () => setLineas((prev) => [...prev, createLinea()]);

  const eliminarLinea = (id) =>
    setLineas((prev) => {
      const sig = prev.filter((l) => l.id !== id);
      return sig.length > 0 ? sig : [createLinea()];
    });

  const handleGuardar = async () => {
    if (!session.nombreCompleto) {
      setMensajeGuardado('error:No se pudo identificar el usuario de sesión. Vuelve a iniciar sesión.');
      return;
    }

    const articulosValidos = lineas.filter((l) => l.producto.trim() !== '');
    if (articulosValidos.length === 0) {
      setMensajeGuardado('error:Agrega al menos un concepto con nombre de producto.');
      return;
    }

    if (!ventanaAbierta()) {
      setMensajeGuardado('error:Las requisiciones solo se reciben los martes de 9:00 a 15:00 hrs.');
      return;
    }

    setGuardando(true);
    setMensajeGuardado('');

    const payload = {
      area: departamentoFijo,
      solicitante: session.nombreCompleto,
      tipo: formulario.tipo,
      estado: 'PENDIENTE',
      tamanio: 'INDEFINIDO',
      justificacion: formulario.observaciones.trim() || null,
      articulos: articulosValidos.map((l) => ({
        articuloRequisitado: l.producto.trim(),
        articulosSolicitados: Number(l.cantidad) || 1,
        unidad: l.unidad,
        descripcion: l.descripcion?.trim() || null,
        precioUnitario: Number(l.precioUnitario) || 0,
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/requisiciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Error ${res.status}`);
      }

      const data = await res.json();
      const ref = data.id ? `REQ-${data.id.slice(0, 8).toUpperCase()}` : 'enviada';
      setMensajeGuardado(`ok:${ref}`);
      setLineas([createLinea()]);
      setFormulario((prev) => ({ ...prev, observaciones: '', tipo: 'ORDINARIA' }));
    } catch (err) {
      setMensajeGuardado(`error:No se pudo enviar la requisición: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const inputReadOnly = 'w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-600 outline-none cursor-default';
  const inputEdit     = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15';

  const botonEnviar = (
    <button
      type="button"
      onClick={handleGuardar}
      disabled={guardando || !puedeEnviar}
      title={!puedeEnviar ? 'Solo se reciben requisiciones los martes de 9:00 a 15:00 hrs' : undefined}
      className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#63162e] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Save size={16} />
      {guardando ? 'Enviando…' : 'Enviar Requisición'}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 print:px-0 print:py-0">
        <AdminHeader submodule={`Requisiciones · ${moduleName}`} />

        <main className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <aside className="print:hidden">{sidebar}</aside>

            <section className="space-y-5">

              {/* Banner ventana de envío */}
              {!puedeEnviar && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden">
                  <Clock size={18} className="shrink-0 text-amber-500" />
                  <span>
                    <span className="font-bold">Ventana de envío cerrada.</span> Las requisiciones se reciben únicamente los{' '}
                    <span className="font-bold">martes de 9:00 a 15:00 hrs.</span>{' '}
                    Próxima ventana: <span className="font-bold">{proximaVentana()}</span>.
                    Puedes preparar tu solicitud y enviarla ese día.
                  </span>
                </div>
              )}

              {/* Header de impresión */}
              <div className="hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm print:block print:shadow-none">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Instituto Marakame · {moduleName}</p>
                    <h1 className="mt-1 text-3xl font-black text-slate-900">Requisición {formulario.tipo}</h1>
                    <p className="mt-1 text-sm text-slate-500">{departamentoFijo} · {session.nombreCompleto}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Fecha</p>
                    <p className="text-lg font-black text-slate-900">{formulario.fecha}</p>
                  </div>
                </div>
              </div>

              {/* Card principal */}
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 print:rounded-none print:border-slate-300 print:shadow-none">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between print:hidden">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
                      <ClipboardList size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Nueva solicitud · {moduleName}</p>
                      <h2 className="text-2xl font-black text-slate-900">Requisición de {moduleName}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Captura los insumos requeridos. La solicitud se enviará a Recursos Materiales para revisión.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => navigate(-1)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      <ArrowLeft size={16} /> Cancelar
                    </button>
                    <button type="button" onClick={() => window.print()}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
                      <Printer size={16} /> Imprimir
                    </button>
                    {botonEnviar}
                  </div>
                </div>

                {/* Alertas */}
                {mensajeGuardado.startsWith('ok:') && (
                  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 print:hidden">
                    Requisición <span className="font-black">{mensajeGuardado.slice(3)}</span> enviada a Recursos Materiales correctamente.
                    El encargado la revisará y te notificará el avance.
                  </div>
                )}
                {mensajeGuardado.startsWith('error:') && (
                  <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 print:hidden">
                    {mensajeGuardado.slice(6)}
                  </div>
                )}

                {/* Banner tipo */}
                <div className={`mb-5 rounded-2xl border px-4 py-3 text-xs font-medium print:hidden
                  ${formulario.tipo === 'ORDINARIA'
                    ? 'border-slate-200 bg-slate-50 text-slate-600'
                    : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                  {formulario.tipo === 'ORDINARIA'
                    ? 'Requisición ordinaria: todos los artículos son insumos de uso diario. No se deben incluir marcas específicas salvo justificación aprobada.'
                    : 'Requisición extraordinaria: incluye adquisiciones especiales como literatura, medallas, reactivos (antidoping) u otros artículos fuera del consumo regular. Requiere al menos 3 cotizaciones si es compra mayor.'}
                </div>

                {/* Campos */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Fecha</label>
                    <input type="date" value={formulario.fecha} readOnly className={inputReadOnly} />
                  </div>

                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Departamento
                    </label>
                    <input value={departamentoFijo} readOnly className={inputReadOnly} />
                  </div>

                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Solicitante
                    </label>
                    <input value={session.nombreCompleto || '—'} readOnly className={inputReadOnly} />
                    <p className="mt-1 ml-0.5 text-[10px] text-slate-400">Tomado de tu sesión activa</p>
                  </div>

                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Tipo de Requisición
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIPOS.map(({ value, label, desc }) => (
                        <button key={value} type="button"
                          onClick={() => setFormulario((prev) => ({ ...prev, tipo: value }))}
                          className={`rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition
                            ${formulario.tipo === value
                              ? 'border-[#7E1D3B] bg-[#7E1D3B] text-white shadow-sm'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                          {label}
                          <span className={`mt-0.5 block text-[10px] font-normal leading-tight
                            ${formulario.tipo === value ? 'text-white/70' : 'text-slate-400'}`}>
                            {desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Tabla de artículos */}
              <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm print:rounded-none print:border-slate-300 print:shadow-none">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Detalle de conceptos</p>
                    <h3 className="text-xl font-black text-slate-900">Tabla dinámica de productos</h3>
                  </div>
                  <button type="button" onClick={agregarLinea}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#63162e]">
                    <Plus size={16} /> Agregar concepto
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#7E1D3B] text-white">
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Cant.</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Unidad</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Producto</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Descripción</th>
                        <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.15em]">Precio Unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.15em]">Importe</th>
                        <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-[0.15em]">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineas.map((linea, idx) => {
                        const importe = (Number(linea.cantidad) || 0) * (Number(linea.precioUnitario) || 0);
                        return (
                          <tr key={linea.id}
                            className={`border-t border-slate-100 transition hover:bg-[#7E1D3B]/3 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                            <td className="w-24 px-4 py-3 align-top">
                              <input type="number" min="0" step="1" value={linea.cantidad}
                                onChange={(e) => actualizarLinea(linea.id, 'cantidad', e.target.value)}
                                className={inputEdit} />
                            </td>
                            <td className="w-36 px-4 py-3 align-top">
                              <select value={linea.unidad}
                                onChange={(e) => actualizarLinea(linea.id, 'unidad', e.target.value)}
                                className={inputEdit}>
                                {UNIDADES.map(({ value, label }) => (
                                  <option key={value} value={value}>{label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="min-w-[220px] px-4 py-3 align-top">
                              <input type="text" value={linea.producto}
                                onChange={(e) => actualizarLinea(linea.id, 'producto', e.target.value)}
                                placeholder="Nombre del producto (sin marca)"
                                className={inputEdit} />
                            </td>
                            <td className="min-w-[260px] px-4 py-3 align-top">
                              <textarea value={linea.descripcion}
                                onChange={(e) => actualizarLinea(linea.id, 'descripcion', e.target.value)}
                                placeholder="Especificaciones, talla, color…" rows={2}
                                className={`${inputEdit} resize-none`} />
                            </td>
                            <td className="w-36 px-4 py-3 align-top">
                              <input type="number" min="0" step="0.01" value={linea.precioUnitario}
                                onChange={(e) => actualizarLinea(linea.id, 'precioUnitario', e.target.value)}
                                className={`${inputEdit} text-right`} />
                            </td>
                            <td className="w-36 px-4 py-3 align-top text-right font-bold text-slate-900">
                              {moneda.format(importe)}
                            </td>
                            <td className="w-24 px-4 py-3 align-top text-center">
                              <button type="button" onClick={() => eliminarLinea(linea.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                                aria-label="Eliminar concepto">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Observaciones + Totales */}
              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm print:rounded-none print:border-slate-300 print:shadow-none">
                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Notas de compra</p>
                    <h3 className="text-xl font-black text-slate-900">Observaciones generales</h3>
                  </div>
                  <textarea name="observaciones" value={formulario.observaciones} onChange={actualizarFormulario}
                    rows={6} placeholder="Justificación de la compra, referencias, instrucciones especiales…"
                    className={`${inputEdit} rounded-2xl px-4 py-3`} />
                </section>

                <aside className="self-start rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm print:rounded-none print:border-slate-300 print:shadow-none">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Resumen</p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">Totales</h3>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-bold text-slate-900">{moneda.format(totales.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-slate-500">IVA (16%)</span>
                      <span className="font-bold text-slate-900">{moneda.format(totales.iva)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-[#7E1D3B] px-4 py-3 text-white">
                      <span className="text-sm font-bold">Total</span>
                      <span className="text-lg font-black">{moneda.format(totales.total)}</span>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                    Al enviar, la solicitud pasa a Recursos Materiales. El encargado la sellará, firmará y turnará a Compras para cotización.
                  </div>
                </aside>
              </div>

              {/* Barra inferior */}
              <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between print:hidden">
                <p className="text-sm text-slate-500">Los importes se recalculan automáticamente al editar cantidad o precio unitario.</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    <ArrowLeft size={16} /> Cancelar
                  </button>
                  <button type="button" onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
                    <Printer size={16} /> Imprimir
                  </button>
                  {botonEnviar}
                </div>
              </div>

            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequisicionForm;
