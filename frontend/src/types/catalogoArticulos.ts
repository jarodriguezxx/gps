import type { UnidadesArticulos } from "./requisicion.ts";

export type CatalogoArticulo = {
  nombre: string;
  unidad: UnidadesArticulos;
  precioUnitario: number;
  proveedorId: string;
};

export const DATA_CATALOGO_ARTICULOS: CatalogoArticulo[] = [
  // PROV-001 — Ferretería Industrial
  { nombre: "Llave inglesa 12\"", unidad: "PIEZA", precioUnitario: 185.0, proveedorId: "PROV-001" },
  { nombre: "Destornillador de impacto", unidad: "PIEZA", precioUnitario: 320.0, proveedorId: "PROV-001" },
  { nombre: "Cinta métrica 5m", unidad: "PIEZA", precioUnitario: 95.0, proveedorId: "PROV-001" },
  { nombre: "Clavos galvanizados 2\" caja x500", unidad: "CAJA", precioUnitario: 145.0, proveedorId: "PROV-001" },

  // PROV-002 — Software y TI
  { nombre: "Licencia antivirus anual", unidad: "PIEZA", precioUnitario: 850.0, proveedorId: "PROV-002" },
  { nombre: "Cable HDMI 2m", unidad: "PIEZA", precioUnitario: 120.0, proveedorId: "PROV-002" },
  { nombre: "Teclado USB", unidad: "PIEZA", precioUnitario: 280.0, proveedorId: "PROV-002" },
  { nombre: "Mouse inalámbrico", unidad: "PIEZA", precioUnitario: 210.0, proveedorId: "PROV-002" },

  // PROV-004 — Construcción
  { nombre: "Cemento Portland 50kg", unidad: "PIEZA", precioUnitario: 180.0, proveedorId: "PROV-004" },
  { nombre: "Varilla de acero 3/8\"", unidad: "PIEZA", precioUnitario: 95.0, proveedorId: "PROV-004" },
  { nombre: "Block de concreto 15x20x40", unidad: "PIEZA", precioUnitario: 18.5, proveedorId: "PROV-004" },

  // PROV-005 — Limpieza
  { nombre: "Cloro industrial 20L", unidad: "PIEZA", precioUnitario: 210.0, proveedorId: "PROV-005" },
  { nombre: "Jabón multiusos 5L", unidad: "PIEZA", precioUnitario: 145.0, proveedorId: "PROV-005" },
  { nombre: "Bolsas de basura negras x100", unidad: "PAQUETE", precioUnitario: 85.0, proveedorId: "PROV-005" },
  { nombre: "Desinfectante pisos 4L", unidad: "PIEZA", precioUnitario: 130.0, proveedorId: "PROV-005" },

  // PROV-007 — Logística
  { nombre: "Caja de cartón corrugado 60x40x40", unidad: "PIEZA", precioUnitario: 35.0, proveedorId: "PROV-007" },
  { nombre: "Cinta de embalaje x6 rollos", unidad: "PAQUETE", precioUnitario: 90.0, proveedorId: "PROV-007" },

  // PROV-008 — Mobiliario
  { nombre: "Silla ejecutiva ergonómica", unidad: "PIEZA", precioUnitario: 2850.0, proveedorId: "PROV-008" },
  { nombre: "Escritorio modular 120x60cm", unidad: "PIEZA", precioUnitario: 3400.0, proveedorId: "PROV-008" },
  { nombre: "Archivero metálico 4 gavetas", unidad: "PIEZA", precioUnitario: 1950.0, proveedorId: "PROV-008" },

  // PROV-011 — Textiles
  { nombre: "Sábana hospitalaria blanca", unidad: "PIEZA", precioUnitario: 185.0, proveedorId: "PROV-011" },
  { nombre: "Cobija polar individual", unidad: "PIEZA", precioUnitario: 220.0, proveedorId: "PROV-011" },
  { nombre: "Almohada antiácaros", unidad: "PIEZA", precioUnitario: 145.0, proveedorId: "PROV-011" },

  // PROV-012 — Electricidad
  { nombre: "Foco LED 60W", unidad: "PIEZA", precioUnitario: 75.0, proveedorId: "PROV-012" },
  { nombre: "Extensión eléctrica 5m 4 contactos", unidad: "PIEZA", precioUnitario: 195.0, proveedorId: "PROV-012" },
  { nombre: "Interruptor sencillo", unidad: "PIEZA", precioUnitario: 55.0, proveedorId: "PROV-012" },

  // PROV-014 — Publicidad
  { nombre: "Lona impresa 2x1m", unidad: "PIEZA", precioUnitario: 380.0, proveedorId: "PROV-014" },
  { nombre: "Tríptico informativo x100", unidad: "PAQUETE", precioUnitario: 450.0, proveedorId: "PROV-014" },

  // PROV-015 — Médica
  { nombre: "Guantes de látex caja x100", unidad: "CAJA", precioUnitario: 185.0, proveedorId: "PROV-015" },
  { nombre: "Mascarilla N95 caja x25", unidad: "CAJA", precioUnitario: 420.0, proveedorId: "PROV-015" },
  { nombre: "Termómetro digital", unidad: "PIEZA", precioUnitario: 280.0, proveedorId: "PROV-015" },
  { nombre: "Jeringa desechable 5ml x100", unidad: "CAJA", precioUnitario: 165.0, proveedorId: "PROV-015" },
  { nombre: "Alcohol isopropílico 1L", unidad: "PIEZA", precioUnitario: 95.0, proveedorId: "PROV-015" },

  // PROV-020 — Acabados
  { nombre: "Pintura vinílica blanca 19L", unidad: "PIEZA", precioUnitario: 680.0, proveedorId: "PROV-020" },
  { nombre: "Sellador acrílico 4L", unidad: "PIEZA", precioUnitario: 220.0, proveedorId: "PROV-020" },
];

export const buscarEnCatalogo = (nombre: string): CatalogoArticulo | undefined =>
  DATA_CATALOGO_ARTICULOS.find(
    (a) => a.nombre.toLowerCase() === nombre.toLowerCase(),
  );
