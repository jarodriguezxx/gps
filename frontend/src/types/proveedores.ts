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

export const DATA_PROVEEDORES: Proveedores[] = [
  {
    id: "PROV-001",
    nombre: "Suministros Industriales del Norte",
    contacto: {
      telefono: "811-234-5678",
      correo: "ventas@sinorte.com",
      nombreEncargado: "Ing. Roberto Garza",
    },
    especialidad: "Ferretería Industrial",
    estatus: "ACTIVO",
    rfc: "SIN920101AA1",
  },
  {
    id: "PROV-002",
    nombre: "Soluciones Tecnológicas Marakame",
    contacto: {
      telefono: "333-987-6543",
      correo: "soporte@marakame.tech",
      nombreEncargado: "Lic. Elena Jiménez",
    },
    especialidad: "Software y TI",
    estatus: "ACTIVO",
    rfc: "STM150520BC2",
  },
  {
    id: "PROV-003",
    nombre: "Papelería y Oficina Central",
    contacto: {
      telefono: "555-123-0000",
      correo: "pedidos@pocentral.mx",
      nombreEncargado: "Carlos Peña",
    },
    especialidad: "Papelería",
    estatus: "INACTIVO",
    rfc: "POC101231TR3",
  },
  {
    id: "PROV-004",
    nombre: "Constructora Delta",
    contacto: {
      telefono: "442-555-8899",
      correo: "obras@delta.com.mx",
      nombreEncargado: "Arq. Samuel Soto",
    },
    especialidad: "Construcción",
    estatus: "ACTIVO",
    rfc: "CDE080808XY4",
  },
  {
    id: "PROV-005",
    nombre: "Limpieza y Mantenimiento Express",
    contacto: {
      telefono: "222-444-3322",
      correo: "contacto@lmexpress.com",
      nombreEncargado: "Martha Domínguez",
    },
    especialidad: "Servicios de Limpieza",
    estatus: "ACTIVO",
    rfc: "LME120404PL5",
  },
  {
    id: "PROV-006",
    nombre: "Seguridad Privada Halcón",
    contacto: {
      telefono: "800-999-0011",
      correo: "gerencia@halconseg.mx",
      nombreEncargado: "Cap. Fernando Ruiz",
    },
    especialidad: "Seguridad",
    estatus: "INACTIVO",
    rfc: "SPH050607JJ6",
  },
  {
    id: "PROV-007",
    nombre: "Transportes y Logística Veloz",
    contacto: {
      telefono: "477-771-2233",
      correo: "logistica@veloz.mx",
      nombreEncargado: "Héctor Valadez",
    },
    especialidad: "Logística",
    estatus: "ACTIVO",
    rfc: "TLV181111MK7",
  },
  {
    id: "PROV-008",
    nombre: "Muebles para Oficina Pro",
    contacto: {
      telefono: "331-002-9988",
      correo: "ventas@mueblespro.com",
      nombreEncargado: "Sofía Martínez",
    },
    especialidad: "Mobiliario",
    estatus: "ACTIVO",
    rfc: "MOP140228HJ8",
  },
  {
    id: "PROV-009",
    nombre: "Aceros y Perfiles de México",
    contacto: {
      telefono: "818-300-4050",
      correo: "ventas@acerosmex.com",
      nombreEncargado: "Ricardo Treviño",
    },
    especialidad: "Siderurgia",
    estatus: "ACTIVO",
    rfc: "APM990101QR9",
  },
  {
    id: "PROV-010",
    nombre: "Químicos Especializados del Bajío",
    contacto: {
      telefono: "442-101-2020",
      correo: "contacto@qebajio.com.mx",
      nombreEncargado: "Dra. Laura Campos",
    },
    especialidad: "Químicos",
    estatus: "INACTIVO",
    rfc: "QEB030303NM0",
  },
  {
    id: "PROV-011",
    nombre: "Uniformes y Textiles Selectos",
    contacto: {
      telefono: "554-321-7766",
      correo: "ventas@uniselect.mx",
      nombreEncargado: "Gabriela Sosa",
    },
    especialidad: "Textiles",
    estatus: "ACTIVO",
    rfc: "UTS110909LK1",
  },
  {
    id: "PROV-012",
    nombre: "Sistemas Eléctricos Integrales",
    contacto: {
      telefono: "999-111-2233",
      correo: "ing@sei-electricos.com",
      nombreEncargado: "Ing. Manuel Poot",
    },
    especialidad: "Electricidad",
    estatus: "ACTIVO",
    rfc: "SEI140707PP2",
  },
  {
    id: "PROV-013",
    nombre: "Servicios de Comedor Gourmet",
    contacto: {
      telefono: "555-667-8899",
      correo: "eventos@gourmet-serv.mx",
      nombreEncargado: "Chef Antonio Briz",
    },
    especialidad: "Catering",
    estatus: "INACTIVO",
    rfc: "SCG101010ZZ3",
  },
  {
    id: "PROV-014",
    nombre: "Impresiones y Publicidad Visual",
    contacto: {
      telefono: "333-444-5555",
      correo: "diseno@visualads.com",
      nombreEncargado: "Javier Méndez",
    },
    especialidad: "Publicidad",
    estatus: "ACTIVO",
    rfc: "IPV160303WW4",
  },
  {
    id: "PROV-015",
    nombre: "Equipos Médicos de Alta Gama",
    contacto: {
      telefono: "800-MED-9900",
      correo: "ventas@med-equipos.mx",
      nombreEncargado: "Dra. Patricia Arreola",
    },
    especialidad: "Médica",
    estatus: "ACTIVO",
    rfc: "EMG131212NN5",
  },
  {
    id: "PROV-016",
    nombre: "Distribuidora de Llantas Continental",
    contacto: {
      telefono: "477-222-3344",
      correo: "servicio@llantas-cont.mx",
      nombreEncargado: "Oscar Luna",
    },
    especialidad: "Automotriz",
    estatus: "ACTIVO",
    rfc: "DLC090505MM6",
  },
  {
    id: "PROV-017",
    nombre: "Asesoría Contable y Fiscal",
    contacto: {
      telefono: "552-111-0099",
      correo: "info@acf-consultores.com",
      nombreEncargado: "C.P. Raúl Martínez",
    },
    especialidad: "Consultoría",
    estatus: "ACTIVO",
    rfc: "ACF070707LL7",
  },
  {
    id: "PROV-018",
    nombre: "Herramientas de Precisión S.A.",
    contacto: {
      telefono: "442-888-7766",
      correo: "pedidos@herraprec.mx",
      nombreEncargado: "Ignacio Vega",
    },
    especialidad: "Maquinaria",
    estatus: "INACTIVO",
    rfc: "HPS121212KK8",
  },
  {
    id: "PROV-019",
    nombre: "Sistemas de Riego Modernos",
    contacto: {
      telefono: "667-123-4455",
      correo: "ventas@riego-mod.com",
      nombreEncargado: "Ing. Jorge Esquer",
    },
    especialidad: "Agricultura",
    estatus: "ACTIVO",
    rfc: "SRM151010JJ9",
  },
  {
    id: "PROV-020",
    nombre: "Pinturas e Impermeabilizantes Pro",
    contacto: {
      telefono: "818-555-6677",
      correo: "ventas@pinturas-pro.mx",
      nombreEncargado: "Beatriz Gallegos",
    },
    especialidad: "Acabados",
    estatus: "ACTIVO",
    rfc: "PIP111111HH0",
  },
];
