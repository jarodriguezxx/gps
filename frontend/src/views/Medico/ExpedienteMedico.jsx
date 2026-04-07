import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, FolderOpen, Search, Sparkles } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const notasInterArea = [
	'Admisiones: paciente aceptada para seguimiento clínico y control de ingreso.',
	'Médico: requiere vigilancia de signos vitales, diagnóstico inicial y evolución diaria.',
	'Inter-área: documentos de ingreso y resguardo de pertenencias ya enlazados.',
];

const bitacora = [
	{ area: 'Admisiones', nota: 'Estudio socioeconómico validado para seguimiento de estancia.' },
	{ area: 'Médico', nota: 'Historia médica inicial registrada; pendiente evolución clínica.' },
	{ area: 'Trabajo social', nota: 'Se sugiere revisión de red familiar y responsable de contacto.' },
];

const ExpedienteMedico = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [tab, setTab] = useState('general');
	const isMedico = location.pathname === '/medico/expediente';

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(126,29,59,0.10),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] text-slate-900">
			<header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-6">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex items-center gap-4">
						<img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
						<div>
							<p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
							<h1 className="text-xl font-black uppercase tracking-tight text-[#7E1D3B]">Expediente médico</h1>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Seguimiento clínico y notas entre áreas</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="relative min-w-[240px] flex-1 xl:flex-none xl:w-[320px]">
							<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input type="text" placeholder="Buscar paciente, folio o nota clínica..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
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
						<button type="button" onClick={() => navigate('/medico/expediente')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B] px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#63162e]">
							Expediente
						</button>
						<button type="button" onClick={() => navigate('/medico/historia-medica')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Historia médica
						</button>
						<button type="button" onClick={() => navigate('/medico/inventario-pertenencias')} className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Inventario
						</button>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
							<div className="mb-3 flex items-center justify-between gap-3">
								<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Vista sugerida</p>
								<p className="text-xs font-semibold text-slate-500">Pestaña activa: {tab === 'general' ? 'General' : tab === 'notes' ? 'Notas' : 'Acciones'}</p>
							</div>
							<div className="grid gap-2 md:grid-cols-3">
								<button type="button" onClick={() => setTab('general')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'general' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
									General
								</button>
								<button type="button" onClick={() => setTab('notes')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'notes' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
									Notas entre áreas
								</button>
								<button type="button" onClick={() => setTab('actions')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'actions' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
									Acciones
								</button>
							</div>
						</section>

						{tab === 'general' && (
						<>
						<section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
							<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div>
									<p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Resumen clínico</p>
									<h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Expediente individual del paciente</h2>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Notas y evolución médica compartidas entre áreas.</div>
							</div>
						</section>

						<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
							{[
								{ label: 'Paciente', value: 'María García López' },
								{ label: 'Folio clínico', value: 'MED-02641' },
								{ label: 'Área actual', value: 'Médico' },
								{ label: 'Seguimiento', value: 'En evolución' },
							].map((item) => (
								<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
									<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
									<p className="mt-3 text-2xl font-black text-slate-900">{item.value}</p>
								</article>
							))}
						</section>
						</>
						)}

						{tab === 'notes' && (
						<>
						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Notas compartidas</p>
									<h3 className="text-2xl font-black text-slate-900">Seguimiento entre áreas</h3>
								</div>
								<FileText className="text-[#7E1D3B]" size={22} />
							</div>
							<div className="space-y-3">
								{notasInterArea.map((nota) => (
									<div key={nota} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700">{nota}</div>
								))}
							</div>
							<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sugerencia</p>
								<p className="mt-2 text-sm leading-6 text-slate-700">Aquí conviene dejar el resumen clínico inter-áreas para no mezclar información de admisiones con el seguimiento médico.</p>
							</div>
						</section>

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Bitácora</p>
									<h3 className="text-2xl font-black text-slate-900">Notas de áreas internas</h3>
								</div>
								<Sparkles className="text-[#7E1D3B]" size={22} />
							</div>
							<div className="grid gap-3 md:grid-cols-3">
								{bitacora.map((item) => (
									<div key={item.area} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
										<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{item.area}</p>
										<p className="mt-2 text-sm leading-6 text-slate-700">{item.nota}</p>
									</div>
								))}
							</div>
						</section>
						</>
						)}

						{tab === 'actions' && (
						<>
						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Acceso rápido</p>
									<h3 className="text-2xl font-black text-slate-900">Abrir vistas del paciente</h3>
								</div>
								<Sparkles className="text-[#7E1D3B]" size={22} />
							</div>
							<div className="grid gap-3 md:grid-cols-3">
								<button type="button" onClick={() => navigate('/medico/historia-medica')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Historia médica</button>
								<button type="button" onClick={() => navigate('/medico/inventario-pertenencias')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Inventario de pertenencias</button>
								<button type="button" onClick={() => navigate('/medico')} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Volver a Médico</button>
							</div>
						</section>
						</>
						)}

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Acceso rápido</p>
									<h3 className="text-2xl font-black text-slate-900">Abrir vistas del paciente</h3>
								</div>
								<Sparkles className="text-[#7E1D3B]" size={22} />
							</div>
							<div className="grid gap-3 md:grid-cols-3">
								<button type="button" onClick={() => navigate('/medico/historia-medica')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Historia médica</button>
								<button type="button" onClick={() => navigate('/medico/inventario-pertenencias')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Inventario de pertenencias</button>
								<button type="button" onClick={() => navigate('/medico')} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Volver a Médico</button>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ExpedienteMedico;