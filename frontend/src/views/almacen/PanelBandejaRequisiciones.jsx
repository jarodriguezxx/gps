import React, { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, CheckCircle2, XCircle, Inbox,
  ClipboardCheck, Printer, Zap, AlertTriangle,
} from 'lucide-react';

const STORAGE_KEY  = 'mrkm_solicitudes_almacen_v1';
const COMPRAS_KEY  = 'mrkm_compras_pendientes_v1';

const TIPO_ORDEN = { Extraordinaria: 0, Ordinaria: 1 };
const TIPO_ESTILOS = {
  Ordinaria:      'bg-slate-100 text-slate-600',
  Extraordinaria: 'bg-amber-100 text-amber-700',
};

const calcularEstadoSolicitud = (articulos) => {
  if (!articulos.length) return 'PENDIENTE';
  const procesados = articulos.filter(a => a.estadoAlmacen !== 'pendiente');
  if (procesados.length === 0)                                return 'PENDIENTE';
  if (procesados.length < articulos.length)                   return 'EN_REVISION';
  if (articulos.every(a => a.estadoAlmacen === 'surtido'))    return 'COMPLETADA';
  if (articulos.every(a => a.estadoAlmacen === 'sin_stock'))  return 'ENVIADA_COMPRAS';
  return 'PARCIAL';
};

const ESTADO_BADGE = {
  PENDIENTE:       'bg-amber-50 text-amber-700 border-amber-200',
  EN_REVISION:     'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETADA:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  PARCIAL:         'bg-purple-50 text-purple-700 border-purple-200',
  ENVIADA_COMPRAS: 'bg-slate-100 text-slate-600 border-slate-200',
};
const ESTADO_LABEL = {
  PENDIENTE:       'Pendiente',
  EN_REVISION:     'En revisión',
  COMPLETADA:      'Surtida ✓',
  PARCIAL:         'Parcial',
  ENVIADA_COMPRAS: 'Enviada a Compras',
};

// ── Stock helpers ──────────────────────────────────────────────────

const getStockStatus = (art, inventario) => {
  if (!inventario.length) return { estado: 'sin_datos', item: null };
  const nombre = art.producto.toLowerCase().trim();
  const item = inventario.find(i => {
    const n = (i.nombreArticulo ?? '').toLowerCase().trim();
    return n.length > 2 && (n.includes(nombre) || nombre.includes(n));
  });
  if (!item) return { estado: 'sin_registro', item: null };
  const disponible = Number(item.cantidadDisponible) || 0;
  return disponible >= (Number(art.cantidad) || 1)
    ? { estado: 'suficiente', item }
    : { estado: 'insuficiente', item };
};

const stockLabel = (status, art) => {
  if (status.estado === 'sin_datos')    return 'Inventario no disponible';
  if (status.estado === 'sin_registro') return 'Sin registro en inventario';
  const disp     = Number(status.item.cantidadDisponible) || 0;
  const unidad   = status.item.unidadMedida ?? art.unidad;
  if (status.estado === 'suficiente')   return `En stock: ${disp} ${unidad} disponibles`;
  return `Stock insuficiente: ${disp} disponibles, se piden ${art.cantidad}`;
};

const STOCK_PILL = {
  suficiente:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  insuficiente: 'bg-amber-50   text-amber-700   border border-amber-200',
  sin_registro: 'bg-rose-50    text-rose-700    border border-rose-200',
  sin_datos:    'bg-slate-50   text-slate-400   border border-slate-200',
};

// ── Enviar faltantes a Rec. Materiales ────────────────────────────

const generarFolioCompras = () => {
  const n = parseInt(localStorage.getItem('mrkm_comp_count') || '0') + 1;
  localStorage.setItem('mrkm_comp_count', String(n));
  return `REQ-ALM-${new Date().getFullYear()}-${String(n).padStart(3, '0')}`;
};

const enviarACompras = async (solicitud, sinStock) => {
  if (!sinStock.length) return;
  const folio = generarFolioCompras();
  const nueva = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    folio,
    origen: 'Almacén',
    solicitudOrigen: solicitud.folio,
    area: solicitud.area,
    solicitante: solicitud.solicitante,
    prioridad: solicitud.prioridad,
    fecha: new Date().toISOString(),
    estado: 'PENDIENTE',
    articulos: sinStock.map(a => ({
      producto: a.producto,
      cantidad: a.cantidad,
      unidad: a.unidad,
      descripcion: a.descripcion || '',
    })),
    notas: `Faltante de solicitud ${solicitud.folio} · ${solicitud.area} · Solicitante: ${solicitud.solicitante}`,
  };

  // Persistir en localStorage para prototipo
  try {
    const prev = JSON.parse(localStorage.getItem(COMPRAS_KEY) || '[]');
    localStorage.setItem(COMPRAS_KEY, JSON.stringify([nueva, ...prev]));
  } catch { /* silent */ }

  // Intentar también el backend (no bloquea si falla)
  try {
    await fetch('http://localhost:4000/api/requisiciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        area: 'Almacén',
        responsableArea: 'Almacén',
        justificacion: nueva.notas,
        prioridad: solicitud.prioridad,
        articulos: sinStock.map(a => ({
          articuloRequisitado: a.producto,
          cantidadSolicitada: a.cantidad,
          unidad: a.unidad,
        })),
      }),
    });
  } catch { /* offline / no backend — ok */ }
};

// ─────────────────────────────────────────────────────────────────
// Vista de revisión de una solicitud (expandida)
// ─────────────────────────────────────────────────────────────────
const RevisionSolicitud = ({ solicitud, inventario, cargandoInv, onActualizar }) => {
  const [notasAlmacen, setNotasAlmacen] = useState(solicitud.notasAlmacen || '');
  const [cantidades, setCantidades] = useState(() =>
    Object.fromEntries(solicitud.articulos.map(a => [a.id, a.cantidadSurtida ?? a.cantidad]))
  );
  const [documentoFinal, setDocumentoFinal] = useState(
    ['COMPLETADA', 'PARCIAL', 'ENVIADA_COMPRAS'].includes(calcularEstadoSolicitud(solicitud.articulos))
  );
  const [autoVerificado, setAutoVerificado] = useState(false);

  const marcar = (artId, estado) => {
    const cantSurtida = estado === 'surtido' ? (cantidades[artId] ?? 0) : null;
    const nuevosArts = solicitud.articulos.map(a =>
      a.id === artId ? { ...a, estadoAlmacen: estado, cantidadSurtida: cantSurtida } : a
    );
    onActualizar(solicitud.id, nuevosArts, notasAlmacen);
  };

  const deshacerMarcado = (artId) => {
    const nuevosArts = solicitud.articulos.map(a =>
      a.id === artId ? { ...a, estadoAlmacen: 'pendiente', cantidadSurtida: null } : a
    );
    onActualizar(solicitud.id, nuevosArts, notasAlmacen);
  };

  const autoVerificar = () => {
    if (cargandoInv || !inventario.length) return;
    const nuevosArts = solicitud.articulos.map(a => {
      if (a.estadoAlmacen !== 'pendiente') return a;
      const status = getStockStatus(a, inventario);
      if (status.estado === 'suficiente') {
        return { ...a, estadoAlmacen: 'surtido', cantidadSurtida: Number(a.cantidad) || 1 };
      }
      if (status.estado === 'insuficiente' || status.estado === 'sin_registro') {
        return { ...a, estadoAlmacen: 'sin_stock', cantidadSurtida: null };
      }
      return a;
    });
    onActualizar(solicitud.id, nuevosArts, notasAlmacen);
    setAutoVerificado(true);
  };

  const finalizar = () => {
    const nuevosArts = solicitud.articulos.map(a =>
      a.estadoAlmacen === 'surtido'
        ? { ...a, cantidadSurtida: cantidades[a.id] ?? a.cantidad }
        : a
    );
    const sinStock = nuevosArts.filter(a => a.estadoAlmacen === 'sin_stock');
    enviarACompras(solicitud, sinStock);
    onActualizar(solicitud.id, nuevosArts, notasAlmacen, true);
    setDocumentoFinal(true);
  };

  const todosProcesados = solicitud.articulos.every(a => a.estadoAlmacen !== 'pendiente');
  const aSurtir  = solicitud.articulos.filter(a => a.estadoAlmacen === 'surtido');
  const sinStock = solicitud.articulos.filter(a => a.estadoAlmacen === 'sin_stock');

  const problematicos = (!cargandoInv && inventario.length)
    ? solicitud.articulos.filter(a => {
        const s = getStockStatus(a, inventario);
        return s.estado === 'insuficiente' || s.estado === 'sin_registro';
      }).length
    : 0;

  // ── Documento final ──
  if (documentoFinal) {
    return (
      <div className="border-t border-slate-100 px-5 pb-6 pt-5 space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5" id={`doc-${solicitud.id}`}>
          <div className="mb-5 flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7E1D3B]">Instituto Marakame · Almacén</p>
              <h3 className="mt-1 text-xl font-black text-slate-900">Respuesta a Solicitud</h3>
              <p className="text-sm text-slate-500">
                Folio <span className="font-bold text-slate-700">{solicitud.folio}</span>
                {' · '}{solicitud.area}{' · '}{solicitud.solicitante}
                {' · '}<span className={`font-semibold ${solicitud.tipo === 'Extraordinaria' ? 'text-amber-700' : 'text-slate-600'}`}>{solicitud.tipo ?? 'Ordinaria'}</span>
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>{new Date(solicitud.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p className="mt-0.5 font-semibold">
                Revisado: {solicitud.fechaRevision
                  ? new Date(solicitud.fechaRevision).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
                  : 'Hoy'}
              </p>
            </div>
          </div>

          {aSurtir.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                  Despacho a {solicitud.area} ({aSurtir.length} artículo{aSurtir.length > 1 ? 's' : ''})
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-emerald-100 text-xs text-slate-400">
                    <th className="pb-1.5 text-left font-semibold">Artículo</th>
                    <th className="pb-1.5 text-center font-semibold">Solicitado</th>
                    <th className="pb-1.5 text-center font-semibold">A despachar</th>
                    <th className="pb-1.5 text-left font-semibold">Unidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {aSurtir.map(a => (
                    <tr key={a.id}>
                      <td className="py-2 font-semibold text-slate-900">{a.producto}</td>
                      <td className="py-2 text-center text-slate-500">{a.cantidad}</td>
                      <td className="py-2 text-center font-bold text-emerald-700">{a.cantidadSurtida ?? a.cantidad}</td>
                      <td className="py-2 text-slate-500">{a.unidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {sinStock.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-700">
                  Faltante → Requisición a Compras ({sinStock.length} artículo{sinStock.length > 1 ? 's' : ''})
                </p>
              </div>
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                <AlertTriangle size={13} />
                Requisición automática enviada a Recursos Materiales para gestión de compra.
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-rose-100 text-xs text-slate-400">
                    <th className="pb-1.5 text-left font-semibold">Artículo</th>
                    <th className="pb-1.5 text-center font-semibold">Cantidad requerida</th>
                    <th className="pb-1.5 text-left font-semibold">Unidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sinStock.map(a => (
                    <tr key={a.id}>
                      <td className="py-2 font-semibold text-slate-900">{a.producto}</td>
                      <td className="py-2 text-center font-bold text-rose-700">{a.cantidad}</td>
                      <td className="py-2 text-slate-500">{a.unidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {solicitud.notasAlmacen && (
            <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500">
              <span className="font-bold">Notas de almacén:</span> {solicitud.notasAlmacen}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            <Printer size={14} /> Imprimir documento
          </button>
        </div>
      </div>
    );
  }

  // ── Vista de revisión ──
  return (
    <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">

      {/* Banner: posibles faltantes */}
      {!cargandoInv && inventario.length > 0 && problematicos > 0 && !autoVerificado && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <AlertTriangle size={14} />
            {problematicos} artículo{problematicos > 1 ? 's' : ''} con posible falta de stock
          </div>
          <button onClick={autoVerificar}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-700">
            <Zap size={12} /> Auto-verificar
          </button>
        </div>
      )}

      {/* Banner: todo disponible */}
      {!cargandoInv && inventario.length > 0 && problematicos === 0 && !autoVerificado && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={14} />
            Todos los artículos tienen stock suficiente
          </div>
          <button onClick={autoVerificar}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700">
            <Zap size={12} /> Auto-verificar
          </button>
        </div>
      )}

      {autoVerificado && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-800">
          <CheckCircle2 size={13} />
          Auto-verificación aplicada. Revisa los resultados y ajusta si es necesario.
        </div>
      )}

      {/* Contadores */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <p className="text-lg font-black text-slate-800">{solicitud.articulos.length}</p>
          <p className="text-[10px] font-bold uppercase text-slate-400">Solicitados</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-lg font-black text-emerald-700">{aSurtir.length}</p>
          <p className="text-[10px] font-bold uppercase text-emerald-600">A surtir</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center">
          <p className="text-lg font-black text-rose-700">{sinStock.length}</p>
          <p className="text-[10px] font-bold uppercase text-rose-600">Sin stock</p>
        </div>
      </div>

      {solicitud.observaciones && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          <span className="font-bold">Nota del área:</span> {solicitud.observaciones}
        </div>
      )}

      {/* Artículos */}
      <div className="space-y-2.5">
        {solicitud.articulos.map(art => {
          const status = getStockStatus(art, inventario);
          const sugiereSurtir  = status.estado === 'suficiente';
          const sugiereNoStock = status.estado === 'insuficiente' || status.estado === 'sin_registro';

          return (
            <div key={art.id}
              className={`rounded-xl border p-4 transition
                ${art.estadoAlmacen === 'surtido'
                  ? 'border-emerald-200 bg-emerald-50'
                  : art.estadoAlmacen === 'sin_stock'
                  ? 'border-rose-200 bg-rose-50'
                  : 'border-slate-200 bg-slate-50'}`}>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{art.producto}</p>
                  <p className="text-xs text-slate-500">
                    Solicitado: <span className="font-semibold">{art.cantidad} {art.unidad}</span>
                  </p>
                  {cargandoInv ? (
                    <span className="mt-1.5 inline-block rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-400">
                      Consultando inventario…
                    </span>
                  ) : (
                    <span className={`mt-1.5 inline-block rounded-lg px-2 py-0.5 text-[11px] font-semibold ${STOCK_PILL[status.estado]}`}>
                      {stockLabel(status, art)}
                    </span>
                  )}
                </div>

                {art.estadoAlmacen === 'pendiente' ? (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Cant. a surtir:</span>
                      <input type="number" min="1" max={art.cantidad}
                        value={cantidades[art.id] ?? art.cantidad}
                        onChange={e => setCantidades(p => ({ ...p, [art.id]: Number(e.target.value) }))}
                        className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm font-bold outline-none focus:border-[#7E1D3B]/40" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => marcar(art.id, 'surtido')}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white transition bg-emerald-600 hover:bg-emerald-700
                          ${sugiereSurtir ? 'ring-2 ring-emerald-400/60' : ''}`}>
                        <CheckCircle2 size={13} /> Surtir
                      </button>
                      <button onClick={() => marcar(art.id, 'sin_stock')}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white transition bg-rose-600 hover:bg-rose-700
                          ${sugiereNoStock ? 'ring-2 ring-rose-400/60' : ''}`}>
                        <XCircle size={13} /> Sin stock
                      </button>
                    </div>
                    {!cargandoInv && (sugiereSurtir || sugiereNoStock) && (
                      <p className="text-[10px] text-slate-400 italic">
                        {sugiereSurtir ? '↑ Inventario sugiere surtir' : '↑ Inventario sugiere sin stock'}
                      </p>
                    )}
                  </div>
                ) : art.estadoAlmacen === 'surtido' ? (
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={13} /> Surtido
                    </span>
                    <span className="text-[10px] text-emerald-600">{cantidades[art.id] ?? art.cantidad} {art.unidad}</span>
                    <button className="text-[10px] text-slate-400 underline hover:text-slate-600"
                      onClick={() => deshacerMarcado(art.id)}>
                      Deshacer
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 rounded-xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700">
                      <XCircle size={13} /> Sin stock → Compras
                    </span>
                    <button className="text-[10px] text-slate-400 underline hover:text-slate-600"
                      onClick={() => deshacerMarcado(art.id)}>
                      Deshacer
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notas */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Notas de almacén (opcional)
        </label>
        <textarea value={notasAlmacen} onChange={e => setNotasAlmacen(e.target.value)}
          rows={2} placeholder="Observaciones para el área solicitante…"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none placeholder:text-slate-300 focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/15" />
      </div>

      {/* Finalizar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {todosProcesados
            ? sinStock.length > 0
              ? `Listo. Se generará requisición a Compras por ${sinStock.length} artículo${sinStock.length > 1 ? 's' : ''} faltante${sinStock.length > 1 ? 's' : ''}.`
              : 'Todos los artículos revisados. Listo para generar respuesta.'
            : `Faltan ${solicitud.articulos.filter(a => a.estadoAlmacen === 'pendiente').length} artículo(s) por revisar.`}
        </p>
        <button
          disabled={!todosProcesados}
          onClick={finalizar}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition
            ${todosProcesados ? 'bg-[#7E1D3B] hover:bg-[#63162e]' : 'cursor-not-allowed bg-slate-300'}`}>
          <ClipboardCheck size={15} /> Generar respuesta
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Panel principal: bandeja de almacén
// ─────────────────────────────────────────────────────────────────
const PanelBandejaRequisiciones = () => {
  const [solicitudes, setSolicitudes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [expandida, setExpandida] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [cargandoInv, setCargandoInv] = useState(false);

  useEffect(() => {
    setCargandoInv(true);
    fetch('http://localhost:4000/api/almacen/inventario')
      .then(r => r.ok ? r.json() : [])
      .then(data => setInventario(Array.isArray(data) ? data : []))
      .catch(() => setInventario([]))
      .finally(() => setCargandoInv(false));
  }, []);

  const persistir = (nuevas) => {
    setSolicitudes(nuevas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas));
  };

  const onActualizar = (id, nuevosArts, notas, finalizar = false) => {
    const actualizadas = solicitudes.map(s => {
      if (s.id !== id) return s;
      const updated = {
        ...s,
        articulos: nuevosArts,
        notasAlmacen: notas,
        estado: calcularEstadoSolicitud(nuevosArts),
      };
      if (finalizar) updated.fechaRevision = new Date().toISOString();
      return updated;
    });
    persistir(actualizadas);
  };

  const pendientes = solicitudes.filter(s => s.estado === 'PENDIENTE' || s.estado === 'EN_REVISION');
  const procesadas = solicitudes.filter(s => ['COMPLETADA', 'PARCIAL', 'ENVIADA_COMPRAS'].includes(s.estado));

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const renderTarjeta = (sol) => {
    const abierta = expandida === sol.id;
    const alertas = (!cargandoInv && inventario.length && sol.estado === 'PENDIENTE')
      ? sol.articulos.filter(a => {
          const s = getStockStatus(a, inventario);
          return s.estado === 'insuficiente' || s.estado === 'sin_registro';
        }).length
      : 0;
    const tipoLabel = sol.tipo ?? 'Ordinaria';

    return (
      <div key={sol.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setExpandida(abierta ? null : sol.id)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
              <ClipboardCheck size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black tracking-wide text-[#7E1D3B]">{sol.folio}</span>
                <span className="font-bold text-slate-900">{sol.area}</span>
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${TIPO_ESTILOS[tipoLabel] ?? 'bg-slate-100 text-slate-600'}`}>
                  {tipoLabel}
                </span>
                <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${ESTADO_BADGE[sol.estado]}`}>
                  {ESTADO_LABEL[sol.estado]}
                </span>
                {alertas > 0 && (
                  <span className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                    <AlertTriangle size={11} /> {alertas} posible{alertas > 1 ? 's' : ''} falta
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{sol.solicitante}</span>
                {' · '}{sol.articulos.length} artículo(s)
                {' · '}{formatFecha(sol.fecha)}
              </p>
            </div>
          </div>
          {abierta
            ? <ChevronUp size={18} className="shrink-0 text-slate-400" />
            : <ChevronDown size={18} className="shrink-0 text-slate-400" />}
        </button>

        {abierta && (
          <RevisionSolicitud
            solicitud={sol}
            inventario={inventario}
            cargandoInv={cargandoInv}
            onActualizar={onActualizar}
          />
        )}
      </div>
    );
  };

  if (!solicitudes.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <Inbox size={44} className="mb-3 text-slate-300" />
        <p className="font-bold text-slate-500">Bandeja vacía</p>
        <p className="mt-1 text-sm text-slate-400">Las solicitudes de las áreas aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendientes.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Por atender ({pendientes.length})
          </p>
          <div className="space-y-3">
            {[...pendientes]
              .sort((a, b) =>
                (TIPO_ORDEN[a.tipo ?? 'Ordinaria'] ?? 1) - (TIPO_ORDEN[b.tipo ?? 'Ordinaria'] ?? 1) ||
                new Date(b.fecha) - new Date(a.fecha)
              )
              .map(renderTarjeta)}
          </div>
        </div>
      )}

      {procesadas.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Atendidas ({procesadas.length})
          </p>
          <div className="space-y-3">{procesadas.map(renderTarjeta)}</div>
        </div>
      )}
    </div>
  );
};

export default PanelBandejaRequisiciones;
