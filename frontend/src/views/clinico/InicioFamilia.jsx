import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, ChevronRight, CalendarPlus, Search, ShoppingCart, BadgeCheck } from 'lucide-react';

const getUsuarioPuesto = () => { try { return JSON.parse(localStorage.getItem('marakame_user') || '{}').puesto || ''; } catch { return ''; } };
const JEFES_CLINICO = ['JEFA (E) DEP. CLÍNICO', 'JEFE DEPARTAMENTO CLÍNICO'];
import marakameLogo from '../../assets/marakame.jpeg';

const ALL_NAV_ITEMS = [
  { label: 'Mis Pacientes',         icon: Users,        path: '/familia/inicio' },
  { label: 'Agendar Cita',          icon: CalendarPlus, path: '/familia/agendar' },
  { label: 'Requisiciones',         icon: ShoppingCart, path: '/familia/requisiciones' },
  { label: 'Validar Requisiciones', icon: BadgeCheck,   path: '/clinico/validar-requisiciones', soloParaPuesto: JEFES_CLINICO },
];
const PASOS_REQUERIDOS = [ "Genograma", "Entrevista inicial familiar", "Diagnóstico familiar", "Plan de intervención", "Sesión familiar", "Notas de evolución", "Cierre y recomendaciones" ];

const InicioFamilia = () => {
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
        const pacientesIngresados = (await resP.json()).filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO');

        const pacientesConProgresoReal = await Promise.all(
          pacientesIngresados.map(async (p) => {
            let progresoReal = 0;
            try {
              const resD = await fetch(`http://localhost:4000/api/documentos/paciente/${p.id}`);
              if (resD.ok) {
                const docsArea = (await resD.json()).filter(d => d.departamento === 'Familia');
                progresoReal = Math.round((new Set(docsArea.map(d => d.nombrePaso)).size / PASOS_REQUERIDOS.length) * 100);
                if (progresoReal > 100) progresoReal = 100;
              }
            } catch (err) {}
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
    return coincideTexto && (filtro === 'TODOS' ? true : filtro === 'COMPLETOS' ? p.progreso === 100 : p.progreso < 100);
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3"><img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border bg-white p-1" /><div><p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B] font-bold">Instituto Marakame</p><h1 className="text-xl font-black text-slate-800">Departamento de Familia</h1></div></div>
            <div className="flex items-center gap-3"><div className="text-right"><p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Sesión Activa</p><p className="font-black text-slate-800">Encargado de Familia</p></div><div className="h-10 w-10 rounded-full border-2 border-[#A13D5A]/30 bg-[#A13D5A]/10 flex items-center justify-center text-[#A13D5A]"><Users size={18} /></div></div>
          </div>
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B]'}`}>
                  <item.icon size={16} /> <span>{item.label}</span>
                </button>
              ))}
            </aside>
            <main>
              <section className="bg-white rounded-2xl border shadow-sm flex flex-col">
                <div className="flex justify-between p-5 border-b bg-slate-50/50">
                  <div className="flex items-center gap-2"><div className="h-5 w-1 rounded-full bg-[#A13D5A]" /><h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Pacientes Asignados</h2></div>
                  <div className="flex gap-3"><input type="text" placeholder="Buscar paciente..." onChange={(e) => setBusqueda(e.target.value)} className="w-64 px-3 py-2 rounded-xl border bg-white text-sm focus:ring-2 focus:ring-[#7E1D3B]/30" /></div>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b"><tr><th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500">Paciente</th><th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500">Integración</th><th className="px-6 py-3.5 text-right text-[11px] font-black uppercase text-slate-500">Acción</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? <tr><td colSpan="3" className="py-10 text-center font-bold text-slate-400">Calculando...</td></tr> : pacientesFiltrados.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                          <td className="px-6 py-4"><p className="font-bold text-slate-800">{p.nombreCompleto}</p></td>
                          <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-full bg-slate-200 rounded-full h-2"><div className={`h-2 rounded-full ${p.progreso === 100 ? 'bg-emerald-500' : 'bg-[#A13D5A]'}`} style={{ width: `${p.progreso}%` }}></div></div><span className="text-xs font-black text-slate-600">{p.progreso}%</span></div></td>
                          <td className="px-6 py-4 text-right"><button onClick={() => navigate(`/familia/expediente/${p.id}`)} className="inline-flex items-center gap-2 bg-[#7E1D3B] text-white px-4 py-2.5 rounded-xl text-xs font-bold">Archivos <ChevronRight size={14} /></button></td>
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
export default InicioFamilia;