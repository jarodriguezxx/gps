import React from 'react';
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

const AdmisionesInicio = () => {
	return (
		<div className="min-h-screen bg-slate-100 text-slate-900">
			
			<div className="mx-auto w-full max-w-8xl   ">
								<header className="rounded-2xl border border-slate-200 bg-white/95 shadow-[0_10px_25px_rgba(15,23,42,0.08)]">

					<div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
						<div className="flex items-center gap-3">
							<img
								src={marakameLogo}
								alt="Logo Nayarit Marakame"
								className="h-14 w-auto rounded-md border border-slate-200 bg-white p-1"
							/>
							<div>
								<p className="text-xs uppercase tracking-[0.25em] text-rose-700">Instituto Marakame</p>
								<h1 className="text-xl font-black md:text-2xl">Sistema de Gestión Marakame</h1>
							</div>
						</div>

						<div className="flex items-center gap-3 self-end md:self-auto">
							<div className="h-10 w-10 rounded-full border-2 border-slate-300 bg-slate-100" />
							<div className="text-right md:text-left">
								<p className="text-xs text-slate-500">Sesión activa</p>
								<p className="font-semibold">Recepcionista</p>
							</div>
						</div>
					</div>

					<div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
						<aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
							<button className="mb-3 w-full rounded-xl bg-rose-700 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-rose-800">
								Estudio Socioeconómico
							</button>
							<button className="mb-2 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100">
								Agendar Cita
							</button>
							<button className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100">
								Agregar Paciente
							</button>

							<div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
								<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Indicadores</p>
								<p className="mt-2 text-3xl font-black text-rose-700">78%</p>
								<p className="text-xs text-slate-500">Tasa de conversión semanal</p>
							</div>
						</aside>

						<main className="space-y-5">
							<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
								<article className="rounded-2xl border border-slate-200 bg-white p-4">
									<p className="text-xs uppercase tracking-widest text-slate-500">Citas hoy</p>
									<p className="mt-2 text-3xl font-black text-slate-900">18</p>
									<p className="text-sm text-emerald-700">+4 vs ayer</p>
								</article>
								<article className="rounded-2xl border border-slate-200 bg-white p-4">
									<p className="text-xs uppercase tracking-widest text-slate-500">Pacientes nuevos</p>
									<p className="mt-2 text-3xl font-black text-slate-900">6</p>
									<p className="text-sm text-sky-700">3 referidos</p>
								</article>
								<article className="rounded-2xl border border-slate-200 bg-white p-4">
									<p className="text-xs uppercase tracking-widest text-slate-500">Llamadas pendientes</p>
									<p className="mt-2 text-3xl font-black text-slate-900">12</p>
									<p className="text-sm text-amber-700">5 prioritarias</p>
								</article>
								<article className="rounded-2xl border border-slate-200 bg-white p-4">
									<p className="text-xs uppercase tracking-widest text-slate-500">Ingreso proyectado</p>
									<p className="mt-2 text-3xl font-black text-slate-900">$184k</p>
									<p className="text-sm text-rose-700">Meta mensual 82%</p>
								</article>
							</section>

							<section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
								<article className="rounded-2xl border border-slate-200 bg-white p-4">
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
														className="w-full rounded-md bg-gradient-to-t from-rose-700 to-rose-500"
														style={{ height: `${item.valor}%` }}
													/>
												</div>
												<span className="text-xs font-semibold text-slate-500">{item.label}</span>
											</div>
										))}
									</div>
								</article>

								<article className="rounded-2xl border border-slate-200 bg-white p-4">
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
											<strong className="text-rose-700">27%</strong>
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

							<section className="rounded-2xl border border-slate-200 bg-white p-4">
								<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<h2 className="text-2xl font-black">Citas del Día</h2>
									<div className="flex gap-2">
										<button className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-800">
											Agendar Cita
										</button>
										<button className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100">
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

							<section className="rounded-2xl border border-slate-200 bg-white p-4">
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
						</main>
					</div>
				</header>
			</div>
		</div>
	);
};

export default AdmisionesInicio;
