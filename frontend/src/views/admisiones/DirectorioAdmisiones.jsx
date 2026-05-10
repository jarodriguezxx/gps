import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	ArrowRight,
	AlertTriangle,
	Briefcase,
	ChevronDown,
	ChevronUp,
	MapPin,
	Phone,
	Search,
	User,
	UserPlus,
	Users,
} from 'lucide-react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';
import { API_BASE } from '../../config/api';

const getEstadoPaciente = (item) => String(item?.estadoPaciente || item?.estado || '').toUpperCase();

const getNombrePaciente = (item) => item?.nombreCompleto || item?.nombrePaciente || item?.nombre || 'Sin nombre registrado';

const getFolio = (item) => {
	if (!item) return 'S/F';
	// If patient has an official clavePaciente (ingresado), show it as folio.
	if (item?.clavePaciente) return String(item.clavePaciente);
	// Otherwise fall back to MK-<id> for prospectos or items with id
	if (!item?.id) return 'S/F';
	return `MK-${String(item.id).padStart(4, '0')}`;
};

const getResponsableName = (item) => {
	// Try several common shapes for the solicitante/solicitantename
	if (!item) return 'No registrado';
	if (item.solicitanteNombre) return item.solicitanteNombre;
	if (item.solicitante?.nombres || item.solicitante?.apellidoPaterno || item.solicitante?.apellidoMaterno) {
		return `${item.solicitante?.nombres || ''} ${item.solicitante?.apellidoPaterno || ''} ${item.solicitante?.apellidoMaterno || ''}`.trim();
	}
	if (item.solicitante?.nombreCompleto) return item.solicitante.nombreCompleto;
	if (item.nombreSolicitante) return item.nombreSolicitante;
	return 'No registrado';
};

const formatDateShort = (value) => {
	if (!value) return '';
	try {
		return new Date(value).toLocaleDateString('es-MX');
	} catch {
		return String(value);
	}
};

const DirectorioAdmisiones = () => {
	const navigate = useNavigate();
	const [tabActiva, setTabActiva] = useState('activos');
	const [busqueda, setBusqueda] = useState('');
	const [pacientes, setPacientes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [expandidoId, setExpandidoId] = useState(null);

	useEffect(() => {
		const fetchPacientes = async () => {
			setLoading(true);
			setError('');
			try {
				const response = await fetch(`${API_BASE}/pacientes`);
				if (!response.ok) {
					throw new Error('No se pudieron cargar los expedientes.');
				}

				const data = await response.json();
				setPacientes(Array.isArray(data) ? data : []);
			} catch (fetchError) {
				console.error('Error al cargar directorio de admisiones:', fetchError);
				setError('No se pudo conectar con el backend para cargar los expedientes.');
			} finally {
				setLoading(false);
			}
		};

		fetchPacientes();
	}, []);

	const toggleExpandir = (id) => {
		setExpandidoId((prev) => (prev === id ? null : id));
	};

	const pacientesFiltrados = useMemo(() => {
		const termino = busqueda.trim().toLowerCase();

		const base = pacientes.filter((item) => {
			const estado = getEstadoPaciente(item);
			if (tabActiva === 'activos') {
				return estado === 'INGRESADO' || estado === 'EGRESO';
			}
			if (tabActiva === 'prospectos') {
				return estado === 'PROSPECTO';
			}
			return estado === 'DENEGADO';
		});

		if (!termino) return base;

		return base.filter((item) => {
			const nombre = getNombrePaciente(item).toLowerCase();
			const folioId = item?.id ? String(item.id) : '';
			const clave = item?.clavePaciente ? String(item.clavePaciente).toLowerCase() : '';
			const estado = String(item?.estadoSeguimiento || item?.estado || '').toLowerCase();
			const responsable = String(getResponsableName(item)).toLowerCase();

			const telefono = String(item?.telefonoContacto || item?.celular || '').toLowerCase();
			return (
				nombre.includes(termino) ||
				folioId.includes(termino) ||
				clave.includes(termino) ||
				estado.includes(termino) ||
				responsable.includes(termino) ||
				telefono.includes(termino)
			);
		});
	}, [pacientes, tabActiva, busqueda]);

	const labelTabActiva =
		tabActiva === 'activos' ? 'Pacientes Activos' : tabActiva === 'prospectos' ? 'Prospectos' : 'Rechazados';

	return (
		<div className="min-h-screen bg-slate-100 text-slate-900">
			<div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
				<AdminHeader submodule="Directorio de Expedientes" />

				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<AdmisionesSidebar />

					<main className="space-y-5">
						<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
							<div className="border-b border-slate-200 bg-slate-50/60 p-5">
								<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
									<div>
										<p className="text-xs font-black uppercase tracking-[0.2em] text-[#7E1D3B]">Admisiones</p>
										<h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Directorio de Expedientes</h2>
										<p className="mt-1 text-xs text-slate-500">Lista centralizada para admisiones con acceso directo al expediente digital.</p>
									</div>

									<div className="relative w-full md:w-80">
										<Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
										<input
											type="text"
											value={busqueda}
											onChange={(event) => setBusqueda(event.target.value)}
											placeholder="Buscar por nombre, folio o estado..."
											className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#7E1D3B]/50 focus:ring-2 focus:ring-[#7E1D3B]/20"
										/>
									</div>
								</div>

								<div className="inline-flex rounded-xl bg-white p-1 shadow-sm">
									<button
										type="button"
										onClick={() => setTabActiva('activos')}
										className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
											tabActiva === 'activos' ? 'bg-[#7E1D3B] text-white' : 'text-slate-600 hover:bg-slate-100'
										}`}
									>
										<Users size={16} />
										Pacientes Activos
									</button>
									<button
										type="button"
										onClick={() => setTabActiva('prospectos')}
										className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
											tabActiva === 'prospectos' ? 'bg-[#7E1D3B] text-white' : 'text-slate-600 hover:bg-slate-100'
										}`}
									>
										<UserPlus size={16} />
										Prospectos
									</button>
									<button
										type="button"
										onClick={() => setTabActiva('rechazados')}
										className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
											tabActiva === 'rechazados' ? 'bg-[#7E1D3B] text-white' : 'text-slate-600 hover:bg-slate-100'
										}`}
									>
										<AlertTriangle size={16} />
										Rechazados
									</button>
								</div>
							</div>

							<div className="hidden grid-cols-12 gap-4 border-b border-slate-200 bg-white px-6 py-3 md:grid">
								<div className="col-span-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Folio</div>
								<div className="col-span-3 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Nombre</div>
								<div className="col-span-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Estado del Trámite</div>
								<div className="col-span-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Responsable</div>
								<div className="col-span-1 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Contacto</div>
								<div className="col-span-1 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Ingreso / Cita</div>
								<div className="col-span-1 pr-4 text-right text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Acción</div>
							</div>

							{loading ? (
								<div className="bg-white py-12 text-center text-sm text-slate-500">Cargando expedientes...</div>
							) : error ? (
								<div className="m-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
							) : pacientesFiltrados.length === 0 ? (
								<div className="bg-white py-12 text-center text-sm text-slate-500">No se encontraron registros para {labelTabActiva.toLowerCase()}.</div>
							) : (
								<div className="bg-slate-50">
									{pacientesFiltrados.map((paciente) => {
										const isExpanded = expandidoId === paciente.id;
										return (
											<div key={paciente.id} className="border-b border-slate-200 bg-white last:border-b-0">
												<button
													type="button"
													onClick={() => toggleExpandir(paciente.id)}
													className={`grid w-full grid-cols-1 items-center gap-4 px-6 py-4 text-left transition-colors md:grid-cols-12 ${
														isExpanded ? 'bg-[#7E1D3B]/5' : 'hover:bg-slate-50'
													}`}
												>
													<div className="md:col-span-2 flex items-center gap-3">
														<div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isExpanded ? 'bg-[#7E1D3B] text-white' : 'bg-slate-100 text-slate-400'}`}>
															<User size={14} />
														</div>
														<span className="text-sm font-bold text-[#7E1D3B]">{getFolio(paciente)}</span>
													</div>

													<div className="md:col-span-3">
														<p className="truncate text-sm font-bold text-slate-800">{getNombrePaciente(paciente)}</p>
														<p className="mt-0.5 text-[11px] font-medium text-slate-500">{paciente.sexo || 'S/E'} • {paciente.edad ? `${paciente.edad} años` : 'Edad N/D'}</p>
													</div>
														<div className="md:col-span-2">
											{getEstadoPaciente(paciente) === 'DENEGADO' ? (
												<span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
													DENEGADO
												</span>
											) : paciente.estadoSeguimiento ? (
												<span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
													{paciente.estadoSeguimiento}
												</span>
											) : (
												<span className="text-xs italic text-slate-400">Sin estado</span>
											)}
														</div>

														<div className="md:col-span-2">
															<p className="truncate text-sm font-medium text-slate-700">{getResponsableName(paciente)}</p>
															<p className="mt-0.5 text-[11px] text-slate-400">Solicitante</p>
														</div>

														<div className="md:col-span-1 flex items-center text-sm text-slate-700">
															<Phone size={14} className="text-slate-400 mr-2" />
															<span className="truncate">{paciente.telefonoContacto || paciente.celular || '—'}</span>
														</div>

														<div className="md:col-span-1 flex items-center text-sm text-slate-700 justify-center">
															<span>{formatDateShort(paciente.fechaIngreso || paciente.fechaCita || paciente.proximaCita) || '—'}</span>
														</div>

														<div className="md:col-span-1 flex items-center justify-end gap-2 pr-2 text-slate-400">
															<span className="hidden text-[11px] font-bold uppercase tracking-wider md:inline">{isExpanded ? 'Ocultar Resumen' : 'Ver Resumen'}</span>
															{isExpanded ? <ChevronUp size={18} className="text-[#7E1D3B]" /> : <ChevronDown size={18} />}
														</div>
												</button>

												{isExpanded ? (
													<div className="grid grid-cols-1 gap-6 border-t border-[#7E1D3B]/10 bg-slate-50 px-6 py-5 shadow-inner lg:grid-cols-3">
														<div className="space-y-3">
															<h4 className="mb-2 border-b border-slate-200 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Datos de Contacto</h4>
															<div className="flex items-center gap-2 text-sm">
																<Phone size={14} className="text-slate-400" />
																<span className="font-medium text-slate-700">{paciente.telefonoContacto || paciente.telefonoCasa || 'No registrado'}</span>
															</div>
															<div className="flex items-start gap-2 text-sm">
																<MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
																<span className="line-clamp-2 font-medium text-slate-700" title={paciente.domicilioParticular || paciente.origen || ''}>
																	{paciente.domicilioParticular || paciente.origen || 'Sin domicilio registrado'}
																</span>
															</div>
														</div>

														<div className="space-y-3">
															<h4 className="mb-2 border-b border-slate-200 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado Administrativo</h4>
																<div className="flex items-center gap-2 text-sm">
																	<span className="text-xs mr-2 text-slate-500">Estado del trámite:</span>
																	<span className={`font-medium ${getEstadoPaciente(paciente) === 'DENEGADO' ? 'text-rose-700' : 'text-slate-700'}`}>
																		{getEstadoPaciente(paciente) === 'DENEGADO' ? 'DENEGADO' : (paciente.estadoSeguimiento || paciente.estado || 'Sin información')}
																	</span>
																</div>
																<div className="flex items-center gap-2 text-sm">
																	<span className="text-xs mr-2 text-slate-500">Responsable:</span>
																	<span className="font-medium text-slate-700">{getResponsableName(paciente)}</span>
																</div>
																{getEstadoPaciente(paciente) === 'DENEGADO' ? (
																	<div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
																		<p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-700">Motivo de rechazo</p>
																		<p className="mt-1 leading-6">El paciente fue denegado por insuficiencia económica. Revisa el expediente digital para ver las notas administrativas.</p>
																	</div>
																) : null}
																{paciente.clavePaciente && (
																	<div className="mt-2 text-sm">
																		<span className="mr-2 text-slate-500">Clave paciente:</span>
																		<span className="font-medium text-slate-700">{paciente.clavePaciente}</span>
																	</div>
																)}
														</div>

														<div className="flex flex-col justify-center border-l border-slate-200 pl-6">
															<p className="mb-3 text-xs leading-relaxed text-slate-500">Acceda al detalle digital para visualizar documentos, notas y seguimiento completo del prospecto o paciente.</p>
															<button
																type="button"
																onClick={() => navigate(`/admisiones/expediente-digital/${paciente.id}`)}
																className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7E1D3B] py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#63162e]"
															>
																Abrir Expediente Completo <ArrowRight size={16} />
															</button>
														</div>
													</div>
												) : null}
											</div>
										);
									})}
								</div>
							)}

							<div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
								<p className="text-xs font-medium text-slate-500">
									Resultados: <span className="font-bold text-slate-700">{pacientesFiltrados.length}</span> en {labelTabActiva.toLowerCase()}.
								</p>
							</div>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
};

export default DirectorioAdmisiones;
