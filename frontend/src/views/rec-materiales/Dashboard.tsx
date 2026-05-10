import React, { useState, useEffect } from "react";
import {
  useLocation,
  useNavigate,
  Outlet,
  useParams,
  Navigate,
} from "react-router-dom";
import marakameLogo from "../../assets/marakame.jpeg";
import { ui } from "../../config/theme";
import { ROLES_PERMITIDOS } from "../../types/roles";
import { API_BASE } from "../../config/api";
import { Requisicion } from "../../types/requisicion";

const RecMaterialesDashboard = () => {
  const location = useLocation();
  const { rol } = useParams<{ rol: string }>();
  const navigate = useNavigate();

  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);

  const cargarRequisiciones = async () => {
    try {
      const res = await fetch(`${API_BASE}/requisiciones`);
      const rawText = await res.text();

      let payload: unknown = null;
      try {
        payload = rawText ? JSON.parse(rawText) : null;
      } catch {
        payload = null;
      }

      if (!res.ok) {
        console.error("Error cargando requisiciones:", {
          status: res.status,
          statusText: res.statusText,
          payload,
          rawText,
        });
        setRequisiciones([]);
        return;
      }

      const requisicionesData = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { data?: unknown[] })?.data)
          ? (payload as { data: unknown[] }).data
          : Array.isArray((payload as { requisiciones?: unknown[] })?.requisiciones)
            ? (payload as { requisiciones: unknown[] }).requisiciones
            : [];

      if (!Array.isArray(requisicionesData)) {
        console.error("Respuesta inesperada en /requisiciones:", payload);
        setRequisiciones([]);
        return;
      }

      setRequisiciones(
        requisicionesData.map((r: Requisicion) => ({
          ...r,
          fecha: new Date(r.fecha),
        })),
      );
    } catch (err) {
      console.error("Error cargando requisiciones:", err);
      setRequisiciones([]);
    }
  };

  useEffect(() => {
    cargarRequisiciones();
    // ahí son 2 minutos y 60 segundos (3 minutos)
    //2 * 60 * 1000

    const intervalo = setInterval(cargarRequisiciones, 30 * 1000);
    return () => clearInterval(intervalo);
  }, []);

  const esRolValido = ROLES_PERMITIDOS.includes(rol || "");
  if (!esRolValido) {
    return <Navigate to="/login" replace />;
  }

  const goTo = (path: string) => navigate(`/materiales/${rol}${path}`);

  const isRequisicionesActive =
    location.pathname === `/materiales/${rol}` ||
    location.pathname.includes(`/materiales/${rol}/requisicion`);
  const isProveedoresActive =
    location.pathname === `/materiales/${rol}/proveedores`;
  const isHistorialActive =
    location.pathname === `/materiales/${rol}/historial`;
  return (
    // 1. min-h-screen asegura que el fondo gris cubra todo
    <div className="h-screen bg-slate-100 text-slate-900 flex flex-col select-none overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 flex-1 flex flex-col min-h-0">
        {/* Contenedor Blanco Principal */}
        <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">
          {/* HEADER SUPERIOR (Logo y Usuario) */}
          <header className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 bg-white ">
            <div className="flex items-center gap-3">
              <img
                src={marakameLogo}
                alt="Logo"
                className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
              />
              <div>
                <p className={ui.text.labelGuinda}>Instituto Marakame</p>
                <h1 className={ui.text.h1}>Sistema de Gestión Marakame</h1>
                <p className={ui.text.labelGris}>
                  Módulo de Recursos Materiales
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-slate-300 bg-slate-100" />
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-sm">
                  {rol?.replace("-", " ")}{" "}
                  {/* Convierte 'rec-materiales' en 'rec materiales' */}
                </p>
              </div>
            </div>
          </header>

          {/* CUERPO DEL DASHBOARD (Sidebar + Contenido) */}
          {/* h-full o flex-1 aquí es clave para que crezca hasta el borde inferior del contenedor blanco */}
          <div className="grid flex-1 gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6 bg-white min-h-0 h-full">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner h-fit md:h-full">
              <button
                onClick={() => navigate(`/materiales/${rol}`)}
                className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isRequisicionesActive
                    ? "bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Requisiciones
              </button>
              <button
                onClick={() => goTo("/proveedores")} // Ruta relativa dinámica
                className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isProveedoresActive
                    ? "bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Proveedores
              </button>
              <button
                onClick={() => goTo("/historial")}
                className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isHistorialActive
                    ? "bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Historial
              </button>
            </aside>

            {/* Este es el contenedor que se estirará */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
              <Outlet
                context={{ rol, requisiciones, refrescar: cargarRequisiciones }}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecMaterialesDashboard;
