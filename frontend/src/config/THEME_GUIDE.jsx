/**
 * GUÍA DE COMPONENTES Y USO DEL TEMA
 * Sistema de Gestión Marakame
 *
 * Este archivo sirve como referencia visual de cómo usar la configuración
 * de colores, tipografía y espaciado en componentes.
 */

// ============================================================
// EJEMPLOS DE USO DEL ARCHIVO theme.js
// ============================================================

import { colors, typography, spacing, borders } from '@/config/theme';

// ============================================================
// 1. USANDO COLORES EN UN COMPONENTE
// ============================================================

export const ButtonExample = () => {
  return (
    <>
      {/* Botón primario */}
      <button style={{
        backgroundColor: colors.primary.main,
        color: colors.white,
        padding: `${spacing.padding.cardSmall}`,
        borderRadius: `${borders.radius.lg}`,
        ':hover': {
          backgroundColor: colors.primary.dark,
        }
      }}>
        Guardar
      </button>

      {/* Badge de estado */}
      <span style={{
        backgroundColor: colors.status.success.bg,
        color: colors.status.success.text,
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: borders.radius.full,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
      }}>
        Confirmada
      </span>
    </>
  );
};

// ============================================================
// 2. USANDO CON TAILWIND CSS (RECOMENDADO EN ESTE PROYECTO)
// ============================================================

// En lugar de usar el objeto directamente, usa Tailwind:
export const FormInputExample = () => {
  return (
    <div>
      {/* Input */}
      <input
        className="w-full px-3 py-3 border-0 bg-slate-50 rounded-lg focus:ring-2 focus:ring-[#7E1D3B] outline-none"
        placeholder="Introduce tu usuario"
      />

      {/* Label */}
      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
        Usuario
      </label>
    </div>
  );
};

// ============================================================
// 3. ESTRUCTURA DE PALETA DE COLORES
// ============================================================

/*
┌─────────────────────────────────────────────────────────┐
│                  PALETA DE COLORES MARAKAME             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  COLOR PRIMARIO: #7E1D3B (Vino/Marrón)                 │
│  ├─ Main:   #7E1D3B  (Estados activos, botones)        │
│  ├─ Dark:   #63162e  (Hover, focus)                    │
│  ├─ Light:  rgba(..., 0.08)  (Backgrounds suave)       │
│  └─ Border: rgba(..., 0.2)   (Bordes sutiles)          │
│                                                         │
│  GRISES (Tailwind Slate):                               │
│  ├─ 900: #0f172a (Texto fuerte)                        │
│  ├─ 800: #1e293b (Texto primario)                      │
│  ├─ 700: #334155 (Texto secundario)                    │
│  ├─ 500: #64748b (Texto muted)                         │
│  ├─ 200: #e2e8f0 (Bordes, divisores)                   │
│  └─ 100: #f1f5f9 (Backgrounds claros)                  │
│                                                         │
│  ESTADOS:                                               │
│  ├─ Success:  #dcfce7 (bg) / #166534 (text)            │
│  ├─ Warning:  #fef3c7 (bg) / #78350f (text)            │
│  ├─ Danger:   #ffe4e6 (bg) / #9f1239 (text)            │
│  └─ Pending:  #e2e8f0 (bg) / #334155 (text)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
*/

// ============================================================
// 4. JERARQUÍA DE TIPOGRAFÍA
// ============================================================

/*
┌─────────────────────────────────────────────────────────┐
│              JERARQUÍA DE TIPOGRAFÍA                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  H1 (Encabezados principales)                          │
│  • Font: 24px / font-black (900)                        │
│  • Uppercase + tracking-widest (0.25em)                │
│  • Uso: Títulos de páginas, secciones                  │
│  Ejemplo: "Sistema de Gestión Marakame"                │
│                                                         │
│  H2 (Encabezados secundarios)                          │
│  • Font: 20px / font-black (900)                        │
│  • Uso: Títulos de tablas, gráficos                    │
│  Ejemplo: "Tendencia Semanal de Admisiones"            │
│                                                         │
│  H3 (Encabezados terciarios)                           │
│  • Font: 18px / font-black (900)                        │
│  • Uso: Subtítulos, headers de secciones              │
│                                                         │
│  BODY (Texto normal)                                    │
│  • Font: 14px / font-normal (400)                       │
│  • Uso: Párrafos, descripciones                        │
│                                                         │
│  SMALL TEXT (Etiquetas, metadata)                       │
│  • Font: 12px / font-semibold (600)                    │
│  • UPPERCASE + tracking-widest                         │
│  • Uso: Labels, instrucciones pequeñas                 │
│  Ejemplo: "CITAS HOY"                                  │
│                                                         │
│  INDICATORS (Números grandes)                           │
│  • Font: 30px / font-black (900)                        │
│  • Uso: Estadísticas, contadores                       │
│  Ejemplo: "18", "$184k", "78%"                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
*/

// ============================================================
// 5. ESPACIADO RECOMENDADO
// ============================================================

/*
┌─────────────────────────────────────────────────────────┐
│         ESPACIADO EN COMPONENTES                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PADDING (Interno)                                      │
│  ├─ Inputs/Fields:    p-3 (12px)                       │
│  ├─ Cards pequeñas:   p-4 (16px)                       │
│  ├─ Cards medianas:   p-6 (24px)                       │
│  └─ Cards grandes:    p-8 (32px)                       │
│                                                         │
│  GAP (Entre elementos)                                  │
│  ├─ Campos en form:   gap-3 o gap-4                    │
│  ├─ Elementos grid:   gap-4                            │
│  ├─ Secciones:        gap-5                            │
│  └─ Major sections:   gap-6                            │
│                                                         │
│  MÁRGENES (Externos)                                    │
│  ├─ Entre secciones:  mb-5 (20px)                      │
│  ├─ Entre elementos:  mb-3 (12px)                      │
│  ├─ Dentro tablas:    py-2 o py-3                      │
│  └─ Headers/texto:    mb-4 (16px)                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
*/

// ============================================================
// 6. BORDES Y RADIOS DE ESQUINA
// ============================================================

/*
┌─────────────────────────────────────────────────────────┐
│         BORDES Y BORDES REDONDEADOS                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BORDER RADIUS:                                         │
│  ├─ Inputs/buttons pequeños:  rounded-lg (8px)         │
│  ├─ Cards/sections:           rounded-xl (12px)        │
│  ├─ Headers grandes:          rounded-2xl (16px)       │
│  └─ Pills/badges:             rounded-full             │
│                                                         │
│  BORDES:                                                │
│  ├─ Color estándar:  border-slate-200 (#e2e8f0)        │
│  ├─ Grosor:          1px (border) o 2px                │
│  ├─ Divisores:       border-slate-100 o 200            │
│  └─ Primario:        border-[#7E1D3B]/20 (sutil)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
*/

// ============================================================
// 7. SOMBRAS PREDEFINIDAS
// ============================================================

/*
┌─────────────────────────────────────────────────────────┐
│                    SOMBRAS                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  shadow-sm:  Cards ligeras, componentes pequeños       │
│  shadow-md:  Botones, elementos interactivos           │
│  shadow-lg:  Modales, overlays                         │
│  shadow-2xl: Headers stories grandes                   │
│                                                         │
│  En el proyecto:                                        │
│  "0 12px 30px rgba(15, 23, 42, 0.14)" - Cards custom   │
│                                                         │
└─────────────────────────────────────────────────────────┘
*/

// ============================================================
// 8. COMPONENTE CARD TÍPICO DEL PROYECTO
// ============================================================

export const CardExample = () => {
  return (
    // rounded-2xl (border radius grande)
    // border border-slate-200 (borde gris claro)
    // bg-white (fondo blanco)
    // p-6 (padding interno - 24px)
    // shadow-sm (sombra ligera)
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Encabezado con label pequeño */}
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
        Indicador
      </p>

      {/* Número grande - indicador */}
      <p className="mb-2 text-3xl font-black text-slate-900">
        18
      </p>

      {/* Descripción secundaria */}
      <p className="text-sm text-emerald-700">
        +4 vs ayer
      </p>

    </div>
  );
};

// ============================================================
// 9. FORMULARIO TÍPICO
// ============================================================

export const FormInputTypical = () => {
  return (
    <div className="mb-4">
      {/* Label */}
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
        Usuario *
      </label>

      {/* Input */}
      <input
        type="text"
        placeholder="Introduce tu usuario"
        className="w-full rounded-lg border-0 bg-slate-50 px-4 py-3 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]"
      />
    </div>
  );
};

// ============================================================
// 10. BADGE DE ESTADO
// ============================================================

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    confirmada: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
    },
    pendiente: {
      bg: 'bg-slate-200',
      text: 'text-slate-700',
    },
    enProceso: {
      bg: 'bg-amber-100',
      text: 'text-amber-900',
    },
    noContesto: {
      bg: 'bg-rose-100',
      text: 'text-rose-800',
    },
  };

  const config = statusConfig[status] || statusConfig.pendiente;

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};

// ============================================================
// 11. TABLA TÍPICA
// ============================================================

export const TableExample = () => {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-y border-slate-200 bg-slate-50">
          <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Columna
          </th>
          <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Otra Columna
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-slate-100">
          <td className="px-3 py-3 font-medium text-slate-700">Dato</td>
          <td className="px-3 py-3">Otro Dato</td>
        </tr>
      </tbody>
    </table>
  );
};

// ============================================================
// 12. GRADIENTES UTILIZADOS
// ============================================================

export const GradientExamples = () => {
  return (
    <>
      {/* Gradiente primario (botones del gráfico de barras) */}
      <div
        style={{
          background: 'linear-gradient(to top, #63162e, #7E1D3B)',
          height: '100px',
        }}
      />

      {/* Gradiente donut (gráfico circular) */}
      <div
        style={{
          background: 'conic-gradient(#be123c 0% 45%, #16a34a 45% 72%, #f59e0b 72% 89%, #94a3b8 89% 100%)',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
        }}
      />

      {/* Gradiente de fondo (Valoración Diagnóstica) */}
      <div
        style={{
          background: `radial-gradient(circle at top right, rgba(126,29,59,0.10), transparent 25%),
                        linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)`,
          height: '200px',
        }}
      />
    </>
  );
};

// ============================================================
// REFERENCIA RÁPIDA
// ============================================================

/*
IMPORTAR PARA USAR EN COMPONENTES:
─────────────────────────────────

import { colors, typography, spacing, borders, shadows } from '@/config/theme';

// Usar directamente en estilos inline
<div style={{
  backgroundColor: colors.primary.main,
  padding: spacing.padding.cardMedium,
  borderRadius: borders.radius.lg,
}}>

O mejor aún, usa clases de Tailwind:

<div className="bg-[#7E1D3B] p-6 rounded-xl shadow-sm">

NO OLVIDES:
─────────

✓ Usar solo clases de Tailwind para mantener consistencia
✓ Referir a theme.js como documentación/guía
✓ Para colores personalizados, usar bg-[#HEX] en Tailwind
✓ Los archivos CSS están configurados para Tailwind
✓ Extender tailwind.config.js si necesitas añadir colores custom

*/

export default {};
