import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, Tag, ShieldCheck, User, AlertTriangle, X } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',      path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',      path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',  path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion',path: '/rh/asignacion-roles' },
];

const MOTIVOS_BAJA = [
  'RENUNCIA VOLUNTARIA',
  'DESPIDO JUSTIFICADO',
  'DESPIDO INJUSTIFICADO',
  'TÉRMINO DE CONTRATO',
  'PENSIÓN / JUBILACIÓN',
  'FALLECIMIENTO',
  'ABANDONO DE EMPLEO',
  'INCAPACIDAD PERMANENTE',
  'MUTUO ACUERDO',
];

const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                   placeholder:text-slate-300 transition-all`;

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const FORM_INICIAL = { fechaBaja: '', motivoBaja: '', observaciones: '' };

const BajaPersonal = () => {
  const navigate = useNavigate();

  // Autocomplete
  const [query, setQuery]           = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [buscando, setBuscando]     = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const wrapperRef = useRef(null);

  // Selección y formulario
  const [empleado, setEmpleado]     = useState(null);
  const [formData, setFormData]     = useState(FORM_INICIAL);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState('');
  const [success, setSuccess]       = useState(false);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Búsqueda en tiempo real con debounce de 300 ms
  useEffect(() => {
    if (!query.trim()) {
      setSugerencias([]);
      setDropdownAbierto(false);
      return;
    }

    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        const params = new URLSearchParams({ q: query.trim() });
        const res = await fetch(`http://localhost:4000/api/bajas/personal-activo?${params}`);
        const data = await res.json();
        setSugerencias(data);
        setDropdownAbierto(true);
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
    setDropdownAbierto(false);
    setFormData(FORM_INICIAL);
    setErrors({});
    setApiError('');
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const e = {};
    if (!formData.fechaBaja)  e.fechaBaja  = 'Selecciona la fecha de baja.';
    if (!formData.motivoBaja) e.motivoBaja = 'Selecciona el motivo de baja.';
    return e;
  };

  const handleConfirmar = async () => {
    setApiError('');
    setSuccess(false);
    const ve = validar();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/bajas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalId: empleado.id, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar la baja.');
      setSuccess(true);
      setEmpleado(null);
      setFormData(FORM_INICIAL);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nombreCompleto = (emp) =>
    `${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`.trim();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">

          {/* ── Top bar ── */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame"
                className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo de Recursos Humanos</p>
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

          {/* ── Layout ── */}
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* Sidebar */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => navigate(path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    key === 'baja'
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </aside>

            {/* Main */}
            <main className="space-y-5">

              <div>
                <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Procesar Baja de Personal</p>
              </div>

              {apiError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium">
                  {apiError}
                </div>
              )}
              {success && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
                  Baja registrada correctamente. El empleado ha sido marcado como inactivo.
                </div>
              )}

              {/* ── Buscar Empleado ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Buscar Empleado" />

                <div ref={wrapperRef} className="relative">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                    Nombre del empleado
                  </label>

                  {/* Input con indicador de carga */}
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => sugerencias.length > 0 && setDropdownAbierto(true)}
                      placeholder="Escribe el nombre para buscar..."
                      className={`${inputClass} pr-10`}
                    />
                    {query && (
                      <button
                        onClick={() => { setQuery(''); setSugerencias([]); setDropdownAbierto(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <p className="mt-1 ml-0.5 text-xs text-slate-400">
                    {buscando ? 'Buscando...' : 'Los resultados aparecen mientras escribes.'}
                  </p>

                  {/* Dropdown de sugerencias */}
                  {dropdownAbierto && sugerencias.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                      {sugerencias.map((emp, i) => (
                        <button
                          key={emp.id}
                          onMouseDown={() => seleccionar(emp)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#7E1D3B]/5 transition
                                      ${i < sugerencias.length - 1 ? 'border-b border-slate-100' : ''}`}>
                          <div className="h-8 w-8 rounded-full bg-[#7E1D3B]/10 flex items-center justify-center shrink-0">
                            <User size={15} className="text-[#7E1D3B]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{nombreCompleto(emp)}</p>
                            <p className="text-xs text-slate-400">
                              {[emp.puesto, emp.departamento].filter(Boolean).join(' · ') || 'Sin asignación de puesto'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {dropdownAbierto && !buscando && sugerencias.length === 0 && query.trim() && (
                    <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg px-4 py-3">
                      <p className="text-sm text-slate-400 text-center">No se encontraron empleados activos.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* ── Datos de la Baja ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Datos de la Baja" />

                {empleado ? (
                  <>
                    {/* Tarjeta empleado seleccionado */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                      <div className="h-14 w-14 rounded-full bg-[#7E1D3B]/10 border-2 border-[#7E1D3B]/20 flex items-center justify-center shrink-0">
                        <User size={24} className="text-[#7E1D3B]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-800 text-base">{nombreCompleto(empleado)}</p>
                        <p className="text-sm text-slate-500">{empleado.puesto || 'Sin puesto asignado'}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider
                                         bg-[#7E1D3B]/10 text-[#7E1D3B] px-2 py-0.5 rounded-full">
                          {empleado.departamento || 'Sin departamento'}
                        </span>
                      </div>
                      <button onClick={() => setEmpleado(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 transition underline shrink-0">
                        Cambiar
                      </button>
                    </div>

                    {/* Campos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                          Fecha de Baja<span className="text-[#7E1D3B] ml-0.5">*</span>
                        </label>
                        <input type="date" name="fechaBaja" value={formData.fechaBaja}
                          onChange={handleChange}
                          className={`${inputClass} ${errors.fechaBaja ? 'border-rose-300 bg-rose-50' : ''}`} />
                        {errors.fechaBaja && <p className="mt-1 ml-0.5 text-xs text-rose-600 font-medium">{errors.fechaBaja}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                          Motivo de Baja<span className="text-[#7E1D3B] ml-0.5">*</span>
                        </label>
                        <select name="motivoBaja" value={formData.motivoBaja} onChange={handleChange}
                          className={`${inputClass} ${errors.motivoBaja ? 'border-rose-300 bg-rose-50' : ''}`}>
                          <option value="">— Seleccionar —</option>
                          {MOTIVOS_BAJA.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        {errors.motivoBaja && <p className="mt-1 ml-0.5 text-xs text-rose-600 font-medium">{errors.motivoBaja}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Observaciones
                      </label>
                      <textarea rows={4} name="observaciones" value={formData.observaciones}
                        onChange={handleChange}
                        placeholder="Información adicional sobre la baja..."
                        className={`${inputClass} resize-none`} />
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                      <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 font-medium">
                        Al confirmar, el empleado quedará como inactivo y se conservará su historial en el sistema.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    Busca y selecciona un empleado para continuar.
                  </div>
                )}
              </section>

              {/* ── Acciones ── */}
              <div className="flex gap-3 pb-2">
                <button onClick={handleConfirmar}
                  disabled={loading || !empleado}
                  className="flex items-center gap-2 px-8 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold
                             hover:bg-[#63162e] shadow-sm transition-all text-sm
                             disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Procesando...' : 'Confirmar Baja'}
                </button>
                <button onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-8 py-2.5 border border-slate-200 rounded-xl text-slate-600
                             hover:bg-slate-50 transition-all font-semibold shadow-sm text-sm">
                  Cancelar
                </button>
              </div>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default BajaPersonal;
