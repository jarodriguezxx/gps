// Zona de variables de prueba
export type Estado = "PENDIENTE" | "AUTORIZADA" | "FINALIZADA";
export type TamanioCompra = "MAYOR" | "MENOR";
export type TipoCompra = "ORDINARIA" | "EXTRAORDINARIA";
// TODO: Investigar bien todas las unidades que se manejan
export type UnidadesArticulos = "PIEZA" | "CAJA" | "PAQUETE";

export type RequisicionesCamposTabla = {
  id: string;
  fecha: Date;
  area: string;
  solicitante: string;
  estado: Estado;
  tamanio: TamanioCompra;
  tipo: TipoCompra;
};

export type Articulos = {
  id: string;
  articuloRequisitado: string;
  unidad: UnidadesArticulos;
  articulosSolicitados: Number;
  articulosEntregados: Number;
  articulosPendientes: Number;
};
export type RequisicionesContenido = {
  articulos: Articulos[];
  justificacion: string;
  responsableArea: string;
  selloRecibido: Boolean;
  firmaDeResponsableArea: Boolean;
  firmaAdminsitradora: Boolean;
  firmaDirectoraGral: Boolean;
};

export type Requisicion = RequisicionesCamposTabla & RequisicionesContenido;

// constantes de prueba

//   Constantes de prueba
export const REQUISICIONES_COMPLETO: Requisicion[] = [
  {
    id: "REQ-2026-001",
    fecha: new Date("2026-04-01T08:30:00"),
    area: "MÉDICA",
    solicitante: "Dr. Armando Paredes",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-001",
        articuloRequisitado: "Guantes de látex",
        unidad: "CAJA",
        articulosSolicitados: 50,
        articulosEntregados: 0,
        articulosPendientes: 50,
      },
      {
        id: "ART-006",
        articuloRequisitado: "Jeringas 5ml",
        unidad: "CAJA",
        articulosSolicitados: 20,
        articulosEntregados: 0,
        articulosPendientes: 20,
      },
      {
        id: "ART-005",
        articuloRequisitado: "Hojas blancas tamaño carta",
        unidad: "PAQUETE",
        articulosSolicitados: 10,
        articulosEntregados: 0,
        articulosPendientes: 10,
      },
      {
        id: "ART-004",
        articuloRequisitado: "Aceite Vegetal 5L",
        unidad: "PIEZA",
        articulosSolicitados: 12,
        articulosEntregados: 12,
        articulosPendientes: 0,
      },
      {
        id: "ART-003",
        articuloRequisitado: "Impermeabilizante 19L",
        unidad: "CAJA",
        articulosSolicitados: 10,
        articulosEntregados: 0,
        articulosPendientes: 10,
      },
    ],
    justificacion: "Abasto mensual para el área de urgencias.",
    responsableArea: "Dr. Julián García",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-002",
    fecha: new Date("2026-04-01T10:15:00"),
    area: "ADMINISTRACIÓN",
    solicitante: "Lic. Sandra Cuevas",
    estado: "AUTORIZADA",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-002",
        articuloRequisitado: "Toner HP 85A",
        unidad: "PIEZA",
        articulosSolicitados: 4,
        articulosEntregados: 0,
        articulosPendientes: 4,
      },
    ],
    justificacion: "Impresión de expedientes administrativos.",
    responsableArea: "C.P. Ricardo Mota",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-003",
    fecha: new Date("2026-04-02T09:00:00"),
    area: "MANTENIMIENTO",
    solicitante: "Ing. Alberto Rojas",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "EXTRAORDINARIA",
    articulos: [
      {
        id: "ART-003",
        articuloRequisitado: "Impermeabilizante 19L",
        unidad: "CAJA",
        articulosSolicitados: 10,
        articulosEntregados: 0,
        articulosPendientes: 10,
      },
    ],
    justificacion: "Reparación urgente por filtraciones en comedor.",
    responsableArea: "Ing. Samuel Ruiz",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-004",
    fecha: new Date("2026-04-02T14:20:00"),
    area: "COCINA",
    solicitante: "Chef Martha Sosa",
    estado: "FINALIZADA",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-004",
        articuloRequisitado: "Aceite Vegetal 5L",
        unidad: "PIEZA",
        articulosSolicitados: 12,
        articulosEntregados: 12,
        articulosPendientes: 0,
      },
    ],
    justificacion: "Insumos para preparación de dietas pacientes.",
    responsableArea: "Nutr. Elena Ríos",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-005",
    fecha: new Date("2026-04-03T11:00:00"),
    area: "PSICOLOGÍA",
    solicitante: "Psic. Kevin Ramos",
    estado: "PENDIENTE",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-005",
        articuloRequisitado: "Hojas blancas tamaño carta",
        unidad: "PAQUETE",
        articulosSolicitados: 10,
        articulosEntregados: 0,
        articulosPendientes: 10,
      },
    ],
    justificacion: "Aplicación de pruebas psicométricas.",
    responsableArea: "Mtra. Elena Ríos",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-006",
    fecha: new Date("2026-04-03T13:45:00"),
    area: "MÉDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "AUTORIZADA",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-006",
        articuloRequisitado: "Jeringas 5ml",
        unidad: "CAJA",
        articulosSolicitados: 20,
        articulosEntregados: 0,
        articulosPendientes: 20,
      },
    ],
    justificacion: "Suministro para área de hospitalización.",
    responsableArea: "Dr. Julián García",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-007",
    fecha: new Date("2026-04-04T08:00:00"),
    area: "LIMPIEZA",
    solicitante: "Sra. Petra López",
    estado: "PENDIENTE",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-007",
        articuloRequisitado: "Cloro concentrado",
        unidad: "PIEZA",
        articulosSolicitados: 20,
        articulosEntregados: 0,
        articulosPendientes: 20,
      },
    ],
    justificacion: "Sanitización de áreas comunes.",
    responsableArea: "Lic. Roberto Meza",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-008",
    fecha: new Date("2026-04-04T12:30:00"),
    area: "ADMISIONES",
    solicitante: "Lic. Roberto Meza",
    estado: "FINALIZADA",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-008",
        articuloRequisitado: "Folder Manila Carta",
        unidad: "PAQUETE",
        articulosSolicitados: 5,
        articulosEntregados: 5,
        articulosPendientes: 0,
      },
    ],
    justificacion: "Organización de nuevos expedientes de ingreso.",
    responsableArea: "Lic. Roberto Meza",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-009",
    fecha: new Date("2026-04-05T10:00:00"),
    area: "MÉDICA",
    solicitante: "Dr. Julián García",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "EXTRAORDINARIA",
    articulos: [
      {
        id: "ART-009",
        articuloRequisitado: "Desfibrilador Portátil",
        unidad: "PIEZA",
        articulosSolicitados: 1,
        articulosEntregados: 0,
        articulosPendientes: 1,
      },
    ],
    justificacion: "Reposición de equipo dañado por descarga eléctrica.",
    responsableArea: "Dr. Julián García",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-010",
    fecha: new Date("2026-04-05T15:20:00"),
    area: "LABORATORIO",
    solicitante: "Quim. Fabiola Luna",
    estado: "AUTORIZADA",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-010",
        articuloRequisitado: "Tubos de ensayo al vacío",
        unidad: "CAJA",
        articulosSolicitados: 30,
        articulosEntregados: 0,
        articulosPendientes: 30,
      },
    ],
    justificacion: "Insumos para tomas de muestra programadas.",
    responsableArea: "Dr. Julián García",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-011",
    fecha: new Date("2026-04-06T09:10:00"),
    area: "TRABAJO SOCIAL",
    solicitante: "Lic. Carmen Ortiz",
    estado: "PENDIENTE",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-011",
        articuloRequisitado: "Bolígrafos tinta negra",
        unidad: "CAJA",
        articulosSolicitados: 2,
        articulosEntregados: 0,
        articulosPendientes: 2,
      },
    ],
    justificacion: "Material de oficina para entrevistas de campo.",
    responsableArea: "Lic. Roberto Meza",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-012",
    fecha: new Date("2026-04-06T11:50:00"),
    area: "SISTEMAS",
    solicitante: "Ing. Carlos Vaca",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "EXTRAORDINARIA",
    articulos: [
      {
        id: "ART-012",
        articuloRequisitado: "Switch 24 puertos",
        unidad: "PIEZA",
        articulosSolicitados: 2,
        articulosEntregados: 0,
        articulosPendientes: 2,
      },
    ],
    justificacion: "Expansión de red para el área de consulta externa.",
    responsableArea: "C.P. Ricardo Mota",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-013",
    fecha: new Date("2026-04-07T08:30:00"),
    area: "MÉDICA",
    solicitante: "Dr. Hugo Sánchez",
    estado: "AUTORIZADA",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-013",
        articuloRequisitado: "Cubrebocas KN95",
        unidad: "CAJA",
        articulosSolicitados: 10,
        articulosEntregados: 0,
        articulosPendientes: 10,
      },
    ],
    justificacion: "Protección personal para consulta de especialidades.",
    responsableArea: "Dr. Julián García",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-014",
    fecha: new Date("2026-04-07T13:00:00"),
    area: "ALMACÉN",
    solicitante: "C. Juan Pérez",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-014",
        articuloRequisitado: "Cinta de embalaje",
        unidad: "PIEZA",
        articulosSolicitados: 20,
        articulosEntregados: 0,
        articulosPendientes: 20,
      },
    ],
    justificacion: "Empaquetado de insumos para envío a clínicas periféricas.",
    responsableArea: "Lic. Roberto Meza",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
  {
    id: "REQ-2026-015",
    fecha: new Date("2026-04-07T16:40:00"),
    area: "DIRECCIÓN",
    solicitante: "Dra. Elena Poniatowska",
    estado: "AUTORIZADA",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
    articulos: [
      {
        id: "ART-015",
        articuloRequisitado: "Café en grano 1kg",
        unidad: "PIEZA",
        articulosSolicitados: 5,
        articulosEntregados: 0,
        articulosPendientes: 5,
      },
    ],
    justificacion: "Insumos para sala de juntas de Dirección General.",
    responsableArea: "Dra. Elena Poniatowska",
    selloRecibido: false,
    firmaDeResponsableArea: false,
    firmaAdminsitradora: false,
    firmaDirectoraGral: false,
  },
];
