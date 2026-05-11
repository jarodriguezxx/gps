import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, Search, Brain, ShieldCheck, Heart } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',        icon: LayoutDashboard, path: '/clinico/inicio' },
  { label: 'Directorio Auditoría',   icon: Users,           path: '/clinico/directorio' },
  { label: 'Validar Actividades',    icon: ClipboardCheck,   path: '/clinico/calendario' },
];

const DirectorioJefeClinico = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/pacientes')
      .then(res => res.json())
      .then(data => setPacientes(data.filter(p => (p.estadoPaciente || '').toUpperCase() === 'INGRESADO')));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <h1 className="text-xl font-black text-slate-800">Censo de Auditoría</h1>
            </div>
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center text-[#7E1D3B]"><Users size={18} /></div>
               <p className="text-sm font-bold text-slate-700">Supervisor Clínico</p>
            </div>
          </div>
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${location.pathname === item.path ? 'bg-[#7E1D3B] text-white shadow-md' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </aside>
            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 gap-4 bg-slate-50/50">
                   <div className="flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Control de Expedientes Activos</h2>
                  </div>
                  <div className="relative flex-1 md:max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar..." onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-9 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                        <th className="px-6 py-4">Paciente</th>
                        <th className="px-6 py-4 text-center">Acceso por Área Terapéutica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {pacientes.filter(p => p.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 text-sm">{p.nombreCompleto}</p>
                            <p className="text-[10px] font-bold text-[#7E1D3B]">Folio: MK-{p.id.toString().padStart(4, '0')}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => navigate(`/psicologia/expediente/${p.id}`)} className="px-3 py-2 bg-sky-50 text-sky-700 rounded-lg border border-sky-100 text-[10px] font-black uppercase hover:bg-sky-500 hover:text-white transition-all flex items-center gap-1.5"><Brain size={14}/> Psicología</button>
                              <button onClick={() => navigate(`/consejeria/expediente/${p.id}`)} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-[10px] font-black uppercase hover:bg-slate-800 hover:text-white transition-all flex items-center gap-1.5"><ShieldCheck size={14}/> Consejería</button>
                              <button onClick={() => navigate(`/familia/expediente/${p.id}`)} className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 text-[10px] font-black uppercase hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1.5"><Heart size={14}/> Familia</button>
                            </div>
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