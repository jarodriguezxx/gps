/**
 * Configuración centralizada de tema (Design System Marakame)
 * Incorpora tokens de diseño y clases de utilidad predefinidas.
 */

export const colors = {
  primary: {
    main: "#7E1D3B",
    dark: "#63162e",
    light: "rgba(126, 29, 59, 0.08)",
    lighter: "rgba(126, 29, 59, 0.12)",
    border: "rgba(126, 29, 59, 0.2)",
  },
  secondary: {
    green: "#1E3A2A",
  },
  gray: {
    900: "#0f172a",
    800: "#1e293b",
    700: "#334155",
    600: "#475569",
    500: "#64748b",
    400: "#94a3b8",
    300: "#cbd5e1",
    200: "#e2e8f0",
    100: "#f1f5f9",
    50: "#f8fafc",
  },
  status: {
    success: { bg: "bg-emerald-100", text: "text-emerald-800" },
    warning: { bg: "bg-amber-100", text: "text-amber-900" },
    danger: { bg: "bg-rose-100", text: "text-rose-800" },
    pending: { bg: "bg-slate-200", text: "text-slate-700" },
  },
};

// ============= COMPONENTES UI (CLASES TAILWIND) =============
// Usa estas propiedades en tus className={ui.text.h1}
export const ui = {
  states: {
    selected: "bg-[#7E1D3B] text-white shadow-md",
    default:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  },

  text: {
    // Títulos
    h1: "text-xl font-black text-slate-800 md:text-2xl tracking-tight",
    h2: "text-lg font-black text-slate-800",

    // Labels del Header Marakame
    labelGuinda:
      "text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-medium",
    labelGris:
      "text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold",

    // Textos de apoyo
    body: "text-sm text-slate-600 leading-relaxed",
    helper: "text-xs text-slate-500",
    indicator: "text-3xl font-black text-slate-900",
  },

  buttons: {
    // Botón Guinda Principal
    primary:
      "rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#63162e] active:scale-95 shadow-md disabled:opacity-50",

    // Botón Guinda Claro (Agregar Paciente / Cita)
    secondary:
      "rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 text-sm font-semibold text-[#7E1D3B] hover:bg-[#7E1D3B]/12 transition-all active:scale-95",

    // Botón Blanco/Gris (Inicio / Cancelar)
    neutral:
      "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95",

    // Botón pequeño para tablas
    action:
      "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors",
  },

  layout: {
    card: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
    header:
      "rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden",
    sidebar:
      "rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner",
  },

  table: {
    wrapper: "overflow-x-auto rounded-xl border border-slate-200",
    header:
      "border-y border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold px-4 py-3",
    row: "border-b border-slate-100 transition-colors",
    cell: "px-4 py-3 text-sm text-slate-700",
  },
};
