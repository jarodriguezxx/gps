import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, UserMinus, Tag, ShieldCheck, Wallet,
  AlertTriangle, ClipboardList, Eye, X, Save,
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

const INCIDENCIAS_KEY = 'marakame_incidencias';

const TIPO_COLOR = {
  'Retardo':             'bg-amber-50 text-amber-700 border-amber-200',
  'Falta Justificada':   'bg-blue-50 text-blue-700 border-blue-200',
  'Falta Injustificada': 'bg-red-50 text-red-700 border-red-200',
  'Ausencia Temporal':   'bg-orange-50 text-orange-700 border-orange-200',
};

const fmtFecha = (dateStr) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const TablaIncidencias = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('tabla-incidencias');
  const [incidencias, setIncidencias] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(INCIDENCIAS_KEY) || '[]');
    setIncidencias(data);
  }, []);

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    navigate(item.path);
  };

  const openModal = (inc) => {
    setSelected(inc);
    setEditForm({ estatus: inc.estatus, observaciones: inc.observaciones });
  };

  const closeModal = () => {
    setSelected(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    const updated = incidencias.map((i) =>
      i.id === selected.id
        ? { ...i, estatus: editForm.estatus, observaciones: editForm.observaciones }
        : i,
    );
    setIncidencias(updated);
    localStorage.setItem(INCIDENCIAS_KEY, JSON.stringify(updated));
    closeModal();
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
                <h2 className="text-2xl font-black text-slate-800">Tabla de Incidencias</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">
                  Historial de faltas y ausencias registradas
                </p>
              </div>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle
                  title={`Incidencias Registradas — ${incidencias.length} ${incidencias.length === 1 ? 'registro' : 'registros'}`}
                />

                {incidencias.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <ClipboardList size={36} className="mb-3 opacity-40" />
                    <p className="font-semibold text-sm">No hay incidencias registradas</p>
                    <p className="text-xs mt-1">
                      Registra una desde la sección "Registrar Incidencia".
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                          <th className="px-4 py-3 text-left font-semibold">Empleado</th>
                          <th className="px-4 py-3 text-left font-semibold">Tipo de Incidencia</th>
                          <th className="px-4 py-3 text-center font-semibold">Estatus</th>
                          <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {incidencias.map((inc) => (
                          <tr key={inc.id} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                              {fmtFecha(inc.fecha)}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              {inc.empleado}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${TIPO_COLOR[inc.tipoIncidencia] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
                              >
                                {inc.tipoIncidencia}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border ${
                                  inc.estatus === 'JUSTIFICADA'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                              >
                                {inc.estatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => openModal(inc)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B] text-xs font-semibold hover:bg-[#7E1D3B]/20 transition"
                              >
                                <Eye size={13} />
                                Ver / Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

            </main>
          </div>
        </header>
      </div>

      {/* Modal detalle / edición */}
      {selected && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs font-bold text-[#7E1D3B] uppercase tracking-wider">
                  Detalle / Edición
                </p>
                <p className="font-black text-slate-800 text-lg">{selected.empleado}</p>
              </div>
              <button
                onClick={closeModal}
                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fecha</p>
                  <p className="text-sm font-semibold text-slate-800">{fmtFecha(selected.fecha)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tipo</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${TIPO_COLOR[selected.tipoIncidencia] || ''}`}
                  >
                    {selected.tipoIncidencia}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Descripción
                  </p>
                  <p className="text-sm text-slate-600">{selected.descripcionTipo}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Estatus
                </label>
                <select
                  value={editForm.estatus}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, estatus: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/60 bg-white"
                >
                  <option value="INJUSTIFICADA">INJUSTIFICADA</option>
                  <option value="JUSTIFICADA">JUSTIFICADA</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Observaciones
                </label>
                <textarea
                  value={editForm.observaciones}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, observaciones: e.target.value }))
                  }
                  rows={3}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/60 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold hover:bg-[#63162e] transition shadow-md"
              >
                <Save size={14} />
                Guardar Cambios
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TablaIncidencias;
