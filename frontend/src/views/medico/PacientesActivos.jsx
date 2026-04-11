import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ClipboardList, ShieldAlert, Users, Stethoscope, BookOpen, Plus, X, Save } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio',                       icon: Home,          key: 'inicio',          path: '/medico' },
  { label: 'Evaluación médica',            icon: Stethoscope,   key: 'evaluacion',      path: '/medico/evaluacion-medica' },
  { label: 'Protocolo de desintoxicación', icon: ShieldAlert,   key: 'protocolo',       path: '/medico/protocolo-desintoxicacion' },
  { label: 'Pacientes activos',            icon: Users,         key: 'pacientes',       path: '/medico/pacientes-activos' },
  { label: 'Historial de evaluaciones',    icon: ClipboardList, key: 'historial-eval',  path: '/medico/historial-evaluaciones' },
  { label: 'Historial de protocolos',      icon: BookOpen,      key: 'historial-proto', path: '/medico/historial-protocolos' },
];

const pacientesMock = [
  { id: 1, clave: 'HGU-18', adiccion: 'Ludopatía',  habitacion: 10, edad: 35, observaciones: 'El paciente no presentó comportamientos raros' },
  { id: 2, clave: 'HGU-22', adiccion: 'Alcoholismo', habitacion: 4,  edad: 28, observaciones: 'Paciente estable, sin incidentes reportados' },
  { id: 3, clave: 'HGU-31', adiccion: 'Tabaquismo',  habitacion: 7,  edad: 41, observaciones: 'Presenta ansiedad moderada, bajo control' },
];

const PacientesActivos = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]       = useState('pacientes');
  const [pacientes, setPacientes]       = useState(pacientesMock);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevo, setNuevo]               = useState({ clave: '', adiccion: '', habitacion: '', edad: '', observaciones: '' });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const handleGuardar = () => {
    if (!nuevo.clave.trim()) return;
    setPacientes(prev => [...prev, { ...nuevo, id: Date.now() }]);
    setNuevo({ clave: '', adiccion: '', habitacion: '', edad: '', observaciones: '' });
    setMostrarModal(false);
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
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Médico</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Stethoscope size={16} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Enfermero</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* ── Sidebar ── */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  {React.createElement(icon, { size: 15, className: 'shrink-0' })}
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            {/* ── Main ── */}
            <main className="space-y-5">

              {/* Título */}
              <div>
                <h2 className="text-2xl font-black text-slate-800">Módulo Médico</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Pacientes activos</p>
              </div>

              {/* Botón realizar consulta */}
              <div>
                <button
                  onClick={() => setMostrarModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                             font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm"
                >
                  <Plus size={15} /> Realizar consulta diaria
                </button>
              </div>

              {/* ── Tabla pacientes ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['Clave', 'Adicción', 'Habitación', 'Edad', 'Observaciones'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">
                          No hay pacientes activos registrados.
                        </td>
                      </tr>
                    ) : (
                      pacientes.map((p, i) => (
                        <tr key={p.id}
                          className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${
                            i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          }`}>
                          <td className="px-4 py-3">
                            <span className="font-bold text-[#7E1D3B]">{p.clave}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{p.adiccion}</td>
                          <td className="px-4 py-3 text-slate-700 text-center">{p.habitacion}</td>
                          <td className="px-4 py-3 text-slate-700 text-center">{p.edad}</td>
                          <td className="px-4 py-3 text-slate-500 max-w-xs">{p.observaciones}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Footer con contador */}
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">
                    {pacientes.length} paciente{pacientes.length !== 1 ? 's' : ''} activo{pacientes.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>

      {/* ── Modal consulta diaria ── */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Consulta Diaria</h3>
              </div>
              <button onClick={() => setMostrarModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Clave',       field: 'clave',       type: 'text',   required: true },
                { label: 'Adicción',    field: 'adiccion',    type: 'text',   required: true },
                { label: 'Habitación',  field: 'habitacion',  type: 'number', required: true },
                { label: 'Edad',        field: 'edad',        type: 'number', required: true },
              ].map(({ label, field, type, required }) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                    {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
                  </label>
                  <input
                    type={type}
                    value={nuevo[field]}
                    onChange={e => setNuevo({ ...nuevo, [field]: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm
                               focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                Observaciones
              </label>
              <textarea
                rows={3}
                value={nuevo.observaciones}
                onChange={e => setNuevo({ ...nuevo, observaciones: e.target.value })}
                placeholder="Notas de la consulta del día..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                           placeholder:text-slate-300 transition-all"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setMostrarModal(false)}
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl
                           text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm">
                <X size={15} /> Cancelar
              </button>
              <button onClick={handleGuardar}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                           font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                <Save size={15} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacientesActivos;