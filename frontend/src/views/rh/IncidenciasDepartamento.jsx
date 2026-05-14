import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, User, CheckCircle, XCircle, X, ChevronLeft,
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const INCIDENCIAS_KEY = 'marakame_incidencias';

// Mapa: puesto del jefe → departamento que puede ver
const JEFE_A_DEPARTAMENTO = {
  'JEFA (E) DEP. ADMISIONES':     'DEPARTAMENTO DE ADMISIONES',
  'JEFA (E) DEP. MÉDICO':         'DEPARTAMENTO MÉDICO',
  'JEFA (E) DEP. CLÍNICO':        'DEPARTAMENTO CLÍNICO',
  'JEFA (E) DEP. ADMINISTRACIÓN': 'DEPARTAMENTO DE ADMINISTRACIÓN',
};

const TIPO_COLOR = {
  'Retardo':             'bg-amber-50 text-amber-700 border-amber-200',
  'Falta Justificada':   'bg-blue-50 text-blue-700 border-blue-200',
  'Falta Injustificada': 'bg-red-50 text-red-700 border-red-200',
  'Ausencia Temporal':   'bg-orange-50 text-orange-700 border-orange-200',
};

const fmtFecha = (dateStr) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const getUsuario = () => {
  try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
};

const IncidenciasDepartamento = () => {
  const navigate    = useNavigate();
  const usuario     = getUsuario();
  const departamento = JEFE_A_DEPARTAMENTO[usuario.puesto];
  const esJefe      = Boolean(departamento);

  const [incidencias, setIncidencias] = useState([]);
  const [detalle, setDetalle]         = useState(null);
  const [confirmar, setConfirmar]     = useState(null); // incidencia a justificar

  const cargarIncidencias = () => {
    const todas = JSON.parse(localStorage.getItem(INCIDENCIAS_KEY) || '[]');
    setIncidencias(todas.filter((i) => i.departamento === departamento));
  };

  useEffect(() => {
    if (esJefe) cargarIncidencias();
  }, [esJefe, departamento]);

  const justificar = (inc) => {
    const todas = JSON.parse(localStorage.getItem(INCIDENCIAS_KEY) || '[]');
    const actualizadas = todas.map((i) =>
      i.id === inc.id ? { ...i, estatus: 'JUSTIFICADA' } : i,
    );
    localStorage.setItem(INCIDENCIAS_KEY, JSON.stringify(actualizadas));
    setConfirmar(null);
    setDetalle(null);
    cargarIncidencias();
  };

  const revertir = (id) => {
    const todas = JSON.parse(localStorage.getItem(INCIDENCIAS_KEY) || '[]');
    const actualizadas = todas.map((i) =>
      i.id === id ? { ...i, estatus: 'INJUSTIFICADA' } : i,
    );
    localStorage.setItem(INCIDENCIAS_KEY, JSON.stringify(actualizadas));
    cargarIncidencias();
  };

  // ── Pantalla de acceso denegado ──
  if (!esJefe) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-lg font-black text-slate-800 mb-2">Acceso no autorizado</h2>
          <p className="text-sm text-slate-500 mb-6">
            Esta sección es exclusiva para jefes de departamento.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold hover:bg-[#63162e] transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ── Vista principal ──
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm">

          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img
                src={marakameLogo}
                alt="Logo Nayarit Marakame"
                className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Incidencias de mi Área</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                  {departamento}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center shrink-0">
                <User size={18} className="text-[#7E1D3B]" />
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">{usuario.puesto}</p>
                <p className="font-semibold text-slate-700">
                  {usuario.nombre ?? usuario.username}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="px-4 py-5 md:px-6 space-y-5">

            {/* Botón volver */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7E1D3B] hover:underline"
            >
              <ChevronLeft size={16} />
              Volver
            </button>

            <div>
              <h2 className="text-2xl font-black text-slate-800">Faltas y Ausencias</h2>
              <p className="text-sm text-slate-400 font-medium tracking-wide">
                Trabajadores del {departamento}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  Incidencias — {incidencias.length}{' '}
                  {incidencias.length === 1 ? 'registro' : 'registros'}
                </h2>
              </div>

              {incidencias.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <ClipboardList size={36} className="mb-3 opacity-40" />
                  <p className="font-semibold text-sm">
                    No hay incidencias registradas en tu área
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                        <th className="px-4 py-3 text-left font-semibold">Empleado</th>
                        <th className="px-4 py-3 text-left font-semibold">Tipo de Incidencia</th>
                        <th className="px-4 py-3 text-center font-semibold">Estatus</th>
                        <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {incidencias.map((inc) => (
                        <tr key={inc.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                            {fmtFecha(inc.fecha)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800">{inc.empleado}</p>
                            <p className="text-xs text-slate-400">{inc.puesto}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold
                                ${TIPO_COLOR[inc.tipoIncidencia] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}
                            >
                              {inc.tipoIncidencia}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border
                                ${inc.estatus === 'JUSTIFICADA'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-red-50 text-red-700 border-red-200'}`}
                            >
                              {inc.estatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              {/* Ver detalle */}
                              <button
                                onClick={() => setDetalle(inc)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition"
                              >
                                Ver
                              </button>

                              {/* Justificar / Revertir */}
                              {inc.estatus === 'INJUSTIFICADA' ? (
                                <button
                                  onClick={() => setConfirmar(inc)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
                                >
                                  <CheckCircle size={13} />
                                  Justificar Incidencia
                                </button>
                              ) : (
                                <button
                                  onClick={() => revertir(inc.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold hover:bg-slate-200 transition"
                                >
                                  Revertir
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Ver detalle ── */}
      {detalle && !confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-bold text-[#7E1D3B] uppercase tracking-wider">
                  Detalle de Incidencia
                </p>
                <p className="font-black text-slate-800 text-lg">{detalle.empleado}</p>
              </div>
              <button
                onClick={() => setDetalle(null)}
                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fecha</p>
                  <p className="text-sm font-semibold text-slate-800">{fmtFecha(detalle.fecha)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tipo</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold
                      ${TIPO_COLOR[detalle.tipoIncidencia] ?? ''}`}
                  >
                    {detalle.tipoIncidencia}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Puesto</p>
                  <p className="text-sm font-semibold text-slate-800">{detalle.puesto}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Estatus</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border
                      ${detalle.estatus === 'JUSTIFICADA'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'}`}
                  >
                    {detalle.estatus}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Descripción</p>
                  <p className="text-sm text-slate-600">{detalle.descripcionTipo}</p>
                </div>
                {detalle.observaciones && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Observaciones
                    </p>
                    <p className="text-sm text-slate-600">{detalle.observaciones}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setDetalle(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cerrar
              </button>
              {detalle.estatus === 'INJUSTIFICADA' && (
                <button
                  onClick={() => { setConfirmar(detalle); }}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-md"
                >
                  <CheckCircle size={14} />
                  Justificar Incidencia
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Confirmar justificación ── */}
      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <p className="font-black text-slate-800">Confirmar Justificación</p>
              <button
                onClick={() => setConfirmar(null)}
                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-6 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <p className="font-semibold text-slate-800 text-base mb-1">{confirmar.empleado}</p>
              <p className="text-sm text-slate-500">
                {confirmar.tipoIncidencia} &nbsp;·&nbsp; {fmtFecha(confirmar.fecha)}
              </p>
              <p className="text-sm text-slate-500 mt-4">
                ¿Confirmas que esta incidencia queda <strong>JUSTIFICADA</strong>?
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Este cambio será visible para Recursos Humanos.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setConfirmar(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => justificar(confirmar)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-md"
              >
                <CheckCircle size={14} />
                Confirmar Justificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidenciasDepartamento;
