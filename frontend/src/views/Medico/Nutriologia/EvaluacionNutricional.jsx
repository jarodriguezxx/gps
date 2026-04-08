import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import marakameLogo from '../../../assets/marakame.jpeg';

const antecedentes = ['Padre', 'Madre', 'Hermanos', 'Esposa', 'Hijos'];
const signosYHabitos = ['Peso', 'Estatura', 'IMC', 'Presión arterial', 'Frecuencia cardiaca', 'Frecuencia respiratoria', 'Apetito', 'Evacuaciones', 'Hidratación', 'Sueño', 'Actividad física', 'Suplementos'];
const recordatorioDietario = ['Desayuno', 'Colación', 'Comida', 'Colación vespertina', 'Cena', 'Agua simple', 'Observaciones'];

const EvaluacionNutricional = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const isInicioNutriologia = window.location.pathname === '/nutriologia';

	return (
		<div className="min-h-screen bg-slate-100 text-slate-900">
			<div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
				<header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
					<div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
						<div className="flex items-center gap-3">
							<img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
							<div>
								<p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
								<h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
								<p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo de Nutriología</p>
								<p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Área responsable: Nutriología</p>
							</div>
						</div>
						<div className="flex items-center gap-3 self-end md:self-auto">
							<div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center" aria-hidden="true" />
							<div className="text-right md:text-left">
								<p className="text-xs text-slate-500">Sesión activa</p>
								<p className="font-semibold text-slate-700">Nutriología</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
						<div className="relative min-w-[240px] flex-1 md:max-w-[420px]">
							<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input type="text" placeholder="Buscar paciente, folio o valoración nutricional..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
						</div>
						<button type="button" onClick={() => navigate('/nutriologia')} className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]">
							Volver a nutriología <ArrowRight size={18} />
						</button>
					</div>
				</header>

				<main className="space-y-5">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<button type="button" onClick={() => navigate('/nutriologia')} className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${isInicioNutriologia ? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Inicio
						</button>
						<button type="button" onClick={() => navigate('/nutriologia/evaluacion-nutricional')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B] px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#63162e]">
							Nutriología
						</button>
						<button type="button" onClick={() => navigate('/nutriologia')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Resumen
						</button>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
							<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div>
									<p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Flujo de captura</p>
									<h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Evaluación nutricional</h2>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Paso {step} de 3</div>
							</div>
							<div className="mt-4 grid gap-2 md:grid-cols-3">
								<button type="button" onClick={() => setStep(1)} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 1 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>1. Antropometría</button>
								<button type="button" onClick={() => setStep(2)} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 2 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>2. Alimentación</button>
								<button type="button" onClick={() => setStep(3)} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 3 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>3. Cierre</button>
							</div>
						</section>

						<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							{[
								{ label: 'Paciente', value: 'María García López' },
								{ label: 'Folio', value: 'NUT-02641' },
								{ label: 'Área', value: 'Nutriología' },
								{ label: 'Estado', value: 'Pendiente valoración' },
							].map((item) => (
								<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
									<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
									<p className="mt-3 text-2xl font-black text-slate-900">{item.value}</p>
								</article>
							))}
						</section>

						{step === 1 && (
							<>
								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Antropometría y datos base</h3>
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
										{[
											{ label: 'Fecha', type: 'datetime-local' },
											{ label: 'Peso (kg)' },
											{ label: 'Estatura (m)' },
											{ label: 'IMC' },
											{ label: 'Cintura (cm)' },
											{ label: 'Cadera (cm)' },
											{ label: 'Edad' },
											{ label: 'Sexo' },
										].map((campo) => (
											<div key={campo.label} className={campo.label === 'Fecha' ? 'md:col-span-2 xl:col-span-4' : ''}>
												<label className="mb-1 block text-sm font-semibold text-slate-700">{campo.label}</label>
												<input type={campo.type || 'text'} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
											</div>
										))}
									</div>
								</section>

								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Historia familiar y clínica</h3>
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Alergias</label>
											<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Enfermedades previas</label>
											<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Antecedentes quirúrgicos</label>
											<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Antecedentes familiares</label>
											<select className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]">
												{antecedentes.map((item) => (
													<option key={item} value={item}>{item}</option>
												))}
											</select>
										</div>
									</div>
								</section>
							</>
						)}

						{step === 2 && (
							<>
								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Hábitos alimentarios</h3>
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
										{recordatorioDietario.map((campo) => (
											<div key={campo} className={campo === 'Observaciones' ? 'md:col-span-2 xl:col-span-3' : ''}>
												<label className="mb-1 block text-sm font-semibold text-slate-700">{campo}</label>
												{campo === 'Observaciones' ? <textarea rows={4} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" /> : <input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />}
											</div>
										))}
									</div>
								</section>

								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Signos y características relacionadas</h3>
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
										{signosYHabitos.map((campo) => (
											<div key={campo}>
												<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{campo}</label>
												<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
											</div>
										))}
									</div>
								</section>
							</>
						)}

						{step === 3 && (
							<>
								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Cierre nutricional</h3>
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Diagnóstico nutricional</label>
											<textarea rows={5} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Plan alimentario</label>
											<textarea rows={5} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
									</div>

									<div className="mt-4 grid gap-4 md:grid-cols-2">
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Nombre del nutriólogo</label>
											<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Cédula profesional</label>
											<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
									</div>
								</section>

								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<div className="flex justify-between gap-3">
										<button type="button" onClick={() => setStep((prev) => Math.max(prev - 1, 1))} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Anterior</button>
										<div className="flex gap-3">
											<button type="button" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Guardar borrador</button>
											<button type="button" className="rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#63162e]">Guardar evaluación</button>
										</div>
									</div>
								</section>
							</>
						)}

						{step < 3 && (
							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
								<div className="flex justify-between gap-3">
									<button type="button" onClick={() => setStep((prev) => Math.max(prev - 1, 1))} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Anterior</button>
									<div className="flex gap-3">
										<button type="button" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Guardar borrador</button>
										<button type="button" onClick={() => setStep((prev) => Math.min(prev + 1, 3))} className="rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#63162e]">Siguiente</button>
									</div>
								</div>
							</section>
						)}
					</div>
				</div>
			</main>
		</div>
	</div>
	);
};

export default EvaluacionNutricional;
