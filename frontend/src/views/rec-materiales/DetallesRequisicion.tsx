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
    <div className="w-full min-h-screen bg-white flex flex-col m-0 p-2">
      {/* div de la primera mitad de tamaño */}
      <div className="w-full flex flex-col ">
        {/* div de las cabeceras */}
        <div className="flex flex-row justify-between items-center ">
          {/* div de la pimera parte del header */}
          <div className="flex shrink-0 ">
            <h1 className={ui.text.h1}>Requisición</h1>
          </div>
          {/* div de la segunda parte, donde se pondrán los botones */}
          <div className=" flex gap-4 h-full">
            {/* " botones " */}
            <button className={`${ui.buttons.primary} py-2!`}>Enviar</button>
            <button className={`${ui.buttons.primary} py-2!`}>
              Cargar cotizaciones
            </button>
          </div>
        </div>
        {/* Div para las fechas y área solocitante */}
        <div className="flex flex-row mx-2 p-2 w-full gap-14">
          <div className="flex flex-row gap-4   w-full">
            <p className={ui.text.body + " font-bold"}>
              Fecha de la requisicion:
            </p>
            <p className={ui.text.body}>
              {datos?.fecha.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-row gap-4   w-full">
            <p className={ui.text.body + " font-bold"}>Área solicitante:</p>
            <p className={ui.text.body}>{datos?.area}</p>
          </div>
        </div>

        {/* Div para la tabla */}
        <div
          className={`h-[40vh] overflow-auto border border-slate-200 rounded-xl ${ui.table.wrapper}`}
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
      {/* Div de la segunda mitad, que tendrá un scroll */}
      <div className="w-full flex flex-col  mt-4 ">
        <div className="flex flex-col w-full gap-4">
          <p className={ui.text.body + " font-bold"}>
            Justificación de la compra:
          </p>
          {/* Div para hacer el formato de tabla */}
          <div className="w-full flex justify-start items-center bg-gray-200 border border-gray-400 p-2">
            <p className={ui.text.body}>{datos?.justificacion}</p>
          </div>
          {/*  cierre del Div para hacer el formato de tabla */}

          <div className="flex flex-row mx-2 p-2 gap-14">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-4">
                <p className={ui.text.body + " font-bold"}>Quien solicita:</p>
                <p className={ui.text.body}>{datos?.solicitante}</p>
              </div>
              {/* Div para la parte de la firma */}
              <div className="flex bg-white border-t-2 mt-6">
                <p className={ui.text.body + " text-center w-full"}>Firma</p>
              </div>
            </div>
            <div className="flex flex-col gap-4   w-full">
              <div className="flex flex-row gap-4">
                <p className={ui.text.body + " font-bold"}>
                  Responsable del área:
                </p>
                <p className={ui.text.body}>{datos?.responsableArea}</p>
              </div>
              <div className="flex border-t-2 mt-6">
                <p className={ui.text.body + "  w-full text-center"}>Firma</p>
              </div>
            </div>
          </div>
        </div>
        {/* Div para la parte del sello */}
        <div className="mt-6 flex flex-col gap-4 bg-green-200 w-full border-2 justify-start items-start p-4">
          <p className={ui.text.body + " font-bold text-start"}>
            Sello de recibido por el área encargada:
          </p>
          <div className="flex flex-row w-full h-[150px]">
            <div className="w-1/5 border-2 border-dotted bg-green-100"></div>
            {/* Es el div de los textos */}
            <div className="w-full pl-4 gap-6 h-full flex flex-col items-start justify-start">
              <p className={ui.text.body + " font-bold"}>
                Firma del responsable del área encargada de recibir requisición
              </p>
              {/* TODO definir el nombre o de donde se obtendrá el nombre del responsable de esta firma
                  creo se insertará directamente con consulta a la bd sobre el encargado de almacen actual en turno
              */}
              <p className={ui.text.body}>Por definir aún </p>
              <div className="mt-6 w-[250px] flex border-t-2 flex-col items-center justify-center ">
                <p className={ui.text.body}>Firma</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row mx-2 p-2 gap-14">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-4">
                <p className={ui.text.body + " font-bold"}>Firma de la administradora del Instituto:</p>
                {/* TODO consulta a la bd para siempre saber quién es */}
                <p className={ui.text.body}>Por definir aún</p>
              </div>
              {/* Div para la parte de la firma */}
              <div className="flex bg-white border-t-2 mt-6">
                <p className={ui.text.body + " text-center w-full"}>Firma</p>
              </div>
            </div>
            <div className="flex flex-col gap-4   w-full">
              <div className="flex flex-col gap-4">
                <p className={ui.text.body + " font-bold"}>
                  Firma de autorización de la Directora General del Instituto:
                </p>
                {/* TODO consulta a la bd para obtener el dato o que venga impreso  */}
                <p className={ui.text.body}>Por definir aún </p>
              </div>
              <div className="flex border-t-2 mt-6">
                <p className={ui.text.body + "  w-full text-center"}>Firma</p>
              </div>
            </div>
          </div>
      </div>
      {/* Cierre del segundo div */}
    </div> //fin div principal
  );
};

export default DetallesRequisicion;
