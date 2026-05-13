import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, HeartHandshake, ChevronRight, CalendarPlus, Search, ShoppingCart, BadgeCheck } from 'lucide-react';

const getUsuarioPuesto = () => { try { return JSON.parse(localStorage.getItem('marakame_user') || '{}').puesto || ''; } catch { return ''; } };
const JEFES_CLINICO = ['JEFA (E) DEP. CLÍNICO', 'JEFE DEPARTAMENTO CLÍNICO'];
import marakameLogo from '../../assets/marakame.jpeg';

const ALL_NAV_ITEMS = [
  { label: 'Mis Pacientes',         icon: Users,        path: '/consejeria/inicio' },
  { label: 'Agendar Cita',          icon: CalendarPlus, path: '/consejeria/agendar' },
  { label: 'Requisiciones',         icon: ShoppingCart, path: '/consejeria/requisiciones' },
  { label: 'Validar Requisiciones', icon: BadgeCheck,   path: '/clinico/validar-requisiciones', soloParaPuesto: JEFES_CLINICO },
];

const PASOS_REQUERIDOS = [ "Historia de vida", "Autodiagnóstico", "Plan de consejería", "Prevención de recaídas", "Plan de vida", "Notas de evolución", "Entrevista final" ];
const TOTAL_PASOS = PASOS_REQUERIDOS.length;

const InicioConsejeria = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = ALL_NAV_ITEMS.filter(item => !item.soloParaPuesto || item.soloParaPuesto.includes(getUsuarioPuesto()));
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('TODOS'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resP = await fetch('http://localhost:4000/api/pacientes');
        if (!resP.ok) throw new Error("Error en red");
        const dataP = await resP.json();
        const pacientesIngresados = dataP.filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO');

        const pacientesConProgresoReal = await Promise.all(
          pacientesIngresados.map(async (p) => {
            let progresoReal = 0;
            try {
              const resD = await fetch(`http://localhost:4000/api/documentos/paciente/${p.id}`);
              if (resD.ok) {
                const documentos = await resD.json();
                const docsArea = documentos.filter(d => d.departamento === 'Consejería');
                const pasosCompletados = new Set(docsArea.map(d => d.nombrePaso)).size;
                progresoReal = Math.round((pasosCompletados / TOTAL_PASOS) * 100);
                if (progresoReal > 100) progresoReal = 100;
              }
            } catch (err) { console.warn("Error expediente", p.id); }
            return { ...p, progreso: progresoReal };
          })
        );
        setPacientes(pacientesConProgresoReal);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const pacientesFiltrados = pacientes.filter(p => {
    const coincideTexto = p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = filtro === 'TODOS' ? true : filtro === 'COMPLETOS' ? p.progreso === 100 : p.progreso < 100;
    return coincideTexto && coincideFiltro;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-bold">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Departamento de Consejería</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Sesión Activa</p>
                <p className="font-black text-slate-800">Consejero(a)</p>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-slate-700/30 bg-slate-700/10 flex items-center justify-center text-slate-700"><HeartHandshake size={18} /></div>
            </div>
          </div>
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
                  <item.icon size={16} className="shrink-0" /> <span>{item.label}</span>
                </button>
              ))}
            </aside>
            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-slate-700" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Pacientes Asignados</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Buscar paciente..." onChange={(e) => setBusqueda(e.target.value)} className="w-full pl-9 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" />
                    </div>
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="py-2 pl-3 pr-8 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-[#7E1D3B]/30 font-semibold text-slate-600 outline-none">
                      <option value="TODOS">Todos</option><option value="COMPLETOS">Completos</option><option value="INCOMPLETOS">Incompletos</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr><th className="px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Folio / Paciente</th><th className="px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Integración</th><th className="px-6 py-3.5 text-right text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Acción</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? <tr><td colSpan="3" className="py-10 text-center font-bold text-slate-400 animate-pulse">Calculando progreso...</td></tr> : pacientesFiltrados.map((p, i) => (
                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-6 py-4"><p className="font-bold text-slate-800 text-sm">{p.nombreCompleto}</p><p className="text-[10px] font-bold text-[#7E1D3B] mt-0.5">MK-{p.id.toString().padStart(4, '0')}</p></td>
                          <td className="px-6 py-4 w-64"><div className="flex items-center gap-3"><div className="w-full bg-slate-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-1000 ${p.progreso === 100 ? 'bg-emerald-500' : p.progreso >= 50 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${p.progreso}%` }}></div></div><span className="text-xs font-black text-slate-600 w-10 text-right">{p.progreso}%</span></div></td>
                          <td className="px-6 py-4 text-right"><button onClick={() => navigate(`/consejeria/expediente/${p.id}`)} className="inline-flex items-center gap-2 bg-[#7E1D3B] text-white hover:bg-[#63162e] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">Gestionar Archivos <ChevronRight size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};
export default InicioConsejeria;