import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ui } from "../../config/theme";
import { API_BASE } from "../../config/api";
import * as tipos from "../../types/requisicion";

type Props = { rol: string };

type AdjuntoAPI = {
  id: string;
  nombreOriginal: string;
  tipo: string;
};

type Toast = { msg: string; ok: boolean } | null;

const VistaFirmaRequisicion = ({ rol }: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [req, setReq] = useState<tipos.Requisicion | null>(null);
  const [adjuntos, setAdjuntos] = useState<AdjuntoAPI[]>([]);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  const [modalFirma, setModalFirma] = useState(false);
  const [modalRechazo, setModalRechazo] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [procesando, setProcesando] = useState(false);

  const headers = { "Content-Type": "application/json", "X-Rol": rol };

  const mostrarToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const cargar = async () => {
    setCargando(true);
    try {
      const [resReq, resAdj] = await Promise.all([
        fetch(`${API_BASE}/requisiciones/${id}`),
        fetch(`${API_BASE}/requisiciones/${id}/adjuntos`),
      ]);
      const dataReq = await resReq.json();
      const dataAdj = await resAdj.json();
      setReq({ ...dataReq, fecha: new Date(dataReq.fecha) });
      setAdjuntos(Array.isArray(dataAdj) ? dataAdj : []);
    } catch (e) {
      mostrarToast("Error al cargar la requisición", false);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [id]);

  const cotizacionesAdjuntas = adjuntos.filter((a) => a.tipo === "COTIZACION");
  const tieneCotizaciones = req?.cotizacionPath || cotizacionesAdjuntas.length > 0;

  const yaFirmoAdmin = req?.firmaAdminsitradora === true;
  const yaFirmoDir = req?.firmaDirectoraGral === true;
  const esRechazada = req?.estado === "RECHAZADA";

  const puedeFirmar =
    !esRechazada &&
    ((rol === "administracion" && !yaFirmoAdmin) ||
      (rol === "direccion-general" && !yaFirmoDir));

  const firmar = async () => {
    setProcesando(true);
    const endpoint =
      rol === "administracion" ? "firma-administradora" : "firma-directora-gral";
    try {
      const res = await fetch(`${API_BASE}/requisiciones/${id}/${endpoint}`, {
        method: "PATCH",
        headers,
      });
      if (res.ok) {
        mostrarToast("Requisición firmada correctamente", true);
        setModalFirma(false);
        cargar();
      } else {
        const txt = await res.text();
        if (txt === "firma-administradora-requerida") {
          mostrarToast("La administración debe firmar primero", false);
        } else {
          mostrarToast("No se pudo firmar: " + txt, false);
        }
        setModalFirma(false);
      }
    } finally {
      setProcesando(false);
    }
  };

  const rechazar = async () => {
    if (!observaciones.trim()) return;
    setProcesando(true);
    try {
      const res = await fetch(`${API_BASE}/requisiciones/${id}/rechazar`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ observaciones }),
      });
      if (res.ok) {
        mostrarToast("Requisición rechazada", true);
        setModalRechazo(false);
        setObservaciones("");
        cargar();
      } else {
        mostrarToast("No se pudo rechazar: " + (await res.text()), false);
        setModalRechazo(false);
      }
    } finally {
      setProcesando(false);
    }
  };

  const descargarCotizacionLegacy = () => {
    window.open(`${API_BASE}/requisiciones/${id}/cotizacion/descargar`, "_blank");
  };

  const descargarAdjunto = (adjId: string) => {
    window.open(`${API_BASE}/requisiciones/${id}/adjuntos/${adjId}/descargar`, "_blank");
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-500">
        Cargando requisición...
      </div>
    );
  }

  if (!req) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-600">
        No se encontró la requisición.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          ← Volver
        </button>
        <h1 className={ui.text.h1}>Detalle de Requisición</h1>
      </div>

      {/* Banner rechazo */}
      {esRechazada && req.observacionesRechazo && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">Requisición rechazada</p>
          <p className="mt-1 text-xs text-red-600">
            Rechazada por: <strong>{req.rechazadoPor}</strong>
          </p>
          <p className="mt-1 text-sm text-red-800">{req.observacionesRechazo}</p>
        </div>
      )}

      {/* Badge estado + firma */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold border ${
          req.estado === "PRE-AUTORIZADA" ? "bg-purple-100 text-purple-800 border-purple-300" :
          req.estado === "AUTORIZADA" ? "bg-blue-100 text-blue-800 border-blue-300" :
          req.estado === "RECHAZADA" ? "bg-red-100 text-red-800 border-red-300" :
          "bg-slate-100 text-slate-700 border-slate-300"
        }`}>
          {req.estado}
        </span>
        {yaFirmoAdmin && (
          <span className="inline-block rounded-full px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            ✓ Firmada por administración
          </span>
        )}
        {yaFirmoDir && (
          <span className="inline-block rounded-full px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            ✓ Firmada por dirección general
          </span>
        )}
        {rol === "administracion" && yaFirmoAdmin && !esRechazada && (
          <span className="text-xs text-slate-500">Ya firmaste esta requisición</span>
        )}
        {rol === "direccion-general" && yaFirmoDir && !esRechazada && (
          <span className="text-xs text-slate-500">Ya firmaste esta requisición</span>
        )}
      </div>

      {/* Info general */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-slate-700">Información general</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["Área", req.area],
            ["Solicitante", req.solicitante],
            ["Tipo", req.tipo],
            ["Tamaño", req.tamanio],
            ["Fecha", req.fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })],
            ["Responsable de área", req.responsableArea],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-semibold text-slate-800">{val}</p>
            </div>
          ))}
        </div>
        {req.justificacion && (
          <div className="mt-3">
            <p className="text-xs text-slate-500">Justificación</p>
            <p className="text-sm text-slate-700">{req.justificacion}</p>
          </div>
        )}
      </div>

      {/* Artículos */}
      {req.articulos && req.articulos.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-slate-700">Artículos solicitados</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 text-left text-xs font-bold text-slate-500">Artículo</th>
                  <th className="pb-2 text-center text-xs font-bold text-slate-500">Unidad</th>
                  <th className="pb-2 text-center text-xs font-bold text-slate-500">Solicitados</th>
                  <th className="pb-2 text-center text-xs font-bold text-slate-500">Pendientes</th>
                </tr>
              </thead>
              <tbody>
                {req.articulos.map((art) => (
                  <tr key={art.id} className="border-b border-slate-100">
                    <td className="py-2 text-slate-700">{art.articuloRequisitado}</td>
                    <td className="py-2 text-center text-slate-600">{art.unidad}</td>
                    <td className="py-2 text-center text-slate-600">{String(art.articulosSolicitados)}</td>
                    <td className="py-2 text-center text-slate-600">{String(art.articulosPendientes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cotizaciones */}
      {tieneCotizaciones && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-slate-700">Cotizaciones</h2>
          <div className="flex flex-col gap-2">
            {req.cotizacionPath && (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-700">Cotización principal</span>
                <button
                  onClick={descargarCotizacionLegacy}
                  className="rounded-lg bg-[#7E1D3B] px-3 py-1 text-xs font-semibold text-white hover:bg-[#63162e] transition"
                >
                  Descargar
                </button>
              </div>
            )}
            {cotizacionesAdjuntas.map((adj) => (
              <div
                key={adj.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="text-sm text-slate-700 break-all">{adj.nombreOriginal}</span>
                <button
                  onClick={() => descargarAdjunto(adj.id)}
                  className="ml-3 flex-shrink-0 rounded-lg bg-[#7E1D3B] px-3 py-1 text-xs font-semibold text-white hover:bg-[#63162e] transition"
                >
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      {puedeFirmar && (
        <div className="flex gap-3">
          <button
            onClick={() => setModalFirma(true)}
            className={ui.buttons.primary}
          >
            Firmar requisición
          </button>
          <button
            onClick={() => setModalRechazo(true)}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
          >
            Rechazar
          </button>
        </div>
      )}

      {/* Modal confirmar firma */}
      {modalFirma && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-base font-bold text-slate-800">Confirmar firma</h2>
            <p className="mb-5 text-sm text-slate-600">
              ¿Estás seguro de que deseas firmar esta requisición? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalFirma(false)} disabled={procesando} className={ui.buttons.neutral}>
                Cancelar
              </button>
              <button onClick={firmar} disabled={procesando} className={ui.buttons.primary}>
                {procesando ? "Firmando..." : "Confirmar firma"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal rechazo */}
      {modalRechazo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-base font-bold text-red-800">Rechazar requisición</h2>
            <p className="mb-3 text-sm text-slate-600">
              Esta acción es permanente. La requisición quedará en modo solo lectura.
            </p>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Motivo del rechazo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              placeholder="Describe el motivo del rechazo..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-red-400 resize-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => { setModalRechazo(false); setObservaciones(""); }}
                disabled={procesando}
                className={ui.buttons.neutral}
              >
                Cancelar
              </button>
              <button
                onClick={rechazar}
                disabled={procesando || !observaciones.trim()}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50 disabled:pointer-events-none"
              >
                {procesando ? "Rechazando..." : "Confirmar rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaFirmaRequisicion;
