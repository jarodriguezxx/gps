# 🎨 Guía de Diseño - Sistema Marakame

Documentación visual de colores, tipografía y espaciado utilizado en el proyecto.

---

## 📋 Contenidos

1. [Paleta de Colores](#-paleta-de-colores)
2. [Tipografía](#-tipografía)
3. [Espaciado](#-espaciado)
4. [Componentes Visuales](#-componentes-visuales)
5. [Uso en Tailwind](#-uso-en-tailwind)
6. [Referencias Rápidas](#-referencias-rápidas)

---

## 🎨 Paleta de Colores

### Color Primario

| Variable | Valor | Uso |
|----------|-------|-----|
| `main` | `#7E1D3B` | Botones activos, estados principales |
| `dark` | `#63162e` | Hover, focus, estados activos |
| `light` | `rgba(126, 29, 59, 0.08)` | Backgrounds suave |
| `lighter` | `rgba(126, 29, 59, 0.12)` | Backgrounds más visibles |
| `border` | `rgba(126, 29, 59, 0.2)` | Bordes sutiles |

**Uso en Tailwind:**
```html
<!-- Background -->
<button class="bg-[#7E1D3B]">Guardar</button>

<!-- Text -->
<p class="text-[#7E1D3B]">Instituto Marakame</p>

<!-- Hover -->
<button class="hover:bg-[#63162e]">Guardar</button>
```

---

### Escala de Grises (Slate)

| Nivel | Valor | Uso |
|-------|-------|-----|
| `900` | `#0f172a` | Texto muy oscuro (máximo contraste) |
| `800` | `#1e293b` | Texto primario |
| `700` | `#334155` | Texto secundario |
| `600` | `#475569` | Texto muted |
| `500` | `#64748b` | Labels, metadata |
| `400` | `#94a3b8` | Bordes, divisores |
| `300` | `#cbd5e1` | Bordes claros |
| `200` | `#e2e8f0` | Bordes, separadores |
| `100` | `#f1f5f9` | Backgrounds claros |
| `50` | `#f8fafc` | Backgrounds muy claros |

**Uso en Tailwind:**
```html
<div class="bg-slate-50 border border-slate-200 text-slate-900">
  Contenido
</div>
```

---

### Colores de Estado

#### ✅ Success (Verde Éxito)
```
Background: #dcfce7 (emerald-100)
Text:       #166534 (emerald-800)
Light:      #16a34a (emerald-700)
```
**Significado:** Confirmada, convertido a cita, registro completado

#### ⚠️ Warning (Ámbar Advertencia)
```
Background: #fef3c7 (amber-100)
Text:       #78350f (amber-900)
Light:      #b45309 (amber-700)
```
**Significado:** Pendiente, en proceso, requiere atención

#### ❌ Danger (Rosa Peligro)
```
Background: #ffe4e6 (rose-100)
Text:       #9f1239 (rose-800)
```
**Significado:** Error, no contestó, rechazo

#### ℹ️ Info (Azul Información)
```
Text: #0369a1 (sky-700)
```
**Significado:** Información adicional, referencia

---

### Usos Especiales

**Color Secundario (Verde oscuro):**
```
#1E3A2A - Usado en login (fondo gradiente)
```

**Fondos:**
```
bg-slate-100    - Fondo secundario general (#f1f5f9)
bg-slate-50     - Fondo claro (#f8fafc)
bg-white        - Fondo blanco (#ffffff)
```

---

## ✍️ Tipografía

### Jerarquía de Tamaños

```
H1 (Heading 1)
├─ Tamaño: 24px (text-2xl)
├─ Peso: 900 (font-black)
├─ Transformación: UPPERCASE
├─ Espaciado: 0.25em (tracking-[0.25em])
└─ Uso: Títulos principales, encabezados de página
   Ejemplo: "Sistema de Gestión Marakame"

H2 (Heading 2)
├─ Tamaño: 20px (text-xl)
├─ Peso: 900 (font-black)
└─ Uso: Títulos de secciones, tablas
   Ejemplo: "Tendencia Semanal de Admisiones"

H3 (Heading 3)
├─ Tamaño: 18px (text-lg)
├─ Peso: 900 (font-black)
└─ Uso: Subtítulos

BODY
├─ Tamaño: 14px (text-sm)
├─ Peso: 400 (font-normal)
└─ Uso: Texto normal, párrafos

SMALL TEXT / LABEL
├─ Tamaño: 12px (text-xs)
├─ Peso: 700 (font-bold o semibold)
├─ Transformación: UPPERCASE
├─ Espaciado: 0.1em - 0.25em (tracking-widest)
└─ Uso: Labels de inputs, instrucciones

INDICATOR (Números grandes)
├─ Tamaño: 30px (text-3xl)
├─ Peso: 900 (font-black)
└─ Uso: Estadísticas, contadores
   Ejemplos: "18", "$184k", "78%"
```

### Pesos de Fuente

| Font Weight | Valor | Uso |
|------------|-------|-----|
| Normal | 400 | Texto de cuerpo |
| Medium | 500 | - |
| Semibold | 600 | Labels, badges pequeños |
| Bold | 700 | Labels importantes |
| Black | 900 | Encabezados |

### Ejemplos de Uso en Tailwind

```html
<!-- Encabezado principal -->
<h1 class="text-2xl font-black uppercase tracking-[0.25em]">
  Sistema de Gestión Marakame
</h1>

<!-- Encabezado secundario -->
<h2 class="text-xl font-black">
  Tendencia Semanal de Admisiones
</h2>

<!-- Label de formulario -->
<label class="text-xs font-bold uppercase tracking-widest text-slate-500">
  Usuario
</label>

<!-- Número indicador -->
<p class="text-3xl font-black text-slate-900">18</p>

<!-- Texto normal -->
<p class="text-sm text-slate-700">Texto de cuerpo</p>

<!-- Texto pequeño/metadata -->
<p class="text-xs text-slate-500">Información adicional</p>
```

---

## 📏 Espaciado

### Sistema de Espaciado (en píxeles)

```
xs:   4px   (0.25rem)
sm:   8px   (0.5rem)
md:   16px  (1rem)
lg:   24px  (1.5rem)
xl:   32px  (2rem)
2xl:  40px  (2.5rem)
3xl:  48px  (3rem)
```

### Padding Típico (Interno)

```
Inputs/Fields pequeños:    p-3  (12px)
Cards/Sections pequeñas:   p-4  (16px)
Cards/Sections medianas:   p-6  (24px)
Cards/Sections grandes:    p-8  (32px)
Headers:                   px-4/px-6 py-4
```

### Gap (Espacio entre elementos)

```
Campos en formulario:    gap-3 o gap-4 (12-16px)
Elementos en grid:       gap-4 (16px)
Secciones grandes:       gap-5 (20px)
Múltiples secciones:     gap-6 (24px)
```

### Márgenes (Externos)

```
Entre secciones principales:    mb-5 (20px)
Entre elementos:                mb-3 o mb-4 (12-16px)
Headers/títulos:                mb-4 (16px)
En tablas (vertical):           py-2 o py-3 (8-12px)
En tablas (horizontal):         px-3 (12px)
```

### Ejemplos de Uso

```html
<!-- Card típica -->
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <!-- Label -->
  <p class="mb-4 text-xs font-bold uppercase text-slate-500">Indicador</p>

  <!-- Número -->
  <p class="mb-2 text-3xl font-black text-slate-900">18</p>

  <!-- Descripción -->
  <p class="text-sm text-emerald-700">+4 vs ayer</p>
</div>

<!-- Grid con gap -->
<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <!-- Items -->
</section>

<!-- Flex con gap -->
<div class="flex items-center gap-3">
  <img src="..." />
  <div>Hello</div>
</div>
```

---

## 🎯 Componentes Visuales

### Card Estándar

```html
<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
  <p class="text-xs font-bold uppercase tracking-widest text-slate-500">
    Título
  </p>
  <p class="mt-2 text-3xl font-black text-slate-900">
    Contenido
  </p>
  <p class="text-sm text-slate-600">
    Descripción
  </p>
</div>
```

### Input/Field

```html
<div class="mb-4">
  <label class="mb-1.5 block text-xs font-bold uppercase text-slate-500">
    Usuario
  </label>
  <input
    type="text"
    placeholder="Introduce tu usuario"
    class="w-full rounded-lg border-0 bg-slate-50 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]"
  />
</div>
```

### Botón Primario

```html
<button class="rounded-lg bg-[#7E1D3B] px-4 py-2.5 font-semibold text-white hover:bg-[#63162e]">
  Guardar
</button>
```

### Botón Secundario

```html
<button class="rounded-lg border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-2.5 font-semibold text-[#7E1D3B] hover:bg-[#7E1D3B]/12">
  Cancelar
</button>
```

### Badge de Estado

```html
<!-- Success -->
<span class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
  Confirmada
</span>

<!-- Warning -->
<span class="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
  En proceso
</span>

<!-- Danger -->
<span class="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800">
  No contestó
</span>
```

### Tabla Estándar

```html
<table class="w-full border-collapse text-left text-sm">
  <thead>
    <tr class="border-y border-slate-200 bg-slate-50">
      <th class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Columna
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-slate-100">
      <td class="px-3 py-3 font-medium text-slate-700">Dato</td>
    </tr>
  </tbody>
</table>
```

---

## 🎨 Uso en Tailwind

### Configuración Actual (`tailwind.config.js`)

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Cómo Extender Tailwind con Colores Custom

Si quieres agregar colores custom a Tailwind:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#7E1D3B',
          dark: '#63162e',
          light: 'rgba(126, 29, 59, 0.08)',
        }
      }
    },
  },
  plugins: [],
}
```

Entonces usar:
```html
<button class="bg-primary-main hover:bg-primary-dark">
  Guardar
</button>
```

### Clases Tailwind Utilizadas Frecuentemente

```
Colores:
├─ text-slate-{50-900}
├─ bg-slate-{50-900}
├─ border-slate-{50-900}
├─ text-emerald-{700,800}
├─ bg-emerald-{100,700}
├─ text-amber-{700,900}
├─ bg-amber-{100}
├─ text-rose-{800}
├─ bg-rose-{100}
└─ text-sky-700

Tamaño de fuente:
├─ text-xs    (12px)
├─ text-sm    (14px)
├─ text-base  (16px)
├─ text-lg    (18px)
├─ text-xl    (20px)
├─ text-2xl   (24px)
└─ text-3xl   (30px)

Peso de fuente:
├─ font-normal    (400)
├─ font-medium    (500)
├─ font-semibold  (600)
├─ font-bold      (700)
└─ font-black     (900)

Espaciado:
├─ p-3, p-4, p-6, p-8      (padding)
├─ m-2, m-3, m-4, m-5, m-6 (margin)
├─ gap-2, gap-3, gap-4, gap-5, gap-6
├─ px-3, py-2, py-3        (padding directional)
└─ mb-2, mb-3, mb-4, mb-5  (margin directional)

Bordes:
├─ border              (1px)
├─ border-{color}      (color)
├─ border-{side}-{px}  (dirección específica)
├─ rounded-lg          (8px)
├─ rounded-xl          (12px)
├─ rounded-2xl         (16px)
├─ rounded-full        (9999px)
└─ border-opacity-{amount}  (rgba con opacity)

Sombras:
├─ shadow-sm
├─ shadow-md
├─ shadow-lg
└─ shadow-2xl
```

---

## 🚀 Referencias Rápidas

### Importar Config de Theme

```javascript
// En un componente
import { colors, typography, spacing, borders, shadows } from '@/config/theme';

// Ver THEME_GUIDE.jsx para ejemplos
```

### Paleta de Colores Completa en Objeto

```javascript
// Primario
#7E1D3B   - Main (botones activos)
#63162e   - Dark (hover)

// Grises
#334155   - slate-700 (texto primario)
#64748b   - slate-500 (labels)
#e2e8f0   - slate-200 (bordes)
#f1f5f9   - slate-100 (backgrounds)

// Estados
#dcfce7 / #166534     - Success
#fef3c7 / #78350f     - Warning
#ffe4e6 / #9f1239     - Danger
```

### Tamaños de Fuente en Píxeles

```
12px (text-xs)   ← Labels
14px (text-sm)   ← Body
16px (text-base) ← Normal
18px (text-lg)
20px (text-xl)   ← Encabezados
24px (text-2xl)  ← H1
30px (text-3xl)  ← Indicadores
```

### Elementos Típicos de Layuout

```
Header:      px-4 py-4 md:px-6  | bg-white/95 border-b shadow-sm
Main:        p-4 md:p-6
Card:        p-4 md:p-6         | rounded-2xl border shadow-sm
Table:       text-sm             | border-collapse
Input:       p-3                 | rounded-lg bg-slate-50 focus:ring-[#7E1D3B]
Button:      px-3 py-2.5 md:px-4 | rounded-lg font-semibold
Badge:       px-2 py-1           | rounded-full text-xs font-semibold
```

---

## 📚 Documentación Relacionada

- **theme.js** - Objeto JavaScript con toda la configuración
- **THEME_GUIDE.jsx** - Ejemplos de componentes con código
- **tailwind.config.js** - Configuración de Tailwind CSS
- **index.css** - Importación de Tailwind

---

**Última actualización:** 2026-04-05
**Proyecto:** Sistema Marakame - Instituto de Salud Mental
