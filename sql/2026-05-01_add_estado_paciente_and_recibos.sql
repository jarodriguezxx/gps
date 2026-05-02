-- Migration: Add estado_paciente, clave_paciente, fecha_ingreso to pacientes table
-- Date: 2026-05-01
-- Database: PostgreSQL (Neon)
-- Purpose: Support patient state tracking (Prospecto → Ingresado → Egreso) and unique identification

-- Step 1: Create ENUM type for patient states (if not exists)
DO $$ BEGIN
    CREATE TYPE estado_paciente_enum AS ENUM ('PROSPECTO', 'INGRESADO', 'EGRESO');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Step 2: Alter pacientes table to add new columns
ALTER TABLE pacientes
ADD COLUMN IF NOT EXISTS estado_paciente estado_paciente_enum DEFAULT 'PROSPECTO',
ADD COLUMN IF NOT EXISTS clave_paciente VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS fecha_ingreso TIMESTAMP;

-- Step 3: Create recibos_pago table for payment audit trail
CREATE TABLE IF NOT EXISTS recibos_pago (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    numero_recibo VARCHAR(255) UNIQUE,
    monto_pago DECIMAL(10, 2),
    monto_programa DECIMAL(10, 2),
    concepto VARCHAR(255),
    fecha_pago TIMESTAMP,
    nombre_pagador VARCHAR(255),
    rfc_pagador VARCHAR(50),
    archivo_recibo_url VARCHAR(500),
    token_generado VARCHAR(255) UNIQUE,
    fecha_validacion TIMESTAMP,
    estado_pago VARCHAR(50) DEFAULT 'PENDIENTE',
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recibo_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recibos_paciente_id ON recibos_pago(paciente_id);
CREATE INDEX IF NOT EXISTS idx_recibos_estado_pago ON recibos_pago(estado_pago);
CREATE INDEX IF NOT EXISTS idx_recibos_token_generado ON recibos_pago(token_generado);
CREATE INDEX IF NOT EXISTS idx_pacientes_estado_paciente ON pacientes(estado_paciente);
CREATE INDEX IF NOT EXISTS idx_pacientes_clave_paciente ON pacientes(clave_paciente);
