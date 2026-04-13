import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Droplet, CalendarClock } from 'lucide-react';

const ControlGlicemia = () => {
    const navigate = useNavigate();
    
    // Datos dinámicos del paciente
    const pacienteMock = { nombre: "Nombre del Paciente", clave: "0000" };
    
    const [registros, setRegistros] = useState([]);
    const [formData, setFormData] = useState({
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().slice(0, 5),
        resultado: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const agregarRegistro = (e) => {
        e.preventDefault();
        if (!formData.resultado) return;
        setRegistros([...registros, { ...formData, id: Date.now() }]);
        setFormData({ ...formData, resultado: '' });
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
            {/* Header Fijo */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 mb-6">
                <div className="mx-auto max-w-5xl flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Droplet className="text-sky-500" size={24} fill="currentColor" /> 
                            Control de Glicemia
                        </h1>
                        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Expediente Clínico</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 space-y-6">
                
                {/* Banner de Información */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Paciente</p>
                            <p className="text-lg font-black text-[#7E1D3B]">{pacienteMock.nombre}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Clave</p>
                            <p className="text-lg font-black text-slate-800">{pacienteMock.clave}</p>
                        </div>
                    </div>
                    <div className="bg-sky-50 px-6 py-3 flex items-center gap-3 border-b border-sky-100">
                        <CalendarClock className="text-sky-600" size={20} />
                        <p className="text-sm font-bold text-sky-800">
                            INSTRUCCIÓN: Toma de glucosa los días Lunes, Miércoles y Viernes.
                        </p>
                    </div>
                    
                    {/* Formulario de Captura */}
                    <div className="p-6 bg-white">
                        <form onSubmit={agregarRegistro} className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[120px]">
                                <label className="text-xs font-semibold text-slate-600 uppercase">Fecha</label>
                                <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
                            </div>
                            <div className="flex-1 min-w-[100px]">
                                <label className="text-xs font-semibold text-slate-600 uppercase">Hora</label>
                                <input type="time" name="hora" value={formData.hora} onChange={handleInputChange} className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
                            </div>
                            <div className="flex-2 min-w-[150px]">
                                <label className="text-xs font-semibold text-slate-600 uppercase">Toma en Ayuno (mg/dL)</label>
                                <input type="number" name="resultado" value={formData.resultado} onChange={handleInputChange} required placeholder="Ej. 95" className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
                            </div>
                            <button type="submit" className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-700 h-[38px]">
                                <Plus size={18} /> Registrar
                            </button>
                        </form>
                    </div>
                </section>

                {/* Tabla de Historial */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold border-r border-slate-200">Fecha</th>
                                    <th className="px-6 py-4 font-bold border-r border-slate-200">Hora</th>
                                    <th className="px-6 py-4 font-bold text-center">Toma en Ayuno (mg/dL)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.length === 0 ? (
                                    <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-400 italic">No hay tomas registradas.</td></tr>
                                ) : (
                                    registros.map((reg) => (
                                        <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-6 py-3 border-r border-slate-100 font-medium">{reg.fecha}</td>
                                            <td className="px-6 py-3 border-r border-slate-100">{reg.hora}</td>
                                            <td className="px-6 py-3 text-center font-bold text-slate-800">{reg.resultado} <span className="text-xs text-slate-400 font-normal">mg/dL</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ControlGlicemia;