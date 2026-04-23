import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Brain, Users, History, Search, FileText, 
    LogOut, ClipboardList, Activity 
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg'; // Revisa que la ruta sea correcta

// Datos de prueba (Pacientes activos asignados al área de psicología)
const pacientesPsicologia = [
    { clave: 'HGU-18', adiccion: 'Ludopatía', fase: 'Rehabilitación', edad: 35, ultimaNota: '2026-04-10' },
    { clave: 'HGU-22', adiccion: 'Alcoholismo', fase: 'Desintoxicación', edad: 28, ultimaNota: '2026-04-11' },
    { clave: 'HGU-31', adiccion: 'Tabaquismo', fase: 'Integración', edad: 41, ultimaNota: '2026-04-09' },
];

const PsicologiaInicio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-10">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
                
                {/* --- HEADER DEL PSICÓLOGO --- */}
                <header className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-5">
                    <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                        <div className="flex items-center gap-4">
                            <img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto object-contain" />
                            <div className="border-l-2 border-slate-200 pl-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7E1D3B] font-bold">Instituto Marakame</p>
                                <h1 className="text-xl font-black text-slate-800 leading-tight">Sistema Integral Marakame</h1>
                                <p className="text-[11px] uppercase tracking-[0.1em] text-slate-400 font-semibold">Módulo de Psicología</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-end md:self-auto">
                            <div className="h-10 w-10 rounded-full border border-purple-200 bg-purple-50 flex items-center justify-center text-purple-700">
                                <Brain size={20} />
                            </div>
                            <div className="text-right md:text-left">
                                <p className="text-[10px] uppercase text-slate-500 font-semibold">Sesión activa</p>
                                <p className="font-bold text-slate-700 text-sm">Psicólogo</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                    
                    {/* --- MENÚ LATERAL (Exclusivo de Psicología) --- */}
                    <aside className="space-y-2">
                        <button
                            onClick={() => navigate('/psicologia')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                currentPath === '/psicologia'
                                    ? 'bg-[#7E1D3B] text-white shadow-md'
                                    : 'bg-[#7E1D3B]/5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10 border border-[#7E1D3B]/10'
                            }`}
                        >
                            <Users size={18} /> Pacientes activos
                        </button>
                        
                        <button
                            onClick={() => navigate('/psicologia/historial-notas')}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
                        >
                            <History size={18} /> Archivo histórico
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition mt-8"
                        >
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                    </aside>

                    {/* --- ÁREA PRINCIPAL: LISTA DE PACIENTES --- */}
                    <div className="space-y-6">
                        
                        {/* Indicadores Rápidos */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Pacientes Asignados</p>
                                <p className="text-3xl font-black text-slate-800 mt-1">12</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Terapias Hoy</p>
                                <p className="text-3xl font-black text-[#7E1D3B] mt-1">4</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Notas Pendientes</p>
                                <p className="text-3xl font-black text-amber-600 mt-1">2</p>
                            </div>
                        </div>

                        {/* Tabla de Pacientes Activos */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Pacientes Activos</h2>
                                    <p className="text-sm text-slate-500">Seleccione un paciente para gestionar su expediente psicológico.</p>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por clave..." 
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-[#7E1D3B]"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">
                                            <th className="px-4 py-4">Clave</th>
                                            <th className="px-4 py-4">Adicción / Diagnóstico</th>
                                            <th className="px-4 py-4 text-center">Fase</th>
                                            <th className="px-4 py-4 text-center">Última Nota</th>
                                            <th className="px-4 py-4 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pacientesPsicologia.map((paciente) => (
                                            <tr key={paciente.clave} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-4 py-4 font-bold text-[#7E1D3B]">{paciente.clave}</td>
                                                <td className="px-4 py-4 text-slate-700">{paciente.adiccion}</td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold">
                                                        {paciente.fase}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center text-slate-500">{paciente.ultimaNota}</td>
                                                
                                                {/* ACCIÓN PRINCIPAL: IR A DOCUMENTOS */}
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => navigate(`/psicologia/paciente/${paciente.clave}/documentos`)}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B] hover:bg-[#7E1D3B] hover:text-white transition-colors font-bold text-xs"
                                                            title="Gestionar Documentos"
                                                        >
                                                            <ClipboardList size={16} /> Documentos
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PsicologiaInicio;