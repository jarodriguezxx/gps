import React, { useState, useEffect } from "react";
import { ui } from "../../config/theme";
import * as tipos from "../../types/requisicion.ts";
import { useParams } from "react-router-dom";

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

  // En este punto ya se tienen los datos por lo que se procede a llenar cada uno dinámicamente con los datos
  return (
    // Div principal, debe tener altura definida y un ancho
    <div className="w-full h-full bg-white flex-col m-0 justify-center items-center p-4">
      {/* div de la primera mitad de tamaño */}
      <div className="w-full h-1/2" >
    sdf 
      </div>{/* cierre del div de la primera mitad */}
      
    </div> //fin div principal
  );
};

export default DetallesRequisicion;
