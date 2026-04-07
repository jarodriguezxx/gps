import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ClipboardList, FileText, HeartPulse, Search, Sparkles } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const indicadores = [
	{ etiqueta: 'Pacientes activos', valor: '06', detalle: '2 en observación' },
	{ etiqueta: 'Historias médicas', valor: '14', detalle: '10 completas' },
	{ etiqueta: 'Inventarios del día', valor: '08', detalle: '1 pendiente firma' },
	{ etiqueta: 'Alertas clínicas', valor: '03', detalle: 'prioridad media' },
];

const MedicoInicio = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isInicioActive = location.pathname === '/medico';
	const isHistoriaActiva = location.pathname === '/medico/historia-medica';
	const isInventarioActive = location.pathname === '/medico/inventario-pertenencias';

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
							<h1 className="text-xl font-black uppercase tracking-tight text-[#7E1D3B]">Inicio del módulo médico</h1>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Base visual para seguimiento clínico</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="relative min-w-[240px] flex-1 xl:flex-none xl:w-[320px]">
							<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								type="text"
								placeholder="Buscar paciente, expediente o cita..."
								className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
							/>
						</div>
						<button
							type="button"
							onClick={() => navigate('/admisiones')}
							className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
						>
							Alertas
						</button>
						<button
							type="button"
							onClick={() => navigate('/medico')}
							className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]"
						>
							Abrir expediente <ArrowRight size={18} />
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
							onClick={() => navigate('/medico/expediente')}
							className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B] px-3 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#63162e]"
						>
							Expediente
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

						<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Indicadores</p>
							<p className="mt-2 text-3xl font-black text-[#7E1D3B]">78%</p>
							<p className="text-xs text-slate-500">Tasa de conversión semanal</p>
							<button onClick={() => navigate('/medico/expediente')} className="mt-3 w-full rounded-xl bg-[#7E1D3B] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#63162e]">
								Abrir expediente
							</button>
						</div>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Vista principal</p>
							<h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Dashboard médico base</h2>
						</div>
						<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
							Ruta corregida y lista para extender con historia clínica e inventario.
						</div>
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

						<section className="grid gap-4 md:grid-cols-3">
					<button
						type="button"
						onClick={() => navigate('/medico/historia-medica')}
						className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5"
					>
						<div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B]">
							<HeartPulse size={20} />
						</div>
						<p className="text-sm font-black text-slate-900">Historia médica</p>
						<p className="mt-2 text-sm leading-6 text-slate-600">Captura antecedentes, signos vitales y plan inicial.</p>
					</button>

					<button
						type="button"
						onClick={() => navigate('/medico/inventario-pertenencias')}
						className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5"
					>
						<div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B]">
							<ClipboardList size={20} />
						</div>
						<p className="text-sm font-black text-slate-900">Inventario de pertenencias</p>
						<p className="mt-2 text-sm leading-6 text-slate-600">Registra ropa, calzado, artículos y firmas.</p>
					</button>

					<div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-3 inline-flex rounded-xl bg-slate-100 p-2 text-[#7E1D3B]">
							<Activity size={20} />
						</div>
						<p className="text-sm font-black text-slate-900">Estado del módulo</p>
						<p className="mt-2 text-sm leading-6 text-slate-600">Componente restaurado correctamente con export por defecto.</p>
					</div>
						</section>

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
					<div className="mb-4 flex items-center justify-between gap-3">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sugerencia</p>
							<h3 className="text-2xl font-black text-slate-900">Siguiente mejora recomendada</h3>
						</div>
						<span className="inline-flex items-center gap-2 rounded-full bg-[#7E1D3B]/8 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#7E1D3B]">
							<Sparkles size={14} /> Prioridad
						</span>
					</div>
					<p className="text-sm leading-6 text-slate-700">
						Conecta esta pantalla con rutas dedicadas para Inventario de Pertenencias e Historia Médica para cerrar el flujo de ingreso clínico.
					</p>
					<div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
						<FileText size={14} /> Esto evita errores de carga por módulos vacíos.
					</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
};

export default MedicoInicio;
