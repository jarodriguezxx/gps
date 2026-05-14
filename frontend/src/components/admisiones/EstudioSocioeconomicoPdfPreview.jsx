import React from 'react';
import marakameLogo from '../../assets/marakame.jpeg';

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (v) => (v === undefined || v === null || String(v).trim() === '' ? '—' : String(v).trim());

const fmtMoney = (v) => {
  const n = Number(v);
  if (!v || Number.isNaN(n)) return '—';
  return `$${n.toLocaleString('es-MX')}`;
};

const labelFood = {
  carneRes: 'Carne de res',
  carnePollo: 'Carne de pollo',
  carneCerdo: 'Carne de cerdo',
  pescado: 'Pescado',
  leche: 'Leche',
  cereales: 'Cereales',
  huevo: 'Huevo',
  frutas: 'Frutas',
  verduras: 'Verduras',
  leguminosas: 'Leguminosas',
};

const FOOD_COLS = [
  { key: 'diario', label: 'Diario' },
  { key: 'cada_tercer_dia', label: 'C/3° día' },
  { key: 'semanal', label: '1v/sem' },
  { key: 'mensual', label: '1v/mes' },
  { key: 'ocasional', label: 'Ocasional' },
];

const labelAddiction = {
  saludAdicAlcoholismo: 'Alcoholismo',
  saludAdicTcaLudopatia: 'TCA/Ludopatía',
  saludAdicDrogadiccion: 'Drogadicción',
  saludAdicOtros: 'Otros',
};

// ─── shared primitives ───────────────────────────────────────────────────────

const GUINDA = '#7E1D3B';

const pageBreak = { breakAfter: 'page', WebkitColumnBreakAfter: 'page' };
const noBreak   = { breakInside: 'avoid', pageBreakInside: 'avoid' };

const SectionTitle = ({ children }) => (
  <div
    className="bg-[#7E1D3B] text-white font-bold text-xs uppercase flex items-center justify-start py-1.5 px-3 leading-none mb-3"
    style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
  >
    {children}
  </div>
);

const Field = ({ label, value, wide = false }) => (
  <div className={`flex items-baseline gap-2 text-[10px] mb-2 ${wide ? 'col-span-2' : ''}`}>
    <span className="font-bold text-slate-800 whitespace-nowrap">{label}:</span>
    <span className="border-b border-slate-400 flex-1 pb-0.5 text-slate-900 min-w-0 truncate">{fmt(value)}</span>
  </div>
);

const Card = ({ title, children, className = '' }) => (
  <section
    className={`break-inside-avoid rounded-lg border bg-white overflow-hidden ${className}`}
    style={{ borderColor: GUINDA, ...noBreak }}
  >
    {title && <SectionTitle>{title}</SectionTitle>}
    <div className="px-3 pb-2.5">
      {children}
    </div>
  </section>
);

const Th = ({ children, className = '' }) => (
  <th className={`px-1 py-0.5 text-left text-[9px] font-bold text-white ${className}`} style={{ backgroundColor: GUINDA }}>
    {children}
  </th>
);

const Td = ({ children, className = '' }) => (
  <td className={`px-1 py-0.5 align-top text-[9px] text-slate-700 ${className}`}>{children}</td>
);

const Table = ({ headers, rows, zebraStart = 'white' }) => (
  <div className="overflow-hidden rounded border" style={{ borderColor: '#e2e8f0' }}>
    <table className="w-full border-collapse">
      <thead>
        <tr>{headers.map((h, i) => <Th key={i}>{h}</Th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
            {row.map((cell, ci) => <Td key={ci}>{cell}</Td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── default demo data ───────────────────────────────────────────────────────

const defaultData = {
  folio: 'MK-ES-2026-DEMO',
  fecha: new Date().toLocaleDateString('es-MX'),
  pacienteNombreCompleto: 'Demo Paciente García',

  formData: {
    // solicitante
    nombreSolicitante: 'Ana López García',
    fechaNacimiento: '1988-03-15',
    lugarNacimiento: 'Guadalajara, Jalisco',
    edad: '38',
    sexo: 'femenino',
    escolaridad: 'Licenciatura',
    ocupacion: 'Administrativa',
    estadoCivil: 'Casado(a)',
    direccionCalle: 'Av. del Lago',
    direccionNoExt: '245',
    direccionNoInt: '3B',
    direccionColonia: 'Residencial Victoria',
    direccionMunicipioDelegacion: 'Zapopan',
    direccionCp: '45010',
    direccionCiudadEstado: 'Jalisco',
    telefonoCasa: '33 3812 4455',
    telefonoCelular: '33 1122 3344',
    cuentaConTarjeta: 'Débito',
    // paciente
    pacienteNombre: 'Juan Pablo López Rivera',
    pacienteFechaNacimiento: '2008-09-02',
    pacienteLugarNacimiento: 'Guadalajara, Jalisco',
    pacienteEdad: '17',
    pacienteSexo: 'masculino',
    pacienteEscolaridad: 'Preparatoria',
    pacienteOcupacion: 'Estudiante',
    pacienteEstadoCivil: 'Soltero(a)',
    pacienteDireccionCalle: 'Av. del Lago',
    pacienteDireccionNoExt: '245',
    pacienteDireccionNoInt: '3B',
    pacienteDireccionColonia: 'Residencial Victoria',
    pacienteDireccionMunicipioDelegacion: 'Zapopan',
    pacienteDireccionCp: '45010',
    pacienteDireccionCiudadEstado: 'Jalisco',
    pacienteTelefonoCasa: '33 3812 4455',
    pacienteTelefonoCelular: '33 1122 3344',
    // laboral
    laboralCuentaConEmpleo: 'si',
    laboralLugarTrabajo: 'Empresa Logística del Centro',
    laboralAntiguedad: '4 años',
    laboralPuesto: 'Coordinadora administrativa',
    laboralHorario: '08:00 a 16:00 hrs',
    laboralDependientes: '2',
    laboralIngresoMensual: '18500',
    laboralOtrosIngresos: '2000',
    laboralCategoriaOcupacion: 'obrero_empleado',
    laboralNumeroOcupacion: '1',
    conyugeOcupacion: 'Comerciante',
    conyugeLugarTrabajo: 'Mercado San Juan',
    conyugeAntiguedad: '6 años',
    conyugeIngresoMensual: '12000',
    familiarAportaIngreso: 'si',
    numeroIntegrantesAportan: '2',
    balanceEconomico: 'superavit',
    patrimonioCuentaAuto: 'si',
    patrimonioCantidad: '2',
    vehiculoCategoria: 'uno_dos',
    vehiculoNumero: '1',
    // salud
    saludAsistenciaOpciones: ['Consulta particular'],
    saludMontoConsultas: '900',
    saludOtrosServicios: '',
    saludMiembrosConAsistencia: '3',
    saludAdicAlcoholismoDetalle: 'No aplica',
    saludAdicAlcoholismoFrecuencia: '',
    saludAdicAlcoholismoSeveridad: '',
    saludAdicTcaLudopatiaDetalle: 'No aplica',
    saludAdicTcaLudopatiaFrecuencia: '',
    saludAdicTcaLudopatiaSeveridad: '',
    saludAdicDrogadiccionDetalle: 'No aplica',
    saludAdicDrogadiccionFrecuencia: '',
    saludAdicDrogadiccionSeveridad: '',
    saludAdicOtrosDetalle: '',
    saludAdicOtrosFrecuencia: '',
    saludAdicOtrosSeveridad: '',
    saludRelacionFamiliar: 'Estable',
    // vivienda
    viviendaRegimen: 'propia',
    viviendaRegimenNumero: '1',
    viviendaTipo: 'casa_habitacion',
    viviendaTipoNumero: '0',
    viviendaTotalHabitaciones: 'mas_cuatro',
    viviendaTotalHabitacionesNumero: '2',
    viviendaConformacion: ['solicitante', 'conyuge', 'hijos'],
    viviendaBanos: '2',
    viviendaRecamaras: '4',
    viviendaEspecificarSinBanos: '',
    viviendaOtrasCaracteristicas: 'Patio y cochera',
    viviendaMaterialPiso: 'vitropiso',
    viviendaMaterialPisoNumero: '1',
    viviendaMaterialMuros: 'concreto',
    viviendaMaterialMurosNumero: '1',
    viviendaMaterialTecho: 'concreto',
    viviendaMaterialTechoNumero: '1',
    // diagnóstico / familiar
    familiarDiagnostico: 'Entorno familiar funcional con soporte económico estable.',
    familiarObservacionesTrabajoSocial: 'Se observa red de apoyo suficiente para el proceso de ingreso.',
    familiarObservacionesVisitaDomiciliaria: 'Vivienda limpia, organizada y con condiciones adecuadas para evaluación institucional.',
  },

  diagnosticoEconomico: {
    puntosNivel1: '3',
    costoNivel1: '12842',
    puntosNivel2: '1',
    costoNivel2: '3421',
    puntosNivel3: '4',
    costoNivel3: '13684',
    totalPuntos: '8',
    costoBase: '29947',
    diasTratamiento: '35',
    montoKit: '550',
    costoTotal: '30497',
  },

  householdMembers: [
    { nombre: 'María Fernanda López Rivera', parentesco: 'Madre', edad: '40', sexo: 'femenino', estadoCivil: 'Casado(a)', ocupacionLugar: 'Administrativa' },
    { nombre: 'Juan Pablo López Rivera', parentesco: 'Hijo', edad: '17', sexo: 'masculino', estadoCivil: 'Soltero(a)', ocupacionLugar: 'Estudiante' },
    { nombre: 'Carlos Alberto Rivera', parentesco: 'Esposo', edad: '42', sexo: 'masculino', estadoCivil: 'Casado(a)', ocupacionLugar: 'Comerciante' },
  ],

  incomeContributors: [
    { parentesco: 'Solicitante', cantidadMensual: '18500' },
    { parentesco: 'Cónyuge', cantidadMensual: '12000' },
  ],

  vehicleAssets: [
    { marca: 'Toyota', ano: '2020', propietario: 'Solicitante' },
    { marca: 'Nissan', ano: '2018', propietario: 'Cónyuge' },
  ],

  monthlyIncomes: { solicitante: '18500', conyuge: '12000', hijos: '0', otros: '2000' },

  monthlyExpenses: {
    alimentacion: '7000',
    renta: '0',
    luz: '650',
    agua: '300',
    combustible: '1500',
    transporte: '700',
    educacion: '2500',
    telefono: '850',
    gastosMedicos: '900',
    esparcimiento: '1200',
    otros: '1100',
  },

  foodFrequency: {
    carneRes: 'semanal',
    carnePollo: 'diario',
    carneCerdo: 'semanal',
    pescado: 'mensual',
    leche: 'diario',
    cereales: 'diario',
    huevo: 'diario',
    frutas: 'diario',
    verduras: 'diario',
    leguminosas: 'semanal',
  },

  familyReferences: [
    { nombre: 'Laura Medina', telefono: '33 4556 7788', relacion: 'Vecina', tiempoConocer: '10 años' },
    { nombre: 'Ricardo Torres', telefono: '33 7788 9900', relacion: 'Hermano', tiempoConocer: '17 años' },
  ],
};

// ─── label maps ─────────────────────────────────────────────────────────────

const HOUSING_REGIME_LABELS = {
  sin_vivienda: 'Sin vivienda', rentada: 'Rentada', prestada: 'Prestada',
  familiar: 'Familiar', propia: 'Propia', mas_vivienda: 'Más de 1 vivienda',
};
const HOUSING_TYPE_LABELS = {
  vecindad: 'Vecindad', condominio: 'Condominio', interes_social: 'Interés Social',
  casa_habitacion: 'Casa Habitación', residencial_m: 'Residencial M.', residencial_a: 'Residencial A.',
};
const ROOMS_LABELS = { dos_uno: '1–2 dormitorios', tres_cuatro: '3–4 dormitorios', mas_cuatro: 'Más de 4' };
const FLOOR_LABELS  = { tierra: 'Tierra', concreto: 'Concreto', mosaico: 'Mosaico', vitropiso: 'Vitropiso', otros: 'Otros' };
const WALL_LABELS   = { adobe_tabuique: 'Adobe/Tabique', concreto: 'Concreto', otros: 'Otros' };
const ROOF_LABELS   = { lamina_carton: 'Lámina cartón/asbesto', concreto: 'Concreto', otros: 'Otros' };
const OCCUPATION_LABELS = {
  desempleado: 'Desempleado', empleo_temporal: 'Empleo temporal',
  obrero_empleado: 'Obrero/Empleado', profesionista: 'Profesionista', empresario: 'Empresario',
};
const VEHICLE_LABELS = { ninguno: 'Ninguno', uno_dos: '1–2 autos', mas_dos: 'Más de 2 autos' };
const BALANCE_LABELS = { deficit: 'Déficit', superavit: 'Superávit' };

// ─── component ───────────────────────────────────────────────────────────────

const EstudioSocioeconomicoPdfPreview = ({ data }) => {
  const d = data || defaultData;

  const fd    = d.formData || {};
  const diag  = d.diagnosticoEconomico || {};
  const hm    = d.householdMembers || [];
  const ic    = d.incomeContributors || [];
  const va    = d.vehicleAssets || [];
  const mi    = d.monthlyIncomes || {};
  const me    = d.monthlyExpenses || {};
  const ff    = d.foodFrequency || {};
  const fr    = d.familyReferences || [];

  const folio         = d.folio || '—';
  const fecha         = d.fecha || '—';
  const pacienteNombre = d.pacienteNombreCompleto || fmt(fd.pacienteNombre);

  // derived totals
  const totalIngresos =
    (Number(mi.solicitante) || 0) +
    (Number(mi.conyuge) || 0) +
    (Number(mi.hijos) || 0) +
    (Number(mi.otros) || 0);

  const totalEgresos = Object.values(me).reduce((acc, v) => acc + (Number(v) || 0), 0);

  const dirSolicitante = [
    fd.direccionCalle, fd.direccionNoExt && `No. ${fd.direccionNoExt}`,
    fd.direccionNoInt && `Int. ${fd.direccionNoInt}`, fd.direccionColonia,
    fd.direccionMunicipioDelegacion, fd.direccionCp, fd.direccionCiudadEstado,
  ].filter(Boolean).join(', ');

  const dirPaciente = [
    fd.pacienteDireccionCalle, fd.pacienteDireccionNoExt && `No. ${fd.pacienteDireccionNoExt}`,
    fd.pacienteDireccionNoInt && `Int. ${fd.pacienteDireccionNoInt}`, fd.pacienteDireccionColonia,
    fd.pacienteDireccionMunicipioDelegacion, fd.pacienteDireccionCp, fd.pacienteDireccionCiudadEstado,
  ].filter(Boolean).join(', ');

  const conformacion = Array.isArray(fd.viviendaConformacion) ? fd.viviendaConformacion.join(' | ') : fmt(fd.viviendaConformacion);

  const addictions = [
    { label: 'Alcoholismo',    detalle: fd.saludAdicAlcoholismoDetalle,    frecuencia: fd.saludAdicAlcoholismoFrecuencia,    severidad: fd.saludAdicAlcoholismoSeveridad },
    { label: 'TCA/Ludopatía',  detalle: fd.saludAdicTcaLudopatiaDetalle,   frecuencia: fd.saludAdicTcaLudopatiaFrecuencia,   severidad: fd.saludAdicTcaLudopatiaSeveridad },
    { label: 'Drogadicción',   detalle: fd.saludAdicDrogadiccionDetalle,   frecuencia: fd.saludAdicDrogadiccionFrecuencia,   severidad: fd.saludAdicDrogadiccionSeveridad },
    { label: 'Otros',          detalle: fd.saludAdicOtrosDetalle,          frecuencia: fd.saludAdicOtrosFrecuencia,          severidad: fd.saludAdicOtrosSeveridad },
  ];

  const viviendaPts =
    (Number(fd.viviendaRegimenNumero) || 0) +
    (Number(fd.viviendaTotalHabitacionesNumero) || 0) +
    (Number(fd.viviendaTipoNumero) || 0) +
    (Number(fd.viviendaMaterialPisoNumero) || 0) +
    (Number(fd.viviendaMaterialMurosNumero) || 0) +
    (Number(fd.viviendaMaterialTechoNumero) || 0);

  return (
    <article
      className="mx-auto max-w-[900px] bg-slate-100 p-3 text-[10px] text-slate-800"
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      <div className="space-y-2.5 rounded-xl bg-white p-3 shadow print:shadow-none">

        {/* ── CABECERA ── */}
        <header className="flex gap-3 border-b pb-2.5" style={{ borderColor: '#e2e8f0' }}>
          <div
            className="flex h-28 w-24 shrink-0 items-center justify-center rounded-lg text-[8px] font-bold uppercase tracking-[0.3em] text-slate-500"
            style={{ border: `2px dashed ${GUINDA}` }}
          >
            FOTO
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <img src={marakameLogo} alt="Marakame" className="h-10 w-auto rounded border border-slate-200 bg-white p-0.5" />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.25em]" style={{ color: GUINDA }}>Instituto Marakame</p>
                <h1 className="text-base font-black uppercase tracking-[0.15em] text-slate-900 leading-tight">Estudio Socioeconómico</h1>
                <p className="text-[8px] text-slate-400">Documento de valoración social, familiar y económica</p>
              </div>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-lg text-white text-[9px]" style={{ backgroundColor: GUINDA }}>
              <div className="border-r border-white/20 px-2 py-1.5">
                <p className="text-[7px] uppercase tracking-wider opacity-70">Folio</p>
                <p className="font-bold leading-tight">{folio}</p>
              </div>
              <div className="border-r border-white/20 px-2 py-1.5">
                <p className="text-[7px] uppercase tracking-wider opacity-70">Fecha</p>
                <p className="font-bold leading-tight">{fecha}</p>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[7px] uppercase tracking-wider opacity-70">Paciente</p>
                <p className="font-bold leading-tight truncate">{pacienteNombre}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── I. SOLICITANTE + PACIENTE ── */}
        <div className="grid grid-cols-2 gap-2">
          <Card title="I. Datos Generales del Solicitante">
            <div className="grid grid-cols-2 gap-1">
              <Field label="Nombre completo"    value={fd.nombreSolicitante} wide />
              <Field label="Fecha de nacimiento" value={fd.fechaNacimiento} />
              <Field label="Lugar de nacimiento" value={fd.lugarNacimiento} />
              <Field label="Edad"               value={fd.edad} />
              <Field label="Sexo"               value={fd.sexo} />
              <Field label="Escolaridad"        value={fd.escolaridad} />
              <Field label="Ocupación"          value={fd.ocupacion} />
              <Field label="Estado civil"       value={fd.estadoCivil} />
              <Field label="Teléfono casa"      value={fd.telefonoCasa} />
              <Field label="Teléfono celular"   value={fd.telefonoCelular} />
              <Field label="Tarjeta"            value={fd.cuentaConTarjeta} />
              <Field label="Domicilio" value={dirSolicitante || '—'} wide />
            </div>
          </Card>

          <Card title="II. Datos Generales del Paciente/Beneficiario">
            <div className="grid grid-cols-2 gap-1">
              <Field label="Nombre completo"    value={fd.pacienteNombre} wide />
              <Field label="Fecha de nacimiento" value={fd.pacienteFechaNacimiento} />
              <Field label="Lugar de nacimiento" value={fd.pacienteLugarNacimiento} />
              <Field label="Edad"               value={fd.pacienteEdad} />
              <Field label="Sexo"               value={fd.pacienteSexo} />
              <Field label="Escolaridad"        value={fd.pacienteEscolaridad} />
              <Field label="Ocupación"          value={fd.pacienteOcupacion} />
              <Field label="Estado civil"       value={fd.pacienteEstadoCivil} />
              <Field label="Teléfono casa"      value={fd.pacienteTelefonoCasa} />
              <Field label="Teléfono celular"   value={fd.pacienteTelefonoCelular} />
              <Field label="Domicilio" value={dirPaciente || '—'} wide />
            </div>
          </Card>
        </div>

        {/* ── III. ESTRUCTURA FAMILIAR ── */}
        <Card title="III. Estructura Familiar (personas que habitan en el domicilio)">
          {hm.length > 0 ? (
            <Table
              headers={['Nombre', 'Parentesco', 'Edad', 'Sexo', 'Estado Civil', 'Ocupación/Lugar']}
              rows={hm.map((m) => [
                fmt(m.nombre), fmt(m.parentesco), fmt(m.edad),
                fmt(m.sexo), fmt(m.estadoCivil), fmt(m.ocupacionLugar),
              ])}
            />
          ) : (
            <p className="text-[9px] text-slate-400 italic">Sin integrantes registrados.</p>
          )}
        </Card>

        {/* ── IV. LABORAL ── */}
        <Card title="IV. Ingreso y Egreso Familiar — Situación Laboral">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Solicitante</p>
              <div className="grid grid-cols-2 gap-1">
                <Field label="Cuenta con empleo"    value={fd.laboralCuentaConEmpleo === 'si' ? 'Sí' : fd.laboralCuentaConEmpleo === 'no' ? 'No' : '—'} />
                <Field label="Empresa/Lugar"         value={fd.laboralLugarTrabajo} />
                <Field label="Antigüedad"            value={fd.laboralAntiguedad} />
                <Field label="Puesto"                value={fd.laboralPuesto} />
                <Field label="Horario"               value={fd.laboralHorario} />
                <Field label="Dependientes"          value={fd.laboralDependientes} />
                <Field label="Ingreso mensual neto"  value={fmtMoney(fd.laboralIngresoMensual)} />
                <Field label="Otros ingresos"        value={fmtMoney(fd.laboralOtrosIngresos)} />
                <Field label="Categoría ocupacional" value={OCCUPATION_LABELS[fd.laboralCategoriaOcupacion] || fd.laboralCategoriaOcupacion} />
                <Field label="Niv. ocupación (#)"   value={fd.laboralNumeroOcupacion} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Cónyuge</p>
              <div className="grid grid-cols-2 gap-1">
                <Field label="Ocupación"             value={fd.conyugeOcupacion} />
                <Field label="Lugar de trabajo"      value={fd.conyugeLugarTrabajo} />
                <Field label="Antigüedad"            value={fd.conyugeAntiguedad} />
                <Field label="Ingreso mensual neto"  value={fmtMoney(fd.conyugeIngresoMensual)} />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-2 mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Transporte / Patrimonio</p>
              <div className="grid grid-cols-2 gap-1">
                <Field label="Cuenta con auto"       value={fd.patrimonioCuentaAuto === 'si' ? 'Sí' : 'No'} />
                <Field label="Cantidad"              value={fd.patrimonioCantidad} />
                <Field label="Categoría"             value={VEHICLE_LABELS[fd.vehiculoCategoria] || fd.vehiculoCategoria} />
                <Field label="Vehículos con año ≥2020" value={fd.vehiculoNumero} />
              </div>
              {va.length > 0 && (
                <Table
                  headers={['Marca', 'Año', 'Propietario']}
                  rows={va.map((v) => [fmt(v.marca), fmt(v.ano), fmt(v.propietario)])}
                />
              )}
            </div>
          </div>

          {/* Aportación familiar */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Aportación Familiar al Ingreso</p>
              <div className="grid grid-cols-2 gap-1">
                <Field label="Otro miembro aporta"   value={fd.familiarAportaIngreso === 'si' ? 'Sí' : fd.familiarAportaIngreso === 'no' ? 'No' : '—'} />
                <Field label="Integrantes que aportan" value={fd.numeroIntegrantesAportan} />
                <Field label="Balance económico"      value={BALANCE_LABELS[fd.balanceEconomico] || fd.balanceEconomico} wide />
              </div>
              {ic.filter(r => r.parentesco).length > 0 && (
                <Table
                  headers={['Parentesco', 'Monto mensual']}
                  rows={ic.filter(r => r.parentesco).map(r => [fmt(r.parentesco), fmtMoney(r.cantidadMensual)])}
                />
              )}
            </div>

            {/* Ingresos vs Egresos */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Ingresos Mensuales</p>
                <Table
                  headers={['Concepto', 'Monto']}
                  rows={[
                    ['Solicitante', fmtMoney(mi.solicitante || fd.laboralIngresoMensual)],
                    ['Cónyuge',     fmtMoney(mi.conyuge || fd.conyugeIngresoMensual)],
                    ['Hijos',       fmtMoney(mi.hijos)],
                    ['Otros',       fmtMoney(mi.otros || fd.laboralOtrosIngresos)],
                    ['Total',       fmtMoney(totalIngresos)],
                  ]}
                />
              </div>  
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Egresos Mensuales</p>
                <Table
                  headers={['Concepto', 'Monto']}
                  rows={[
                    ['Alimentación',   fmtMoney(me.alimentacion)],
                    ['Renta',          fmtMoney(me.renta)],
                    ['Luz',            fmtMoney(me.luz)],
                    ['Agua',           fmtMoney(me.agua)],
                    ['Combustible',    fmtMoney(me.combustible)],
                    ['Transporte',     fmtMoney(me.transporte)],
                    ['Educación',      fmtMoney(me.educacion)],
                    ['Teléfono',       fmtMoney(me.telefono)],
                    ['Gastos médicos', fmtMoney(me.gastosMedicos)],
                    ['Esparcimiento',  fmtMoney(me.esparcimiento)],
                    ['Otros',          fmtMoney(me.otros)],
                    ['Total',          fmtMoney(totalEgresos)],
                  ]}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ── V. SALUD Y ADICCIONES ── */}
        <Card title="V. Salud y Adicciones">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Asistencia Médica</p>
              <div className="grid grid-cols-2 gap-1">
                <Field
                  label="ISSSTE / IMSS / Seg. Popular / Particular"
                  value={Array.isArray(fd.saludAsistenciaOpciones) ? fd.saludAsistenciaOpciones.join(', ') : fmt(fd.saludAsistenciaOpciones)}
                  wide
                />
                <Field label="Monto en consultas"        value={fmtMoney(fd.saludMontoConsultas)} />
                <Field label="Otros servicios"           value={fd.saludOtrosServicios} />
                <Field label="Miembros con asist. méd."  value={fd.saludMiembrosConAsistencia} />
                <Field label="Relación familiar"         value={fd.saludRelacionFamiliar} />
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Adicciones</p>
              <Table
                headers={['Tipo', 'Detalle', 'Frecuencia', 'Severidad']}
                rows={addictions.map((a) => [a.label, fmt(a.detalle), fmt(a.frecuencia) , fmt(a.severidad)])}
              />
            </div>
          </div>
        </Card>

        {/* ── VI. VIVIENDA ── */}
        <Card title="VI. Vivienda">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid grid-cols-2 gap-1">
              <Field label="Régimen"                value={HOUSING_REGIME_LABELS[fd.viviendaRegimen] || fd.viviendaRegimen} />
              <Field label="Puntaje régimen"        value={fd.viviendaRegimenNumero} />
              <Field label="Tipo de vivienda"       value={HOUSING_TYPE_LABELS[fd.viviendaTipo] || fd.viviendaTipo} />
              <Field label="Puntaje tipo"           value={fd.viviendaTipoNumero} />
              <Field label="Total habitaciones"     value={ROOMS_LABELS[fd.viviendaTotalHabitaciones] || fd.viviendaTotalHabitaciones} />
              <Field label="Puntaje habitaciones"   value={fd.viviendaTotalHabitacionesNumero} />
              <Field label="Baños"                  value={fd.viviendaBanos} />
              <Field label="Recámaras"              value={fd.viviendaRecamaras} />
              <Field label="Conformación"           value={conformacion} wide />
              <Field label="Otras características" value={fd.viviendaOtrasCaracteristicas} wide />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1 pb-0.5 border-b" style={{ color: GUINDA, borderColor: GUINDA }}>Material de Construcción</p>
              <Table
                headers={['Elemento', 'Material', 'Puntaje']}
                rows={[
                  ['Piso',   FLOOR_LABELS[fd.viviendaMaterialPiso]  || fd.viviendaMaterialPiso  || '—', fd.viviendaMaterialPisoNumero  || '—'],
                  ['Muros',  WALL_LABELS[fd.viviendaMaterialMuros]  || fd.viviendaMaterialMuros  || '—', fd.viviendaMaterialMurosNumero  || '—'],
                  ['Techo',  ROOF_LABELS[fd.viviendaMaterialTecho]  || fd.viviendaMaterialTecho  || '—', fd.viviendaMaterialTechoNumero  || '—'],
                  ['Total vivienda', '', String(viviendaPts)],
                ]}
              />
            </div>
          </div>
        </Card>

        {/* ── VII. ALIMENTACIÓN ── */}
        <Card title="VII. Alimentación — Frecuencia de consumo">
          <div className="overflow-hidden rounded border" style={{ borderColor: '#e2e8f0' }}>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <Th>Alimento</Th>
                  {FOOD_COLS.map((c) => <Th key={c.key}>{c.label}</Th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(labelFood).map(([key, label], ri) => (
                  <tr key={key} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <Td>{label}</Td>
                    {FOOD_COLS.map((c) => (
                      <Td key={c.key} className="text-center font-bold" style={{ color: ff[key] === c.key ? GUINDA : 'transparent' }}>
                        {ff[key] === c.key ? '✓' : '·'}
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── VIII. REFERENCIAS PERSONALES ── */}
        {fr.filter((r) => r.nombre).length > 0 && (
          <Card title="VIII. Referencias Personales">
            <Table
              headers={['Nombre', 'Teléfono', 'Relación', 'Tiempo de conocerse']}
              rows={fr.filter((r) => r.nombre).map((r) => [
                fmt(r.nombre), fmt(r.telefono), fmt(r.relacion), fmt(r.tiempoConocer),
              ])}
            />
          </Card>
        )}

        {/* ── IX. DIAGNÓSTICO ECONÓMICO ── */}
        <Card title="IX. Diagnóstico Económico">
          <div className="grid grid-cols-2 gap-2">
            <Table
              headers={['Nivel', 'Puntos', 'Costo base']}
              rows={[
                ['Nivel 1', fmt(diag.puntosNivel1), fmtMoney(diag.costoNivel1)],
                ['Nivel 2', fmt(diag.puntosNivel2), fmtMoney(diag.costoNivel2)],
                ['Nivel 3', fmt(diag.puntosNivel3), fmtMoney(diag.costoNivel3)],
                ['Total',   fmt(diag.totalPuntos),  fmtMoney(diag.costoBase)],
              ]}
            />
            <div className="grid grid-cols-2 gap-1">
              <Field label="Días de tratamiento" value={diag.diasTratamiento} />
              <Field label="Monto kit"           value={fmtMoney(diag.montoKit)} />
              <Field label="Costo total estimado" value={fmtMoney(diag.costoTotal)} wide />
            </div>
          </div>
        </Card>

        {/* ── X. DIAGNÓSTICO (texto) ── */}
        <Card title="X. Diagnóstico">
          <p className="min-h-[48px] rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] leading-5 text-slate-700">
            {fmt(fd.familiarDiagnostico)}
          </p>
        </Card>

        {/* ── XI. OBSERVACIONES ── */}
        <div className="grid grid-cols-2 gap-2">
          <Card title="XI. Observaciones del Trabajador Social">
            <p className="min-h-[56px] rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] leading-5 text-slate-700">
              {fmt(fd.familiarObservacionesTrabajoSocial)}
            </p>
          </Card>
          <Card title="XII. Observaciones de la Visita Domiciliaria">
            <p className="min-h-[56px] rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] leading-5 text-slate-700">
              {fmt(fd.familiarObservacionesVisitaDomiciliaria)}
            </p>
          </Card>
        </div>

        {/* ── NOTA LEGAL ── */}
        <p className="text-[8px] font-bold text-slate-500 leading-4">
          NOTA: El proporcionar información falsa es motivo suficiente para anular el trámite. Marakame se reserva el derecho de investigar la veracidad de lo antes declarado.
        </p>

        {/* ── FIRMAS ── */}
        <Card title="Firmas">
          <div className="grid grid-cols-2 gap-8 pt-1">
            {['Nombre y Firma del Solicitante', 'Nombre y Firma del Trabajador Social'].map((label) => (
              <div key={label}>
                <div className="mt-8 border-b" style={{ borderColor: GUINDA }} />
                <p className="mt-1 text-[9px] font-semibold text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </article>
  );
};

export default EstudioSocioeconomicoPdfPreview;
