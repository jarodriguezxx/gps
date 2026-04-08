import React, { useState, useEffect } from "react";
import { ui } from "../../config/theme";
import * as tipos from "../../types/requisicion.ts";
import { useParams } from "react-router-dom";

// TODO manejar cuando la url no existe
const DetallesRequisicion = () => {
  // Recuperar el id que está incrustado en la URL
  const { id } = useParams<{ id: string }>();

  // Setear los datos cada que haya un cambio
  const [datos, setDatos] = useState<tipos.Requisicion | null>(null);

  // Una vez que se tiene el id, consultar en la base de datos ese id
  useEffect(
    () => {
      if (id) {
        // TODO línea de consulta a la base de datos
        const datos = tipos.REQUISICIONES_COMPLETO.find(
          (item) => item.id === id,
        );
        setDatos(datos!);
      }
    },
    [id],
    //Si el id cambia, se vuelve a consultar
  );
  const articulos = datos?.articulos;
  let i = 0;

  // En este punto ya se tienen los datos por lo que se procede a llenar cada uno dinámicamente con los datos
  return (
    // Div principal, debe tener altura definida y un ancho
    <div className="w-full min-h-screen bg-white flex flex-col m-0">
      {/* div de la primera mitad de tamaño */}
      <div className="w-full h-[50vh] flex flex-col ">
        {/* div de las cabeceras */}
        <div className="flex flex-row justify-between items-center ">
          {/* div de la pimera parte del header */}
          <div className="flex shrink-0 ">
            <h1 className={ui.text.h1}>Requisición</h1>
          </div>
          {/* div de la segunda parte, donde se pondrán los botones */}
          <div className=" flex gap-4 h-full">
            {/* " botones " */}
            <button className={`${ui.buttons.primary} py-0!`}>Enviar</button>
            <button className={`${ui.buttons.primary} py-0!`}>Cargar cotizaciones</button>
          </div>
        </div>
        {/* Div para las fechas y área solocitante */}
        <div className="flex flex-row mx-2 p-2 w-full gap-14">
          <div className="flex flex-row gap-4   w-full">
            <p className={ui.text.body + " font-bold"}>
              Fecha de la requisicion:
            </p>
            <p>
              {datos?.fecha.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-row gap-4   w-full">
            <p className={ui.text.body + " font-bold"}>Área solicitante:</p>
            <p>{datos?.area}</p>
          </div>
          <div></div>
        </div>

        {/* Div para la tabla */}
        <div
          className={`flex-1 overflow-auto border border-slate-200 rounded-xl ${ui.table.wrapper}`}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#7E1D3B]  shadow-sm">
              <tr>
                <th
                  className={`${ui.states.selected} border-y border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold px-4 py-3 `}
                >
                  No.
                </th>
                <th
                  className={`${ui.states.selected} border-y border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold px-4 py-3 `}
                >
                  articulo requisitado
                </th>
                <th
                  className={`${ui.states.selected} border-y border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold px-4 py-3 `}
                >
                  unidad
                </th>
                <th
                  className={`${ui.states.selected} border-y border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold px-4 py-3 `}
                >
                  solicitados
                </th>
                <th
                  className={`${ui.states.selected} border-y border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold px-4 py-3 `}
                >
                  entregados
                </th>
                <th
                  className={`${ui.states.selected} border-y border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold px-4 py-3 `}
                >
                  PENDIENTES
                </th>
              </tr>
            </thead>
            <tbody className="text-center overflow-auto">
              {articulos?.map((art) => {
                return (
                  <tr
                    key={art.id}
                    className={
                      ui.table.row +
                      " border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }
                  >
                    <td className={ui.table.cell}>{++i}</td>
                    <td className={ui.table.cell}>{art.articuloRequisitado}</td>
                    <td className={ui.table.cell}>{art.unidad}</td>
                    <td className={ui.table.cell}>
                      {String(art.articulosSolicitados)}
                    </td>
                    <td className={ui.table.cell}>
                      {String(art.articulosEntregados)}
                    </td>
                    {/* TODO CHECAR EN QUÉ PARTE SE HACE EL CÁLCULO DE LOS ARTICULOS PENDIENTES */}
                    <td className={ui.table.cell}>
                      {String(art.articulosPendientes)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* cierre del div de la primera mitad */}
    </div> //fin div principal
  );
};

export default DetallesRequisicion;
