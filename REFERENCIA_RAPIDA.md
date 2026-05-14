# 🚀 REFERENCIA RÁPIDA - MARAKAME

## ⏱️ FLUJO EN 60 SEGUNDOS

```
PROSPECTO (Llega)
    ↓
VALORACIÓN MÉDICA (0-4h)
    ↓ APTO
INGRESADO (estado actualizado)
    ↓
HISTORIA MÉDICA (4-24h, 5 tabs)
    ↓
PLANES DE MONITOREO (glucosa/TA)
    ↓
NOTAS DE EVOLUCIÓN (diarias)
    ↓
EGRESO (después de 28/60/90 días)
```

---

## 🎯 RUTAS FRONTEND MÉDICAS

| Ruta | Componente | Propósito |
|------|-----------|----------|
| `/medico/inicio-jefe-medico` | InicioJefeMedico.jsx | 🏠 Dashboard + Alertas |
| `/medico/prospectos` | Prospectos.jsx | 👥 Candidatos sin valoración |
| `/medico/valoracion/:id` | ValoracionMedica.jsx | 📋 Primera consult (APTO/NO) |
| `/medico/pacientes` | PacientesActivos.jsx | 🏥 Ingresados |
| `/medico/historia-medica` | HistoriaMedica.jsx | 📖 Historia 24h |
| `/medico/monitoreo/:id` | ControlMonitoreo.jsx | 📊 Glucosa + TA |
| `/medico/evolucion/:id` | NuevaEvolucion.jsx | ✍️ Nota evolución |
| `/medico/expedientes` | ExpedientesClinicos.jsx | 🔍 Búsqueda |
| `/medico/expedientes/:id` | DetalleExpediente.jsx | 📑 Expediente completo |
| `/medico/farmacia` | FarmaciaMedico.jsx | 💊 Requisiciones |
| `/medico/requisiciones` | RequisicionesMedico.jsx | 📦 Compras |

---

## 📊 TABLAS SQL MÉDICAS

| Tabla | PK | FK | Propósito |
|-------|----|----|----------|
| `pacientes` | id | - | Datos del paciente + estado |
| `valoraciones_medicas` | id | paciente_id | 1era valoración |
| `historia_medica` | id | paciente_id | Historia 24h (JSON) |
| `expedientes_clinicos` | id | paciente_id | Expediente del paciente |
| `notas_evolucion` | id | expediente_id | Notas diarias |
| `planes_monitoreo` | id | paciente_id | Plan glucosa/TA |
| `registros_monitoreo` | id | plan_id | Mediciones diarias |
| `recibos_pago` | id | paciente_id | Auditoría pagos |

---

## 🔌 APIS PRINCIPALES

### GET Endpoints
```
GET /api/pacientes                           Todos los pacientes
GET /api/pacientes/:id                       Un paciente
GET /api/pacientes/:id/expediente            Expediente del paciente
GET /api/valoraciones/paciente/:id           Valoración del paciente
GET /api/historia-medica/paciente/:id        Historia del paciente
GET /api/expedientes/:id                     Expediente con notas
GET /api/notas-evolucion/expediente/:id      Todas las notas
GET /api/monitoreo/:id                       Planes + registros
```

### POST Endpoints
```
POST /api/pacientes                          Crear paciente
POST /api/valoraciones                       Guardar valoración
POST /api/historia-medica                    Guardar historia
POST /api/notas-evolucion                    Guardar evolución
POST /api/monitoreo/plan                     Crear plan
POST /api/monitoreo/registro                 Registrar medición
POST /api/expedientes                        Crear expediente
POST /api/recibos-pago                       Registrar recibo
```

### PATCH/PUT Endpoints
```
PATCH /api/pacientes/:id                     Actualizar estado
PATCH /api/monitoreo/plan/:id                Actualizar plan
PATCH /api/notas-evolucion/:id               Actualizar nota
```

---

## 🧬 ENTIDADES JAVA CLAVE

```
Paciente.java
├─ Long id
├─ String nombreCompleto, nombres, apellidoPaterno, apellidoMaterno
├─ EstadoPaciente estadoPaciente (ENUM)
├─ String clavePaciente (unique)
├─ LocalDateTime fechaIngreso
├─ Boolean pagoValidado
├─ String sustanciaConsumo
└─ Solicitante solicitante

ValoracionMedica.java
├─ Long id
├─ Paciente paciente (FK)
├─ LocalDateTime fechaHora
├─ String tipoValoracion (PRESENCIAL/TELEFONICA)
├─ String motivoConsulta, padecimientoActual, sintomasGenerales
├─ String ta, fc, fr, temp, peso, talla
├─ String diagnostico, pronostico, tratamientoSugerido
├─ Boolean esAptoParaIngreso
└─ List<SeguimientoValoracion> seguimientos

HistoriaMedica.java
├─ Long id
├─ Long pacienteId
├─ String diagnosticoFinal
├─ String datosClinicosJson (JSON con estructura completa)
├─ LocalDateTime fechaRegistro
└─ String medicoAsignado

PlanMonitoreo.java
├─ Long id
├─ Long pacienteId
├─ String tipo (GLUCOSA, TA)
├─ LocalDate fechaInicio, fechaFin
├─ LocalTime hora
├─ String dias (L,M,X,J,V,S,D)
├─ Boolean ayuno
└─ Boolean activo

RegistroMonitoreo.java
├─ Long id
├─ PlanMonitoreo plan (FK)
├─ LocalDate fechaToma
├─ LocalTime horaToma
├─ String resultado
└─ String firma

NotaEvolucion.java
├─ Long id
├─ ExpedienteClinico expediente (FK)
├─ String ta, temp, fc, fr, peso, talla
├─ String evolucionCuadroClinico
├─ String exploracionFisica
├─ String diagnosticoProblemas
├─ String tratamientoIndicaciones
├─ LocalDateTime fechaRegistro
└─ String medicoAsignado

ExpedienteClinico.java
├─ Long id
├─ String numeroExpediente (unique)
├─ Paciente paciente (OneToOne)
├─ LocalDateTime fechaApertura
├─ String estado
└─ List<NotaEvolucion> notas
```

---

## 📝 ESTRUCTURA JSON: HistoriaMedica.datosClinicosJson

```json
{
  "datosGenerales": {
    "fecha": "2026-05-13",
    "nombre": "García López",
    "expediente": "MK-0001",
    "edad": 35,
    "sexo": "M",
    "estadoCivil": "Casado",
    "ocupacion": "Ingeniero",
    "escolaridad": "Superior",
    "lugarResidencia": "México D.F."
  },
  
  "historiaConsumo": "Consumo de alcohol por 10 años...",
  
  "antecedentes": {
    "alergias": "Penicilina",
    "enfermedades": "Diabetes tipo 2",
    "quirurgicos": "Ninguno",
    "sexuales": {
      "parejas": 1,
      "venereas": "No",
      "metodos": "Condón"
    },
    "suicidas": {
      "ideas": "No",
      "planes": "No"
    },
    "familiares": {
      "padre": "Fallecido (IAM)",
      "madre": "Viva",
      "hermanos": "2 sanos"
    }
  },
  
  "interrogatorio": {
    "cardio": { "palpitaciones": false, "dolorPrecordial": false },
    "gastro": { "apetito": "Normal", "nauseas": false },
    "signosVitales": {
      "presion": "120/80",
      "frecResp": 16,
      "peso": 75,
      "frecCard": 72,
      "temp": 37,
      "estatura": 175
    }
  },
  
  "exploracionFisica": {
    "habitus": "Normolíneo",
    "cabeza": { "normocefalo": true, "pupilas": "isocóricas" },
    "torax": { "normolineo": true },
    "corazon": { "ritmoRegular": true },
    "abdomen": { "blando": true, "doloroso": false }
  },
  
  "examenMental": {
    "orientado": "Tiempo, lugar, persona",
    "lenguaje": "Coherente",
    "afecto": "Acorde",
    "pensamiento": "Organizado"
  },
  
  "diagnostico": {
    "dx1": "F10.20 - Dependencia al alcohol, remisión completa",
    "dx2": "E11 - Diabetes tipo 2",
    "dx3": "I10 - Hipertensión esencial",
    "plan1": "Desintoxicación supervisada, terapia grupal",
    "plan2": "Monitoreo glucosa diario",
    "plan3": "Control tensión arterial",
    "firmaMedico": "Dr. García López",
    "cedula": "12345678"
  }
}
```

---

## 🔔 ALERTAS AUTOMÁTICAS (Dashboard)

### Generadas por InicioJefeMedico

```
ALERTA 1: Riesgo Clínico (severidad ALTA)
├─ Condición: Ingreso SIN sustancia_consumo
├─ Mensaje: "Riesgo de síndrome de abstinencia no tratado"
├─ Acción: → /medico/expedientes/:id
└─ Impacto: Médico debe investigar

ALERTA 2: Historia Pendiente (severidad MEDIA)
├─ Condición: INGRESADO hace >24h SIN historia_medica
├─ Mensaje: "Historia médica no completada en 24h"
├─ Acción: → /medico/historia-medica
└─ Impacto: Cumplimiento de protocolos

ALERTA 3: Triage Pendiente (severidad BAJA)
├─ Condición: Existen PROSPECTO en espera
├─ Mensaje: "Candidatos en espera de valoración"
├─ Acción: → /medico/prospectos
└─ Impacto: Evaluación inicial

ALERTA 4: Monitoreo Vencido (severidad MEDIA)
├─ Condición: Plan con fecha_fin < hoy
├─ Mensaje: "Plan de monitoreo vencido"
├─ Acción: → /medico/monitoreo/:id
└─ Impacto: Actualizar plan

ESTADÍSTICA: Ocupación (informativo)
├─ Total camas: 40
├─ Ocupadas: 38
├─ % Ocupación: 95%
└─ Pacientes activos: 38 (INGRESADO)
```

---

## 🗂️ ENUM EstadoPaciente

```java
PROSPECTO
├─ Descripción: "Prospecto - En evaluación inicial"
├─ Transición: → INGRESADO (si APTO) o → DENEGADO (si rechazo)
└─ Duración: 0-4 horas

INGRESADO
├─ Descripción: "Paciente ingresado - En tratamiento"
├─ Transición: → EGRESO (alta médica)
└─ Duración: 28-90+ días

EGRESO
├─ Descripción: "Paciente egresado"
└─ Transición: FINAL

DENEGADO
├─ Descripción: "Ingreso denegado por insuficiencia económica"
└─ Transición: FINAL
```

---

## 🎯 CAMPOS CRÍTICOS EN TABLAS

### pacientes (Campos Médicos)
```
estado_paciente     ← PROSPECTO | INGRESADO | EGRESO
clave_paciente      ← Identificador único (MK-0001)
fecha_ingreso       ← TIMESTAMP de APTO
sustancia_consumo   ← Droga principal (riesgo de abstinencia)
pago_validado       ← Boolean (debe ser true)
fecha_validacion_pago ← Cuándo se validó
```

### valoraciones_medicas (Determinante)
```
es_apto_para_ingreso ← BOOLEAN (true=INGRESADO, false=DENEGADO)
diagnostico         ← Diagnóstico clínico
ta, fc, fr, temp    ← Signos vitales iniciales
```

### historia_medica (JSON Gigante)
```
datos_clinicos_json ← Contiene 5 tabs (ver estructura JSON arriba)
diagnostico_final   ← Resumen diagnóstico
fecha_registro      ← Debe estar dentro de 24h
```

### planes_monitoreo (Configuración)
```
tipo                ← GLUCOSA | TA
dias                ← "L,M,X,J,V,S,D"
ayuno               ← true (solo glucosa)
fecha_fin           ← Duración del programa (28, 60, 90 días)
```

---

## ⚡ BÚSQUEDA EXHAUSTIVA - RESULTADO

| Término | Encontrado | Ubicación |
|---------|-----------|-----------|
| protocolo | ❌ NO | - |
| desintoxicacion | ❌ NO | - |
| monitoreo | ✅ SÍ | PlanMonitoreo, RegistroMonitoreo, ControlMonitoreo |
| historia_medica | ✅ SÍ | Tabla + Componente + Entity |
| valoracion | ✅ SÍ | Tabla + Componente + Entity |
| abstinencia | ✅ SÍ | Alertas en InicioJefeMedico |
| ingreso | ✅ SÍ | fecha_ingreso en pacientes |
| sustancia | ✅ SÍ | sustancia_consumo en pacientes |
| estado_paciente | ✅ SÍ | ENUM + campo en pacientes |

---

## 🔥 ARCHIVOS MÁS IMPORTANTES

### Por Importancia:
```
NIVEL 1 (CRÍTICO):
├─ InicioJefeMedico.jsx      ← Entrada al sistema
├─ ValoracionMedica.jsx      ← Determina APTO/RECHAZADO
├─ HistoriaMedica.jsx        ← Evaluación completa 24h
└─ 2026-05-01_add_estado...sql ← Define estado_paciente

NIVEL 2 (IMPORTANTE):
├─ ControlMonitoreo.jsx      ← Planes y registros
├─ NuevaEvolucion.jsx        ← Evoluciones diarias
├─ DetalleExpediente.jsx     ← Visualización completa
└─ marakame_schema.dbdiagram.io ← Estructura BD

NIVEL 3 (COMPLEMENTARIOS):
├─ Paciente.java             ← Modelo core
├─ ValoracionMedica.java     ← Entity
├─ HistoriaMedica.java       ← Entity
├─ ExpedienteClinico.java    ← Entity
└─ PacienteService.java      ← Business logic
```

---

## 📞 CÓMO EXPLORAR

### 1. Empezar por
```
Leer archivos generados:
├─ RESUMEN_EJECUTIVO.md         ← Léelo primero
├─ DIAGRAMA_FLUJO_INGRESO.md    ← Entiende el flujo
└─ INDICE_ARCHIVOS_MEDICOS.md   ← Ubica archivos
```

### 2. Frontend
```
Explorar en orden:
1. /medico/inicio-jefe-medico           (Dashboard)
2. /medico/valoracion                   (1era consulta)
3. /medico/historia-medica              (Evaluación 24h)
4. /medico/monitoreo                    (Monitoreo)
5. /medico/evolucion                    (Evoluciones diarias)
```

### 3. Backend
```
Revisar archivos Java:
1. entity/Paciente.java                 (Modelo core)
2. entity/ValoracionMedica.java         (1era valoración)
3. entity/HistoriaMedica.java           (Historia)
4. controller/ValoracionMedicaController (APIs)
5. service/PacienteService.java         (Lógica)
```

### 4. Base de Datos
```
1. Abrir en https://dbdiagram.io
2. Copiar contenido de marakame_schema.dbdiagram.io
3. Visualizar relaciones
4. Leer comentarios en SQL
```

---

## ⚠️ NOTAS IMPORTANTES

```
⚠️ NO existe "protocolo" como entidad separable
⚠️ El "protocolo" es el flujo integrado completo
⚠️ Cada paciente sigue el MISMO flujo sin variaciones
⚠️ No hay medicina parametrizable por sustancia
⚠️ Monitoreo genérico (glucosa/TA) para todos
⚠️ Alertas solo para RIESGO DE ABSTINENCIA
⚠️ Historia médica debe completarse en 24h
⚠️ Pago debe validarse antes de INGRESADO

✅ Sistema funcional y bien estructurado
✅ Código limpio y bien organizado
✅ APIs RESTful consistentes
✅ BD normalizada correctamente
```

---

**Referencia Rápida - Marakame 2026**
**Última actualización:** 13 Mayo 2026
