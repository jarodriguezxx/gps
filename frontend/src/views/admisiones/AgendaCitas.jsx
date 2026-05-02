import React, { useEffect, useMemo, useState } from 'react';

import { CalendarDays, CheckCircle2, Clock3, Eye, LoaderCircle, Plus, Search, X } from 'lucide-react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';

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

const getCitaNombre = (cita) => cita?.pacienteNombre || cita?.nombreCompleto || cita?.nombre || 'Sin nombre';

const AgendaCitas = () => {
	const [citas, setCitas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	
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
	const [tabActiva, setTabActiva] = useState('citas'); // 'citas' o 'llamadas'
	const [llamadas, setLlamadas] = useState([]);
	const [filtroVista, setFiltroVista] = useState('hoy');
	const [filtroFechaPersonalizada, setFiltroFechaPersonalizada] = useState(todayDateString);
	const [form, setForm] = useState({
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

	useEffect(() => {
		const cargarDatos = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/seguimientos/tablas');
            if (!response.ok) throw new Error('Error al cargar datos');
            const data = await response.json();
            
            setCitas(Array.isArray(data?.citas) ? data.citas : []);
            setLlamadas(Array.isArray(data?.llamadas) ? data.llamadas : []); // Nueva tabla
        } catch (fetchError) {
            setError('No se pudo conectar con el backend.');
        } finally {
            setLoading(false);
        }
    };
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
		setAgendaOpen(true);
	};

	const cerrarAgenda = () => {
		setAgendaOpen(false);
		setAgendaMensaje('');
		setAgendaMensajeTipo('success');
		setFiltroVista('hoy');
		setFiltroFechaPersonalizada(todayDateString);
		setForm({
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
		setForm((prev) => ({ ...prev, [name]: value }));
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

		const fechaHoraProgramada = `${form.fecha}T${form.hora}:00`;
		const nuevaCitaLocal = {
			id: Date.now(),
			pacienteNombre: form.pacienteNombre.trim(),
			fechaHoraProgramada,
			tipoAccion: form.tipoCita,
			profesionalNombre: form.profesional,
			motivo: form.motivo,
			estadoSeguimiento: 'Pendiente',
		};

		try {
			setSavingAgenda(true);
			setCitas((prev) => [nuevaCitaLocal, ...prev]);
			setAgendaMensaje('Cita agendada correctamente.');
			setAgendaMensajeTipo('success');
			setSearchQuery(form.pacienteNombre.trim());
			cerrarAgenda();
		} catch (saveError) {
			console.error('Error al guardar agenda:', saveError);
			setAgendaMensaje('No se pudo guardar la cita.');
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

		try {
			setSavingRegistro(true);
			setCitas((prev) =>
				prev.map((cita) =>
					cita.id === citaSeleccionada.id
						? {
								...cita,
								estadoSeguimiento: 'Llegó',
								estadoAsistencia: 'Llegó',
								diagnosticoVisual: formRegistro.diagnosticoVisual,
								observacionesRegistro: formRegistro.observaciones,
								proximasCitas: formRegistro.proximas,
						  }
						: cita,
				),
			);
			setRegistroMensaje('Llegada registrada correctamente.');
			setRegistroMensajeTipo('success');
			cerrarRegistro();
		} catch (saveError) {
			console.error('Error al guardar registro:', saveError);
			setRegistroMensaje('No se pudo guardar el registro.');
			setRegistroMensajeTipo('error');
		} finally {
			setSavingRegistro(false);
		}
	};

	const marcarNoPresento = async (citaId) => {
		setCitas((prev) =>
			prev.map((cita) =>
				cita.id === citaId ? { ...cita, estadoSeguimiento: 'No se presentó', estadoAsistencia: 'No se presentó' } : cita,
			),
		);
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

															return (
																<tr key={cita.id} className="border-b border-slate-100 align-middle">
																	<td className="px-3 py-3 font-medium text-slate-700 capitalize">{formatDia(cita.fechaHoraProgramada)}</td>
																	<td className="px-3 py-3 font-medium text-slate-700">{formatFecha(cita.fechaHoraProgramada)}</td>
																	<td className="px-3 py-3 font-medium text-slate-700">{formatHora(cita.fechaHoraProgramada)}</td>
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
																					className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
																				>
																					<Eye size={14} />
																					Llegó
																				</button>
																				<button
																					type="button"
																					onClick={() => marcarNoPresento(cita.id)}
																					className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 transition hover:bg-rose-100"
																				>
																					No se presentó
																				</button>
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
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
					<div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]">
						<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
							<div>
								<p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Agenda de Citas</p>
								<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Agendar cita</h3>
								<p className="mt-1 text-sm text-slate-500">Captura los datos de la nueva cita antes de guardarla.</p>
							</div>
							<button onClick={cerrarAgenda} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
								<X size={20} />
							</button>
						</div>

						<div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6">
							<div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Paciente</p>
								<div className="mt-3 grid gap-3 sm:grid-cols-2">
									<div className="sm:col-span-2">
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Nombre del paciente</label>
										<input
											type="text"
											name="pacienteNombre"
											value={form.pacienteNombre}
											onChange={handleFormChange}
											placeholder="Escribe el nombre del paciente"
											className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
										/>
									</div>
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Fecha</label>
										<input name="fecha" type="date" value={form.fecha} onChange={handleFormChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
									</div>
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Hora</label>
										<input name="hora" type="time" value={form.hora} onChange={handleFormChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
									</div>
								</div>
							</div>

							<div className="rounded-[28px] border border-slate-200 bg-white p-4">
								<p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Detalles</p>
								<div className="mt-3 grid gap-3">
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Tipo de cita</label>
										<select name="tipoCita" value={form.tipoCita} onChange={handleFormChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15">
											<option value="Entrevista">Entrevista</option>
											<option value="Valoración">Valoración</option>
											<option value="Seguimiento">Seguimiento</option>
											<option value="Llamada">Llamada</option>
										</select>
									</div>
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Profesional</label>
										<input name="profesional" value={form.profesional} onChange={handleFormChange} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
									</div>
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Motivo</label>
										<textarea name="motivo" value={form.motivo} onChange={handleFormChange} rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
									</div>
									<div>
										<label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Notas</label>
										<textarea name="notas" value={form.notas} onChange={handleFormChange} rows={3} placeholder="Indicaciones adicionales" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15" />
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 md:px-6">
							<div className="text-sm text-slate-500">
								{savingAgenda ? 'Guardando cita...' : 'La cita se guardará en la agenda operativa.'}
							</div>
							<div className="flex gap-2">
								<button type="button" onClick={cerrarAgenda} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
								<button type="button" onClick={guardarAgenda} className="rounded-2xl bg-[#7E1D3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#63162e]">Guardar cita</button>
							</div>
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
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
				<div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]">
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
