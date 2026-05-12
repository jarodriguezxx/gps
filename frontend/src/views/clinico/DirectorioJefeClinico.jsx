import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, UserCog, Search, ShieldCheck } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Tablero de Control',     icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Auditoría Clínica',      icon: Users,           path: '/clinico/directorio' },
  { label: 'Asignación Terapéutica', icon: UserCog,         path: '/clinico/asignaciones' },
  { label: 'Validación Terapéutica', icon: ClipboardCheck,  path: '/clinico/calendario' },
];

const DirectorioJefeClinico = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const PASOS_PSI = 9;
  const PASOS_CON = 7;
  const PASOS_FAM = 7;

  useEffect(() => {
    const cargar = async () => {
      try {
        const resPacientes = await fetch('http://localhost:4000/api/pacientes');
        const todos = await resPacientes.json();
        const ingresados = todos.filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO');

        const conProgreso = await Promise.all(ingresados.map(async (p) => {
          try {
            const resDocs = await fetch(`http://localhost:4000/api/documentos/paciente/${p.id}`);
            const docs = resDocs.ok ? await resDocs.json() : [];
            const pasos = (dep) => new Set(docs.filter(d => d.departamento === dep).map(d => d.nombrePaso)).size;
            return {
              ...p,
              progresoPsi: Math.round((pasos('Psicología') / PASOS_PSI) * 100),
              progresoCon: Math.round((pasos('Consejería') / PASOS_CON) * 100),
              progresoFam: Math.round((pasos('Familia')    / PASOS_FAM) * 100),
            };
          } catch {
            return { ...p, progresoPsi: 0, progresoCon: 0, progresoFam: 0 };
          }
        }));
        setPacientes(conProgreso);
      } catch (err) {
        console.error('Error cargando directorio clínico:', err);
      }
    };
    cargar();
  }, []);

  const getProgressColor = (percent) => percent >= 90 ? 'bg-emerald-500' : percent >= 60 ? 'bg-amber-400' : 'bg-rose-500';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Auditoría Documental</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Estado de Expedientes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Users size={18} className="text-[#7E1D3B]" />
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
                    location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <item.icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </aside>

            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Censo Clínico</h2>
                    </div>
                  </div>
                  <div className="relative md:w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar paciente..." onChange={(e) => setBusqueda(e.target.value)} 
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Paciente</th>
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Psicología</th>
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Consejería</th>
                        <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Familia</th>
                        <th className="px-5 py-3.5 text-right text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pacientes.filter(p => p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase())).map((p, i) => (
                        <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800">{p.nombreCompleto}</p>
                            <p className="text-[10px] font-bold text-[#7E1D3B] mt-0.5">MK-{p.id.toString().padStart(4, '0')}</p>
                          </td>
                          
                          {[p.progresoPsi, p.progresoCon, p.progresoFam].map((progreso, index) => (
                            <td key={index} className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${getProgressColor(progreso)}`} style={{ width: `${progreso}%` }}></div></div>
                                <span className="text-[10px] font-bold text-slate-600 w-8">{progreso}%</span>
                              </div>
                            </td>
                          ))}

                          <td className="px-5 py-4 text-right">
                            <button onClick={() => navigate(`/clinico/auditoria/${p.id}`)} 
                              className="inline-flex items-center gap-2 bg-rose-50 text-[#7E1D3B] hover:bg-[#7E1D3B] hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-rose-100 shadow-sm">
                              <ShieldCheck size={14} /> Auditar
                            </button>
                          </td>
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

export default DirectorioJefeClinico;