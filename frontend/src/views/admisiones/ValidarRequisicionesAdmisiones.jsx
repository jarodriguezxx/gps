import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';
import { API_BASE } from '../../config/api';
import { AlertTriangle, BadgeCheck, CheckCircle, ChevronRight, ClipboardList, X, XCircle } from 'lucide-react';

const ESTADO_BADGE = {
  'PENDIENTE':      'bg-amber-100 text-amber-800 border-amber-200',
  'PRE-AUTORIZADA': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'EN-REVISION':    'bg-blue-100 text-blue-800 border-blue-200',
  'AUTORIZADA':     'bg-emerald-100 text-emerald-800 border-emerald-200',
  'RECHAZADA':      'bg-rose-100 text-rose-800 border-rose-200',
  'FINALIZADA':     'bg-slate-100 text-slate-600 border-slate-200',
  'INCOMPLETA':     'bg-orange-100 text-orange-800 border-orange-200',
  'RECIBIDA':       'bg-teal-100 text-teal-800 border-teal-200',
};

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${ESTADO_BADGE[estado] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
    {estado}
  </span>
);

const formatFecha = (f) => {
  if (!f) return '—';
  return new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

const FILTROS = [
  { key: 'PENDIENTE',   label: 'Pendientes' },
  { key: 'TODAS',       label: 'Todas' },
  { key: 'PRE-AUTORIZADA', label: 'Validadas' },
  { key: 'RECHAZADA',   label: 'Rechazadas' },
];

export default function ValidarRequisicionesAdmisiones() {
  const [requisiciones, setRequisiciones]   = useState([]);
  const [cargando, setCargando]             = useState(true);
  const [filtro, setFiltro]                 = useState('PENDIENTE');
  const [seleccionada, setSeleccionada]     = useState(null);
  const [modoRechazo, setModoRechazo]       = useState(false);
  const [observaciones, setObservaciones]   = useState('');
  const [procesando, setProcesando]         = useState(false);
  const [msg, setMsg]                       = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const r = await fetch(`${API_BASE}/requisiciones`);
      const data = await r.json();
      const deAdmisiones = Array.isArray(data)
        ? data.filter(req => req.area?.toLowerCase() === 'admisiones')
        : [];
      setRequisiciones(deAdmisiones);
    } catch {
      setRequisiciones([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const mostrarMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 4000);
  };

  const cerrarModal = () => {
    setSeleccionada(null);
    setModoRechazo(false);
    setObservaciones('');
  };

  const handleValidar = async (req) => {
    setProcesando(true);
    try {
      const res = await fetch(`${API_BASE}/requisiciones/${req.id}/validar-admisiones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Rol': 'jefe-admisiones' },
      });
      if (!res.ok) {
        mostrarMsg('error', (await res.text()) || 'No se pudo validar la requisición.');
      } else {
        mostrarMsg('ok', 'Requisición validada y enviada a revisión.');
        cerrarModal();
        await cargar();
      }
    } catch {
      mostrarMsg('error', 'Error de red al validar.');
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async (req) => {
    if (!observaciones.trim()) { mostrarMsg('error', 'Debes indicar el motivo de rechazo.'); return; }
    setProcesando(true);
    try {
      const res = await fetch(`${API_BASE}/requisiciones/${req.id}/rechazar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Rol': 'jefe-admisiones' },
        body: JSON.stringify({ observaciones: observaciones.trim() }),
      });
      if (!res.ok) {
        mostrarMsg('error', (await res.text()) || 'No se pudo rechazar la requisición.');
      } else {
        mostrarMsg('ok', 'Requisición rechazada.');
        cerrarModal();
        await cargar();
      }
    } catch {
      mostrarMsg('error', 'Error de red al rechazar.');
    } finally {
      setProcesando(false);
    }
  };

  const filtradas = requisiciones.filter(r =>
    filtro === 'TODAS' ? true : r.estado === filtro
  );
  const pendientesCount = requisiciones.filter(r => r.estado === 'PENDIENTE').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
      <AdminHeader submodule="Admisiones — Validar Requisiciones" />

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <AdmisionesSidebar />

        <main className="min-w-0">
          {/* Título */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-slate-800">Validar Requisiciones</h2>
              <p className="text-sm text-slate-400 font-medium tracking-wide">
                Aprueba o rechaza las solicitudes pendientes del área de Admisiones
              </p>
            </div>
            {pendientesCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black px-3 py-2 shrink-0">
                <AlertTriangle size={13} />
                {pendientesCount} pendiente{pendientesCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Toast */}
          {msg && (
            <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold border ${
              msg.tipo === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {msg.texto}
            </div>
          )}

          {/* Filtros */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {FILTROS.map(f => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${
                  filtro === f.key
                    ? 'bg-[#7E1D3B] text-white border-[#7E1D3B] shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-[#7E1D3B]/40 hover:text-[#7E1D3B]'
                }`}
              >
                {f.label}
                {f.key === 'PENDIENTE' && pendientesCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center bg-amber-500 text-white rounded-full w-4 h-4 text-[10px]">
                    {pendientesCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Lista */}
          {cargando ? (
            <div className="text-center py-16 text-slate-400 text-sm">Cargando requisiciones…</div>
          ) : filtradas.length === 0 ? (
            <div className="rounded-2xl bg-white border border-slate-200 py-16 text-center">
              <ClipboardList size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 font-semibold text-sm">
                {filtro === 'PENDIENTE' ? 'No hay requisiciones pendientes de validación' : 'No hay requisiciones en esta categoría'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtradas.map(req => (
                <div
                  key={req.id}
                  onClick={() => { setSeleccionada(req); setModoRechazo(false); setObservaciones(''); }}
                  className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4 hover:border-[#7E1D3B]/30 hover:shadow-sm transition cursor-pointer group"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#7E1D3B]/8 border border-[#7E1D3B]/15 flex items-center justify-center shrink-0">
                    <ClipboardList size={17} className="text-[#7E1D3B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-sm font-black text-slate-800">{req.area}</span>
                      <EstadoBadge estado={req.estado} />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${req.tipo === 'EXTRAORDINARIA' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                        {req.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      Solicitante: <span className="font-semibold">{req.solicitante || '—'}</span>
                      {' · '}Responsable: <span className="font-semibold">{req.responsableArea || '—'}</span>
                      {' · '}{formatFecha(req.fecha)}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-[#7E1D3B] shrink-0 transition" />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal de detalle */}
      {seleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <BadgeCheck size={18} className="text-[#7E1D3B]" />
                  Detalle de Requisición
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {seleccionada.area} · {formatFecha(seleccionada.fecha)}
                </p>
              </div>
              <button
                onClick={cerrarModal}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body modal - scrollable */}
            <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Estado',             <EstadoBadge estado={seleccionada.estado} />],
                  ['Tipo de compra',     seleccionada.tipo],
                  ['Solicitante',        seleccionada.solicitante || '—'],
                  ['Responsable de área',seleccionada.responsableArea || '—'],
                  ['Tamaño de compra',   seleccionada.tamanio || '—'],
                  ['Fecha',              formatFecha(seleccionada.fecha)],
                ].map(([label, valor]) => (
                  <div key={label} className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                    <div className="text-sm font-semibold text-slate-700">{valor}</div>
                  </div>
                ))}
              </div>

              {/* Justificación */}
              {seleccionada.justificacion && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Justificación</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{seleccionada.justificacion}</p>
                </div>
              )}

              {/* Artículos */}
              {seleccionada.articulos?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Artículos solicitados ({seleccionada.articulos.length})
                  </p>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-bold text-slate-500 uppercase tracking-wider">Artículo</th>
                          <th className="px-3 py-2 text-center font-bold text-slate-500 uppercase tracking-wider w-24">Unidad</th>
                          <th className="px-3 py-2 text-center font-bold text-slate-500 uppercase tracking-wider w-20">Cant.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {seleccionada.articulos.map((art, i) => (
                          <tr key={art.id || i} className="bg-white">
                            <td className="px-3 py-2.5 text-slate-700 font-medium">{art.articuloRequisitado}</td>
                            <td className="px-3 py-2.5 text-center text-slate-500">{art.unidad}</td>
                            <td className="px-3 py-2.5 text-center text-slate-700 font-bold">{art.articulosSolicitados}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Rechazo anterior */}
              {seleccionada.observacionesRechazo && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-1">Motivo de rechazo</p>
                  <p className="text-sm text-rose-700">{seleccionada.observacionesRechazo}</p>
                </div>
              )}

              {/* Textarea de rechazo */}
              {modoRechazo && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Motivo del rechazo <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                    placeholder="Describe el motivo por el cual se rechaza esta requisición…"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-400 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Footer modal - acciones */}
            {seleccionada.estado === 'PENDIENTE' && (
              <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end shrink-0">
                {!modoRechazo ? (
                  <>
                    <button
                      onClick={() => setModoRechazo(true)}
                      disabled={procesando}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold hover:bg-rose-100 transition disabled:opacity-50"
                    >
                      <XCircle size={15} /> Rechazar
                    </button>
                    <button
                      onClick={() => handleValidar(seleccionada)}
                      disabled={procesando}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold hover:bg-[#63162e] transition shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle size={15} />
                      {procesando ? 'Procesando…' : 'Validar Requisición'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setModoRechazo(false); setObservaciones(''); }}
                      disabled={procesando}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleRechazar(seleccionada)}
                      disabled={procesando || !observaciones.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition shadow-sm disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      {procesando ? 'Rechazando…' : 'Confirmar Rechazo'}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Footer informativo si ya fue procesada */}
            {seleccionada.estado !== 'PENDIENTE' && (
              <div className="px-6 py-4 border-t border-slate-100 shrink-0">
                <p className="text-xs text-slate-400 text-center font-medium">
                  Esta requisición ya fue procesada · Estado: <span className="font-bold text-slate-600">{seleccionada.estado}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
