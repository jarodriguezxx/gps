import React, { useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, CalendarDays, CheckCircle2, Clock3, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import InstitutionalHeader from '../../components/layout/InstitutionalHeader';
import PrimarySidebarActionButton from '../../components/buttons/PrimarySidebarActionButton';

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

const barras = [
	{ label: 'Lun', valor: 42 },
	{ label: 'Mar', valor: 58 },
	{ label: 'Mié', valor: 50 },
	{ label: 'Jue', valor: 72 },
	{ label: 'Vie', valor: 65 },
	{ label: 'Sáb', valor: 35 },
];

const diasSemanaCalendario = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const padNumero = (valor) => String(valor).padStart(2, '0');

const toInputDate = (date) => `${date.getFullYear()}-${padNumero(date.getMonth() + 1)}-${padNumero(date.getDate())}`;

const formatAgendaDate = (value) => {
	if (!value) return '--';
	const date = new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return '--';
	return date.toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long' });
};

const todayDateString = toInputDate(new Date());


const AdmisionesInicio = ({ onOpenEstudio }) => {
	const navigate = useNavigate();
	const location = useLocation();
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
	const [accionMensaje, setAccionMensaje] = useState('');
	const [accionMensajeTipo, setAccionMensajeTipo] = useState('success');
	const [actualizandoSeguimientoId, setActualizandoSeguimientoId] = useState(null);
	const [diagnosticoModalAbierto, setDiagnosticoModalAbierto] = useState(false);
	const [citaDiagnosticoObjetivoId, setCitaDiagnosticoObjetivoId] = useState(null);
	const [diagnosticoVisualTexto, setDiagnosticoVisualTexto] = useState('');
	const [diagnosticoVisualError, setDiagnosticoVisualError] = useState('');
	const [mesCalendario, setMesCalendario] = useState(() => {
		const hoy = new Date();
		return { year: hoy.getFullYear(), month: hoy.getMonth() };
	});

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

	const formatHora = (fechaIso) => {
		if (!fechaIso) return '--:--';
		const date = new Date(fechaIso);
		if (Number.isNaN(date.getTime())) return '--:--';
		return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
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

	const agendaResumen = useMemo(() => ({
		total: citasHoy.length,
		proxima: citasHoy[0] || null,
	}), [citasHoy]);

	const puedeIrMesAnterior = mesCalendario.year > new Date().getFullYear() || (mesCalendario.year === new Date().getFullYear() && mesCalendario.month > new Date().getMonth());

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
				const response = await fetch(`http://localhost:4000/api/pacientes/estudio?query=${encodeURIComponent(nombre)}`, {
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
			const response = await fetch('http://localhost:4000/api/seguimientos/citas', {
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

	const openEstudio = () => {
		if (onOpenEstudio) {
			onOpenEstudio();
			return;
		}
		navigate('/admisiones/estudio-socioeconomico');
	};

	const abrirModalDiagnostico = (citaId) => {
		const cita = citasHoy.find((item) => item.id === citaId);
		setCitaDiagnosticoObjetivoId(citaId);
		setDiagnosticoVisualTexto(cita?.diagnosticoVisual || '');
		setDiagnosticoVisualError('');
		setDiagnosticoModalAbierto(true);
	};

	const cerrarModalDiagnostico = () => {
		setDiagnosticoModalAbierto(false);
		setCitaDiagnosticoObjetivoId(null);
		setDiagnosticoVisualTexto('');
		setDiagnosticoVisualError('');
	};

	const confirmarLlegadaConDiagnostico = async () => {
		if (!String(diagnosticoVisualTexto || '').trim()) {
			setDiagnosticoVisualError('Captura el diagnóstico visual para registrar llegada.');
			return;
		}

		try {
			const response = await fetch(`http://localhost:4000/api/seguimientos/${citaDiagnosticoObjetivoId}/asistencia`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					estadoAsistencia: 'Llegó',
					diagnosticoVisual: diagnosticoVisualTexto.trim(),
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'No se pudo registrar la llegada.');
			}

			await cargarTablas();
			cerrarModalDiagnostico();
		} catch (error) {
			console.error('Error al registrar llegada con diagnóstico visual:', error);
			setDiagnosticoVisualError('No se pudo registrar la llegada. Revisa backend o conexión.');
		}
	};

	const marcarNoPresentoCita = async (citaId) => {
		try {
			const response = await fetch(`http://localhost:4000/api/seguimientos/${citaId}/asistencia`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					estadoAsistencia: 'No se presentó',
					diagnosticoVisual: '',
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'No se pudo registrar inasistencia.');
			}

			await cargarTablas();
		} catch (error) {
			console.error('Error al registrar no se presentó:', error);
			setAccionMensaje('No se pudo actualizar asistencia de la cita.');
			setAccionMensajeTipo('error');
		}
	};

	const actualizarEstadoSeguimiento = async (id, nuevoEstado, tipoTabla) => {
		if (actualizandoSeguimientoId) {
			return;
		}

		try {
			setActualizandoSeguimientoId(id);
			setAccionMensaje('');
			setAccionMensajeTipo('success');

			const response = await fetch(`http://localhost:4000/api/seguimientos/${id}/estado`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ estadoSeguimiento: nuevoEstado }),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'No se pudo actualizar el estado.');
			}

			if (tipoTabla === 'citas') {
				setCitasHoy((prev) => prev.map((item) => (item.id === id ? { ...item, estadoSeguimiento: nuevoEstado } : item)));
			} else {
				setSeguimiento((prev) => prev.map((item) => (item.id === id ? { ...item, estadoSeguimiento: nuevoEstado } : item)));
			}

			setAccionMensaje(`Estado actualizado: ${nuevoEstado}.`);
			setAccionMensajeTipo('success');
		} catch (error) {
			console.error('Error al actualizar estado de seguimiento:', error);
			setAccionMensaje('No se pudo actualizar el estado. Revisa backend o conexión.');
			setAccionMensajeTipo('error');
		} finally {
			setActualizandoSeguimientoId(null);
		}
	};

	const obtenerOrigenLlamada = (item) => {
		const origenExplicito = String(item?.origenLlamada || '').toUpperCase();
		if (origenExplicito === 'PROSPECTO' || origenExplicito === 'NOSOTROS') {
			return origenExplicito;
		}

		const estado = String(item?.estadoSeguimiento || '').toLowerCase();
		if (estado.includes('solicitada por el prospecto') || estado.includes('solicitada por el paciente')) {
			return 'PROSPECTO';
		}

		if (estado.includes('programada por nosotros')) {
			return 'NOSOTROS';
		}

		return 'NOSOTROS';
	};

	const obtenerAccionesLlamada = (item) => {
		const origen = obtenerOrigenLlamada(item);

		if (origen === 'PROSPECTO') {
			return [
				{ label: 'Llamó', estado: 'Llamó', clase: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' },
				{ label: 'No hubo respuesta', estado: 'No hubo respuesta', clase: 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100' },
			];
		}

		return [
			{ label: 'Llamada hecha', estado: 'Llamada hecha', clase: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100' },
			{ label: 'No contestó', estado: 'No contestó', clase: 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100' },
		];
	};

	const goInicio = () => navigate('/admisiones');
	const isInicioActive = location.pathname === '/admisiones';
	const isExpedienteActive = location.pathname === '/admisiones/expediente';
	const isEstudioActive = location.pathname === '/admisiones/estudio-socioeconomico';
	const isValoracionActive = location.pathname === '/admisiones/valoracion-diagnostica';
	const headerActions = (
		<div className="flex items-center gap-3">
			{/* Botón de Alertas */}
			<button className="relative p-2 text-slate-400 transition-colors hover:text-[#7E1D3B]">
				<Bell size={22} />
				<span className="absolute right-1 top-1 h-2 w-2 rounded-full border-2 border-white bg-rose-500"></span>
			</button>
			
			{/* Botón de Agenda */}
			<button 
				onClick={abrirAgenda}
				className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#63162e]"
			>
				<CalendarDays size={18} />
				Agendar cita
			</button>
		</div>
	);
	return (
	<div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] p-4 md:p-6">
        
        {/* REUTILIZACIÓN DEL HEADER */}
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <InstitutionalHeader 
            sessionValue="Admisiones" // Aquí iría el nombre del usuario logueado
            actions={headerActions} // Pasamos los botones como props
          />
        </header>
				<main className="space-y-5">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
					
						<button
							onClick={goInicio}
							className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${
								isInicioActive
									? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Inicio
						</button>
						<button
							onClick={() => navigate('/admisiones/expediente')}
							className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${
								isExpedienteActive
									? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Expediente
						</button>
						<button
							onClick={openEstudio}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isEstudioActive
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Estudio socioeconómico
						</button>
						<button
							onClick={() => navigate('/admisiones/valoracion-diagnostica')}
							className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${
								isValoracionActive
									? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
									: 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
							}`}
						>
							Llamada inicial
						</button>

						<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Indicadores</p>
							<p className="mt-2 text-3xl font-black text-[#7E1D3B]">78%</p>
							<p className="text-xs text-slate-500">Tasa de conversión semanal</p>
						</div>
					</aside>
					<div className="space-y-5">
							

							<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
								{[
										{ label: 'Atenciones hoy', value: String(resumen.atencionesHoy), tone: 'emerald' },
										{ label: 'Pacientes nuevos', value: String(resumen.pacientesNuevos), tone: 'sky' },
										{ label: 'Pendientes', value: String(resumen.pendientes), tone: 'amber' },
										{ label: 'Seguimiento', value: String(resumen.seguimiento), tone: 'rose' },
								].map((item) => (
									<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
										<p className="text-xs uppercase tracking-widest text-slate-500">{item.label}</p>
										<p className={`mt-2 text-3xl font-black ${item.tone === 'emerald' ? 'text-emerald-700' : item.tone === 'sky' ? 'text-sky-700' : item.tone === 'amber' ? 'text-amber-700' : 'text-[#7E1D3B]'}`}>
											{item.value}
										</p>
									</article>
								))}
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

						

							<section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
								<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<h2 className="text-2xl font-black">Citas del Día</h2>
									<div className="flex gap-2">
										<button onClick={abrirAgenda} className="rounded-lg bg-[#7E1D3B] px-3 py-2 text-sm font-semibold text-white hover:bg-[#63162e]">
											Agendar Cita
										</button>
										<button className="rounded-lg border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-2 text-sm font-semibold text-[#7E1D3B] hover:bg-[#7E1D3B]/12">
											Agregar Paciente
										</button>
									</div>
								</div>
								{accionMensaje ? (
									<p className={`mb-3 rounded-lg px-3 py-2 text-sm ${accionMensajeTipo === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-800'}`}>
										{accionMensaje}
									</p>
								) : null}

								<div className="overflow-x-auto">
									{errorTablas && (
										<p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorTablas}</p>
									)}
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
												{loadingTablas ? (
													<tr>
														<td className="px-3 py-3 text-slate-500" colSpan={6}>Cargando citas...</td>
													</tr>
												) : citasHoy.length === 0 ? (
													<tr>
														<td className="px-3 py-3 text-slate-500" colSpan={6}>No hay citas registradas en la BD.</td>
													</tr>
												) : citasHoy.map((item) => (
												<tr key={item.id} className="border-b border-slate-100">
													<td className="px-3 py-3 font-medium text-slate-700">{formatHora(item.fechaHoraProgramada)}</td>
													<td className="px-3 py-3">{item.pacienteNombre}</td>
													<td className="px-3 py-3">{item.tipoAccion}</td>
													<td className="px-3 py-3">Sin asignar</td>
													<td className="px-3 py-3">
														<span
															className={`rounded-full px-2 py-1 text-xs font-semibold ${estadoClass(item.estadoSeguimiento)}`}
														>
															{formatEstado(item.estadoSeguimiento) || 'Sin estado'}
														</span>
													</td>
													<td className="px-3 py-3">
															<button
																type="button"
																onClick={() => actualizarEstadoSeguimiento(item.id, 'Llegó', 'citas')}
																disabled={actualizandoSeguimientoId === item.id}
																className="mr-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
															>
																Llegó
															</button>
															<button
																type="button"
																onClick={() => actualizarEstadoSeguimiento(item.id, 'No se presentó', 'citas')}
																disabled={actualizandoSeguimientoId === item.id}
																className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
															>
																No se presentó
															</button>
													</td>
												</tr>
												))}
										</tbody>
									</table>
								</div>
							</section>

							<section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
								<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<h2 className="text-2xl font-black">Agenda creada</h2>
										<p className="text-sm text-slate-500">Vista rápida de la programación hecha desde admisiones.</p>
									</div>
									<div className="rounded-full bg-[#7E1D3B]/10 px-3 py-1 text-xs font-semibold text-[#7E1D3B]">
										{agendaResumen.total} cita{agendaResumen.total === 1 ? '' : 's'} creada{agendaResumen.total === 1 ? '' : 's'}
									</div>
								</div>
								{citasHoy.length === 0 ? (
									<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
										Aquí aparecerán las citas registradas en BD.
									</div>
								) : (
									<div className="grid gap-3 lg:grid-cols-2">
										{citasHoy.map((cita) => (
											<article key={cita.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
												<div className="flex items-start justify-between gap-3">
													<div>
														<p className="text-lg font-black text-slate-900">{cita.pacienteNombre}</p>
														<p className="text-sm text-slate-500">{cita.tipoAccion}</p>
													</div>
													<span className="rounded-full bg-[#7E1D3B]/10 px-3 py-1 text-xs font-semibold text-[#7E1D3B]">
														{formatAgendaDate(String(cita.fechaHoraProgramada || '').slice(0, 10))}
													</span>
												</div>
												<div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
													<div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
														<Clock3 size={16} className="text-[#7E1D3B]" />
														{formatHora(cita.fechaHoraProgramada)}
													</div>
													<div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2">
														<CheckCircle2 size={16} className={cita.estadoAsistencia === 'Llegó' ? 'text-emerald-600' : cita.estadoAsistencia === 'No se presentó' ? 'text-rose-600' : 'text-amber-600'} />
														{cita.estadoAsistencia || cita.estadoSeguimiento || 'Pendiente'}
													</div>
												</div>
												<div className="mt-3 flex gap-2">
													<button
														type="button"
														onClick={() => abrirModalDiagnostico(cita.id)}
														disabled={cita.estadoAsistencia === 'Llegó'}
														className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-55"
													>
														Ya llegó
													</button>
													<button
														type="button"
														onClick={() => marcarNoPresentoCita(cita.id)}
														disabled={cita.estadoAsistencia === 'No se presentó'}
														className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-55"
													>
														No se presentó
													</button>
												</div>
												{(cita.estadoAsistencia === 'Llegó' || cita.estadoSeguimiento === 'Llegó') && cita.diagnosticoVisual ? (
													<p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
														Diagnóstico visual: {cita.diagnosticoVisual}
													</p>
												) : null}
											</article>
										))}
									</div>
								)}
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
												<th className="px-3 py-2 font-semibold">Acción</th>
											</tr>
										</thead>
										<tbody>
											{loadingTablas ? (
												<tr>
													<td className="px-3 py-3 text-slate-500" colSpan={7}>Cargando llamadas...</td>
												</tr>
											) : seguimiento.length === 0 ? (
												<tr>
													<td className="px-3 py-3 text-slate-500" colSpan={7}>No hay llamadas de seguimiento registradas en la BD.</td>
												</tr>
											) : seguimiento.map((item) => {
													const accionesLlamada = obtenerAccionesLlamada(item);
													return (
												<tr key={item.id} className="border-b border-slate-100">
													<td className="px-3 py-3">{item.pacienteNombre}</td>
													<td className="px-3 py-3">{item.pacienteTelefono || '--'}</td>
													<td className="px-3 py-3">{formatFecha(item.fechaHoraProgramada)}</td>
													<td className="px-3 py-3">{item.motivo || '--'}</td>
													<td className="px-3 py-3">
														<span
															className={`rounded-full px-2 py-1 text-xs font-semibold ${estadoClass(item.estadoSeguimiento)}`}
														>
															{formatEstado(item.estadoSeguimiento) || 'Sin estado'}
														</span>
													</td>
													<td className="px-3 py-3">{formatFecha(item.fechaHoraProgramada)}</td>
													<td className="px-3 py-3">
														{accionesLlamada.map((accion, index) => (
															<button
																key={`${item.id}-${accion.estado}`}
																type="button"
																onClick={() => actualizarEstadoSeguimiento(item.id, accion.estado, 'llamadas')}
																disabled={actualizandoSeguimientoId === item.id}
																className={`${index === 0 ? 'mr-2 ' : ''}rounded-md border px-2 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${accion.clase}`}
															>
																{accion.label}
															</button>
														))}
													</td>
												</tr>
													);
											})}
										</tbody>
									</table>
								</div>
							</section>
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
									{agendaMensaje ? (
										<span className={`rounded-full px-3 py-2 ${agendaMensajeTipo === 'error' ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'}`}>
											{agendaMensaje}
										</span>
									) : <span></span>}
								</div>
								<div className="flex gap-2">
									<button type="button" onClick={() => setAgendaAbierta(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</button>
									<button type="button" onClick={guardarAgenda} className="rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#63162e]">Guardar cita</button>
								</div>
							</div>
						</div>
					</div>
				) : null}

				{diagnosticoModalAbierto ? (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
						<div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
							<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Control de llegada</p>
									<h3 className="text-xl font-black text-slate-900">Registrar llegada con diagnóstico visual</h3>
									<p className="mt-1 text-sm text-slate-500">Captura este dato al momento de confirmar que el paciente llegó.</p>
								</div>
								<button onClick={cerrarModalDiagnostico} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
									<X size={20} />
								</button>
							</div>
							<div className="px-5 py-5 md:px-6">
								<label className="block space-y-2">
									<span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Diagnóstico visual</span>
									<textarea
										value={diagnosticoVisualTexto}
										onChange={(event) => {
											setDiagnosticoVisualTexto(event.target.value);
											if (diagnosticoVisualError) {
												setDiagnosticoVisualError('');
											}
										}}
										rows={6}
										className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
										placeholder="Describe observaciones visuales relevantes al momento de llegada..."
									/>
								</label>
								{diagnosticoVisualError ? (
									<p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{diagnosticoVisualError}</p>
								) : null}
							</div>
							<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 md:px-6">
								<button type="button" onClick={cerrarModalDiagnostico} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</button>
								<button type="button" onClick={confirmarLlegadaConDiagnostico} className="rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#63162e]">Confirmar llegada</button>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default AdmisionesInicio;