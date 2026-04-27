import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Search, Sparkles } from 'lucide-react';
import InstitutionalHeader from '../../components/layout/InstitutionalHeader';
import PrimarySidebarActionButton from '../../components/buttons/PrimarySidebarActionButton';

const formatDateValue = (value) => {
	if (!value) return '--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '--';
	return date.toLocaleDateString('es-MX');
};

const hasValue = (value) => String(value ?? '').trim().length > 0;

const formatClave = (item) => {
	if (item?.claveExpediente) return String(item.claveExpediente);
	if (item?.folioExpediente) return String(item.folioExpediente);
	if (item?.id) return String(item.id).padStart(5, '0');
	return '--';
};

const getNombreProspecto = (item) => item?.nombreCompleto || item?.nombrePaciente || item?.nombre || '';

const formatTimeValue = (value) => {
	if (!value) return '--:--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '--:--';
	return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const buildPdfActionUrl = (path) => `http://localhost:4000${path}`;

const getTimelineTone = (seguimiento) => {
	const estado = String(seguimiento?.estadoSeguimiento || seguimiento?.estadoAsistencia || '').toLowerCase();
	if (estado.includes('lleg') || estado.includes('confirm')) return 'emerald';
	if (estado.includes('no se presentó') || estado.includes('no contestó') || estado.includes('no hubo respuesta')) return 'rose';
	if (estado.includes('espera') || estado.includes('pendiente')) return 'amber';
	return 'slate';
};

const buildDocumentosProspecto = (prospecto, detalleExpediente) => {
	if (!prospecto) {
		return [];
	}

	const documentosBackend = Array.isArray(detalleExpediente?.documentos) ? detalleExpediente.documentos : [];
	const documentosPdf = documentosBackend.map((doc) => ({
		nombre: doc.nombreArchivo || 'PDF socioeconomico',
		tipo: doc.tipo || 'PDF',
		estado: 'Adjunto',
		detalle: `Generado: ${formatDateValue(doc.generadoEn)}${doc.descargaUrl ? ' • Disponible para descarga' : ''}`,
		descargaUrl: doc.descargaUrl ? `http://localhost:4000${doc.descargaUrl}` : '',
		verUrl: doc.descargaUrl ? buildPdfActionUrl(doc.descargaUrl.replace('/descargar', '/ver')) : '',
		imprimirUrl: doc.descargaUrl ? buildPdfActionUrl(doc.descargaUrl.replace('/descargar', '/imprimir')) : '',
	}));

	const tieneSolicitante = !!prospecto.solicitante;
	const tieneDatosBasicos = hasValue(prospecto.nombreCompleto) && (hasValue(prospecto.telefonoContacto) || hasValue(prospecto.telefonoCasa));
	const tieneDatosClinicos = hasValue(prospecto.sustanciaConsumo) || hasValue(prospecto.edad) || hasValue(prospecto.estadoCivil);

	const documentosBase = [
		{
			nombre: 'Expediente base',
			tipo: 'Registro',
			estado: tieneDatosBasicos ? 'Adjunto' : 'Pendiente',
			detalle: tieneDatosBasicos
				? `Paciente: ${getNombreProspecto(prospecto) || 'Sin nombre'} • Tel: ${prospecto.telefonoContacto || prospecto.telefonoCasa || '--'}`
				: 'Faltan datos básicos de identificación o contacto.',
		},
		{
			nombre: 'Ficha de solicitante',
			tipo: 'Registro',
			estado: tieneSolicitante ? 'Adjunto' : 'Pendiente',
			detalle: tieneSolicitante
				? `${prospecto.solicitante?.nombre || 'Sin nombre'} • Tel: ${prospecto.solicitante?.telefono || prospecto.solicitante?.celular || '--'}`
				: 'Este prospecto no tiene solicitante vinculado.',
		},
		{
			nombre: 'Valoración diagnóstica',
			tipo: 'Registro clínico',
			estado: tieneDatosClinicos ? 'Adjunto' : 'Pendiente',
			detalle: tieneDatosClinicos
				? `Sustancia: ${prospecto.sustanciaConsumo || 'No especificada'} • Estado civil: ${prospecto.estadoCivil || '--'}`
				: 'Aún no hay datos clínicos suficientes para valoración.',
		},
	];

	return [...documentosPdf, ...documentosBase];
};

const buildNotasProspecto = (prospecto, detalleExpediente) => {
	if (!prospecto) {
		return [];
	}

	const notas = [];
	const nombre = getNombreProspecto(prospecto) || 'Prospecto sin nombre';

	notas.push(`Admisiones: expediente activo para ${nombre}. Clave interna ${formatClave(prospecto)}.`);

	if (prospecto.solicitante?.nombre) {
		notas.push(
			`Seguimiento: solicitante ${prospecto.solicitante.nombre} (${prospecto.solicitante.parentescoPaciente || 'parentesco no definido'}) con contacto ${prospecto.solicitante.telefono || prospecto.solicitante.celular || '--'}.`
		);
	}

	if (hasValue(prospecto.domicilioParticular) || hasValue(prospecto.origen)) {
		notas.push(`Contexto: origen ${prospecto.origen || '--'} y domicilio ${prospecto.domicilioParticular || '--'}.`);
	}

	if (hasValue(prospecto.sustanciaConsumo)) {
		notas.push(`Clínico: sustancia de consumo reportada ${prospecto.sustanciaConsumo}.`);
	}

	const seguimientos = Array.isArray(detalleExpediente?.seguimientos) ? detalleExpediente.seguimientos : [];
	if (seguimientos.length > 0) {
		const ultimo = seguimientos[0];
		notas.push(
			`Seguimiento actual: ${ultimo.estadoSeguimiento || '--'} (${ultimo.tipoAccion || '--'}) programado para ${formatDateValue(ultimo.fechaHoraProgramada)}.`
		);
	}

	if (notas.length === 0) {
		notas.push('No hay notas disponibles para el prospecto seleccionado.');
	}

	return notas;
};

const buildTimeline = (detalleExpediente) => {
	const seguimientos = Array.isArray(detalleExpediente?.seguimientos) ? detalleExpediente.seguimientos : [];

	return seguimientos.map((item) => ({
		id: item.id,
		fecha: item.fechaHoraProgramada,
		titulo: item.tipoAccion || 'Seguimiento',
		estado: item.estadoAsistencia || item.estadoSeguimiento || 'Sin estado',
		detalle: item.motivo || 'Sin motivo registrado',
		origen: item.origenLlamada,
		tone: getTimelineTone(item),
		diagnosticoVisual: item.diagnosticoVisual,
	}));
};

const ExpedienteAdmisiones = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [tab, setTab] = useState('general');
	const [busquedaExpediente, setBusquedaExpediente] = useState('');
	const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
	const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
	const [errorBusqueda, setErrorBusqueda] = useState('');
	const [mostrarResultados, setMostrarResultados] = useState(false);
	const [indiceResaltado, setIndiceResaltado] = useState(-1);
	const [prospectoSeleccionado, setProspectoSeleccionado] = useState(null);
	const [detalleExpediente, setDetalleExpediente] = useState(null);
	const [cargandoDetalleExpediente, setCargandoDetalleExpediente] = useState(false);
	const [errorDetalleExpediente, setErrorDetalleExpediente] = useState('');
	const isInicioActive = location.pathname === '/admisiones';
	const isExpedienteActive = location.pathname === '/admisiones/expediente';
	const isEstudioActive = location.pathname === '/admisiones/estudio-socioeconomico';
	const isValoracionActive = location.pathname === '/admisiones/valoracion-diagnostica';

	const seleccionarProspecto = (prospecto) => {
		setProspectoSeleccionado(prospecto);
		setBusquedaExpediente(getNombreProspecto(prospecto));
		setMostrarResultados(false);
	};

	useEffect(() => {
		const query = busquedaExpediente.trim();
		const controller = new AbortController();

		if (query.length < 2) {
			setResultadosBusqueda([]);
			setCargandoBusqueda(false);
			setErrorBusqueda('');
			setMostrarResultados(false);
			setIndiceResaltado(-1);
			return () => controller.abort();
		}

		const buscarProspectos = async () => {
			try {
				setCargandoBusqueda(true);
				setErrorBusqueda('');
				const response = await fetch(`http://localhost:4000/api/pacientes/estudio?query=${encodeURIComponent(query)}`, {
					signal: controller.signal,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || 'No se pudo consultar prospectos.');
				}

				const data = await response.json();
				const resultados = Array.isArray(data) ? data : [];
				setResultadosBusqueda(resultados);

				if (resultados.length === 1) {
					seleccionarProspecto(resultados[0]);
					setIndiceResaltado(0);
				} else {
					setMostrarResultados(true);
					setIndiceResaltado(resultados.length > 0 ? 0 : -1);
				}
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Error al buscar prospectos de expediente:', error);
					setErrorBusqueda('No se pudo consultar prospectos. Revisa backend o conexión.');
					setMostrarResultados(true);
				}
			} finally {
				setCargandoBusqueda(false);
			}
		};

		buscarProspectos();
		return () => controller.abort();
	}, [busquedaExpediente]);

	useEffect(() => {
		const pacienteId = prospectoSeleccionado?.id;
		const controller = new AbortController();

		if (!pacienteId) {
			setDetalleExpediente(null);
			setErrorDetalleExpediente('');
			setCargandoDetalleExpediente(false);
			return () => controller.abort();
		}

		const cargarDetalle = async () => {
			try {
				setCargandoDetalleExpediente(true);
				setErrorDetalleExpediente('');
				const response = await fetch(`http://localhost:4000/api/pacientes/${pacienteId}/expediente`, {
					signal: controller.signal,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || 'No se pudo cargar el expediente del paciente.');
				}

				const data = await response.json();
				setDetalleExpediente(data);
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Error al cargar detalle de expediente:', error);
					setDetalleExpediente(null);
					setErrorDetalleExpediente('No se pudo cargar el detalle del expediente del prospecto.');
				}
			} finally {
				setCargandoDetalleExpediente(false);
			}
		};

		cargarDetalle();
		return () => controller.abort();
	}, [prospectoSeleccionado?.id]);

	const limpiarBusqueda = () => {
		setBusquedaExpediente('');
		setResultadosBusqueda([]);
		setErrorBusqueda('');
		setMostrarResultados(false);
		setIndiceResaltado(-1);
		setProspectoSeleccionado(null);
		setDetalleExpediente(null);
		setErrorDetalleExpediente('');
	};

	const handleBusquedaKeyDown = (event) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setMostrarResultados(true);
			setIndiceResaltado((prev) => {
				const siguiente = prev + 1;
				return siguiente >= resultadosBusqueda.length ? 0 : siguiente;
			});
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			setMostrarResultados(true);
			setIndiceResaltado((prev) => {
				const anterior = prev - 1;
				return anterior < 0 ? resultadosBusqueda.length - 1 : anterior;
			});
			return;
		}

		if (event.key === 'Escape') {
			setMostrarResultados(false);
			return;
		}

		if (event.key === 'Enter' && resultadosBusqueda.length > 0) {
			event.preventDefault();
			const indiceObjetivo = indiceResaltado >= 0 ? indiceResaltado : 0;
			seleccionarProspecto(resultadosBusqueda[indiceObjetivo]);
		}
	};

	const tarjetasGeneral = useMemo(() => {
		if (!prospectoSeleccionado) {
			return [
				{ label: 'Paciente', value: 'Sin selección' },
				{ label: 'Clave', value: '--' },
				{ label: 'Ingreso', value: '--' },
				{ label: 'Estado', value: 'Sin selección' },
			];
		}

		return [
			{ label: 'Paciente', value: getNombreProspecto(prospectoSeleccionado) || 'Sin nombre' },
			{ label: 'Clave', value: formatClave(prospectoSeleccionado) },
			{ label: 'Ingreso', value: formatDateValue(prospectoSeleccionado.fechaIngreso || prospectoSeleccionado.createdAt || prospectoSeleccionado.fechaAtencion || prospectoSeleccionado.fechaRegistro) },
			{ label: 'Estado', value: prospectoSeleccionado.estadoExpediente || prospectoSeleccionado.estadoSeguimiento || 'En valoración' },
		];
	}, [prospectoSeleccionado]);

	const documentosProspecto = useMemo(() => buildDocumentosProspecto(prospectoSeleccionado, detalleExpediente), [prospectoSeleccionado, detalleExpediente]);
	const notasProspecto = useMemo(() => buildNotasProspecto(prospectoSeleccionado, detalleExpediente), [prospectoSeleccionado, detalleExpediente]);
	const timelineProspecto = useMemo(() => buildTimeline(detalleExpediente), [detalleExpediente]);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<div className="mx-auto max-w-[1600px] p-4 md:p-6">
				<header className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
					<InstitutionalHeader
						title="Expediente de admisiones"
						moduleLabel="Documento maestro del área"
						sessionValue="Admisiones"
						badge={<FileText size={16} className="text-[#7E1D3B]" />}
					/>
				</header>

				<main className="space-y-5">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner">
						<PrimarySidebarActionButton
							label="Volver a admisiones"
							onClick={() => navigate('/admisiones')}
							icon={<ArrowRight size={18} />}
						/>
						<button type="button" onClick={() => navigate('/admisiones')} className={`mb-3 w-full rounded-xl px-3 py-3 text-sm font-semibold shadow-md transition ${isInicioActive ? 'bg-[#7E1D3B] text-white hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Inicio
						</button>
						<button type="button" onClick={() => navigate('/admisiones/expediente')} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${isExpedienteActive ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Expediente
						</button>
						<button type="button" onClick={() => navigate('/admisiones/estudio-socioeconomico')} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${isEstudioActive ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Estudio socioeconómico
						</button>
						<button type="button" onClick={() => navigate('/admisiones/valoracion-diagnostica')} className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition ${isValoracionActive ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
							Valoración diagnóstica
						</button>
					</aside>

					<div className="space-y-5">
						<section className="rounded-[24px] border border-slate-200 bg-slate-100/70 p-4 shadow-sm md:p-5">
							<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-start">
								<div
									className="relative w-full md:max-w-md"
									onBlur={() => {
										window.setTimeout(() => setMostrarResultados(false), 120);
									}}
								>
									<Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
									<input
										type="text"
										value={busquedaExpediente}
										onChange={(event) => {
											const value = event.target.value;
											setBusquedaExpediente(value);
											if (prospectoSeleccionado && value !== getNombreProspecto(prospectoSeleccionado)) {
												setProspectoSeleccionado(null);
											}
										}}
										onKeyDown={handleBusquedaKeyDown}
										onFocus={() => {
											if (busquedaExpediente.trim().length >= 2) {
												setMostrarResultados(true);
											}
										}}
										placeholder="Buscar expediente, nombre o clave..."
										className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
									/>

									{mostrarResultados && busquedaExpediente.trim().length >= 2 ? (
										<div className="absolute left-0 right-0 z-10 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
											<div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Resultados de prospectos</div>
											{cargandoBusqueda ? <p className="px-4 py-3 text-sm text-slate-500">Buscando prospectos...</p> : null}
											{errorBusqueda ? <p className="px-4 py-3 text-sm text-rose-700">{errorBusqueda}</p> : null}
											{!cargandoBusqueda && !errorBusqueda && resultadosBusqueda.length === 0 ? (
												<p className="px-4 py-3 text-sm text-slate-500">No se encontraron coincidencias.</p>
											) : null}
											{!cargandoBusqueda && resultadosBusqueda.length > 0 ? (
												<ul className="max-h-64 overflow-y-auto">
													{resultadosBusqueda.map((item, index) => (
														<li key={item.id || `${getNombreProspecto(item)}-${index}`}>
															<button
																type="button"
																onMouseEnter={() => setIndiceResaltado(index)}
																onClick={() => seleccionarProspecto(item)}
																className={`w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 ${
																	indiceResaltado === index ? 'bg-[#7E1D3B]/10' : 'bg-white hover:bg-slate-50'
																}`}
															>
																<p className="text-sm font-semibold text-slate-900">{getNombreProspecto(item) || 'Sin nombre'}</p>
																<p className="text-xs text-slate-500">Clave: {formatClave(item)} • Tel: {item.telefonoContacto || item.telefono || item.solicitante?.telefono || '--'}</p>
															</button>
														</li>
													))}
												</ul>
											) : null}
										</div>
									) : null}
								</div>
								<button
									type="button"
									onClick={limpiarBusqueda}
									className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
								>
									Limpiar búsqueda
								</button>
							</div>
							{prospectoSeleccionado ? (
								<p className="mt-3 text-sm text-slate-600">
									Prospecto seleccionado: <span className="font-semibold text-slate-900">{getNombreProspecto(prospectoSeleccionado)}</span>
								</p>
							) : (
								<p className="mt-3 text-sm text-slate-500">Escribe al menos 2 letras para autocompletar prospectos.</p>
							)}
							{cargandoDetalleExpediente ? <p className="mt-2 text-xs text-slate-500">Cargando detalle del expediente...</p> : null}
							{errorDetalleExpediente ? <p className="mt-2 text-xs text-rose-700">{errorDetalleExpediente}</p> : null}
						</section>

						<section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
							<div className="mb-3 flex items-center justify-between gap-3">
								<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Navegación</p>
								<p className="text-xs font-semibold text-slate-500">Pestaña activa: {tab === 'general' ? 'General' : tab === 'docs' ? 'Documentos' : 'Notas'}</p>
							</div>
							<div className="grid gap-2 md:grid-cols-3">
								<button type="button" onClick={() => setTab('general')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'general' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>General</button>
								<button type="button" onClick={() => setTab('docs')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'docs' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Documentos</button>
								<button type="button" onClick={() => setTab('notes')} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === 'notes' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Notas entre áreas</button>
							</div>
						</section>

						{tab === 'general' && (
							<>
								

								<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
									{tarjetasGeneral.map((item) => (
										<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
											<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
											<p className="mt-3 text-2xl font-black text-slate-900">{item.value}</p>
										</article>
									))}
								</section>
							</>
						)}

						{tab === 'docs' && (
							<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
								<div className="mb-4 flex items-center justify-between gap-3">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Documentos</p>
										<h3 className="text-2xl font-black text-slate-900">PDFs y registros del expediente</h3>
									</div>
									<FileText className="text-[#7E1D3B]" size={22} />
								</div>
								{!prospectoSeleccionado ? (
									<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
										Selecciona un prospecto en el buscador para cargar sus documentos reales.
									</div>
								) : null}
								<div className="space-y-3">
									{documentosProspecto.map((doc) => (
										<div key={doc.nombre} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-sm font-black text-slate-900">{doc.nombre}</p>
													<p className="text-xs uppercase tracking-[0.2em] text-slate-400">{doc.tipo}</p>
												</div>
												<span className={`rounded-full px-2 py-1 text-xs font-semibold ${doc.estado === 'Adjunto' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{doc.estado}</span>
											</div>
											<p className="mt-2 text-sm leading-6 text-slate-600">{doc.detalle}</p>
											<div className="mt-3 flex flex-wrap gap-2">
												{doc.verUrl ? (
													<a
														href={doc.verUrl}
														target="_blank"
														rel="noreferrer"
														className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
													>
														Ver inline
													</a>
												) : null}
												{doc.imprimirUrl ? (
													<a
														href={doc.imprimirUrl}
														target="_blank"
														rel="noreferrer"
														className="inline-flex rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
													>
														Imprimir
													</a>
												) : null}
												{doc.descargaUrl ? (
													<a
														href={doc.descargaUrl}
														target="_blank"
														rel="noreferrer"
														className="inline-flex rounded-lg border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-3 py-1.5 text-xs font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12"
													>
														Descargar PDF
													</a>
												) : null}
											</div>
										</div>
									))}
									{prospectoSeleccionado && documentosProspecto.length === 0 ? (
										<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
											No hay documentos para mostrar en este prospecto.
										</div>
									) : null}
								</div>
							</section>
						)}

						{tab === 'notes' && (
							<>
								<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
									<div className="mb-4 flex items-center justify-between gap-3">
										<div>
											<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Notas entre áreas</p>
											<h3 className="text-2xl font-black text-slate-900">Seguimiento cruzado</h3>
										</div>
										<Sparkles className="text-[#7E1D3B]" size={22} />
									</div>
									{!prospectoSeleccionado ? (
										<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
											Selecciona un prospecto para ver sus notas reales entre áreas.
										</div>
									) : null}
									<div className="space-y-3">
										{notasProspecto.map((nota) => (
											<div key={nota} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700">{nota}</div>
										))}
										{prospectoSeleccionado && notasProspecto.length === 0 ? (
											<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
												No hay notas para mostrar en este prospecto.
											</div>
										) : null}
									</div>
								</section>
							</>
						)}

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Línea de tiempo</p>
									<h3 className="text-2xl font-black text-slate-900">Seguimientos del expediente</h3>
								</div>
								<Sparkles className="text-[#7E1D3B]" size={22} />
							</div>
							{!prospectoSeleccionado ? (
								<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
									Selecciona un prospecto para ver su línea de tiempo.
								</div>
							) : timelineProspecto.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
									Este expediente todavía no tiene seguimientos registrados.
								</div>
							) : (
								<div className="relative space-y-4 pl-4 before:absolute before:left-[10px] before:top-1 before:h-full before:w-px before:bg-slate-200">
									{timelineProspecto.map((item) => (
										<article key={item.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
											<span className={`absolute -left-[18px] top-5 h-4 w-4 rounded-full border-4 border-white ${item.tone === 'emerald' ? 'bg-emerald-500' : item.tone === 'rose' ? 'bg-rose-500' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
											<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
												<div>
													<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{formatDateValue(item.fecha)} • {formatTimeValue(item.fecha)}</p>
													<h4 className="mt-1 text-lg font-black text-slate-900">{item.titulo}</h4>
												</div>
												<span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone === 'emerald' ? 'bg-emerald-100 text-emerald-800' : item.tone === 'rose' ? 'bg-rose-100 text-rose-800' : item.tone === 'amber' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'}`}>
													{item.estado}
												</span>
											</div>
											<p className="mt-2 text-sm leading-6 text-slate-600">{item.detalle}</p>
											{item.diagnosticoVisual ? (
												<p className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
													Diagnóstico visual: {item.diagnosticoVisual}
												</p>
											) : null}
										</article>
									))}
								</div>
							)}
						</section>

						<section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
							<div className="mb-4 flex items-center justify-between gap-3">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Acción rápida</p>
									<h3 className="text-2xl font-black text-slate-900">Abrir módulos del expediente</h3>
								</div>
								<Sparkles className="text-[#7E1D3B]" size={22} />
							</div>
							<div className="grid gap-3 md:grid-cols-3">
								<button type="button" onClick={() => navigate('/admisiones/estudio-socioeconomico')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Abrir estudio socioeconómico</button>
								<button type="button" onClick={() => navigate('/admisiones/valoracion-diagnostica')} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Abrir valoración diagnóstica</button>
								<button type="button" onClick={() => navigate('/admisiones')} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Volver a inicio de admisiones</button>
							</div>
						</section>
					</div>
				</div>
				</main>
			</div>
		</div>
	);
};

export default ExpedienteAdmisiones;
