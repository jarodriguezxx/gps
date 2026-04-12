import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ui } from "../../config/theme";
import * as requisicionTypes from "../../types/requisicion.ts";
import * as ordenTypes from "../../types/ordenCompra.ts";
import { DATA_PROVEEDORES } from "../../types/proveedores.ts";
import {
  cargarOrdenCompraPersistida,
  guardarOrdenCompraPersistida,
} from "./ordenCompraStorage";

const moneda = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const OrdenCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const rol = useOutletContext() as string;
  const [requisicion, setRequisicion] =
    useState<requisicionTypes.Requisicion | null>(null);
  const [orden, setOrden] = useState<ordenTypes.OrdenCompra | null>(null);

  useEffect(() => {
    if (!id) {
      setRequisicion(null);
      setOrden(null);
      return;
    }

    const requisicionEncontrada = requisicionTypes.REQUISICIONES_COMPLETO.find(
      (item) => item.id === id,
    );

    if (!requisicionEncontrada) {
      setRequisicion(null);
      setOrden(null);
      return;
    }

    setRequisicion(requisicionEncontrada);

    const borradorGuardado = cargarOrdenCompraPersistida(
      requisicionEncontrada.id,
    );
    setOrden(
      borradorGuardado ??
        ordenTypes.crearBorradorOrdenCompra(requisicionEncontrada),
    );
  }, [id]);

  const proveedoresActivos = useMemo(
    () =>
      DATA_PROVEEDORES.filter((proveedor) => proveedor.estatus === "ACTIVO"),
    [],
  );

  const subtotal = useMemo(
    () => (orden ? ordenTypes.calcularSubtotalOrdenCompra(orden.articulos) : 0),
    [orden],
  );
  const iva = ordenTypes.calcularIvaOrdenCompra(subtotal);
  const total = ordenTypes.calcularTotalOrdenCompra(subtotal);

  useEffect(() => {
    if (!orden) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      guardarOrdenCompraPersistida(orden);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [orden]);

  const firmasCompletas =
    orden?.firmas.encargadoCompras.estado === "FIRMADA" &&
    orden?.firmas.administradora.estado === "FIRMADA" &&
    orden?.firmas.directoraGeneral.estado === "FIRMADA";
  const esComprasInventario = rol === "compras-inventario";
  const regresarPantallaAnterior = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(`/${rol}`);
  };

  const actualizarArticulo = (
    articuloId: string,
    campo:
      | "articulo"
      | "descripcion"
      | "unidad"
      | "cantidad"
      | "precioUnitario",
    valor: string | number,
  ) => {
    setOrden((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        articulos: prev.articulos.map((articulo) =>
          articulo.id === articuloId
            ? {
                ...articulo,
                [campo]: valor,
              }
            : articulo,
        ),
      };
    });
  };

  const eliminarArticulo = (articuloId: string) => {
    setOrden((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        articulos: prev.articulos.filter((articulo) => articulo.id !== articuloId),
      };
    });
  };

  const firmarDocumento = (clave: keyof ordenTypes.OrdenCompra["firmas"]) => {
    if (!esComprasInventario || clave !== "encargadoCompras") {
      return;
    }

    setOrden((prev) => {
      if (!prev) {
        return prev;
      }

      const firmas = { ...prev.firmas };
      const firmaAnteriorFirmada =
        clave === "encargadoCompras" ||
        (clave === "administradora" &&
          firmas.encargadoCompras.estado === "FIRMADA") ||
        (clave === "directoraGeneral" &&
          firmas.administradora.estado === "FIRMADA");

      if (!firmaAnteriorFirmada || firmas[clave].estado === "FIRMADA") {
        return prev;
      }

      firmas[clave] = {
        ...firmas[clave],
        estado: "FIRMADA",
        fechaFirma: new Date(),
      };

      return {
        ...prev,
        firmas,
        estatus:
          firmas.administradora.estado === "FIRMADA" &&
          firmas.directoraGeneral.estado === "FIRMADA"
            ? "AUTORIZADA"
            : prev.estatus,
      };
    });
  };

  const guardarBorrador = () => {
    if (!orden) {
      return;
    }

    guardarOrdenCompraPersistida(orden);
    alert("Borrador guardado");
  };

  const enviarAutorizacion = () => {
    if (!orden) {
      return;
    }

    alert("Orden enviada a autorización");
  };

  if (!requisicion || !orden) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-slate-50 p-6">
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className={ui.text.h1}>Orden de compra</h1>
          <p className={ui.text.body + " mt-2"}>
            No se encontró la requisición solicitada o la ruta no contiene un id
            válido.
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
          <button onClick={guardarBorrador} className={ui.buttons.neutral}>
            Guardar Borrador
          </button>
          <button
            onClick={enviarAutorizacion}
            disabled={!firmasCompletas}
            className={ui.buttons.primary}
          >
            Enviar a Autorización
          </button>
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
                <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                  {orden.estatus === "BORRADOR"
                    ? "Pendiente de Autorización"
                    : orden.estatus}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2 xl:col-span-3">
                <label className="text-sm font-semibold text-slate-700">
                  Proveedor / Razón Social
                </label>
                <select
                  value={orden.proveedor?.id ?? ""}
                  onChange={(event) => {
                    const proveedorSeleccionado = proveedoresActivos.find(
                      (proveedor) => proveedor.id === event.target.value,
                    );

                    setOrden((prev) =>
                      prev
                        ? {
                            ...prev,
                            proveedor: proveedorSeleccionado
                              ? {
                                  id: proveedorSeleccionado.id,
                                  nombre: proveedorSeleccionado.nombre,
                                  rfc: proveedorSeleccionado.rfc,
                                  telefono:
                                    proveedorSeleccionado.contacto.telefono,
                                  correo: proveedorSeleccionado.contacto.correo,
                                  contactoNombre:
                                    proveedorSeleccionado.contacto
                                      .nombreEncargado,
                                }
                              : null,
                          }
                        : prev,
                    );
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-[#7E1D3B]"
                >
                  <option value="">Selecciona un proveedor activo</option>
                  {proveedoresActivos.map((proveedor) => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-slate-500">
                  {orden.proveedor
                    ? `Razón Social: ${orden.proveedor.nombre} | ID: ${orden.proveedor.id}`
                    : "Selecciona un proveedor para completar la orden."}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#3F5F1D] px-4 py-3 text-white">
              <h2 className="text-base font-semibold">Artículos de la Orden</h2>
              <button
                onClick={() => {
                  setOrden((prev) =>
                    prev
                      ? {
                          ...prev,
                          articulos: [
                            ...prev.articulos,
                            {
                              id: `${prev.id}-${prev.articulos.length + 1}`,
                              articulo: "",
                              descripcion: "",
                              unidad: "PIEZA",
                              cantidad: 1,
                              precioUnitario: 0,
                            },
                          ],
                        }
                      : prev,
                  );
                }}
                className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#3F5F1D] transition hover:bg-slate-100"
              >
                + Agregar Artículo
              </button>
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
                    <th className={ui.table.header}>Acciones</th>
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
                          <input
                            value={articulo.articulo}
                            onChange={(event) =>
                              actualizarArticulo(
                                articulo.id,
                                "articulo",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]"
                            placeholder="Artículo"
                          />
                        </td>
                        <td className={ui.table.cell}>
                          <input
                            value={articulo.descripcion}
                            onChange={(event) =>
                              actualizarArticulo(
                                articulo.id,
                                "descripcion",
                                event.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]"
                            placeholder="Descripción"
                          />
                        </td>
                        <td className={ui.table.cell}>
                          <select
                            value={articulo.unidad}
                            onChange={(event) =>
                              actualizarArticulo(
                                articulo.id,
                                "unidad",
                                event.target
                                  .value as requisicionTypes.UnidadesArticulos,
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]"
                          >
                            <option value="PIEZA">Pieza</option>
                            <option value="CAJA">Caja</option>
                            <option value="PAQUETE">Paquete</option>
                          </select>
                        </td>
                        <td className={ui.table.cell}>
                          <input
                            type="number"
                            min={1}
                            value={articulo.cantidad}
                            onChange={(event) =>
                              actualizarArticulo(
                                articulo.id,
                                "cantidad",
                                Number(event.target.value),
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]"
                          />
                        </td>
                        <td className={ui.table.cell}>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={articulo.precioUnitario}
                            onChange={(event) =>
                              actualizarArticulo(
                                articulo.id,
                                "precioUnitario",
                                Number(event.target.value),
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]"
                          />
                        </td>
                        <td
                          className={
                            ui.table.cell + " text-right font-semibold"
                          }
                        >
                          {moneda.format(subtotalLinea)}
                        </td>
                        <td className={ui.table.cell + " text-center"}>
                          <button
                            onClick={() => eliminarArticulo(articulo.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            Eliminar
                          </button>
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
              <h2 className="text-base font-semibold text-slate-800">
                Justificación de la Compra
              </h2>
            </div>
            <div className="p-4">
              <textarea
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
                className="min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#7E1D3B]"
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
                  firmaAnteriorFirmada;

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
