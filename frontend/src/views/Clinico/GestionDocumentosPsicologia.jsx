import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <-- IMPORTANTE: Incluye useParams
import { 
    ArrowLeft, UploadCloud, FileCheck, Lock, 
    Plus, History, User, FileText, Brain, ChevronRight,
    Users, ClipboardList, ShieldAlert
} from 'lucide-react';

const GestionDocumentosPsicologia = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    
    const paciente = { nombre: "Clave del paciente", clave: id || "Pendiente", fase: "Desintoxicación" };

    const docsConfig = [
        { id: 9, label: "Entrevista inicial", icon: <FileText size={18} /> },
        { id: 8, label: "Primera terapia grupal", icon: <Users size={18} /> },
        { id: 7, label: "Evaluación psicosocial", icon: <Brain size={18} /> },
        { id: 6, label: "Plan de tratamiento psicológico", icon: <ClipboardList size={18} /> },
        { id: 5, label: "Daños por consumo / 10 consecuencias", icon: <ShieldAlert size={18} /> },
        { id: 4, label: "Sesión familiar", icon: <Users size={18} /> },
        { id: 3, label: "Notas de evolución", isRecurrent: true, icon: <History size={18} /> },
        { id: 2, label: "Despedida grupal", icon: <Users size={18} /> },
        { id: 1, label: "Entrevista de cierre", icon: <FileCheck size={18} /> },
    ];

    const [subidos, setSubidos] = useState([9, 8, 7]); // Simulamos que ya subió hasta el 7

    const estaBloqueado = (id) => {
        if (id === 3) return false; 
        if (id === 9) return false; 
        return !subidos.includes(id + 1); 
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            {/* --- HEADER --- */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 mb-6">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800">Expediente Psicológico</h1>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Carga de Documentación Escaneada</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
                        <User size={16} className="text-[#7E1D3B]" />
                        <span className="text-xs font-bold text-slate-700">{paciente.nombre} ({paciente.clave})</span>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4">
                <div className="grid gap-4">
                    {docsConfig.map((doc) => {
                        const bloqueado = estaBloqueado(doc.id);
                        const subido = subidos.includes(doc.id);

                        return (
                            <div 
                                key={doc.id}
                                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all gap-4 ${
                                    bloqueado 
                                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                                    : 'bg-white border-slate-200 shadow-sm hover:border-[#7E1D3B]/30'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${
                                        subido ? 'bg-emerald-100 text-emerald-700' : 
                                        bloqueado ? 'bg-slate-200 text-slate-400' : 'bg-[#7E1D3B]/10 text-[#7E1D3B]'
                                    }`}>
                                        {bloqueado ? <Lock size={20} /> : doc.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Paso 0{10 - doc.id}</span>
                                            {subido && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase"><FileCheck size={10}/> Subido</span>}
                                        </div>
                                        <h3 className={`font-bold ${bloqueado ? 'text-slate-400' : 'text-slate-800'}`}>
                                            {doc.label}
                                        </h3>
                                    </div>
                                </div>

                                <div>
                                    {doc.isRecurrent ? (
                                        <button 
                                            onClick={() => navigate(`/psicologia/paciente/${id}/notas-evolucion`)}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
                                        >
                                            Gestionar Notas <Plus size={14} />
                                        </button>
                                    ) : (
                                        !bloqueado && (
                                            <button className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                                                subido 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                                                : 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
                                            }`}>
                                                {subido ? 'Reemplazar Archivo' : 'Escanear / Subir'} <UploadCloud size={14} />
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GestionDocumentosPsicologia;