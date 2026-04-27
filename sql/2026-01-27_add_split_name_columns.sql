-- PostgreSQL migration: separar nombre(s) y apellidos en pacientes y solicitantes

ALTER TABLE pacientes
    ADD COLUMN IF NOT EXISTS nombres VARCHAR(255),
    ADD COLUMN IF NOT EXISTS apellido_paterno VARCHAR(255),
    ADD COLUMN IF NOT EXISTS apellido_materno VARCHAR(255);

ALTER TABLE solicitantes
    ADD COLUMN IF NOT EXISTS nombres VARCHAR(255),
    ADD COLUMN IF NOT EXISTS apellido_paterno VARCHAR(255),
    ADD COLUMN IF NOT EXISTS apellido_materno VARCHAR(255);

-- Backfill simple desde nombre completo si existe (heuristica basica).
-- Mantiene compatibilidad para datos historicos sin bloquear registros incompletos.
UPDATE pacientes
SET
    nombres = COALESCE(
        nombres,
        CASE
            WHEN nombre_completo IS NULL OR btrim(nombre_completo) = '' THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre_completo), '\\s+'), 1) <= 2 THEN split_part(btrim(nombre_completo), ' ', 1)
            ELSE regexp_replace(btrim(nombre_completo), '\\s+[^\\s]+\\s+[^\\s]+$', '')
        END
    ),
    apellido_paterno = COALESCE(
        apellido_paterno,
        CASE
            WHEN nombre_completo IS NULL OR btrim(nombre_completo) = '' THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre_completo), '\\s+'), 1) = 1 THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre_completo), '\\s+'), 1) = 2 THEN split_part(btrim(nombre_completo), ' ', 2)
            ELSE split_part(regexp_replace(btrim(nombre_completo), '\\s+[^\\s]+$', ''), ' ', array_length(regexp_split_to_array(regexp_replace(btrim(nombre_completo), '\\s+[^\\s]+$', ''), '\\s+'), 1))
        END
    ),
    apellido_materno = COALESCE(
        apellido_materno,
        CASE
            WHEN nombre_completo IS NULL OR btrim(nombre_completo) = '' THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre_completo), '\\s+'), 1) >= 3 THEN regexp_replace(btrim(nombre_completo), '^.*\\s([^\\s]+)$', '\\1')
            ELSE NULL
        END
    );

UPDATE solicitantes
SET
    nombres = COALESCE(
        nombres,
        CASE
            WHEN nombre IS NULL OR btrim(nombre) = '' THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre), '\\s+'), 1) <= 2 THEN split_part(btrim(nombre), ' ', 1)
            ELSE regexp_replace(btrim(nombre), '\\s+[^\\s]+\\s+[^\\s]+$', '')
        END
    ),
    apellido_paterno = COALESCE(
        apellido_paterno,
        CASE
            WHEN nombre IS NULL OR btrim(nombre) = '' THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre), '\\s+'), 1) = 1 THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre), '\\s+'), 1) = 2 THEN split_part(btrim(nombre), ' ', 2)
            ELSE split_part(regexp_replace(btrim(nombre), '\\s+[^\\s]+$', ''), ' ', array_length(regexp_split_to_array(regexp_replace(btrim(nombre), '\\s+[^\\s]+$', ''), '\\s+'), 1))
        END
    ),
    apellido_materno = COALESCE(
        apellido_materno,
        CASE
            WHEN nombre IS NULL OR btrim(nombre) = '' THEN NULL
            WHEN array_length(regexp_split_to_array(btrim(nombre), '\\s+'), 1) >= 3 THEN regexp_replace(btrim(nombre), '^.*\\s([^\\s]+)$', '\\1')
            ELSE NULL
        END
    );
