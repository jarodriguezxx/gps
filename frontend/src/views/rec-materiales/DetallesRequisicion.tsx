import React, { useState, useEffect, useRef } from "react";
import { ui, colors } from "../../config/theme";
import * as tipos from "../../types/requisicion.ts";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { DATA_PROVEEDORES } from "../../types/proveedores.ts";
// Componentes

interface TarjetaCotizacionProps {
  numero: string;
  titulo: string;
  setCotizaciones: (cantidad: number) => void;
  numCotizaciones: number;
  onArchivoChange: (archivo: File | null) => void;
}

const TarjetaCotizacion = ({
  numero,
  titulo,
  setCotizaciones,
  numCotizaciones,
  onArchivoChange,
}: TarjetaCotizacionProps) => {
  const [archivo, setArchivo] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (archivo === null) {
      console.log("El estado ahora es nulo oficialmente");
    } else {
      console.log("Se ha cargado un archivo nuevo:", archivo.name);
      setCotizaciones(numCotizaciones - 1);
    }
  }, [archivo]); // Este efecto corre cada vez que 'archivo' cambia

  // Método para majear el archivo
  const manejarCambioArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones extras
    const tiposPermitidos = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!tiposPermitidos.includes(file.type)) {
      alert("Solo se permiten archivos PDF o Word");
      return;
    }
    setArchivo(file); //se guarda el objeto file
    onArchivoChange(file);
    if (inputRef.current) {
      inputRef.current.value = ""; //limpiar la referencia al archivo
    }
    console.log(file.name);
  };

  return (
    <div className=" w-full flex gap-6 flex-row justify-between items-center">
      <div
        className={
          "border-slate-400 border bg-gray-200 flex flex-row w-full justify-between items-center rounded-xl p-2"
        }
      >
        {/* Contenedor de la parte izq */}
        <div className="flex w-full flex-row  py-2 gap-4 h-12">
          <div
            className={`h-full aspect-square flex justify-center items-center rounded-full bg-[${colors.primary.main}]`}
          >
            <p className="text-white font-bold text-xs">{numero}</p>
          </div>
          <div className=" w-full  h-full flex flex-col justify-center  gap-2">
            <p className={ui.text.body + " font-bold text-[12px]"}>{titulo}</p>

            <div
              className={`flex w-fit  text-center ${!archivo && "bg-amber-100 border-amber-950 border px-2 "}justify-center rounded-full`}
            >
              <p
                className={`max-w-26 truncate max-h-4 text-center self-center text-[9px] ${!archivo && "text-amber-900 "}`}
              >
                {archivo ? archivo.name : "Pendiente"}
              </p>
            </div>
          </div>
        </div>
        {/* contenedor de la parte derecha */}

        <div className=" flex w-[30%] items-end justify-end  h-full mr-2">
          <input
            type="file"
            ref={inputRef}
            hidden
            onChange={manejarCambioArchivo}
            accept=".pdf,.doc,.docx"
          />
          <button
            onClick={() => {
              if (archivo) {
                setCotizaciones(numCotizaciones + 1);
                setArchivo(null);
                onArchivoChange(null);
                return;
              }
              inputRef.current?.click();
            }}
            className={
              //si no hay archivo, significa que se puede subir
              ui.buttons.primary +
              ` p-0! ${archivo === null ? " bg-green-700 hover:bg-green-700/80!" : " bg-red-700 hover:bg-red-600"}`
            }
          >
            <p className="px-4 py-1 text-[12px] ">
              {archivo ? "Cancelar" : "Subir"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
// TODO manejar cuando la url no existe
const DetallesRequisicion = () => {
  // Recuperar el id que está incrustado en la URL
  const { id } = useParams<{ id: string }>();

  // Setear los datos cada que haya un cambio
  const [datos, setDatos] = useState<tipos.Requisicion | null>(null);
  const [modal, setModal] = useState(false);
  const [cotizaciones, setCotizacion] = useState<number>(3);
  const [archivosCotizaciones, setArchivosCotizaciones] = useState<{
    [key: string]: File | null;
  }>({
    "1": null,
    "2": null,
    "3": null,
  });

  // Función para actualizar un archivo específico
  const actualizarArchivoGlobal = (numero: string, archivo: File | null) => {
    setArchivosCotizaciones((prev) => ({
      ...prev,
      [numero]: archivo,
    }));
  };

  // Esto es para guardar los archivos que se tienen
  const guardarTodo = async () => {
    const formData = new FormData();

    // Agregamos los archivos que no sean nulos al formData
    Object.entries(archivosCotizaciones).forEach(([key, file]) => {
      if (file) {
        formData.append(`cotizacion_${key}`, file);
      }
    });

    // TODO  enviar los datos al servidor, esto es u ejemplo solamente
    try {
      console.log("Enviando archivos...");
      alert("Archivos listos para enviarse al servidor");
    } catch (e: any) {
      console.log("error al subir", e);
    }
  };

  // Una vez que se tiene el id, consultar en la base de datos ese id
  useEffect(
    () => {
      if (id) {
        // TODO línea de consulta a la base de datos
        const datos = tipos.REQUISICIONES_COMPLETO.find(
          (item) => item.id === id,
        );
        // Valida que realmente el id regrese algo
        if (datos) {
          setDatos(datos);

          // Valido si realmente se puede activar el boton para cargar cotizaciones
          //  datos.tipo === "EXTRAORDINARIA" ? setModal(true) : setModal(false);
        } else {
          // TODO hacer la página de error 404
          console.log("Página no encontrada");
        }
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
        <div className="mt-6 flex flex-col gap-4 bg-green-100 w-full border-2 justify-start items-start p-4">
          <p className={ui.text.body + " font-bold text-start"}>
            Sello de recibido por el área encargada:
          </p>
          <div className="flex flex-row w-full h-[150px]">
            <div className="w-1/5 border-2 border-dotted bg-green-50"></div>
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
              <p className={ui.text.body + " font-bold"}>
                Firma de la administradora del Instituto:
              </p>
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

      {/* Implementación de la ventana modal */}
      {modal &&
        createPortal(
          <div className="fixed select-none inset-0 z-30 flex items-center justify-center">
            {/* Fondo oscuro */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Cuerpo del modal */}
            <div className="flex flex-col relative bg-white w-full max-w-[85%] h-[90vh] p-4 rounded-2xl shadow-2xl z-40">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col items-center justify-start pb-2 border-b border-slate-200">
                  <h2
                    className={`${ui.text.h2} text-start w-full`}
                    style={{ color: colors.primary.main }}
                  >
                    Gestión de cotizaciones
                  </h2>
                  <p className={ui.text.body + " text-start w-full"}>
                    Cargue las 3 cotizaciones requeridas y consulte los
                    proveedores autorizados
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    className={ui.buttons.primary}
                    //
                    onClick={guardarTodo}
                  >
                    Guardar cotizaciones
                  </button>
                  {/* TODO el botón de cancelar lo que hace es cerrar el modal, nada más */}
                  <button
                    className={ui.buttons.secondary}
                    onClick={() => setModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="flex flex-1 min-h-0 flex-col items-start justify-start pt-1 gap-2">
                <p className={ui.text.body + " font-bold"}>
                  Cotizaciones requeridas ({cotizaciones})
                </p>
                {/* Contenedor de las tarjetas */}
                <div className=" w-full flex gap-6 flex-row justify-between items-center">
                  <TarjetaCotizacion
                    numero="1"
                    titulo="Cotización 1"
                    setCotizaciones={setCotizacion}
                    numCotizaciones={cotizaciones}
                    onArchivoChange={(file) =>
                      actualizarArchivoGlobal("1", file)
                    }
                  />
                  <TarjetaCotizacion
                    numero="2"
                    titulo="Cotización 2"
                    setCotizaciones={setCotizacion}
                    numCotizaciones={cotizaciones}onArchivoChange={(file) =>
                      actualizarArchivoGlobal("2", file)
                    }
                  />
                  <TarjetaCotizacion
                    numero="3"
                    titulo="Cotización 3"
                    setCotizaciones={setCotizacion}
                    numCotizaciones={cotizaciones}onArchivoChange={(file) =>
                      actualizarArchivoGlobal("3", file)
                    }
                  />
                </div>
                <div className="w-full flex bg-slate-200 h-px" />
                {/* Contenedor padre de la tabla */}
                <div className={`w-full flex-col  p-2 flex-1 min-h-0 flex `}>
                  <p className={ui.text.body + " font-bold"}>
                    Proveedores autorizados
                  </p>
                  {/* Contenedor de la tabla */}
                  <div className="w-full flex-col min-h-0 flex-1  overflow-auto mt-2 border border-slate-200 rounded-xl">
                    <table className=" w-full border-collapse ">
                      <thead className="sticky top-0 bg-green-700 z-10 shadow-sm">
                        <tr className={ui.table.row + " w-full"}>
                          <th
                            className={
                              ui.table.header + " bg-green-700! text-white"
                            }
                          >
                            ID
                          </th>
                          <th
                            className={
                              ui.table.header + " bg-green-700! text-white"
                            }
                          >
                            PROVEEDOR
                          </th>
                          <th
                            className={
                              ui.table.header + " bg-green-700! text-white"
                            }
                          >
                            TELÉFONO
                          </th>
                          <th
                            className={
                              ui.table.header + " bg-green-700! text-white"
                            }
                          >
                            correo
                          </th>
                          <th
                            className={
                              ui.table.header + " bg-green-700! text-white"
                            }
                          >
                            especialidad
                          </th>
                          <th
                            className={
                              ui.table.header + " bg-green-700! text-white"
                            }
                          >
                            Estatus
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center overflow-auto select-text">
                        {DATA_PROVEEDORES.map((prov) => {
                          return (
                            <tr key={prov.id} className={ui.table.row}>
                              <td className={ui.table.cell}>{prov.id}</td>
                              <td className={ui.table.cell}>{prov.nombre}</td>
                              <td className={ui.table.cell}>
                                {prov.contacto.telefono}
                              </td>
                              <td className={ui.table.cell}>
                                {prov.contacto.correo}
                              </td>
                              <td className={ui.table.cell}>
                                {prov.especialidad}
                              </td>
                              <td className={ui.table.cell}>{prov.estatus}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div> //fin div principal
  );
};

export default DetallesRequisicion;
