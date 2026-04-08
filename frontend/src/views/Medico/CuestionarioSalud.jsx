import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const familiares = ['Padre', 'Madre', 'Hermanos', 'Esposa', 'Hijos'];
const examenBasico = ['Cabeza', 'Cardiorrespiratorio', 'Gastrointestinal', 'Genitourinario', 'Endocrino / neuropsiquiátrico', 'Apetito', 'Evacuaciones', 'Presión arterial', 'Frecuencia cardiaca', 'Frecuencia respiratoria', 'Temperatura', 'Peso', 'Estatura'];

const CuestionarioSalud = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [step, setStep] = useState(1);
	const isMedico = location.pathname === '/medico';

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(126,29,59,0.10),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-900">
			<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-6">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex items-center gap-4">
						<img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
							<h1 className="text-xl font-black uppercase tracking-tight text-[#7E1D3B]">Cuestionario de salud</h1>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Formulario de valoración médica inicial</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="relative min-w-[240px] flex-1 xl:flex-none xl:w-[320px]">
							<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input type="text" placeholder="Buscar paciente, folio o dato clínico..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
						</div>
						<button type="button" onClick={() => navigate('/medico')} className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]">
							Volver a médico <ArrowRight size={18} />
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 md:py-6">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<button type="button" onClick={() => navigate('/medico')} className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${isMedico ? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Inicio
						</button>
						<button type="button" onClick={() => navigate('/medico/expediente')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Expediente
						</button>
						<button type="button" onClick={() => navigate('/medico/cuestionario-salud')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B] px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#63162e]">
							Cuestionario
						</button>
						<button type="button" onClick={() => navigate('/medico/historia-medica')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Historia médica
						</button>
						<button type="button" onClick={() => navigate('/medico/inventario-pertenencias')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Inventario
						</button>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
							<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div>
									<p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Flujo de captura</p>
									<h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Cuestionario de salud</h2>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Paso {step} de 3</div>
							</div>
							<div className="mt-4 grid gap-2 md:grid-cols-3">
								<button type="button" onClick={() => setStep(1)} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 1 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>1. Identificación</button>
								<button type="button" onClick={() => setStep(2)} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 2 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>2. Antecedentes</button>
								<button type="button" onClick={() => setStep(3)} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 3 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>3. Exploración y cierre</button>
							</div>
						</section>

						<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							{[
								{ label: 'Paciente', value: 'María García López' },
								{ label: 'Folio', value: 'MED-02641' },
								{ label: 'Área', value: 'Médico' },
								{ label: 'Estado', value: 'Pendiente firma' },
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
									<h3 className="mb-4 text-xl font-black text-slate-900">Identificación</h3>
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
										{[
											{ label: 'Fecha', type: 'datetime-local' },
											{ label: 'Nombre completo' },
											{ label: 'Expediente' },
											{ label: 'Edad' },
											{ label: 'Sexo' },
											{ label: 'Estado civil' },
											{ label: 'Religión' },
											{ label: 'Escolaridad' },
											{ label: 'Residencia' },
											{ label: 'Origen' },
											{ label: 'Ocupación' },
										].map((campo) => (
											<div key={campo.label} className={campo.label === 'Fecha' ? 'md:col-span-2 xl:col-span-4' : ''}>
												<label className="mb-1 block text-sm font-semibold text-slate-700">{campo.label}</label>
												<input type={campo.type || 'text'} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
											</div>
										))}
									</div>
								</section>

								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Historia de consumo y hábitos</h3>
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
										{[
											{ label: 'Tipo de consumo' },
											{ label: 'Tiempo de consumo' },
											{ label: 'Último consumo' },
											{ label: 'Vía de administración' },
											{ label: 'Frecuencia' },
											{ label: 'Observaciones' },
										].map((campo) => (
											<div key={campo.label} className={campo.label === 'Observaciones' ? 'md:col-span-2 xl:col-span-3' : ''}>
												<label className="mb-1 block text-sm font-semibold text-slate-700">{campo.label}</label>
												{campo.label === 'Observaciones' ? <textarea rows={4} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" /> : <input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />}
											</div>
										))}
									</div>
								</section>
							</>
						)}

						{step === 2 && (
							<>
								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Antecedentes personales y familiares</h3>
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
											<label className="mb-1 block text-sm font-semibold text-slate-700">Transfusiones sanguíneas</label>
											<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
									</div>

									<div className="mt-5">
										<h4 className="mb-3 text-lg font-black text-slate-900">Historia familiar</h4>
										<div className="grid gap-3 md:grid-cols-2">
											{familiares.map((familiar) => (
												<div key={familiar} className="grid grid-cols-[0.9fr_1.1fr] gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
													<input placeholder={familiar} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
													<input placeholder="Patología" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
												</div>
											))}
										</div>
									</div>
								</section>

								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<h3 className="mb-4 text-xl font-black text-slate-900">Exploración inicial</h3>
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
										{examenBasico.map((campo) => (
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
									<h3 className="mb-4 text-xl font-black text-slate-900">Cierre clínico</h3>
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Hallazgos relevantes</label>
											<textarea rows={5} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Plan inicial</label>
											<textarea rows={5} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
									</div>

									<div className="mt-4 grid gap-4 md:grid-cols-2">
										<div>
											<label className="mb-1 block text-sm font-semibold text-slate-700">Nombre del médico</label>
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
											<button type="button" className="rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#63162e]">Guardar cuestionario</button>
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
	);
};

export default CuestionarioSalud;
