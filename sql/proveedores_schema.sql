-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre           VARCHAR(255)  NOT NULL,
    especialidad     VARCHAR(100),
    estatus          VARCHAR(10)   NOT NULL DEFAULT 'ACTIVO',
    rfc              VARCHAR(20),
    telefono         VARCHAR(50),
    correo           VARCHAR(255),
    nombre_encargado VARCHAR(255),
    created_at       TIMESTAMPTZ   DEFAULT NOW()
);

-- Seed: 20 proveedores del catálogo inicial
INSERT INTO proveedores (nombre, especialidad, estatus, rfc, telefono, correo, nombre_encargado) VALUES
('Suministros Industriales del Norte',  'Ferretería Industrial', 'ACTIVO',   'SIN920101AA1', '811-234-5678', 'ventas@sinorte.com',       'Ing. Roberto Garza'),
('Soluciones Tecnológicas Marakame',    'Software y TI',         'ACTIVO',   'STM150520BC2', '333-987-6543', 'soporte@marakame.tech',    'Lic. Elena Jiménez'),
('Papelería y Oficina Central',         'Papelería',             'INACTIVO', 'POC101231TR3', '555-123-0000', 'pedidos@pocentral.mx',     'Carlos Peña'),
('Constructora Delta',                  'Construcción',          'ACTIVO',   'CDE080808XY4', '442-555-8899', 'obras@delta.com.mx',       'Arq. Samuel Soto'),
('Limpieza y Mantenimiento Express',    'Servicios de Limpieza', 'ACTIVO',   'LME120404PL5', '222-444-3322', 'contacto@lmexpress.com',   'Martha Domínguez'),
('Seguridad Privada Halcón',            'Seguridad',             'INACTIVO', 'SPH050607JJ6', '800-999-0011', 'gerencia@halconseg.mx',    'Cap. Fernando Ruiz'),
('Transportes y Logística Veloz',       'Logística',             'ACTIVO',   'TLV181111MK7', '477-771-2233', 'logistica@veloz.mx',       'Héctor Valadez'),
('Muebles para Oficina Pro',            'Mobiliario',            'ACTIVO',   'MOP140228HJ8', '331-002-9988', 'ventas@mueblespro.com',    'Sofía Martínez'),
('Aceros y Perfiles de México',         'Siderurgia',            'ACTIVO',   'APM990101QR9', '818-300-4050', 'ventas@acerosmex.com',     'Ricardo Treviño'),
('Químicos Especializados del Bajío',   'Químicos',              'INACTIVO', 'QEB030303NM0', '442-101-2020', 'contacto@qebajio.com.mx',  'Dra. Laura Campos'),
('Uniformes y Textiles Selectos',       'Textiles',              'ACTIVO',   'UTS110909LK1', '554-321-7766', 'ventas@uniselect.mx',      'Gabriela Sosa'),
('Sistemas Eléctricos Integrales',      'Electricidad',          'ACTIVO',   'SEI140707PP2', '999-111-2233', 'ing@sei-electricos.com',   'Ing. Manuel Poot'),
('Servicios de Comedor Gourmet',        'Catering',              'INACTIVO', 'SCG101010ZZ3', '555-667-8899', 'eventos@gourmet-serv.mx',  'Chef Antonio Briz'),
('Impresiones y Publicidad Visual',     'Publicidad',            'ACTIVO',   'IPV160303WW4', '333-444-5555', 'diseno@visualads.com',     'Javier Méndez'),
('Equipos Médicos de Alta Gama',        'Médica',                'ACTIVO',   'EMG131212NN5', '800-633-9900', 'ventas@med-equipos.mx',    'Dra. Patricia Arreola'),
('Distribuidora de Llantas Continental','Automotriz',            'ACTIVO',   'DLC090505MM6', '477-222-3344', 'servicio@llantas-cont.mx', 'Oscar Luna'),
('Asesoría Contable y Fiscal',          'Consultoría',           'ACTIVO',   'ACF070707LL7', '552-111-0099', 'info@acf-consultores.com', 'C.P. Raúl Martínez'),
('Herramientas de Precisión S.A.',      'Maquinaria',            'INACTIVO', 'HPS121212KK8', '442-888-7766', 'pedidos@herraprec.mx',     'Ignacio Vega'),
('Sistemas de Riego Modernos',          'Agricultura',           'ACTIVO',   'SRM151010JJ9', '667-123-4455', 'ventas@riego-mod.com',     'Ing. Jorge Esquer'),
('Pinturas e Impermeabilizantes Pro',   'Acabados',              'ACTIVO',   'PIP111111HH0', '818-555-6677', 'ventas@pinturas-pro.mx',   'Beatriz Gallegos')
ON CONFLICT DO NOTHING;
