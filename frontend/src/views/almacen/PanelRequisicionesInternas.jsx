import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Plus, Trash2, Send, CheckCircle2,
  XCircle, ChevronDown, ChevronUp, Inbox,
} from 'lucide-react';

const AREAS = ['Médico', 'Psicología', 'Admisiones', 'Enfermería', 'Dirección', 'Trabajo Social', 'Administración', 'Cocina'];
const PRIORIDADES = ['Normal', 'Urgente', 'Crítica'];
const UNIDADES = ['Pza', 'Caja', 'Paquete', 'Litro', 'Kg', 'Servicio', 'Botella', 'Bulto'];
const STORAGE_KEY = 'mrkm_req_internas_v1';

const generarId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const crearArticuloVacio = () => ({ id: generarId(), producto: '', cantidad: 1, unidad: 'Pza', estado: 'pendiente' });

const PRIORIDAD_ESTILOS = {
  Normal: 'bg-slate-100 text-slate-600',
  Urgente: 'bg-amber-100 text-amber-700',
  Crítica: 'bg-rose-100 text-rose-700',
};

const calcularEstado = (articulos) => {
  if (!articulos.length) return 'PENDIENTE';
  const procesados = articulos.filter(a => a.estado !== 'pendiente');
  if (procesados.length === 0) return 'PENDIENTE';
  if (procesados.length < articulos.length) return 'EN_PROCESO';
  if (articulos.every(a => a.estado === 'surtido')) return 'SURTIDA';
  if (articulos.every(a => a.estado === 'sin_stock')) return 'ENVIADA_COMPRAS';
  return 'PARCIAL';
};

const ESTADO_BADGE = {
  PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
  EN_PROCESO: 'bg-blue-50 text-blue-700 border-blue-200',
  SURTIDA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PARCIAL: 'bg-purple-50 text-purple-700 border-purple-200',
  ENVIADA_COMPRAS: 'bg-slate-100 text-slate-600 border-slate-200',
};

const ESTADO_LABEL = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  SURTIDA: 'Surtida ✓',
  PARCIAL: 'Parcial',
  ENVIADA_COMPRAS: 'Enviada a Compras',
};

// ─────────────────────────────────────────────────────────────────
// Tab 1: Formulario de nueva requisición (lo llena el área)
// ─────────────────────────────────────────────────────────────────
const FormNuevaRequisicion = ({ onGuardar }) => {
  const [form, setForm] = useState({ area: 'Médico', solicitante: '', prioridad: 'Normal' });
  const [articulos, setArticulos] = useState([crearArticuloVacio()]);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const actualizarForm = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const actualizarArticulo = (id, campo, valor) =>
    setArticulos(prev => prev.map(a => a.id === id ? { ...a, [campo]: valor } : a));

  const agregarArticulo = () => setArticulos(p => [...p, crearArticuloVacio()]);

  const eliminarArticulo = (id) =>
    setArticulos(p => {
      const s = p.filter(a => a.id !== id);
      return s.length ? s : [crearArticuloVacio()];
    });

  const handleSubmit = () => {
    setError('');
    if (!form.solicitante.trim()) { setError('Escribe el nombre del solicitante.'); return; }
    const validos = articulos.filter(a => a.producto.trim());
    if (!validos.length) { setError('Agrega al menos un producto.'); return; }

    onGuardar({
      id: generarId(),
      fecha: new Date().toISOString(),
      area: form.area,
      solicitante: form.solicitante.trim(),
      prioridad: form.prioridad,
      articulos: validos.map(a => ({ ...a, estado: 'pendiente' })),
    });

    setForm({ area: 'Médico', solicitante: '', prioridad: 'Normal' });
    setArticulos([crearArticuloVacio()]);
    setExito(true);
    setTimeout(() => setExito(false), 3500);
  };

  return (
    <div className="space-y-5">
      {exito && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          Requisición enviada a la bandeja de Almacén correctamente.
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          {error}
        </div>
      )}

      {/* Datos generales */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Datos de la solicitud</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Área solicitante</label>
            <select name="area" value={form.area} onChange={actualizarForm}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15">
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
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
      </div>

      {/* Tabla de artículos */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Detalle</p>
            <h3 className="text-lg font-black text-slate-900">Artículos solicitados</h3>
          </div>
          <button onClick={agregarArticulo}
            className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#63162e]">
            <Plus size={15} /> Agregar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#7E1D3B] text-white">
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Producto</th>
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
                      onChange={e => actualizarArticulo(art.id, 'producto', e.target.value)}
                      placeholder="Nombre del producto"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min="1" value={art.cantidad}
                      onChange={e => actualizarArticulo(art.id, 'cantidad', Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15" />
                  </td>
                  <td className="px-4 py-3">
                    <select value={art.unidad}
                      onChange={e => actualizarArticulo(art.id, 'unidad', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15">
                      {UNIDADES.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => eliminarArticulo(art.id)}
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
        <button onClick={handleSubmit}
          className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#63162e]">
          <Send size={16} /> Enviar a Almacén
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Tab 2: Bandeja de Almacén — gestiona las requisiciones recibidas
// ─────────────────────────────────────────────────────────────────
const BandejaAlmacen = ({ requisiciones, onActualizar }) => {
  const [expandida, setExpandida] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [cargandoInv, setCargandoInv] = useState(false);

  // Consulta el inventario real para mostrar stock disponible como referencia
  useEffect(() => {
    setCargandoInv(true);
    fetch('http://localhost:4000/api/almacen/inventario')
      .then(r => r.ok ? r.json() : [])
      .then(data => setInventario(Array.isArray(data) ? data : []))
      .catch(() => setInventario([]))
      .finally(() => setCargandoInv(false));
  }, []);

  const buscarEnInventario = (nombreProducto) => {
    const termino = nombreProducto.toLowerCase();
    return inventario.find(i =>
      i.nombreArticulo?.toLowerCase().includes(termino) ||
      termino.includes(i.nombreArticulo?.toLowerCase() ?? '')
    );
  };

  const marcarArticulo = (reqId, artId, nuevoEstado) => {
    onActualizar(requisiciones.map(r => {
      if (r.id !== reqId) return r;
      return { ...r, articulos: r.articulos.map(a => a.id === artId ? { ...a, estado: nuevoEstado } : a) };
    }));
  };

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const pendientes = requisiciones.filter(r => {
    const e = calcularEstado(r.articulos);
    return e === 'PENDIENTE' || e === 'EN_PROCESO';
  });

  const procesadas = requisiciones.filter(r => {
    const e = calcularEstado(r.articulos);
    return e === 'SURTIDA' || e === 'PARCIAL' || e === 'ENVIADA_COMPRAS';
  });

  const renderRequisicion = (req) => {
    const estado = calcularEstado(req.articulos);
    const abierta = expandida === req.id;
    const artsSinStock = req.articulos.filter(a => a.estado === 'sin_stock');

    return (
      <div key={req.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setExpandida(abierta ? null : req.id)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
              <ClipboardList size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-900">{req.area}</span>
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${PRIORIDAD_ESTILOS[req.prioridad]}`}>{req.prioridad}</span>
                <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${ESTADO_BADGE[estado]}`}>{ESTADO_LABEL[estado]}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{req.solicitante}</span>
                {' · '}{req.articulos.length} artículo(s)
                {' · '}{formatFecha(req.fecha)}
              </p>
            </div>
          </div>
          {abierta ? <ChevronUp size={18} className="shrink-0 text-slate-400" /> : <ChevronDown size={18} className="shrink-0 text-slate-400" />}
        </button>

        {abierta && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-3">
            {req.articulos.map(art => {
              const enInv = buscarEnInventario(art.producto);
              return (
                <div key={art.id}
                  className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between
                    ${art.estado === 'surtido' ? 'border-emerald-200 bg-emerald-50' :
                      art.estado === 'sin_stock' ? 'border-rose-200 bg-rose-50' :
                      'border-slate-200 bg-slate-50'}`}>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{art.producto}</p>
                    <p className="text-xs text-slate-500">{art.cantidad} {art.unidad}</p>
                    {cargandoInv ? (
                      <p className="mt-1 text-xs text-slate-400">Consultando inventario…</p>
                    ) : enInv ? (
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        En sistema: {enInv.cantidadDisponible} {enInv.unidadMedida ?? 'pza'} disponibles
                      </p>
                    ) : (
                      <p className="mt-1 text-xs font-medium text-rose-600">No encontrado en sistema</p>
                    )}
                  </div>

                  {art.estado === 'pendiente' ? (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => marcarArticulo(req.id, art.id, 'surtido')}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
                        <CheckCircle2 size={13} /> Surtir
                      </button>
                      <button onClick={() => marcarArticulo(req.id, art.id, 'sin_stock')}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700">
                        <XCircle size={13} /> Sin stock
                      </button>
                    </div>
                  ) : art.estado === 'surtido' ? (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={13} /> Surtido
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700">
                      <XCircle size={13} /> Sin stock → Compras
                    </span>
                  )}
                </div>
              );
            })}

            {/* Resumen de lo que iría a Compras */}
            {artsSinStock.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs font-bold text-amber-800">
                  {artsSinStock.length} artículo(s) sin stock → se generaría requisición a Rec. Materiales:
                </p>
                <ul className="mt-1.5 space-y-0.5">
                  {artsSinStock.map(a => (
                    <li key={a.id} className="text-xs text-amber-700">
                      · {a.producto} — {a.cantidad} {a.unidad}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!requisiciones.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <Inbox size={40} className="mb-3 text-slate-300" />
        <p className="font-bold text-slate-500">Sin requisiciones en bandeja</p>
        <p className="mt-1 text-sm text-slate-400">Las solicitudes de las áreas aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendientes.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Pendientes de atender ({pendientes.length})
          </p>
          <div className="space-y-3">
            {[...pendientes].sort((a, b) => {
              const ord = { Crítica: 0, Urgente: 1, Normal: 2 };
              return (ord[a.prioridad] ?? 2) - (ord[b.prioridad] ?? 2);
            }).map(renderRequisicion)}
          </div>
        </div>
      )}

      {procesadas.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Procesadas ({procesadas.length})
          </p>
          <div className="space-y-3">{procesadas.map(renderRequisicion)}</div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────
const PanelRequisicionesInternas = () => {
  const [tab, setTab] = useState('nueva');
  const [requisiciones, setRequisiciones] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  });

  const persistir = (nuevas) => {
    setRequisiciones(nuevas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas));
  };

  const onGuardar = (nueva) => {
    persistir([nueva, ...requisiciones]);
    setTab('bandeja');
  };

  const pendientesCount = requisiciones.filter(r => {
    const e = calcularEstado(r.articulos);
    return e === 'PENDIENTE' || e === 'EN_PROCESO';
  }).length;

  return (
    <div className="space-y-5">
      {/* Header + tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Prototipo · Flujo Interno</p>
              <h2 className="text-2xl font-black text-slate-900">Requisiciones Internas</h2>
              <p className="text-sm text-slate-500">Área solicita insumos → Almacén surte o escala a Compras.</p>
            </div>
          </div>

          <div className="flex gap-1 self-start rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:self-auto">
            <button onClick={() => setTab('nueva')}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === 'nueva' ? 'bg-white shadow text-[#7E1D3B]' : 'text-slate-500 hover:text-slate-700'}`}>
              Nueva solicitud
            </button>
            <button onClick={() => setTab('bandeja')}
              className={`relative rounded-xl px-4 py-2 text-sm font-bold transition ${tab === 'bandeja' ? 'bg-white shadow text-[#7E1D3B]' : 'text-slate-500 hover:text-slate-700'}`}>
              Bandeja Almacén
              {pendientesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7E1D3B] text-[10px] font-black text-white">
                  {pendientesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {tab === 'nueva' && <FormNuevaRequisicion onGuardar={onGuardar} />}
      {tab === 'bandeja' && <BandejaAlmacen requisiciones={requisiciones} onActualizar={persistir} />}
    </div>
  );
};

export default PanelRequisicionesInternas;
