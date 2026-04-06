import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, ClipboardList, Search, Sparkles } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const citasHoy = [
	{
		hora: '09:00',
		paciente: 'María García López',
		tipo: 'Valoración Inicial',
		profesional: 'Dr. Juan Martínez',
		estado: 'En proceso',
	},
	{
		hora: '09:30',
		paciente: 'José Ramírez Díaz',
		tipo: 'Seguimiento',
		profesional: 'Dra. Laura Medina',
		estado: 'Confirmada',
	},
	{
		hora: '10:00',
		paciente: 'Ana Torres Vela',
		tipo: 'Primera Entrevista',
		profesional: 'Lic. Marco Pineda',
		estado: 'Pendiente',
	},
	{
		hora: '10:45',
		paciente: 'Carlos Bautista Ruiz',
		tipo: 'Valoración Inicial',
		profesional: 'Dr. Juan Martínez',
		estado: 'En proceso',
	},
	{
		hora: '11:20',
		paciente: 'Diana Flores León',
		tipo: 'Seguimiento',
		profesional: 'Dra. Laura Medina',
		estado: 'Confirmada',
	},
];

const seguimiento = [
	{
		nombre: 'Roberto García Mendoza',
		telefono: '3112345678',
		fecha: '25/03/2026',
		motivo: 'Seguimiento de familiar',
		estado: 'Convertido a cita',
		proxima: '28/03/2026',
	},
	{
		nombre: 'Guadalupe Mejía Cano',
		telefono: '3119876543',
		fecha: '25/03/2026',
		motivo: 'Información de ingreso',
		estado: 'En proceso',
		proxima: '28/03/2026',
	},
	{
		nombre: 'Javier López Acosta',
		telefono: '3115567788',
		fecha: '25/03/2026',
		motivo: 'Seguimiento de familiar',
		estado: 'No contestó',
		proxima: '28/03/2026',
	},
	{
		nombre: 'Miriam Hernández Peña',
		telefono: '3111029384',
		fecha: '25/03/2026',
		motivo: 'Validación de documentos',
		estado: 'Convertido a cita',
		proxima: '29/03/2026',
	},
];

const estadoClasses = {
	Confirmada: 'bg-emerald-100 text-emerald-800',
	'En proceso': 'bg-amber-100 text-amber-900',
	Pendiente: 'bg-slate-200 text-slate-700',
	'Convertido a cita': 'bg-emerald-100 text-emerald-800',
	'No contestó': 'bg-rose-100 text-rose-800',
};

const barras = [
	{ label: 'Lun', valor: 42 },
	{ label: 'Mar', valor: 58 },
	{ label: 'Mié', valor: 50 },
	{ label: 'Jue', valor: 72 },
	{ label: 'Vie', valor: 65 },
	{ label: 'Sáb', valor: 35 },
];


const AdmisionesInicio = ({ onOpenEstudio }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const openEstudio = () => {
		if (onOpenEstudio) {
			onOpenEstudio();
			return;
		}
		navigate('/admisiones/estudio-socioeconomico');
	};
	const goInicio = () => navigate('/admisiones');
	const isInicioActive = location.pathname === '/admisiones';
	const isEstudioActive = location.pathname === '/admisiones/estudio-socioeconomico';

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
							<h1 className="text-xl font-black uppercase tracking-tight text-[#7E1D3B]">Inicio del módulo de admisiones</h1>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Base visual para seguimiento institucional</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<div className="relative min-w-[240px] flex-1 xl:flex-none xl:w-[320px]">
							<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								type="text"
								placeholder="Buscar solicitante, expediente o folio..."
								className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
							/>
						</div>
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
						>
							<Bell size={18} /> Alertas
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/15 transition hover:bg-[#63162e]"
						>
							Nuevo ingreso <ArrowRight size={18} />
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-6 md:py-6">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<button
							onClick={openEstudio}
							className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${
								isEstudioActive
									? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Estudio Socioeconómico
						</button>
						<button
							onClick={goInicio}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isInicioActive
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
							}`}
						>
							Inicio
						</button>
						<button className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Prueba 1
						</button>
						<button className="mb-2 w-full rounded-xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-3 text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">
							Prueba 2
						</button>
						<button className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
							Acceso futuro
						</button>

						<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Indicadores</p>
							<p className="mt-2 text-3xl font-black text-[#7E1D3B]">78%</p>
							<p className="text-xs text-slate-500">Tasa de conversión semanal</p>
						</div>
					</aside>
					<div className="space-y-5">
							<section className="rounded-[28px] border border-[#7E1D3B]/12 bg-white p-5 shadow-sm md:p-6">
								<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
									<div>
										<p className="text-xs font-black uppercase tracking-[0.25em] text-[#7E1D3B]">Vista principal</p>
										<h2 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Panel de admisiones con estructura más limpia</h2>
									</div>
									<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
										Conserva la paleta izquierda y gana lectura de dashboard.
									</div>
								</div>
							</section>

							<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
								{[
									{ label: 'Atenciones hoy', value: '18', tone: 'emerald' },
									{ label: 'Pacientes nuevos', value: '6', tone: 'sky' },
									{ label: 'Pendientes', value: '12', tone: 'amber' },
									{ label: 'Seguimiento', value: '9', tone: 'rose' },
								].map((item) => (
									<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
										<p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
										<p className={`mt-2 text-3xl font-black ${item.tone === 'emerald' ? 'text-emerald-700' : item.tone === 'sky' ? 'text-sky-700' : item.tone === 'amber' ? 'text-amber-700' : 'text-[#7E1D3B]'}`}>
											{item.value}
										</p>
									</article>
								))}
							</section>

							<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
								<article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
									<p className="text-xs uppercase tracking-widest text-slate-500">Citas hoy</p>
									<p className="mt-2 text-3xl font-black text-slate-900">18</p>
									<p className="text-sm text-emerald-700">+4 vs ayer</p>
								</article>
								<article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
									<p className="text-xs uppercase tracking-widest text-slate-500">Pacientes nuevos</p>
									<p className="mt-2 text-3xl font-black text-slate-900">6</p>
									<p className="text-sm text-sky-700">3 referidos</p>
								</article>
								<article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
									<p className="text-xs uppercase tracking-widest text-slate-500">Llamadas pendientes</p>
									<p className="mt-2 text-3xl font-black text-slate-900">12</p>
									<p className="text-sm text-amber-700">5 prioritarias</p>
								</article>
								<article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
									<p className="text-xs uppercase tracking-widest text-slate-500">Ingreso proyectado</p>
									<p className="mt-2 text-3xl font-black text-slate-900">$184k</p>
									<p className="text-sm text-[#7E1D3B]">Meta mensual 82%</p>
								</article>
							</section>

							<section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
								<article className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-xl font-black">Tendencia Semanal de Admisiones</h2>
										<span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
											Últimos 6 días
										</span>
									</div>

									<div className="grid h-44 grid-cols-6 items-end gap-3 rounded-xl bg-slate-50 p-4">
										{barras.map((item) => (
											<div key={item.label} className="flex flex-col items-center gap-2">
												<div className="relative flex h-32 w-full items-end justify-center rounded-md bg-slate-200/60">
													<div
														className="w-full rounded-md bg-gradient-to-t from-[#63162e] to-[#7E1D3B]"
														style={{ height: `${item.valor}%` }}
													/>
												</div>
												<span className="text-xs font-semibold text-slate-500">{item.label}</span>
											</div>
										))}
									</div>
								</article>

								<article className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
									<div className="mb-4 flex items-center justify-between">
										<h2 className="text-lg font-black">Estado de Gestión</h2>
										<span className="text-xs text-slate-500">Hoy</span>
									</div>

									<div className="mx-auto mb-4 h-40 w-40 rounded-full bg-[conic-gradient(#be123c_0_45%,#16a34a_45%_72%,#f59e0b_72%_89%,#94a3b8_89%_100%)] p-4">
										<div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
											<div>
												<p className="text-3xl font-black">89%</p>
												<p className="text-xs uppercase tracking-widest text-slate-500">avance</p>
											</div>
										</div>
									</div>

									<ul className="space-y-2 text-sm">
										<li className="flex items-center justify-between">
											<span className="text-slate-600">Convertidos a cita</span>
											<strong className="text-emerald-700">45%</strong>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-slate-600">Confirmados</span>
											<strong className="text-[#7E1D3B]">27%</strong>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-slate-600">Pendientes</span>
											<strong className="text-amber-700">17%</strong>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-slate-600">No localizados</span>
											<strong className="text-slate-600">11%</strong>
										</li>
									</ul>
								</article>
							</section>

							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4 flex items-center justify-between gap-3">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Menú de prueba</p>
										<h3 className="text-2xl font-black text-slate-900">Accesos rápidos futuros</h3>
									</div>
									<Sparkles className="text-[#7E1D3B]" size={22} />
								</div>
								<div className="grid gap-3 md:grid-cols-2">
									{['Prueba 1', 'Prueba 2'].map((item) => (
										<button key={item} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-left text-sm font-semibold text-slate-600 transition hover:border-[#7E1D3B]/25 hover:bg-[#7E1D3B]/5">
											{item}
										</button>
									))}
								</div>
							</section>

							<section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
								<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<h2 className="text-2xl font-black">Citas del Día</h2>
									<div className="flex gap-2">
										<button className="rounded-lg bg-[#7E1D3B] px-3 py-2 text-sm font-semibold text-white hover:bg-[#63162e]">
											Agendar Cita
										</button>
										<button className="rounded-lg border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-2 text-sm font-semibold text-[#7E1D3B] hover:bg-[#7E1D3B]/12">
											Agregar Paciente
										</button>
									</div>
								</div>

								<div className="overflow-x-auto">
									<table className="min-w-full border-collapse text-left text-sm">
										<thead>
											<tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
												<th className="px-3 py-2 font-semibold">Hora</th>
												<th className="px-3 py-2 font-semibold">Paciente</th>
												<th className="px-3 py-2 font-semibold">Tipo de Cita</th>
												<th className="px-3 py-2 font-semibold">Profesional</th>
												<th className="px-3 py-2 font-semibold">Estado</th>
												<th className="px-3 py-2 font-semibold">Acción</th>
											</tr>
										</thead>
										<tbody>
											{citasHoy.map((item) => (
												<tr key={`${item.hora}-${item.paciente}`} className="border-b border-slate-100">
													<td className="px-3 py-3 font-medium text-slate-700">{item.hora}</td>
													<td className="px-3 py-3">{item.paciente}</td>
													<td className="px-3 py-3">{item.tipo}</td>
													<td className="px-3 py-3">{item.profesional}</td>
													<td className="px-3 py-3">
														<span
															className={`rounded-full px-2 py-1 text-xs font-semibold ${
																estadoClasses[item.estado] || 'bg-slate-200 text-slate-700'
															}`}
														>
															{item.estado}
														</span>
													</td>
													<td className="px-3 py-3">
														<button className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
															Ver
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</section>

							<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
								<h2 className="mb-4 text-2xl font-black">Llamadas en Seguimiento</h2>
								<div className="overflow-x-auto">
									<table className="min-w-full border-collapse text-left text-sm">
										<thead>
											<tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
												<th className="px-3 py-2 font-semibold">Nombre</th>
												<th className="px-3 py-2 font-semibold">Teléfono</th>
												<th className="px-3 py-2 font-semibold">Fecha/Hora</th>
												<th className="px-3 py-2 font-semibold">Motivo</th>
												<th className="px-3 py-2 font-semibold">Estado</th>
												<th className="px-3 py-2 font-semibold">Próxima Llamada</th>
											</tr>
										</thead>
										<tbody>
											{seguimiento.map((item) => (
												<tr key={`${item.nombre}-${item.telefono}`} className="border-b border-slate-100">
													<td className="px-3 py-3">{item.nombre}</td>
													<td className="px-3 py-3">{item.telefono}</td>
													<td className="px-3 py-3">{item.fecha}</td>
													<td className="px-3 py-3">{item.motivo}</td>
													<td className="px-3 py-3">
														<span
															className={`rounded-full px-2 py-1 text-xs font-semibold ${
																estadoClasses[item.estado] || 'bg-slate-200 text-slate-700'
															}`}
														>
															{item.estado}
														</span>
													</td>
													<td className="px-3 py-3">{item.proxima}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</section>
</div> 
                </div> 
            </main>
        </div>
    );
};

export default AdmisionesInicio;