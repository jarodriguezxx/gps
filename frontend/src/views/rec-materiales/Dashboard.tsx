import React from "react";
import { colors, typography, spacing, borders, shadows } from "@/config/theme";
import { useLocation, useNavigate } from "react-router-dom";
import marakameLogo from "../../assets/marakame.jpeg";

const RecMaterialesDashboard = () => {
  //devuelve la ruta sobre la que está esta pantalla
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img
                src={marakameLogo}
                alt="Logo Nayarit Marakame"
                className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">
                  Instituto Marakame
                </p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">
                  Sistema de Gestión Marakame
                </h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                  Módulo de Recursos Materiales
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-slate-300 bg-slate-100" />
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold">Rec. Materiales</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
              <button className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
                Agendar Cita
              </button>
              <button className="w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
                Agregar Paciente
              </button>
            </aside>

            <main className="space-y-5"></main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default RecMaterialesDashboard;
