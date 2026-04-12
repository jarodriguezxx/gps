import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { REQUISICIONES_COMPLETO, Estado } from "../../types/requisicion";
import { ui, colors } from "../../config/theme";

const Historial = () => {
  const navigate = useNavigate();
  const { rol } = useParams<{ rol: string }>();

  // Estado de filtros y búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<Estado | "TODOS">("TODOS");
  const [filtroArea, setFiltroArea] = useState("TODOS");
  const [filtroTamanio, setFiltroTamanio] = useState<string>("TODOS");
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");

  // Obtener áreas únicas
  const areasUnicas = useMemo(() => {
    return Array.from(
      new Set(REQUISICIONES_COMPLETO.map((r) => r.area)),
    ).sort();
  }, []);

  // Filtrar requisiciones
  const requisicionesFiltradas = useMemo(() => {
    return REQUISICIONES_COMPLETO.filter((req) => {
      const cumpleBusqueda =
        busqueda === "" ||
        req.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        req.solicitante.toLowerCase().includes(busqueda.toLowerCase()) ||
        req.area.toLowerCase().includes(busqueda.toLowerCase());

      const cumpleEstado =
        filtroEstado === "TODOS" || req.estado === filtroEstado;
      const cumpleArea = filtroArea === "TODOS" || req.area === filtroArea;
      const cumpleTamanio =
        filtroTamanio === "TODOS" || req.tamanio === filtroTamanio;
      const cumpleTipo = filtroTipo === "TODOS" || req.tipo === filtroTipo;

      return (
        cumpleBusqueda &&
        cumpleEstado &&
        cumpleArea &&
        cumpleTamanio &&
        cumpleTipo
      );
    });
  }, [busqueda, filtroEstado, filtroArea, filtroTamanio, filtroTipo]);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      total: REQUISICIONES_COMPLETO.length,
      pendientes: REQUISICIONES_COMPLETO.filter((r) => r.estado === "PENDIENTE")
        .length,
      autorizadas: REQUISICIONES_COMPLETO.filter(
        (r) => r.estado === "AUTORIZADA",
      ).length,
      finalizadas: REQUISICIONES_COMPLETO.filter(
        (r) => r.estado === "FINALIZADA",
      ).length,
    };
  }, []);

  // Badge de estado con colores
  const obtenerEstiloBadge = (estado: Estado) => {
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

  // Navegar a detalles
  const irADetalles = (id: string) => {
    navigate(`/${rol}/requisicion/${id}`);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-2xl">
      {/* ENCABEZADO CON ESTADÍSTICAS */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-white to-slate-50 px-2 pb-5">
        <h2 className={ui.text.h2}>Historial de Requisiciones</h2>

        {/* Tarjetas de Estadísticas */}
        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">Total</p>
            <p className="mt-2 text-2xl font-black text-slate-800">
              {stats.total}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">Pendientes</p>
            <p className="mt-2 text-2xl font-black text-yellow-600">
              {stats.pendientes}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">Autorizadas</p>
            <p className="mt-2 text-2xl font-black text-blue-600">
              {stats.autorizadas}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs text-slate-500">Finalizadas</p>
            <p className="mt-2 text-2xl font-black text-green-600">
              {stats.finalizadas}
            </p>
          </div>
        </div>
      </div>

      {/* BUSCADOR Y FILTROS */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        {/* Búsqueda principal */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por ID, solicitante o área..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm placeholder-slate-400 focus:border-[#7E1D3B] focus:outline-none focus:ring-2 focus:ring-[#7E1D3B] focus:ring-opacity-20"
          />
        </div>

        {/* Filtros */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {/* Estado */}
          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(e.target.value as Estado | "TODOS")
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus:border-[#7E1D3B] focus:outline-none focus:ring-2 focus:ring-[#7E1D3B] focus:ring-opacity-20"
          >
            <option value="TODOS">Estado: Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="AUTORIZADA">Autorizada</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="PRE-AUTORIZADA">Pre-Autorizada</option>
          </select>

          {/* Área */}
          <select
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus:border-[#7E1D3B] focus:outline-none focus:ring-2 focus:ring-[#7E1D3B] focus:ring-opacity-20"
          >
            <option value="TODOS">Área: Todas</option>
            {areasUnicas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Tamaño */}
          <select
            value={filtroTamanio}
            onChange={(e) => setFiltroTamanio(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus:border-[#7E1D3B] focus:outline-none focus:ring-2 focus:ring-[#7E1D3B] focus:ring-opacity-20"
          >
            <option value="TODOS">Tamaño: Todos</option>
            <option value="MAYOR">Mayor</option>
            <option value="MENOR">Menor</option>
          </select>

          {/* Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus:border-[#7E1D3B] focus:outline-none focus:ring-2 focus:ring-[#7E1D3B] focus:ring-opacity-20"
          >
            <option value="TODOS">Tipo: Todos</option>
            <option value="ORDINARIA">Ordinaria</option>
            <option value="EXTRAORDINARIA">Extraordinaria</option>
          </select>
        </div>
      </div>

      {/* TABLA DE REQUISICIONES */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <table className="w-full border-collapse table-fixed">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <th className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-600 w-[10%]">
                ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-600 w-[12%]">
                Fecha
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-600 w-[15%]">
                Solicitante
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase text-slate-600 w-[12%]">
                Área
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase text-slate-600 w-[10%]">
                Estado
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase text-slate-600 w-[10%]">
                Tamaño
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase text-slate-600 w-[12%]">
                Tipo
              </th>
              <th className="px-3 py-3 text-center text-xs font-bold uppercase text-slate-600 w-[9%]">
                Artículos
              </th>
            </tr>
          </thead>
          <tbody>
            {requisicionesFiltradas.map((requisicion) => (
              <tr
                key={requisicion.id}
                onClick={() => irADetalles(requisicion.id)}
                className="border-b border-slate-100 hover:bg-gradient-to-r hover:bg-slate-100 hover:bg-opacity-5 cursor-pointer transition-colors"
              >
                <td className="px-3 py-3 text-sm font-semibold text-[#7E1D3B]">
                  {requisicion.id}
                </td>
                <td className="px-3 py-3 text-sm text-slate-700">
                  {new Date(requisicion.fecha).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="px-3 py-3 text-sm text-slate-700 wrap-break-word">
                  {requisicion.solicitante}
                </td>
                <td className="px-3 py-3 text-sm text-slate-700 wrap-break-word">
                  {requisicion.area}
                </td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-bold ${obtenerEstiloBadge(
                      requisicion.estado,
                    )}`}
                  >
                    {requisicion.estado}
                  </span>
                </td>
                <td className="px-3 py-3 text-center text-sm font-medium text-slate-700">
                  {requisicion.tamanio}
                </td>
                <td className="px-3 py-3 text-center text-sm text-slate-600">
                  {requisicion.tipo === "ORDINARIA"
                    ? "Ordinaria"
                    : "Extraordinaria"}
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-slate-100 text-xs font-bold text-[#7E1D3B]">
                    {requisicion.articulos.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requisicionesFiltradas.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                No se encontraron requisiciones
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PIE DE TABLA */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 flex items-center justify-between">
        <p className="text-xs text-slate-600">
          Se muestran{" "}
          <span className="font-bold">{requisicionesFiltradas.length}</span> de{" "}
          <span className="font-bold">{REQUISICIONES_COMPLETO.length}</span>{" "}
          requisiciones
        </p>
        <p className="text-xs text-slate-500">
          Haz clic en una fila para ver detalles
        </p>
      </div>
    </div>
  );
};

export default Historial;
