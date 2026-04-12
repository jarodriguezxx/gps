import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Activity, FileText, Stethoscope, HeartPulse, Brain } from 'lucide-react';


const InputField = ({ label, type = "text", placeholder = "", width = "w-full" }) => (
    <div className={`flex flex-col gap-1 ${width}`}>
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
        />
    </div>
);

const CheckItem = ({ label }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
        <span className="text-sm text-slate-700">{label}</span>
        <div className="flex gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name={label} value="si" className="w-4 h-4 text-[#7E1D3B] border-slate-300 focus:ring-[#7E1D3B]" />
                <span className="text-xs font-bold text-slate-600">Sí</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name={label} value="no" defaultChecked className="w-4 h-4 text-slate-400 border-slate-300 focus:ring-slate-400" />
                <span className="text-xs font-bold text-slate-600">No</span>
            </label>
        </div>
    </div>
);

const sintomas = {
    cabeza: ['Cefalea', 'Lentes', 'Fosfenos', 'Visión Borrosa', 'Tinitus', 'Epistaxis'],
    cardio: ['Palpitaciones', 'Dolor Precordial', 'Edema Maleolar', 'Tos Seca', 'Disnea', 'Mareos', 'Hipertensión', 'Expectoración'],
    gastro: ['Vómito', 'Gastritis', 'Dolor Abdominal', 'Melena', 'Náuseas', 'Colitis', 'Diarrea', 'Estreñimiento'],
    genito: ['Secreciones', 'Disuria', 'Hematuria', 'Poliuria'],
    neuro: ['Intolerancia frío/calor', 'Pérdida del conocimiento', 'Convulsiones', 'Alucinaciones', 'Pérdida del Equilibrio', 'Lagunas Mentales']
};

const exploracionFisica = {
    cabeza: ['Normocéfalo', 'Pupilas Isocóricas', 'Reflejos a la luz y acomodación', 'Cicatrices', 'Isométricas', 'Movimientos Oculares', 'Fondo de Ojo'],
    orl: ['Oídos Secreción Seropurulenta', 'Tapones en Conductos', 'Nariz con Mucosa Congestionada'],
    orofaringe: ['Hiperémicas', 'Hipertrofia amigdalina', 'Caries'],
    cuello: ['Corto', 'Adenopatías Cervicales'],
    torax: ['Normolíneo', 'Deformidades', 'Cicatrices'],
    pulmones: ['Murmullos claros', 'Sibilancias', 'Crepitantes'],
    corazon: ['Ritmo Regular Sinusal', 'Arritmias'],
    abdomen: ['Blando', 'Globoso', 'Dolor', 'Ascitis', 'Plano', 'Cicatrices', 'Tumoración', 'Peristalsis'],
    extremidades: ['Isométricas', 'Edema', 'Cianosis', 'Várices']
};


const HistoriaMedicaForm = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
            {/* Header Superior Fijo (Estilo Marakame) */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 mb-6">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800">Historia Médica</h1>
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Nuevo Registro Clínico</p>
                        </div>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]">
                        <Save size={18} /> Guardar Expediente
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 space-y-6">
                
                {/* SECCIÓN 1: Ficha de Identificación */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-lg"><User size={20} /></div>
                        <h2 className="text-lg font-black text-slate-800">Ficha de Identificación</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <InputField label="Fecha" type="date" />
                        <InputField label="Expediente" placeholder="Ej. EXP-2026-001" />
                        <InputField label="Nombre Completo" placeholder="Nombre del paciente" width="lg:col-span-2" />
                        
                        <InputField label="Edad" type="number" />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Sexo</label>
                            <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15">
                                <option>Masculino</option>
                                <option>Femenino</option>
                            </select>
                        </div>
                        <InputField label="Estado Civil" />
                        <InputField label="Religión" />
                        
                        <InputField label="Lugar de Residencia" width="lg:col-span-2" />
                        <InputField label="Lugar de Origen" width="lg:col-span-2" />
                        
                        <InputField label="Ocupación" width="lg:col-span-2" />
                        <InputField label="Escolaridad" width="lg:col-span-2" />
                    </div>
                </section>

                {/* SECCIÓN 2: Historia de Consumo */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><AlertCircle size={20} /></div>
                        <h2 className="text-lg font-black text-slate-800">Historia de Consumo</h2>
                    </div>
                    <div className="p-6">
                        <textarea 
                            rows="6" 
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
                            placeholder="Describa detalladamente el historial de consumo del paciente..."
                        ></textarea>
                    </div>
                </section>

                {/* SECCIÓN 3: Antecedentes Personales y Familiares */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg"><HeartPulse size={20} /></div>
                            <h2 className="text-lg font-black text-slate-800">Antecedentes Personales</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <InputField label="Alergias" placeholder="Medicamentos, alimentos, etc." />
                            <InputField label="Enfermedades Exantemáticas" />
                            <InputField label="Antecedentes Quirúrgicos" />
                            <InputField label="Transfusiones Sanguíneas" />
                            
                            <div className="pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-bold text-slate-700 mb-3">Antecedentes Suicidas</h3>
                                <InputField label="Ideas Suicidas" placeholder="Especifique..." />
                                <div className="mt-3"><InputField label="Planes Suicidas" placeholder="Especifique..." /></div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><User size={20} /></div>
                            <h2 className="text-lg font-black text-slate-800">Historia Familiar</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {['Padre', 'Madre', 'Hermano/a 1', 'Hermano/a 2', 'Esposa/o', 'Hijos'].map(familiar => (
                                <div key={familiar} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-slate-100 pb-3 last:border-0">
                                    <span className="w-24 text-sm font-semibold text-slate-700">{familiar}</span>
                                    <input type="text" placeholder="Patología" className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-[#7E1D3B]" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* SECCIÓN 4: Interrogatorio por Aparatos y Sistemas (El formulario de checklists) */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="bg-[#7E1D3B]/5 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-[#7E1D3B]/10 text-[#7E1D3B] rounded-lg"><Activity size={20} /></div>
                        <h2 className="text-lg font-black text-slate-800">Interrogatorio por Aparatos y Sistemas</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        <div>
                            <h3 className="text-sm font-bold text-[#7E1D3B] uppercase tracking-widest mb-3 border-b-2 border-[#7E1D3B]/20 pb-1">Cabeza</h3>
                            <div className="flex flex-col">
                                {sintomas.cabeza.map(item => <CheckItem key={item} label={item} />)}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-[#7E1D3B] uppercase tracking-widest mb-3 border-b-2 border-[#7E1D3B]/20 pb-1">Cardiorrespiratorio</h3>
                            <div className="flex flex-col">
                                {sintomas.cardio.map(item => <CheckItem key={item} label={item} />)}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-[#7E1D3B] uppercase tracking-widest mb-3 border-b-2 border-[#7E1D3B]/20 pb-1">Gastrointestinal</h3>
                            <div className="flex flex-col">
                                {sintomas.gastro.map(item => <CheckItem key={item} label={item} />)}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-[#7E1D3B] uppercase tracking-widest mb-3 border-b-2 border-[#7E1D3B]/20 pb-1">Genitourinario</h3>
                            <div className="flex flex-col">
                                {sintomas.genito.map(item => <CheckItem key={item} label={item} />)}
                            </div>
                        </div>

                        <div className="md:col-span-2 lg:col-span-2">
                            <h3 className="text-sm font-bold text-[#7E1D3B] uppercase tracking-widest mb-3 border-b-2 border-[#7E1D3B]/20 pb-1">Endocrino / Neuropsiquiátrico</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                {sintomas.neuro.map(item => <CheckItem key={item} label={item} />)}
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECCIÓN 5: Exploración Física */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><Stethoscope size={20} /></div>
                        <h2 className="text-lg font-black text-slate-800">Exploración Física</h2>
                    </div>
                    
                    <div className="p-6 border-b border-slate-100">
                        <InputField label="Habitus Exterior" placeholder="Descripción general..." />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <InputField label="Presión Arterial" placeholder="120/80" />
                            <InputField label="Frecuencia Cardíaca" placeholder="x'" />
                            <InputField label="Frecuencia Respiratoria" placeholder="x'" />
                            <InputField label="Temperatura" placeholder="°C" />
                            <InputField label="Peso" placeholder="Kg" />
                            <InputField label="Estatura" placeholder="Mts" />
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(exploracionFisica).map(([categoria, items]) => (
                            <div key={categoria}>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">
                                    {categoria}
                                </h3>
                                <div className="flex flex-col">
                                    {items.map(item => <CheckItem key={item} label={item} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECCIÓN 6: Estado Mental, Diagnóstico y Plan */}
                <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden mb-10">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Brain size={20} /></div>
                        <h2 className="text-lg font-black text-slate-800">Estado Mental y Diagnóstico</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="Orientado" />
                            <InputField label="Lenguaje" />
                            <InputField label="Afecto" />
                            <InputField label="Pensamiento" />
                            <InputField label="Alteraciones Sensoperceptivas" />
                            <InputField label="Memoria" />
                            <InputField label="Juicio" />
                            <InputField label="Cognición" width="md:col-span-2" />
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">Diagnóstico</h3>
                            <textarea 
                                rows="5" 
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
                                placeholder="Escriba los puntos del diagnóstico..."
                            ></textarea>
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-2">Recomendaciones y Plan</h3>
                            <textarea 
                                rows="4" 
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-[#7E1D3B] focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
                                placeholder="Plan de tratamiento sugerido..."
                            ></textarea>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
};

export default HistoriaMedicaForm;