import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Save, ChevronRight, ChevronLeft, 
    HeartPulse, Stethoscope, Brain, User, 
    Activity, ClipboardList 
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

// Constantes completas de Checkboxes
const aparatosSistemas = {
    sisCabeza: ['Cefalea', 'Visión borrosa', 'Lentes', 'Tinitus', 'Fosfenos', 'Epistaxis'],
    sisCardio: ['Palpitaciones', 'Disnea', 'Dolor precordial', 'Mareos', 'Edema maleolar', 'Hipertensión', 'Tos seca', 'Expectoración'],
    sisGastro: ['Vómito', 'Náuseas', 'Gastritis', 'Colitis', 'Dolor abdominal', 'Diarrea', 'Melena', 'Estreñimiento'],
    sisGenito: ['Secreciones', 'Disuria', 'Hematuria', 'Poliuria'],
    sisNeuro: ['Intolerancia frío o calor', 'Convulsiones', 'Pérdida del conocimiento', 'Alucinaciones'],
};

const exploracionFisica = {
    expCabeza: ['Normocéfalo', 'Cicatrices', 'Pupilas isocóricas', 'Isométricas', 'Reflejos a la luz', 'Movimientos oculares', 'Fondo de ojo'],
    expOrl: ['Secreción seropurulenta', 'Tapones en conductos', 'Mucosa congestionada'],
    expOrofaringe: ['Hiperémicas', 'Hipertrofia amigdalina', 'Caries'],
    expCuello: ['Corto', 'Adenopatías cervicales'],
    expTorax: ['Normolíneo', 'Deformidades', 'Cicatrices'],
    expPulmones: ['Murmullos claros y ventilados', 'Sibilancias', 'Crepitantes'],
    expCorazon: ['Ritmo regular sinusal', 'Arritmias'],
    expAbdomen: ['Blando', 'Plano', 'Globoso', 'Cicatrices', 'Dolor', 'Tumoración', 'Ascitis'],
    expExtremidades: ['Isométricas', 'Cianosis', 'Edema', 'Varices'],
};

const HistoriaMedica = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // ESTADO CON TODOS LOS CAMPOS QUE DEFINIMOS
    const [formData, setFormData] = useState({
        nombreProspecto: '', edadProspecto: '', sexoProspecto: 'M',
        estadoCivilProspecto: '', religionProspecto: '', lugarResidencia: '',
        lugarOrigen: '', ocupacion: '', escolaridad: '', historiaConsumo: '',
        // Listas de checkboxes (Paso 2 y 3)
        sisCabeza: [], sisCardio: [], sisGastro: [], sisGenito: [], sisNeuro: [],
        expCabeza: [], expOrl: [], expOrofaringe: [], expCuello: [], expTorax: [], 
        expPulmones: [], expCorazon: [], expAbdomen: [], expExtremidades: [],
        diagnosticoCie10: '', recomendacionesPlan: '',
        medicoNombre: 'Dr. Oswaldo Diaz', medicoCedula: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (grupo, item) => {
        setFormData(prev => {
            const listaActual = prev[grupo] || [];
            const nuevaLista = listaActual.includes(item)
                ? listaActual.filter(i => i !== item)
                : [...listaActual, item];
            return { ...prev, [grupo]: nuevaLista };
        });
    };

    const handleFinalizar = async () => {
        try {
            // ¡CAMBIO AL PUERTO 4000 AQUÍ!
            const response = await fetch('http://localhost:4000/api/historias-medicas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert("¡Historia Médica guardada con éxito en Neon!");
                navigate('/medico/historial-pre-admision');
            } else {
                alert("Error al guardar. Revisa que el backend esté corriendo.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor.");
        }
    };
    
    const CheckboxGroup = ({ title, items, grupo }) => (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-4">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#7E1D3B] border-b border-slate-100 pb-2">{title}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <label key={item} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 cursor-pointer hover:bg-white transition-all">
                        <input 
                            type="checkbox" 
                            className="h-4 w-4 text-[#7E1D3B] accent-[#7E1D3B]"
                            checked={formData[grupo]?.includes(item)}
                            onChange={() => handleCheckboxChange(grupo, item)}
                        />
                        <span>{item}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md md:px-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/medico')} className="p-2 rounded-full hover:bg-slate-100"><ArrowLeft size={22}/></button>
                        <img src={marakameLogo} className="h-10 w-auto rounded-lg" alt="Logo"/>
                        <div>
                            <h1 className="text-xl font-black text-slate-800">Historia Médica</h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7E1D3B]">Paso {step} de 3</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                {/* PASO 1: FICHA COMPLETA */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                            <h3 className="text-xl font-black mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
                                <User className="text-[#7E1D3B]"/> Ficha de Identificación
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="lg:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                                    <input name="nombreProspecto" value={formData.nombreProspecto} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none" placeholder="Nombre completo"/>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Edad</label>
                                    <input name="edadProspecto" type="number" value={formData.edadProspecto} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none"/>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Sexo</label>
                                    <select name="sexoProspecto" value={formData.sexoProspecto} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none">
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado Civil</label>
                                    <input name="estadoCivilProspecto" value={formData.estadoCivilProspecto} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none"/>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Religión</label>
                                    <input name="religionProspecto" value={formData.religionProspecto} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none"/>
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lugar de Residencia</label>
                                    <input name="lugarResidencia" value={formData.lugarResidencia} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none"/>
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lugar de Origen</label>
                                    <input name="lugarOrigen" value={formData.lugarOrigen} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none"/>
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Ocupación</label>
                                    <input name="ocupacion" value={formData.ocupacion} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none"/>
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Escolaridad</label>
                                    <input name="escolaridad" value={formData.escolaridad} onChange={handleInputChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#7E1D3B] outline-none"/>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Historia de Consumo</label>
                                <textarea name="historiaConsumo" value={formData.historiaConsumo} onChange={handleInputChange} rows={8} className="w-full rounded-[24px] border border-slate-200 bg-slate-50 p-6 text-sm outline-none focus:border-[#7E1D3B] resize-none shadow-inner" placeholder="Redacte la historia de consumo..."/>
                            </div>
                        </section>
                    </div>
                )}

                {/* PASO 2: SISTEMAS COMPLETOS */}
                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <CheckboxGroup title="1. Cabeza" items={aparatosSistemas.sisCabeza} grupo="sisCabeza" />
                        <CheckboxGroup title="2. Cardiorrespiratorio" items={aparatosSistemas.sisCardio} grupo="sisCardio" />
                        <CheckboxGroup title="3. Gastrointestinal" items={aparatosSistemas.sisGastro} grupo="sisGastro" />
                        <CheckboxGroup title="4. Genitourinario" items={aparatosSistemas.sisGenito} grupo="sisGenito" />
                        <CheckboxGroup title="5. Endocrino y Neurológico" items={aparatosSistemas.sisNeuro} grupo="sisNeuro" />
                    </div>
                )}

                {/* PASO 3: EXPLORACIÓN Y PLAN COMPLETO */}
                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <CheckboxGroup title="Exploración: Cabeza" items={exploracionFisica.expCabeza} grupo="expCabeza" />
                        <CheckboxGroup title="Exploración: ORL" items={exploracionFisica.expOrl} grupo="expOrl" />
                        <CheckboxGroup title="Exploración: Orofaringe" items={exploracionFisica.expOrofaringe} grupo="expOrofaringe" />
                        <CheckboxGroup title="Exploración: Cuello" items={exploracionFisica.expCuello} grupo="expCuello" />
                        <CheckboxGroup title="Exploración: Tórax" items={exploracionFisica.expTorax} grupo="expTorax" />
                        <CheckboxGroup title="Exploración: Pulmones" items={exploracionFisica.expPulmones} grupo="expPulmones" />
                        <CheckboxGroup title="Exploración: Corazón" items={exploracionFisica.expCorazon} grupo="expCorazon" />
                        <CheckboxGroup title="Exploración: Abdomen" items={exploracionFisica.expAbdomen} grupo="expAbdomen" />
                        <CheckboxGroup title="Exploración: Extremidades" items={exploracionFisica.expExtremidades} grupo="expExtremidades" />

                        <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm mt-6">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Activity className="text-[#7E1D3B]"/> Diagnóstico y Plan</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest">Diagnóstico (CIE-10)</label>
                                    <textarea name="diagnosticoCie10" value={formData.diagnosticoCie10} onChange={handleInputChange} rows={6} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-[#7E1D3B] shadow-inner"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-[#7E1D3B] uppercase tracking-widest">Recomendaciones y Plan</label>
                                    <textarea name="recomendacionesPlan" value={formData.recomendacionesPlan} onChange={handleInputChange} rows={6} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-[#7E1D3B] shadow-inner"/>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* BOTONES DE NAVEGACIÓN */}
                <div className="mt-12 flex justify-between items-center">
                    <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/medico')} className="flex items-center gap-2 px-8 py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-400 hover:bg-white transition-all">
                        <ChevronLeft size={20}/> Anterior
                    </button>
                    <button 
                        onClick={step === 3 ? handleFinalizar : () => { setStep(step + 1); window.scrollTo(0,0); }} 
                        className={`flex items-center gap-2 px-12 py-4 rounded-2xl font-black text-white shadow-xl transition-all ${step === 3 ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-[#7E1D3B] shadow-rose-900/20'}`}
                    >
                        {step === 3 ? 'Finalizar y Registrar' : 'Siguiente Paso'} <ChevronRight size={20}/>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default HistoriaMedica;