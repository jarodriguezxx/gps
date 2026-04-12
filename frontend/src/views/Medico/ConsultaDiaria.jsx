import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, ClipboardList, Calendar } from 'lucide-react';

const HojaConsultaDiaria = () => {
    const navigate = useNavigate();
    
    // Estado para la lista de pacientes registrados hoy
    const [registros, setRegistros] = useState([]);
    
    // Estado para el formulario actual
    const [formData, setFormData] = useState({
        nombre: '',
        edad: '',
        sexo: 'M',
        tipo: '1era',
        diagnostico: '',
        medico: 'Dr. Oswaldo Diaz' 
    });

    // Obtener fecha actual en formato legible
    const fechaActual = new Date().toLocaleDateString('es-MX', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const agregarRegistro = (e) => {
        e.preventDefault();
        if (!formData.nombre || !formData.diagnostico) return; 

        setRegistros([...registros, { ...formData, id: Date.now() }]);
        
        setFormData({
            ...formData,
            nombre: '',
            edad: '',
            sexo: 'M',
            tipo: '1era',
            diagnostico: ''
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
            {/* Header Fijo */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 mb-6">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <ClipboardList className="text-[#7E1D3B]" size={24} /> 
                                Hoja Médica de Consulta Diaria
                            </h1>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1 mt-1">
                                <Calendar size={12} /> {fechaActual}
                            </p>
                        </div>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]">
                        <Save size={18} /> Guardar Hoja del Día
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 space-y-6">
                
                {/* SECCIÓN 1: Formulario de Captura Rápida */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-6">
                    <h2 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Registrar Paciente</h2>
                    <form onSubmit={agregarRegistro} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        
                        <div className="md:col-span-4 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nombre del Paciente</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15" placeholder="Nombre completo" />
                        </div>

                        <div className="md:col-span-1 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Edad</label>
                            <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Sexo</label>
                            <select name="sexo" value={formData.sexo} onChange={handleInputChange} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]">
                                <option value="M">Masculino (M)</option>
                                <option value="F">Femenino (F)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tipo</label>
                            <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]">
                                <option value="1era">1era Vez</option>
                                <option value="Sub">Subsecuente</option>
                            </select>
                        </div>

                        <div className="md:col-span-3 flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Médico en turno</label>
                            <input type="text" name="medico" value={formData.medico} onChange={handleInputChange} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
                        </div>

                        <div className="md:col-span-10 flex flex-col gap-1 mt-2">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Diagnóstico</label>
                            <input type="text" name="diagnostico" value={formData.diagnostico} onChange={handleInputChange} required className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15" placeholder="Escriba el diagnóstico o motivo de consulta..." />
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700">
                                <Plus size={18} /> Agregar
                            </button>
                        </div>
                    </form>
                </section>

                {/* SECCIÓN 2: La Tabla Visual (Simulando la hoja física) */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
                                    <th className="px-4 py-3 font-bold border-r border-slate-200 text-center w-12">No.</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-200 uppercase">Nombre</th>
                                    <th className="px-2 py-3 font-bold border-r border-slate-200 text-center uppercase w-16">Edad</th>
                                    <th className="px-2 py-3 font-bold border-r border-slate-200 text-center uppercase w-12">M</th>
                                    <th className="px-2 py-3 font-bold border-r border-slate-200 text-center uppercase w-12">F</th>
                                    <th className="px-2 py-3 font-bold border-r border-slate-200 text-center uppercase w-20">1er Vez</th>
                                    <th className="px-2 py-3 font-bold border-r border-slate-200 text-center uppercase w-24">Subse-cuente</th>
                                    <th className="px-4 py-3 font-bold border-r border-slate-200 uppercase">Diagnóstico</th>
                                    <th className="px-4 py-3 font-bold uppercase">Médico en Turno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-8 text-center text-slate-400 italic">
                                            No hay consultas registradas el día de hoy. Llene el formulario superior para comenzar.
                                        </td>
                                    </tr>
                                ) : (
                                    registros.map((reg, index) => (
                                        <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-2 border-r border-slate-100 text-center font-semibold text-slate-500">{index + 1}</td>
                                            <td className="px-4 py-2 border-r border-slate-100 font-medium">{reg.nombre}</td>
                                            <td className="px-2 py-2 border-r border-slate-100 text-center">{reg.edad}</td>
                                            <td className="px-2 py-2 border-r border-slate-100 text-center font-bold text-[#7E1D3B]">{reg.sexo === 'M' ? 'X' : ''}</td>
                                            <td className="px-2 py-2 border-r border-slate-100 text-center font-bold text-[#7E1D3B]">{reg.sexo === 'F' ? 'X' : ''}</td>
                                            <td className="px-2 py-2 border-r border-slate-100 text-center font-bold text-[#7E1D3B]">{reg.tipo === '1era' ? 'X' : ''}</td>
                                            <td className="px-2 py-2 border-r border-slate-100 text-center font-bold text-[#7E1D3B]">{reg.tipo === 'Sub' ? 'X' : ''}</td>
                                            <td className="px-4 py-2 border-r border-slate-100">{reg.diagnostico}</td>
                                            <td className="px-4 py-2 text-slate-600 text-xs">{reg.medico}</td>
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

export default HojaConsultaDiaria;