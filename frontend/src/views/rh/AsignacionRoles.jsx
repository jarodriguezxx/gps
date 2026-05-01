import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, Tag, ShieldCheck, User, Save, X, ArrowRight, Clock, Trash2, Check, Pencil, KeyRound } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',       path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',       path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',   path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion', path: '/rh/asignacion-roles' },
  { label: 'Gestión de Accesos',  icon: KeyRound,    key: 'accesos',    path: '/rh/gestion-accesos' },
];

const TIPOS_MOVIMIENTO = ['PROMOCIÓN', 'CAMBIO DE PUESTO', 'CAMBIO DE DEPARTAMENTO', 'REASIGNACIÓN INTERNA'];

const DEPARTAMENTOS = [
  'DIRECCIÓN GENERAL',
  'UNIDAD DE TRANSPARENCIA',
  'DEPARTAMENTO DE ADMINISTRACIÓN',
  'DEPARTAMENTO CLÍNICO',
  'DEPARTAMENTO MÉDICO',
  'DEPARTAMENTO DE ADMISIONES',
  'DEPARTAMENTO DE MANTENIMIENTO E INTENDENCIA',
  'DEPARTAMENTO DE COCINA',
  'OFICINA DE RECURSOS MATERIALES',
];

const PUESTOS_POR_DEPARTAMENTO = {
  'DEPARTAMENTO DE ADMINISTRACIÓN': [
    'ASISTENTE CONTABLE',
    'ASISTENTE DE DIRECCIÓN',
    'CHOFER DE DIRECCIÓN',
    'DIRECTORA GENERAL',
    'ENCARGADA (O) DE RECURSOS FINANCIEROS',
    'ENCARGADA (O) DE RECURSOS MATERIALES',
    'ENCARGADA (O) DE RECURSOS HUMANOS',
    'JEFA (E) DEP. ADMINISTRACIÓN',
    'TITULAR DE UNIDAD JURÍDICA',
    'TITULAR DE LA UNIDAD DE TRANSPARENCIA',
    'ENCARGADA (O) DE DIFUSIÓN Y MEDIOS',
  ],
  'DEPARTAMENTO CLÍNICO': [
    'AUXILIAR ADMINISTRATIVO',
    'CONSEJERA (O) ASIGNADO',
    'COTERAPEUTA',
    'TERAPEUTA DE POST-TRATAMIENTO',
    'ENCARGADA (O) DE FAMILIA',
    'ENCARGADA (O) DE CONSEJEROS ASIGNADOS',
    'ENCARGADA (O) DE POST TRATAMIENTO',
    'JEFA (E) DEP. CLÍNICO',
    'TERAPEUTA DE GRUPO',
    'TERAPEUTA FAMILIAR',
  ],
  'DEPARTAMENTO DE ADMISIONES': [
    'JEFA (E) DEP. ADMISIONES',
    'ASESOR (A)',
    'ENCARGADA (O) DE PREVENCIÓN Y ESTADÍSTICA',
    'RECEPCIÓN',
  ],
  'DEPARTAMENTO DE MANTENIMIENTO E INTENDENCIA': [
    'ENCARGADA (O) DE MANTENIMIENTO E INTENDENCIA',
    'AUXILIAR DE MANTENIMIENTO',
    'AUXILIAR DE INTENDENCIA',
  ],
  'DEPARTAMENTO MÉDICO': [
    'JEFA (E) DEP. MÉDICO',
    'MÉDICO',
    'NUTRIÓLOGA (O)',
    'ENFERMERA (O)',
  ],
  'DEPARTAMENTO DE COCINA': [
    'AUXILIAR DE COCINA',
  ],
};

const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                   placeholder:text-slate-300 transition-all`;

const errClass = 'border-rose-300 bg-rose-50';

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 ml-0.5 text-xs text-rose-600 font-medium">{msg}</p> : null;

const FORM_INICIAL = { tipoMovimiento: '', nuevoDepartamento: '', nuevoPuesto: '', fechaEfectiva: '', motivo: '' };

const AsignacionRoles = () => {
  const navigate = useNavigate();
  const [activeNav] = useState('asignacion');

  // Autocomplete
  const [query, setQuery]                 = useState('');
  const [sugerencias, setSugerencias]     = useState([]);
  const [buscando, setBuscando]           = useState(false);
  const [dropdownAbierto, setDropdown]    = useState(false);
  const wrapperRef                        = useRef(null);

  // Empleado + form
  const [empleado, setEmpleado]           = useState(null);
  const [formData, setFormData]           = useState(FORM_INICIAL);
  const [errors, setErrors]               = useState({});
  const [loading, setLoading]             = useState(false);
  const [apiError, setApiError]           = useState('');
  const [success, setSuccess]             = useState('');

  // Historial
  const [historial, setHistorial]         = useState([]);
  const [cargandoHist, setCargandoHist]   = useState(false);
  const [editRows, setEditRows]           = useState({});

  const puestos = PUESTOS_POR_DEPARTAMENTO[formData.nuevoDepartamento] ?? [];

  // Cerrar dropdown al clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Búsqueda en tiempo real con debounce 300 ms
  useEffect(() => {
    if (!query.trim()) { setSugerencias([]); setDropdown(false); return; }
    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        const res  = await fetch(`http://localhost:4000/api/asignaciones/personal-activo?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setSugerencias(data);
        setDropdown(true);
      } catch { setApiError('No se pudo conectar con el servidor.'); }
      finally { setBuscando(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Cargar historial al seleccionar empleado
  useEffect(() => {
    if (!empleado) { setHistorial([]); return; }
    const fetchHistorial = async () => {
      setCargandoHist(true);
      try {
        const res  = await fetch(`http://localhost:4000/api/asignaciones/historial/${empleado.id}`);
        const data = await res.json();
        setHistorial(data);
      } catch { /* historial opcional, no bloquea */ }
      finally { setCargandoHist(false); }
    };
    fetchHistorial();
  }, [empleado]);

  // Auto-editar filas con datos faltantes al cargar el historial
  useEffect(() => {
    setEditRows(prev => {
      const next = { ...prev };
      historial.forEach(mov => {
        if (!next[mov.id] &&
            (!mov.departamentoAnterior || !mov.puestoAnterior || !mov.departamentoNuevo || !mov.puestoNuevo)) {
          next[mov.id] = {
            departamentoAnterior: mov.departamentoAnterior || '',
            puestoAnterior:       mov.puestoAnterior       || '',
            departamentoNuevo:    mov.departamentoNuevo    || '',
            puestoNuevo:          mov.puestoNuevo          || '',
          };
        }
      });
      return next;
    });
  }, [historial]);

  const seleccionar = (emp) => {
    setEmpleado(emp);
    setQuery('');
    setSugerencias([]);
    setDropdown(false);
    setFormData({ ...FORM_INICIAL, nuevoDepartamento: emp.departamento, nuevoPuesto: emp.puesto });
    setErrors({});
    setApiError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'nuevoDepartamento' ? { nuevoPuesto: '' } : {}),
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const e = {};
    if (!formData.tipoMovimiento)    e.tipoMovimiento    = 'Selecciona el tipo de movimiento.';
    if (!formData.nuevoDepartamento) e.nuevoDepartamento = 'Selecciona el departamento.';
    if (!formData.nuevoPuesto.trim()) e.nuevoPuesto      = 'Indica el nuevo puesto.';
    if (!formData.fechaEfectiva)     e.fechaEfectiva     = 'Selecciona la fecha efectiva.';
    if (
      formData.nuevoDepartamento === empleado?.departamento &&
      formData.nuevoPuesto === empleado?.puesto
    ) {
      e.nuevoPuesto = 'El puesto y departamento son iguales a los actuales.';
    }
    return e;
  };

  const eliminarMovimiento = async (movId) => {
    if (!window.confirm('¿Eliminar este registro del historial?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/asignaciones/historial/${movId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar.');
      setHistorial(prev => prev.filter(m => m.id !== movId));
    } catch (err) {
      setApiError(err.message);
    }
  };

  const iniciarEdicion = (mov) => {
    setEditRows(prev => ({
      ...prev,
      [mov.id]: {
        departamentoAnterior: mov.departamentoAnterior || '',
        puestoAnterior:       mov.puestoAnterior       || '',
        departamentoNuevo:    mov.departamentoNuevo    || '',
        puestoNuevo:          mov.puestoNuevo          || '',
      },
    }));
  };

  const cancelarEdicion = (movId) => {
    setEditRows(prev => { const n = { ...prev }; delete n[movId]; return n; });
  };

  const handleEditChange = (movId, field, value) => {
    setEditRows(prev => ({
      ...prev,
      [movId]: {
        ...prev[movId],
        [field]: value,
        ...(field === 'departamentoAnterior' ? { puestoAnterior: '' } : {}),
        ...(field === 'departamentoNuevo'    ? { puestoNuevo: '' }    : {}),
      },
    }));
  };

  const guardarEdicion = async (movId) => {
    const edit = editRows[movId];
    try {
      const res = await fetch(`http://localhost:4000/api/asignaciones/historial/${movId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edit),
      });
      if (!res.ok) throw new Error('Error al actualizar el registro.');
      setHistorial(prev => prev.map(m => m.id === movId ? { ...m, ...edit } : m));
      cancelarEdicion(movId);
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleGuardar = async () => {
    setApiError(''); setSuccess('');
    const ve = validar();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/asignaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalId:        empleado.id,
          tipoMovimiento:    formData.tipoMovimiento,
          departamentoNuevo: formData.nuevoDepartamento,
          puestoNuevo:       formData.nuevoPuesto,
          motivo:            formData.motivo,
          fechaEfectiva:     formData.fechaEfectiva,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar el movimiento.');

      setSuccess('Movimiento registrado correctamente.');
      // Actualizar el empleado en pantalla con los nuevos datos
      const empActualizado = { ...empleado, departamento: formData.nuevoDepartamento, puesto: formData.nuevoPuesto };
      setEmpleado(empActualizado);
      setFormData({ ...FORM_INICIAL, nuevoDepartamento: empActualizado.departamento, nuevoPuesto: empActualizado.puesto });
      // Recargar historial
      const resH = await fetch(`http://localhost:4000/api/asignaciones/historial/${empleado.id}`);
      setHistorial(await resH.json());
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nombreCompleto = (emp) =>
    `${emp.nombre} ${emp.apellidoPaterno} ${emp.apellidoMaterno}`.trim();

  // Vista previa del cambio
  const cambioDept  = empleado && formData.nuevoDepartamento && formData.nuevoDepartamento !== empleado.departamento;
  const cambioPuesto = empleado && formData.nuevoPuesto && formData.nuevoPuesto !== empleado.puesto;
  const hayPreview  = cambioDept || cambioPuesto;

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
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Recursos Humanos</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* Sidebar */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => navigate(path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <Icon size={15} />{label}
                </button>
              ))}
            </aside>

            {/* Main */}
            <main className="space-y-5">

              <div>
                <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Asignación de Roles y Promociones</p>
              </div>

              {apiError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium">
                  {apiError}
                </div>
              )}
              {success && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
                  {success}
                </div>
              )}

              {/* ── Buscar Empleado ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Buscar Empleado" />
                <div ref={wrapperRef} className="relative">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                    Nombre del empleado
                  </label>
                  <div className="relative">
                    <input type="text" value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => sugerencias.length > 0 && setDropdown(true)}
                      placeholder="Escribe el nombre para buscar..."
                      className={`${inputClass} pr-10`} />
                    {query && (
                      <button onClick={() => { setQuery(''); setSugerencias([]); setDropdown(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 ml-0.5 text-xs text-slate-400">
                    {buscando ? 'Buscando...' : 'Los resultados aparecen mientras escribes.'}
                  </p>

                  {/* Dropdown */}
                  {dropdownAbierto && sugerencias.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                      {sugerencias.map((emp, i) => (
                        <button key={emp.id} onMouseDown={() => seleccionar(emp)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#7E1D3B]/5 transition
                                      ${i < sugerencias.length - 1 ? 'border-b border-slate-100' : ''}`}>
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
                  {dropdownAbierto && !buscando && sugerencias.length === 0 && query.trim() && (
                    <div className="absolute z-10 left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg px-4 py-3">
                      <p className="text-sm text-slate-400 text-center">No se encontraron empleados activos.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* ── Formulario de Movimiento ── */}
              {empleado && (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <SectionTitle title="Registrar Movimiento" />

                  {/* Tarjeta empleado */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="h-14 w-14 rounded-full bg-[#7E1D3B]/10 border-2 border-[#7E1D3B]/20 flex items-center justify-center shrink-0">
                      <User size={24} className="text-[#7E1D3B]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-800 text-base">{nombreCompleto(empleado)}</p>
                      <p className="text-sm text-slate-500">{empleado.puesto}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider
                                       bg-[#7E1D3B]/10 text-[#7E1D3B] px-2 py-0.5 rounded-full">
                        {empleado.departamento}
                      </span>
                    </div>
                    <button onClick={() => setEmpleado(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 transition underline shrink-0">
                      Cambiar
                    </button>
                  </div>

                  {/* Campos del movimiento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Tipo de movimiento */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Tipo de Movimiento<span className="text-[#7E1D3B] ml-0.5">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TIPOS_MOVIMIENTO.map((tipo) => (
                          <button key={tipo} type="button"
                            onClick={() => { setFormData(p => ({ ...p, tipoMovimiento: tipo })); setErrors(p => ({ ...p, tipoMovimiento: '' })); }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                              formData.tipoMovimiento === tipo
                                ? 'bg-[#7E1D3B] text-white border-[#7E1D3B] shadow-sm'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#7E1D3B]/40 hover:text-[#7E1D3B]'
                            }`}>
                            {tipo}
                          </button>
                        ))}
                      </div>
                      <FieldError msg={errors.tipoMovimiento} />
                    </div>

                    {/* Nuevo departamento */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Nuevo Departamento<span className="text-[#7E1D3B] ml-0.5">*</span>
                      </label>
                      <select name="nuevoDepartamento" value={formData.nuevoDepartamento} onChange={handleChange}
                        className={`${inputClass} ${errors.nuevoDepartamento ? errClass : ''}`}>
                        <option value="">— Seleccionar —</option>
                        {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <FieldError msg={errors.nuevoDepartamento} />
                    </div>

                    {/* Nuevo puesto — select si hay opciones, input si no */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Nuevo Puesto<span className="text-[#7E1D3B] ml-0.5">*</span>
                      </label>
                      {puestos.length > 0 ? (
                        <select name="nuevoPuesto" value={formData.nuevoPuesto} onChange={handleChange}
                          className={`${inputClass} ${errors.nuevoPuesto ? errClass : ''}`}>
                          <option value="">— Seleccionar —</option>
                          {puestos.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      ) : (
                        <input type="text" name="nuevoPuesto" value={formData.nuevoPuesto} onChange={handleChange}
                          placeholder="Escribe el puesto..."
                          className={`${inputClass} ${errors.nuevoPuesto ? errClass : ''}`} />
                      )}
                      <FieldError msg={errors.nuevoPuesto} />
                    </div>

                    {/* Fecha efectiva */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Fecha Efectiva<span className="text-[#7E1D3B] ml-0.5">*</span>
                      </label>
                      <input type="date" name="fechaEfectiva" value={formData.fechaEfectiva} onChange={handleChange}
                        className={`${inputClass} ${errors.fechaEfectiva ? errClass : ''}`} />
                      <FieldError msg={errors.fechaEfectiva} />
                    </div>

                    {/* Motivo */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Motivo del Movimiento
                      </label>
                      <input type="text" name="motivo" value={formData.motivo} onChange={handleChange}
                        placeholder="Ej. Desempeño sobresaliente..."
                        className={inputClass} />
                    </div>
                  </div>

                  {/* ── Vista previa del cambio ── */}
                  {hayPreview && (
                    <div className="rounded-xl bg-[#7E1D3B]/4 border border-[#7E1D3B]/15 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.15em] text-[#7E1D3B] mb-3">
                        Vista previa del cambio
                      </p>
                      <div className="flex flex-col gap-2">
                        {cambioDept && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-xs font-bold text-slate-500 w-24 shrink-0">Departamento</span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-xs">
                              {empleado.departamento || '—'}
                            </span>
                            <ArrowRight size={14} className="text-[#7E1D3B] shrink-0" />
                            <span className="px-2.5 py-1 rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B] font-bold text-xs">
                              {formData.nuevoDepartamento}
                            </span>
                          </div>
                        )}
                        {cambioPuesto && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-xs font-bold text-slate-500 w-24 shrink-0">Puesto</span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-xs">
                              {empleado.puesto || '—'}
                            </span>
                            <ArrowRight size={14} className="text-[#7E1D3B] shrink-0" />
                            <span className="px-2.5 py-1 rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B] font-bold text-xs">
                              {formData.nuevoPuesto}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-3 justify-end pt-1">
                    <button onClick={() => setEmpleado(null)}
                      className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl
                                 text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm">
                      <X size={15} /> Cancelar
                    </button>
                    <button onClick={handleGuardar} disabled={loading}
                      className="flex items-center gap-2 px-8 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                                 font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm
                                 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Save size={15} /> {loading ? 'Guardando...' : 'Guardar Movimiento'}
                    </button>
                  </div>
                </section>
              )}

              {/* ── Historial de Movimientos ── */}
              {empleado && (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <Clock size={14} className="text-[#7E1D3B]" />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                      Historial de Movimientos
                    </h2>
                  </div>

                  {cargandoHist ? (
                    <p className="text-sm text-slate-400 text-center py-4">Cargando historial...</p>
                  ) : historial.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">Sin movimientos registrados para este empleado.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-100">
                            {['Tipo', 'Dept. anterior', 'Puesto anterior', 'Dept. nuevo', 'Puesto nuevo', 'Fecha efectiva', 'Motivo', ''].map(h => (
                              <th key={h} className="px-3 py-2.5 text-left text-[11px] font-black uppercase tracking-[0.12em] text-slate-400 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {historial.map((mov) => {
                            const editing = !!editRows[mov.id];
                            const ed = editRows[mov.id] || {};
                            const puestosAnt = PUESTOS_POR_DEPARTAMENTO[ed.departamentoAnterior] ?? [];
                            const puestosNvo = PUESTOS_POR_DEPARTAMENTO[ed.departamentoNuevo]    ?? [];
                            const cs = 'w-full px-1.5 py-1 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#7E1D3B]/30 min-w-[130px]';
                            return (
                            <tr key={mov.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                              {/* Tipo */}
                              <td className="px-3 py-2">
                                <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-[#7E1D3B]/10 text-[#7E1D3B] px-2 py-0.5 rounded-full whitespace-nowrap">
                                  {mov.tipoMovimiento || '—'}
                                </span>
                              </td>

                              {/* Dept. anterior */}
                              <td className="px-2 py-2">
                                {editing ? (
                                  <select value={ed.departamentoAnterior} onChange={e => handleEditChange(mov.id, 'departamentoAnterior', e.target.value)} className={cs}>
                                    <option value="">— Seleccionar —</option>
                                    {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                ) : <span className="text-slate-500 text-xs">{mov.departamentoAnterior || '—'}</span>}
                              </td>

                              {/* Puesto anterior */}
                              <td className="px-2 py-2">
                                {editing ? (
                                  puestosAnt.length > 0
                                    ? <select value={ed.puestoAnterior} onChange={e => handleEditChange(mov.id, 'puestoAnterior', e.target.value)} className={cs}>
                                        <option value="">— Seleccionar —</option>
                                        {puestosAnt.map(p => <option key={p} value={p}>{p}</option>)}
                                      </select>
                                    : <input value={ed.puestoAnterior} onChange={e => handleEditChange(mov.id, 'puestoAnterior', e.target.value)} placeholder="Puesto..." className={cs} />
                                ) : <span className="text-slate-500 text-xs">{mov.puestoAnterior || '—'}</span>}
                              </td>

                              {/* Dept. nuevo */}
                              <td className="px-2 py-2">
                                {editing ? (
                                  <select value={ed.departamentoNuevo} onChange={e => handleEditChange(mov.id, 'departamentoNuevo', e.target.value)} className={cs}>
                                    <option value="">— Seleccionar —</option>
                                    {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                ) : <span className="text-slate-700 text-xs font-medium">{mov.departamentoNuevo || '—'}</span>}
                              </td>

                              {/* Puesto nuevo */}
                              <td className="px-2 py-2">
                                {editing ? (
                                  puestosNvo.length > 0
                                    ? <select value={ed.puestoNuevo} onChange={e => handleEditChange(mov.id, 'puestoNuevo', e.target.value)} className={cs}>
                                        <option value="">— Seleccionar —</option>
                                        {puestosNvo.map(p => <option key={p} value={p}>{p}</option>)}
                                      </select>
                                    : <input value={ed.puestoNuevo} onChange={e => handleEditChange(mov.id, 'puestoNuevo', e.target.value)} placeholder="Puesto..." className={cs} />
                                ) : <span className="text-slate-700 text-xs font-medium">{mov.puestoNuevo || '—'}</span>}
                              </td>

                              {/* Fecha */}
                              <td className="px-3 py-2 text-slate-500 text-xs whitespace-nowrap">{mov.fechaEfectiva || '—'}</td>

                              {/* Motivo */}
                              <td className="px-3 py-2 text-slate-400 text-xs">{mov.motivo || '—'}</td>

                              {/* Acciones */}
                              <td className="px-2 py-2">
                                <div className="flex items-center gap-1">
                                  {editing ? (
                                    <>
                                      <button onClick={() => guardarEdicion(mov.id)} title="Guardar"
                                        className="p-1 rounded-lg text-emerald-500 hover:bg-emerald-50 transition">
                                        <Check size={13} />
                                      </button>
                                      <button onClick={() => cancelarEdicion(mov.id)} title="Cancelar"
                                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition">
                                        <X size={13} />
                                      </button>
                                    </>
                                  ) : (
                                    <button onClick={() => iniciarEdicion(mov)} title="Editar"
                                      className="p-1 rounded-lg text-slate-300 hover:text-[#7E1D3B] hover:bg-[#7E1D3B]/5 transition">
                                      <Pencil size={13} />
                                    </button>
                                  )}
                                  <button onClick={() => eliminarMovimiento(mov.id)} title="Eliminar"
                                    className="p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition">
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default AsignacionRoles;
