import * as requisicionTypes from "./requisicion.ts";

export type OrdenCompraEstatus =
  | "BORRADOR"
  | "PENDIENTE_AUTORIZACION"
  | "AUTORIZADA"
  | "EN_PROCESO_FINANZAS";

export type OrdenCompraPasoPosterior = "EXPEDIENTE" | "FINANZAS" | null;

export type OrdenCompraFirmaEstado = "PENDIENTE" | "FIRMADA";

export type OrdenCompraProveedor = {
  id: string;
  nombre: string;
  rfc: string;
  telefono: string;
  correo: string;
  contactoNombre: string;
};

export type OrdenCompraArticulo = {
  id: string;
  articulo: string;
  descripcion: string;
  unidad: requisicionTypes.UnidadesArticulos;
  cantidad: number;
  precioUnitario: number;
};

export type OrdenCompraFirma = {
  cargo: string;
  nombre: string;
  estado: OrdenCompraFirmaEstado;
  fechaFirma: Date | null;
  requiereAnterior: boolean;
};

export type OrdenCompra = {
  id: string;
  requisicionId: string;
  numeroOrden: string;
  consecutivo: string;
  fechaOrden: Date;
  estatus: OrdenCompraEstatus;
  siguientePaso: OrdenCompraPasoPosterior;
  proveedor: OrdenCompraProveedor | null;
  articulos: OrdenCompraArticulo[];
  justificacion: string;
  firmas: {
    encargadoCompras: OrdenCompraFirma;
    administradora: OrdenCompraFirma;
    directoraGeneral: OrdenCompraFirma;
  };
};

export const crearNumeroOrdenCompra = (requisicionId: string, fecha: Date) => {
  const consecutivo = requisicionId
    .replace(/\D/g, "")
    .slice(-4)
    .padStart(4, "0");
  return {
    consecutivo,
    numeroOrden: `OC-${fecha.getFullYear()}-${consecutivo}`,
  };
};

export const resolverSiguientePasoOrdenCompra = (
  tipo: requisicionTypes.TipoCompra,
  tamanio: requisicionTypes.TamanioCompra,
): OrdenCompraPasoPosterior => {
  if (tipo === "EXTRAORDINARIA") {
    return tamanio === "MAYOR" ? "FINANZAS" : "EXPEDIENTE";
  }

  return null;
};

export const crearBorradorOrdenCompra = (
  requisicion: requisicionTypes.Requisicion,
): OrdenCompra => {
  const { numeroOrden, consecutivo } = crearNumeroOrdenCompra(
    requisicion.id,
    requisicion.fecha,
  );

  return {
    id: `OC-${requisicion.id}`,
    requisicionId: requisicion.id,
    numeroOrden,
    consecutivo,
    fechaOrden: requisicion.fecha,
    estatus: "BORRADOR",
    siguientePaso: resolverSiguientePasoOrdenCompra(
      requisicion.tipo,
      requisicion.tamanio,
    ),
    proveedor: null,
    articulos: requisicion.articulos.map((articulo, index) => ({
      id: `${requisicion.id}-${articulo.id}-${index + 1}`,
      articulo: articulo.articuloRequisitado,
      descripcion: articulo.articuloRequisitado,
      unidad: articulo.unidad,
      cantidad: Number(articulo.articulosSolicitados),
      precioUnitario: 0,
    })),
    justificacion: requisicion.justificacion,
    firmas: {
      encargadoCompras: {
        cargo: "Encargado de Compras e Inventarios",
        nombre: "Laura Martínez",
        estado: "FIRMADA",
        fechaFirma: new Date(),
        requiereAnterior: false,
      },
      administradora: {
        cargo: "Administradora",
        nombre: "Lic. Patricia Hernández",
        estado: "PENDIENTE",
        fechaFirma: null,
        requiereAnterior: true,
      },
      directoraGeneral: {
        cargo: "Directora General",
        nombre: "Dra. María Elena Rodríguez",
        estado: "PENDIENTE",
        fechaFirma: null,
        requiereAnterior: true,
      },
    },
  };
};

export const calcularSubtotalOrdenCompra = (articulos: OrdenCompraArticulo[]) =>
  articulos.reduce(
    (subtotal, articulo) =>
      subtotal + articulo.cantidad * articulo.precioUnitario,
    0,
  );

export const calcularIvaOrdenCompra = (subtotal: number) => subtotal * 0.16;

export const calcularTotalOrdenCompra = (subtotal: number) =>
  subtotal + calcularIvaOrdenCompra(subtotal);
