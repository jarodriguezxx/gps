import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ui } from "../../config/theme";
import { API_BASE } from "../../config/api";
import {
  Proveedores as Proveedor,
  ProveedorAPI,
  mapProveedorAPI,
} from "../../types/proveedores.ts";

type OutletCtx = { rol: string };

type FormState = {
  nombre: string;
  especialidad: string;
  rfc: string;
  telefono: string;
  correo: string;
  nombreEncargado: string;
  estatus: "ACTIVO" | "INACTIVO";
};

const FORM_VACIO: FormState = {
  nombre: "",
  especialidad: "",
  rfc: "",
  telefono: "",
  correo: "",
  nombreEncargado: "",
  estatus: "ACTIVO",
};

const Proveedores = () => {
  const { rol } = useOutletContext<OutletCtx>();
  const esRecMateriales = rol === "rec-materiales";

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [query, setQuery] = useState("");
  const [estatusFiltro, setEstatusFiltro] = useState<"TODOS" | "ACTIVO" | "INACTIVO">("TODOS");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState<Proveedor | null>(null);
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    "X-Rol": rol,
  };

  const cargar = () => {
    setCargando(true);
    fetch(`${API_BASE}/proveedores`)
      .then((r) => r.json())
      .then((data: ProveedorAPI[]) => setProveedores(data.map(mapProveedorAPI)))
      .catch((e) => console.error("Error cargando proveedores:", e))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const proveedoresFiltrados = useMemo(() => {
    const term = query.trim().toLowerCase();
    return proveedores.filter((p) => {
      const coincideTexto =
        term.length === 0 ||
        p.nombre.toLowerCase().includes(term) ||
        p.rfc.toLowerCase().includes(term) ||
        p.contacto.correo.toLowerCase().includes(term) ||
        p.especialidad.toLowerCase().includes(term);
      const coincideEstatus =
        estatusFiltro === "TODOS" || p.estatus === estatusFiltro;
      return coincideTexto && coincideEstatus;
    });
  }, [proveedores, query, estatusFiltro]);

  const abrirCrear = () => {
    setModoEdicion(null);
    setForm(FORM_VACIO);
    setModalAbierto(true);
  };

  const abrirEditar = (p: Proveedor) => {
    setModoEdicion(p);
    setForm({
      nombre: p.nombre,
      especialidad: p.especialidad,
      rfc: p.rfc,
      telefono: p.contacto.telefono,
      correo: p.contacto.correo,
      nombreEncargado: p.contacto.nombreEncargado,
      estatus: p.estatus,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(null);
    setForm(FORM_VACIO);
  };

  const guardar = async () => {
    if (!form.nombre.trim()) return;
    setGuardando(true);
    try {
      const url = modoEdicion
        ? `${API_BASE}/proveedores/${modoEdicion.id}`
        : `${API_BASE}/proveedores`;
      const method = modoEdicion ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });
      if (res.ok) {
        cerrarModal();
        cargar();
      } else {
        console.error("Error al guardar proveedor:", res.status);
      }
    } finally {
      setGuardando(false);
    }
  };

  const toggleEstatus = async (p: Proveedor) => {
    const nuevoEstatus = p.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    const res = await fetch(`${API_BASE}/proveedores/${p.id}/estatus`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ estatus: nuevoEstatus }),
    });
    if (res.ok) cargar();
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
          {esRecMateriales && (
            <button className={ui.buttons.primary} onClick={abrirCrear}>
              + Nuevo Proveedor
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-2 md:grid-cols-[1fr_180px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#7E1D3B]"
            placeholder="Buscar por nombre, RFC, correo o especialidad..."
          />
          <select
            value={estatusFiltro}
            onChange={(e) =>
              setEstatusFiltro(e.target.value as "TODOS" | "ACTIVO" | "INACTIVO")
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
          {cargando ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-500">
              Cargando proveedores...
            </div>
          ) : (
            <table className="w-full border-collapse table-fixed select-text">
              <thead className="sticky top-0 z-10 bg-[#2d5b14]">
                <tr>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">Proveedor</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">RFC</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">Contacto</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">Especialidad</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">Estatus</th>
                  {esRecMateriales && (
                    <th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-white">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {proveedoresFiltrados.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <p className="text-sm font-semibold text-slate-800 wrap-break-word">{p.nombre}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 break-all">{p.rfc}</td>
                    <td className="px-3 py-3">
                      <p className="text-sm text-slate-700">{p.contacto.telefono}</p>
                      <p className="text-sm text-blue-700 break-all">{p.contacto.correo}</p>
                      <p className="text-xs text-slate-500">{p.contacto.nombreEncargado}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700 wrap-break-word">{p.especialidad}</td>
                    <td className="px-3 py-3">
                      <BadgeEstatus estatus={p.estatus} />
                    </td>
                    {esRecMateriales && (
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirEditar(p)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => toggleEstatus(p)}
                            className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                              p.estatus === "ACTIVO"
                                ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {p.estatus === "ACTIVO" ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {proveedoresFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan={esRecMateriales ? 6 : 5}
                      className="px-3 py-10 text-center text-sm text-slate-500"
                    >
                      No hay proveedores que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-base font-bold text-slate-800">
              {modoEdicion ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h2>

            <div className="flex flex-col gap-3">
              {(
                [
                  ["nombre", "Nombre *"],
                  ["rfc", "RFC"],
                  ["especialidad", "Especialidad"],
                  ["telefono", "Teléfono"],
                  ["correo", "Correo"],
                  ["nombreEncargado", "Nombre del encargado"],
                ] as [keyof FormState, string][]
              ).map(([campo, label]) => (
                <div key={campo}>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    {label}
                  </label>
                  <input
                    value={form[campo] as string}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [campo]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#7E1D3B]"
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Estatus
                </label>
                <select
                  value={form.estatus}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estatus: e.target.value as "ACTIVO" | "INACTIVO",
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#7E1D3B]"
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={cerrarModal}
                disabled={guardando}
                className={ui.buttons.neutral}
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando || !form.nombre.trim()}
                className={ui.buttons.primary}
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proveedores;
