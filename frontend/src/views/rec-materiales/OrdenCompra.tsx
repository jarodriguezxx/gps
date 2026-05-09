import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ui } from "../../config/theme";
import { API_BASE } from "../../config/api.ts";
import * as requisicionTypes from "../../types/requisicion.ts";
import * as ordenTypes from "../../types/ordenCompra.ts";
import { ProveedorAPI, mapProveedorAPI, Proveedores as ProveedorItem } from "../../types/proveedores.ts";
import { buscarEnCatalogo, DATA_CATALOGO_ARTICULOS } from "../../types/catalogoArticulos.ts";

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

interface OutletCtx {
  rol: string;
  requisiciones: requisicionTypes.Requisicion[];
  refrescar: () => Promise<void>;
}

const OrdenCompra = () => {
  const { rol, requisiciones = [], refrescar } = useOutletContext<OutletCtx>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [requisicion, setRequisicion] =
    useState<requisicionTypes.Requisicion | null>(null);
  const [orden, setOrden] = useState<ordenTypes.OrdenCompra | null>(null);
  const [ordenBackendId, setOrdenBackendId] = useState<string | null>(null);
  const [enviada, setEnviada] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firmando, setFirmando] = useState(false);
  const loadedIdRef = useRef<string | null>(null);

  type CotizacionItem =
    | { fuente: "adjunto"; id: string; nombreOriginal: string }
    | { fuente: "path"; requisicionId: string; nombre: string };
  const [cotizaciones, setCotizaciones] = useState<CotizacionItem[] | null>(null);
  const [descargando, setDescargando] = useState<string | null>(null);
  const [proveedoresLista, setProveedoresLista] = useState<ProveedorItem[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/proveedores`)
      .then((r) => r.json())
      .then((data: ProveedorAPI[]) => setProveedoresLista(data.map(mapProveedorAPI)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) {
      setRequisicion(null);
      setOrden(null);
      setIsLoading(false);
      loadedIdRef.current = null;
      return;
    }

    if (!requisiciones.length) {
      setIsLoading(true);
      return;
    }

    const req = requisiciones.find((r) => r.id === id);
    if (!req) {
      setRequisicion(null);
      setOrden(null);
      setIsLoading(false);
      loadedIdRef.current = null;
      return;
    }

    // Ya cargamos este ID — solo actualizar la copia local sin re-fetch
    if (loadedIdRef.current === id) {
      setRequisicion(req);
      return;
    }

    loadedIdRef.current = id;
    setIsLoading(true);
    setRequisicion(req);


    const requisicionYaEnviada =
      req.estado === "EN-REVISION" || req.estado === "FINALIZADA";
    setEnviada(requisicionYaEnviada);

    fetch(`${API_BASE}/ordenes-compra?requisicionId=${req.id}`)
      .then(async (res) => {
        if (res.ok) return res.json() as Promise<ordenTypes.OrdenCompraBackend>;
        if (res.status === 404) {
          const create = await fetch(`${API_BASE}/ordenes-compra`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requisicionId: req.id }),
          });
          if (!create.ok) throw new Error("error-creando-orden");
          return create.json() as Promise<ordenTypes.OrdenCompraBackend>;
        }
        const body = await res.text().catch(() => "");
        throw new Error(`error-cargando-orden: status=${res.status} body=${body}`);
      })
      .then((backend) => {
        setOrdenBackendId(backend.id);
        setEnviada(backend.estatus === "ENVIADA" || requisicionYaEnviada);

        const ordenLocal = ordenTypes.mapBackendToLocal(backend, req);

        const articulosConCatalogo = ordenLocal.articulos.map((art, idx) => {
          const entrada = buscarEnCatalogo(art.articulo) ?? DATA_CATALOGO_ARTICULOS[idx % DATA_CATALOGO_ARTICULOS.length];
          return { ...art, unidad: entrada.unidad, precioUnitario: entrada.precioUnitario };
        });

        const primeraEntrada = buscarEnCatalogo(ordenLocal.articulos[0]?.articulo ?? "") ?? DATA_CATALOGO_ARTICULOS[0];
        const proveedorAuto = proveedoresLista.find((p) => p.id === primeraEntrada.proveedorId);

        setOrden({
          ...ordenLocal,
          articulos: articulosConCatalogo,
          proveedor: proveedorAuto
            ? {
                id: proveedorAuto.id,
                nombre: proveedorAuto.nombre,
                rfc: proveedorAuto.rfc,
                telefono: proveedorAuto.contacto.telefono,
                correo: proveedorAuto.contacto.correo,
                contactoNombre: proveedorAuto.contacto.nombreEncargado,
              }
            : ordenLocal.proveedor,
        });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [id, requisiciones]);

  const subtotal = useMemo(
    () => (orden ? ordenTypes.calcularSubtotalOrdenCompra(orden.articulos) : 0),
    [orden],
  );
  const iva = ordenTypes.calcularIvaOrdenCompra(subtotal);
  const total = ordenTypes.calcularTotalOrdenCompra(subtotal);

  useEffect(() => {
    if (!requisicion?.id) return;
    setCotizaciones(null);

    const desdeAdjuntos = fetch(`${API_BASE}/requisiciones/${requisicion.id}/adjuntos`)
      .then((res) => res.json())
      .then((data: { id: string; nombreOriginal: string; tipo: string }[]) =>
        data
          .filter((a) => a.tipo === "COTIZACION")
          .map((a): CotizacionItem => ({ fuente: "adjunto", id: a.id, nombreOriginal: a.nombreOriginal }))
      )
      .catch((): CotizacionItem[] => []);

    Promise.all([desdeAdjuntos]).then(([adjuntos]) => {
      const desdePath: CotizacionItem[] = requisicion.cotizacionPath
        ? [{ fuente: "path", requisicionId: requisicion.id, nombre: "Cotización principal" }]
        : [];
      setCotizaciones([...desdePath, ...adjuntos]);
    });
  }, [requisicion?.id]);

  // Auto-save debounced al backend
  useEffect(() => {
    if (!orden || !ordenBackendId || enviada) return;

    const timeoutId = window.setTimeout(() => {
      fetch(`${API_BASE}/ordenes-compra/${ordenBackendId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordenTypes.mapLocalToUpdateRequest(orden)),
      }).catch(() => {});
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [orden, ordenBackendId, enviada]);

  const firmasCompletas =
    orden?.firmas.encargadoCompras.estado === "FIRMADA" &&
    orden?.firmas.administradora.estado === "FIRMADA" &&
    orden?.firmas.directoraGeneral.estado === "FIRMADA";

  const puedeEnviar =
    !!orden &&
    firmasCompletas &&
    orden.proveedor !== null &&
    orden.justificacion.trim().length > 0 &&
    orden.articulos.every((a) => a.precioUnitario > 0);

  const descargarCotizacion = async (cot: CotizacionItem) => {
    const key = cot.fuente === "adjunto" ? cot.id : "path";
    setDescargando(key);
    try {
      const url =
        cot.fuente === "adjunto"
          ? `${API_BASE}/requisiciones/${requisicion!.id}/adjuntos/${cot.id}/descargar`
          : `${API_BASE}/requisiciones/${cot.requisicionId}/cotizacion/descargar`;
      const res = await fetch(url);
      if (!res.ok) { alert("No se pudo descargar el archivo."); return; }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = cot.fuente === "adjunto" ? cot.nombreOriginal : cot.nombre;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDescargando(null);
    }
  };

  const esComprasInventario = rol === "compras-inventario";
  const regresarPantallaAnterior = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(`/${rol}`);
  };

  const firmarDocumento = async (
    clave: keyof ordenTypes.OrdenCompra["firmas"],
  ) => {
    if (!esComprasInventario || clave !== "encargadoCompras" || !ordenBackendId)
      return;
    if (orden?.firmas.encargadoCompras.estado === "FIRMADA") return;

    if (!window.confirm("¿Confirmas firmar este documento? Esta acción no se puede revertir."))
      return;

    setFirmando(true);
    try {
      const res = await fetch(
        `${API_BASE}/ordenes-compra/${ordenBackendId}/firmar-encargado`,
        { method: "PATCH" },
      );
      if (!res.ok) {
        const msg = await res.text().catch(() => String(res.status));
        alert(`Error al registrar la firma. ${msg}`);
        return;
      }

      const backend = await res.json() as ordenTypes.OrdenCompraBackend;
      setOrden((prev) =>
        prev
          ? {
              ...prev,
              firmas: {
                ...prev.firmas,
                encargadoCompras: {
                  ...prev.firmas.encargadoCompras,
                  estado: backend.firmaEncargadoCompras ? "FIRMADA" : "PENDIENTE",
                  fechaFirma: backend.firmaEncargadoCompras ? new Date() : null,
                },
              },
            }
          : prev,
      );
    } finally {
      setFirmando(false);
    }
  };

  const guardarBorrador = async () => {
    if (!orden || !ordenBackendId || enviada) return;

    const res = await fetch(`${API_BASE}/ordenes-compra/${ordenBackendId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ordenTypes.mapLocalToUpdateRequest(orden)),
    });
    if (!res.ok) {
      alert("Error al guardar el borrador. Intenta de nuevo.");
      return;
    }
    alert("Borrador guardado");
  };

  const enviarAlmacen = async () => {
    if (!orden || !ordenBackendId || !requisicion) return;

    if (!window.confirm("¿Confirmas enviar la orden de compra a Almacén? Una vez enviada no podrá editarse."))
      return;

    const tamanio = subtotal > 100_000 ? "MAYOR" : "MENOR";
    const patchTamanio = await fetch(`${API_BASE}/requisiciones/${requisicion.id}/tamanio`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tamanio }),
    });
    if (!patchTamanio.ok) {
      alert("Error al determinar el tamaño de la compra. Intenta de nuevo.");
      return;
    }

    const res = await fetch(
      `${API_BASE}/ordenes-compra/${ordenBackendId}/enviar`,
      { method: "PATCH" },
    );
    if (!res.ok) {
      const msg = await res.text().catch(() => res.status.toString());
      alert(`Error al enviar la orden: ${msg}`);
      return;
    }
    refrescar?.();
    alert("Orden de compra enviada a Almacén exitosamente. Regresando a la requisición.");
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <svg className="h-8 w-8 animate-spin text-[#8B1238]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-medium">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!requisicion || !orden) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-slate-50 p-6">
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className={ui.text.h1}>Orden de compra</h1>
          <p className={ui.text.body + " mt-2"}>
            No se encontró la requisición solicitada o hubo un error de conexión.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={ui.buttons.primary + " mt-4"}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const pasoPosteriorTexto =
    orden.siguientePaso === "FINANZAS"
      ? "Orden de compra, expediente y recursos financieros"
      : orden.siguientePaso === "EXPEDIENTE"
        ? "Orden de compra e integración de expediente"
        : "Orden de compra";

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-100 text-slate-900">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div>
          <p className={ui.text.labelGuinda}>Orden de compra</p>
          <h1 className={ui.text.h1}>
            Instituto Marakame - Sistema de Gestión Unificada
          </h1>
          <p className={ui.text.helper}>
            {rol?.replace("-", " ")} · {pasoPosteriorTexto}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={regresarPantallaAnterior}
            className={ui.buttons.secondary}
          >
            Regresar
          </button>
          <button onClick={() => window.print()} className={ui.buttons.neutral}>
            Imprimir
          </button>
          {!enviada && puedeEnviar && (
            <button
              onClick={guardarBorrador}
              className={ui.buttons.neutral}
            >
              Guardar Borrador
            </button>
          )}
          {!enviada && (
            <button
              onClick={enviarAlmacen}
              disabled={!puedeEnviar}
              className={ui.buttons.primary}
            >
              Enviar a Almacén
            </button>
          )}
          {enviada && (
            <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-800">
              Enviada a Almacén
            </span>
          )}
        </div>
      </div>

      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-5 md:px-6">
        <div className="space-y-6 pb-8">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#8B1238] px-4 py-3 text-white">
              <h2 className="text-base font-semibold">
                Datos de la Orden de Compra
              </h2>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Fecha de Orden
                </label>
                <div className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-900">
                  {orden.fechaOrden.toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Número de Orden
                </label>
                <div className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-900">
                  {orden.numeroOrden}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  No. Consecutivo
                </label>
                <div className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-900">
                  {orden.consecutivo}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Estatus
                </label>
                <div
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    enviada
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {enviada ? "Enviada a Almacén" : "Pendiente de Autorización"}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2 xl:col-span-3">
                <label className="text-sm font-semibold text-slate-700">
                  Proveedor / Razón Social
                </label>
                <div className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-900">
                  {orden.proveedor?.nombre ?? "—"}
                </div>
                {orden.proveedor && (
                  <p className="text-sm text-slate-500">
                    RFC: {orden.proveedor.rfc} | Tel: {orden.proveedor.telefono} | Contacto: {orden.proveedor.contactoNombre}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#3F5F1D] px-4 py-3 text-white">
              <h2 className="text-base font-semibold">Artículos de la Orden</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className={ui.table.header}>#</th>
                    <th className={ui.table.header}>Artículo</th>
                    <th className={ui.table.header}>Descripción</th>
                    <th className={ui.table.header}>Unidad</th>
                    <th className={ui.table.header}>Cantidad</th>
                    <th className={ui.table.header}>Precio Unit.</th>
                    <th className={ui.table.header}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orden.articulos.map((articulo, index) => {
                    const subtotalLinea =
                      articulo.cantidad * articulo.precioUnitario;

                    return (
                      <tr key={articulo.id} className={ui.table.row}>
                        <td className={ui.table.cell + " text-center"}>
                          {index + 1}
                        </td>
                        <td className={ui.table.cell}>
                          <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800">
                            {articulo.articulo}
                          </div>
                        </td>
                        <td className={ui.table.cell}>
                          <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800">
                            {articulo.descripcion}
                          </div>
                        </td>
                        <td className={ui.table.cell}>
                          <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800">
                            {articulo.unidad}
                          </div>
                        </td>
                        <td className={ui.table.cell}>
                          <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800 text-center">
                            {articulo.cantidad}
                          </div>
                        </td>
                        <td className={ui.table.cell}>
                          {enviada ? (
                            <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800 text-right">
                              {moneda.format(articulo.precioUnitario)}
                            </div>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={articulo.precioUnitario}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setOrden((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        articulos: prev.articulos.map((a) =>
                                          a.id === articulo.id ? { ...a, precioUnitario: val } : a
                                        ),
                                      }
                                    : prev
                                );
                              }}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 text-right outline-none focus:border-[#7E1D3B]"
                            />
                          )}
                        </td>
                        <td className={ui.table.cell + " text-right font-semibold"}>
                          {moneda.format(subtotalLinea)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 border-t border-slate-200 bg-slate-50 px-4 py-5 md:grid-cols-[1fr_280px]">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  Resumen de Montos
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-semibold text-slate-900">
                      {moneda.format(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">IVA (16%):</span>
                    <span className="font-semibold text-slate-900">
                      {moneda.format(iva)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-base font-black text-slate-900">
                      Total:
                    </span>
                    <span className="text-base font-black text-[#7E1D3B]">
                      {moneda.format(total)} MXN
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#7E1D3B] p-4 text-white shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                  Estado de flujo
                </p>
                <p className="mt-2 text-lg font-black">{pasoPosteriorTexto}</p>
                <p className="mt-3 text-sm text-white/80">
                  Esta orden comparte el mismo flujo base para requisiciones
                  ordinarias y extraordinarias.
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="text-base font-semibold text-slate-800">Cotizaciones de la Requisición</h2>
              <p className="text-xs text-slate-500 mt-0.5">Descarga y compara para determinar el precio unitario de cada artículo.</p>
            </div>
            {cotizaciones === null ? (
              <p className="px-4 py-5 text-sm text-slate-400">Cargando cotizaciones...</p>
            ) : cotizaciones.length === 0 ? (
              <p className="px-4 py-5 text-sm text-slate-400">No hay cotizaciones adjuntas a esta requisición.</p>
            ) : (
              <ul className="divide-y divide-slate-100 p-4 space-y-0">
                {cotizaciones.map((cot, idx) => {
                  const key = cot.fuente === "adjunto" ? cot.id : "path";
                  const nombre = cot.fuente === "adjunto" ? cot.nombreOriginal : cot.nombre;
                  return (
                    <li key={key} className="flex items-center justify-between py-3">
                      <span className="text-sm text-slate-700 font-medium">
                        Cotización {idx + 1} — {nombre}
                      </span>
                      <button
                        onClick={() => descargarCotizacion(cot)}
                        disabled={descargando === key}
                        className={ui.buttons.secondary + " text-xs"}
                      >
                        {descargando === key ? "Descargando..." : "Descargar"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="text-base font-semibold text-slate-800">
                Justificación de la Compra
              </h2>
            </div>
            <div className="p-4">
              <textarea
                disabled={enviada}
                value={orden.justificacion}
                onChange={(event) =>
                  setOrden((prev) =>
                    prev
                      ? {
                          ...prev,
                          justificacion: event.target.value,
                        }
                      : prev,
                  )
                }
                className="min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#7E1D3B] disabled:opacity-60"
                placeholder="Escriba la justificación detallada de esta orden de compra..."
              />
              <p className="mt-2 text-xs text-slate-500">
                {orden.justificacion.length} caracteres
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[#8B1238] px-4 py-3 text-white">
              <h2 className="text-base font-semibold">
                Firmas de Autorización
              </h2>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-3">
              {(
                [
                  orden.firmas.encargadoCompras,
                  orden.firmas.administradora,
                  orden.firmas.directoraGeneral,
                ] as const
              ).map((firma, index) => {
                const firmaAnteriorFirmada =
                  index === 0 ||
                  (index === 1 &&
                    orden.firmas.encargadoCompras.estado === "FIRMADA") ||
                  (index === 2 &&
                    orden.firmas.administradora.estado === "FIRMADA");

                const firmaKey: keyof ordenTypes.OrdenCompra["firmas"] =
                  index === 0
                    ? "encargadoCompras"
                    : index === 1
                      ? "administradora"
                      : "directoraGeneral";
                const esBloqueCompras = firmaKey === "encargadoCompras";
                const puedeFirmar =
                  esBloqueCompras &&
                  esComprasInventario &&
                  firma.estado !== "FIRMADA" &&
                  firmaAnteriorFirmada &&
                  !enviada &&
                  !firmando;

                return (
                  <article
                    key={firma.cargo}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-base font-black text-slate-900">
                      {firma.cargo}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {firma.nombre}
                    </p>

                    <div className="my-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                      {firma.estado === "FIRMADA"
                        ? "Firmado"
                        : "Pendiente de firma"}
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <button
                        onClick={() => firmarDocumento(firmaKey)}
                        disabled={!puedeFirmar}
                        className={`${ui.buttons.neutral} w-full justify-center ${firma.estado === "FIRMADA" ? "opacity-60" : ""}`}
                      >
                        {firma.estado === "FIRMADA"
                          ? "Firmado"
                          : "Firmar Documento"}
                      </button>
                      {!firmaAnteriorFirmada && index > 0 && (
                        <p className="mt-2 text-center text-xs text-orange-600">
                          Requiere firma anterior
                        </p>
                      )}
                      {!esBloqueCompras && (
                        <p className="mt-2 text-center text-xs text-slate-500">
                          Firma restringida temporalmente
                        </p>
                      )}
                      {esBloqueCompras && !esComprasInventario && (
                        <p className="mt-2 text-center text-xs text-slate-500">
                          Solo compras e inventarios puede firmar este bloque
                        </p>
                      )}
                      {firma.estado === "FIRMADA" && firma.fechaFirma && (
                        <p className="mt-3 text-center text-xs text-slate-500">
                          Fecha: {firma.fechaFirma.toLocaleDateString("es-MX")}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                <strong>Nota:</strong> Las firmas deben realizarse en orden
                jerárquico: Encargado de Compras → Administradora → Directora
                General. Una vez firmada la orden, se procederá con el proceso
                de adquisición.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrdenCompra;
