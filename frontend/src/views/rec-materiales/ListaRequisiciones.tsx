import React, { useState } from "react";
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
  {
    id: "REQ-005",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-006",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-007",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-008",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-009",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-0010",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-0011",
    fecha: new Date(), // Fecha actual
    area: "MEDICA",
    solicitante: "Enf. Clara Sosa",
    estado: "PENDIENTE",
    tamanio: "MAYOR",
    tipo: "ORDINARIA",
  },
  {
    id: "REQ-0012",
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
  // Constantes de estado
  // Para seleccionar filas
  const [selectedId, setSelected] = useState<string | null>(null);

  // HandleSelect
  const handleRowClick = (id: string) => {
    setSelected(selectedId === id ? null : id);
  };

  return (
    // Contenedor principal
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Contenedor del titulo de la pantalla */}
      <div className="flex shrink-0">
        <h1 className={ui.text.h1}>Requisiciones recibidas</h1>
      </div>

      {/* Contenedor de la tabla en sí */}
      <div
        className={`${ui.table.wrapper} flex-1 overflow-auto border border-slate-200 rounded-xl`}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white shadow-sm">
            <tr>
              <th className={ui.table.header}>Fecha</th>
              <th className={ui.table.header}>Área</th>
              <th className={ui.table.header}>solicitante</th>
              <th className={ui.table.header}>estado</th>
              <th className={ui.table.header}>tamaño</th>
              <th className={ui.table.header}>tipo</th>
            </tr>
          </thead>
          <tbody className="overflow-auto">
            {/* Se mapean todos los elementos recibidos */}
            {/* Entre llaves es para insertar código js */}
            {requisiciones.map((item: RequisicionesCampos) => {
              // Checar si la fila es la seleccionada
              const isSelected = selectedId === item.id;
              const textColor = isSelected ? "text-white" : "text-slate-700";
              return (
                <tr
                  onClick={() => {
                    handleRowClick(item.id);
                  }}
                  key={item.id}
                  className={`
  ${ui.table.row} cursor-pointer 
  ${isSelected ? ui.states.selected : ui.states.default}
`}
                >
                  <td className="pl-4">
                    {item.fecha.toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className={ui.table.cell + " text-center " + textColor}>
                    {item.area}
                  </td>
                  <td className={ui.table.cell + " text-center " + textColor}>
                    {item.solicitante}
                  </td>
                  <td className={ui.table.cell + " text-center " + textColor}>
                    {item.estado}
                  </td>
                  <td className={ui.table.cell + " text-center " + textColor}>
                    {item.tamanio}
                  </td>
                  <td className={ui.table.cell + " text-center " + textColor}>
                    {item.tipo}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Este es el contenedor de los botones de acción */}

      <div className="flex gap-10 justify-center items-center">
        <button
          disabled={!selectedId}
          className={ui.buttons.primary + " w-50 disabled:pointer-events-none"}
        >
          Ver
        </button>
        <button
          disabled={!selectedId}
          className={
            ui.buttons.primary +
            " w-50 not-visited:disabled:pointer-events-none"
          }
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ListaRequisiciones;
