/**
 * Configuración centralizada de tema (colores, tipografía, espaciados)
 * Sistema de Gestión Marakame - Instituto de Salud Mental
 *
 * Uso:
 * import { colors, typography, spacing, borders, shadows } from '@/config/theme'
 */

export const colors = {
  // ============= COLORES PRIMARIOS =============
  primary: {
    main: "#7E1D3B", // Color principal (vino/marrón oscuro)
    dark: "#63162e", // Versión oscura para hover/active
    light: "rgba(126, 29, 59, 0.08)", // Versión clara para backgrounds
    lighter: "rgba(126, 29, 59, 0.12)", // Versión aún más clara
    border: "rgba(126, 29, 59, 0.2)", // Para bordes sutiles
  },

  // ============= COLORES SECUNDARIOS =============
  secondary: {
    green: "#1E3A2A", // Verde oscuro (usado en login)
  },

  // ============= GRISES (Tailwind Slate) =============
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

  // ============= COLORES DE ESTADO =============
  status: {
    success: {
      bg: "#dcfce7", // emerald-100
      text: "#166534", // emerald-800
      light: "#16a34a", // emerald-700
    },
    warning: {
      bg: "#fef3c7", // amber-100
      text: "#78350f", // amber-900
      light: "#b45309", // amber-700
    },
    danger: {
      bg: "#ffe4e6", // rose-100
      text: "#9f1239", // rose-800
    },
    info: {
      text: "#0369a1", // sky-700
    },
    pending: {
      bg: "#e2e8f0", // slate-200
      text: "#334155", // slate-700
    },
  },

  // ============= OTROS COLORES FUNCIONALES =============
  borders: "#e2e8f0", // slate-200 para bordes
  background: "#f1f5f9", // slate-100 para fondos secundarios
  white: "#ffffff",

  // ============= GRADIENTES =============
  gradient: {
    donut:
      "conic-gradient(#be123c 0% 45%, #16a34a 45% 72%, #f59e0b 72% 89%, #94a3b8 89% 100%)",
    loginBg: "linear-gradient(to bottom right, #7E1D3B, #1E3A2A)",
    primary: "linear-gradient(to top, #63162e, #7E1D3B)",
    radial:
      "radial-gradient(circle at top right, rgba(126,29,59,0.10), transparent 25%)",
  },
};

// ============= TIPOGRAFÍA =============
export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  fontSize: {
    // Tamaños en píxeles (equivalentes Tailwind)
    xs: "0.75rem", // 12px - Para labels, metadata pequeña
    sm: "0.875rem", // 14px - Para textos secundarios
    base: "1rem", // 16px - Texto normal
    lg: "1.125rem", // 18px - Para subtítulos
    xl: "1.25rem", // 20px - Headers medianos
    "2xl": "1.5rem", // 24px - Headers principales
    "3xl": "1.875rem", // 30px - Headers grandes/indicadores numéricos
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900, // Equivalente a font-black en Tailwind
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  letterSpacing: {
    wider: "0.05em", // tracking-wide
    widest: "0.1em", // tracking-widest (0.25em usado en el proyecto)
    extendedWidest: "0.25em", // Espaciado personalizado del proyecto
  },

  // ============= ESTILOS DE TEXTO PREDEFINIDOS =============
  textStyles: {
    // Headers
    h1: {
      fontSize: "1.5rem", // text-2xl
      fontWeight: 900, // font-black
      lineHeight: 1.2,
      letterSpacing: "0.25em", // tracking-[0.25em]
      textTransform: "uppercase",
    },
    h2: {
      fontSize: "1.25rem", // text-xl
      fontWeight: 900,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.125rem", // text-lg
      fontWeight: 900,
    },

    // Bodys
    bodyLarge: {
      fontSize: "0.875rem", // text-sm
      fontWeight: 400,
    },
    bodyNormal: {
      fontSize: "0.75rem", // text-xs
      fontWeight: 400,
    },

    // Labels
    label: {
      fontSize: "0.75rem", // text-xs
      fontWeight: 700, // font-bold
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },

    // Indicador de conversión
    indicator: {
      fontSize: "1.875rem", // text-3xl
      fontWeight: 900,
    },
  },
};

// ============= ESPACIADO =============
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem", // 48px

  // Padding predefinido para componentes
  padding: {
    cardSmall: "1rem", // p-4 en inputs/fields
    cardMedium: "1.5rem", // p-6
    cardLarge: "2rem", // p-8
  },

  // Gap entre elementos
  gap: {
    tight: "0.5rem", // gap-2
    normal: "1rem", // gap-4
    loose: "1.5rem", // gap-6
  },

  // Márgenes para componentes
  margin: {
    section: "1.25rem", // mb-5 entre secciones
    element: "0.75rem", // mb-3 entre elementos
  },
};

// ============= BORDES Y RADIOS =============
export const borders = {
  radius: {
    sm: "0.375rem", // rounded-md (6px)
    md: "0.5rem", // rounded-lg (8px)
    lg: "0.75rem", // rounded-xl (12px)
    xlarge: "1rem", // rounded-2xl (16px)
    full: "9999px", // rounded-full
  },

  width: {
    thin: "1px",
    normal: "2px",
  },

  color: {
    light: "#e2e8f0", // slate-200
    medium: "#cbd5e1", // slate-300
  },
};

// ============= SOMBRAS =============
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",

  // Shadow específico del proyecto
  cardShadow: "0 12px 30px rgba(15, 23, 42, 0.14)",
};

// ============= TRANSICIONES =============
export const transitions = {
  fast: "0.15s",
  normal: "0.3s",
  slow: "0.5s",
  easing: "ease-in-out",
};

// ============= VARIACIONES DE BOTONES =============
export const buttons = {
  primary: {
    bg: colors.primary.main,
    bgHover: colors.primary.dark,
    text: colors.white,
    border: "transparent",
  },
  secondary: {
    bg: colors.primary.light,
    bgHover: colors.primary.lighter,
    text: colors.primary.main,
    border: `1px solid ${colors.primary.border}`,
  },
  neutral: {
    bg: colors.white,
    bgHover: colors.gray[50],
    text: colors.gray[700],
    border: `1px solid ${colors.borders}`,
  },
};

// ============= BREAKPOINTS (Media Queries) =============
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export default {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
  buttons,
  breakpoints,
};
