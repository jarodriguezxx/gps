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

// ── Tipos para comunicación con backend ──────────────────────────────────────

export type OrdenCompraBackend = {
  id: string;
  requisicionId: string;
  numeroOrden: string | null;
  consecutivo: number | null;
  fechaOrden: string;
  estatus: "BORRADOR" | "ENVIADA";
  justificacion: string | null;
  proveedorId: string | null;
  proveedorNombre: string | null;
  proveedorRfc: string | null;
  proveedorTelefono: string | null;
  proveedorCorreo: string | null;
  proveedorContactoNombre: string | null;
  firmaEncargadoCompras: boolean;
  articulos: ArticuloOrdenCompraBackend[];
};

export type ArticuloOrdenCompraBackend = {
  id: string;
  articuloRequisicionId: string | null;
  articulo: string;
  descripcion: string;
  unidad: requisicionTypes.UnidadesArticulos;
  cantidad: number;
  precioUnitario: number;
};

export type ActualizarOrdenCompraRequest = {
  justificacion: string;
  proveedorId: string | null;
  proveedorNombre: string | null;
  proveedorRfc: string | null;
  proveedorTelefono: string | null;
  proveedorCorreo: string | null;
  proveedorContactoNombre: string | null;
  articulos: {
    id: string;
    articulo: string;
    descripcion: string;
    unidad: string;
    cantidad: number;
    precioUnitario: number;
  }[];
};

export const mapBackendToLocal = (
  backend: OrdenCompraBackend,
  req: requisicionTypes.Requisicion,
): OrdenCompra => {
  const yaEnviada = backend.estatus === "ENVIADA";

  return {
    id: backend.id,
    requisicionId: backend.requisicionId,
    numeroOrden:
      backend.numeroOrden ??
      `OC-${new Date(backend.fechaOrden).getFullYear()}-XXXX`,
    consecutivo: backend.consecutivo?.toString() ?? "—",
    fechaOrden: new Date(backend.fechaOrden),
    estatus: yaEnviada ? "AUTORIZADA" : "BORRADOR",
    siguientePaso: null,
    proveedor: backend.proveedorId
      ? {
          id: backend.proveedorId,
          nombre: backend.proveedorNombre ?? "",
          rfc: backend.proveedorRfc ?? "",
          telefono: backend.proveedorTelefono ?? "",
          correo: backend.proveedorCorreo ?? "",
          contactoNombre: backend.proveedorContactoNombre ?? "",
        }
      : null,
    articulos: backend.articulos.map((a) => ({
      id: a.id,
      articulo: a.articulo,
      descripcion: a.descripcion,
      unidad: a.unidad,
      cantidad: a.cantidad,
      precioUnitario: a.precioUnitario,
    })),
    justificacion: backend.justificacion ?? "",
    firmas: {
      encargadoCompras: {
        cargo: "Encargado de Compras e Inventarios",
        nombre: "Laura Martínez",
        estado: (yaEnviada || backend.firmaEncargadoCompras) ? "FIRMADA" : "PENDIENTE",
        fechaFirma: null,
        requiereAnterior: false,
      },
      administradora: {
        cargo: "Administradora",
        nombre: "Lic. Patricia Hernández",
        estado: (yaEnviada || req.firmaAdminsitradora) ? "FIRMADA" : "PENDIENTE",
        fechaFirma: null,
        requiereAnterior: true,
      },
      directoraGeneral: {
        cargo: "Directora General",
        nombre: "Dra. María Elena Rodríguez",
        estado: (yaEnviada || req.firmaDirectoraGral) ? "FIRMADA" : "PENDIENTE",
        fechaFirma: null,
        requiereAnterior: true,
      },
    },
  };
};

export const mapLocalToUpdateRequest = (
  orden: OrdenCompra,
): ActualizarOrdenCompraRequest => ({
  justificacion: orden.justificacion,
  proveedorId: orden.proveedor?.id ?? null,
  proveedorNombre: orden.proveedor?.nombre ?? null,
  proveedorRfc: orden.proveedor?.rfc ?? null,
  proveedorTelefono: orden.proveedor?.telefono ?? null,
  proveedorCorreo: orden.proveedor?.correo ?? null,
  proveedorContactoNombre: orden.proveedor?.contactoNombre ?? null,
  articulos: orden.articulos.map((a) => ({
    id: a.id,
    articulo: a.articulo,
    descripcion: a.descripcion,
    unidad: a.unidad,
    cantidad: a.cantidad,
    precioUnitario: a.precioUnitario,
  })),
});
