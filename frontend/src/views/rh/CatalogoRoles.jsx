import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, Tag, ShieldCheck, Users, UserCheck, UserX, Search, X, Wallet } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',       path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',       path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',   path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion', path: '/rh/asignacion-roles' },
  { label: 'Nómina',              icon: Wallet,      key: 'nomina',     path: '/rh/nomina' },
];

const DEPARTAMENTOS_FILTRO = [
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

const getNivel = (departamento, puesto) => {
  if (!departamento) return null;
  if (departamento === 'DIRECCIÓN GENERAL') return 'DG';
  if (departamento === 'OFICINA DE RECURSOS MATERIALES') return 'O';
  if (puesto && /^JEF[AE]/i.test(puesto)) return 'D';
  return null;
};
const NIVEL_STYLE = {
    DG: { badge: 'bg-amber-100 text-amber-800 border border-amber-200', desc: 'Dirección General' },
    D: { badge: 'bg-blue-100  text-blue-700  border border-blue-200', desc: 'Departamento' },
    O: { badge: 'bg-teal-100  text-teal-700  border border-teal-200', desc: 'Oficina' },
  };

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const CatalogoRoles = () => {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [apiError, setApiError] = useState('');

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroDept, setFiltroDept] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('activos');

  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/personal');
        const data = await res.json();
        setPersonal(data);
      } catch {
        setApiError('No se pudo conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    };
    fetchPersonal();
  }, []);

  // Personal enriquecido con nivel calculado
  const personalConNivel = personal.map(p => ({
    ...p,
    nivel: getNivel(p.departamento, p.puesto),
    nombreCompleto: `${p.nombre || ''} ${p.apellidoPaterno || ''} ${p.apellidoMaterno || ''}`.trim(),
  }));

  // Aplicar filtros
  const filtrado = personalConNivel.filter(p => {
    const matchEstado = filtroEstado === 'todos'
      ? true
      : filtroEstado === 'activos'
        ? p.activo !== false
        : p.activo === false;

    const matchBusqueda = !busqueda.trim() ||
      p.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.puesto && p.puesto.toLowerCase().includes(busqueda.toLowerCase()));

    const matchDept = !filtroDept || p.departamento === filtroDept;
    const matchNivel = !filtroNivel || (filtroNivel === 'sin-nivel' ? !p.nivel : p.nivel === filtroNivel);

    return matchEstado && matchBusqueda && matchDept && matchNivel;
  });

  // Stats
  const activos = personalConNivel.filter(p => p.activo !== false).length;
  const inactivos = personalConNivel.filter(p => p.activo === false).length;
  const porNivel = { DG: 0, D: 0, O: 0 };
  personalConNivel.filter(p => p.activo !== false).forEach(p => {
    if (p.nivel) porNivel[p.nivel] = (porNivel[p.nivel] || 0) + 1;
  });

  const limpiarFiltros = () => {
    setBusqueda(''); setFiltroDept(''); setFiltroNivel(''); setFiltroEstado('activos');
  };
  const hayFiltros = busqueda || filtroDept || filtroNivel || filtroEstado !== 'activos';

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all`;

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
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${key === 'catalogo'
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
                <p className="text-sm text-slate-400 font-medium tracking-wide">Directorio de Personal</p>
              </div>

              {apiError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium">
                  {apiError}
                </div>
              )}

              {/* ── Tarjetas de estadísticas ── */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* Total */}
                <div className="col-span-2 md:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-800">{personalConNivel.length}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Total</p>
                  </div>
                </div>

                {/* Activos */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <UserCheck size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-700">{activos}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Activos</p>
                  </div>
                </div>

                {/* Inactivos */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <UserX size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-500">{inactivos}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Bajas</p>
                  </div>
                </div>

                {/* Nivel D */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-blue-700">D</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-blue-700">{porNivel.D || 0}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Jefes</p>
                  </div>
                </div>

                {/* Nivel DG + O */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="flex gap-1 shrink-0">
                    <span className="h-10 w-[22px] rounded-xl bg-amber-50 flex items-center justify-center text-xs font-black text-amber-700">DG</span>
                    <span className="h-10 w-[22px] rounded-xl bg-teal-50  flex items-center justify-center text-xs font-black text-teal-700">O</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-700">{(porNivel.DG || 0) + (porNivel.O || 0)}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">DG + O</p>
                  </div>
                </div>
              </div>

              {/* ── Leyenda de niveles ── */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(NIVEL_STYLE).map(([key, { badge, desc }]) => (
                  <span key={key} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge}`}>
                    <span>{key}</span>
                    <span className="font-normal opacity-70">— {desc}</span>
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                  —&nbsp;<span className="font-normal">Sin nivel asignado (operativo)</span>
                </span>
              </div>

              {/* ── Filtros ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  {/* Búsqueda */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                      placeholder="Buscar por nombre o puesto..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                 placeholder:text-slate-300 transition-all" />
                  </div>

                  {/* Departamento */}
                  <select value={filtroDept} onChange={e => setFiltroDept(e.target.value)} className={inputCls}>
                    <option value="">Todos los departamentos</option>
                    {DEPARTAMENTOS_FILTRO.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                  {/* Nivel */}
                  <select value={filtroNivel} onChange={e => setFiltroNivel(e.target.value)} className={inputCls}>
                    <option value="">Todos los niveles</option>
                    <option value="DG">DG — Dirección General</option>
                    <option value="D">D — Departamento</option>
                    <option value="O">O — Oficina</option>
                    <option value="sin-nivel">Sin nivel</option>
                  </select>

                  {/* Estado */}
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm font-semibold flex-1">
                      {[['activos', 'Activos'], ['inactivos', 'Bajas'], ['todos', 'Todos']].map(([val, label]) => (
                        <button key={val} onClick={() => setFiltroEstado(val)}
                          className={`flex-1 py-2.5 text-xs transition ${filtroEstado === val
                            ? 'bg-[#7E1D3B] text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {hayFiltros && (
                      <button onClick={limpiarFiltros} title="Limpiar filtros"
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Tabla de personal ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {cargando ? (
                  <div className="py-16 text-center text-slate-400 text-sm">Cargando personal...</div>
                ) : filtrado.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-sm">
                    No se encontró personal con los filtros aplicados.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          {['Nombre Completo', 'Departamento', 'Puesto', 'Contrato', 'Nivel', 'Estado'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtrado.map((p) => {
                          const nivel = p.nivel;
                          const activo = p.activo !== false;
                          return (
                            <tr key={p.id} className={`border-b border-slate-100 transition hover:bg-[#7E1D3B]/3 ${!activo ? 'opacity-60' : ''}`}>

                              {/* Nombre */}
                              <td className="px-4 py-3">
                                <p className="font-semibold text-slate-800">{p.nombreCompleto || '—'}</p>
                                {p.correoElectronico && (
                                  <p className="text-xs text-slate-400 mt-0.5">{p.correoElectronico}</p>
                                )}
                              </td>

                              {/* Departamento */}
                              <td className="px-4 py-3 text-xs text-slate-600">{p.departamento || '—'}</td>

                              {/* Puesto */}
                              <td className="px-4 py-3 text-xs text-slate-700 font-medium">{p.puesto || '—'}</td>

                              {/* Contrato */}
                              <td className="px-4 py-3">
                                {p.tipoContrato ? (
                                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {p.tipoContrato}
                                  </span>
                                ) : '—'}
                              </td>

                              {/* Nivel */}
                              <td className="px-4 py-3">
                                {nivel ? (
                                  <span className={`inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-black ${NIVEL_STYLE[nivel].badge}`}>
                                    {nivel}
                                  </span>
                                ) : (
                                  <span className="text-slate-300 text-xs">—</span>
                                )}
                              </td>

                              {/* Estado */}
                              <td className="px-4 py-3">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${activo
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-500'
                                  }`}>
                                  {activo ? 'Activo' : 'Baja'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Footer con conteo */}
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                      <p className="text-xs text-slate-400 font-medium">
                        Mostrando <span className="text-slate-600 font-bold">{filtrado.length}</span> de{' '}
                        <span className="text-slate-600 font-bold">{personalConNivel.length}</span> registros
                      </p>
                    </div>
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

export default CatalogoRoles;
