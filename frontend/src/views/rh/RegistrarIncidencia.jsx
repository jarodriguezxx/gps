import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, UserMinus, Tag, ShieldCheck, Wallet,
  AlertTriangle, ClipboardList, Save, CheckCircle, User, X,
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',     icon: UserPlus,      key: 'alta',              path: '/rh/alta-personal' },
  { label: 'Baja de Personal',     icon: UserMinus,     key: 'baja',              path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',    icon: Tag,           key: 'catalogo',          path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles',  icon: ShieldCheck,   key: 'asignacion',        path: '/rh/asignacion-roles' },
  { label: 'Nómina',               icon: Wallet,        key: 'nomina',            path: '/rh/nomina' },
  { label: 'Registrar Incidencia', icon: AlertTriangle, key: 'incidencias',       path: '/rh/registrar-incidencia' },
  { label: 'Tabla de Incidencias', icon: ClipboardList, key: 'tabla-incidencias', path: '/rh/tabla-incidencias' },
];

const TIPOS_INCIDENCIA = [
  { value: 'Retardo',             descripcion: 'Llegada tarde al turno' },
  { value: 'Falta Justificada',   descripcion: 'Ausencia con justificante válido' },
  { value: 'Falta Injustificada', descripcion: 'Ausencia sin justificante ni previo aviso' },
  { value: 'Ausencia Temporal',   descripcion: 'Salida anticipada o ausencia parcial del turno' },
];

const INCIDENCIAS_KEY = 'marakame_incidencias';

const nombreCompleto = (emp) =>
  `${emp.nombre ?? ''} ${emp.apellidoPaterno ?? ''} ${emp.apellidoMaterno ?? ''}`.trim();

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const RegistrarIncidencia = () => {
  const navigate    = useNavigate();
  const wrapperRef  = useRef(null);

  const [activeNav, setActiveNav] = useState('incidencias');

  // Autocomplete
  const [query, setQuery]               = useState('');
  const [sugerencias, setSugerencias]   = useState([]);
  const [buscando, setBuscando]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [empleado, setEmpleado]         = useState(null);
  const [apiError, setApiError]         = useState('');

  // Formulario
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipoIncidencia: '',
    observaciones: '',
  });
  const [success, setSuccess] = useState(false);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Búsqueda con debounce 300 ms
  useEffect(() => {
    if (!query.trim()) {
      setSugerencias([]);
      setDropdownOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setBuscando(true);
      setApiError('');
      try {
        const res  = await fetch(
          `http://localhost:4000/api/asignaciones/personal-activo?q=${encodeURIComponent(query.trim())}`,
        );
        const data = await res.json();
        setSugerencias(data);
        setDropdownOpen(true);
      } catch {
        setApiError('No se pudo conectar con el servidor.');
      } finally {
        setBuscando(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const seleccionar = (emp) => {
    setEmpleado(emp);
    setQuery('');
    setSugerencias([]);
    setDropdownOpen(false);
  };

  const limpiarEmpleado = () => {
    setEmpleado(null);
    setQuery('');
    setSugerencias([]);
    setDropdownOpen(false);
  };

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    navigate(item.path);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!empleado || !form.fecha || !form.tipoIncidencia) return;

    const tipo = TIPOS_INCIDENCIA.find((t) => t.value === form.tipoIncidencia);
    const registro = {
      id: Date.now(),
      fecha: form.fecha,
      empleadoId: empleado.id,
      empleado: nombreCompleto(empleado),
      puesto: empleado.puesto ?? '',
      departamento: empleado.departamento ?? '',
      tipoIncidencia: form.tipoIncidencia,
      descripcionTipo: tipo?.descripcion || '',
      observaciones: form.observaciones.trim(),
      estatus: 'INJUSTIFICADA',
    };

    const existing = JSON.parse(localStorage.getItem(INCIDENCIAS_KEY) || '[]');
    localStorage.setItem(INCIDENCIAS_KEY, JSON.stringify([...existing, registro]));

    setSuccess(true);
    setEmpleado(null);
    setForm({
      fecha: new Date().toISOString().split('T')[0],
      tipoIncidencia: '',
      observaciones: '',
    });
    setTimeout(() => setSuccess(false), 3500);
  };

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
                <h2 className="text-2xl font-black text-slate-800">Registrar Incidencia</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">
                  Reporte de faltas y ausencias del personal
                </p>
              </div>

              {apiError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                  {apiError}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <CheckCircle size={18} className="shrink-0" />
                  <span className="font-semibold text-sm">Incidencia registrada correctamente.</span>
                </div>
              )}

              {/* Buscar empleado */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Buscar Empleado" />

                {!empleado ? (
                  <div ref={wrapperRef} className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Nombre del empleado
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => sugerencias.length > 0 && setDropdownOpen(true)}
                        placeholder="Escribe el nombre para buscar..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/60"
                      />
                      {query && (
                        <button
                          onClick={() => { setQuery(''); setSugerencias([]); setDropdownOpen(false); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {buscando ? 'Buscando...' : 'Los resultados aparecen mientras escribes.'}
                    </p>

                    {/* Dropdown coincidencias */}
                    {dropdownOpen && sugerencias.length > 0 && (
                      <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                        {sugerencias.map((emp, i) => (
                          <button
                            key={emp.id}
                            onMouseDown={() => seleccionar(emp)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#7E1D3B]/5 transition
                              ${i < sugerencias.length - 1 ? 'border-b border-slate-100' : ''}`}
                          >
                            <div className="h-8 w-8 rounded-full bg-[#7E1D3B]/10 flex items-center justify-center shrink-0">
                              <User size={15} className="text-[#7E1D3B]" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{nombreCompleto(emp)}</p>
                              <p className="text-xs text-slate-400">{emp.puesto} · {emp.departamento}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {dropdownOpen && !buscando && sugerencias.length === 0 && query.trim() && (
                      <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg px-4 py-3">
                        <p className="text-sm text-slate-400 text-center">No se encontraron empleados activos.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Tarjeta empleado seleccionado */
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="h-12 w-12 rounded-full bg-[#7E1D3B]/10 border-2 border-[#7E1D3B]/20 flex items-center justify-center shrink-0">
                      <User size={20} className="text-[#7E1D3B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800">{nombreCompleto(empleado)}</p>
                      <p className="text-sm text-slate-500">{empleado.puesto}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider bg-[#7E1D3B]/10 text-[#7E1D3B] px-2 py-0.5 rounded-full">
                        {empleado.departamento}
                      </span>
                    </div>
                    <button
                      onClick={limpiarEmpleado}
                      className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition shrink-0"
                      title="Cambiar empleado"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </section>

              {/* Formulario de incidencia — visible solo con empleado seleccionado */}
              {empleado && (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <SectionTitle title="Datos de la Incidencia" />

                  <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Fecha de la Incidencia *
                      </label>
                      <input
                        type="date"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/60"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tipo de Incidencia *
                      </label>
                      <select
                        name="tipoIncidencia"
                        value={form.tipoIncidencia}
                        onChange={handleChange}
                        required
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/60 bg-white"
                      >
                        <option value="">Seleccionar tipo de incidencia...</option>
                        {TIPOS_INCIDENCIA.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.value} — {t.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Observaciones
                      </label>
                      <textarea
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Detalles adicionales sobre la incidencia..."
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/60 resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold hover:bg-[#63162e] transition shadow-md"
                      >
                        <Save size={15} />
                        Guardar Incidencia
                      </button>
                    </div>

                  </form>
                </section>
              )}

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default RegistrarIncidencia;
