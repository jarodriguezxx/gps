import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2, XCircle, Inbox, ClipboardCheck,
  AlertTriangle, Loader2, RefreshCw, History,
} from 'lucide-react';
import { API_BASE } from '../../config/api';

const ESTADO_BADGE = {
  AUTORIZADA:  'bg-blue-50 text-blue-700 border-blue-200',
  FINALIZADA:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  RECIBIDA:    'bg-teal-50 text-teal-700 border-teal-200',
};

const TIPO_ESTILOS = {
  ORDINARIA:      'bg-slate-100 text-slate-600',
  EXTRAORDINARIA: 'bg-amber-100 text-amber-700',
};

// ─────────────────────────────────────────────────────────────────
// Revisión de artículos de una requisición
// ─────────────────────────────────────────────────────────────────
const RevisionRequisicion = ({ req, decisiones, onMarcar, onFinalizar, procesando }) => {
  const arts = req.articulos || [];
  const decsReq = decisiones[req.id] || {};

  const surtidos   = arts.filter(a => decsReq[a.id]?.estado === 'surtido');
  const sinStock   = arts.filter(a => decsReq[a.id]?.estado === 'sin_stock');
  const pendientes = arts.filter(a => !decsReq[a.id] || decsReq[a.id].estado === 'pendiente');
  const todosProcesados = pendientes.length === 0;

  return (
    <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">

      {/* Contadores */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <p className="text-lg font-black text-slate-800">{arts.length}</p>
          <p className="text-[10px] font-bold uppercase text-slate-400">Solicitados</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-lg font-black text-emerald-700">{surtidos.length}</p>
          <p className="text-[10px] font-bold uppercase text-emerald-600">A surtir</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center">
          <p className="text-lg font-black text-rose-700">{sinStock.length}</p>
          <p className="text-[10px] font-bold uppercase text-rose-600">Sin stock</p>
        </div>
      </div>

      {req.justificacion && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
          <span className="font-bold">Justificación:</span> {req.justificacion}
        </div>
      )}

      {/* Artículos */}
      <div className="space-y-2.5">
        {arts.map(art => {
          const dec = decsReq[art.id] || {
            estado: 'pendiente',
            cantidad: Number(art.articulosSolicitados) || 1,
          };

          return (
            <div
              key={art.id}
              className={`rounded-xl border p-4 transition ${
                dec.estado === 'surtido'   ? 'border-emerald-200 bg-emerald-50' :
                dec.estado === 'sin_stock' ? 'border-rose-200 bg-rose-50' :
                'border-slate-200 bg-slate-50'}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{art.articuloRequisitado}</p>
                  <p className="text-xs text-slate-500">
                    Solicitado:{' '}
                    <span className="font-semibold">
                      {art.articulosSolicitados} {art.unidad}
                    </span>
                  </p>
                  {art.descripcion && (
                    <p className="mt-0.5 text-xs text-slate-400">{art.descripcion}</p>
                  )}
                </div>

                {dec.estado === 'pendiente' ? (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Cant. a surtir:</span>
                      <input
                        type="number"
                        min="1"
                        max={art.articulosSolicitados}
                        value={dec.cantidad}
                        onChange={e =>
                          onMarcar(req.id, art.id, 'pendiente', Number(e.target.value))
                        }
                        className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-sm font-bold outline-none focus:border-[#7E1D3B]/40"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onMarcar(req.id, art.id, 'surtido', dec.cantidad)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={13} /> Surtir
                      </button>
                      <button
                        onClick={() => onMarcar(req.id, art.id, 'sin_stock', 0)}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                      >
                        <XCircle size={13} /> Sin stock
                      </button>
                    </div>
                  </div>
                ) : dec.estado === 'surtido' ? (
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={13} /> Surtido
                    </span>
                    <span className="text-[10px] text-emerald-600">
                      {dec.cantidad} {art.unidad}
                    </span>
                    <button
                      className="text-[10px] text-slate-400 underline hover:text-slate-600"
                      onClick={() =>
                        onMarcar(req.id, art.id, 'pendiente', Number(art.articulosSolicitados))
                      }
                    >
                      Deshacer
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 rounded-xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700">
                      <XCircle size={13} /> Sin stock
                    </span>
                    <button
                      className="text-[10px] text-slate-400 underline hover:text-slate-600"
                      onClick={() =>
                        onMarcar(req.id, art.id, 'pendiente', Number(art.articulosSolicitados))
                      }
                    >
                      Deshacer
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Finalizar */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-slate-400">
          {todosProcesados
            ? sinStock.length > 0
              ? `Listo. ${sinStock.length} artículo(s) sin stock quedarán pendientes de compra.`
              : 'Todos los artículos surtidos. Lista para marcar como recibida.'
            : `Faltan ${pendientes.length} artículo(s) por revisar.`}
        </p>
        <button
          disabled={!todosProcesados || procesando === req.id}
          onClick={() => onFinalizar(req)}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition ${
            todosProcesados && procesando !== req.id
              ? 'bg-[#7E1D3B] hover:bg-[#63162e]'
              : 'cursor-not-allowed bg-slate-300'
          }`}
        >
          {procesando === req.id ? (
            <><Loader2 size={15} className="animate-spin" /> Procesando...</>
          ) : (
            <><ClipboardCheck size={15} /> Marcar como recibida</>
          )}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Panel principal de la bandeja
// ─────────────────────────────────────────────────────────────────
const PanelBandejaRequisiciones = () => {
  const [requisiciones, setRequisiciones] = useState([]);
  const [cargando, setCargando]           = useState(true);
  const [expandida, setExpandida]         = useState(null);
  // { [reqId]: { [artId]: { estado: 'pendiente'|'surtido'|'sin_stock', cantidad: number } } }
  const [decisiones, setDecisiones]       = useState({});
  const [procesando, setProcesando]       = useState(null);
  const [verHistorial, setVerHistorial]   = useState(false);

  const cargar = useCallback(async () => {
    try {
      const res  = await fetch(`${API_BASE}/requisiciones`);
      const data = await res.json();
      const lista = (Array.isArray(data) ? data : [])
        .filter(r => r.estado === 'AUTORIZADA' || r.estado === 'FINALIZADA' || r.estado === 'RECIBIDA')
        .map(r => ({ ...r, fecha: new Date(r.fecha) }));
      setRequisiciones(lista);

      setDecisiones(prev => {
        const next = { ...prev };
        for (const req of lista) {
          if ((req.estado === 'AUTORIZADA' || req.estado === 'FINALIZADA') && !next[req.id]) {
            next[req.id] = {};
            for (const art of (req.articulos || [])) {
              const entregados  = Number(art.articulosEntregados) || 0;
              const solicitados = Number(art.articulosSolicitados) || 1;
              next[req.id][art.id] = {
                estado:   entregados >= solicitados ? 'surtido' : 'pendiente',
                cantidad: entregados > 0 ? entregados : solicitados,
              };
            }
          }
        }
        return next;
      });
    } catch (e) {
      console.error('Error cargando requisiciones:', e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 30_000);
    return () => clearInterval(t);
  }, [cargar]);

  const marcarArticulo = (reqId, artId, estado, cantidad) => {
    setDecisiones(prev => ({
      ...prev,
      [reqId]: { ...(prev[reqId] || {}), [artId]: { estado, cantidad } },
    }));
  };

  const finalizarRequisicion = async (req) => {
    const decsReq = decisiones[req.id] || {};
    const arts    = req.articulos || [];
    setProcesando(req.id);
    try {
      for (const art of arts) {
        const dec = decsReq[art.id];
        if (dec?.estado === 'surtido') {
          await fetch(`${API_BASE}/requisiciones/articulos/${art.id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ articulosEntregados: dec.cantidad }),
          });
        }
      }
      const res = await fetch(`${API_BASE}/requisiciones/${req.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ estado: 'RECIBIDA' }),
      });
      if (!res.ok) throw new Error(await res.text());
      setExpandida(null);
      await cargar();
    } catch (e) {
      alert(`Error al finalizar la requisición: ${e.message}`);
    } finally {
      setProcesando(null);
    }
  };

  const activas   = requisiciones.filter(r => r.estado === 'AUTORIZADA' || r.estado === 'FINALIZADA');
  const historial = requisiciones.filter(r => r.estado === 'RECIBIDA');

  const formatFecha = (d) =>
    d instanceof Date
      ? d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      : '';

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-400">Cargando solicitudes…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Tabs + botón actualizar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setVerHistorial(false)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              !verHistorial
                ? 'bg-[#7E1D3B] text-white shadow-sm'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Por atender ({activas.length})
          </button>
          <button
            onClick={() => setVerHistorial(true)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              verHistorial
                ? 'bg-[#7E1D3B] text-white shadow-sm'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <History size={14} /> Historial ({historial.length})
          </button>
        </div>
        <button
          onClick={cargar}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
        >
          <RefreshCw size={12} /> Actualizar
        </button>
      </div>

      {/* Requisiciones activas */}
      {!verHistorial && (
        activas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <Inbox size={44} className="mb-3 text-slate-300" />
            <p className="font-bold text-slate-500">Bandeja vacía</p>
            <p className="mt-1 text-sm text-slate-400">
              Las requisiciones autorizadas por Dirección General aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activas.map(req => {
              const abierta    = expandida === req.id;
              const arts       = req.articulos || [];
              const decsReq    = decisiones[req.id] || {};
              const pendCount  = arts.filter(
                a => !decsReq[a.id] || decsReq[a.id].estado === 'pendiente'
              ).length;

              return (
                <div
                  key={req.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandida(abierta ? null : req.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
                        <ClipboardCheck size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900">{req.area}</span>
                          <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${TIPO_ESTILOS[req.tipo] ?? 'bg-slate-100 text-slate-600'}`}>
                            {req.tipo}
                          </span>
                          <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${ESTADO_BADGE[req.estado] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {req.estado}
                          </span>
                          {pendCount > 0 && (
                            <span className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                              <AlertTriangle size={11} /> {pendCount} por revisar
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{req.solicitante}</span>
                          {' · '}{arts.length} artículo(s)
                          {' · '}{formatFecha(req.fecha)}
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`shrink-0 text-slate-400 transition-transform ${abierta ? 'rotate-180' : ''}`}
                      width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {abierta && (
                    <RevisionRequisicion
                      req={req}
                      decisiones={decisiones}
                      onMarcar={marcarArticulo}
                      onFinalizar={finalizarRequisicion}
                      procesando={procesando}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Historial */}
      {verHistorial && (
        historial.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <History size={44} className="mb-3 text-slate-300" />
            <p className="font-bold text-slate-500">Sin historial aún</p>
            <p className="mt-1 text-sm text-slate-400">Las requisiciones procesadas aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historial.map(req => (
              <div
                key={req.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{req.area}</span>
                      <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${TIPO_ESTILOS[req.tipo] ?? 'bg-slate-100 text-slate-600'}`}>
                        {req.tipo}
                      </span>
                      <span className="rounded-lg border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700">
                        RECIBIDA ✓
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{req.solicitante}</span>
                      {' · '}{(req.articulos || []).length} artículo(s)
                      {' · '}{formatFecha(req.fecha)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default PanelBandejaRequisiciones;
