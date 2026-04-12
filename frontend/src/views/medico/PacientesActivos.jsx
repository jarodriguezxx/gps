import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Activity, Droplet, FileText, Plus, Home, 
    Stethoscope, ShieldAlert, Users, ClipboardList, BookOpen, Search 
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg'; // Asegúrate de que esta ruta sea correcta

// Datos de prueba basados en tu captura
const pacientesMocks = [
    { clave: 'HGU-18', adiccion: 'Ludopatía', habitacion: '10', edad: 35, observaciones: 'El paciente no presentó comportamientos raros' },
    { clave: 'HGU-22', adiccion: 'Alcoholismo', habitacion: '4', edad: 28, observaciones: 'Paciente estable, sin incidentes reportados' },
    { clave: 'HGU-31', adiccion: 'Tabaquismo', habitacion: '7', edad: 41, observaciones: 'Presenta ansiedad moderada, bajo control' },
];

const PacientesActivos = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Verificación de ruta activa para pintar el menú
    const currentPath = location.pathname;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-10">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
                
                {/* --- HEADER --- */}
                <header className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-5">
                    <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                        <div className="flex items-center gap-4">
                            <img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto object-contain" />
                            <div className="border-l-2 border-slate-200 pl-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7E1D3B] font-bold">Instituto Marakame</p>
                                <h1 className="text-xl font-black text-slate-800 leading-tight">Sistema Integral Marakame</h1>
                                <p className="text-[11px] uppercase tracking-[0.1em] text-slate-400 font-semibold">Módulo Médico</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-end md:self-auto">
                            <div className="h-10 w-10 rounded-full border border-[#7E1D3B]/20 bg-[#7E1D3B]/5 flex items-center justify-center text-[#7E1D3B]">
                                <Stethoscope size={20} />
                            </div>
                            <div className="text-right md:text-left">
                                <p className="text-[10px] uppercase text-slate-500 font-semibold">Sesión activa</p>
                                <p className="font-bold text-slate-700 text-sm">Enfermero</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- CONTENIDO PRINCIPAL Y SIDEBAR --- */}
                <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                    
                    {/* --- MENÚ LATERAL --- */}
                    <aside className="space-y-2">
                        <button
                            onClick={() => navigate('/medico')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                currentPath === '/medico'
                                    ? 'bg-[#7E1D3B] text-white shadow-md'
                                    : 'bg-[#7E1D3B]/5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10 border border-[#7E1D3B]/10'
                            }`}
                        >
                            <Home size={18} /> Inicio
                        </button>
                        
                        <button
                            onClick={() => navigate('/medico/evaluacion-medica')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                currentPath.includes('evaluacion')
                                    ? 'bg-[#7E1D3B] text-white shadow-md'
                                    : 'bg-[#7E1D3B]/5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10 border border-[#7E1D3B]/10'
                            }`}
                        >
                            <Stethoscope size={18} /> Evaluación médica
                        </button>

                        <button
                            onClick={() => navigate('/medico/protocolo-desintoxicacion')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                currentPath.includes('protocolo')
                                    ? 'bg-[#7E1D3B] text-white shadow-md'
                                    : 'bg-[#7E1D3B]/5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10 border border-[#7E1D3B]/10'
                            }`}
                        >
                            <ShieldAlert size={18} /> Protocolo de<br/>desintoxicación
                        </button>

                        <button
                            onClick={() => navigate('/medico/pacientes-activos')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                currentPath.includes('pacientes-activos')
                                    ? 'bg-[#7E1D3B] text-white shadow-md'
                                    : 'bg-[#7E1D3B]/5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10 border border-[#7E1D3B]/10'
                            }`}
                        >
                            <Users size={18} /> Pacientes activos
                        </button>

                        <button
                            onClick={() => navigate('/medico/historial-evaluaciones')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                currentPath.includes('historial-evaluaciones')
                                    ? 'bg-[#7E1D3B] text-white shadow-md'
                                    : 'bg-[#7E1D3B]/5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10 border border-[#7E1D3B]/10'
                            }`}
                        >
                            <ClipboardList size={18} /> Historial de<br/>evaluaciones
                        </button>

                        <button
                            onClick={() => navigate('/medico/historial-protocolos')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                currentPath.includes('historial-protocolos')
                                    ? 'bg-[#7E1D3B] text-white shadow-md'
                                    : 'bg-[#7E1D3B]/5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10 border border-[#7E1D3B]/10'
                            }`}
                        >
                            <BookOpen size={18} /> Historial de protocolos
                        </button>
                    </aside>

                    {/* --- ÁREA PRINCIPAL (TABLA) --- */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                        
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Módulo Médico</h2>
                            <p className="text-sm font-semibold text-slate-500">Pacientes activos</p>
                        </div>

                        <div className="mb-6">
                            <button 
                                onClick={() => navigate('/medico/consulta-diaria')}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#63162e] shadow-sm"
                            >
                                <Plus size={18} /> Realizar consulta diaria
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200">
                                        <th className="px-4 py-4">Clave</th>
                                        <th className="px-4 py-4">Adicción</th>
                                        <th className="px-4 py-4 text-center">Habitación</th>
                                        <th className="px-4 py-4 text-center">Edad</th>
                                        <th className="px-4 py-4">Observaciones</th>
                                        <th className="px-4 py-4 text-center">Acciones Clínicas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pacientesMocks.map((paciente) => (
                                        <tr key={paciente.clave} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-4 py-4 font-bold text-[#7E1D3B]">{paciente.clave}</td>
                                            <td className="px-4 py-4 text-slate-700">{paciente.adiccion}</td>
                                            <td className="px-4 py-4 text-center text-slate-700">{paciente.habitacion}</td>
                                            <td className="px-4 py-4 text-center text-slate-700">{paciente.edad}</td>
                                            <td className="px-4 py-4 text-slate-600 truncate max-w-xs">{paciente.observaciones}</td>
                                            
                                            {/* COLUMNA DE ACCIONES CON LOS ÍCONOS */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/medico/pacientes/${paciente.clave}/tension`)}
                                                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                                        title="Registrar Tensión Arterial"
                                                    >
                                                        <Activity size={18} />
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => navigate(`/medico/pacientes/${paciente.clave}/glicemia`)}
                                                        className="p-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 transition-colors"
                                                        title="Registrar Glicemia"
                                                    >
                                                        <Droplet size={18} />
                                                    </button>

                                                    <button 
                                                        onClick={() => navigate(`/medico/expediente`)}
                                                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                                        title="Ver Expediente General"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-400 border-t border-slate-200">
                                {pacientesMocks.length} pacientes activos
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PacientesActivos;