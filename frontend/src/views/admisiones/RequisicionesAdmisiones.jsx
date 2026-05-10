import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Printer, Trash2, Save, ArrowLeft } from 'lucide-react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';
import { API_BASE } from '../../config/api';

const DEPARTAMENTOS = ['Admisiones', 'Médico', 'Psicología', 'Dirección', 'Trabajo Social', 'Enfermería', 'Administración'];
const PRIORIDADES = ['Normal', 'Urgente', 'Crítica'];
const UNIDADES = ['Pza', 'Caja', 'Paquete', 'Litro', 'Kg', 'Servicio', 'Botella', 'Bulto', 'Otro'];

const UNIDAD_ENUM = {
  Pza: 'PIEZA',
  Caja: 'CAJA',
  Paquete: 'PAQUETE',
  Litro: 'LITRO',
  Kg: 'KG',
  Servicio: 'SERVICIO',
  Botella: 'BOTELLA',
  Bulto: 'BULTO',
  Otro: 'OTRO',
};

const padNumero = (valor) => String(valor).padStart(2, '0');

const toInputDate = (date) => `${date.getFullYear()}-${padNumero(date.getMonth() + 1)}-${padNumero(date.getDate())}`;

const moneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const createLinea = () => ({
  id: `linea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  cantidad: '1',
  unidad: 'Pza',
  producto: '',
  descripcion: '',
  precioUnitario: '0.00',
});

const RequisicionesAdmisiones = () => {
  const navigate = useNavigate();
  const fechaSistema = useMemo(() => toInputDate(new Date()), []);
  const [lineas, setLineas] = useState([createLinea()]);
  const [totales, setTotales] = useState({ subtotal: 0, iva: 0, total: 0 });
  const [mensajeGuardado, setMensajeGuardado] = useState('');
  const [formulario, setFormulario] = useState({
    fecha: fechaSistema,
    departamento: 'Admisiones',
    jefeArea: '',
    prioridad: 'Normal',
    observaciones: '',
  });

  useEffect(() => {
    const subtotal = lineas.reduce((acumulado, linea) => {
      const cantidad = Number(linea.cantidad) || 0;
      const precioUnitario = Number(linea.precioUnitario) || 0;
      return acumulado + (cantidad * precioUnitario);
    }, 0);

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    setTotales({ subtotal, iva, total });
  }, [lineas]);

  const actualizarFormulario = (event) => {
    const { name, value } = event.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarLinea = (lineaId, campo, valor) => {
    setLineas((prev) => prev.map((linea) => (linea.id === lineaId ? { ...linea, [campo]: valor } : linea)));
  };

  const agregarLinea = () => {
    setLineas((prev) => [...prev, createLinea()]);
  };

  const eliminarLinea = (lineaId) => {
    setLineas((prev) => {
      const siguientes = prev.filter((linea) => linea.id !== lineaId);
      return siguientes.length > 0 ? siguientes : [createLinea()];
    });
  };

  const handleGuardar = async () => {
    const articulosValidos = lineas.filter((l) => l.producto.trim() !== '');
    if (!formulario.jefeArea.trim()) {
      setMensajeGuardado('error:Ingresa el nombre del Jefe de Área antes de guardar.');
      return;
    }
    if (articulosValidos.length === 0) {
      setMensajeGuardado('error:Agrega al menos un concepto con nombre de producto.');
      return;
    }

    const payload = {
      area: formulario.departamento,
      solicitante: formulario.jefeArea.trim(),
      responsableArea: formulario.jefeArea.trim(),
      justificacion: formulario.observaciones.trim() || null,
      estado: 'PENDIENTE',
      tipo: formulario.prioridad === 'Normal' ? 'ORDINARIA' : 'EXTRAORDINARIA',
      tamanio: 'INDEFINIDO',
      articulos: articulosValidos.map((linea) => ({
        articuloRequisitado: linea.producto.trim(),
        unidad: UNIDAD_ENUM[linea.unidad] ?? 'PIEZA',
        articulosSolicitados: Number(linea.cantidad) || 1,
        articulosEntregados: 0,
      })),
    };

    try {
      setMensajeGuardado('enviando');
      const res = await fetch(`${API_BASE}/requisiciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const texto = await res.text().catch(() => '');
        setMensajeGuardado(`error:No se pudo guardar la requisición (${res.status}). ${texto}`);
        return;
      }
      setMensajeGuardado('ok');
    } catch (err) {
      setMensajeGuardado(`error:Error de red: ${err.message}`);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleCancelar = () => {
    navigate('/admisiones');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 print:px-0 print:py-0">
        <AdminHeader submodule="Requisiciones de Admisiones" />

        <main className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <aside className="print:hidden">
              <AdmisionesSidebar />
            </aside>

            <section className="space-y-5">
              <div className="hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm print:block print:shadow-none">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Instituto Marakame</p>
                    <h1 className="mt-1 text-3xl font-black text-slate-900">Requisición de Admisiones</h1>
                    <p className="mt-1 text-sm text-slate-500">Documento para impresión y control interno.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-3 text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Fecha</p>
                    <p className="text-lg font-black text-slate-900">{formulario.fecha}</p>
                  </div>
                </div>
              </div>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 print:rounded-none print:border-slate-300 print:shadow-none">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between print:hidden">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
                      <ClipboardList size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Nueva solicitud operativa</p>
                      <h2 className="text-2xl font-black text-slate-900">Requisiciones de Admisiones</h2>
                      <p className="mt-1 text-sm text-slate-500">Captura insumos, calcula importes automáticamente y deja listo el resumen para impresión.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelar}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <ArrowLeft size={16} />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleImprimir}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12"
                    >
                      <Printer size={16} />
                      Imprimir
                    </button>
                    <button
                      type="button"
                      onClick={handleGuardar}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#63162e]"
                    >
                      <Save size={16} />
                      Guardar
                    </button>
                  </div>
                </div>

                {mensajeGuardado === 'enviando' ? (
                  <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 print:hidden">
                    Enviando requisición...
                  </div>
                ) : mensajeGuardado === 'ok' ? (
                  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 print:hidden">
                    Requisición enviada correctamente. Ya está visible en Rec. Materiales para su validación.
                  </div>
                ) : mensajeGuardado.startsWith('error:') ? (
                  <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 print:hidden">
                    {mensajeGuardado.slice(6)}
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Fecha
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={formulario.fecha}
                      readOnly
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Departamento
                    </label>
                    <select
                      name="departamento"
                      value={formulario.departamento}
                      onChange={actualizarFormulario}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                    >
                      {DEPARTAMENTOS.map((departamento) => (
                        <option key={departamento} value={departamento}>{departamento}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Jefe de Área
                    </label>
                    <input
                      type="text"
                      name="jefeArea"
                      value={formulario.jefeArea}
                      onChange={actualizarFormulario}
                      placeholder="Nombre del responsable"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Prioridad
                    </label>
                    <select
                      name="prioridad"
                      value={formulario.prioridad}
                      onChange={actualizarFormulario}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                    >
                      {PRIORIDADES.map((prioridad) => (
                        <option key={prioridad} value={prioridad}>{prioridad}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm print:rounded-none print:border-slate-300 print:shadow-none">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Detalle de conceptos</p>
                    <h3 className="text-xl font-black text-slate-900">Tabla dinámica de productos</h3>
                  </div>

                  <button
                    type="button"
                    onClick={agregarLinea}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#63162e]"
                  >
                    <Plus size={16} />
                    Agregar concepto
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
                      {lineas.map((linea, index) => {
                        const cantidad = Number(linea.cantidad) || 0;
                        const precioUnitario = Number(linea.precioUnitario) || 0;
                        const importe = cantidad * precioUnitario;

                        return (
                          <tr key={linea.id} className={`border-t border-slate-100 transition hover:bg-[#7E1D3B]/3 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                            <td className="w-24 px-4 py-3 align-top">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={linea.cantidad}
                                onChange={(event) => actualizarLinea(linea.id, 'cantidad', event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                              />
                            </td>
                            <td className="w-32 px-4 py-3 align-top">
                              <select
                                value={linea.unidad}
                                onChange={(event) => actualizarLinea(linea.id, 'unidad', event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                              >
                                {UNIDADES.map((unidad) => (
                                  <option key={unidad} value={unidad}>{unidad}</option>
                                ))}
                              </select>
                            </td>
                            <td className="min-w-[220px] px-4 py-3 align-top">
                              <input
                                type="text"
                                value={linea.producto}
                                onChange={(event) => actualizarLinea(linea.id, 'producto', event.target.value)}
                                placeholder="Nombre del producto"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                              />
                            </td>
                            <td className="min-w-[260px] px-4 py-3 align-top">
                              <textarea
                                value={linea.descripcion}
                                onChange={(event) => actualizarLinea(linea.id, 'descripcion', event.target.value)}
                                placeholder="Ej. Opina, especificaciones, talla, color..."
                                rows={2}
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                              />
                            </td>
                            <td className="w-36 px-4 py-3 align-top">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={linea.precioUnitario}
                                onChange={(event) => actualizarLinea(linea.id, 'precioUnitario', event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-right text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                              />
                            </td>
                            <td className="w-36 px-4 py-3 align-top text-right font-bold text-slate-900">
                              {moneda.format(importe)}
                            </td>
                            <td className="w-24 px-4 py-3 align-top text-center">
                              <button
                                type="button"
                                onClick={() => eliminarLinea(linea.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100"
                                aria-label="Eliminar concepto"
                              >
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

              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm print:rounded-none print:border-slate-300 print:shadow-none">
                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Notas de compra</p>
                    <h3 className="text-xl font-black text-slate-900">Observaciones generales</h3>
                  </div>
                  <textarea
                    name="observaciones"
                    value={formulario.observaciones}
                    onChange={actualizarFormulario}
                    rows={6}
                    placeholder="Escribe notas adicionales, referencias, validaciones o instrucciones para la compra..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15"
                  />
                </section>

                <aside className="self-start rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm print:rounded-none print:border-slate-300 print:shadow-none">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Resumen</p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">Totales de requisición</h3>

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
                    Al guardar, la requisición se envía a Rec. Materiales con estado <strong>Pendiente</strong> para su validación.
                  </div>
                </aside>
              </div>

              <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between print:hidden">
                <p className="text-sm text-slate-500">Los importes se recalculan automáticamente al editar cantidad o precio unitario.</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelar}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft size={16} />
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleImprimir}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12"
                  >
                    <Printer size={16} />
                    Imprimir
                  </button>
                  <button
                    type="button"
                    onClick={handleGuardar}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#63162e]"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequisicionesAdmisiones;