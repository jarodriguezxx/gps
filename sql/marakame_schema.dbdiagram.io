// Marakame System - Database Diagram
// Paste this entire content into dbdiagram.io editor

// ==================== CORE ENUMS ====================
Enum user_role {
  admin
  director
  medico
  nutriologo
  trabajador_social
  enfermero
  administrativo
  contador
  gerente_compras
  gerente_rh
}

Enum estado_solicitud {
  pendiente
  en_revision
  aprobada
  rechazada
  archivada
}

Enum estado_paciente {
  activo
  inactivo
  alta
  fallecido
}

Enum estado_ingreso {
  abierto
  cerrado
  suspendido
}

Enum estado_consulta {
  pendiente
  completada
  cancelada
}

Enum estado_requisicion {
  borrador
  solicitada
  aprobada
  ordenada
  recibida
  facturada
}

Enum estado_comprobante {
  borrador
  registrado
  pagado
  cancelado
}

Enum estado_contratacion {
  oferta
  contratado
  activo
  terminado
}

// ==================== CORE TABLES ====================
Table usuarios {
  id int [pk, increment]
  nombre varchar(150) [not null]
  email varchar(150) [unique, not null]
  contrasena_hash varchar(255) [not null]
  rol user_role [not null]
  activo boolean [default: true]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    email
    rol
  }
}

Table pacientes {
  id int [pk, increment]
  numero_expediente varchar(50) [unique, not null]
  nombre varchar(150) [not null]
  apellido_paterno varchar(150) [not null]
  apellido_materno varchar(150)
  fecha_nacimiento date
  sexo char(1)
  tipo_identificacion varchar(20)
  num_identificacion varchar(50) [unique]
  telefono varchar(20)
  celular varchar(20)
  email varchar(150)
  direccion text
  municipio varchar(100)
  estado_paciente estado_paciente [default: 'activo']
  estado_paciente_texto varchar(20)
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_expediente
    num_identificacion
    nombre
  }
}

Table ingresos {
  id int [pk, increment]
  paciente_id int [ref: > pacientes.id, not null]
  numero_ingreso varchar(50) [unique, not null]
  fecha_ingreso date [not null]
  fecha_egreso date
  estado estado_ingreso [default: 'abierto']
  motivo_ingreso text
  ubicacion_actual varchar(100)
  responsable_id int [ref: > usuarios.id]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    numero_ingreso
    estado
    fecha_ingreso
  }
}

// ==================== ADMISIONES TABLES ====================
Table solicitudes_admision {
  id int [pk, increment]
  paciente_id int [ref: > pacientes.id]
  numero_solicitud varchar(50) [unique, not null]
  fecha_solicitud date [not null]
  procedencia varchar(100)
  motivo_solicitud text [not null]
  estado estado_solicitud [default: 'pendiente']
  estado_texto varchar(20)
  solicitante_nombre varchar(150) [not null]
  solicitante_profesion varchar(100)
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_solicitud
    paciente_id
    estado
  }
}

Table expedientes_admisiones {
  id int [pk, increment]
  paciente_id int [ref: > pacientes.id, not null]
  numero_expediente varchar(50) [unique, not null]
  fecha_apertura date [not null]
  estado varchar(20)
  datos_generales json
  antecedentes_medicos text
  antecedentes_familiares text
  antecedentes_sociales text
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    numero_expediente
  }
}

Table evaluaciones_socioeconomicas {
  id int [pk, increment]
  paciente_id int [ref: > pacientes.id, not null]
  ingreso_id int [ref: > ingresos.id]
  evaluador_id int [ref: > usuarios.id]
  fecha_evaluacion date [not null]
  clasificacion_socioeconomica varchar(20)
  ingresos_familiares decimal(12,2)
  numero_dependientes int
  vivienda_tipo varchar(50)
  vivienda_servicios json
  ocupacion varchar(100)
  situacion_laboral varchar(50)
  necesidades_especiales text
  recomendaciones text
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    evaluador_id
  }
}

Table valoraciones_diagnosticas {
  id int [pk, increment]
  paciente_id int [ref: > pacientes.id, not null]
  ingreso_id int [ref: > ingresos.id]
  evaluador_id int [ref: > usuarios.id]
  fecha_valoracion date [not null]
  origen_paciente varchar(100)
  edad_edad int
  edad_meses int
  antecedente_consumo_sustancias boolean
  sustancia_especifica varchar(100)
  tiempo_consumo varchar(100)
  frecuencia_consumo varchar(100)
  ultimo_consumo varchar(100)
  tratamiento_anterior boolean
  tipo_tratamiento varchar(100)
  resultado_tratamiento varchar(100)
  diagnostico_presuntivo text
  evaluacion_clinica text
  recomendacion_tratamiento text
  tiempo_sugerido varchar(100)
  conclusion text
  acuerdo_familiar boolean
  firmante_nombre varchar(150)
  firmante_parentesco varchar(50)
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    evaluador_id
    fecha_valoracion
  }
}

// ==================== MÉDICO TABLES ====================
Table consultas_medicas {
  id int [pk, increment]
  paciente_id int [ref: > pacientes.id, not null]
  ingreso_id int [ref: > ingresos.id]
  medico_id int [ref: > usuarios.id]
  fecha_consulta date [not null]
  hora_consulta time
  motivo_consulta text
  anamnesis text
  examen_fisico text
  diagnostico_clinico text
  plan_tratamiento text
  estado estado_consulta [default: 'pendiente']
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    medico_id
    fecha_consulta
  }
}

Table diagnosticos {
  id int [pk, increment]
  consulta_id int [ref: > consultas_medicas.id, not null]
  codigo_cie10 varchar(10)
  diagnostico_descripcion text
  es_principal boolean [default: true]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    consulta_id
  }
}

Table prescripciones_medicas {
  id int [pk, increment]
  consulta_id int [ref: > consultas_medicas.id, not null]
  paciente_id int [ref: > pacientes.id, not null]
  medicamento varchar(200) [not null]
  dosis varchar(100) [not null]
  frecuencia varchar(100) [not null]
  duracion varchar(100)
  cantidad_total int
  via_administracion varchar(50)
  indicaciones text
  contraindicaciones text
  fecha_vigencia_inicio date
  fecha_vigencia_fin date
  activa boolean [default: true]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    activa
  }
}

// ==================== NUTRIOLOGÍA TABLES ====================
Table evaluaciones_nutricionales {
  id int [pk, increment]
  paciente_id int [ref: > pacientes.id, not null]
  ingreso_id int [ref: > ingresos.id]
  nutriologo_id int [ref: > usuarios.id]
  fecha_evaluacion date [not null]
  peso_inicial decimal(5,2)
  talla decimal(5,2)
  imc decimal(5,2)
  habitos_alimentarios text
  antecedentes_nutricionales text
  resultado_evaluacion text
  diagnostico_nutricional varchar(200)
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    nutriologo_id
  }
}

Table planes_nutricionales {
  id int [pk, increment]
  evaluacion_nutricional_id int [ref: > evaluaciones_nutricionales.id, not null]
  paciente_id int [ref: > pacientes.id, not null]
  fecha_creacion date [not null]
  objetivos_tratamiento text
  macronutrientes json
  micronutrientes json
  alimentos_permitidos json
  alimentos_prohibidos json
  instrucciones text
  seguimiento_frecuencia varchar(50)
  activo boolean [default: true]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    paciente_id
    activo
  }
}

// ==================== COMPRAS TABLES ====================
Table proveedores {
  id int [pk, increment]
  nombre_razon_social varchar(200) [unique, not null]
  nombre_comercial varchar(200)
  rfc varchar(13) [unique]
  curp varchar(18)
  contacto_nombre varchar(150)
  contacto_email varchar(150)
  contacto_telefono varchar(20)
  direccion text [not null]
  ciudad varchar(100)
  estado varchar(100)
  codigo_postal varchar(10)
  activo boolean [default: true]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    nombre_razon_social
    rfc
  }
}

Table articulos_catalogo {
  id int [pk, increment]
  codigo_articulo varchar(50) [unique, not null]
  descripcion varchar(300) [not null]
  categoria varchar(100)
  unidad_medida varchar(20)
  precio_unitario decimal(12,2)
  proveedor_id int [ref: > proveedores.id]
  stock_minimo int [default: 0]
  activo boolean [default: true]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    codigo_articulo
    categoria
  }
}

Table requisiciones {
  id int [pk, increment]
  numero_requisicion varchar(50) [unique, not null]
  fecha_requisicion date [not null]
  solicitante_id int [ref: > usuarios.id]
  departamento varchar(100)
  estado estado_requisicion [default: 'borrador']
  estado_texto varchar(20)
  justificacion text
  presupuesto_estimado decimal(12,2)
  autorizado_por int [ref: > usuarios.id]
  fecha_autorizacion date
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_requisicion
    solicitante_id
    estado
    departamento
  }
}

Table detalles_requisicion {
  id int [pk, increment]
  requisicion_id int [ref: > requisiciones.id, not null]
  articulo_id int [ref: > articulos_catalogo.id]
  descripcion varchar(300)
  cantidad_solicitada decimal(12,2) [not null]
  unidad_medida varchar(20)
  precio_unitario decimal(12,2)
  subtotal decimal(12,2)
  numero_linea int
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    requisicion_id
  }
}

Table ordenes_compra {
  id int [pk, increment]
  numero_orden varchar(50) [unique, not null]
  requisicion_id int [ref: > requisiciones.id, not null]
  proveedor_id int [ref: > proveedores.id, not null]
  fecha_orden date [not null]
  comprador_id int [ref: > usuarios.id]
  fecha_entrega_esperada date
  total_orden decimal(12,2)
  estado varchar(20)
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_orden
    requisicion_id
    proveedor_id
  }
}

Table recepciones_compra {
  id int [pk, increment]
  orden_compra_id int [ref: > ordenes_compra.id, not null]
  fecha_recepcion date [not null]
  recibido_por_id int [ref: > usuarios.id]
  observaciones text
  estado_recepcion varchar(20)
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    orden_compra_id
  }
}

// ==================== RECURSOS MATERIALES ====================
Table almacenes {
  id int [pk, increment]
  codigo_almacen varchar(50) [unique, not null]
  nombre varchar(150) [not null]
  ubicacion description text
  responsable_id int [ref: > usuarios.id]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    codigo_almacen
  }
}

Table inventario {
  id int [pk, increment]
  almacen_id int [ref: > almacenes.id, not null]
  articulo_id int [ref: > articulos_catalogo.id, not null]
  cantidad_disponible decimal(12,2) [not null]
  cantidad_reservada decimal(12,2) [default: 0]
  fecha_ultimo_movimiento date
  fecha_vencimiento date
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    almacen_id
    articulo_id
  }
}

Table movimientos_inventario {
  id int [pk, increment]
  almacen_id int [ref: > almacenes.id, not null]
  articulo_id int [ref: > articulos_catalogo.id, not null]
  tipo_movimiento varchar(20)
  cantidad decimal(12,2)
  referencia varchar(100)
  usuario_id int [ref: > usuarios.id]
  observaciones text
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    almacen_id
    articulo_id
    tipo_movimiento
  }
}

// ==================== RH TABLES ====================
Table empleados {
  id int [pk, increment]
  numero_empleado varchar(50) [unique, not null]
  nombre varchar(150) [not null]
  apellido_paterno varchar(150) [not null]
  apellido_materno varchar(150)
  email varchar(150) [unique]
  fecha_nacimiento date
  rfc varchar(13) [unique]
  curp varchar(18) [unique]
  nacionalidad varchar(50)
  estado_civil varchar(20)
  direccion text
  telefono varchar(20)
  celular varchar(20)
  usuario_id int [ref: > usuarios.id]
  activo boolean [default: true]
  fecha_ingreso date
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_empleado
    rfc
    email
  }
}

Table contrataciones {
  id int [pk, increment]
  empleado_id int [ref: > empleados.id, not null]
  numero_contrato varchar(50) [unique, not null]
  fecha_inicio date [not null]
  fecha_fin date
  tipo_contrato varchar(50)
  puesto varchar(150)
  departamento varchar(100)
  salario_base decimal(12,2)
  estado estado_contratacion [default: 'oferta']
  estado_texto varchar(20)
  jefe_directo_id int [ref: > empleados.id]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    empleado_id
    numero_contrato
    estado
  }
}

Table evaluaciones_desempenio {
  id int [pk, increment]
  empleado_id int [ref: > empleados.id, not null]
  evaluador_id int [ref: > empleados.id]
  fecha_evaluacion date [not null]
  periodo_evaluacion varchar(50)
  calificacion_general decimal(5,2)
  calificacion_competencias json
  fortalezas text
  areas_mejora text
  plan_desarrollo text
  evaluacion_siguiente date
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    empleado_id
    evaluador_id
    fecha_evaluacion
  }
}

Table asistencias {
  id int [pk, increment]
  empleado_id int [ref: > empleados.id, not null]
  fecha date [not null]
  hora_entrada time
  hora_salida time
  estado varchar(20)
  justificacion text
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    empleado_id
    fecha
  }
}

// ==================== FINANCIERO TABLES ====================
Table comprobantes_fiscales {
  id int [pk, increment]
  numero_comprobante varchar(50) [unique, not null]
  tipo_comprobante varchar(20)
  fecha_comprobante date [not null]
  proveedor_id int [ref: > proveedores.id]
  descripcion_concepto text
  subtotal decimal(12,2) [not null]
  impuesto_iva decimal(12,2)
  impuesto_otro decimal(12,2)
  total decimal(12,2) [not null]
  estado estado_comprobante [default: 'borrador']
  estado_texto varchar(20)
  archivo_url varchar(500)
  registrado_por_id int [ref: > usuarios.id]
  fecha_registro date
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_comprobante
    proveedor_id
    estado
    fecha_comprobante
  }
}

Table facturas_electronicas {
  id int [pk, increment]
  numero_factura varchar(50) [unique, not null]
  folio_fiscal varchar(100) [unique]
  fecha_emision date [not null]
  cliente_nombre varchar(200)
  cliente_rfc varchar(13)
  descripcion_servicios text
  cantidad_servicios decimal(12,2)
  precio_unitario decimal(12,2)
  subtotal decimal(12,2)
  descuentos decimal(12,2)
  iva decimal(12,2)
  total_factura decimal(12,2) [not null]
  estado varchar(20)
  generada_por_id int [ref: > usuarios.id]
  fecha_generacion date
  archivo_xml varchar(500)
  archivo_pdf varchar(500)
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_factura
    folio_fiscal
    estado
  }
}

Table depositos_bancarios {
  id int [pk, increment]
  numero_transaccion varchar(50) [unique, not null]
  fecha_deposito date [not null]
  concepto varchar(200)
  monto decimal(12,2) [not null]
  cuenta_origen varchar(50)
  cuenta_destino varchar(50)
  referencia_pago varchar(100)
  estado varchar(20)
  comprobante_url varchar(500)
  registrado_por_id int [ref: > usuarios.id]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_transaccion
    fecha_deposito
  }
}

Table archivo_contable {
  id int [pk, increment]
  numero_registro varchar(50) [unique, not null]
  tipo_registro varchar(50)
  fecha_registro date [not null]
  concepto text
  cuenta_contable varchar(50)
  debe decimal(12,2)
  haber decimal(12,2)
  referencia_documento int [ref: > comprobantes_fiscales.id]
  estado varchar(20)
  usuario_id int [ref: > usuarios.id]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    numero_registro
    cuenta_contable
    fecha_registro
  }
}

// ==================== AUDITORÍA ====================
Table auditorias {
  id int [pk, increment]
  usuario_id int [ref: > usuarios.id]
  tabla_afectada varchar(100)
  tipo_accion varchar(20)
  registro_id int
  datos_anteriores json
  datos_nuevos json
  razon_cambio text
  ip_address varchar(45)
  user_agent text
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    usuario_id
    tabla_afectada
    created_at
  }
}

// ==================== ARCHIVOS ====================
Table archivos {
  id int [pk, increment]
  nombre_original varchar(255) [not null]
  nombre_almacenado varchar(255) [unique, not null]
  tipo_contenido varchar(100)
  tamaño_bytes int
  ruta_almacenamiento varchar(500)
  tabla_referencia varchar(100)
  registro_id int
  subido_por_id int [ref: > usuarios.id]
  es_confidencial boolean [default: false]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    nombre_almacenado
    tabla_referencia
  }
}
