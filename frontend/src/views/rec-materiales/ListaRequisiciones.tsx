import React, { useState, useMemo } from "react";
import { ui } from "../../config/theme";
import * as tipos from "../../types/requisicion.ts";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  requisiciones: tipos.Requisicion[];
}

const ListaRequisiciones = ({ requisiciones }: Props) => {
  //mapeo de las rutas
  const navigate = useNavigate();
  // Validar el rol del usuario
  const { rol } = useParams<{ rol: string }>();
  const requisicionesAMostrar = useMemo(() => {
    // Este console.log servirá para comprobar que ya no se filtra al hacer clic en filas
    console.log("Calculando filtro de requisiciones...");

    if (rol === "rec-materiales") {
      return requisiciones;
    } else {
      const ordinarias = requisiciones.filter(
        (r) => r.tipo === "ORDINARIA" && r.estado !== "PENDIENTE",
      );
      const extraordinarias = requisiciones.filter(
        (r) =>
          r.tipo === "EXTRAORDINARIA" &&
          (r.estado === "AUTORIZADA" || r.estado === "FINALIZADA"),
      );

      return [...ordinarias, ...extraordinarias];
    }
  }, [requisiciones, rol]);

  const obtenerEstiloBadge = (estado: tipos.Estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "AUTORIZADA":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "FINALIZADA":
        return "bg-green-100 text-green-800 border border-green-300";
      case "PRE-AUTORIZADA":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border border-slate-300";
    }
  };

  // TODO se cargarán diferentes requis si es compras-inventario, ya que este solo recibe las autorizadas, por lo que se filtrarán estas

  // Direccionamiento hacia la ventana para ver la requisicion seleccionada
  const goDetalleRequisicion = (id: string) => navigate(`requisicion/${id}`); // Constantes de estado

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
          <thead className="sticky top-0 z-10 bg-white  ">
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
            {requisicionesAMostrar.map((item: tipos.Requisicion) => {
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
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${obtenerEstiloBadge(item.estado)}`}
                    >
                      {item.estado}
                    </span>
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
          // Aseguro que yo sé que siempre se enviará un string al hacer click
          onClick={() => goDetalleRequisicion(selectedId!)}
          disabled={!selectedId}
          className={ui.buttons.primary + " w-50 disabled:pointer-events-none"}
        >
          Ver
        </button>
        {/* <button
          disabled={!selectedId}
          className={
            ui.buttons.primary +
            " w-50 not-visited:disabled:pointer-events-none"
          }
        >
          Enviar
        </button> */}
      </div>
    </div>
  );
};

export default ListaRequisiciones;
