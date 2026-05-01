-- Migration: Add priority, responsible party, and next action fields to seguimientos table
-- Date: 2025-01-27

ALTER TABLE seguimientos ADD COLUMN IF NOT EXISTS prioridad VARCHAR(20) DEFAULT 'MEDIA';
ALTER TABLE seguimientos ADD COLUMN IF NOT EXISTS responsable VARCHAR(255);
ALTER TABLE seguimientos ADD COLUMN IF NOT EXISTS fecha_siguiente_accion TIMESTAMP;
