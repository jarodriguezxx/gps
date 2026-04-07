import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, UserMinus, Tag, ShieldCheck, User } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',      path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',      path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',  path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion',path: '/rh/asignacion-roles' },
];

// Empleados mock para simular búsqueda
const empleadosMock = [
  { id: 1, nombre: 'Jaime Rodríguez',     puesto: 'Jefe Departamento Clínico',   departamento: 'Clínico' },
  { id: 2, nombre: 'Laura Medina Torres', puesto: 'Enfermera General',           departamento: 'Enfermería' },
  { id: 3, nombre: 'Marco Pineda Ruiz',   puesto: 'Trabajador Social',           departamento: 'Social' },
  { id: 4, nombre: 'Ana Torres Vela',     puesto: 'Recepcionista',               departamento: 'Administración' },
];

const InputField = ({ label, required, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
      {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                 placeholder:text-slate-300 transition-all"
    />
  </div>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const BajaPersonal = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('baja');
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaDept, setBusquedaDept] = useState('');
  const [resultados, setResultados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(empleadosMock[0]);
  const [buscado, setBuscado] = useState(false);
  const [formData, setFormData] = useState({ fechaBaja: '', motivoBaja: '', observaciones: '' });

  const handleBuscar = () => {
    const filtrados = empleadosMock.filter((e) => {
      const matchNombre = e.nombre.toLowerCase().includes(busquedaNombre.toLowerCase());
      const matchDept   = e.departamento.toLowerCase().includes(busquedaDept.toLowerCase());
      return (busquedaNombre ? matchNombre : true) && (busquedaDept ? matchDept : true);
    });
    setResultados(filtrados);
    setBuscado(true);
  };

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
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
                <button
                  key={key}
                  onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </aside>

            {/* Main */}
            <main className="space-y-5">

              {/* Título */}
              <div>
                <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Procesar Baja de Personal</p>
              </div>

              {/* ── Buscar Empleado ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Buscar Empleado" />
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Nombre Empleado
                    </label>
                    <input
                      type="text"
                      value={busquedaNombre}
                      onChange={(e) => setBusquedaNombre(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                      placeholder="Escribe el nombre..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                 placeholder:text-slate-300 transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={busquedaDept}
                      onChange={(e) => setBusquedaDept(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                      placeholder="Ej. Clínico..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                 placeholder:text-slate-300 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleBuscar}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7E1D3B] text-white
                               rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm shrink-0"
                  >
                    <Search size={16} />
                    Buscar
                  </button>
                </div>

                {/* Resultados de búsqueda */}
                {buscado && resultados.length > 0 && (
                  <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
                    {resultados.map((emp, i) => (
                      <button
                        key={emp.id}
                        onClick={() => { setEmpleadoSeleccionado(emp); setResultados([]); setBuscado(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#7E1D3B]/5 transition
                                    ${i < resultados.length - 1 ? 'border-b border-slate-100' : ''}`}
                      >
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <User size={15} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{emp.nombre}</p>
                          <p className="text-xs text-slate-400">{emp.puesto} · {emp.departamento}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {buscado && resultados.length === 0 && (
                  <p className="mt-4 text-sm text-slate-400 text-center py-3">No se encontraron empleados con esos criterios.</p>
                )}
              </section>

              {/* ── Empleado Seleccionado ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Empleado Seleccionado" />

                {empleadoSeleccionado ? (
                  <>
                    {/* Tarjeta empleado */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                      <div className="h-14 w-14 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center shrink-0">
                        <User size={24} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base">{empleadoSeleccionado.nombre}</p>
                        <p className="text-sm text-slate-500">{empleadoSeleccionado.puesto}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider
                                         bg-[#7E1D3B]/10 text-[#7E1D3B] px-2 py-0.5 rounded-full">
                          {empleadoSeleccionado.departamento}
                        </span>
                      </div>
                    </div>

                    {/* Campos de baja */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                          Fecha de Baja<span className="text-[#7E1D3B] ml-0.5">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.fechaBaja}
                          onChange={(e) => setFormData({ ...formData, fechaBaja: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                     focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                          Motivo de Baja<span className="text-[#7E1D3B] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.motivoBaja}
                          onChange={(e) => setFormData({ ...formData, motivoBaja: e.target.value })}
                          placeholder="Ej. Renuncia voluntaria..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                                     focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                     placeholder:text-slate-300 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                        Observaciones
                      </label>
                      <textarea
                        rows={4}
                        value={formData.observaciones}
                        onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                        placeholder="Información adicional sobre la baja..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm resize-none
                                   focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                                   placeholder:text-slate-300 transition-all"
                      />
                    </div>

                    {/* Aviso */}
                    <p className="mt-4 text-sm font-medium text-amber-600">
                      Al confirmar la baja se revocarán todos los accesos asignados
                    </p>
                  </>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    Busca y selecciona un empleado para continuar.
                  </div>
                )}
              </section>

              {/* ── Acciones ── */}
              <div className="flex gap-3 pb-2">
                <button className="flex items-center gap-2 px-8 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                  Confirmar
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-8 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold shadow-sm text-sm"
                >
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