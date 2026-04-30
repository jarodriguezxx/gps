import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, ClipboardList, Calendar, AlertCircle } from 'lucide-react';

const ConsultaDiaria = () => {
    const navigate = useNavigate();
    const { pacienteId } = useParams();
    
    const [pacienteInfo, setPacienteInfo] = useState(null);
    const [expedienteId, setExpedienteId] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [guardando, setGuardando] = useState(false);
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        motivo: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        medico: 'Dr. Oswaldo Diaz',
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().slice(0, 5)
    });

    // Obtener información del paciente y expediente
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                
                // Obtener datos del paciente
                const pacResponse = await fetch(`http://localhost:4000/api/pacientes/${pacienteId}`);
                if (pacResponse.ok) {
                    setPacienteInfo(await pacResponse.json());
                }
                
                // Obtener expediente del paciente
                const expedResponse = await fetch(`http://localhost:4000/api/expedientes/paciente/${pacienteId}`);
                if (expedResponse.ok) {
                    const exp = await expedResponse.json();
                    setExpedienteId(exp.id);
                } else {
                    setError('Crea un expediente para registrar consultas');
                }
                
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        if (pacienteId) {
            cargarDatos();
        }
    }, [pacienteId]);

    // Obtener fecha actual en formato legible
    const fechaActual = new Date().toLocaleDateString('es-MX', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const guardarConsulta = async (e) => {
        e.preventDefault();
        
        if (!formData.motivo || !formData.diagnostico || !expedienteId) {
            setError('Completa los campos requeridos');
            return;
        }

        try {
            setGuardando(true);
            
            // Guardar en expediente como archivo
            const response = await fetch(`http://localhost:4000/api/expedientes/${expedienteId}/archivo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    nombreArchivo: `Consulta ${formData.fecha} ${formData.hora}`,
                    rutaArchivo: `/consultas/${pacienteId}/${Date.now()}`,
                    tipoArchivo: 'TXT',
                    tipoDocumento: 'CONSULTA_DIARIA',
                    subidoPor: formData.medico
                })
            });

            if (response.ok) {
                setError(null);
                alert('✅ Consulta guardada en el expediente');
                
                // Limpiar formulario
                setFormData({
                    motivo: '',
                    diagnostico: '',
                    tratamiento: '',
                    observaciones: '',
                    medico: 'Dr. Oswaldo Diaz',
                    fecha: new Date().toISOString().split('T')[0],
                    hora: new Date().toTimeString().slice(0, 5)
                });
            }
        } catch (err) {
            setError('Error al guardar: ' + err.message);
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7E1D3B] mb-3"></div>
                    <p>Cargando información...</p>
                </div>
            </div>
        );
    }

    if (!pacienteInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <AlertCircle size={48} className="mx-auto mb-3" />
                    <p>No se encontró información del paciente</p>
                    <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-[#7E1D3B] text-white rounded-lg">
                        Volver
                    </button>
                </div>
            </div>
        );
    }

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
                                Consulta Diaria
                            </h1>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1 mt-1">
                                <Calendar size={12} /> {fechaActual}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]">
                        <ArrowLeft size={18} /> Volver
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 space-y-6">
                
                {/* INFORMACIÓN DEL PACIENTE */}
                <section className="bg-gradient-to-r from-[#7E1D3B]/10 to-rose-100/30 border border-[#7E1D3B]/20 rounded-[24px] shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">ID Paciente</p>
                            <p className="text-2xl font-black text-[#7E1D3B]">#{pacienteId}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Nombre</p>
                            <p className="text-lg font-bold text-slate-800">{pacienteInfo?.nombreCompleto || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Edad</p>
                            <p className="text-2xl font-black text-slate-800">{pacienteInfo?.edad} años</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Ocupación</p>
                            <p className="text-lg font-bold text-slate-800">{pacienteInfo?.ocupacion || '-'}</p>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {/* FORMULARIO DE CONSULTA */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-6">
                    <h2 className="text-lg font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Registrar Consulta Médica</h2>
                    <form onSubmit={guardarConsulta} className="space-y-4">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha</label>
                                <input 
                                    type="date" 
                                    name="fecha" 
                                    value={formData.fecha} 
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Hora</label>
                                <input 
                                    type="time" 
                                    name="hora" 
                                    value={formData.hora} 
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Médico en Turno</label>
                                <input 
                                    type="text" 
                                    name="medico" 
                                    value={formData.medico} 
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Motivo de Consulta *</label>
                            <input 
                                type="text" 
                                name="motivo" 
                                value={formData.motivo} 
                                onChange={handleInputChange} 
                                required
                                placeholder="Ej: Dolor de cabeza, fiebre, seguimiento, etc."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15" 
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Diagnóstico *</label>
                            <textarea 
                                name="diagnostico" 
                                value={formData.diagnostico} 
                                onChange={handleInputChange} 
                                required
                                placeholder="Diagnóstico clínico..."
                                rows="3"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15 resize-none" 
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tratamiento Indicado</label>
                            <textarea 
                                name="tratamiento" 
                                value={formData.tratamiento} 
                                onChange={handleInputChange}
                                placeholder="Medicinas, terapias, recomendaciones..."
                                rows="3"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15 resize-none" 
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Observaciones</label>
                            <textarea 
                                name="observaciones" 
                                value={formData.observaciones} 
                                onChange={handleInputChange}
                                placeholder="Notas adicionales..."
                                rows="2"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15 resize-none" 
                            />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button 
                                type="button" 
                                onClick={() => navigate(-1)}
                                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                disabled={guardando || !expedienteId}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#63162e] disabled:opacity-50"
                            >
                                <Save size={18} /> {guardando ? 'Guardando...' : 'Guardar Consulta'}
                            </button>
                        </div>
                    </form>
                </section>

            </div>
        </div>
    );
};

export default ConsultaDiaria;