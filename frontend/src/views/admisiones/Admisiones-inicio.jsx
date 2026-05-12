import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ArrowRight, Bell, CalendarDays, CheckCircle2, Clock3, ChevronLeft, ChevronRight, Search, X, FileText, Briefcase, Phone, Users } from 'lucide-react';
import { AdminHeader, AdmisionesSidebar, AdminMainTitle } from '../../components/layout/AdminLayout';
import AdmisionesInicioDashboard from '../../components/admisiones/AdmisionesInicioDashboard';
import AdmisionesToast from '../../components/admisiones/AdmisionesToast';
import { API_BASE } from '../../config/api';

const diasSemanaCalendario = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const padNumero = (valor) => String(valor).padStart(2, '0');

const toInputDate = (date) => `${date.getFullYear()}-${padNumero(date.getMonth() + 1)}-${padNumero(date.getDate())}`;

const todayDateString = toInputDate(new Date());
const MINIMO_ANTICIPACION_CITA_MINUTOS = 60;

const esHorarioPasadoParaHoy = (fecha, hora) => {
	if (!fecha || !hora) {
		return false;
	}

	if (fecha !== todayDateString) {
		return false;
	}

	const fechaHoraSeleccionada = new Date(`${fecha}T${hora}:00`);
	if (Number.isNaN(fechaHoraSeleccionada.getTime())) {
		return false;
	}

	const limiteMinimo = Date.now() + (MINIMO_ANTICIPACION_CITA_MINUTOS * 60 * 1000);
	return fechaHoraSeleccionada.getTime() < limiteMinimo;
};


const LIMITE_PACIENTES = 40;

const getCapacidadTone = (n) => {
	if (n >= 38) return { tone: 'rose',    colorBar: 'bg-rose-500' };
	if (n >= 35) return { tone: 'amber',   colorBar: 'bg-amber-400' };
	return            { tone: 'emerald', colorBar: 'bg-emerald-500' };
};

const AdmisionesInicio = () => {
	const navigate = useNavigate();
	const [citasHoy, setCitasHoy] = useState([]);
	const [seguimiento, setSeguimiento] = useState([]);
	const [pacientesIngresados, setPacientesIngresados] = useState(0);
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

	const horariosAgenda = useMemo(() => {
		const horas = [];
		for (let h = 7; h <= 20; h += 1) {
			horas.push(`${String(h).padStart(2, '0')}:00`);
			horas.push(`${String(h).padStart(2, '0')}:30`);
		}
		return horas;
	}, []);

	const agendaHoraInvalida = useMemo(() => esHorarioPasadoParaHoy(agendaFecha, agendaHora), [agendaFecha, agendaHora]);
	const agendaListaParaGuardar = Boolean(pacienteAgendaSeleccionado && agendaFecha && agendaHora && !agendaHoraInvalida);

	const esHoraNoDisponible = (hora) => {
		if (!agendaFecha) {
			return true;
		}

		if (agendaFecha !== todayDateString) {
			return false;
		}

		const fechaHora = new Date(`${agendaFecha}T${hora}:00`);
		if (Number.isNaN(fechaHora.getTime())) {
			return true;
		}

		return fechaHora.getTime() < Date.now();
	};

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
		fetch(`${API_BASE}/pacientes`)
			.then(r => r.json())
			.then(data => {
				const count = Array.isArray(data)
					? data.filter(p => p.estadoPaciente === 'INGRESADO').length
					: 0;
				setPacientesIngresados(count);
			})
			.catch(() => {});
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

	const dashboardKpis = useMemo(() => {
		const restantes = LIMITE_PACIENTES - pacientesIngresados;
		const capTone   = getCapacidadTone(pacientesIngresados);
		return [
			{ label: 'Casos en Bandeja', value: String(bandejaTrabajo.length), helper: 'Casos activos por prioridad', tone: 'emerald', icon: FileText },
			{ label: 'Citas Activas', value: String(citasHoy.length), helper: 'Programadas para atender hoy', tone: 'sky', icon: CalendarDays },
			{ label: 'Seguimientos', value: String(seguimiento.length), helper: 'Llamadas y contactos registrados', tone: 'amber', icon: Phone },
			{ label: 'Pendientes Hoy', value: String(resumen.pendientes), helper: 'Casos que requieren acción', tone: 'rose', icon: Bell },
			{
				label: 'Capacidad Clínica',
				value: `${pacientesIngresados} / ${LIMITE_PACIENTES}`,
				helper: restantes > 0
					? `${restantes} lugar${restantes === 1 ? '' : 'es'} disponibles`
					: '⚠ Capacidad máxima alcanzada',
				tone: capTone.tone,
				icon: Users,
				progress: { value: pacientesIngresados, max: LIMITE_PACIENTES, colorBar: capTone.colorBar },
			},
		];
	}, [bandejaTrabajo.length, citasHoy.length, seguimiento.length, resumen.pendientes, pacientesIngresados]);

	const cambiarMes = (delta) => {
		setMesCalendario((prev) => {
			const siguiente = new Date(prev.year, prev.month + delta, 1);
			return { year: siguiente.getFullYear(), month: siguiente.getMonth() };
		});
	};

	const abrirAgenda = () => {
		setAgendaMensaje('');
		setAgendaMensajeTipo('success');
		setBusquedaAgenda('');
		setPacientesAgenda([]);
		setPacienteAgendaSeleccionado(null);
		setAgendaFecha(todayDateString);
		setAgendaHora('09:00');
		setAgendaTipo('Entrevista');
		setAgendaAbierta(true);
	};

	const cerrarAgenda = () => {
		setAgendaAbierta(false);
		setMostrarAgendaResultados(false);
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

		if (agendaHoraInvalida) {
			setAgendaMensaje('No puedes agendar una cita en un horario que ya pasó.');
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

	const seleccionarDiaAgenda = (value) => {
		if (value < todayDateString) {
			return;
		}

		setAgendaFecha(value);

		if (value === todayDateString && esHorarioPasadoParaHoy(value, agendaHora)) {
			const primeraHoraDisponible = horariosAgenda.find((hora) => !esHoraNoDisponible(hora));
			if (primeraHoraDisponible) {
				setAgendaHora(primeraHoraDisponible);
			}
		}
	};

	const seleccionarHoraAgenda = (hora) => {
		if (esHoraNoDisponible(hora)) {
			return;
		}
		setAgendaHora(hora);
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
					<div className="fixed inset-0 z-50 flex animate-in fade-in items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm duration-200">
						<div className="flex max-h-[92vh] w-full max-w-5xl animate-in zoom-in-95 fade-in flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)] duration-200">
							<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Agenda de admisiones</p>
									<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Programar cita</h3>
									<p className="mt-1 text-sm text-slate-500">Selecciona paciente, fecha y horario disponible.</p>
								</div>
								<button onClick={cerrarAgenda} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
									<X size={20} />
								</button>
							</div>

							<div className="grid flex-1 gap-4 overflow-y-auto px-5 py-5 md:grid-cols-[320px_1fr] md:px-7">
								<section className="space-y-4 rounded-[32px] border border-slate-200 bg-slate-50 p-4">
									<AdmisionesToast
										message={agendaMensaje}
										variant={agendaMensajeTipo}
										onClose={() => setAgendaMensaje('')}
										title={agendaMensajeTipo === 'success' ? 'Agenda confirmada' : 'Aviso de agenda'}
									/>
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Paciente</p>
										<div className="relative mt-3">
											<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
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
												placeholder="Buscar nombre..."
												className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
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
									</div>

									<div className="rounded-2xl border border-slate-200 bg-white p-4">
										<p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Paciente seleccionado</p>
										{pacienteAgendaSeleccionado ? (
											<div className="mt-3 space-y-1">
												<p className="text-base font-bold text-slate-900">{pacienteAgendaSeleccionado.nombreCompleto}</p>
												<p className="text-sm text-slate-500">Solicitante: {pacienteAgendaSeleccionado.solicitante?.nombre || 'Sin nombre'}</p>
												<p className="text-xs text-slate-400">Tel. {pacienteAgendaSeleccionado.telefonoContacto || pacienteAgendaSeleccionado.solicitante?.telefono || '--'}</p>
											</div>
										) : (
											<p className="mt-3 text-sm text-slate-500">Selecciona un paciente de la búsqueda.</p>
										)}
									</div>

									<div className="rounded-2xl border border-slate-200 bg-white p-4">
										<p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Tipo de cita</p>
										<select value={agendaTipo} onChange={(event) => setAgendaTipo(event.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15">
											<option>Entrevista</option>
											<option>Visita al instituto</option>
											<option>post-tratamiento</option>
											<option>familiar</option>
											<option>Valoración inicial</option>
										</select>
									</div>
								</section>

								<section className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-4">
									<div className="flex flex-wrap items-center justify-between gap-3">
										<div>
											<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Calendario</p>
											<h4 className="text-lg font-black capitalize text-slate-900">{calendarioMesLabel}</h4>
										</div>
										<div className="flex gap-2">
											<button
												type="button"
												onClick={() => cambiarMes(-1)}
												disabled={!puedeIrMesAnterior}
												className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
											>
												<ChevronLeft size={18} />
											</button>
											<button type="button" onClick={() => cambiarMes(1)} className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]"><ChevronRight size={18} /></button>
										</div>
									</div>

									<div className="grid grid-cols-7 gap-2">
										{diasSemanaCalendario.map((dia) => (
											<div key={dia} className="py-1 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{dia}</div>
										))}
										{celdasCalendario.map((celda, index) => {
											if (!celda) {
												return <div key={`empty-${index}`} className="h-[62px]" />;
											}

											const activa = agendaFecha === celda.value;
											const esFechaAnterior = celda.value < todayDateString;
											const esHoy = celda.value === todayDateString;
											const baseClass = 'h-[62px] rounded-2xl border px-2 py-2 text-left transition';
											const className = esFechaAnterior
												? `${baseClass} cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400`
												: activa
													? `${baseClass} border-[#7E1D3B] bg-[#7E1D3B] text-white shadow-sm`
													: `${baseClass} border-slate-200 bg-slate-50 text-slate-800 hover:border-[#7E1D3B]/50 hover:bg-rose-50`;

											return (
												<button
													key={celda.value}
													type="button"
													onClick={() => seleccionarDiaAgenda(celda.value)}
													disabled={esFechaAnterior}
													className={className}
												>
													<div className="text-lg font-black">{celda.day}</div>
													{esFechaAnterior ? (
														<div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]">PASADA</div>
													) : esHoy ? (
														<div className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] ${activa ? 'text-white/85' : 'text-[#7E1D3B]'}`}>
															HOY
														</div>
													) : null}
												</button>
											);
										})}
									</div>

									{agendaFecha ? (
										<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<div className="flex items-center justify-between gap-3">
												<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Horario disponible</p>
												<p className="text-sm font-semibold text-slate-700">{new Date(`${agendaFecha}T00:00:00`).toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' })}</p>
											</div>
											<div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
												{horariosAgenda.map((hora) => {
													const bloqueada = esHoraNoDisponible(hora);
													const activa = agendaHora === hora;
													return (
														<button
															key={`inicio-agenda-hora-${hora}`}
															type="button"
															disabled={bloqueada}
															onClick={() => seleccionarHoraAgenda(hora)}
															className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
																bloqueada
																	? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
																	: activa
																		? 'border-[#7E1D3B] bg-[#7E1D3B] text-white'
																		: 'border-slate-200 bg-white text-slate-700 hover:border-[#7E1D3B]/40 hover:bg-rose-50'
															}`}
														>
															{hora}
														</button>
													);
												})}
											</div>
											{agendaHoraInvalida ? <p className="mt-3 text-xs font-medium text-rose-600">No puedes agendar una cita en un horario que ya pasó</p> : null}
										</div>
									) : null}
								</section>
							</div>

							<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 md:px-7">
								<button type="button" onClick={cerrarAgenda} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
								<button type="button" onClick={guardarAgenda} disabled={!agendaListaParaGuardar} className="rounded-2xl bg-[#7E1D3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63162e] disabled:cursor-not-allowed disabled:opacity-60">Guardar cita</button>
							</div>
						</div>
					</div>
				) : null}

			</div>
		</div>
	);
};

export default AdmisionesInicio;