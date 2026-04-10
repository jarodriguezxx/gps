import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Apple, ArrowRight, ClipboardList, HeartPulse, Search } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const indicadores = [
	{ etiqueta: 'Valoraciones hoy', valor: '04', detalle: '2 en progreso' },
	{ etiqueta: 'Planes activos', valor: '11', detalle: '3 por revisión' },
	{ etiqueta: 'Seguimientos', valor: '08', detalle: '1 vencido' },
	{ etiqueta: 'Alertas nutricionales', valor: '02', detalle: 'prioridad alta' },
];

const NutriologiaInicio = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isInicioActive = location.pathname === '/nutriologia';

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
						<button type="button" onClick={() => navigate('/nutriologia/evaluacion-nutricional')} className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]">
							Nueva valoración <ArrowRight size={18} />
						</button>
					</div>
				</header>

				<main className="space-y-5">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<button onClick={() => navigate('/nutriologia')} className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${isInicioActive ? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Inicio
						</button>
						<button onClick={() => navigate('/nutriologia/evaluacion-nutricional')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B] px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#63162e]">
							Evaluación nutricional
						</button>
						<button className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Seguimiento
						</button>
						<button className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
							Agenda
						</button>

						<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Área</p>
							<p className="mt-2 text-3xl font-black text-[#7E1D3B]">100%</p>
							<p className="text-xs text-slate-500">Separada del módulo médico</p>
							<button onClick={() => navigate('/nutriologia/evaluacion-nutricional')} className="mt-3 w-full rounded-xl bg-[#7E1D3B] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#63162e]">
								Abrir valoración
							</button>
						</div>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
							<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div>
									<p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Vista principal</p>
									<h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Dashboard de nutriología</h2>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Flujo independiente para valoración y seguimiento nutricional.</div>
							</div>
						</section>

						<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							{indicadores.map((item) => (
								<article key={item.etiqueta} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
									<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.etiqueta}</p>
									<p className="mt-3 text-4xl font-black text-slate-900">{item.valor}</p>
									<p className="mt-1 text-sm font-medium text-[#7E1D3B]">{item.detalle}</p>
								</article>
							))}
						</section>

						<section className="grid gap-4 md:grid-cols-2">
							<button type="button" onClick={() => navigate('/nutriologia/evaluacion-nutricional')} className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5">
								<div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B]">
									<ClipboardList size={20} />
								</div>
								<p className="text-sm font-black text-slate-900">Evaluación nutricional</p>
								<p className="mt-2 text-sm leading-6 text-slate-600">Captura antropometría, hábitos y cierre clínico nutricional.</p>
							</button>

							<div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
								<div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B]">
									<Apple size={20} />
								</div>
								<p className="text-sm font-black text-slate-900">Enfoque separado</p>
								<p className="mt-2 text-sm leading-6 text-slate-600">No comparte expediente, historia médica ni formularios del módulo médico.</p>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	</div>
	);
};

export default NutriologiaInicio;