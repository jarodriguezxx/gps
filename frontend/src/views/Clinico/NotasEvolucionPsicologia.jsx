import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Plus, ArrowLeft } from 'lucide-react';

const NotasEvolucionPsicologia = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // <-- Sabemos de qué paciente son las notas
    
    const [notas, setNotas] = useState([
        { id: 1, fecha: '2026-03-20', tipo: 'Individual', profesional: 'Lic. Psicología' },
        { id: 2, fecha: '2026-03-22', tipo: 'Grupal', profesional: 'Lic. Psicología' },
    ]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto mt-10">
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Notas de Evolución</h2>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Paciente: {id || 'Pendiente'}</p>
                        </div>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#63162e] w-full sm:w-auto">
                        <Plus size={16} /> Nueva Nota Escaneada
                    </button>
                </div>

                <div className="space-y-3">
                    {notas.map(nota => (
                        <div key={nota.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-3">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-2 rounded-lg text-slate-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Nota de evolución {nota.tipo}</p>
                                    <p className="text-xs text-slate-500">{nota.fecha} • {nota.profesional}</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-[#7E1D3B] hover:underline bg-[#7E1D3B]/5 px-3 py-1.5 rounded-lg w-full sm:w-auto text-center">
                                Ver PDF
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotasEvolucionPsicologia;