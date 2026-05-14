import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, UserMinus, Tag, ShieldCheck, Wallet,
  AlertTriangle, ClipboardList, Calculator,
  ChevronLeft, ChevronRight, DollarSign, TrendingDown,
  Users, X, AlertCircle,
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

// ── Navegación RH ──────────────────────────────────────────────────────────
const navItems = [
  { label: 'Alta de Personal',     icon: UserPlus,      key: 'alta',              path: '/rh/alta-personal' },
  { label: 'Baja de Personal',     icon: UserMinus,     key: 'baja',              path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',    icon: Tag,           key: 'catalogo',          path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles',  icon: ShieldCheck,   key: 'asignacion',        path: '/rh/asignacion-roles' },
  { label: 'Nómina',               icon: Wallet,        key: 'nomina',            path: '/rh/nomina' },
  { label: 'Registrar Incidencia', icon: AlertTriangle, key: 'incidencias',       path: '/rh/registrar-incidencia' },
  { label: 'Tabla de Incidencias', icon: ClipboardList, key: 'tabla-incidencias', path: '/rh/tabla-incidencias' },
  { label: 'Cálculo de Quincena',  icon: Calculator,    key: 'quincena',          path: '/rh/calculo-quincena' },
];

// ── Sueldos brutos mensuales por puesto ────────────────────────────────────
const SUELDO_MENSUAL = {
  // Dirección
  'DIRECTORA GENERAL':                              25000,
  // Jefaturas
  'JEFA (E) DEP. CLÍNICO':                         20000,
  'JEFA (E) DEP. MÉDICO':                          20000,
  'JEFA (E) DEP. ADMISIONES':                      18000,
  'JEFA (E) DEP. ADMINISTRACIÓN':                  18000,
  // Profesional médico-clínico
  'MÉDICO':                                         18000,
  'PSICÓLOGA (O)':                                  14000,
  'NUTRIÓLOGA (O)':                                 14000,
  // Titulares / encargados con jerarquía
  'TITULAR DE UNIDAD JURÍDICA':                     15000,
  'TITULAR DE LA UNIDAD DE TRANSPARENCIA':          14000,
  'ENCARGADA (O) DE RECURSOS HUMANOS':              13000,
  'ENCARGADA (O) DE RECURSOS FINANCIEROS':          13000,
  'ENCARGADA (O) DE RECURSOS MATERIALES':           13000,
  'ENCARGADA (O) DE CONSEJEROS ASIGNADOS':          12000,
  // Encargados de área
  'ENCARGADA (O) DE ALMACÉN':                       11000,
  'ENCARGADA (O) DE FAMILIA':                       11000,
  'ENCARGADA (O) DE POST TRATAMIENTO':              11000,
  'ENCARGADA (O) DE PREVENCIÓN Y ESTADÍSTICA':      11000,
  'ENCARGADA (O) DE MANTENIMIENTO E INTENDENCIA':   10000,
  'ENCARGADA (O) DE DIFUSIÓN Y MEDIOS':             10000,
  // Terapeutas
  'TERAPEUTA FAMILIAR':                             10000,
  'TERAPEUTA DE GRUPO':                             10000,
  'ASESOR (A)':                                     10000,
  // Técnico
  'ENFERMERA (O)':                                   9000,
  'CONSEJERA (O) ASIGNADO':                          9000,
  'TERAPEUTA DE POST-TRATAMIENTO':                   9000,
  'COTERAPEUTA':                                     9000,
  'ASISTENTE CONTABLE':                              9000,
  'ASISTENTE DE DIRECCIÓN':                          9000,
  // Operativo-administrativo
  'CHOFER DE DIRECCIÓN':                             8000,
  'AUXILIAR ADMINISTRATIVO':                         7500,
  'RECEPCIÓN':                                       7500,
  // Operativo
  'AUXILIAR DE MANTENIMIENTO':                       6500,
  'AUXILIAR DE COCINA':                              6500,
  'AUXILIAR DE INTENDENCIA':                         6000,
};

const SUELDO_DEFAULT = 7500;

// Factor de descuento: solo aplica sobre incidencias INJUSTIFICADAS
const FACTOR_DESCUENTO = {
  'Retardo':             0.25,   // 25 % del día (llegada tarde)
  'Ausencia Temporal':   0.50,   // 50 % del día (salida anticipada)
  'Falta Injustificada': 1.00,   // 100 % del día
  'Falta Justificada':   0.00,   // sin descuento (ya tiene justificante)
};

const INCIDENCIAS_KEY = 'marakame_incidencias';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const nombreCompleto = (emp) =>
  `${emp.nombre ?? ''} ${emp.apellidoPaterno ?? ''} ${emp.apellidoMaterno ?? ''}`.trim();

const fmtFecha = (dateStr) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const getPeriodDates = (year, month, quincena) => {
  const mm = String(month + 1).padStart(2, '0');
  if (quincena === 1) {
    return { inicio: `${year}-${mm}-01`, fin: `${year}-${mm}-15` };
  }
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    inicio: `${year}-${mm}-16`,
    fin:    `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
  };
};

const TIPO_COLOR = {
  'Retardo':             'bg-amber-50 text-amber-700 border-amber-200',
  'Falta Justificada':   'bg-blue-50 text-blue-700 border-blue-200',
  'Falta Injustificada': 'bg-red-50 text-red-700 border-red-200',
  'Ausencia Temporal':   'bg-orange-50 text-orange-700 border-orange-200',
};

// ── Sub-components ─────────────────────────────────────────────────────────
const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const StatCard = ({ label, value, sub, colorClass, icon: Icon }) => (
  <div className={`rounded-2xl border p-5 flex items-center gap-4 ${colorClass}`}>
    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-70">{label}</p>
      <p className="text-xl font-black mt-0.5">{value}</p>
      {sub && <p className="text-[11px] opacity-60 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
const CalculoQuincena = () => {
  const navigate = useNavigate();
  const today    = new Date();

  const [activeNav, setActiveNav]       = useState('quincena');
  const [mes, setMes]                   = useState(today.getMonth());
  const [anio, setAnio]                 = useState(today.getFullYear());
  const [quincena, setQuincena]         = useState(today.getDate() <= 15 ? 1 : 2);
  const [soloAfectados, setSoloAfectados] = useState(false);
  const [personal, setPersonal]         = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [apiError, setApiError]         = useState('');
  const [desglose, setDesglose]         = useState(null);

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    navigate(item.path);
  };

  // Cargar personal activo
  useEffect(() => {
    setCargando(true);
    fetch('http://localhost:4000/api/personal')
      .then((r) => r.json())
      .then((data) => {
        const activos = (Array.isArray(data) ? data : []).filter(
          (p) => p.activo !== false,
        );
        setPersonal(activos);
      })
      .catch(() => setApiError('No se pudo cargar el personal desde el servidor.'))
      .finally(() => setCargando(false));
  }, []);

  // Navegación entre periodos
  const prevPeriodo = () => {
    if (quincena === 2) {
      setQuincena(1);
    } else {
      setQuincena(2);
      if (mes === 0) { setMes(11); setAnio((a) => a - 1); }
      else setMes((m) => m - 1);
    }
  };
  const nextPeriodo = () => {
    if (quincena === 1) {
      setQuincena(2);
    } else {
      setQuincena(1);
      if (mes === 11) { setMes(0); setAnio((a) => a + 1); }
      else setMes((m) => m + 1);
    }
  };

  // Datos del periodo seleccionado
  const { inicio, fin } = useMemo(
    () => getPeriodDates(anio, mes, quincena),
    [anio, mes, quincena],
  );

  // Todas las incidencias del periodo
  const incidenciasPeriodo = useMemo(() => {
    const todas = JSON.parse(localStorage.getItem(INCIDENCIAS_KEY) || '[]');
    return todas.filter((i) => i.fecha >= inicio && i.fecha <= fin);
  }, [inicio, fin]);

  // Filas de la tabla (una por empleado)
  const filas = useMemo(() => {
    if (!personal.length) return [];

    return personal.map((emp) => {
      const nombre        = nombreCompleto(emp);
      const sueldoMensual = SUELDO_MENSUAL[emp.puesto] ?? SUELDO_DEFAULT;
      const sueldoQ       = sueldoMensual / 2;
      const sueldoDiario  = sueldoQ / 15;

      const incEmp = incidenciasPeriodo.filter(
        (i) => i.empleadoId === emp.id || i.empleado === nombre,
      );

      const descuento = incEmp.reduce((sum, i) => {
        if (i.estatus !== 'INJUSTIFICADA') return sum;
        return sum + sueldoDiario * (FACTOR_DESCUENTO[i.tipoIncidencia] ?? 0);
      }, 0);

      return {
        id: emp.id,
        nombre,
        puesto:        emp.puesto       ?? '—',
        departamento:  emp.departamento ?? '—',
        sueldoMensual,
        sueldoQ,
        sueldoDiario,
        incidencias:   incEmp,
        descuento,
        neto:          sueldoQ - descuento,
        afectado:      descuento > 0,
      };
    });
  }, [personal, incidenciasPeriodo]);

  const filasVisibles = soloAfectados ? filas.filter((f) => f.afectado) : filas;

  // Resumen
  const totalNomina     = filas.reduce((s, f) => s + f.sueldoQ, 0);
  const totalDescuentos = filas.reduce((s, f) => s + f.descuento, 0);
  const totalNeto       = totalNomina - totalDescuentos;
  const numAfectados    = filas.filter((f) => f.afectado).length;

  const periodoLabel = `${quincena === 1 ? '1ª' : '2ª'} Quincena · ${MESES[mes]} ${anio}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">

          {/* Top bar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img
                src={marakameLogo}
                alt="Logo Nayarit Marakame"
                className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                  Módulo de Recursos Humanos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <span className="text-sm font-black text-[#7E1D3B]">RH</span>
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Recursos Humanos</p>
              </div>
            </div>
          </div>

          {/* Sidebar + Main */}
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon, key, path }) => (
                <button
                  key={key}
                  onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}
                >
                  {React.createElement(icon, { size: 15 })}
                  {label}
                </button>
              ))}
            </aside>

            <main className="space-y-5">

              <div>
                <h2 className="text-2xl font-black text-slate-800">Cálculo de Quincena</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">
                  Descuentos por incidencias no justificadas
                </p>
              </div>

              {/* Error de API */}
              {apiError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                  <AlertCircle size={16} className="shrink-0" />
                  {apiError}
                </div>
              )}

              {/* ── Selector de periodo ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevPeriodo}
                      className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition"
                    >
                      <ChevronLeft size={18} className="text-slate-600" />
                    </button>
                    <div className="text-center min-w-[220px]">
                      <p className="text-base font-black text-slate-800">{periodoLabel}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {fmtFecha(inicio)} — {fmtFecha(fin)}
                      </p>
                    </div>
                    <button
                      onClick={nextPeriodo}
                      className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition"
                    >
                      <ChevronRight size={18} className="text-slate-600" />
                    </button>
                  </div>

                  {/* Toggle filtro */}
                  <label className="flex items-center gap-2.5 cursor-pointer select-none self-start md:self-auto">
                    <div
                      onClick={() => setSoloAfectados((v) => !v)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        soloAfectados ? 'bg-[#7E1D3B]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          soloAfectados ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      Solo con descuentos
                    </span>
                  </label>
                </div>
              </section>

              {/* ── Tarjetas resumen ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Nómina Quincenal"
                  value={fmt(totalNomina)}
                  sub={`${filas.length} empleados`}
                  colorClass="bg-slate-50 border-slate-200 text-slate-700"
                  icon={DollarSign}
                />
                <StatCard
                  label="Total Descuentos"
                  value={fmt(totalDescuentos)}
                  sub={`${numAfectados} afectados`}
                  colorClass="bg-red-50 border-red-200 text-red-800"
                  icon={TrendingDown}
                />
                <StatCard
                  label="Neto a Pagar"
                  value={fmt(totalNeto)}
                  colorClass="bg-[#7E1D3B]/5 border-[#7E1D3B]/20 text-[#7E1D3B]"
                  icon={DollarSign}
                />
                <StatCard
                  label="Empleados Afectados"
                  value={numAfectados}
                  sub={`de ${filas.length} en nómina`}
                  colorClass="bg-amber-50 border-amber-200 text-amber-800"
                  icon={Users}
                />
              </div>

              {/* ── Tabla ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle
                  title={`Personal — ${filasVisibles.length} ${filasVisibles.length === 1 ? 'registro' : 'registros'}`}
                />

                {cargando ? (
                  <div className="flex items-center justify-center py-16 text-slate-400 text-sm font-semibold">
                    Cargando personal…
                  </div>
                ) : filasVisibles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Calculator size={36} className="mb-3 opacity-40" />
                    <p className="font-semibold text-sm">
                      {soloAfectados
                        ? 'No hay empleados con descuentos en este periodo.'
                        : 'No hay personal registrado.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Empleado</th>
                          <th className="px-4 py-3 text-right font-semibold">Sueldo Quincenal</th>
                          <th className="px-4 py-3 text-center font-semibold">Incidencias</th>
                          <th className="px-4 py-3 text-right font-semibold">Descuento</th>
                          <th className="px-4 py-3 text-right font-semibold">Total a Recibir</th>
                          <th className="px-4 py-3 text-center font-semibold">Desglose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filasVisibles.map((fila) => (
                          <tr
                            key={fila.id}
                            className={`transition ${fila.afectado ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-slate-50'}`}
                          >
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-800">{fila.nombre}</p>
                              <p className="text-xs text-slate-400">{fila.puesto}</p>
                              <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                {fila.departamento}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-700">
                              {fmt(fila.sueldoQ)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {fila.incidencias.length > 0 ? (
                                <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full text-xs font-black bg-amber-100 text-amber-700 border border-amber-200">
                                  {fila.incidencias.length}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {fila.descuento > 0 ? (
                                <span className="font-black text-red-600">
                                  -{fmt(fila.descuento)}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">$0.00</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-black text-slate-800">
                              {fmt(fila.neto)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => setDesglose(fila)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B] text-xs font-semibold hover:bg-[#7E1D3B]/20 transition"
                              >
                                Ver
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      {/* Totales */}
                      <tfoot className="border-t-2 border-slate-200">
                        <tr className="bg-slate-50 font-black text-slate-800">
                          <td className="px-4 py-3" colSpan={1}>TOTALES</td>
                          <td className="px-4 py-3 text-right">{fmt(totalNomina)}</td>
                          <td className="px-4 py-3" />
                          <td className="px-4 py-3 text-right text-red-700">
                            {totalDescuentos > 0 ? `-${fmt(totalDescuentos)}` : '$0.00'}
                          </td>
                          <td className="px-4 py-3 text-right text-[#7E1D3B]">{fmt(totalNeto)}</td>
                          <td className="px-4 py-3" />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </section>
            </main>
          </div>
        </header>
      </div>

      {/* ── Modal desglose ── */}
      {desglose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">

            {/* Cabecera */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <div>
                <p className="text-xs font-bold text-[#7E1D3B] uppercase tracking-wider">
                  Desglose de Quincena
                </p>
                <p className="font-black text-slate-800 text-lg leading-tight">{desglose.nombre}</p>
                <p className="text-sm text-slate-500">{desglose.puesto}</p>
              </div>
              <button
                onClick={() => setDesglose(null)}
                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition shrink-0 mt-0.5"
              >
                <X size={14} />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="overflow-y-auto px-6 py-5 space-y-5">

              {/* Resumen salarial */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Sueldo Mensual',    fmt(desglose.sueldoMensual)],
                  ['Sueldo Quincenal',  fmt(desglose.sueldoQ)],
                  ['Sueldo Diario',     fmt(desglose.sueldoDiario)],
                ].map(([label, val]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-black text-slate-800">{val}</p>
                  </div>
                ))}
              </div>

              {/* Periodo */}
              <div className="text-xs text-slate-400 font-medium">
                Periodo: <span className="text-slate-600 font-semibold">{periodoLabel}</span>
                &nbsp;({fmtFecha(inicio)} — {fmtFecha(fin)})
              </div>

              {/* Tabla de incidencias */}
              {desglose.incidencias.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Sin incidencias en este periodo.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5 text-left font-semibold">Fecha</th>
                        <th className="px-3 py-2.5 text-left font-semibold">Tipo</th>
                        <th className="px-3 py-2.5 text-center font-semibold">Estatus</th>
                        <th className="px-3 py-2.5 text-center font-semibold">Factor</th>
                        <th className="px-3 py-2.5 text-right font-semibold">Descuento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {desglose.incidencias.map((inc) => {
                        const factor    = inc.estatus === 'INJUSTIFICADA'
                          ? (FACTOR_DESCUENTO[inc.tipoIncidencia] ?? 0)
                          : 0;
                        const montoDesc = desglose.sueldoDiario * factor;
                        return (
                          <tr key={inc.id} className={`${factor > 0 ? 'bg-red-50/40' : ''}`}>
                            <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                              {fmtFecha(inc.fecha)}
                            </td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[11px] font-bold
                                  ${TIPO_COLOR[inc.tipoIncidencia] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}
                              >
                                {inc.tipoIncidencia}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-black border
                                  ${inc.estatus === 'JUSTIFICADA'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-red-50 text-red-700 border-red-200'}`}
                              >
                                {inc.estatus}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-center text-slate-500 font-semibold text-xs">
                              {factor > 0 ? `${(factor * 100).toFixed(0)} %` : '—'}
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold">
                              {montoDesc > 0
                                ? <span className="text-red-600">-{fmt(montoDesc)}</span>
                                : <span className="text-slate-300 text-xs">$0.00</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Resumen final */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                {[
                  ['Sueldo quincenal base', fmt(desglose.sueldoQ), 'text-slate-700'],
                  ['Total descuentos',      desglose.descuento > 0 ? `-${fmt(desglose.descuento)}` : '$0.00', 'text-red-600 font-black'],
                  ['Neto a recibir',        fmt(desglose.neto), 'text-[#7E1D3B] font-black text-base'],
                ].map(([label, val, valClass]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-0 last:bg-slate-50"
                  >
                    <span className="text-sm font-semibold text-slate-600">{label}</span>
                    <span className={`text-sm ${valClass}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setDesglose(null)}
                className="px-5 py-2 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold hover:bg-[#63162e] transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculoQuincena;
