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
  firmadoResponsableArea: Boolean;
  firmaAdminsitradora: Boolean;
  firmaDirectoraGral: Boolean;
};

export type Requisicion = RequisicionesCamposTabla & RequisicionesContenido;
