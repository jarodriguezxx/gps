import * as ordenTypes from "../../types/ordenCompra.ts";

export type OrdenCompraPersistida = Omit<
  ordenTypes.OrdenCompra,
  "fechaOrden" | "firmas"
> & {
  fechaOrden: string;
  firmas: {
    encargadoCompras: Omit<
      ordenTypes.OrdenCompra["firmas"]["encargadoCompras"],
      "fechaFirma"
    > & {
      fechaFirma: string | null;
    };
    administradora: Omit<
      ordenTypes.OrdenCompra["firmas"]["administradora"],
      "fechaFirma"
    > & {
      fechaFirma: string | null;
    };
    directoraGeneral: Omit<
      ordenTypes.OrdenCompra["firmas"]["directoraGeneral"],
      "fechaFirma"
    > & {
      fechaFirma: string | null;
    };
  };
};

const storageKey = (requisicionId: string) => `orden-compra-${requisicionId}`;

const serializarOrdenCompra = (
  orden: ordenTypes.OrdenCompra,
): OrdenCompraPersistida => ({
  ...orden,
  fechaOrden: orden.fechaOrden.toISOString(),
  firmas: {
    encargadoCompras: {
      ...orden.firmas.encargadoCompras,
      fechaFirma: orden.firmas.encargadoCompras.fechaFirma
        ? orden.firmas.encargadoCompras.fechaFirma.toISOString()
        : null,
    },
    administradora: {
      ...orden.firmas.administradora,
      fechaFirma: orden.firmas.administradora.fechaFirma
        ? orden.firmas.administradora.fechaFirma.toISOString()
        : null,
    },
    directoraGeneral: {
      ...orden.firmas.directoraGeneral,
      fechaFirma: orden.firmas.directoraGeneral.fechaFirma
        ? orden.firmas.directoraGeneral.fechaFirma.toISOString()
        : null,
    },
  },
});

const deserializarOrdenCompra = (
  ordenPersistida: OrdenCompraPersistida,
): ordenTypes.OrdenCompra => ({
  ...ordenPersistida,
  fechaOrden: new Date(ordenPersistida.fechaOrden),
  firmas: {
    encargadoCompras: {
      ...ordenPersistida.firmas.encargadoCompras,
      fechaFirma: ordenPersistida.firmas.encargadoCompras.fechaFirma
        ? new Date(ordenPersistida.firmas.encargadoCompras.fechaFirma)
        : null,
    },
    administradora: {
      ...ordenPersistida.firmas.administradora,
      fechaFirma: ordenPersistida.firmas.administradora.fechaFirma
        ? new Date(ordenPersistida.firmas.administradora.fechaFirma)
        : null,
    },
    directoraGeneral: {
      ...ordenPersistida.firmas.directoraGeneral,
      fechaFirma: ordenPersistida.firmas.directoraGeneral.fechaFirma
        ? new Date(ordenPersistida.firmas.directoraGeneral.fechaFirma)
        : null,
    },
  },
});

export const guardarOrdenCompraPersistida = (orden: ordenTypes.OrdenCompra) => {
  localStorage.setItem(
    storageKey(orden.requisicionId),
    JSON.stringify(serializarOrdenCompra(orden)),
  );
};

export const cargarOrdenCompraPersistida = (
  requisicionId: string,
): ordenTypes.OrdenCompra | null => {
  const raw = localStorage.getItem(storageKey(requisicionId));
  if (!raw) {
    return null;
  }

  try {
    return deserializarOrdenCompra(JSON.parse(raw) as OrdenCompraPersistida);
  } catch {
    return null;
  }
};

export const limpiarOrdenCompraPersistida = (requisicionId: string) => {
  localStorage.removeItem(storageKey(requisicionId));
};
