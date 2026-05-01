-- Fix: Set default estado_paciente for existing records
-- This updates all existing patients with NULL estado_paciente to 'PROSPECTO'

UPDATE pacientes 
SET estado_paciente = 'PROSPECTO'
WHERE estado_paciente IS NULL;

-- Verify the update
SELECT COUNT(*) as total_pacientes, 
       COUNT(CASE WHEN estado_paciente = 'PROSPECTO' THEN 1 END) as prospecto_count,
       COUNT(CASE WHEN estado_paciente = 'INGRESADO' THEN 1 END) as ingresado_count,
       COUNT(CASE WHEN estado_paciente = 'EGRESO' THEN 1 END) as egreso_count,
       COUNT(CASE WHEN estado_paciente IS NULL THEN 1 END) as null_count
FROM pacientes;
