import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, UserCog, Search, X, Save, UserCheck, UserX } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Tablero de Control',     icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Auditoría Clínica',      icon: Users,           path: '/clinico/directorio' },
  { label: 'Asignación Terapéutica', icon: UserCog,         path: '/clinico/asignaciones' },
  { label: 'Validación Terapéutica', icon: ClipboardCheck,  path: '/clinico/calendario' },
];

const DEPS = ['Psicología', 'Consejería', 'Familia'];

// Puestos registrados en RH por área terapéutica
const PUESTOS_POR_DEP = {
  'Psicología': ['PSICÓLOGA (O)', 'TERAPEUTA DE GRUPO', 'COTERAPEUTA', 'TERAPEUTA DE POST-TRATAMIENTO', 'ENCARGADA (O) DE POST TRATAMIENTO'],
  'Consejería': ['CONSEJERA (O) ASIGNADO', 'ENCARGADA (O) DE CONSEJEROS ASIGNADOS'],
  'Familia':    ['TERAPEUTA FAMILIAR', 'ENCARGADA (O) DE FAMILIA'],
};

const AsignacionesTerapeutas = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [pacientes,   setPacientes]   = useState([]);
  const [personal,    setPersonal]    = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [busqueda,    setBusqueda]    = useState('');
  const [modalPac,    setModalPac]    = useState(null);
  const [form,        setForm]        = useState({});
  const [guardando,   setGuardando]   = useState(false);

  const cargar = async () => {
    const [pacs, pers, asigs] = await Promise.all([
      fetch('http://localhost:4000/api/pacientes').then(r => r.ok ? r.json() : []),
      fetch('http://localhost:4000/api/asignaciones/personal-activo').then(r => r.ok ? r.json() : []),
      fetch('http://localhost:4000/api/asignaciones-clinico').then(r => r.ok ? r.json() : []),
    ]);
    setPacientes((Array.isArray(pacs) ? pacs : []).filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO'));
    setPersonal(Array.isArray(pers) ? pers : []);
    setAsignaciones(Array.isArray(asigs) ? asigs : []);
  };

  useEffect(() => { cargar(); }, []);

  const getAsig = (pacienteId, dep) =>
    asignaciones.find(a => a.pacienteId === pacienteId && a.departamento === dep);

  const contarCompletos = (pacienteId) =>
    DEPS.filter(d => getAsig(pacienteId, d)).length;

  const abrirModal = (pac) => {
    const f = {};
    DEPS.forEach(dep => {
      const a = getAsig(pac.id, dep);
      f[dep] = a?.personalId?.toString() || '';
    });
    setForm(f);
    setModalPac(pac);
  };

  const guardar = async () => {
    setGuardando(true);
    await Promise.all(DEPS.map(async (dep) => {
      const personalId = form[dep] ? parseInt(form[dep]) : null;
      if (!personalId) {
        const existing = getAsig(modalPac.id, dep);
        if (existing) {
          await fetch(`http://localhost:4000/api/asignaciones-clinico/${existing.id}`, { method: 'DELETE' });
        }
        return;
      }
      const pers = personal.find(p => p.id === personalId);
      const nombre = pers ? `${pers.nombre || ''} ${pers.apellidoPaterno || ''}`.trim() : '';
      await fetch('http://localhost:4000/api/asignaciones-clinico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteId: modalPac.id, departamento: dep, terapeutaNombre: nombre, personalId }),
      });
    }));
    await cargar();
    setGuardando(false);
    setModalPac(null);
  };

  const filtrados = pacientes.filter(p =>
    (p.nombreCompleto || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const depColor = { 'Psicología': 'bg-violet-100 text-violet-700', 'Consejería': 'bg-sky-100 text-sky-700', 'Familia': 'bg-emerald-100 text-emerald-700' };

  const personalDep = (dep) => {
    const permitidos = PUESTOS_POR_DEP[dep] || [];
    const filtrado = personal.filter(p => permitidos.includes((p.puesto || '').toUpperCase()));
    // Si no hay nadie con el puesto específico, muestra todo el departamento clínico como fallback
    return filtrado.length > 0
      ? filtrado
      : personal.filter(p => (p.departamento || '').toUpperCase().includes('CLÍNICO'));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Asignación Terapéutica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Gestión de Cargalas Clínicas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <UserCog size={18} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Jefe Clínico</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    location.pathname === item.path
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <item.icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Pacientes',       val: pacientes.length,                                     color: 'border-l-[#7E1D3B]' },
                  { label: 'Completos',        val: pacientes.filter(p => contarCompletos(p.id) === 3).length, color: 'border-l-emerald-500' },
                  { label: 'Sin completar',   val: pacientes.filter(p => contarCompletos(p.id) < 3).length,   color: 'border-l-amber-500' },
                ].map(s => (
                  <div key={s.label} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${s.color} p-4 shadow-sm`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                    <p className="text-3xl font-black text-slate-800 mt-1">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Carga Clínica</h2>
                  </div>
                  <div className="relative md:w-72">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar paciente..." value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Paciente</th>
                        {DEPS.map(d => (
                          <th key={d} className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">{d}</th>
                        ))}
                        <th className="px-5 py-3.5 text-right text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrados.map((p, i) => (
                        <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800">{p.nombreCompleto}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] font-bold text-[#7E1D3B]">MK-{p.id.toString().padStart(4, '0')}</p>
                              {contarCompletos(p.id) === 3
                                ? <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Completo</span>
                                : <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{contarCompletos(p.id)}/3</span>
                              }
                            </div>
                          </td>
                          {DEPS.map(dep => {
                            const a = getAsig(p.id, dep);
                            return (
                              <td key={dep} className="px-5 py-4">
                                {a ? (
                                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${depColor[dep]}`}>
                                    <UserCheck size={12} /> {a.terapeutaNombre}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400">
                                    <UserX size={12} /> Sin asignar
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-5 py-4 text-right">
                            <button onClick={() => abrirModal(p)}
                              className="inline-flex items-center gap-1.5 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B] hover:text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors border border-[#7E1D3B]/20 shadow-sm">
                              <UserCog size={13} /> Asignar
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filtrados.length === 0 && (
                        <tr><td colSpan={5} className="px-5 py-10 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">Sin pacientes ingresados</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </main>
          </div>
        </header>
      </div>

      {/* Modal */}
      {modalPac && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="font-black text-slate-800 text-base">Asignar terapeutas</h3>
                <p className="text-[11px] text-[#7E1D3B] font-bold mt-0.5">{modalPac.nombreCompleto} · MK-{modalPac.id.toString().padStart(4,'0')}</p>
              </div>
              <button onClick={() => setModalPac(null)} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {DEPS.map(dep => (
                <div key={dep}>
                  <label className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 block px-2.5 py-1 rounded-lg w-fit ${depColor[dep]}`}>{dep}</label>
                  {(() => {
                    const opciones = personalDep(dep);
                    return (
                      <select value={form[dep] || ''}
                        onChange={e => setForm(f => ({ ...f, [dep]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#7E1D3B]/30">
                        <option value="">— Sin asignar —</option>
                        {opciones.map(p => (
                          <option key={p.id} value={p.id.toString()}>
                            {[p.nombre, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(' ')}
                            {p.puesto ? ` · ${p.puesto}` : ''}
                          </option>
                        ))}
                        {opciones.length === 0 && (
                          <option disabled>No hay personal registrado para esta área</option>
                        )}
                      </select>
                    );
                  })()}
                </div>
              ))}
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setModalPac(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} disabled={guardando}
                className="flex-1 py-2.5 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#63162e] transition-colors disabled:opacity-60">
                <Save size={15} /> {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsignacionesTerapeutas;
