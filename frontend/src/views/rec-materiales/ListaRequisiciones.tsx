import React from "react";
import { ui } from "../../config/theme";

// Zona de variables de prueba
type Estado = "PENDIENTE" | "AUTORIZADA" | "FINALIZADA";
type TamanioCompra = "MAYOR" | "MENOR";
type TipoCompra = "ORDINARIA" | "EXTRAORDINARIA";

type RequisicionesCampos = {
  id: string;
  fecha: Date;
  area: string;
  solicitante: string;
  estado: Estado;
  tamanio: TamanioCompra;
  tipo: TipoCompra;
};

//   Constantes de prueba
export const REQUISICIONES_PRUEBA: RequisicionesCampos[] = [
  {
    id: "REQ-001",
    fecha: new Date("2026-04-01T09:00:00"),
    area: "MEDICA",
    solicitante: "Dr. Julián García",
    estado: "AUTORIZADA",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-002",
    fecha: new Date("2026-04-03T11:30:00"),
    area: "CLINICA",
    solicitante: "Mtra. Elena Ríos",
    estado: "PENDIENTE",
    tamanio: "MENOR",
    tipo: "EXTRAORDINARIA",
  },
  {
    id: "REQ-003",
    fecha: new Date("2026-04-05T15:45:00"),
    area: "ADMISIONES",
    solicitante: "Lic. Roberto Meza",
    estado: "FINALIZADA",
    tamanio: "MENOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-004",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
];

interface Props {
  requisiciones: RequisicionesCampos[];
}

const ListaRequisiciones = ({ requisiciones }: Props) => {
  return (
    // Contenedor principal
    <div className="flex flex-col gap-4 min-w-full">
      {/* Contenedor del titulo de la pantalla */}
      <div className=" flex">
        <h1 className={ui.text.h1}>Requisiciones recibidas</h1>
      </div>

      {/* Contenedor de la tabla en sí */}
      <div className={ui.table.wrapper}>
        <table className="w-full">
          <thead>
            <tr>
              <th className={ui.table.header}>Fecha</th>
              <th className={ui.table.header}>Área</th>
              <th className={ui.table.header}>solicitante</th>
              <th className={ui.table.header}>estado</th>
              <th className={ui.table.header}>tamaño</th>
              <th className={ui.table.header}>tipo</th>
            </tr>
          </thead>
          <tbody>
            {/* Se mapean todos los elementos recibidos */}
            {/* Entre llaves es para insertar código js */}
            {requisiciones.map((item: RequisicionesCampos) => (
              <tr key={item.id} className={ui.table.row}>
                <td>
                  {item.fecha.toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className={ui.table.cell + ' text-center'}>{item.area}</td>
                <td className={ui.table.cell + ' text-center'}>{item.solicitante}</td>
                <td className={ui.table.cell + ' text-center'}>{item.estado}</td>
                <td className={ui.table.cell + ' text-center'}>{item.tamanio}</td>
                <td className={ui.table.cell + ' text-center'}>{item.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div></div>
    </div>
  );
};

export default ListaRequisiciones;
