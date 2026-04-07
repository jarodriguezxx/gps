import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, Tag, ShieldCheck, Plus, Save, X, Pencil } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',      path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',      path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',  path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion',path: '/rh/asignacion-roles' },
];

const PERMISOS_DISPONIBLES = [
  'Ver Expedientes Clínicos',
  'Editar Expedientes Clínicos',
  'Asignar Terapeutas',
  'Ver Informes Estadísticos',
  'Acceso Módulo Financiero',
  'Gestionar Altas/Bajas de Personal',
  'Ver Datos de Pacientes',
  'Publicar en Transparencia',
  'Consulta de Reportes',
  'Administrar Usuarios',
  'Gestionar Inventarios',
  'Requisiciones',
];

const rolesIniciales = [
  { id: 1, rol: 'Directora General',        departamento: 'Dirección General',              nivel: 'DG', permisos: ['Ver Expedientes Clínicos','Editar Expedientes Clínicos','Ver Informes Estadísticos','Administrar Usuarios','Acceso Módulo Financiero','Gestionar Altas/Bajas de Personal','Ver Datos de Pacientes','Publicar en Transparencia'], estado: 'Activo' },
  { id: 2, rol: 'Resp. Transparencia',      departamento: 'Unidad de Transparencia',        nivel: 'D',  permisos: ['Consulta de Reportes','Publicar en Transparencia'], estado: 'Activo' },
  { id: 3, rol: 'Jefe Depto. Clínico',      departamento: 'Departamento Clínico',           nivel: 'D',  permisos: ['Ver Expedientes Clínicos','Editar Expedientes Clínicos','Asignar Terapeutas','Ver Informes Estadísticos','Acceso Módulo Financiero','Gestionar Altas/Bajas de Personal','Ver Datos de Pacientes','Publicar en Transparencia'], estado: 'Activo' },
  { id: 4, rol: 'Jefe Depto. Medico',       departamento: 'Departamento Medico',            nivel: 'D',  permisos: ['Ver Expedientes Clínicos','Editar Expedientes Clínicos','Ver Datos de Pacientes','Ver Informes Estadísticos'], estado: 'Activo' },
  { id: 5, rol: 'Jefe Dept. Admisiones',    departamento: 'Departamento Admisiones',        nivel: 'D',  permisos: ['Ver Datos de Pacientes','Ver Expedientes Clínicos'], estado: 'Activo' },
  { id: 6, rol: 'Jefe Recursos Materiales', departamento: 'Oficina de Recursos Materiales', nivel: 'O',  permisos: ['Gestionar Inventarios','Requisiciones'], estado: 'Activo' },
];

const permisosResumen = (permisos) => {
  if (permisos.length === 0) return '—';
  const texto = permisos.slice(0, 2).join(', ');
  return permisos.length > 2 ? `${texto}...` : texto;
};

const CatalogoRoles = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]     = useState('catalogo');
  const [roles, setRoles]             = useState(rolesIniciales);
  const [editando, setEditando]       = useState(null);   // rol en edición
  const [mostrarForm, setMostrarForm] = useState(false);  // form nuevo rol
  const [nuevoRol, setNuevoRol]       = useState({ rol: '', departamento: '', nivel: '', permisos: [], estado: 'Activo' });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const togglePermiso = (rol, permiso) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== rol.id) return r;
      const tiene = r.permisos.includes(permiso);
      return { ...r, permisos: tiene ? r.permisos.filter(p => p !== permiso) : [...r.permisos, permiso] };
    }));
  };

  const togglePermisoNuevo = (permiso) => {
    setNuevoRol(prev => {
      const tiene = prev.permisos.includes(permiso);
      return { ...prev, permisos: tiene ? prev.permisos.filter(p => p !== permiso) : [...prev.permisos, permiso] };
    });
  };

  const guardarNuevo = () => {
    if (!nuevoRol.rol.trim()) return;
    setRoles(prev => [...prev, { ...nuevoRol, id: Date.now() }]);
    setNuevoRol({ rol: '', departamento: '', nivel: '', permisos: [], estado: 'Activo' });
    setMostrarForm(false);
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

              {/* Título + botón */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
                  <p className="text-sm text-slate-400 font-medium tracking-wide">Catálogo de Roles</p>
                </div>
                <button
                  onClick={() => { setMostrarForm(true); setEditando(null); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm shrink-0"
                >
                  <Plus size={15} /> Nuevo Rol
                </button>
              </div>

              {/* ── Tabla de roles ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['Rol/Puesto','Departamento','Nivel','Permisos','Estado',''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((r, i) => (
                      <tr key={r.id}
                        className={`border-b border-slate-100 transition hover:bg-[#7E1D3B]/3 ${editando?.id === r.id ? 'bg-[#7E1D3B]/5' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-slate-800">{r.rol}</td>
                        <td className="px-4 py-3 text-slate-600">{r.departamento}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{r.nivel}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-[200px]">{permisosResumen(r.permisos)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            r.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}>{r.estado}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { setEditando(editando?.id === r.id ? null : r); setMostrarForm(false); }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#7E1D3B] hover:underline"
                          >
                            <Pencil size={12} /> Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* ── Panel Editar Permisos ── */}
              {editando && (
                <section className="bg-white rounded-2xl border border-[#7E1D3B]/20 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                      Editar Permisos — {editando.rol}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {PERMISOS_DISPONIBLES.map((permiso) => {
                      const activo = roles.find(r => r.id === editando.id)?.permisos.includes(permiso);
                      return (
                        <label key={permiso} className="flex items-center gap-2.5 cursor-pointer group">
                          <div
                            onClick={() => togglePermiso(editando, permiso)}
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

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditando(null)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm"
                    >
                      <Save size={15} /> Guardar Permisos
                    </button>
                    <button
                      onClick={() => setEditando(null)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm"
                    >
                      <X size={15} /> Cancelar
                    </button>
                  </div>
                </section>
              )}

              {/* ── Panel Nuevo Rol ── */}
              {mostrarForm && (
                <section className="bg-white rounded-2xl border border-[#7E1D3B]/20 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Nuevo Rol</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    {[
                      { label: 'Rol / Puesto',  field: 'rol' },
                      { label: 'Departamento',  field: 'departamento' },
                      { label: 'Nivel',         field: 'nivel' },
                    ].map(({ label, field }) => (
                      <div key={field}>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                          {label}<span className="text-[#7E1D3B] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={nuevoRol[field]}
                          onChange={e => setNuevoRol({ ...nuevoRol, [field]: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                     focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 ml-0.5">Permisos</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {PERMISOS_DISPONIBLES.map((permiso) => {
                      const activo = nuevoRol.permisos.includes(permiso);
                      return (
                        <label key={permiso} className="flex items-center gap-2.5 cursor-pointer group">
                          <div
                            onClick={() => togglePermisoNuevo(permiso)}
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

                  <div className="flex gap-3">
                    <button
                      onClick={guardarNuevo}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm"
                    >
                      <Save size={15} /> Guardar Rol
                    </button>
                    <button
                      onClick={() => setMostrarForm(false)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm"
                    >
                      <X size={15} /> Cancelar
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

export default CatalogoRoles;