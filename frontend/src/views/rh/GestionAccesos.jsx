import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, Tag, ShieldCheck, KeyRound, Pencil, Check, X } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',       path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',       path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',   path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion', path: '/rh/asignacion-roles' },
  { label: 'Gestión de Accesos',  icon: KeyRound,    key: 'accesos',    path: '/rh/gestion-accesos' },
];

const ROLES_DISPONIBLES = ['ADMIN', 'RH', 'MÉDICO', 'ADMISIONES', 'FINANCIERO', 'ALMACÉN', 'MATERIALES'];

const ROL_COLOR = {
  ADMIN:       'bg-amber-100 text-amber-800 border-amber-200',
  RH:          'bg-purple-100 text-purple-800 border-purple-200',
  'MÉDICO':    'bg-blue-100 text-blue-800 border-blue-200',
  ADMISIONES:  'bg-teal-100 text-teal-800 border-teal-200',
  FINANCIERO:  'bg-green-100 text-green-800 border-green-200',
  'ALMACÉN':   'bg-orange-100 text-orange-800 border-orange-200',
  MATERIALES:  'bg-slate-100 text-slate-700 border-slate-200',
};

const GestionAccesos = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [rolTemporal, setRolTemporal] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [msgExito, setMsgExito] = useState('');

  const cargar = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const iniciarEdicion = (u) => {
    setEditandoId(u.id);
    setRolTemporal(u.rol || '');
    setMsgExito('');
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setRolTemporal('');
  };

  const guardarRol = async (id) => {
    setGuardando(true);
    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: rolTemporal }),
      });
      if (!res.ok) throw new Error();
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, rol: rolTemporal } : u));
      setMsgExito(`Rol actualizado correctamente.`);
      setEditandoId(null);
    } catch {
      setError('Error al actualizar el rol.');
    } finally {
      setGuardando(false);
    }
  };

  const toggleActivo = async (u) => {
    try {
      await fetch(`http://localhost:4000/api/usuarios/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !u.activo }),
      });
      setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, activo: !x.activo } : x));
    } catch {
      setError('Error al cambiar el estado del usuario.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">

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

            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => navigate(path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    key === 'accesos'
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <Icon size={15} />{label}
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Gestión de Accesos</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Usuarios del sistema — roles y estado</p>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium flex items-center justify-between">
                  {error}
                  <button onClick={() => setError('')}><X size={14} /></button>
                </div>
              )}

              {msgExito && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium flex items-center gap-2">
                  <Check size={15} /> {msgExito}
                </div>
              )}

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {cargando ? (
                  <div className="py-16 text-center text-slate-400 text-sm">Cargando usuarios...</div>
                ) : usuarios.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-sm">No hay usuarios registrados.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          {['Usuario', 'Nombre', 'Módulo de acceso', 'Estado', 'Acciones'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map(u => {
                          const editando = editandoId === u.id;
                          const rolColor = ROL_COLOR[u.rol] || 'bg-slate-100 text-slate-600 border-slate-200';
                          const nombre = u.personal
                            ? [u.personal.nombre, u.personal.apellidoPaterno, u.personal.apellidoMaterno].filter(Boolean).join(' ')
                            : '—';
                          return (
                            <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition">
                              <td className="px-4 py-3 font-mono font-semibold text-slate-700">{u.username}</td>
                              <td className="px-4 py-3 text-slate-700">{nombre}</td>
                              <td className="px-4 py-3">
                                {editando ? (
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={rolTemporal}
                                      onChange={e => setRolTemporal(e.target.value)}
                                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30">
                                      {ROLES_DISPONIBLES.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                      ))}
                                    </select>
                                    <button onClick={() => guardarRol(u.id)} disabled={guardando}
                                      className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50">
                                      <Check size={13} />
                                    </button>
                                    <button onClick={cancelarEdicion}
                                      className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition">
                                      <X size={13} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${rolColor}`}>
                                    {u.rol || '—'}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <button onClick={() => toggleActivo(u)}
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                                    u.activo
                                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}>
                                  {u.activo ? 'Activo' : 'Inactivo'}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                {!editando && (
                                  <button onClick={() => iniciarEdicion(u)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-xs font-semibold">
                                    <Pencil size={12} /> Cambiar rol
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default GestionAccesos;
