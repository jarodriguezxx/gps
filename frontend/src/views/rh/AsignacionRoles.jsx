import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, Tag, ShieldCheck, Search, User, Save, X } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',       path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',       path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',   path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion', path: '/rh/asignacion-roles' },
];

const empleadosMock = [
  { id: 1, nombre: 'Oswaldo Díaz Crespo',    puesto: 'Jefe Departamento Admisiones',  departamento: 'Admisiones',     rolActual: 'Jefe Dept. Admisiones' },
  { id: 2, nombre: 'Jaime Rodríguez',        puesto: 'Jefe Departamento Clínico',     departamento: 'Clínico',        rolActual: 'Jefe Depto. Clínico' },
  { id: 3, nombre: 'Laura Medina Torres',    puesto: 'Enfermera General',             departamento: 'Enfermería',     rolActual: 'Resp. Transparencia' },
  { id: 4, nombre: 'Marco Pineda Ruiz',      puesto: 'Trabajador Social',             departamento: 'Social',         rolActual: 'Jefe Depto. Medico' },
  { id: 5, nombre: 'Ana Torres Vela',        puesto: 'Recepcionista',                 departamento: 'Administración', rolActual: 'Jefe Recursos Materiales' },
];

const rolesCatalogo = [
  'Directora General',
  'Resp. Transparencia',
  'Jefe Depto. Clínico',
  'Jefe Depto. Medico',
  'Jefe Dept. Admisiones',
  'Jefe Recursos Materiales',
];

const PERMISOS_ADICIONALES = [
  'Ingreso de Pacientes',
  'Consulta de Expedientes',
  'Edición de Expedientes',
  'Acceso Financiero',
  'Conferencias Prevención',
  'Gestión de Personal',
];

const AsignacionRoles = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]             = useState('asignacion');
  const [busquedaNombre, setBusquedaNombre]   = useState('');
  const [busquedaDept, setBusquedaDept]       = useState('');
  const [resultados, setResultados]           = useState([]);
  const [buscado, setBuscado]                 = useState(false);
  const [empleado, setEmpleado]               = useState(empleadosMock[0]);
  const [nuevoRol, setNuevoRol]               = useState('');
  const [fechaEfectiva, setFechaEfectiva]     = useState('');
  const [motivoCambio, setMotivoCambio]       = useState('');
  const [permisosExtra, setPermisosExtra]     = useState([]);

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const handleBuscar = () => {
    const filtrados = empleadosMock.filter(e => {
      const mn = e.nombre.toLowerCase().includes(busquedaNombre.toLowerCase());
      const md = e.departamento.toLowerCase().includes(busquedaDept.toLowerCase());
      return (busquedaNombre ? mn : true) && (busquedaDept ? md : true);
    });
    setResultados(filtrados);
    setBuscado(true);
  };

  const seleccionarEmpleado = (e) => {
    setEmpleado(e);
    setResultados([]);
    setBuscado(false);
    setBusquedaNombre('');
    setBusquedaDept('');
    setNuevoRol('');
    setFechaEfectiva('');
    setMotivoCambio('');
    setPermisosExtra([]);
  };

  const togglePermiso = (p) => {
    setPermisosExtra(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
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
                <button key={key} onClick={() => handleNavClick({ key, path })}
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

              {/* Título */}
              <div>
                <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Asignar Roles y Permisos</p>
              </div>

              {/* ── Buscar Empleado ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Buscar Empleado</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Nombre Empleado</label>
                    <input
                      type="text"
                      value={busquedaNombre}
                      onChange={e => setBusquedaNombre(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                      placeholder="Escribe el nombre..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                 placeholder:text-slate-300 transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Departamento</label>
                    <input
                      type="text"
                      value={busquedaDept}
                      onChange={e => setBusquedaDept(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                      placeholder="Ej. Clínico..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                 placeholder:text-slate-300 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleBuscar}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                               font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm shrink-0"
                  >
                    <Search size={16} /> Buscar
                  </button>
                </div>

                {/* Resultados */}
                {buscado && resultados.length > 0 && (
                  <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
                    {resultados.map((e, i) => (
                      <button key={e.id} onClick={() => seleccionarEmpleado(e)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#7E1D3B]/5 transition
                                    ${i < resultados.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <User size={14} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{e.nombre}</p>
                          <p className="text-xs text-slate-400">{e.puesto} · {e.departamento}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {buscado && resultados.length === 0 && (
                  <p className="mt-4 text-sm text-slate-400 text-center py-3">No se encontraron empleados.</p>
                )}
              </section>

              {/* ── Empleado Seleccionado + Formulario ── */}
              {empleado && (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                  {/* Título sección */}
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Empleado Seleccionado</h3>
                  </div>

                  {/* Tarjeta empleado */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="h-14 w-14 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0">
                      <User size={24} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-base">{empleado.nombre}</p>
                      <p className="text-sm text-slate-500">{empleado.puesto}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider
                                       bg-[#7E1D3B]/10 text-[#7E1D3B] px-2 py-0.5 rounded-full">
                        {empleado.departamento}
                      </span>
                    </div>
                  </div>

                  {/* Campos rol */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rol actual — solo lectura */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Rol Actual</label>
                      <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-600 font-medium">
                        {empleado.rolActual}
                      </div>
                    </div>

                    {/* Nuevo rol — select */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Nuevo Rol a Asignar<span className="text-[#7E1D3B] ml-0.5">*</span>
                      </label>
                      <select
                        value={nuevoRol}
                        onChange={e => setNuevoRol(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all"
                      >
                        <option value="">Selecciona un rol...</option>
                        {rolesCatalogo.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fecha efectiva */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Fecha Efectiva<span className="text-[#7E1D3B] ml-0.5">*</span>
                      </label>
                      <input
                        type="date"
                        value={fechaEfectiva}
                        onChange={e => setFechaEfectiva(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all"
                      />
                    </div>

                    {/* Motivo de cambio */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">Motivo de Cambio</label>
                      <input
                        type="text"
                        value={motivoCambio}
                        onChange={e => setMotivoCambio(e.target.value)}
                        placeholder="Ej. Promoción interna..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                   placeholder:text-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* ── Permisos Adicionales ── */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Permisos Adicionales (Opcionales)</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {PERMISOS_ADICIONALES.map(permiso => {
                        const activo = permisosExtra.includes(permiso);
                        return (
                          <label key={permiso} className="flex items-center gap-2.5 cursor-pointer group">
                            <div
                              onClick={() => togglePermiso(permiso)}
                              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                                activo
                                  ? 'border-[#7E1D3B] bg-[#7E1D3B]'
                                  : 'border-slate-300 bg-white group-hover:border-[#7E1D3B]/50'
                              }`}
                            >
                              {activo && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm text-slate-700 group-hover:text-slate-900 transition">{permiso}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Acciones ── */}
                  <div className="flex flex-col md:flex-row gap-3 justify-end pt-2">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center justify-center gap-2 px-8 py-2.5 border border-slate-200
                                 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm"
                    >
                      <X size={15} /> Cancelar
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#7E1D3B] text-white
                                 rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm"
                    >
                      <Save size={15} /> Guardar Asignación
                    </button>
                  </div>
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