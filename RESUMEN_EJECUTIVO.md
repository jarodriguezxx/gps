# 📋 RESUMEN EJECUTIVO - EXPLORACIÓN MARAKAME

## 🎯 Objetivo de la Exploración
Analizar la estructura del proyecto MARAKAME para encontrar:
1. ✅ Modelos/tablas/servicios relacionados a "protocolo" o "desintoxicacion"
2. ✅ Componentes frontend para protocolos médicos
3. ✅ Estructura de datos de pacientes y cómo se registra el ingreso
4. ✅ Funcionalidad médica implementada
5. ✅ Archivos SQL relevantes

---

## 📊 HALLAZGOS PRINCIPALES

### 1. ¿EXISTE "PROTOCOLO" O "DESINTOXICACION"?

**RESPUESTA: ❌ NO EXISTE**

```
Búsqueda exhaustiva en:
✅ 41 entidades Java (entity/*.java)
✅ Todos los controladores (controller/*.java)
✅ 8 archivos SQL (sql/*.sql)
✅ 11 componentes médicos (views/medico/*.jsx)
✅ Diagrama DBDiagram completo

RESULTADO: 0 coincidencias
```

### 2. ¿CÓMO FUNCIONA ENTONCES?

El proyecto **ASUME UN ÚNICO FLUJO DE TRATAMIENTO** integrado sin una entidad separada llamada "protocolo":

```
FASES INTEGRADAS:
├─ FASE 1 (0-4h):   Valoración Médica
├─ FASE 2 (4-24h):  Historia Médica Completa
├─ FASE 3 (24h):    Planes de Monitoreo (Glucosa/TA)
└─ FASE 4 (1-N):    Notas de Evolución Diarias
```

---

## 🏥 3. ESTRUCTURA DE DATOS DE PACIENTES

### Tabla Principal: `pacientes`
```sql
┌────────────────────────────────────────────────┐
│ pacientes                                      │
├────────────────────────────────────────────────┤
│ id (PK)                                        │
│ nombre_completo                                │
│ edad, sexo, estado_civil                       │
│ sustancia_consumo ◄─── DROGA PRINCIPAL        │
│ estado_paciente ◄─── ENUM (PROSPECTO, etc.)   │
│ clave_paciente ◄─── MK-0001                   │
│ fecha_ingreso ◄─── CUÁNDO INGRESA             │
│ pago_validado, fecha_validacion_pago          │
│ folio_recibo, fecha_registro_recibo            │
│ solicitante_id (quién lo refirió)             │
└────────────────────────────────────────────────┘
```

### Estados del Paciente (Enum)
```
PROSPECTO ──────────► INGRESADO ──────────► EGRESO
(evaluación)      (en tratamiento)        (alta médica)
    │
    └─────────────► DENEGADO
               (rechazo económico)
```

### Cómo Se Registra el Ingreso
```
MOMENTO: Cuando paciente llega y es APTO en valoración médica
ACCIÓN:
  1. estado_paciente = "INGRESADO" (antes: PROSPECTO)
  2. fecha_ingreso = TIMESTAMP (se actualiza de NULL)
  3. clave_paciente = "MK-0001" (se asigna si no existe)
  4. Crear expediente_clinico asociado
  5. Iniciar historia_medica
```

---

## 🏭 4. FUNCIONALIDAD MÉDICA IMPLEMENTADA

### Componentes Frontend (11 en /medico/)

#### ⭐⭐⭐ CRÍTICOS
1. **InicioJefeMedico** - Dashboard con alertas automáticas
2. **ValoracionMedica** - Primera consulta (APTO/RECHAZADO)
3. **HistoriaMedica** - Evaluación 24h en 5 tabs

#### ⭐⭐ IMPORTANTES
4. **ControlMonitoreo** - Glucosa/TA diario
5. **NuevaEvolucion** - Notas de evolución
6. **DetalleExpediente** - Expediente completo del paciente
7. **PacientesActivos** - Listado de ingresados

#### ⭐ COMPLEMENTARIOS
8. **ExpedientesClinicos** - Búsqueda avanzada
9. **Prospectos** - Candidatos sin valorar
10. **FarmaciaMedico** - Requisiciones farmacia
11. **RequisicionesMedico** - Compras

### Servicios Backend (7 principales)
```
HistoriaMedicaController      POST/GET /api/historia-medica
ValoracionMedicaController    POST/GET /api/valoraciones
MonitoreoController           POST/GET /api/monitoreo
NotaEvolucionController       POST/GET /api/notas-evolucion
PacienteController            GET/PATCH /api/pacientes
ExpedienteClinicoController   POST/GET /api/expedientes
PdfService                    generarFormatoMonitoreo()
```

### Tablas de Base de Datos Médicas
```
1. pacientes                (core)
2. valoraciones_medicas     (1era consulta)
3. historia_medica          (24h)
4. expedientes_clinicos     (expediente)
5. notas_evolucion          (diarias)
6. planes_monitoreo         (planes)
7. registros_monitoreo      (mediciones)
8. recibos_pago             (auditoría)
```

---

## ⏰ 5. PATRÓN DE REGISTRO EN PRIMERAS 24 HORAS

### Línea de Tiempo Completa

```
HORA 0 (Llegada)
├─ Registro como PROSPECTO
└─ Asignación de clave_paciente

HORA 0-4 (Valoración Médica)
├─ Interrogatorio completo
├─ Exploración física (TA, FC, FR, Temp, Peso, Talla)
├─ Diagnóstico clínico
└─ Dictamen: APTO/RECHAZADO

HORA 4-12 (Validación de Pago)
├─ Comprobante de pago
├─ Registro en recibos_pago
└─ pago_validado = true

HORA 12-24 (Historia Médica - 5 TABS)
├─ TAB 1: Datos generales + Historia de consumo
├─ TAB 2: Antecedentes (médicos, familiares, sexuales, suicidas)
├─ TAB 3: Interrogatorio por aparatos (cabeza, cardio, gastro, genito, etc.)
├─ TAB 4: Exploración física completa
└─ TAB 5: Examen mental + Diagnóstico

HORA 24 (Planes de Monitoreo)
├─ PLAN 1: Monitoreo de GLUCOSA
│  ├─ Frecuencia (ej: L,M,X,J,V,S,D)
│  ├─ Hora de toma
│  └─ ¿En ayuno? (sí para glucosa)
└─ PLAN 2: Monitoreo de T.A.
   ├─ Frecuencia
   └─ Hora de toma

DIARIAMENTE (Notas de Evolución)
├─ Signos vitales (nuevamente)
├─ Evolución del cuadro clínico
├─ Exploración física (hallazgos nuevos)
├─ Resultados de estudios
├─ Diagnóstico y problemas
├─ Tratamiento e indicaciones
└─ Observaciones
```

---

## 📁 6. ARCHIVOS SQL RELEVANTES

### `2026-05-01_add_estado_paciente_and_recibos.sql` ⭐ CRÍTICO
```sql
-- ENUM para estado del paciente
CREATE TYPE estado_paciente_enum AS ENUM 
  ('PROSPECTO', 'INGRESADO', 'EGRESO');

-- Tabla recibos_pago (auditoría de pagos)
CREATE TABLE recibos_pago (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT NOT NULL REFERENCES pacientes(id),
  numero_recibo VARCHAR(255) UNIQUE,
  monto_pago DECIMAL(10,2),
  monto_programa DECIMAL(10,2),
  estado_pago VARCHAR(50) DEFAULT 'PENDIENTE',
  fecha_pago TIMESTAMP,
  fecha_validacion TIMESTAMP,
  token_generado VARCHAR(255) UNIQUE,
  -- ... más campos
);

-- Columnas añadidas a pacientes
ALTER TABLE pacientes ADD COLUMN
  estado_paciente estado_paciente_enum DEFAULT 'PROSPECTO',
  clave_paciente VARCHAR(255) UNIQUE,
  fecha_ingreso TIMESTAMP;
```

### Otros SQL
- `2025-01-27_formalize_priority_and_tracking.sql` - Prioridades
- `2026-01-27_add_split_name_columns.sql` - Nombres divididos
- `marakame_schema.dbdiagram.io` 📊 - Diagrama visual

---

## 🔍 7. BÚSQUEDA ESPECÍFICA DE PALABRAS CLAVE

### Palabras Clave Buscadas
```
✅ "protocolo"          → 0 coincidencias
✅ "desintoxicacion"    → 0 coincidencias
✅ "monitoreo"          → ENCONTRADO: PlanMonitoreo, RegistroMonitoreo, ControlMonitoreo
✅ "historia medica"    → ENCONTRADO: HistoriaMedica (tabla + componente)
✅ "valoracion"         → ENCONTRADO: ValoracionMedica (tabla + componente)
✅ "abstinencia"        → ENCONTRADO: Solo en alertas de InicioJefeMedico
```

### Alertas de Riesgo Implementadas
```
1. "Ingreso sin sustancia principal"
   → Riesgo de síndrome de abstinencia no tratado

2. "Historia médica no completada en 24h"
   → Pendiente de evaluación

3. "Valoración médica en espera"
   → Prospecto sin evaluar

4. "Plan de monitoreo vencido"
   → Renovar monitoreo
```

---

## 📊 8. ESTADÍSTICAS DEL PROYECTO

```
FRONTEND (MÉDICO):
├─ Componentes: 11 archivos .jsx
├─ Líneas totales: ~7,000+
└─ APIs consumidas: 15+

BACKEND:
├─ Entidades: 41 (7 médicas, 34 otros)
├─ Controllers: 5+ médicos
├─ Services: 7+ médicos
├─ Repositories: 6+ médicos
└─ Líneas Java: ~10,000+

BASE DE DATOS:
├─ Tablas médicas: 8
├─ ENUM types: 1 (estado_paciente)
├─ Migrations: 5
└─ SQL lines: ~500+

TOTAL ARCHIVOS RELEVANTES: 60+
```

---

## ✅ 9. CONCLUSIONES

### Lo que EXISTE:
✅ Sistema completo de gestión clínica  
✅ Flujo integrado de ingreso (PROSPECTO → INGRESADO)  
✅ Valoración médica (APTO/RECHAZADO)  
✅ Historia médica en primeras 24h  
✅ Monitoreo de glucosa y T.A.  
✅ Notas de evolución diarias  
✅ Expedientes clínicos  
✅ Auditoría de pagos  
✅ Alertas automáticas de riesgo  
✅ Dashboard ejecutivo (InicioJefeMedico)  

### Lo que NO EXISTE:
❌ Tabla/entidad `protocolo`  
❌ Tabla/entidad `desintoxicacion`  
❌ Protocolo parametrizable por sustancia  
❌ Plan de medicamentos automatizado  
❌ Protocolo estándar de síndrome de abstinencia  

### Observaciones:
⚠️ El "protocolo" está **implícito** en el flujo integrado  
⚠️ Cada paciente sigue el **mismo flujo** independientemente de la sustancia  
⚠️ El monitoreo es **genérico** (glucosa/TA, no sustancia-específico)  
⚠️ No hay **algoritmo de tratamiento** definido en código  

---

## 💡 10. RECOMENDACIONES

### Si se requiere "Protocolo de Desintoxicación":

#### Opción 1: Implementar como Entidad
```java
@Entity
@Table(name = "protocolos_desintoxicacion")
public class ProtocoloDesintoxicacion {
    private String nombre;           // "Protocolo Alcohol"
    private String sustancia;        // Droga específica
    private Integer duracionDias;    // 28, 60, 90
    private List<String> medicamentos;
    private List<String> monitoreoRequerido;
}
```

#### Opción 2: Parametrizar en historia_medica
```json
{
  "protocoloAsignado": "PROTOCOLO_ALCOHOL_28DIAS",
  "medicamentosIndicados": [...],
  "monitoreoRequerido": ["GLUCOSA", "TA"]
}
```

#### Opción 3: Crear TablaProtocoloPaciente
```sql
CREATE TABLE protocolo_paciente (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT REFERENCES pacientes(id),
    protocolo_id BIGINT REFERENCES protocolos(...),
    fecha_asignacion TIMESTAMP,
    estado VARCHAR(50) -- ACTIVO, COMPLETADO
);
```

---

## 📁 11. ARCHIVOS GENERADOS

Estos 3 documentos se han creado en la raíz del proyecto:

```
c:\MARAKAME\gps\
├─ ANALISIS_MARAKAME_COMPLETO.md      (Análisis detallado)
├─ DIAGRAMA_FLUJO_INGRESO.md          (Diagramas visuales ASCII)
└─ INDICE_ARCHIVOS_MEDICOS.md         (Índice completo)
```

---

## 🎯 RESPUESTAS A PREGUNTAS ORIGINALES

### 1️⃣ "¿Existe un modelo, tabla o servicio relacionado a protocolo o desintoxicacion?"
**RESPUESTA:** ❌ NO. El sistema usa un flujo integrado sin entidad separada.

### 2️⃣ "¿Existe un componente en el frontend para protocolos médicos?"
**RESPUESTA:** ⚠️ PARCIAL. Existen componentes para el flujo (Valoración, Historia, Monitoreo, Evolución) pero no específicamente para "protocolos".

### 3️⃣ "¿Cuál es la estructura de datos de pacientes y cómo se registra el ingreso?"
**RESPUESTA:** ✅ 
- Estado: PROSPECTO → INGRESADO
- Fecha: Se registra en `fecha_ingreso` cuando es APTO
- Identificador: `clave_paciente` (MK-0001)
- Validación: Pago se registra en `recibos_pago`

### 4️⃣ "¿Existe una funcionalidad médica ya implementada?"
**RESPUESTA:** ✅ 
- Valoración inicial (APTO/RECHAZADO)
- Historia médica (24h, 5 tabs)
- Monitoreo físico (glucosa/TA)
- Notas de evolución (diarias)
- Expedientes clínicos

### 5️⃣ "¿Existen archivos SQL relevantes?"
**RESPUESTA:** ✅ 
- `2026-05-01_add_estado_paciente_and_recibos.sql` (CRÍTICO)
- `marakame_schema.dbdiagram.io` (Diagrama completo)
- 5 migrations en total

---

## 📞 PRÓXIMOS PASOS

1. **Revisar documentos generados:**
   - `ANALISIS_MARAKAME_COMPLETO.md` (estructura completa)
   - `DIAGRAMA_FLUJO_INGRESO.md` (flujo visual)
   - `INDICE_ARCHIVOS_MEDICOS.md` (archivo por archivo)

2. **Explorar Frontend:**
   - Iniciar por: `InicioJefeMedico.jsx`
   - Luego: `ValoracionMedica.jsx`
   - Tercero: `HistoriaMedica.jsx`

3. **Explorar Backend:**
   - Estudiar entidades en `entity/`
   - Controllers en `controller/`
   - Services en `service/`

4. **Consultar BD:**
   - Importar `marakame_schema.dbdiagram.io` en dbdiagram.io
   - Entender relaciones entre tablas
   - Revisar migrations SQL

---

**Análisis completado:** 13 Mayo 2026  
**Tiempo de ejecución:** Exploración completa  
**Estado:** ✅ FINALIZADO  
**Conclusión:** Sistema funcional pero sin entidad "protocolo" ni "desintoxicacion" separada.
