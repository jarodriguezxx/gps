import React, { useEffect, useMemo, useState } from 'react';

import { CalendarDays, CheckCircle2, Clock3, Eye, LoaderCircle, Plus, Search, X } from 'lucide-react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';
import { API_BASE } from '../../config/api';

const formatFecha = (value) => {
	if (!value) return '--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '--';
	return date.toLocaleDateString('es-MX', {
		weekday: 'short',
		day: '2-digit',
		month: 'short',
	});
};

const formatHora = (value) => {
	if (!value) return '--:--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '--:--';
	return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const toLocalDateInputValue = (value) => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	const pad = (part) => String(part).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const formatDia = (value) => {
	if (!value) return '--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '--';
	return date.toLocaleDateString('es-MX', { weekday: 'long' });
};

const todayDateString = toLocalDateInputValue(new Date());
const DIAS_SEMANA_CORTO = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

const TOLERANCIA_REAGENDACION_MINUTOS = 15;
const MINIMO_ANTICIPACION_CITA_MINUTOS = 60;

const getCitaNombre = (cita) => cita?.pacienteNombre || cita?.nombreCompleto || cita?.nombre || 'Sin nombre';

const obtenerPacienteIdDesdeAgenda = (form, citas, llamadas) => {
	if (form.pacienteId) {
		return form.pacienteId;
	}

	const nombreBuscado = form.pacienteNombre.trim().toLowerCase();
	if (!nombreBuscado) {
		return null;
	}

	const coincidencia = [...citas, ...llamadas].find((item) => getCitaNombre(item).trim().toLowerCase() === nombreBuscado);
	return coincidencia?.pacienteId || null;
};

const esHorarioPasadoParaHoy = (fecha, hora) => {
	if (!fecha || !hora) {
		return false;
	}

	const hoy = toLocalDateInputValue(new Date());
	if (fecha !== hoy) {
		return false;
	}

	const fechaHoraSeleccionada = new Date(`${fecha}T${hora}:00`);
	if (Number.isNaN(fechaHoraSeleccionada.getTime())) {
		return false;
	}

	const limiteMinimo = Date.now() + (MINIMO_ANTICIPACION_CITA_MINUTOS * 60 * 1000);
	return fechaHoraSeleccionada.getTime() < limiteMinimo;
};

const sumarDias = (date, dias) => {
	const copia = new Date(date);
	copia.setDate(copia.getDate() + dias);
	return copia;
};

const AgendaCitas = () => {
	const [citas, setCitas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [accionesEnProceso, setAccionesEnProceso] = useState({});
	
	const [searchQuery, setSearchQuery] = useState('');
	const [agendaOpen, setAgendaOpen] = useState(false);
	const [registroOpen, setRegistroOpen] = useState(false);
	const [citaSeleccionada, setCitaSeleccionada] = useState(null);
	const [savingAgenda, setSavingAgenda] = useState(false);
	const [savingRegistro, setSavingRegistro] = useState(false);
	const [agendaMensaje, setAgendaMensaje] = useState('');
	const [agendaMensajeTipo, setAgendaMensajeTipo] = useState('success');
	const [registroMensaje, setRegistroMensaje] = useState('');
	const [registroMensajeTipo, setRegistroMensajeTipo] = useState('success');
	const [avisoReagendacion, setAvisoReagendacion] = useState('');
	const [tabActiva, setTabActiva] = useState('citas'); // 'citas' o 'llamadas'
	const [llamadas, setLlamadas] = useState([]);
	const [filtroVista, setFiltroVista] = useState('hoy');
	const [filtroFechaPersonalizada, setFiltroFechaPersonalizada] = useState(todayDateString);
	const [form, setForm] = useState({
		pacienteId: '',
		pacienteNombre: '',
		fecha: '',
		hora: '09:00',
		tipoCita: 'Entrevista',
		profesional: 'Admisiones',
		motivo: 'Cita agendada desde agenda de citas',
		notas: '',
	});
	const [formRegistro, setFormRegistro] = useState({
		diagnosticoVisual: '',
		observaciones: '',
		proximas: '',
	});

	const cargarDatos = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await fetch(`${API_BASE}/seguimientos/tablas`);
			if (!response.ok) throw new Error('Error al cargar datos');
			const data = await response.json();

			setCitas(Array.isArray(data?.citas) ? data.citas : []);
			setLlamadas(Array.isArray(data?.llamadas) ? data.llamadas : []);
		} catch {
			setError('No se pudo conectar con el backend.');
		} finally {
			setLoading(false);
		}
	};

	const agendaHoraInvalida = useMemo(() => esHorarioPasadoParaHoy(form.fecha, form.hora), [form.fecha, form.hora]);
	const pacienteIdAgenda = useMemo(() => obtenerPacienteIdDesdeAgenda(form, citas, llamadas), [form, citas, llamadas]);
	const agendaListaParaGuardar = Boolean(form.pacienteNombre.trim() && form.fecha && form.hora && pacienteIdAgenda && !agendaHoraInvalida);

	const pacientesAgenda = useMemo(() => {
		const mapa = new Map();
		[...citas, ...llamadas].forEach((item) => {
			const nombre = getCitaNombre(item).trim();
			if (!nombre) {
				return;
			}
			const key = String(item.pacienteId || nombre.toLowerCase());
			if (!mapa.has(key)) {
				mapa.set(key, {
					pacienteId: item.pacienteId || '',
					nombre,
					telefono: item.pacienteTelefono || '--',
				});
			}
		});
		return Array.from(mapa.values());
	}, [citas, llamadas]);

	const pacientesSugeridosAgenda = useMemo(() => {
		const query = form.pacienteNombre.trim().toLowerCase();
		if (!query) {
			return pacientesAgenda.slice(0, 6);
		}
		return pacientesAgenda
			.filter((paciente) => paciente.nombre.toLowerCase().includes(query))
			.slice(0, 6);
	}, [form.pacienteNombre, pacientesAgenda]);

	const pacienteSeleccionadoAgenda = useMemo(() => {
		if (form.pacienteId) {
			return pacientesAgenda.find((paciente) => String(paciente.pacienteId) === String(form.pacienteId)) || null;
		}

		const nombre = form.pacienteNombre.trim().toLowerCase();
		if (!nombre) {
			return null;
		}
		return pacientesAgenda.find((paciente) => paciente.nombre.trim().toLowerCase() === nombre) || null;
	}, [form.pacienteId, form.pacienteNombre, pacientesAgenda]);

	const calendarioMesActual = useMemo(() => {
		const base = new Date();
		const year = base.getFullYear();
		const month = base.getMonth();

		const primerDiaMes = new Date(year, month, 1);
		const ultimoDiaMes = new Date(year, month + 1, 0);
		const diasEnMes = ultimoDiaMes.getDate();

		const diaSemanaInicio = (primerDiaMes.getDay() + 6) % 7;
		const celdas = [];

		for (let i = 0; i < diaSemanaInicio; i += 1) {
			celdas.push({
				tipo: 'vacio',
				key: `empty-${i}`,
			});
		}

		for (let dia = 1; dia <= diasEnMes; dia += 1) {
			const fecha = new Date(year, month, dia);
			const fechaString = toLocalDateInputValue(fecha);
			const esPasada = fechaString < todayDateString;
			const esSeleccionada = form.fecha === fechaString;
			const esHoy = fechaString === todayDateString;

			celdas.push({
				tipo: 'dia',
				key: fechaString,
				dia,
				fechaString,
				esPasada,
				esSeleccionada,
				esHoy,
			});
		}

		return {
			nombreMes: primerDiaMes.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }),
			celdas,
		};
	}, [form.fecha]);

	const horariosAgenda = useMemo(() => {
		const horas = [];
		for (let h = 7; h <= 20; h += 1) {
			horas.push(`${String(h).padStart(2, '0')}:00`);
			horas.push(`${String(h).padStart(2, '0')}:30`);
		}
		return horas;
	}, []);

	const esHoraNoDisponible = (hora) => {
		if (!form.fecha) {
			return true;
		}
		if (form.fecha !== todayDateString) {
			return false;
		}
		const fechaHora = new Date(`${form.fecha}T${hora}:00`);
		if (Number.isNaN(fechaHora.getTime())) {
			return true;
		}
		return fechaHora.getTime() < Date.now();
	};

	const seleccionarPacienteAgenda = (paciente) => {
		setForm((prev) => ({
			...prev,
			pacienteId: paciente.pacienteId || '',
			pacienteNombre: paciente.nombre,
		}));
	};

	const seleccionarDiaAgenda = (fechaString) => {
		if (fechaString < todayDateString) {
			return;
		}
		setForm((prev) => {
			let horaSiguiente = prev.hora;
			if (!horaSiguiente || (fechaString === todayDateString && esHorarioPasadoParaHoy(fechaString, horaSiguiente))) {
				horaSiguiente = horariosAgenda.find((hora) => !esHoraNoDisponible(hora)) || '';
			}

			return {
				...prev,
				fecha: fechaString,
				hora: horaSiguiente,
			};
		});
	};

	const seleccionarHoraAgenda = (hora) => {
		if (esHoraNoDisponible(hora)) {
			return;
		}
		setForm((prev) => ({ ...prev, hora }));
	};

	const esCitaVencida = (cita) => {
		if (!cita?.fechaHoraProgramada) {
			return false;
		}

		const fechaProgramada = new Date(cita.fechaHoraProgramada).getTime();
		if (Number.isNaN(fechaProgramada)) {
			return false;
		}

		const estado = String(cita.estadoAsistencia || cita.estadoSeguimiento || '').toLowerCase();
		if (!estado.includes('pend')) {
			return false;
		}

		const toleranciaEnMs = TOLERANCIA_REAGENDACION_MINUTOS * 60 * 1000;
		return Date.now() > fechaProgramada + toleranciaEnMs;
	};

	useEffect(() => {
		cargarDatos();
	}, []);

	const resumen = useMemo(() => ({
		total: citas.length,
		confirmadas: citas.filter((cita) => String(cita.estadoAsistencia || cita.estadoSeguimiento || '').toLowerCase().includes('lleg')).length,
		pendientes: citas.filter((cita) => String(cita.estadoAsistencia || cita.estadoSeguimiento || '').toLowerCase().includes('pend') || String(cita.estadoAsistencia || cita.estadoSeguimiento || '').toLowerCase().includes('espera')).length,
		proxima: [...citas].sort((a, b) => new Date(a.fechaHoraProgramada || 0) - new Date(b.fechaHoraProgramada || 0))[0] || null,
	}), [citas]);

	const citasFiltradas = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const ordenadas = [...citas].sort((a, b) => new Date(a.fechaHoraProgramada || 0) - new Date(b.fechaHoraProgramada || 0));
		return ordenadas.filter((cita) => {
			const coincideNombre = !query || getCitaNombre(cita).toLowerCase().includes(query);
			const fechaCita = toLocalDateInputValue(cita.fechaHoraProgramada);
			const coincideVista =
				filtroVista === 'todas'
					? true
					: filtroVista === 'custom'
						? fechaCita === filtroFechaPersonalizada
						: fechaCita === todayDateString;
			return coincideNombre && coincideVista;
		});
	}, [citas, searchQuery, filtroVista, filtroFechaPersonalizada]);

	const llamadasFiltradas = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const ordenadas = [...llamadas].sort((a, b) => new Date(a.fechaHoraProgramada || 0) - new Date(b.fechaHoraProgramada || 0));
		return ordenadas.filter((item) => {
			const coincideNombre = !query || getCitaNombre(item).toLowerCase().includes(query);
			const fechaLlamada = toLocalDateInputValue(item.fechaHoraProgramada);
			const coincideVista =
				filtroVista === 'todas'
					? true
					: filtroVista === 'custom'
						? fechaLlamada === filtroFechaPersonalizada
						: fechaLlamada === todayDateString;
			return coincideNombre && coincideVista;
		});
	}, [llamadas, searchQuery, filtroVista, filtroFechaPersonalizada]);

	const abrirAgenda = () => {
		setAgendaMensaje('');
		setAgendaMensajeTipo('success');
		setAvisoReagendacion('');
		setCitaSeleccionada(null);
		setForm({
			pacienteId: '',
			pacienteNombre: '',
			fecha: '',
			hora: '09:00',
			tipoCita: 'Entrevista',
			profesional: 'Admisiones',
			motivo: 'Cita agendada desde agenda de citas',
			notas: '',
		});
		setAgendaOpen(true);
	};

	const abrirReagendacion = (cita) => {
		const fechaProgramada = cita?.fechaHoraProgramada ? new Date(cita.fechaHoraProgramada) : new Date();
		const nuevaFecha = sumarDias(fechaProgramada, 1);
		const pad = (valor) => String(valor).padStart(2, '0');

		setForm({
			pacienteId: cita?.pacienteId || '',
			pacienteNombre: getCitaNombre(cita),
			fecha: `${nuevaFecha.getFullYear()}-${pad(nuevaFecha.getMonth() + 1)}-${pad(nuevaFecha.getDate())}`,
			hora: fechaProgramada instanceof Date && !Number.isNaN(fechaProgramada.getTime()) ? `${pad(fechaProgramada.getHours())}:${pad(fechaProgramada.getMinutes())}` : '09:00',
			tipoCita: cita?.tipoAccion || 'Entrevista',
			profesional: cita?.profesionalNombre || cita?.responsableNombre || 'Admisiones',
			motivo: 'Re-agendación por inasistencia previa',
			notas: 'Cita vencida, requiere nueva programación.',
		});
		setSearchQuery(getCitaNombre(cita));
		setAgendaMensaje('La cita vencida quedó lista para re agendar. Revisa la nueva fecha y guarda.');
		setAgendaMensajeTipo('info');
		setAvisoReagendacion(`Re-agendación preparada para ${getCitaNombre(cita)}.`);
		setAgendaOpen(true);
	};

	const cerrarAgenda = () => {
		setAgendaOpen(false);
		setAgendaMensaje('');
		setAgendaMensajeTipo('success');
		setAvisoReagendacion('');
		setFiltroVista('hoy');
		setFiltroFechaPersonalizada(todayDateString);
		setForm({
			pacienteId: '',
			pacienteNombre: '',
			fecha: '',
			hora: '09:00',
			tipoCita: 'Entrevista',
			profesional: 'Admisiones',
			motivo: 'Cita agendada desde agenda de citas',
			notas: '',
		});
	};

	const abrirRegistro = (cita) => {
		setCitaSeleccionada(cita);
		setRegistroMensaje('');
		setRegistroMensajeTipo('success');
		setAvisoReagendacion('');
		setFormRegistro({
			diagnosticoVisual: '',
			observaciones: '',
			proximas: '',
		});
		setRegistroOpen(true);
	};

	const cerrarRegistro = () => {
		setRegistroOpen(false);
		setRegistroMensaje('');
		setRegistroMensajeTipo('success');
		setCitaSeleccionada(null);
		setFormRegistro({
			diagnosticoVisual: '',
			observaciones: '',
			proximas: '',
		});
	};

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
			...(name === 'pacienteNombre' ? { pacienteId: '' } : null),
		}));
	};

	const handleFormRegistroChange = (event) => {
		const { name, value } = event.target;
		setFormRegistro((prev) => ({ ...prev, [name]: value }));
	};

	const guardarAgenda = async () => {
		if (!form.pacienteNombre.trim() || !form.fecha || !form.hora) {
			setAgendaMensaje('Captura paciente, fecha y hora para agendar la cita.');
			setAgendaMensajeTipo('error');
			return;
		}

		if (agendaHoraInvalida) {
			setAgendaMensaje('No puedes agendar una cita en un horario que ya pasó');
			setAgendaMensajeTipo('error');
			return;
		}

		const pacienteId = obtenerPacienteIdDesdeAgenda(form, citas, llamadas);
		if (!pacienteId) {
			setAgendaMensaje('No se encontró un paciente válido para guardar la cita en el backend.');
			setAgendaMensajeTipo('error');
			return;
		}

		const fechaHoraProgramada = `${form.fecha}T${form.hora}:00`;

		try {
			setSavingAgenda(true);
			const response = await fetch(`${API_BASE}/seguimientos/citas`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					pacienteId,
					fechaHoraProgramada,
					tipoCita: form.tipoCita,
					motivo: form.motivo,
				}),
			});

			const data = await response.json().catch(() => ({}));
			if (!response.ok) {
				throw new Error(data?.error || 'No se pudo guardar la cita.');
			}

			await cargarDatos();
			setSearchQuery(form.pacienteNombre.trim());
			cerrarAgenda();
		} catch (saveError) {
			console.error('Error al guardar agenda:', saveError);
			setAgendaMensaje(saveError instanceof Error ? saveError.message : 'No se pudo guardar la cita.');
			setAgendaMensajeTipo('error');
		} finally {
			setSavingAgenda(false);
		}
	};

	const guardarRegistro = async () => {
		if (!formRegistro.diagnosticoVisual.trim()) {
			setRegistroMensaje('Captura el diagnóstico visual antes de guardar.');
			setRegistroMensajeTipo('error');
			return;
		}

		if (!citaSeleccionada?.id) {
			setRegistroMensaje('No hay una cita seleccionada para registrar la llegada.');
			setRegistroMensajeTipo('error');
			return;
		}

		const citaIdSeleccionada = citaSeleccionada.id;

		try {
			setSavingRegistro(true);
			setAccionesEnProceso((prev) => ({ ...prev, [`${citaIdSeleccionada}-llego`]: true }));
			const response = await fetch(`${API_BASE}/seguimientos/${citaIdSeleccionada}/asistencia`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					estadoAsistencia: 'Llegó',
					diagnosticoVisual: formRegistro.diagnosticoVisual.trim(),
				}),
			});

			const data = await response.json().catch(() => ({}));
			if (!response.ok) {
				throw new Error(data?.error || 'No se pudo guardar el registro.');
			}

			await cargarDatos();
			setRegistroMensaje('Llegada registrada correctamente.');
			setRegistroMensajeTipo('success');
			cerrarRegistro();
		} catch (saveError) {
			console.error('Error al guardar registro:', saveError);
			setRegistroMensaje(saveError instanceof Error ? saveError.message : 'No se pudo guardar el registro.');
			setRegistroMensajeTipo('error');
		} finally {
			setAccionesEnProceso((prev) => {
				const siguiente = { ...prev };
				delete siguiente[`${citaIdSeleccionada}-llego`];
				return siguiente;
			});
			setSavingRegistro(false);
		}
	};

	const marcarNoPresento = async (citaId) => {
		const citaObjetivo = citas.find((cita) => cita.id === citaId) || null;
		if (!citaObjetivo) {
			setRegistroMensaje('No se encontró la cita seleccionada.');
			setRegistroMensajeTipo('error');
			return;
		}

		try {
			setAccionesEnProceso((prev) => ({ ...prev, [`${citaId}-no-presento`]: true }));
			const response = await fetch(`${API_BASE}/seguimientos/${citaId}/asistencia`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					estadoAsistencia: 'No se presentó',
					diagnosticoVisual: '',
				}),
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				const errorText = data?.error || 'No se pudo registrar la inasistencia.';
				throw new Error(errorText);
			}

			await cargarDatos();
			setAvisoReagendacion(`Se generó un aviso de re-agendación para ${getCitaNombre(citaObjetivo)}. El caso quedó como prioridad alta.`);
			abrirReagendacion(citaObjetivo);
		} catch (error) {
			console.error('Error al registrar no se presentó:', error);
			setRegistroMensaje('No se pudo actualizar la asistencia de la cita.');
			setRegistroMensajeTipo('error');
		} finally {
			setAccionesEnProceso((prev) => {
				const siguiente = { ...prev };
				delete siguiente[`${citaId}-no-presento`];
				return siguiente;
			});
		}
	};

	return (
		<div className="min-h-screen bg-slate-100 text-slate-900">
			<div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
				<AdminHeader submodule="Agenda de Citas" />

				<main className="space-y-5">
					<div className="grid gap-4 md:grid-cols-[220px_1fr]">
						<AdmisionesSidebar />
						<div className="space-y-5">
							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
								<div className="space-y-4">
									<div className="space-y-1">
										<p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Agenda de Citas</p>
										<h2 className="text-3xl font-black text-slate-900">Control de citas del día</h2>
										<p className="text-sm text-slate-500">Visualiza todas las citas programadas, busca pacientes y registra llegadas con diagnóstico visual.</p>
									</div>
								</div>

								<div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
									{[
										{ label: 'Citas en agenda', value: String(resumen.total), tone: 'sky', icon: CalendarDays },
										{ label: 'Confirmadas', value: String(resumen.confirmadas), tone: 'emerald', icon: CheckCircle2 },
										{ label: 'Pendientes', value: String(resumen.pendientes), tone: 'amber', icon: Clock3 },
										{ label: 'Próxima cita', value: resumen.proxima ? formatHora(resumen.proxima.fechaHoraProgramada) : '--:--', tone: 'rose', icon: CalendarDays },
									].map((item) => {
										const Icon = item.icon;
										const toneClass = item.tone === 'sky' ? 'text-sky-700' : item.tone === 'emerald' ? 'text-emerald-700' : item.tone === 'amber' ? 'text-amber-700' : 'text-[#7E1D3B]';
										const iconClass = item.tone === 'sky' ? 'text-sky-600 bg-sky-100' : item.tone === 'emerald' ? 'text-emerald-600 bg-emerald-100' : item.tone === 'amber' ? 'text-amber-600 bg-amber-100' : 'text-[#7E1D3B] bg-rose-100';

										return (
											<article key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
												<div className="flex items-center justify-between gap-3">
													<p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
													<div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconClass}`}>
														<Icon size={18} />
													</div>
												</div>
												<p className={`mt-3 text-3xl font-black ${toneClass}`}>{item.value}</p>
											</article>
										);
									})}
								</div>
							</section>

							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
								<div className="mb-5 flex flex-col gap-4">
									<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
										<div className="flex items-center gap-3">
											<h3 className="text-xl font-bold text-slate-900">Agenda del día</h3>
											<button
												type="button"
												onClick={abrirAgenda}
												className="inline-flex items-center gap-2 rounded-2xl bg-[#7E1D3B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#63162e]"
											>
												<Plus size={16} />
												Agendar
											</button>
										</div>

										<div className="w-full lg:max-w-md">
											<div className="relative">
												<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
												<input
													type="text"
													value={searchQuery}
													onChange={(event) => setSearchQuery(event.target.value)}
													placeholder="Buscar por nombre de paciente..."
													className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
												/>
												{searchQuery ? (
													<button
														type="button"
														onClick={() => setSearchQuery('')}
														className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
													>
														<X size={16} />
													</button>
												) : null}
											</div>
										</div>
									</div>

									<div className="flex gap-2 border-b border-slate-200">
										<button
											type="button"
											onClick={() => setTabActiva('citas')}
											className={`px-4 py-3 text-sm font-semibold transition ${
												tabActiva === 'citas'
													? 'border-b-2 border-[#7E1D3B] text-[#7E1D3B]'
													: 'text-slate-600 hover:text-slate-900'
											}`}
										>
											Citas programadas
										</button>
										<button
											type="button"
											onClick={() => setTabActiva('llamadas')}
											className={`px-4 py-3 text-sm font-semibold transition ${
												tabActiva === 'llamadas'
													? 'border-b-2 border-[#7E1D3B] text-[#7E1D3B]'
													: 'text-slate-600 hover:text-slate-900'
											}`}
										>
											Llamadas en seguimiento
										</button>
									</div>
								</div>

								<div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
									<div className="md:col-span-3 flex flex-wrap gap-2">
										<button
											type="button"
											onClick={() => setFiltroVista('hoy')}
											className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${filtroVista === 'hoy' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
										>
											Citas de hoy
										</button>
										<button
											type="button"
											onClick={() => setFiltroVista('todas')}
											className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${filtroVista === 'todas' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
										>
											Todas
										</button>
										<button
											type="button"
											onClick={() => setFiltroVista('custom')}
											className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${filtroVista === 'custom' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
										>
											Elegir fecha
										</button>
									</div>
									<div className="flex items-end">
										<button
											type="button"
											onClick={() => {
											setFiltroVista('hoy');
											setFiltroFechaPersonalizada(todayDateString);
										}}
											className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
										>
											Limpiar filtros
										</button>
									</div>
									{filtroVista === 'custom' ? (
										<div className="md:col-span-4">
											<label className="block space-y-2">
												<span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Fecha personalizada</span>
												<input
													type="date"
													value={filtroFechaPersonalizada}
													onChange={(event) => setFiltroFechaPersonalizada(event.target.value)}
													className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
												/>
											</label>
										</div>
									) : null}
								</div>

								{avisoReagendacion ? (
									<div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
										<div className="flex items-start justify-between gap-3">
											<div>
												<p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Aviso de re agendación</p>
												<p className="mt-1">{avisoReagendacion}</p>
											</div>
											<button
												type="button"
												onClick={() => setAvisoReagendacion('')}
												className="rounded-full p-1 text-amber-700 transition hover:bg-amber-100"
												aria-label="Cerrar aviso de re agendación"
											>
												<X size={16} />
											</button>
										</div>
									</div>
								) : null}

								<div>
									{tabActiva === 'citas' && (
										<div>
											<h4 className="mb-3 text-lg font-bold text-slate-900">Citas programadas</h4>
										{loading ? (
											<div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
												<LoaderCircle className="animate-spin" size={18} />
												Cargando citas...
											</div>
										) : error ? (
											<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
										) : (
											<div className="overflow-x-auto">
												<table className="min-w-full border-collapse text-left text-sm">
													<thead>
														<tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
															<th className="px-3 py-2 font-semibold">Día</th>
															<th className="px-3 py-2 font-semibold">Fecha</th>
															<th className="px-3 py-2 font-semibold">Hora</th>
															<th className="px-3 py-2 font-semibold">Paciente</th>
															<th className="px-3 py-2 font-semibold">Tipo</th>
															<th className="px-3 py-2 font-semibold">Profesional</th>
															<th className="px-3 py-2 font-semibold">Estado</th>
															<th className="px-3 py-2 font-semibold">Acciones</th>
														</tr>
													</thead>
													<tbody>
														{citasFiltradas.length === 0 ? (
															<tr>
																<td className="px-3 py-3 text-slate-500" colSpan={8}>No hay citas para mostrar con ese filtro.</td>
															</tr>
														) : citasFiltradas.map((cita) => {
															const estado = String(cita.estadoAsistencia || cita.estadoSeguimiento || 'Pendiente');
															const estadoLower = estado.toLowerCase();
															const estadoClass = estadoLower.includes('lleg') ? 'bg-emerald-100 text-emerald-800' : estadoLower.includes('no se presentó') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800';
															const esNoPresento = estadoLower.includes('no se presentó');
															const estaVencida = esCitaVencida(cita);

															return (
																<tr key={cita.id} className="border-b border-slate-100 align-middle">
																	<td className="px-3 py-3 font-medium text-slate-700 capitalize">{formatDia(cita.fechaHoraProgramada)}</td>
																	<td className="px-3 py-3 font-medium text-slate-700">{formatFecha(cita.fechaHoraProgramada)}</td>
																	<td className="px-3 py-3 font-medium text-slate-700">
																		<div className="flex flex-wrap items-center gap-2">
																			<span>{formatHora(cita.fechaHoraProgramada)}</span>
																			{String(cita.estadoSeguimiento || cita.estadoAsistencia || '').toLowerCase().includes('pend') && estaVencida ? (
																				<span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700">
																					Vencida
																				</span>
																			) : null}
																		</div>
																	</td>
																	<td className="px-3 py-3 font-semibold text-slate-900">{getCitaNombre(cita)}</td>
																	<td className="px-3 py-3 text-slate-700">{cita.tipoAccion || 'Entrevista'}</td>
																	<td className="px-3 py-3 text-slate-700">{cita.profesionalNombre || cita.responsableNombre || 'Admisiones'}</td>
																	<td className="px-3 py-3">
																		<span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${estadoClass}`}>
																			{estado}
																		</span>
																	</td>
																	<td className="px-3 py-3">
																		{esNoPresento ? (
																			<span className="inline-block rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
																				Cita cerrada
																			</span>
																		) : (
																			<div className="flex flex-wrap gap-2">
																				<button
																					type="button"
																					onClick={() => abrirRegistro(cita)}
																					disabled={Boolean(accionesEnProceso[`${cita.id}-llego`])}
																					className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
																				>
																					{accionesEnProceso[`${cita.id}-llego`] ? <LoaderCircle size={14} className="animate-spin" /> : <Eye size={14} />}
																					{accionesEnProceso[`${cita.id}-llego`] ? 'Guardando...' : 'Llegó'}
																				</button>
																				<button
																					type="button"
																					onClick={() => marcarNoPresento(cita.id)}
																					disabled={Boolean(accionesEnProceso[`${cita.id}-no-presento`])}
																					className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
																				>
																					{accionesEnProceso[`${cita.id}-no-presento`] ? 'Procesando...' : 'No se presentó'}
																				</button>
																				{estaVencida ? (
																					<button
																						type="button"
																						onClick={() => abrirReagendacion(cita)}
																						className="inline-flex items-center gap-1 rounded-md border border-[#F59E0B] bg-[#F59E0B]/10 px-3 py-2 text-xs font-semibold text-[#B45309] transition hover:bg-[#F59E0B]/20"
																					>
																						<Plus size={14} />
																						Re agendar
																					</button>
																				) : null}
																			</div>
																		)}
																	</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										)}
									</div>
									)}

									{tabActiva === 'llamadas' && (
										<div>
											<h4 className="mb-3 text-lg font-bold text-slate-900">Llamadas en seguimiento</h4>
										{loading ? (
											<div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
												<LoaderCircle className="animate-spin" size={18} />
												Cargando llamadas...
											</div>
										) : (
											<div className="overflow-x-auto">
												<table className="min-w-full border-collapse text-left text-sm">
													<thead>
														<tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
															<th className="px-3 py-2 font-semibold">Paciente</th>
															<th className="px-3 py-2 font-semibold">Teléfono</th>
															<th className="px-3 py-2 font-semibold">Día</th>
															<th className="px-3 py-2 font-semibold">Fecha</th>
															<th className="px-3 py-2 font-semibold">Hora</th>
															<th className="px-3 py-2 font-semibold">Motivo</th>
															<th className="px-3 py-2 font-semibold">Estado</th>
														</tr>
													</thead>
													<tbody>
														{llamadas.length === 0 ? (
															<tr>
																<td className="px-3 py-3 text-slate-500" colSpan={7}>No hay llamadas de seguimiento registradas.</td>
															</tr>
														) : llamadasFiltradas.map((item) => {
															const estado = String(item.estadoSeguimiento || 'Pendiente');
															const estadoLower = estado.toLowerCase();
															const estadoClass = estadoLower.includes('hecha') || estadoLower.includes('llamó') ? 'bg-emerald-100 text-emerald-800' : estadoLower.includes('no') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800';

															return (
																<tr key={item.id} className="border-b border-slate-100 align-middle">
																	<td className="px-3 py-3 font-semibold text-slate-900">{item.pacienteNombre || '--'}</td>
																	<td className="px-3 py-3 text-slate-700">{item.pacienteTelefono || '--'}</td>
																	<td className="px-3 py-3 text-slate-700 capitalize">{formatDia(item.fechaHoraProgramada)}</td>
																	<td className="px-3 py-3 text-slate-700">{formatFecha(item.fechaHoraProgramada)}</td>
																	<td className="px-3 py-3 text-slate-700">{formatHora(item.fechaHoraProgramada)}</td>
																	<td className="px-3 py-3 text-slate-700">{item.motivo || '--'}</td>
																	<td className="px-3 py-3">
																		<span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${estadoClass}`}>
																			{estado}
																		</span>
																	</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										)}
									</div>
									)}
								</div>
							</section>
						</div>
					</div>
				</main>
			</div>

			{agendaOpen ? (
				<div className="fixed inset-0 z-50 flex animate-in fade-in items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm duration-200">
					<div className="flex max-h-[92vh] w-full max-w-5xl animate-in zoom-in-95 fade-in flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)] duration-200">
						<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-7">
							<div>
								<p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Agenda de Citas</p>
								<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Programar cita</h3>
								<p className="mt-1 text-sm text-slate-500">Selecciona paciente, fecha y horario disponible.</p>
							</div>
							<button onClick={cerrarAgenda} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
								<X size={20} />
							</button>
						</div>

						<div className="grid flex-1 gap-4 overflow-y-auto px-5 py-5 md:grid-cols-[320px_1fr] md:px-7">
							<section className="space-y-4 rounded-[32px] border border-slate-200 bg-slate-50 p-4">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Paciente</p>
									<div className="relative mt-3">
										<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
										<input
											type="text"
											name="pacienteNombre"
											value={form.pacienteNombre}
											onChange={handleFormChange}
											placeholder="Buscar nombre..."
											className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
										/>
									</div>

									{pacientesSugeridosAgenda.length > 0 ? (
										<div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-white p-2">
											{pacientesSugeridosAgenda.map((paciente) => (
												<button
													key={`${paciente.pacienteId || paciente.nombre}-agenda-sugerencia`}
													type="button"
													onClick={() => seleccionarPacienteAgenda(paciente)}
													className="flex w-full items-start justify-between rounded-xl px-3 py-2 text-left transition hover:bg-slate-100"
												>
													<span className="text-sm font-semibold text-slate-800">{paciente.nombre}</span>
													<span className="text-xs text-slate-500">{paciente.telefono}</span>
												</button>
											))}
										</div>
									) : null}
								</div>

								<div className="rounded-2xl border border-slate-200 bg-white p-4">
									<p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Paciente seleccionado</p>
									{pacienteSeleccionadoAgenda ? (
										<div className="mt-3 space-y-1">
											<p className="text-base font-bold text-slate-900">{pacienteSeleccionadoAgenda.nombre}</p>
											<p className="text-sm text-slate-500">Tel. {pacienteSeleccionadoAgenda.telefono || '--'}</p>
											<p className="text-xs text-slate-400">ID: {pacienteSeleccionadoAgenda.pacienteId || 'No disponible'}</p>
										</div>
									) : (
										<p className="mt-3 text-sm text-slate-500">Selecciona un paciente de la lista para continuar.</p>
									)}
								</div>

								<div className="rounded-2xl border border-slate-200 bg-white p-4">
									<p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Tipo de cita</p>
									<select
										name="tipoCita"
										value={form.tipoCita}
										onChange={handleFormChange}
										className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
									>
										<option value="Entrevista">Entrevista</option>
										<option value="Valoración">Valoración</option>
										<option value="Seguimiento">Seguimiento</option>
										<option value="Llamada">Llamada</option>
									</select>
								</div>
							</section>

							<section className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-4">
								<div className="flex items-center justify-between">
									<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Calendario</p>
									<h4 className="text-lg font-black capitalize text-slate-900">{calendarioMesActual.nombreMes}</h4>
								</div>

								<div className="grid grid-cols-7 gap-2">
									{DIAS_SEMANA_CORTO.map((diaSemana) => (
										<div key={`agenda-dia-${diaSemana}`} className="py-1 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
											{diaSemana}
										</div>
									))}

									{calendarioMesActual.celdas.map((celda) => {
										if (celda.tipo === 'vacio') {
											return <div key={celda.key} className="h-[62px]" />;
										}

										const baseClass = 'h-[62px] rounded-2xl border px-2 py-2 text-left transition';
										const className = celda.esPasada
											? `${baseClass} cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400`
											: celda.esSeleccionada
												? `${baseClass} border-[#7E1D3B] bg-[#7E1D3B] text-white shadow-sm`
												: `${baseClass} border-slate-200 bg-slate-50 text-slate-800 hover:border-[#7E1D3B]/50 hover:bg-rose-50`;

										return (
											<button
												key={celda.key}
												type="button"
												disabled={celda.esPasada}
												onClick={() => seleccionarDiaAgenda(celda.fechaString)}
												className={className}
											>
												<div className="text-lg font-black">{celda.dia}</div>
												{celda.esPasada ? (
													<div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]">PASADA</div>
												) : celda.esHoy ? (
													<div className={`mt-1 text-[10px] font-bold uppercase tracking-[0.2em] ${celda.esSeleccionada ? 'text-white/85' : 'text-[#7E1D3B]'}`}>
														HOY
													</div>
												) : null}
											</button>
										);
									})}
								</div>

								{form.fecha ? (
									<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
										<div className="flex items-center justify-between gap-3">
											<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Horario disponible</p>
											<p className="text-sm font-semibold text-slate-700">{formatFecha(`${form.fecha}T00:00:00`)}</p>
										</div>
										<div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
											{horariosAgenda.map((hora) => {
												const bloqueada = esHoraNoDisponible(hora);
												const activa = form.hora === hora;
												return (
													<button
														key={`agenda-hora-${hora}`}
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
								) : (
									<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
										Selecciona un día disponible para habilitar horarios.
									</div>
								)}
							</section>
						</div>

						<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 md:px-7">
							<button type="button" onClick={cerrarAgenda} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
							<button type="button" onClick={guardarAgenda} disabled={!agendaListaParaGuardar || savingAgenda} className="rounded-2xl bg-[#7E1D3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63162e] disabled:cursor-not-allowed disabled:opacity-60">{savingAgenda ? 'Guardando...' : 'Guardar cita'}</button>
						</div>

						{agendaMensaje ? (
							<div className={`border-t px-5 py-3 text-sm ${agendaMensajeTipo === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
								{agendaMensaje}
							</div>
					) : null}
				</div>
			</div>
		) : null}

		{registroOpen ? (
			<div className="fixed inset-0 z-50 flex animate-in fade-in items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm duration-200">
				<div className="flex max-h-[92vh] w-full max-w-2xl animate-in zoom-in-95 fade-in flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)] duration-200">
					<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Registro de llegada</p>
							<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Diagnóstico visual</h3>
							<p className="mt-1 text-sm text-slate-500">{citaSeleccionada ? getCitaNombre(citaSeleccionada) : 'Paciente'} - Registra la llegada con observaciones.</p>
						</div>
						<button onClick={cerrarRegistro} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
							<X size={20} />
						</button>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6">
						<div className="rounded-[28px] border border-slate-200 bg-emerald-50 p-4">
							<p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">Información de cita</p>
							<div className="mt-3 grid gap-2 text-sm">
								<div className="flex justify-between">
									<span className="text-slate-600">Paciente:</span>
									<span className="font-semibold text-slate-900">{citaSeleccionada ? getCitaNombre(citaSeleccionada) : '--'}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-600">Hora programada:</span>
									<span className="font-semibold text-slate-900">{citaSeleccionada ? formatHora(citaSeleccionada.fechaHoraProgramada) : '--:--'}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-600">Tipo de cita:</span>
									<span className="font-semibold text-slate-900">{citaSeleccionada ? citaSeleccionada.tipoAccion || 'Entrevista' : '--'}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-600">Profesional:</span>
									<span className="font-semibold text-slate-900">{citaSeleccionada ? citaSeleccionada.profesionalNombre || 'Admisiones' : '--'}</span>
								</div>
							</div>
						</div>

						<div className="rounded-[28px] border border-slate-200 bg-white p-4">
							<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Diagnóstico visual</p>
							<div className="mt-3 grid gap-3">
								<div>
									<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Observaciones iniciales</label>
									<textarea
										name="diagnosticoVisual"
										value={formRegistro.diagnosticoVisual}
										onChange={handleFormRegistroChange}
										rows={3}
										placeholder="Describe el estado general, presentación y comportamiento del paciente..."
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
									/>
								</div>
								<div>
									<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Observaciones adicionales</label>
									<textarea
										name="observaciones"
										value={formRegistro.observaciones}
										onChange={handleFormRegistroChange}
										rows={2}
										placeholder="Información relevante de la consulta..."
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
									/>
								</div>
								<div>
									<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Próximas acciones</label>
									<textarea
										name="proximas"
										value={formRegistro.proximas}
										onChange={handleFormRegistroChange}
										rows={2}
										placeholder="Pasos siguientes, estudios pendientes, etc..."
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 md:px-6">
						<div className="text-sm text-slate-500">
							{savingRegistro ? 'Guardando registro...' : 'Se marca la cita como confirmada.'}
						</div>
						<div className="flex gap-2">
							<button type="button" onClick={cerrarRegistro} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
							<button type="button" onClick={guardarRegistro} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Registrar llegada</button>
						</div>
					</div>

					{registroMensaje ? (
						<div className={`border-t px-5 py-3 text-sm ${registroMensajeTipo === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
							{registroMensaje}
						</div>
					) : null}
				</div>
			</div>
		) : null}
	</div>
);
};

export default AgendaCitas;
