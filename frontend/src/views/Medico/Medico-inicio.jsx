import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ClipboardList, HeartPulse, Search, Calendar, FolderClock } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const MedicoInicio = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
                
                {/* --- HEADER LIMPIO --- */}
                <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
                    <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                        <div className="flex items-center gap-3">
                            <img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
                                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Médico</p>
                                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Área responsable: Médico</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-end md:self-auto">
                            <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center" aria-hidden="true" />
                            <div className="text-right md:text-left">
                                <p className="text-xs text-slate-500">Sesión activa</p>
                                <p className="font-semibold text-slate-700">Médico</p>
                            </div>
                        </div>
                    </div>

                </header>

                <main className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                        
                        {/* --- BARRA LATERAL (SIDEBAR) --- */}
                        <aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
                            {[
                                { label: 'Inicio', path: '/medico' },
                                { label: 'Expediente', path: '/medico/expediente' },
                                { label: 'Nutriología', path: '/medico/nutriologia/evaluacion-nutricional' },
                                { label: 'Historial Pre-Admisión', path: '/medico/historial-pre-admision' }, // Nueva opción
                                { label: 'Inventario', path: '/medico/inventario-pertenencias' },
                                { label: 'Pacientes Activos', path: '/medico/pacientes-activos' }
                            ].map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className="mb-2 w-full rounded-xl bg-[#7E1D3B] px-3 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e] active:scale-[0.98]"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </aside>

                        {/* --- CONTENIDO PRINCIPAL --- */}
                        <div className="space-y-5">
                            <section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Vista principal</p>
                                        <h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Módulo médico</h2>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                        
                                    </div>
                                </div>
                            </section>

                            {/* --- CUADRÍCULA DE ACCIONES PRINCIPALES --- */}
                            <section className="grid gap-4 md:grid-cols-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/medico/historia-medica')}
                                    className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5"
                                >
                                    <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B] group-hover:bg-[#7E1D3B] group-hover:text-white transition-colors">
                                        <HeartPulse size={20} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Historia médica</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Captura antecedentes, signos vitales y plan inicial.</p>
                                </button>

                                {/* NUEVO BOTÓN DE HISTORIAL EN LA CUADRÍCULA */}
                                <button
                                    type="button"
                                    onClick={() => navigate('/medico/historial-pre-admision')}
                                    className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5"
                                >
                                    <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B] group-hover:bg-[#7E1D3B] group-hover:text-white transition-colors">
                                        <FolderClock size={20} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Historial Pre-Admisión</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Consulta y vincula historias médicas de prospectos.</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/medico/nutriologia/evaluacion-nutricional')}
                                    className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5"
                                >
                                    <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B] group-hover:bg-[#7E1D3B] group-hover:text-white transition-colors">
                                        <ClipboardList size={20} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Nutriología</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Captura antropometría y plan nutricional.</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/medico/inventario-pertenencias')}
                                    className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5"
                                >
                                    <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B] group-hover:bg-[#7E1D3B] group-hover:text-white transition-colors">
                                        <ClipboardList size={20} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Inventario de pertenencias</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Registra ropa, calzado y artículos.</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/medico/consulta-diaria')}
                                    className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5"
                                >
                                    <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B] group-hover:bg-[#7E1D3B] group-hover:text-white transition-colors">
                                        <Calendar size={20} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Hoja de consulta diaria</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Registro de pacientes y diagnósticos diarios.</p>
                                </button>

                                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B]">
                                        <Activity size={20} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Estado del módulo</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Interfaz simplificada y lista para datos.</p>
                                </div>
                            </section>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MedicoInicio;