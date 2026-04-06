/**
 * CHEAT SHEET - Referencia Rápida de Diseño
 * Copypaste listo para usar en componentes
 */

// ============================================================
// COLORES - COPYPASTE LISTO
// ============================================================

// Color Principal
const PRIMARY = "#7E1D3B"; // Botones, activos
const PRIMARY_DARK = "#63162e"; // Hover, focus
const PRIMARY_LIGHT = "rgba(126, 29, 59, 0.08)";
const PRIMARY_LIGHTER = "rgba(126, 29, 59, 0.12)";

// Grises
const SLATE_900 = "#0f172a"; // Texto fuerte
const SLATE_800 = "#1e293b"; // Texto normal
const SLATE_700 = "#334155"; // Texto secundario
const SLATE_500 = "#64748b"; // Labels
const SLATE_200 = "#e2e8f0"; // Bordes, divisores
const SLATE_100 = "#f1f5f9"; // Background
const SLATE_50 = "#f8fafc"; // Background claro
const WHITE = "#ffffff";

// Estados
const SUCCESS_BG = "#dcfce7"; // emerald-100
const SUCCESS_TEXT = "#166534"; // emerald-800
const SUCCESS_LIGHT = "#16a34a"; // emerald-700
const WARNING_BG = "#fef3c7"; // amber-100
const WARNING_TEXT = "#78350f"; // amber-900
const DANGER_BG = "#ffe4e6"; // rose-100
const DANGER_TEXT = "#9f1239"; // rose-800
const INFO_TEXT = "#0369a1"; // sky-700
const PENDING_BG = "#e2e8f0"; // slate-200
const PENDING_TEXT = "#334155"; // slate-700

// ============================================================
// CLASES TAILWIND - MÁS USADAS
// ============================================================

// CARD ESTÁNDAR
const CARD = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";
const CARD_LARGE = "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

// BOTONES
const BTN_PRIMARY =
  "rounded-lg bg-[#7E1D3B] px-4 py-2.5 font-semibold text-white hover:bg-[#63162e] transition";
const BTN_SECONDARY =
  "rounded-lg border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 font-semibold text-[#7E1D3B] hover:bg-[#7E1D3B]/12";
const BTN_NEUTRAL =
  "rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50";

// INPUTS
const INPUT =
  "w-full rounded-lg border-0 bg-slate-50 px-4 py-3 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]";
const INPUT_SMALL =
  "w-full rounded-lg border-0 bg-slate-50 px-3 py-2 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]";

// LABEL
const LABEL =
  "block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2";

// BADGES DE ESTADO
const BADGE_SUCCESS =
  "rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800";
const BADGE_WARNING =
  "rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900";
const BADGE_DANGER =
  "rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800";
const BADGE_PENDING =
  "rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700";

// TABLAS
const TABLE = "w-full border-collapse text-left text-sm";
const TABLE_HEADER = "border-y border-slate-200 bg-slate-50";
const TABLE_HEADER_CELL =
  "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500";
const TABLE_BODY_ROW = "border-b border-slate-100";
const TABLE_BODY_CELL = "px-3 py-3 text-slate-700";
const TABLE_BODY_CELL_STRONG = "px-3 py-3 font-medium text-slate-700";

// HEADERS
const HEADER_PAGE =
  "text-2xl font-black uppercase tracking-[0.25em] text-slate-800";
const HEADER_SECTION = "text-xl font-black text-slate-900";

// ============================================================
// PROPIEDADES CSS - PARA STYLED COMPONENTS O INLINE
// ============================================================

const CARD_STYLES = {
  borderRadius: "1rem",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  padding: "1rem",
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
};

const PRIMARY_BTN_STYLES = {
  backgroundColor: "#7E1D3B",
  color: "#ffffff",
  padding: "0.625rem 1rem",
  borderRadius: "0.5rem",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s",
  ":hover": {
    backgroundColor: "#63162e",
  },
};

// ============================================================
// EJEMPLOS DE COMPONENTES - COPIA Y PEGA
// ============================================================

// CARD TÍPICA
const CardExample = `
<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
  <p className="mb-4 text-xs font-bold uppercase text-slate-500">
    Título
  </p>
  <p className="mt-2 text-3xl font-black text-slate-900">
    18
  </p>
  <p className="text-sm text-emerald-700">
    +4 vs ayer
  </p>
</div>
`;

// INPUT FORMULARIO
const InputExample = `
<div className="mb-4">
  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
    Usuario
  </label>
  <input
    type="text"
    placeholder="Introduce tu usuario"
    className="w-full rounded-lg border-0 bg-slate-50 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]"
  />
</div>
`;

// BADGE DE ESTADO
const BadgeExample = `
<span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
  Confirmada
</span>
`;

// BOTONES
const ButtonsExample = `
// Primario
<button className="rounded-lg bg-[#7E1D3B] px-4 py-2.5 font-semibold text-white hover:bg-[#63162e]">
  Guardar
</button>

// Secundario
<button className="rounded-lg border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 font-semibold text-[#7E1D3B] hover:bg-[#7E1D3B]/12">
  Cancelar
</button>

// Neutral
<button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
  Acción
</button>
`;

// ============================================================
// PALETA COMPLETA EN TAILWIND CLASES
// ============================================================

const COLORS_TAILWIND = {
  // Primario
  "primary-main": "bg-[#7E1D3B]",
  "primary-dark": "bg-[#63162e]",
  "primary-text": "text-[#7E1D3B]",
  "primary-border": "border-[#7E1D3B]/20",

  // Grises
  "text-strong": "text-slate-900",
  "text-primary": "text-slate-800",
  "text-secondary": "text-slate-700",
  "text-muted": "text-slate-500",
  "bg-primary": "bg-slate-100",
  "bg-secondary": "bg-slate-50",
  "border-light": "border-slate-200",

  // Estados
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-rose-100 text-rose-800",
  pending: "bg-slate-200 text-slate-700",
};

// ============================================================
// ATAJOS PARA COMPONENTES COMUNES
// ============================================================

// Función auxiliar para badges
const getBadgeClass = (status) => {
  const badges = {
    confirmada:
      "rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800",
    "en proceso":
      "rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900",
    pendiente:
      "rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700",
    "no contesto":
      "rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800",
  };
  return badges[status] || badges.pendiente;
};

// Función auxiliar para colores de texto de estado
const getStatusColor = (status) => {
  const colors = {
    confirmada: "text-emerald-700",
    "en proceso": "text-amber-700",
    pendiente: "text-slate-600",
    "no contesto": "text-rose-700",
  };
  return colors[status] || colors.pendiente;
};

// ============================================================
// BREAKPOINTS COMUNES
// ============================================================

const BREAKPOINTS = {
  sm: "640px", // Tablets pequeñas
  md: "768px", // Tablets
  lg: "1024px", // Desktops pequeños
  xl: "1280px", // Desktops
  "2xl": "1536px", // Grandes pantallas
};

// Ejemplos de uso:
// md:flex       - Flex solo en md en adelante
// sm:grid-cols-2 - 2 columnas en sm
// lg:px-8       - Padding diferente en lg

// ============================================================
// ESPACIOS RECOMENDADOS POR ELEMENTO
// ============================================================

const SPACING_GUIDE = {
  "Card padding": "p-4 (input) | p-6 (card)",
  "Gap between items": "gap-3 | gap-4",
  "Margin between sections": "mb-5 (grande) | mb-3 (pequeño)",
  "Header padding": "px-4 py-4 (md:px-6)",
  "Input height": "py-3 (normal) | py-2 (compact)",
  "Table cell padding": "px-3 py-3 (data) | px-3 py-2 (header)",
};

// ============================================================
// IMPORTANCIA: USA TAILWIND, NO STYLES INLINE
// ============================================================

/*
✅ BIEN - Usar clases de Tailwind:
<button className="bg-[#7E1D3B] text-white rounded-lg px-4 py-2 hover:bg-[#63162e]">
  Guardar
</button>

❌ EVITAR - Estilos inline:
<button style={{backgroundColor: '#7E1D3B', ...}}>
  Guardar
</button>

✅ BIEN - Usar variables para reutilizar clases:
const PRIMARY_BUTTON = 'bg-[#7E1D3B] text-white rounded-lg px-4 py-2 hover:bg-[#63162e]';
<button className={PRIMARY_BUTTON}>Guardar</button>

EXCEPCIONES - Estilos dinámicos que cambian:
style={{ height: `${item.valor}%` }}
*/

// ============================================================
// ARCHIVOS DE REFERENCIA
// ============================================================

/*
📄 ARCHIVOS DISPONIBLES:

1. src/config/theme.js
   → Objeto JavaScript exportable para usar en styled-components
   → Importar: import { colors, typography, spacing } from '@/config/theme'

2. src/config/THEME_GUIDE.jsx
   → Ejemplos de componentes React con código
   → Componentes pre-hechos reutilizables

3. src/config/DESIGN_SYSTEM.md
   → Documentación completa en Markdown
   → Tablas, ejemplos, breakpoints, jerarquía

4. src/config/CHEAT_SHEET.js (este archivo)
   → Referencia rápida, copypaste
   → Clases, colores, componentes

USAR ESTOS ARCHIVOS COMO GUÍA Y REFERENCIA
*/

export {
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_LIGHT,
  SLATE_900,
  SLATE_800,
  SLATE_700,
  SLATE_500,
  SLATE_200,
  SLATE_100,
  WHITE,
  SUCCESS_BG,
  SUCCESS_TEXT,
  WARNING_BG,
  WARNING_TEXT,
  DANGER_BG,
  DANGER_TEXT,
  CARD,
  CARD_LARGE,
  BTN_PRIMARY,
  BTN_SECONDARY,
  BTN_NEUTRAL,
  INPUT,
  LABEL,
  BADGE_SUCCESS,
  BADGE_WARNING,
  BADGE_DANGER,
  TABLE,
  TABLE_HEADER,
  TABLE_HEADER_CELL,
  TABLE_BODY_ROW,
  TABLE_BODY_CELL,
  HEADER_PAGE,
  HEADER_SECTION,
  getBadgeClass,
  getStatusColor,
};
