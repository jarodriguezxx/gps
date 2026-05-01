import React, { useEffect, useMemo, useState } from 'react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';

const estadoClasses = {
	Confirmada: 'bg-emerald-100 text-emerald-800',
	'Llamada hecha': 'bg-emerald-100 text-emerald-800',
	'No hubo respuesta': 'bg-rose-100 text-rose-800',
	'Llegó': 'bg-emerald-100 text-emerald-800',
	'llego': 'bg-emerald-100 text-emerald-800',
	'No se presentó': 'bg-rose-100 text-rose-800',
	'no se presento': 'bg-rose-100 text-rose-800',
	'Llamó': 'bg-emerald-100 text-emerald-800',
	'llamo': 'bg-emerald-100 text-emerald-800',
	'No contestó llamada': 'bg-rose-100 text-rose-800',
	'no contesto llamada': 'bg-rose-100 text-rose-800',
	'En proceso': 'bg-amber-100 text-amber-900',
	Pendiente: 'bg-slate-200 text-slate-700',
	'Convertido a cita': 'bg-emerald-100 text-emerald-800',
	'No contestó': 'bg-rose-100 text-rose-800',
	'espera llamada': 'bg-amber-100 text-amber-900',
	'espera visita': 'bg-sky-100 text-sky-800',
	'posible ingreso': 'bg-emerald-100 text-emerald-800',
	'Llamada programada por nosotros': 'bg-violet-100 text-violet-800',
	'llamada programada por nosotros': 'bg-violet-100 text-violet-800',
	'Llamada solicitada por el paciente': 'bg-cyan-100 text-cyan-800',
	'llamada solicitada por el paciente': 'bg-cyan-100 text-cyan-800',
};

const formatEstado = (estado = '') => estado.replaceAll('_', ' ').trim();
const estadoClass = (estado = '') => {
	const normalizado = formatEstado(estado);
	return estadoClasses[normalizado] || estadoClasses[normalizado.toLowerCase()] || 'bg-slate-200 text-slate-700';
};

const formatFecha = (fechaIso) => {
	if (!fechaIso) return '--';
	const date = new Date(fechaIso);
	if (Number.isNaN(date.getTime())) return '--';
	return date.toLocaleDateString('es-MX');
};

const BandejaOperativa = () => {
	const [citasHoy, setCitasHoy] = useState([]);
	const [seguimiento, setSeguimiento] = useState([]);
	const [loadingTablas, setLoadingTablas] = useState(true);
	const [errorTablas, setErrorTablas] = useState('');

	const cargarTablas = async () => {
		try {
			setLoadingTablas(true);
			setErrorTablas('');
			const response = await fetch('http://localhost:4000/api/seguimientos/tablas');

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'No se pudieron cargar las tablas de seguimiento.');
			}

			const data = await response.json();
			setCitasHoy(Array.isArray(data.citas) ? data.citas : []);
			setSeguimiento(Array.isArray(data.llamadas) ? data.llamadas : []);
		} catch (error) {
			setErrorTablas('No se pudo conectar con el backend para cargar citas y seguimiento.');
			console.error('Error al cargar tablas de admisiones:', error);
		} finally {
			setLoadingTablas(false);
		}
	};

	useEffect(() => {
		cargarTablas();
	}, []);

	const bandejaTrabajo = useMemo(() => {
		// Mapea el enum Prioridad del backend a etiquetas y clases
		const mapearPrioridad = (prioridad) => {
			const prioridadMap = {
				'ALTA': { etiqueta: 'Alta', clase: 'bg-rose-100 text-rose-800', orden: 0 },
				'MEDIA': { etiqueta: 'Media', clase: 'bg-amber-100 text-amber-800', orden: 1 },
				'BAJA': { etiqueta: 'Baja', clase: 'bg-emerald-100 text-emerald-800', orden: 2 },
			};
			return prioridadMap[prioridad] || { etiqueta: 'Media', clase: 'bg-slate-200 text-slate-700', orden: 1 };
		};

		// Fallback: derivar prioridad del estado si no viene del backend
		const obtenerPrioridad = (item) => {
			if (item?.prioridad) {
				return mapearPrioridad(item.prioridad);
			}

			const estado = String(item?.estadoSeguimiento || item?.estadoAsistencia || '').toLowerCase();

			if (estado.includes('no se presentó') || estado.includes('no contestó') || estado.includes('no hubo respuesta')) {
				return { etiqueta: 'Alta', clase: 'bg-rose-100 text-rose-800', orden: 0 };
			}

			if (estado.includes('pendiente') || estado.includes('espera') || estado.includes('en proceso')) {
				return { etiqueta: 'Media', clase: 'bg-amber-100 text-amber-800', orden: 1 };
			}

			if (estado.includes('lleg') || estado.includes('confirm') || estado.includes('llamada hecha')) {
				return { etiqueta: 'Baja', clase: 'bg-emerald-100 text-emerald-800', orden: 2 };
			}

			return { etiqueta: 'Media', clase: 'bg-slate-200 text-slate-700', orden: 1 };
		};

		const obtenerResponsable = (item) => 
			item?.responsable || item?.profesionalNombre || item?.responsableNombre || item?.atendio || 'Admisiones';

		const obtenerSiguienteAccion = (item) => {
			const estado = String(item?.estadoSeguimiento || item?.estadoAsistencia || '').toLowerCase();

			if (estado.includes('no se presentó') || estado.includes('no contestó') || estado.includes('no hubo respuesta')) {
				return 'Reintentar contacto';
			}

			if (estado.includes('espera visita')) {
				return 'Coordinar visita';
			}

			if (estado.includes('espera llamada')) {
				return 'Confirmar llamada';
			}

			if (estado.includes('posible ingreso')) {
				return 'Validar ingreso';
			}

			if (estado.includes('lleg') || estado.includes('confirm')) {
				return 'Abrir expediente o valoración';
			}

			if (item?.tipoAccion) {
				return 'Dar seguimiento';
			}

			return 'Revisar caso';
		};

		const obtenerFechaSiguienteAccion = (item) => {
			const fecha = item?.fechaSiguienteAccion || item?.fechaHoraProgramada || item?.fechaProgramada || null;
			return fecha ? formatFecha(fecha) : 'Hoy';
		};

		const items = [
			...citasHoy.map((item) => ({ ...item, fuente: 'Cita' })),
			...seguimiento.map((item) => ({ ...item, fuente: 'Seguimiento' })),
		];

		return items
			.map((item) => {
				const prioridad = obtenerPrioridad(item);
				return {
					...item,
					prioridad,
					responsable: obtenerResponsable(item),
					siguienteAccion: obtenerSiguienteAccion(item),
					fechaSiguienteAccion: obtenerFechaSiguienteAccion(item),
				};
			})
			.sort((a, b) => {
				if (a.prioridad.orden !== b.prioridad.orden) {
					return a.prioridad.orden - b.prioridad.orden;
				}

				const fechaA = new Date(a.fechaHoraProgramada || a.fechaSiguienteAccion || 0).getTime();
				const fechaB = new Date(b.fechaHoraProgramada || b.fechaSiguienteAccion || 0).getTime();
				return fechaA - fechaB;
			});
	}, [citasHoy, seguimiento]);

	return (
		<div className="min-h-screen bg-slate-100 text-slate-900">
			<div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
				<AdminHeader submodule="Gestión de Bandeja Operativa" />

				<main className="space-y-5">
					<div className="grid gap-4 md:grid-cols-[220px_1fr]">
						<AdmisionesSidebar />
						<div className="space-y-5">
							<section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
								<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Bandeja operativa</p>
										<h2 className="text-2xl font-black text-slate-900">Prospectos y pacientes en seguimiento</h2>
										<p className="mt-1 text-sm text-slate-500">Trabaja primero lo urgente: estados críticos, pendientes y siguientes acciones.</p>
									</div>
									<div className="grid gap-2 text-xs font-semibold text-slate-600 sm:text-right">
										<span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">Alta prioridad: {bandejaTrabajo.filter((item) => item.prioridad.etiqueta === 'Alta').length}</span>
										<span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">Pendientes: {bandejaTrabajo.filter((item) => item.prioridad.etiqueta === 'Media').length}</span>
									</div>
								</div>

								<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
									{[
										{ label: 'Casos en bandeja', value: String(bandejaTrabajo.length), tone: 'emerald' },
										{ label: 'Citas activas', value: String(citasHoy.length), tone: 'sky' },
										{ label: 'Seguimientos', value: String(seguimiento.length), tone: 'amber' },
										{ label: 'Total de acciones', value: String(bandejaTrabajo.length + citasHoy.length + seguimiento.length), tone: 'rose' },
									].map((item) => (
										<article key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
											<p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
											<p className={`mt-2 text-3xl font-black ${item.tone === 'emerald' ? 'text-emerald-700' : item.tone === 'sky' ? 'text-sky-700' : item.tone === 'amber' ? 'text-amber-700' : 'text-[#7E1D3B]'}`}>
												{item.value}
											</p>
										</article>
									))}
								</div>

								<div className="mt-6 overflow-x-auto">
									{errorTablas && (
										<p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorTablas}</p>
									)}
									<table className="w-full border-collapse text-left text-sm">
										<thead>
											<tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
												<th className="px-3 py-2 font-semibold">Paciente</th>
												<th className="px-3 py-2 font-semibold">Estado</th>
												<th className="px-3 py-2 font-semibold">Prioridad</th>
												<th className="px-3 py-2 font-semibold">Responsable</th>
												<th className="px-3 py-2 font-semibold">Siguiente acción</th>
												<th className="px-3 py-2 font-semibold">Fecha próxima acción</th>
											</tr>
										</thead>
										<tbody>
											{loadingTablas ? (
												<tr>
													<td className="px-3 py-3 text-slate-500" colSpan={6}>Cargando bandeja...</td>
												</tr>
											) : bandejaTrabajo.length === 0 ? (
												<tr>
													<td className="px-3 py-3 text-slate-500" colSpan={6}>No hay prospectos o pacientes en bandeja todavía.</td>
												</tr>
											) : bandejaTrabajo.map((item) => (
												<tr key={`${item.fuente}-${item.id}`} className="border-b border-slate-100 align-top">
													<td className="px-3 py-3">
														<p className="font-semibold text-slate-900">{item.pacienteNombre || item.nombreCompleto || 'Sin nombre'}</p>
														<p className="text-xs text-slate-500">{item.fuente}</p>
													</td>
													<td className="px-3 py-3">
														<span className={`rounded-full px-2 py-1 text-xs font-semibold ${estadoClass(item.estadoSeguimiento || item.estadoAsistencia || 'Pendiente')}`}>
															{formatEstado(item.estadoSeguimiento || item.estadoAsistencia || 'Pendiente')}
														</span>
													</td>
													<td className="px-3 py-3">
														<span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.prioridad.clase}`}>
															{item.prioridad.etiqueta}
														</span>
													</td>
													<td className="px-3 py-3 text-slate-700">{item.responsable}</td>
													<td className="px-3 py-3 text-slate-700">{item.siguienteAccion}</td>
													<td className="px-3 py-3 text-slate-700">{item.fechaSiguienteAccion}</td>
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
		</div>
	);
};

export default BandejaOperativa;