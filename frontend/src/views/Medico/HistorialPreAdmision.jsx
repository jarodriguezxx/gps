import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Eye, UserPlus, AlertCircle } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const HistorialPreAdmision = () => {
    const navigate = useNavigate();
    const [historias, setHistorias] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('http://localhost:4000/api/historias-medicas/pre-admision')
            .then(res => {
                if(!res.ok) throw new Error("Error en el servidor");
                return res.json();
            })
            .then(data => {
                setHistorias(data);
                setError(false);
            })
            .catch(err => {
                console.error("Error cargando historial:", err);
                setError(true);
            });
    }, []);

    const filtradas = historias.filter(h => 
        h.nombreProspecto?.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
                
                {/* --- HEADER --- */}
                <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/medico')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20}/>
                        </button>
                        <img src={marakameLogo} className="h-10 rounded-lg" alt="Marakame" />
                        <div>
                            <h1 className="text-lg font-black text-slate-800 tracking-tight">Bandeja de Pre-Admisión</h1>
                            <p className="text-[10px] text-[#7E1D3B] font-bold uppercase tracking-widest">Historias pendientes de vinculación</p>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre..." 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/10 text-sm transition-all"
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                </header>

                {/* --- MENSAJE DE ERROR --- */}
                {error && (
                    <div className="mb-5 flex items-center gap-3 bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-800 text-sm font-bold">
                        <AlertCircle size={20} />
                        Parece que el servidor no responde. Verifica que el backend esté en el puerto 4000.
                    </div>
                )}

                {/* --- TABLA DE RESULTADOS --- */}
                <main className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                    <th className="px-6 py-5">Fecha</th>
                                    <th className="px-6 py-5">Nombre del Prospecto</th>
                                    <th className="px-6 py-5">Diagnóstico Inicial</th>
                                    <th className="px-6 py-5 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtradas.length > 0 ? filtradas.map((h) => (
                                    <tr key={h.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5 text-xs font-bold text-slate-400">
                                            {new Date(h.fechaRegistro).toLocaleDateString('es-MX', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-800 group-hover:text-[#7E1D3B] transition-colors">{h.nombreProspecto}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mt-0.5">
                                                {h.edadProspecto} años • {h.sexoProspecto === 'M' ? 'Hombre' : 'Mujer'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-slate-600 italic line-clamp-1">
                                                    {h.diagnosticoCie10 || "Sin diagnóstico registrado"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-3">
                                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" title="Ver detalles">
                                                    <Eye size={20}/>
                                                </button>
                                                <button className="flex items-center gap-2 bg-[#7E1D3B] text-white px-5 py-2.5 rounded-xl text-[11px] font-black hover:bg-[#63162e] shadow-md shadow-rose-900/20 transition-all uppercase tracking-widest active:scale-95">
                                                    <UserPlus size={16}/> Vincular
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                <Search size={40} />
                                                <p className="font-bold italic">No se encontraron historias médicas...</p>
                                            </div>
                                        </td>
                                    </tr>
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