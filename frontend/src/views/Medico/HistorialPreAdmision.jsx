import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Eye, UserPlus } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const HistorialPreAdmision = () => {
    const navigate = useNavigate();
    const [historias, setHistorias] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        fetch('http://localhost:8080/api/historias-medicas/pre-admision')
            .then(res => res.json())
            .then(data => setHistorias(data))
            .catch(err => console.error("Error cargando historial:", err));
    }, []);

    const filtradas = historias.filter(h => 
        h.nombreProspecto.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
                <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/medico')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
                        <img src={marakameLogo} className="h-10" alt="Marakame" />
                        <div>
                            <h1 className="text-lg font-black text-slate-800">Bandeja de Pre-Admisión</h1>
                            <p className="text-[10px] text-[#7E1D3B] font-bold uppercase tracking-widest">Historias pendientes de vinculación</p>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre..." 
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#7E1D3B] text-sm"
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                </header>

                <main className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Nombre del Prospecto</th>
                                    <th className="px-6 py-4">Diagnóstico</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtradas.length > 0 ? filtradas.map((h) => (
                                    <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                            {new Date(h.fechaRegistro).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-800">{h.nombreProspecto}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">{h.edadProspecto} años • {h.sexoProspecto}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 italic truncate max-w-xs">
                                            {h.diagnosticoCie10}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Eye size={18}/></button>
                                                <button className="flex items-center gap-2 bg-[#7E1D3B] text-white px-4 py-2 rounded-lg text-[10px] font-bold hover:bg-[#63162e] transition-all uppercase tracking-wider">
                                                    <UserPlus size={14}/> Vincular
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">No hay historias médicas pendientes.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HistorialPreAdmision;