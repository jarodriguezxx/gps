import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const aparatosSistemas = {
	cabeza: ['Cefalea', 'Visión borrosa', 'Lentes', 'Tinitus', 'Fosfenos', 'Epistaxis'],
	cardiorrespiratorio: ['Palpitaciones', 'Disnea', 'Dolor precordial', 'Mareos', 'Edema maleolar', 'Hipertensión', 'Tos seca', 'Expectoración'],
	gastrointestinal: ['Vómito', 'Náuseas', 'Gastritis', 'Colitis', 'Dolor abdominal', 'Diarrea', 'Melena', 'Estreñimiento'],
	genitourinario: ['Secreciones', 'Disuria', 'Hematuria', 'Poliuria'],
	endocrinoNeuro: ['Intolerancia frío o calor', 'Convulsiones', 'Pérdida del conocimiento', 'Alucinaciones'],
};

const exploracionFisica = {
	cabeza: ['Normocéfalo', 'Cicatrices', 'Pupilas isocóricas', 'Isométricas', 'Reflejos a la luz', 'Movimientos oculares', 'Fondo de ojo'],
	orl: ['Secreción seropurulenta', 'Tapones en conductos', 'Mucosa congestionada'],
	orofaringe: ['Hiperémicas', 'Hipertrofia amigdalina', 'Caries'],
	cuello: ['Corto', 'Adenopatías cervicales'],
	torax: ['Normolíneo', 'Deformidades', 'Cicatrices'],
	pulmones: ['Murmullos claros y ventilados', 'Sibilancias', 'Crepitantes'],
	corazon: ['Ritmo regular sinusal', 'Arritmias'],
	abdomen: ['Blando', 'Plano', 'Globoso', 'Cicatrices', 'Dolor', 'Tumoración', 'Ascitis'],
	extremidades: ['Isométricas', 'Cianosis', 'Edema', 'Varices'],
};

const CheckboxGroup = ({ title, items }) => (
	<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
		<p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">{title}</p>
		<div className="grid gap-2 sm:grid-cols-2">
			{items.map((item) => (
				<label key={item} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-sm text-slate-700">
					<input type="checkbox" className="h-4 w-4 accent-[#7E1D3B]" />
					<span>{item}</span>
				</label>
			))}
		</div>
	</div>
);

const HistoriaMedica = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [step, setStep] = useState(1);
	const isInicioActive = location.pathname === '/medico';
	const isInventarioActive = location.pathname === '/medico/inventario-pertenencias';
	const isHistoriaActiva = location.pathname === '/medico/historia-medica';
	const isFirstStep = step === 1;
	const isLastStep = step === 3;

	const nextStep = () => {
		if (step < 3) setStep((prev) => prev + 1);
	};

	const prevStep = () => {
		if (step > 1) setStep((prev) => prev - 1);
	};

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(126,29,59,0.10),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-900">
			<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-6">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex items-center gap-4">
						<img
							src={marakameLogo}
							alt="Logo Nayarit Marakame"
							className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
						/>
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
							<h1 className="text-xl font-black uppercase tracking-tight text-[#7E1D3B]">Historia médica</h1>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Evaluación clínica integral</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="relative min-w-[240px] flex-1 xl:flex-none xl:w-[320px]">
							<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								type="text"
								placeholder="Buscar paciente, expediente o diagnóstico..."
								className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
							/>
						</div>
						<button
							type="button"
							onClick={() => navigate('/medico')}
							className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]"
						>
							Volver al inicio <ArrowRight size={18} />
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 md:py-6">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<button
							onClick={() => navigate('/medico')}
							className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${
								isInicioActive
									? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Inicio
						</button>
						<button
							onClick={() => navigate('/medico/historia-medica')}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isHistoriaActiva
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Historia médica
						</button>
						<button
							onClick={() => navigate('/medico/inventario-pertenencias')}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isInventarioActive
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Inventario
						</button>
						<button className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
							Acceso futuro
						</button>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
							<div className="mb-3 flex items-center justify-between gap-3">
								<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Flujo de captura</p>
								<p className="text-xs font-semibold text-slate-500">Paso {step} de 3</p>
							</div>
							<div className="grid gap-2 md:grid-cols-3">
								<button
									type="button"
									onClick={() => setStep(1)}
									className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 1 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
								>
									1. Identificación e historia
								</button>
								<button
									type="button"
									onClick={() => setStep(2)}
									className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 2 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
								>
									2. Antecedentes e interrogatorio
								</button>
								<button
									type="button"
									onClick={() => setStep(3)}
									className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${step === 3 ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
								>
									3. Exploración y cierre
								</button>
							</div>
						</section>

						{step === 1 && (
						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Fecha</label>
									<input type="datetime-local" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Nombre</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Expediente</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Edad</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Sexo</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Estado civil</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Religión</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Escolaridad</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div className="md:col-span-2">
									<label className="mb-1 block text-sm font-semibold text-slate-700">Lugar de residencia</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div className="md:col-span-2">
									<label className="mb-1 block text-sm font-semibold text-slate-700">Lugar de origen</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div className="md:col-span-2 xl:col-span-4">
									<label className="mb-1 block text-sm font-semibold text-slate-700">Ocupación</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
							</div>

							<div className="mt-4">
								<label className="mb-1 block text-sm font-semibold text-slate-700">Historia de consumo</label>
								<textarea rows={8} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
							</div>

							<div className="mt-5 flex justify-end gap-3">
								<button type="button" disabled={isFirstStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-400">
									Anterior
								</button>
								<button type="button" onClick={nextStep} className="rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#63162e]">
									Siguiente
								</button>
							</div>
						</section>
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
									<label className="mb-1 block text-sm font-semibold text-slate-700">Enfermedades y otros antecedentes</label>
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

							<div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Parejas sexuales (3 años)</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Enfermedades venéreas</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Métodos contraceptivos</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">HIV Test</label>
									<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
							</div>

							<div className="mt-4 grid gap-4 md:grid-cols-2">
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Ideas suicidas</label>
									<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Planes suicidas</label>
									<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
							</div>

							<div className="mt-5">
								<h4 className="mb-3 text-lg font-black text-slate-900">Historia familiar</h4>
								<div className="grid gap-3 md:grid-cols-2">
									{['Padre', 'Madre', 'Hermano/a 1', 'Hermano/a 2', 'Hermano/a 3', 'Esposa', 'Hijos'].map((relacion) => (
										<div key={relacion} className="grid grid-cols-[0.9fr_1.1fr] gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
											<input placeholder={relacion} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
											<input placeholder="Patología" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
									))}
								</div>
							</div>

							<div className="mt-5 flex justify-between gap-3">
								<button type="button" onClick={prevStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
									Anterior
								</button>
								<button type="button" onClick={nextStep} className="rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#63162e]">
									Siguiente
								</button>
							</div>
						</section>

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<h3 className="mb-4 text-xl font-black text-slate-900">Interrogatorio por aparatos y sistemas</h3>
							<div className="grid gap-4 xl:grid-cols-2">
								<CheckboxGroup title="Cabeza" items={aparatosSistemas.cabeza} />
								<CheckboxGroup title="Cardiorrespiratorio" items={aparatosSistemas.cardiorrespiratorio} />
								<CheckboxGroup title="Gastrointestinal" items={aparatosSistemas.gastrointestinal} />
								<CheckboxGroup title="Genitourinario" items={aparatosSistemas.genitourinario} />
								<CheckboxGroup title="Endocrino neuropsiquiátrico" items={aparatosSistemas.endocrinoNeuro} />
							</div>

							<div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								{['Apetito', 'Intolerancias', '# de evacuaciones', 'Menarca', 'Abortos', 'Días', 'Cesáreas', 'Vida sexual', 'FUR', 'Menopausia', 'Gestas', 'Partos', 'Presión arterial', 'Frecuencia cardiaca', 'Frecuencia respiratoria', 'Temperatura', 'Peso (Kg)', 'Estatura (Mts)'].map((campo) => (
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
							<h3 className="mb-4 text-xl font-black text-slate-900">Exploración física y estado mental</h3>
							<div className="grid gap-4 xl:grid-cols-2">
								<CheckboxGroup title="Cabeza" items={exploracionFisica.cabeza} />
								<CheckboxGroup title="ORL" items={exploracionFisica.orl} />
								<CheckboxGroup title="Orofaringe" items={exploracionFisica.orofaringe} />
								<CheckboxGroup title="Cuello" items={exploracionFisica.cuello} />
								<CheckboxGroup title="Tórax" items={exploracionFisica.torax} />
								<CheckboxGroup title="Pulmones" items={exploracionFisica.pulmones} />
								<CheckboxGroup title="Corazón" items={exploracionFisica.corazon} />
								<CheckboxGroup title="Abdomen" items={exploracionFisica.abdomen} />
								<CheckboxGroup title="Extremidades" items={exploracionFisica.extremidades} />
							</div>

							<div className="mt-5 grid gap-4 md:grid-cols-2">
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Habitus exterior</label>
									<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Neurológico</label>
									<textarea rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
							</div>

							<div className="mt-5">
								<h4 className="mb-3 text-lg font-black text-slate-900">Examen del estado mental</h4>
								<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
									{['Orientado', 'Lenguaje', 'Afecto', 'Pensamiento', 'Alteraciones sensoperceptivas', 'Juicio', 'Memoria', 'Cognición'].map((campo) => (
										<div key={campo}>
											<label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{campo}</label>
											<input className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
										</div>
									))}
								</div>
							</div>

							<div className="mt-5 flex justify-start gap-3">
								<button type="button" onClick={prevStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
									Anterior
								</button>
							</div>
						</section>

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<h3 className="mb-4 text-xl font-black text-slate-900">Diagnóstico, plan y firma médica</h3>
							<div className="grid gap-4 md:grid-cols-2">
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Diagnóstico (1 al 11)</label>
									<textarea rows={8} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
								</div>
								<div>
									<label className="mb-1 block text-sm font-semibold text-slate-700">Recomendaciones y plan</label>
									<textarea rows={8} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#7E1D3B]" />
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

							<div className="mt-5 flex justify-end gap-3">
								<button type="button" onClick={prevStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
									Anterior
								</button>
								<button type="button" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
									Guardar borrador
								</button>
								<button type="button" disabled={!isLastStep} className="rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#63162e] disabled:opacity-60">
									Guardar historia médica
								</button>
							</div>
						</section>
							</>
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default HistoriaMedica;