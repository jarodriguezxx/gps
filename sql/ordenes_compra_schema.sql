-- Secuencia para número consecutivo de órdenes de compra
CREATE SEQUENCE IF NOT EXISTS ordenes_compra_consecutivo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Tabla principal de órdenes de compra
CREATE TABLE ordenes_compra (
    id                        UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    requisicion_id            UUID          NOT NULL REFERENCES requisiciones(id),
    numero_orden              VARCHAR(50),
    consecutivo               INTEGER       UNIQUE,
    fecha_orden               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    estatus                   VARCHAR(30)   NOT NULL DEFAULT 'BORRADOR',
    justificacion             TEXT,
    proveedor_id              VARCHAR(100),
    proveedor_nombre          VARCHAR(255),
    proveedor_rfc             VARCHAR(20),
    proveedor_telefono        VARCHAR(50),
    proveedor_correo          VARCHAR(255),
    proveedor_contacto_nombre VARCHAR(255),
    firma_encargado_compras   BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at                TIMESTAMPTZ   DEFAULT NOW(),
    updated_at                TIMESTAMPTZ   DEFAULT NOW()
);

-- Artículos de la orden de compra
CREATE TABLE articulos_orden_compra (
    id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_compra_id         UUID          NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    articulo_requisicion_id UUID          REFERENCES articulos_requisicion(id),
    articulo                VARCHAR(255)  NOT NULL,
    descripcion             TEXT,
    unidad                  VARCHAR(50)   NOT NULL,
    cantidad                INTEGER       NOT NULL DEFAULT 1,
    precio_unitario         DECIMAL(12,2) NOT NULL DEFAULT 0.00
);
