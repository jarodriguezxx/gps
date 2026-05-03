import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ArrowRight, Bell, CalendarDays, CheckCircle2, Clock3, ChevronLeft, ChevronRight, Search, X, FileText, Briefcase, Phone } from 'lucide-react';
import { AdminHeader, AdmisionesSidebar, AdminMainTitle } from '../../components/layout/AdminLayout';
import AdmisionesInicioDashboard from '../../components/admisiones/AdmisionesInicioDashboard';
import AdmisionesToast from '../../components/admisiones/AdmisionesToast';
import { API_BASE } from '../../config/api';

const diasSemanaCalendario = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const padNumero = (valor) => String(valor).padStart(2, '0');

const toInputDate = (date) => `${date.getFullYear()}-${padNumero(date.getMonth() + 1)}-${padNumero(date.getDate())}`;

const todayDateString = toInputDate(new Date());


const AdmisionesInicio = () => {
	const navigate = useNavigate();
	const [citasHoy, setCitasHoy] = useState([]);
	const [seguimiento, setSeguimiento] = useState([]);
	const [loadingTablas, setLoadingTablas] = useState(true);
	const [errorTablas, setErrorTablas] = useState('');
	const [agendaAbierta, setAgendaAbierta] = useState(false);
	const [busquedaAgenda, setBusquedaAgenda] = useState('');
	const [pacientesAgenda, setPacientesAgenda] = useState([]);
	const [cargandoPacientesAgenda, setCargandoPacientesAgenda] = useState(false);
	const [errorPacientesAgenda, setErrorPacientesAgenda] = useState('');
	const [pacienteAgendaSeleccionado, setPacienteAgendaSeleccionado] = useState(null);
	const [indiceAgendaResaltado, setIndiceAgendaResaltado] = useState(0);
	const [mostrarAgendaResultados, setMostrarAgendaResultados] = useState(false);
	const [agendaFecha, setAgendaFecha] = useState(toInputDate(new Date()));
	const [agendaHora, setAgendaHora] = useState('09:00');
	const [agendaTipo, setAgendaTipo] = useState('Entrevista');
	const [agendaMensaje, setAgendaMensaje] = useState('');
	const [agendaMensajeTipo, setAgendaMensajeTipo] = useState('success');
	const [mesCalendario, setMesCalendario] = useState(() => {
		const hoy = new Date();
		return { year: hoy.getFullYear(), month: hoy.getMonth() };
	});

	const formatEstado = (estado = '') => estado.replaceAll('_', ' ').trim();
	const formatFecha = (fechaIso) => {
		if (!fechaIso) return '--';
		const date = new Date(fechaIso);
		if (Number.isNaN(date.getTime())) return '--';
		return date.toLocaleDateString('es-MX');
	};

	const calendarioMesLabel = new Date(mesCalendario.year, mesCalendario.month, 1).toLocaleDateString('es-MX', {
		month: 'long',
		year: 'numeric',
	});

	const celdasCalendario = useMemo(() => {
		const firstDay = new Date(mesCalendario.year, mesCalendario.month, 1);
		const firstDayIndex = (firstDay.getDay() + 6) % 7;
		const totalDays = new Date(mesCalendario.year, mesCalendario.month + 1, 0).getDate();
		const cells = [];

		for (let index = 0; index < firstDayIndex; index += 1) {
			cells.push(null);
		}

		for (let day = 1; day <= totalDays; day += 1) {
			cells.push({
				day,
				value: `${mesCalendario.year}-${padNumero(mesCalendario.month + 1)}-${padNumero(day)}`,
			});
		}

		return cells;
	}, [mesCalendario]);

	const puedeIrMesAnterior = mesCalendario.year > new Date().getFullYear() || (mesCalendario.year === new Date().getFullYear() && mesCalendario.month > new Date().getMonth());

	const cargarTablas = async () => {
		try {
			setLoadingTablas(true);
			setErrorTablas('');
			const response = await fetch(`${API_BASE}/seguimientos/tablas`);

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

	useEffect(() => {
		const nombre = busquedaAgenda.trim();
		const controller = new AbortController();

		if (nombre.length < 2) {
			setPacientesAgenda([]);
			setCargandoPacientesAgenda(false);
			setErrorPacientesAgenda('');
			setMostrarAgendaResultados(false);
			setIndiceAgendaResaltado(0);
			return () => controller.abort();
		}

		const cargarPacientesAgenda = async () => {
			try {
				setCargandoPacientesAgenda(true);
				setErrorPacientesAgenda('');
				const response = await fetch(`${API_BASE}/pacientes/busqueda?query=${encodeURIComponent(nombre)}`, {
					signal: controller.signal,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || 'No se pudieron cargar los pacientes.');
				}

				const data = await response.json();
				const resultados = Array.isArray(data) ? data : [];
				setPacientesAgenda(resultados);
				setMostrarAgendaResultados(true);
				setIndiceAgendaResaltado(resultados.length > 0 ? 0 : -1);
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Error al buscar pacientes para agendar:', error);
					setErrorPacientesAgenda('No se pudo consultar pacientes por nombre.');
					setMostrarAgendaResultados(true);
				}
			} finally {
				setCargandoPacientesAgenda(false);
			}
		};

		cargarPacientesAgenda();
		return () => controller.abort();
	}, [busquedaAgenda]);

	const resumen = useMemo(() => {
		const total = citasHoy.length + seguimiento.length;
		return {
			atencionesHoy: total,
			pacientesNuevos: total,
			pendientes: [...citasHoy, ...seguimiento].filter((item) => formatEstado(item.estadoSeguimiento).toLowerCase().includes('espera')).length,
			seguimiento: seguimiento.length,
		};
	}, [citasHoy, seguimiento]);

	const proximosEventos = useMemo(() => {
		return [...citasHoy]
			.sort((a, b) => new Date(a.fechaHoraProgramada || 0).getTime() - new Date(b.fechaHoraProgramada || 0).getTime())
			.slice(0, 3)
			.map((cita) => ({
				id: cita.id,
				pacienteNombre: cita.pacienteNombre,
				tipoAccion: cita.tipoAccion,
				fechaHoraProgramada: cita.fechaHoraProgramada,
				estado: cita.estadoSeguimiento || cita.estadoAsistencia || 'Pendiente',
			}));
	}, [citasHoy]);

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

			if (estado.includes('no se presentado') || estado.includes('no contestado') || estado.includes('no hubo respuesta')) {
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

			if (estado.includes('no se presentado') || estado.includes('no contestado') || estado.includes('no hubo respuesta')) {
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
			})
			.slice(0, 8);
	}, [citasHoy, seguimiento]);

	const dashboardKpis = useMemo(() => ([
		{ label: 'Casos en Bandeja', value: String(bandejaTrabajo.length), helper: 'Casos activos por prioridad', tone: 'emerald', icon: FileText },
		{ label: 'Citas Activas', value: String(citasHoy.length), helper: 'Programadas para atender hoy', tone: 'sky', icon: CalendarDays },
		{ label: 'Seguimientos', value: String(seguimiento.length), helper: 'Llamadas y contactos registrados', tone: 'amber', icon: Phone },
		{ label: 'Pendientes Hoy', value: String(resumen.pendientes), helper: 'Casos que requieren acción', tone: 'rose', icon: Bell },
	]), [bandejaTrabajo.length, citasHoy.length, seguimiento.length, resumen.pendientes]);

	const cambiarMes = (delta) => {
		setMesCalendario((prev) => {
			const siguiente = new Date(prev.year, prev.month + delta, 1);
			return { year: siguiente.getFullYear(), month: siguiente.getMonth() };
		});
	};

	const abrirAgenda = () => {
		setAgendaMensaje('');
		setAgendaMensajeTipo('success');
		setAgendaAbierta(true);
	};

	const seleccionarPacienteAgenda = (paciente) => {
		setPacienteAgendaSeleccionado(paciente);
		setBusquedaAgenda(paciente.nombreCompleto || '');
		setMostrarAgendaResultados(false);
		setAgendaMensaje('');
		setAgendaMensajeTipo('success');
	};

	const pacienteTieneLlamadaInicial = (pacienteId) => {
		if (!pacienteId) {
			return false;
		}

		return seguimiento.some((item) => item.pacienteId === pacienteId);
	};

	const guardarAgenda = async () => {
		if (!pacienteAgendaSeleccionado) {
			setAgendaMensaje('Selecciona un paciente que ya haya pasado por la llamada inicial.');
			setAgendaMensajeTipo('error');
			return;
		}

		if (loadingTablas || errorTablas) {
			setAgendaMensaje('No se puede validar llamada inicial en este momento. Revisa la conexión con el backend.');
			setAgendaMensajeTipo('error');
			return;
		}

		if (!pacienteTieneLlamadaInicial(pacienteAgendaSeleccionado.id)) {
			setAgendaMensaje('Este paciente no tiene llamada inicial registrada. Primero captura la llamada inicial.');
			setAgendaMensajeTipo('error');
			return;
		}

		try {
			const fechaHoraProgramada = `${agendaFecha}T${agendaHora}:00`;
			const response = await fetch(`${API_BASE}/seguimientos/citas`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					pacienteId: pacienteAgendaSeleccionado.id,
					fechaHoraProgramada,
					tipoCita: agendaTipo,
					motivo: 'Cita agendada desde módulo de admisiones',
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'No se pudo guardar la cita en backend.');
			}

			await cargarTablas();
			setAgendaMensaje('Cita agendada y guardada correctamente.');
			setAgendaMensajeTipo('success');
			setAgendaAbierta(false);
		} catch (error) {
			console.error('Error al guardar cita agendada:', error);
			setAgendaMensaje('No se pudo guardar la cita en BD. Revisa backend o conexión.');
			setAgendaMensajeTipo('error');
		}
	};

	const handleAgendaKeyDown = (event) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setMostrarAgendaResultados(true);
			setIndiceAgendaResaltado((prev) => {
				const siguiente = prev + 1;
				return siguiente >= pacientesAgenda.length ? 0 : siguiente;
			});
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			setMostrarAgendaResultados(true);
			setIndiceAgendaResaltado((prev) => {
				const anterior = prev - 1;
				return anterior < 0 ? pacientesAgenda.length - 1 : anterior;
			});
			return;
		}

		if (event.key === 'Escape') {
			setMostrarAgendaResultados(false);
			return;
		}

		if (event.key === 'Enter' && pacientesAgenda.length > 0) {
			event.preventDefault();
			const indiceObjetivo = indiceAgendaResaltado >= 0 ? indiceAgendaResaltado : 0;
			seleccionarPacienteAgenda(pacientesAgenda[indiceObjetivo]);
		}
	};

	return (
		<div className="min-h-screen bg-slate-100 text-slate-900">
			<div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
				<AdminHeader submodule="Módulo de Admisiones" />

				<main className="space-y-5">
					<div className="grid gap-4 md:grid-cols-[220px_1fr]">
						<AdmisionesSidebar />
						<div className="space-y-5">
							<AdmisionesInicioDashboard
								kpis={dashboardKpis}
								citas={citasHoy}
								eventosProximos={proximosEventos}
								onAgendarCita={abrirAgenda}
								onNuevaLlamada={() => navigate('/admisiones/seguimiento-telefonico')}
							/>



						





													</div>
					</div>
				</main>

				{agendaAbierta ? (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
						<div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]">
							<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Agenda de admisiones</p>
									<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Programar cita </h3>
									<p className="mt-1 text-sm text-slate-500">Busca al paciente y selecciona fecha y hora para programar la cita.</p>
								</div>
								<button onClick={() => setAgendaAbierta(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
									<X size={20} />
								</button>
							</div>

							<div className="grid flex-1 gap-5 overflow-y-auto px-5 py-5 md:px-6 lg:grid-cols-[1.05fr_1.6fr]">
								<div className="space-y-4">
									<AdmisionesToast
										message={agendaMensaje}
										variant={agendaMensajeTipo}
										onClose={() => setAgendaMensaje('')}
										title={agendaMensajeTipo === 'success' ? 'Agenda confirmada' : 'Aviso de agenda'}
									/>
									<div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
										<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Paciente</p>
										<div className="relative mt-3">
											<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
											<input
												type="text"
												value={busquedaAgenda}
												onChange={(event) => setBusquedaAgenda(event.target.value)}
												onKeyDown={handleAgendaKeyDown}
												onFocus={() => {
													if (busquedaAgenda.trim().length >= 2) {
														setMostrarAgendaResultados(true);
													}
												}}
												placeholder="Buscar nombre del paciente..."
												className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
											/>
											{mostrarAgendaResultados && busquedaAgenda.trim().length >= 2 ? (
												<div className="absolute left-0 right-0 z-10 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
													<div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Resultados por nombre</div>
													{cargandoPacientesAgenda ? <p className="px-4 py-3 text-sm text-slate-500">Buscando pacientes...</p> : null}
													{errorPacientesAgenda ? <p className="px-4 py-3 text-sm text-rose-700">{errorPacientesAgenda}</p> : null}
													{!cargandoPacientesAgenda && !errorPacientesAgenda && pacientesAgenda.length === 0 ? (
														<p className="px-4 py-3 text-sm text-slate-500">No se encontraron coincidencias.</p>
													) : null}
													{!cargandoPacientesAgenda && pacientesAgenda.length > 0 ? (
														<ul className="max-h-64 overflow-y-auto">
															{pacientesAgenda.map((paciente, index) => (
																<li key={paciente.id}>
																	<button
																		type="button"
																		onMouseEnter={() => setIndiceAgendaResaltado(index)}
																		onClick={() => seleccionarPacienteAgenda(paciente)}
																		className={`w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 ${
																			indiceAgendaResaltado === index ? 'bg-[#7E1D3B]/10' : 'bg-white hover:bg-slate-50'
																		}`}
																	>
																		<p className="text-sm font-semibold text-slate-900">{paciente.nombreCompleto}</p>
																		<p className="text-xs text-slate-500">Solicitante: {paciente.solicitante?.nombre || 'Sin nombre'} • Tel: {paciente.telefonoContacto || paciente.solicitante?.telefono || '--'}</p>
																	</button>
																</li>
															))}
														</ul>
													) : null}
												</div>
											) : null}
										</div>

										<div className="rounded-[28px] border border-slate-200 bg-white p-4">
											<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Paciente seleccionado</p>
											<div className="mt-3 rounded-2xl bg-slate-50 p-4">
												{pacienteAgendaSeleccionado ? (
													<>
														<p className="text-xl font-black text-slate-900">{pacienteAgendaSeleccionado.nombreCompleto}</p>
														<p className="mt-1 text-sm text-slate-500">{pacienteAgendaSeleccionado.solicitante?.nombre || 'Paciente vinculado a la llamada inicial'}</p>
														<div className="mt-4 grid gap-2 text-sm text-slate-600">
															<div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
																<CalendarDays size={16} className="text-[#7E1D3B]" />
																Llamada inicial previa confirmada
															</div>
															<div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
																<Clock3 size={16} className="text-[#7E1D3B]" />
																Listo para programar entrevista
															</div>
														</div>
													</>
												) : (
													<p className="text-sm text-slate-500">Selecciona un paciente de la búsqueda.</p>
												)}
											</div>
										</div>
									</div>
								</div>

								<div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
									<div className="flex flex-wrap items-center justify-between gap-3">
										<div>
											<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Calendario</p>
											<h4 className="text-2xl font-black capitalize text-slate-900">{calendarioMesLabel}</h4>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => cambiarMes(-1)}
												disabled={!puedeIrMesAnterior}
												className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
											>
												<ChevronLeft size={18} />
											</button>
											<button onClick={() => cambiarMes(1)} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]"><ChevronRight size={18} /></button>
										</div>
									</div>

									<div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
										{diasSemanaCalendario.map((dia) => (
											<div key={dia} className="py-2">{dia}</div>
										))}
									</div>

									<div className="grid grid-cols-7 gap-2">
										{celdasCalendario.map((celda, index) => {
											if (!celda) {
												return <div key={`empty-${index}`} className="h-20 rounded-2xl bg-white/55" />;
											}

											const activa = agendaFecha === celda.value;
													const esFechaAnterior = celda.value < todayDateString;

											return (
												<button
													key={celda.value}
													type="button"
														onClick={() => {
															if (!esFechaAnterior) {
																setAgendaFecha(celda.value);
															}
														}}
														disabled={esFechaAnterior}
														className={`flex h-20 flex-col justify-between rounded-2xl border p-3 text-left transition ${activa ? 'border-[#7E1D3B] bg-[#7E1D3B] text-white shadow-lg' : esFechaAnterior ? 'cursor-not-allowed border-dashed border-slate-200 bg-slate-100 text-slate-400' : 'border-slate-200 bg-white text-slate-700 hover:border-[#7E1D3B]/30 hover:bg-[#7E1D3B]/5'}`}
												>
													<span className="text-sm font-black">{celda.day}</span>
													<span className="text-[11px] uppercase tracking-[0.16em] opacity-80">{activa ? 'Seleccionado' : esFechaAnterior ? 'Pasada' : 'Disponible'}</span>
												</button>
											);
										})}
									</div>

									<div className="grid gap-3 md:grid-cols-2">
										<label className="block space-y-2">
											<span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Fecha de cita</span>
											<input type="date" min={todayDateString} value={agendaFecha} onChange={(event) => setAgendaFecha(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
										</label>
										<label className="block space-y-2">
											<span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Hora</span>
											<input type="time" value={agendaHora} onChange={(event) => setAgendaHora(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
										</label>
									</div>

									<label className="block space-y-2">
										<span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Tipo de cita</span>
										<select value={agendaTipo} onChange={(event) => setAgendaTipo(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15">
											<option>Entrevista</option>
											<option>Visita al instituto</option>
											<option>post-tratamiento</option>
											<option>familiar</option>

											<option>Valoración inicial</option>
										</select>
									</label>

								</div>
							</div>

							<div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 md:px-6">
								<div className="text-sm text-slate-500">
									<span></span>
								</div>
								<div className="flex gap-2">
									<button type="button" onClick={() => setAgendaAbierta(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</button>
									<button type="button" onClick={guardarAgenda} className="rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#63162e]">Guardar cita</button>
								</div>
							</div>
						</div>
					</div>
				) : null}

			</div>
		</div>
	);
};

export default AdmisionesInicio;