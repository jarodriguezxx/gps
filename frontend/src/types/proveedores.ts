export type Estatus = "ACTIVO" | "INACTIVO";

export type ContactoProveedor = {
  telefono: string;
  correo: string;
  nombreEncargado: string;
};

export type Proveedores = {
  id: string;
  nombre: string;
  contacto: ContactoProveedor;
  especialidad: string;
  estatus: Estatus;
  rfc: string;
};

export type ProveedorAPI = {
  id: string;
  nombre: string;
  especialidad: string;
  estatus: Estatus;
  rfc: string;
  telefono: string;
  correo: string;
  nombreEncargado: string;
};

export const mapProveedorAPI = (p: ProveedorAPI): Proveedores => ({
  id: p.id,
  nombre: p.nombre,
  especialidad: p.especialidad,
  estatus: p.estatus,
  rfc: p.rfc,
  contacto: {
    telefono: p.telefono,
    correo: p.correo,
    nombreEncargado: p.nombreEncargado,
  },
});
