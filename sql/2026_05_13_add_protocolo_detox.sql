-- Tabla para almacenar los protocolos de desintoxicación
CREATE TABLE IF NOT EXISTS protocolo_detox (
    id SERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medicamento VARCHAR(255) NOT NULL,
    duracion_dias INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    medico_creado_por VARCHAR(255),
    estado VARCHAR(50) NOT NULL DEFAULT 'activo', -- 'activo', 'completado', 'cancelado'
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- Tabla para almacenar las dosis por día y horario
CREATE TABLE IF NOT EXISTS protocolo_detox_dosis (
    id SERIAL PRIMARY KEY,
    protocolo_detox_id BIGINT NOT NULL,
    dia INTEGER NOT NULL, -- 1 a 21
    horario VARCHAR(10) NOT NULL, -- '7AM', '12PM', '6PM', '9PM'
    dosis VARCHAR(255), -- cantidad y unidad, ej: "2.5 mg"
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (protocolo_detox_id) REFERENCES protocolo_detox(id) ON DELETE CASCADE,
    CONSTRAINT unique_dia_horario UNIQUE (protocolo_detox_id, dia, horario)
);

-- Índices para optimizar consultas
CREATE INDEX idx_protocolo_detox_paciente ON protocolo_detox(paciente_id);
CREATE INDEX idx_protocolo_detox_estado ON protocolo_detox(estado);
CREATE INDEX idx_protocolo_detox_dosis_protocolo ON protocolo_detox_dosis(protocolo_detox_id);
