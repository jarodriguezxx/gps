-- Columnas para flujo de rechazo de requisiciones por admin/dirección
ALTER TABLE requisiciones
  ADD COLUMN IF NOT EXISTS observaciones_rechazo TEXT,
  ADD COLUMN IF NOT EXISTS rechazado_por VARCHAR(50);
