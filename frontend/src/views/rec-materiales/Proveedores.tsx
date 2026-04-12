import React, { useMemo, useState } from "react";
import { ui } from "../../config/theme";
import {
  DATA_PROVEEDORES,
  Proveedores as Proveedor,
} from "../../types/proveedores.ts";

const Proveedores = () => {
  const [query, setQuery] = useState("");
  const [estatusFiltro, setEstatusFiltro] = useState<
    "TODOS" | "ACTIVO" | "INACTIVO"
  >("TODOS");

  const proveedoresFiltrados = useMemo(() => {
    const term = query.trim().toLowerCase();

    return DATA_PROVEEDORES.filter((proveedor) => {
      const coincideTexto =
        term.length === 0 ||
        proveedor.id.toLowerCase().includes(term) ||
        proveedor.nombre.toLowerCase().includes(term) ||
        proveedor.rfc.toLowerCase().includes(term) ||
        proveedor.contacto.correo.toLowerCase().includes(term) ||
        proveedor.especialidad.toLowerCase().includes(term);

      const coincideEstatus =
        estatusFiltro === "TODOS" || proveedor.estatus === estatusFiltro;

      return coincideTexto && coincideEstatus;
    });
  }, [query, estatusFiltro]);

  const totalProveedores = DATA_PROVEEDORES.length;
  const totalActivos = DATA_PROVEEDORES.filter(
    (p) => p.estatus === "ACTIVO",
  ).length;

  const getRazonSocial = (nombre: string) => {
    const siglas = nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 8)
      .toUpperCase();
    return `${siglas}-SA-CV`;
  };

  const BadgeEstatus = ({ estatus }: { estatus: Proveedor["estatus"] }) => (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
        estatus === "ACTIVO"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-200 text-slate-700"
      }`}
    >
      {estatus === "ACTIVO" ? "Activo" : "Inactivo"}
    </span>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={ui.text.h1}>Proveedores Autorizados</h1>
          <p className={ui.text.body}>
            Catálogo completo de proveedores del Instituto Marakame
          </p>
        </div>

        <div className="flex gap-2">
          <button className={ui.buttons.neutral}>Exportar</button>
          <button className={ui.buttons.primary}>+ Nuevo Proveedor</button>
        </div>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-xs text-slate-500">Total de Proveedores</p>
          <p className="mt-3 text-2xl font-black text-slate-800">
            {totalProveedores}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Registrados en el sistema
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-xs text-slate-500">Proveedores Activos</p>
          <p className="mt-3 text-2xl font-black text-emerald-700">
            {totalActivos}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Disponibles para cotizar
          </p>
        </div>
      </div> */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-2 md:grid-cols-[1fr_180px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#7E1D3B]"
            placeholder="Buscar por nombre, ID, RFC, correo o especialidad..."
          />

          <select
            value={estatusFiltro}
            onChange={(e) =>
              setEstatusFiltro(
                e.target.value as "TODOS" | "ACTIVO" | "INACTIVO",
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#7E1D3B]"
          >
            <option value="TODOS">Todos los estatus</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden">
          <table className="w-full border-collapse table-fixed select-text">
            <thead className="sticky top-0 z-10 bg-[#2d5b14]">
              <tr>
                <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">
                  ID
                </th>
                <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">
                  Proveedor
                </th>
                <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">
                  RFC
                </th>
                <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">
                  Contacto
                </th>
                <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">
                  Especialidad
                </th>
                <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">
                  Estatus
                </th>
              </tr>
            </thead>

            <tbody>
              {proveedoresFiltrados.map((proveedor) => (
                <tr
                  key={proveedor.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-3 text-sm font-semibold text-slate-700 wrap-break-word">
                    {proveedor.id}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm font-semibold text-slate-800 wrap-break-word">
                      {proveedor.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {getRazonSocial(proveedor.nombre)}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700 break-all">
                    {proveedor.rfc}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm text-slate-700">
                      {proveedor.contacto.telefono}
                    </p>
                    <p className="text-sm text-blue-700 break-all">
                      {proveedor.contacto.correo}
                    </p>
                    <p className="text-xs text-slate-500">
                      {proveedor.contacto.nombreEncargado}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-700 wrap-break-word">
                    {proveedor.especialidad}
                  </td>
                  <td className="px-3 py-3">
                    <BadgeEstatus estatus={proveedor.estatus} />
                  </td>
                </tr>
              ))}

              {proveedoresFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-10 text-center text-sm text-slate-500"
                  >
                    No hay proveedores que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Proveedores;
