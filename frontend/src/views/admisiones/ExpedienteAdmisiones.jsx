import React, { useEffect, useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowRight, FileText, FileX, AlertTriangle, Search, Sparkles, X, Download, Upload, CheckCircle2, Paperclip, Briefcase, Phone, User, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';
import AdmisionesToast from '../../components/admisiones/AdmisionesToast';
import ReciboPagoDocumento from '../../components/admisiones/ReciboPagoDocumento';
import { API_BASE, API_HOST } from '../../config/api';
import PrimarySidebarActionButton from '../../components/buttons/PrimarySidebarActionButton';

const formatDateValue = (value) => {
	if (!value) return '--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '--';
	return date.toLocaleDateString('es-MX');
};

const hasValue = (value) => String(value ?? '').trim().length > 0;

const getNombreProspecto = (item) => item?.nombreCompleto || item?.nombrePaciente || item?.nombre || '';

const formatEstadoPacienteDisplay = (estado) => {
	const normalized = String(estado || '').toUpperCase();
	if (normalized === 'INGRESADO') return 'PACIENTE';
	return normalized || 'Sin estado';
};

const getRecibosStorageKey = (pacienteId) => `admisiones-recibos-${pacienteId}`;

const normalizarReciboApi = (recibo) => ({
	id: recibo.id,
	nombre: recibo.tokenGenerado || recibo.numeroRecibo || `Recibo ${recibo.id}`,
	numeroRecibo: recibo.numeroRecibo || recibo.tokenGenerado || '',
	fecha: formatDateValue(recibo.fechaValidacion || recibo.fechaPago || recibo.createdAt),
	tipo: 'Recibo de pago',
	url: recibo.archivoReciboUrl || '',
	estadoPago: recibo.estadoPago || '',
	tokenGenerado: recibo.tokenGenerado || '',
	_localOnly: false,
});

const formatTimeValue = (value) => {
	if (!value) return '--:--';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '--:--';
	return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const toDateTimeLocalValue = (value) => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	const pad = (part) => String(part).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const buildPdfActionUrl = (path) => `${API_HOST}${path}`;

const getTimelineTone = (seguimiento) => {
	const estado = String(seguimiento?.estadoSeguimiento || seguimiento?.estadoAsistencia || '').toLowerCase();
	if (estado.includes('lleg') || estado.includes('confirm')) return 'emerald';
	if (estado.includes('no se presentó') || estado.includes('no contestó') || estado.includes('no hubo respuesta')) return 'rose';
	if (estado.includes('espera') || estado.includes('pendiente')) return 'amber';
	return 'slate';
};

const buildDocumentosProspecto = (prospecto, detalleExpediente, tieneValoracionMedica) => {
	if (!prospecto) return [];

	const documentosBackend = Array.isArray(detalleExpediente?.documentos) ? detalleExpediente.documentos : [];
	const estadoPaciente = String(prospecto?.estadoPaciente || '').toUpperCase();
	const documentosPdf = documentosBackend.map((doc) => {
		const esSocioeconomico = /socioeconomico/i.test(String(doc.nombreArchivo || '')) || /socioeconomico/i.test(String(doc.tipo || ''));
		const documentoDenegado = esSocioeconomico && estadoPaciente === 'DENEGADO';

		return {
			nombre: doc.nombreArchivo || 'PDF socioeconomico',
			tipo: doc.tipo || 'PDF',
			estado: documentoDenegado ? 'DENEGADO' : 'Adjunto',
			esSocioeconomico,
			detalle: documentoDenegado
				? `Generado: ${formatDateValue(doc.generadoEn)} • Denegado por insuficiencia económica.`
				: `Generado: ${formatDateValue(doc.generadoEn)}${doc.descargaUrl ? ' • Disponible para descarga' : ''}`,
			descargaUrl: doc.descargaUrl ? `${API_HOST}${doc.descargaUrl}` : '',
			verUrl: doc.descargaUrl ? buildPdfActionUrl(doc.descargaUrl.replace('/descargar', '/ver')) : '',
			imprimirUrl: doc.descargaUrl ? buildPdfActionUrl(doc.descargaUrl.replace('/descargar', '/imprimir')) : '',
		};
	});

	const tieneSolicitante = !!prospecto.solicitante;
	const tieneDatosBasicos = hasValue(prospecto.nombreCompleto) && (hasValue(prospecto.telefonoContacto) || hasValue(prospecto.telefonoCasa));
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
			estado: tieneValoracionMedica ? 'Adjunto' : 'Pendiente',
			detalle: tieneValoracionMedica
				? 'Valoración completada por el médico asignado.'
				: 'Aún no hay datos clínicos suficientes para valoración.',
		},
	];

	return [...documentosPdf, ...documentosBase];
};

const buildNotasProspecto = (prospecto, detalleExpediente, prospectoSeleccionado) => {
	if (!prospecto) return [];

	const notas = [];
	const nombre = getNombreProspecto(prospecto) || 'Prospecto sin nombre';
	const claveMostrar = prospectoSeleccionado?.clavePaciente || '--';

	notas.push({
		id: `sistema-expediente-${prospecto.id}`,
		texto: `Admisiones: expediente activo para ${nombre}. Clave interna ${claveMostrar}.`,
		fecha: prospecto.fechaIngreso || prospecto.createdAt || null,
		autor: 'Sistema de admisiones',
		tipo: 'sistema',
	});

	if (prospecto.solicitante?.nombre) {
		notas.push({
			id: `sistema-solicitante-${prospecto.id}`,
			texto: `Seguimiento: solicitante ${prospecto.solicitante.nombre} (${prospecto.solicitante.parentescoPaciente || 'parentesco no definido'}) con contacto ${prospecto.solicitante.telefono || prospecto.solicitante.celular || '--'}.`,
			fecha: null,
			autor: 'Sistema de admisiones',
			tipo: 'sistema',
		});
	}

	if (hasValue(prospecto.domicilioParticular) || hasValue(prospecto.origen)) {
		notas.push({
			id: `sistema-contexto-${prospecto.id}`,
			texto: `Contexto: origen ${prospecto.origen || '--'} y domicilio ${prospecto.domicilioParticular || '--'}.`,
			fecha: null,
			autor: 'Sistema de admisiones',
			tipo: 'sistema',
		});
	}

	if (hasValue(prospecto.sustanciaConsumo)) {
		notas.push({
			id: `sistema-clinico-${prospecto.id}`,
			texto: `Clínico: sustancia de consumo reportada ${prospecto.sustanciaConsumo}.`,
			fecha: null,
			autor: 'Sistema de admisiones',
			tipo: 'sistema',
		});
	}

	const seguimientos = Array.isArray(detalleExpediente?.seguimientos) ? detalleExpediente.seguimientos : [];
	if (seguimientos.length > 0) {
		const ultimo = seguimientos[0];
		notas.push({
			id: `sistema-seguimiento-${ultimo.id || prospecto.id}`,
			texto: `Seguimiento actual: ${ultimo.estadoSeguimiento || '--'} (${ultimo.tipoAccion || '--'}) programado para ${formatDateValue(ultimo.fechaHoraProgramada)}.`,
			fecha: ultimo.fechaHoraProgramada || null,
			autor: 'Sistema de admisiones',
			tipo: 'sistema',
		});
	}

	const notasAdministrativasGuardadas = (Array.isArray(detalleExpediente?.notasAdministrativas) ? detalleExpediente.notasAdministrativas : []).map((nota) => ({
		id: `adm-admin-${nota.id}`,
		texto: nota.observaciones || 'Nota administrativa sin contenido.',
		fecha: nota.fechaRegistro || null,
		autor: nota.autor || 'TRABAJO SOCIAL - RECHAZO',
		tipo: 'sistema',
		categoria: 'rechazo',
		estadoNuevo: nota.estadoNuevo || '',
	}));

	const notasAdmisionesGuardadas = (Array.isArray(detalleExpediente?.notasEvolucion) ? detalleExpediente.notasEvolucion : [])
		.filter((nota) => String(nota?.medicoAsignado || '').toUpperCase().includes('ADMISION'))
		.map((nota) => ({
			id: `adm-${nota.id}`,
			texto: nota.observaciones || 'Nota de admisiones sin contenido.',
			fecha: nota.fechaRegistro || null,
			autor: nota.medicoAsignado || 'Admisiones',
			tipo: 'admisiones',
		}));

	const unificadas = [...notasAdministrativasGuardadas, ...notasAdmisionesGuardadas, ...notas];
	unificadas.sort((a, b) => {
		const da = a.fecha ? new Date(a.fecha).getTime() : 0;
		const db = b.fecha ? new Date(b.fecha).getTime() : 0;
		return db - da;
	});

	if (unificadas.length === 0) {
		return [{
			id: `empty-${prospecto.id}`,
			texto: 'No hay notas disponibles para el prospecto seleccionado.',
			fecha: null,
			autor: 'Sistema',
			tipo: 'sistema',
		}];
	}

	return unificadas;
};

const buildTimeline = (detalleExpediente) => {
	const seguimientos = Array.isArray(detalleExpediente?.seguimientos) ? detalleExpediente.seguimientos : [];
	const notasAdmisiones = (Array.isArray(detalleExpediente?.notasEvolucion) ? detalleExpediente.notasEvolucion : [])
		.filter((nota) => String(nota?.medicoAsignado || '').toUpperCase().includes('ADMISION'));
	const expediente = detalleExpediente?.expediente || {};

	const eventosSeguimiento = seguimientos.map((item) => ({
		id: item.id,
		fecha: item.fechaHoraProgramada,
		titulo: item.tipoAccion || 'Seguimiento',
		estado: item.estadoAsistencia || item.estadoSeguimiento || 'Sin estado',
		detalle: item.motivo || 'Sin motivo registrado',
		origen: item.origenLlamada,
		tone: getTimelineTone(item),
		diagnosticoVisual: item.diagnosticoVisual,
		tipoEvento: 'seguimiento',
	}));

	const eventosNotas = notasAdmisiones.map((nota) => ({
		id: `nota-${nota.id}`,
		fecha: nota.fechaRegistro,
		titulo: 'Nota de admisiones',
		estado: 'Registrada',
		detalle: nota.observaciones || 'Nota sin detalle',
		origen: 'ADMISIONES',
		tone: 'amber',
		diagnosticoVisual: null,
		tipoEvento: 'nota',
	}));

	const eventoApertura = expediente?.fechaApertura ? [{
		id: `expediente-${expediente.id || 'nuevo'}`,
		fecha: expediente.fechaApertura,
		titulo: 'Apertura de expediente',
		estado: expediente.estado || 'ACTIVO',
		detalle: expediente.numero ? `Folio ${expediente.numero}` : 'Registro inicial del expediente.',
		origen: 'SISTEMA',
		tone: 'slate',
		diagnosticoVisual: null,
		tipoEvento: 'expediente',
	}] : [];

	const eventos = [...eventosSeguimiento, ...eventosNotas];

	if (eventos.length === 0) {
		return eventoApertura;
	}

	return eventos.sort((a, b) => {
		const da = a.fecha ? new Date(a.fecha).getTime() : 0;
		const db = b.fecha ? new Date(b.fecha).getTime() : 0;
		return db - da;
	});
};

const buildDiagnosticoReadOnlyData = (prospecto, detalleExpediente) => {
	if (!prospecto && !detalleExpediente) {
		return null;
	}

	const llamadaInicial = detalleExpediente?.llamadaInicial || {};
	const tieneSnapshot = Object.keys(llamadaInicial).length > 0;
	const ultimoSeguimiento = Array.isArray(detalleExpediente?.seguimientos) && detalleExpediente.seguimientos.length > 0
		? detalleExpediente.seguimientos[0]
		: null;

	const solicitanteLlamada = llamadaInicial.solicitante || {};
	const solicitanteBase = prospecto?.solicitante || {};
	const solicitante = { ...solicitanteBase, ...solicitanteLlamada };

	const pacienteLlamada = llamadaInicial.paciente || {};
	const pacienteBase = prospecto || {};
	const paciente = { ...pacienteBase, ...pacienteLlamada };

	return {
		solicitante: {
			fuenteReferencia: '',
			nombres: solicitante.nombres || '',
			apellidoPaterno: solicitante.apellidoPaterno || '',
			apellidoMaterno: solicitante.apellidoMaterno || '',
			lugarVisita: solicitante.origen || solicitante.lugar || '',
			direccionCalle: solicitante.direccionCalle || '',
			direccionNoExt: solicitante.direccionNoExt || '',
			direccionNoInt: solicitante.direccionNoInt || '',
			direccionColonia: solicitante.direccionColonia || '',
			direccionMunicipioDelegacion: solicitante.direccionMunicipioDelegacion || '',
			direccionCp: solicitante.direccionCp || '',
			direccionCiudadEstado: solicitante.direccionCiudadEstado || '',
			telefono: solicitante.telefono || '',
			celular: solicitante.celular || '',
			dedicacion: solicitante.ocupacion || '',
			parentesco: solicitante.parentescoPaciente || '',
		},
		prospecto: {
			nombres: paciente.nombres || '',
			apellidoPaterno: paciente.apellidoPaterno || '',
			apellidoMaterno: paciente.apellidoMaterno || '',
			edad: paciente.edad ?? '',
			estadoCivil: paciente.estadoCivil || '',
			hijos: paciente.hijos ?? paciente.cantidadHijos ?? '',
			escolaridad: paciente.escolaridad || '',
			origen: paciente.origen || '',
			telefono: paciente.telefono || paciente.telefonoContacto || '',
			direccionCalle: paciente.direccionCalle || '',
			direccionNoExt: paciente.direccionNoExt || '',
			direccionNoInt: paciente.direccionNoInt || '',
			direccionColonia: paciente.direccionColonia || '',
			direccionMunicipioDelegacion: paciente.direccionMunicipioDelegacion || '',
			direccionCp: paciente.direccionCp || '',
			direccionCiudadEstado: paciente.direccionCiudadEstado || '',
			dedicacion: paciente.ocupacion || '',
			sustanciaConsumo: paciente.sustancia || paciente.sustanciaConsumo || '',
			internamiento: '',
			criterioInternamiento: '',
			conclusionIntervencion: '',
			tratamientoAnterior: '',
			posibilidadesEconomicas: '',
			llamarPaciente: llamadaInicial.llamarPaciente || (ultimoSeguimiento?.origenLlamada === 'PROSPECTO' ? 'prospecto' : ultimoSeguimiento?.origenLlamada === 'NOSOTROS' ? 'nosotros' : ''),
			estadoSeguimiento: llamadaInicial.estadoSeguimiento || ultimoSeguimiento?.estadoSeguimiento || '',
			fechaCita: toDateTimeLocalValue(llamadaInicial.fechaCita || ultimoSeguimiento?.fechaHoraProgramada),
			acuerdo: llamadaInicial.motivoAccion || ultimoSeguimiento?.motivo || '',
		},
		tieneSnapshot,
	};
};

const ReadOnlyField = ({ label, value, type = 'text' }) => (
	<div>
		<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">{label}</label>
		<input
			type={type}
			value={value ?? ''}
			disabled
			readOnly
			className="min-h-[48px] w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3.5 text-slate-600 outline-none"
		/>
	</div>
);

const ReadOnlySelect = ({ label, value }) => (
	<div>
		<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">{label}</label>
		<select
			value={value ?? ''}
			disabled
			className="min-h-[48px] w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3.5 text-slate-600 outline-none"
		>
			<option value="">{value || 'Sin dato'}</option>
		</select>
	</div>
);

const ReadOnlyRadio = ({ label, selectedValue, options }) => (
	<div>
		<p className="mb-2 ml-1 text-xs font-bold uppercase text-slate-600">{label}</p>
		<div className="flex flex-wrap gap-3">
			{options.map((option) => (
				<label key={option.value} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600">
					<input type="radio" checked={selectedValue === option.value} readOnly disabled className="accent-[#7E1D3B]" />
					<span>{option.label}</span>
				</label>
			))}
		</div>
	</div>
);

const construirNombrePacienteRecibo = (prospecto) => {
	const nombreCompleto = [prospecto?.nombres || prospecto?.nombre || prospecto?.nombreCompleto, prospecto?.apellidoPaterno, prospecto?.apellidoMaterno]
		.filter(Boolean)
		.join(' ')
		.trim();

	return nombreCompleto.toUpperCase();
};

const generarReciboHTML = (datos) => {
	const totalMonto = Number(datos.montoPago || 0) + Number(datos.montoPrograma || 0);
	const nombreCompletoPagador = [datos.nombrePagador, datos.apellidoPaternoPagador, datos.apellidoMaternoPagador].filter(Boolean).join(' ');
	const nombreCompletoPaciente = construirNombrePacienteRecibo(datos);
	const direccionCompleta = [
		datos.direccionCalle,
		datos.direccionNoExt,
		datos.direccionNoInt,
		datos.direccionColonia,
		datos.direccionMunicipioDelegacion,
		datos.codigoPostal,
		datos.direccionCiudadEstado,
	].filter(Boolean).join(', ');
	const items = [];

	if (Number(datos.montoPago || 0) > 0) {
		items.push({ descripcion: 'Tratamiento', cantidad: 1, precioUnitario: Number(datos.montoPago || 0), importe: Number(datos.montoPago || 0) });
	}

	if (Number(datos.montoPrograma || 0) > 0) {
		items.push({ descripcion: 'Programa', cantidad: 1, precioUnitario: Number(datos.montoPrograma || 0), importe: Number(datos.montoPrograma || 0) });
	}

	if (items.length === 0) {
		items.push({ descripcion: datos.concepto || 'Concepto de pago', cantidad: 1, precioUnitario: totalMonto, importe: totalMonto });
	}

	return renderToStaticMarkup(
		<ReciboPagoDocumento
			folio={datos.folioRecibo || datos.folio || datos.numeroRecibo || ''}
			fecha={datos.fechaPago}
			recibiDe={nombreCompletoPagador}
			concepto={datos.concepto}
			nombrePaciente={nombreCompletoPaciente}
			clavePaciente={datos.clavePaciente}
			nombreRecibe={datos.nombreRecibe}
			rfc={datos.rfc}
			telefono={datos.telefonoPagador}
			direccion={direccionCompleta}
			items={items}
			total={totalMonto}
		/>
	);
};

const ExpedienteAdmisiones = () => {
	const navigate = useNavigate();
	const { id: expedienteIdParam } = useParams();
	const location = useLocation();
	const [tab, setTab] = useState('general');
	const [busquedaExpediente, setBusquedaExpediente] = useState('');
	const [, setResultadosBusqueda] = useState([]);
	const [, setCargandoBusqueda] = useState(false);
	const [, setErrorBusqueda] = useState('');
	const [, setIndiceResaltado] = useState(-1);
	const [prospectoSeleccionado, setProspectoSeleccionado] = useState(null);
	const [detalleExpediente, setDetalleExpediente] = useState(null);
	const [seguimientosExpediente, setSeguimientosExpediente] = useState([]);
	const [, setCargandoDetalleExpediente] = useState(false);
	const [, setErrorDetalleExpediente] = useState('');
	const [modalLlamadaInicialAbierto, setModalLlamadaInicialAbierto] = useState(false);
	const [diagnosticoTab, setDiagnosticoTab] = useState('solicitante');
	const [modalReciboAbierto, setModalReciboAbierto] = useState(false);
	const [modalRechazoAbierto, setModalRechazoAbierto] = useState(false);
	const [generandoRecibo, setGenerandoRecibo] = useState(false);
	const [folioReciboActual, setFolioReciboActual] = useState('');
	
	// --- MODIFICACIÓN 2: Estado para controlar si el médico ya guardó la valoración ---
	const [tieneValoracionMedica, setTieneValoracionMedica] = useState(false);
	const [estudioPdfExists, setEstudioPdfExists] = useState(null);
	const [estudioDescargaUrl, setEstudioDescargaUrl] = useState(null);
	
	const [datosRecibo, setDatosRecibo] = useState({
		nombrePagador: '',
		apellidoPaternoPagador: '',
		apellidoMaternoPagador: '',
		fechaPago: new Date().toISOString().split('T')[0],
		direccionCalle: '',
		direccionNoExt: '',
		direccionNoInt: '',
		direccionColonia: '',
		direccionMunicipioDelegacion: '',
		codigoPostal: '',
		direccionCiudadEstado: '',
		rfc: '',
		telefonoPagador: '',
		nombrePaciente: '',
		apellidoPaternoPaciente: '',
		apellidoMaternoPaciente: '',
		clavePaciente: '',
		concepto: 'Tratamiento de desintoxicación',
		montoPago: 0,
		montoPrograma: 0,
		nombreRecibe: '',
	});
	const [recibosSubidos, setRecibosSubidos] = useState([]);
	const [, setReciboPersistido] = useState(null);
	const [cargandoRecibo, setCargandoRecibo] = useState(false);
	const [tokenGenerado, setTokenGenerado] = useState(null);
	const [generandoToken, setGenerandoToken] = useState(false);
	const [motivoRechazo, setMotivoRechazo] = useState('');
	const [procesandoRechazo, setProcesandoRechazo] = useState(false);
	const [, setExpedienteModo] = useState('prospecto');
	const [, setExpedienteExpandidoId] = useState(null);
	const [notaAdmisiones, setNotaAdmisiones] = useState('');
	const [guardandoNotaAdmisiones, setGuardandoNotaAdmisiones] = useState(false);
	const [toast, setToast] = useState({ type: '', message: '' });

	const cargarRecibosPersistidos = async (pacienteId) => {
		if (!pacienteId) return [];
		const storageKey = getRecibosStorageKey(pacienteId);


		const localGuardado = window.localStorage.getItem(storageKey);
		if (localGuardado) {
			try {
				const localRecibos = JSON.parse(localGuardado);
				if (Array.isArray(localRecibos) && localRecibos.length > 0) {
					setRecibosSubidos(localRecibos);
					setReciboPersistido(localRecibos.find((item) => item._localOnly) || localRecibos[0]);
					setFolioReciboActual(localRecibos[0]?.numeroRecibo || localRecibos[0]?.nombre || '');
					return localRecibos;
				}
			} catch (error) {
				console.error('Error al leer recibos locales:', error);
			}
		}

		setRecibosSubidos([]);
		setReciboPersistido(null);
		setFolioReciboActual('');
		return [];
	};

	// Cargar paciente preseleccionado si venimos del estudio socioeconómico
	// Solo se ejecuta si NO hay expedienteIdParam (prioridad a ruta)
	useEffect(() => {
		if (expedienteIdParam) {
			// Si hay ID en la ruta, el otro useEffect se encarga
			return;
		}

		if (location.state?.pacienteIdPreseleccionado) {
			const pacienteId = location.state.pacienteIdPreseleccionado;
			const controller = new AbortController();

			const cargarPacientePreseleccionado = async () => {
				try {
					const response = await fetch(`${API_BASE}/pacientes/${pacienteId}`, {
						signal: controller.signal,
					});

					if (response.ok) {
						const paciente = await response.json();
						seleccionarProspecto(paciente);
					} else {
						console.error('Paciente no encontrado:', pacienteId);
					}
				} catch (error) {
					if (error.name !== 'AbortError') {
						console.error('Error al cargar paciente preseleccionado:', error);
					}
				}
			};

			cargarPacientePreseleccionado();
			return () => controller.abort();
		}
	}, [location.state?.pacienteIdPreseleccionado, expedienteIdParam]);

	useEffect(() => {
		let mounted = true;
		if (!prospectoSeleccionado?.id) {
			setEstudioPdfExists(null);
			return () => { mounted = false; };
		}
		(async () => {
			try {
				const res = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/estudio-socioeconomico/pdf`, {
					method: 'GET',
					headers: { 'Accept': 'application/json' },
				});
				if (!mounted) return;
				if (!res.ok) {
					if (res.status === 404) {
						setEstudioPdfExists(false);
						setEstudioDescargaUrl(null);
						return;
					}
					setEstudioPdfExists(false);
					setEstudioDescargaUrl(null);
					return;
				}
				const docs = await res.json();
				if (Array.isArray(docs) && docs.length > 0) {
					setEstudioPdfExists(true);
					const first = docs[0];
					setEstudioDescargaUrl(first.descargaUrl ? `${API_HOST}${first.descargaUrl}` : null);
				} else {
					setEstudioPdfExists(false);
					setEstudioDescargaUrl(null);
				}
			} catch (err) {
				console.error('Error comprobando estudio socioeconómico PDF', err);
				if (mounted) {
					setEstudioPdfExists(false);
					setEstudioDescargaUrl(null);
				}
			}
		})();
		return () => { mounted = false; };
	}, [prospectoSeleccionado?.id]);

	const seleccionarProspecto = async (prospecto, opciones = {}) => {
		const { abrirConsulta = false, tabConsulta = 'solicitante' } = opciones;
		setProspectoSeleccionado(prospecto);
		setBusquedaExpediente(getNombreProspecto(prospecto));
		setModalLlamadaInicialAbierto(abrirConsulta);
		setDiagnosticoTab(tabConsulta);
		setExpedienteExpandidoId(prospecto?.id || null);

		// Consultar el estado real del paciente desde el backend
		try {
			const response = await fetch(`${API_BASE}/pacientes/${prospecto.id}`);
			if (response.ok) {
				const pacienteActualizado = await response.json();
				const estadoPaciente = pacienteActualizado.estadoPaciente || 'PROSPECTO';
				
				setProspectoSeleccionado(prev => ({
					...prev,
					estadoPaciente: estadoPaciente,
					clavePaciente: pacienteActualizado.clavePaciente || null,
					fechaIngreso: pacienteActualizado.fechaIngreso || null,
				}));

				// Actualizar automáticamente el modo del expediente basado en el estado
				if (estadoPaciente === 'INGRESADO') {
					setExpedienteModo('ingresado');
				} else {
					setExpedienteModo('prospecto');
				}
			}
		} catch (error) {
			console.error('Error al obtener estado del paciente:', error);
			// Por defecto mostrar vista de prospecto si hay error
			setExpedienteModo('prospecto');
		}

		// Autocompletar datos del recibo desde el prospecto y el solicitante
		const sol = prospecto?.solicitante || {};
		setDatosRecibo(prev => ({
			...prev,
			// Pagador → preferir solicitante (quien normalmente realiza el pago)
			nombrePagador: sol.nombres || sol.nombre || '',
			apellidoPaternoPagador: String(sol.apellidoPaterno || '').toUpperCase(),
			apellidoMaternoPagador: String(sol.apellidoMaterno || '').toUpperCase(),
			telefonoPagador: sol.telefono || sol.celular || prospecto.telefonoContacto || prospecto.telefono || '',
			direccionCalle: sol.direccionCalle || prospecto.direccionCalle || '',
			direccionNoExt: sol.direccionNoExt || prospecto.direccionNoExt || '',
			direccionNoInt: sol.direccionNoInt || prospecto.direccionNoInt || '',
			direccionColonia: sol.direccionColonia || prospecto.direccionColonia || '',
			direccionMunicipioDelegacion: sol.direccionMunicipioDelegacion || prospecto.direccionMunicipioDelegacion || '',
			codigoPostal: sol.direccionCp || prospecto.direccionCp || '',
			direccionCiudadEstado: sol.direccionCiudadEstado || prospecto.direccionCiudadEstado || '',
			// Paciente
			nombrePaciente: construirNombrePacienteRecibo(prospecto),
			apellidoPaternoPaciente: String(prospecto.apellidoPaterno || '').toUpperCase(),
			apellidoMaternoPaciente: String(prospecto.apellidoMaterno || '').toUpperCase(),
			clavePaciente: String(prospecto.clavePaciente || '--').toUpperCase(),
		}));
	};

	useEffect(() => {
		if (!modalReciboAbierto || !prospectoSeleccionado?.id) return;
		// Misma fusión que usa el resto del expediente: base + snapshot de llamada inicial
		const solBase = prospectoSeleccionado?.solicitante || {};
		const solLlamada = detalleExpediente?.llamadaInicial?.solicitante || {};
		const sol = { ...solBase, ...solLlamada };
		setDatosRecibo((prev) => ({
			...prev,
			// Paciente (siempre desde el expediente)
			nombrePaciente: construirNombrePacienteRecibo(prospectoSeleccionado),
			apellidoPaternoPaciente: String(prospectoSeleccionado.apellidoPaterno || '').toUpperCase(),
			apellidoMaternoPaciente: String(prospectoSeleccionado.apellidoMaterno || '').toUpperCase(),
			clavePaciente: String(prospectoSeleccionado.clavePaciente || prev.clavePaciente || '--').toUpperCase(),
			// Pagador (solicitante fusionado — puede llegar más completo vía detalleExpediente)
			nombrePagador: sol.nombres || sol.nombre || prev.nombrePagador || '',
			apellidoPaternoPagador: String(sol.apellidoPaterno || '').toUpperCase() || prev.apellidoPaternoPagador || '',
			apellidoMaternoPagador: String(sol.apellidoMaterno || '').toUpperCase() || prev.apellidoMaternoPagador || '',
			telefonoPagador: sol.telefono || sol.celular || prospectoSeleccionado.telefonoContacto || prospectoSeleccionado.telefono || prev.telefonoPagador || '',
			// Domicilio del solicitante
			direccionCalle: sol.direccionCalle || prospectoSeleccionado.direccionCalle || prev.direccionCalle || '',
			direccionNoExt: sol.direccionNoExt || prospectoSeleccionado.direccionNoExt || prev.direccionNoExt || '',
			direccionNoInt: sol.direccionNoInt || prospectoSeleccionado.direccionNoInt || prev.direccionNoInt || '',
			direccionColonia: sol.direccionColonia || prospectoSeleccionado.direccionColonia || prev.direccionColonia || '',
			direccionMunicipioDelegacion: sol.direccionMunicipioDelegacion || prospectoSeleccionado.direccionMunicipioDelegacion || prev.direccionMunicipioDelegacion || '',
			codigoPostal: sol.direccionCp || prospectoSeleccionado.direccionCp || prev.codigoPostal || '',
			direccionCiudadEstado: sol.direccionCiudadEstado || prospectoSeleccionado.direccionCiudadEstado || prev.direccionCiudadEstado || '',
		}));
	}, [modalReciboAbierto, prospectoSeleccionado, detalleExpediente]);

	const descargarRecibo = () => {
		if (!prospectoSeleccionado?.id) return;

		const crearRecibo = async () => {
			setGenerandoRecibo(true);
			try {
				const numeroRecibo = folioReciboActual || `REC-${prospectoSeleccionado.id}-${Date.now()}`;

				// PASO 1: Iniciar el pago en el backend
				const iniciarResponse = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/iniciar-pago`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ folioRecibo: numeroRecibo }),
				});

				if (!iniciarResponse.ok) {
					const errorData = await iniciarResponse.json().catch(() => ({}));
					throw new Error(errorData.error || 'No se pudo iniciar el proceso de pago');
				}

				// PASO 2: Registrar el recibo
				const response = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/recibos`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						numeroRecibo,
						montoPago: datosRecibo.montoPago || 0,
						montoPrograma: datosRecibo.montoPrograma || 0,
						concepto: datosRecibo.concepto,
						nombrePagador: datosRecibo.nombrePagador,
						rfc: datosRecibo.rfc || '',
						archivoReciboUrl: '',
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.error || 'No se pudo registrar el recibo');
				}

				const creado = await response.json();
				const folioGenerado = creado?.numeroRecibo || creado?.tokenGenerado || numeroRecibo;
				setFolioReciboActual(folioGenerado);
				const normalizado = normalizarReciboApi(creado);
				setRecibosSubidos([normalizado]);
				setReciboPersistido(normalizado);
				window.localStorage.setItem(getRecibosStorageKey(prospectoSeleccionado.id), JSON.stringify([normalizado]));

				const html = generarReciboHTML({ ...datosRecibo, folioRecibo: folioGenerado });
				const element = document.createElement('div');
				element.innerHTML = html;
				const opt = {
					margin: 5,
					filename: `recibo-${folioGenerado}.pdf`,
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { scale: 2 },
					jsPDF: { orientation: 'portrait', unit: 'mm', format: 'letter' }
				};
				await html2pdf().set(opt).from(element).save();
				setToast({ type: 'success', message: 'Recibo generado y registrado como pendiente de validación.' });
			} catch (error) {
				console.error('Error al generar recibo:', error);
				setToast({ type: 'error', message: error.message || 'No se pudo generar el recibo.' });
			} finally {
				setGenerandoRecibo(false);
			}
		};

		crearRecibo();
	};

	const manejarCargaRecibo = async (event) => {
		const archivos = event.target.files;
		if (!archivos || archivos.length === 0 || !prospectoSeleccionado?.id || !pagoValidadoFinanzas) return;
		const archivo = archivos[0];
		setCargandoRecibo(true);

		try {
			const archivoDataUrl = await new Promise((resolve, reject) => {
				const lector = new FileReader();
				lector.onload = () => resolve(String(lector.result || ''));
				lector.onerror = () => reject(new Error('No se pudo leer el archivo del recibo'));
				lector.readAsDataURL(archivo);
			});

			const res = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/recibos`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					numeroRecibo: folioReciboActual || datosRecibo.clavePaciente || `REC-${prospectoSeleccionado.id}`,
					archivoReciboUrl: archivoDataUrl,
					montoPago: datosRecibo.montoPago || 0,
					montoPrograma: datosRecibo.montoPrograma || 0,
					concepto: datosRecibo.concepto,
					nombrePagador: datosRecibo.nombrePagador,
					rfc: datosRecibo.rfc || '',
				}),
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData.error || 'No se pudo registrar el recibo');
			}

			const creado = await res.json();
			const normalizado = normalizarReciboApi(creado);
			setRecibosSubidos([normalizado]);
			setReciboPersistido(normalizado);
			setFolioReciboActual(normalizado.numeroRecibo || normalizado.tokenGenerado || folioReciboActual);
			window.localStorage.setItem(getRecibosStorageKey(prospectoSeleccionado.id), JSON.stringify([normalizado]));
		} catch (error) {
			console.error('Error al subir recibo:', error);
			const localRecibo = {
				id: `local-${Date.now()}`,
				nombre: datosRecibo.clavePaciente || `INST-${new Date().getFullYear()}-${prospectoSeleccionado.id}`,
				fecha: new Date().toLocaleDateString('es-MX'),
				tamaño: `${(archivo.size / 1024).toFixed(2)} KB`,
				tipo: 'Recibo firmado',
				url: URL.createObjectURL(archivo),
				_localOnly: true,
			};
			setRecibosSubidos([localRecibo]);
			setReciboPersistido(localRecibo);
			setFolioReciboActual(localRecibo.nombre || folioReciboActual);
			window.localStorage.setItem(getRecibosStorageKey(prospectoSeleccionado.id), JSON.stringify([localRecibo]));
		} finally {
			setCargandoRecibo(false);
		}
	};

	const generarTokenIngreso = async () => {
		if (!recibosSubidos.length) {
			setToast({ type: 'error', message: 'Debe subir el recibo firmado antes de generar el token.' });
			return;
		}

		setGenerandoToken(true);

		try {
			// Llamar al backend para validar ingreso y generar token
			const response = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/validar-ingreso`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					reciboPagado: true,
					montoPago: datosRecibo.montoPago || 0,
					montoPrograma: datosRecibo.montoPrograma || 0,
					concepto: datosRecibo.concepto,
					nombrePagador: datosRecibo.nombrePagador,
					rfc: datosRecibo.rfc || '',
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'No se pudo validar el ingreso');
			}

			const data = await response.json();
			const tokenGenerado = data.clavePaciente;

			setTokenGenerado(tokenGenerado);

			// Actualizar el prospecto con el nuevo estado
			setProspectoSeleccionado(prev => ({
				...prev,
				estado: 'INGRESADO',
				estadoPaciente: 'INGRESADO',
				clavePaciente: tokenGenerado,
				fechaIngreso: new Date().toISOString()
			}));

			setModalReciboAbierto(false);

			setTimeout(() => {
				setToast({ type: 'success', message: `Token generado exitosamente: ${tokenGenerado}. El prospecto ahora es paciente.` });
				setTokenGenerado(null);
				if (prospectoSeleccionado?.id) {
					cargarRecibosPersistidos(prospectoSeleccionado.id);
				}
			}, 500);
		} catch (error) {
			console.error('Error al generar token:', error);
			setToast({ type: 'error', message: `No se pudo generar el token: ${error.message}` });
		} finally {
			setGenerandoToken(false);
		}
	};

	const registrarRechazoAdministrativo = async () => {
		if (!prospectoSeleccionado?.id) {
			setToast({ type: 'error', message: 'Selecciona un prospecto antes de registrar el rechazo.' });
			return;
		}

		const observaciones = motivoRechazo.trim();
		if (!observaciones) {
			setToast({ type: 'error', message: 'Escribe el motivo del rechazo para continuar.' });
			return;
		}

		setProcesandoRechazo(true);
		try {
			const response = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/rechazo-administrativo`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					estado: 'RECHAZADO_ECONOMICO',
					observaciones,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || 'No se pudo registrar el rechazo administrativo');
			}

			const data = await response.json();
			const notaAdministrativa = data?.notaAdministrativa || null;

			setProspectoSeleccionado(prev => (prev ? {
				...prev,
				estadoPaciente: 'DENEGADO',
			} : prev));
			setDetalleExpediente(prev => {
				if (!prev) return prev;
				const notasAdministrativasPrevias = Array.isArray(prev.notasAdministrativas) ? prev.notasAdministrativas : [];
				return {
					...prev,
					notasAdministrativas: notaAdministrativa ? [...notasAdministrativasPrevias, notaAdministrativa] : notasAdministrativasPrevias,
				};
			});

			setModalRechazoAbierto(false);
			setMotivoRechazo('');
			setToast({ type: 'success', message: 'El rechazo administrativo se registró correctamente.' });
		} catch (error) {
			console.error('Error al registrar rechazo administrativo:', error);
			setToast({ type: 'error', message: error.message || 'No se pudo registrar el rechazo administrativo.' });
		} finally {
			setProcesandoRechazo(false);
		}
	};

	const eliminarRecibo = async (recibo) => {
		if (!recibo) return;
		if (!confirm('¿Eliminar este recibo? Esta acción puede revertir la prueba de pago.')) return;
		const storageKey = getRecibosStorageKey(prospectoSeleccionado?.id);

		try {
			if (recibo._localOnly) {
				setRecibosSubidos(prev => prev.filter(r => r.id !== recibo.id));
				setReciboPersistido(null);
				window.localStorage.removeItem(storageKey);
				return;
			}

			const res = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/recibos/${recibo.id}`, {
				method: 'DELETE',
			});

			if (res.ok) {
				setRecibosSubidos(prev => prev.filter(r => r.id !== recibo.id));
				setReciboPersistido(null);
				window.localStorage.removeItem(storageKey);
			} else {
				const err = await res.json();
				setToast({ type: 'error', message: err.message || 'No se pudo eliminar el recibo en el servidor.' });
			}
		} catch (error) {
			console.error('Error al eliminar recibo:', error);
			setToast({ type: 'error', message: 'Error al eliminar el recibo.' });
		}
	};

	const guardarNotaAdmisiones = async () => {
		if (!prospectoSeleccionado?.id) {
			setToast({ type: 'error', message: 'Selecciona un prospecto antes de guardar la nota.' });
			return;
		}

		const texto = notaAdmisiones.trim();
		if (!texto) {
			setToast({ type: 'error', message: 'Escribe una nota para poder guardarla.' });
			return;
		}

		setGuardandoNotaAdmisiones(true);

		try {
			const payload = {
				ta: '',
				temp: '',
				fc: '',
				fr: '',
				peso: '',
				talla: '',
				evolucionCuadroClinico: '',
				exploracionFisica: '',
				resultadosEstudios: '',
				diagnosticoProblemas: '',
				pronosticos: '',
				tratamientoIndicaciones: '',
				observaciones: texto,
				fechaProximaSesion: null,
				medicoAsignado: 'ADMISIONES',
			};

			const response = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/notas-evolucion`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'No se pudo guardar la nota de admisiones.');
			}

			const detalleResponse = await fetch(`${API_BASE}/pacientes/${prospectoSeleccionado.id}/expediente`);
			if (detalleResponse.ok) {
				const data = await detalleResponse.json();
				setDetalleExpediente(data);
			}

			setNotaAdmisiones('');
			setToast({ type: 'success', message: 'Nota de admisiones guardada correctamente.' });
		} catch (error) {
			console.error('Error guardando nota de admisiones:', error);
			setToast({ type: 'error', message: error.message || 'No se pudo guardar la nota.' });
		} finally {
			setGuardandoNotaAdmisiones(false);
		}
	};

	useEffect(() => {
		if (!expedienteIdParam) return;

		const controller = new AbortController();

		const cargarProspectoDesdeRuta = async () => {
			try {
				const response = await fetch(`${API_BASE}/pacientes/${expedienteIdParam}`, {
					signal: controller.signal,
				});

				if (!response.ok) return;

				const paciente = await response.json();
				setProspectoSeleccionado(paciente);
				setBusquedaExpediente(getNombreProspecto(paciente));
				setExpedienteExpandidoId(paciente?.id || null);
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('No se pudo cargar el expediente desde la ruta:', error);
				}
			}
		};

		cargarProspectoDesdeRuta();
		return () => controller.abort();
	}, [expedienteIdParam]);

	useEffect(() => {
		const query = busquedaExpediente.trim();
		const controller = new AbortController();

		if (query.length < 2) {
			setResultadosBusqueda([]);
			setCargandoBusqueda(false);
			setErrorBusqueda('');
			setIndiceResaltado(-1);
			return () => controller.abort();
		}

		const buscarProspectos = async () => {
			try {
				setCargandoBusqueda(true);
				setErrorBusqueda('');
				const response = await fetch(`${API_BASE}/pacientes/busqueda?query=${encodeURIComponent(query)}`, {
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
					const unico = resultados[0];
					// Evitar bucle: si el resultado único ya es el mismo paciente seleccionado, no re-disparar la selección
					if (String(unico?.id || '') !== String(prospectoSeleccionado?.id || '')) {
						seleccionarProspecto(unico);
					}
					setIndiceResaltado(0);
				} else {
					setIndiceResaltado(resultados.length > 0 ? 0 : -1);
				}
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Error al buscar prospectos de expediente:', error);
					setErrorBusqueda('No se pudo consultar prospectos. Revisa backend o conexión.');
				}
			} finally {
				setCargandoBusqueda(false);
			}
		};

		buscarProspectos();
		return () => controller.abort();
	}, [busquedaExpediente, prospectoSeleccionado?.id]);

	// --- MODIFICACIÓN 3: Actualizamos el UseEffect que carga el detalle ---
	useEffect(() => {
		const pacienteId = prospectoSeleccionado?.id;
		const controller = new AbortController();

		if (!pacienteId) {
			setDetalleExpediente(null);
			setSeguimientosExpediente([]);
			setErrorDetalleExpediente('');
			setCargandoDetalleExpediente(false);
			setTieneValoracionMedica(false); // Reseteamos la bandera
			return () => controller.abort();
		}

		const cargarDetalle = async () => {
			try {
				setCargandoDetalleExpediente(true);
				setErrorDetalleExpediente('');
				
				// 1. Cargar el expediente base
				const response = await fetch(`${API_BASE}/pacientes/${pacienteId}/expediente`, {
					signal: controller.signal,
				});

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || 'No se pudo cargar el expediente del paciente.');
				}

				const data = await response.json();
				setDetalleExpediente(data);

				try {
					const seguimientosRes = await fetch(`${API_BASE}/seguimientos/tablas`, {
						signal: controller.signal,
					});

					if (seguimientosRes.ok) {
						const tablas = await seguimientosRes.json();
						const todosLosSeguimientos = [
							...(Array.isArray(tablas?.citas) ? tablas.citas : []),
							...(Array.isArray(tablas?.llamadas) ? tablas.llamadas : []),
						];
						setSeguimientosExpediente(todosLosSeguimientos.filter((item) => String(item?.pacienteId || '') === String(pacienteId)));
					} else {
						setSeguimientosExpediente([]);
					}
				} catch (seguimientosError) {
					if (seguimientosError.name !== 'AbortError') {
						setSeguimientosExpediente([]);
					}
				}

				// 2. PREGUNTAR AL BACKEND SI EL MÉDICO YA HIZO LA VALORACIÓN
				try {
					const valoracionRes = await fetch(`${API_BASE}/valoraciones/paciente/${pacienteId}`, {
						signal: controller.signal,
					});
					
					if (valoracionRes.ok) {
						setTieneValoracionMedica(true); // Sí existe la valoración
					} else if (valoracionRes.status === 404) {
						// Endpoint no existe o no hay valoración
						setTieneValoracionMedica(false);
					} else {
						setTieneValoracionMedica(false);
					}
				} catch (valoracionError) {
					// Si hay error de red, asumimos que no hay valoración
					if (valoracionError.name !== 'AbortError') {
						setTieneValoracionMedica(false);
					}
				}

			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Error al cargar detalle de expediente:', error);
					setDetalleExpediente(null);
					setSeguimientosExpediente([]);
					setErrorDetalleExpediente('No se pudo cargar el detalle del expediente del prospecto.');
				}
			} finally {
				setCargandoDetalleExpediente(false);
			}
		};

		cargarDetalle();
		return () => controller.abort();
	}, [prospectoSeleccionado?.id]);

	useEffect(() => {
		if (!prospectoSeleccionado?.id) return;
		cargarRecibosPersistidos(prospectoSeleccionado.id);
	}, [prospectoSeleccionado?.id]);

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
			{ label: 'Clave', value: prospectoSeleccionado.clavePaciente || '--' },
			{ label: 'Ingreso', value: formatDateValue(prospectoSeleccionado.fechaIngreso || prospectoSeleccionado.createdAt || prospectoSeleccionado.fechaAtencion || prospectoSeleccionado.fechaRegistro) },
			{ label: 'Estado', value: formatEstadoPacienteDisplay(prospectoSeleccionado.estadoPaciente) },
		];
	}, [prospectoSeleccionado]);

	const estadoPacienteActual = useMemo(() => String(prospectoSeleccionado?.estadoPaciente || '').toUpperCase(), [prospectoSeleccionado?.estadoPaciente]);
	const pagoValidadoFinanzas = useMemo(() => Boolean(prospectoSeleccionado?.pagoValidado), [prospectoSeleccionado?.pagoValidado]);
	const tieneReciboAdjunto = useMemo(() => recibosSubidos.length > 0, [recibosSubidos]);
	const tieneReciboValidado = useMemo(
		() => recibosSubidos.some((recibo) => String(recibo.estadoPago || '').toUpperCase() === 'VALIDADO'),
		[recibosSubidos]
	);
	const puedeValidarIngresoOficial = useMemo(() => estadoPacienteActual === 'PROSPECTO' && pagoValidadoFinanzas && tieneReciboValidado && tieneValoracionMedica, [estadoPacienteActual, pagoValidadoFinanzas, tieneReciboValidado, tieneValoracionMedica]);
	const badgeEstadoRecibo = useMemo(() => {
		if (estadoPacienteActual === 'DENEGADO') return 'DENEGADO';
		if (estadoPacienteActual === 'INGRESADO') return 'INGRESADO';
		if (!pagoValidadoFinanzas) return 'PENDIENTE';
		if (tieneReciboValidado) return 'VALIDADO';
		if (tieneReciboAdjunto) return 'PENDIENTE VALIDACIÓN';
		return 'PENDIENTE';
	}, [estadoPacienteActual, pagoValidadoFinanzas, tieneReciboAdjunto, tieneReciboValidado]);

	// --- MODIFICACIÓN 4: Pasamos tieneValoracionMedica al useMemo ---
	const documentosProspecto = useMemo(() => buildDocumentosProspecto(prospectoSeleccionado, detalleExpediente, tieneValoracionMedica), [prospectoSeleccionado, detalleExpediente, tieneValoracionMedica]);
	const notasProspecto = useMemo(() => buildNotasProspecto(prospectoSeleccionado, detalleExpediente, prospectoSeleccionado), [prospectoSeleccionado, detalleExpediente]);
	const timelineProspecto = useMemo(() => buildTimeline({
		...detalleExpediente,
		seguimientos: [
			...(Array.isArray(detalleExpediente?.seguimientos) ? detalleExpediente.seguimientos : []),
			...seguimientosExpediente,
		],
	}), [detalleExpediente, seguimientosExpediente]);
	const diagnosticoReadOnlyData = useMemo(
		() => buildDiagnosticoReadOnlyData(prospectoSeleccionado, detalleExpediente),
		[prospectoSeleccionado, detalleExpediente]
	);

	return (
		<div className="min-h-screen bg-slate-100 text-slate-900">
			<div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
				<AdminHeader submodule="Expediente de Admisiones" />

				<main className="space-y-5">
				<div className="grid gap-4 md:grid-cols-[220px_1fr]">
					<AdmisionesSidebar />
					<div className="space-y-5">
						<PrimarySidebarActionButton
							label="Volver a admisiones"
							onClick={() => navigate('/admisiones')}
							icon={<ArrowRight size={18} />}
						/>
							
						
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
							
								

								<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
									{tarjetasGeneral.map((item) => (
										<article key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
											<p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
											<p className="mt-3 text-2xl font-black text-slate-900">{item.value}</p>
										</article>
									))}
								</section>
							
						)}
{tab === 'docs' && (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 animate-fadeIn">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Expediente Digital</p>
                <h3 className="text-2xl font-black text-slate-900">Documentación y Registros</h3>
		<AdmisionesToast message={toast.message} variant={toast.type || 'info'} onClose={() => setToast({ type: '', message: '' })} />
            </div>
            <FileText className="text-[#7E1D3B]" size={28} />
        </div>

        {!prospectoSeleccionado ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
                <Search className="mx-auto mb-3 text-slate-300" size={40} />
                <p className="text-sm text-slate-600">Selecciona un prospecto en el buscador para cargar sus documentos.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {/* 1. SECCIÓN ESPECIAL: VALORACIÓN DIAGNÓSTICA (Snapshots) */}
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition-all hover:border-[#7E1D3B]/30 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-base font-black text-slate-900">Llamada incial </p>
                                {!diagnosticoReadOnlyData?.tieneSnapshot ? (
                                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                                        <X size={10} /> Incompleto
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                                        Sincronizado
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">Formato de entrevista inicial y criterios de internamiento.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setDiagnosticoTab('solicitante');
                                setModalLlamadaInicialAbierto(true);
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            Ver Consulta
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admisiones/valoracion-diagnostica', {
                                state: {
                                    pacienteId: prospectoSeleccionado?.id,
		solicitanteId: prospectoSeleccionado?.solicitante?.id || detalleExpediente?.llamadaInicial?.solicitante?.id || null,
									prospecto: prospectoSeleccionado || null,
									detalleExpediente: detalleExpediente || null,
									diagnosticoReadOnlyData: diagnosticoReadOnlyData || null,
                                    llamadaInicial: detalleExpediente?.llamadaInicial || null,
                                },
                            })}
                            className="rounded-xl bg-[#7E1D3B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#63162e]"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>

                {/* SECCIÓN: RECIBO DE PAGO */}
				<div className={`rounded-[28px] border p-5 transition-colors md:p-6 ${badgeEstadoRecibo === 'PENDIENTE' ? 'border-[#7E1D3B]/20 bg-[#7E1D3B]/5' : 'border-emerald-100 bg-emerald-50/50'}`}>
							{estadoPacienteActual === 'DENEGADO' ? (
								<div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
									La valoración diagnóstica fue denegada. No se permite subir ni generar recibos de pago.
								</div>
							) : !pagoValidadoFinanzas ? (
								<div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
									Esperando validación de Finanzas.
								</div>
							) : null}
					<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div className="flex items-start gap-4 flex-1">
							<div className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${badgeEstadoRecibo === 'PENDIENTE' ? 'bg-[#7E1D3B]/10 text-[#7E1D3B]' : 'bg-emerald-100 text-emerald-700'}`}>
								<FileText size={24} />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<p className="text-base font-black text-slate-900">Recibo de Pago</p>
									<span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badgeEstadoRecibo === 'PENDIENTE' ? 'bg-[#7E1D3B]/10 text-[#7E1D3B]' : badgeEstadoRecibo === 'INGRESADO' ? 'bg-[#7E1D3B]/10 text-[#7E1D3B]' : 'bg-emerald-100 text-emerald-700'}`}>
										{badgeEstadoRecibo}
									</span>
								</div>
								<p className="text-xs text-slate-500">Generar y subir recibos firmados como evidencia de pago.</p>

								{tieneReciboAdjunto && (
									<div className="mt-3 space-y-2">
										{recibosSubidos.map((recibo, idx) => {
											const claveOficial = recibo.tokenGenerado || recibo.nombre || prospectoSeleccionado?.clavePaciente || `INST-${new Date().getFullYear()}-${prospectoSeleccionado?.id || ''}`;
											return (
												<div key={idx} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
													<div className="flex min-w-0 items-center gap-3">
														<div className="rounded-lg bg-slate-100 p-2 text-slate-600">
															<Paperclip size={16} />
														</div>
														<div className="min-w-0">
															<p className="truncate text-sm font-bold text-slate-900">{claveOficial}</p>
															<p className="text-xs text-slate-500">{recibo.fecha}</p>
														</div>
													</div>
													<div className="flex items-center gap-2">
														<span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
															<CheckCircle2 size={12} />
															✓ Validado
														</span>
														<button
															onClick={() => eliminarRecibo(recibo)}
															disabled={generandoToken}
															className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
														>
															<X size={14} />
														</button>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
						<div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
							<button
								type="button"
								onClick={() => {
									if (prospectoSeleccionado?.id) setModalReciboAbierto(true);
								}}
								disabled={!prospectoSeleccionado?.id || estadoPacienteActual === 'DENEGADO' || generandoRecibo}
								className="rounded-xl border border-[#7E1D3B]/30 bg-white px-4 py-2 text-xs font-bold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/5 flex items-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-white"
							>
								<Download size={14} />
								{generandoRecibo ? 'Generando...' : 'Generar'}
							</button>
							<label className={`rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition flex items-center gap-2 whitespace-nowrap ${!pagoValidadoFinanzas ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#7E1D3B] text-white hover:bg-[#63162e] cursor-pointer'}`}>
								<Upload size={14} />
								Subir firmado
								<input
									type="file"
									accept=".pdf,.jpg,.jpeg,.png"
									onChange={manejarCargaRecibo}
									disabled={cargandoRecibo || !pagoValidadoFinanzas}
									className="hidden"
								/>
							</label>
						</div>
					</div>

					{puedeValidarIngresoOficial && (
						<button
							type="button"
							onClick={generarTokenIngreso}
							disabled={generandoToken}
							className="mt-4 w-full rounded-2xl bg-[#7E1D3B] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#63162e] disabled:cursor-wait disabled:opacity-70"
						>
							{generandoToken ? 'Procesando validación...' : 'VALIDAR INGRESO OFICIAL'}
						</button>
					)}
				</div>

				{/* 2. LISTADO DE DOCUMENTOS PDF Y REGISTROS DINÁMICOS */}

				{/* Tarjeta: Estudio Socioeconómico Digital */}
				{prospectoSeleccionado && (
					<div className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
						<div className="flex items-center gap-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B]">
								<Briefcase size={20} />
							</div>
							<div>
								<p className="text-sm font-bold text-slate-900">Estudio Socioeconómico Digital</p>
								<p className="text-xs text-slate-500">Registro del estudio socioeconómico y versión PDF.</p>
							</div>
						</div>

						<div className="flex gap-2 opacity-100">
							{estudioPdfExists && estudioDescargaUrl ? (
								<a href={estudioDescargaUrl} target="_blank" rel="noreferrer" title="Descargar PDF" className="rounded-lg p-2 text-[#7E1D3B] hover:bg-slate-50">
									<ArrowRight size={18} />
								</a>
							) : estudioPdfExists && !estudioDescargaUrl ? (
								// indicador genérico si backend reporta existencia pero no hay URL
								<span className="rounded-lg p-2 text-slate-500">PDF disponible</span>
							) : (
								<button
									type="button"
									onClick={() => navigate('/admisiones/estudio-socioeconomico', { state: { pacienteId: prospectoSeleccionado?.id, datosBase: prospectoSeleccionado || null, solicitante: prospectoSeleccionado?.solicitante || detalleExpediente?.llamadaInicial?.solicitante || null } })}
									className="rounded-xl bg-[#7E1D3B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#63162e]"
								>
									Realizar Estudio Ahora
								</button>
							)}
						</div>
					</div>
				)}

				<div className="grid gap-3">
                    {documentosProspecto.length > 0 ? (
                        documentosProspecto.map((doc, idx) => (
                            <div key={`${doc.nombre}-${idx}`} className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-4">
									<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${doc.estado === 'DENEGADO' ? 'bg-rose-50 text-rose-600' : doc.estado === 'Adjunto' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
										{doc.estado === 'DENEGADO' ? <FileX size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900">{doc.nombre}</p>
											<span className={`text-[10px] font-bold uppercase ${doc.estado === 'DENEGADO' ? 'text-rose-600' : doc.estado === 'Adjunto' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                • {doc.estado}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">{doc.detalle}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    {doc.verUrl && (
                                        <a href={doc.verUrl} target="_blank" rel="noreferrer" title="Visualizar" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                            <Search size={18} />
                                        </a>
                                    )}
                                    {doc.descargaUrl && (
                                        <a href={doc.descargaUrl} target="_blank" rel="noreferrer" title="Descargar" className="rounded-lg p-2 text-[#7E1D3B] hover:bg-rose-50">
                                            <ArrowRight size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-sm text-slate-400">No hay documentos adicionales registrados.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
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
										{prospectoSeleccionado ? (
											<div className="mb-4 rounded-2xl border border-[#7E1D3B]/20 bg-rose-50/40 p-4">
												<p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#7E1D3B]">Nueva nota de admisiones</p>
												<textarea
													value={notaAdmisiones}
													onChange={(event) => {
														setNotaAdmisiones(event.target.value);
													}}
													placeholder="Escribe aquí una nota administrativa de admisiones..."
													className="min-h-[92px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none transition focus:border-[#7E1D3B]/40 focus:ring-2 focus:ring-[#7E1D3B]/15"
												/>
												<div className="mt-3 flex items-center justify-end gap-3">
													<button
														type="button"
														onClick={guardarNotaAdmisiones}
														disabled={guardandoNotaAdmisiones}
														className="rounded-xl bg-[#7E1D3B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#63162e] disabled:cursor-not-allowed disabled:opacity-60"
													>
														{guardandoNotaAdmisiones ? 'Guardando...' : 'Guardar nota'}
													</button>
												</div>
											</div>
										) : null}
									<div className="space-y-3">
											{notasProspecto.map((nota) => (
												<div key={nota.id} className={`rounded-2xl border p-4 text-sm leading-6 ${nota.categoria === 'rechazo' || String(nota.autor || '').includes('RECHAZO') ? 'border-rose-200 bg-rose-50/80 text-rose-900' : 'border-dashed border-slate-200 bg-slate-50/70 text-slate-700'}`}>
													<div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
														<span className={`font-bold uppercase tracking-[0.16em] ${nota.categoria === 'rechazo' || String(nota.autor || '').includes('RECHAZO') ? 'text-rose-700' : nota.tipo === 'admisiones' ? 'text-[#7E1D3B]' : 'text-slate-500'}`}>{nota.autor || 'Sistema'}</span>
														{(nota.categoria === 'rechazo' || String(nota.autor || '').includes('RECHAZO')) && (
															<span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 font-bold uppercase tracking-[0.14em] text-rose-700">
																<AlertTriangle size={11} />
																Rechazo administrativo
															</span>
														)}
														<span className="text-slate-400">{nota.fecha ? `${formatDateValue(nota.fecha)} • ${formatTimeValue(nota.fecha)}` : ''}</span>
													</div>
													{nota.texto}
												</div>
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
									<h3 className="text-2xl font-black text-slate-900">Seguimientos y notas del expediente</h3>
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
							<div className="grid gap-3 md:grid-cols-4">
								<button
									type="button"
									onClick={() => navigate('/admisiones/estudio-socioeconomico', {
										state: {
											pacienteId: prospectoSeleccionado?.id,
											datosBase: prospectoSeleccionado || null,
											solicitante: prospectoSeleccionado?.solicitante || detalleExpediente?.llamadaInicial?.solicitante || null,
										},
									})}
									className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12"
								>
									Abrir estudio socioeconómico
								</button>
									<button type="button" onClick={() => navigate('/admisiones/valoracion-diagnostica', {
										state: {
											pacienteId: prospectoSeleccionado?.id,
											solicitanteId: prospectoSeleccionado?.solicitante?.id || detalleExpediente?.llamadaInicial?.solicitante?.id || null,
											prospecto: prospectoSeleccionado || null,
											detalleExpediente: detalleExpediente || null,
											diagnosticoReadOnlyData: diagnosticoReadOnlyData || null,
											llamadaInicial: detalleExpediente?.llamadaInicial || null,
										},
									})} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Abrir valoración diagnóstica</button>
									<button
										type="button"
										onClick={() => setModalRechazoAbierto(true)}
										disabled={estadoPacienteActual === 'INGRESADO' || estadoPacienteActual === 'DENEGADO'}
										className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
									>
										Registrar rechazo
									</button>
								<button type="button" onClick={() => navigate('/admisiones')} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Volver a inicio de admisiones</button>
							</div>
						</section>
					</div>
				</div>
				</main>

				{modalLlamadaInicialAbierto && diagnosticoReadOnlyData ? (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
						<div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]">
							<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Diagnóstico inicial</p>
									<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Consulta del diagnóstico (solo lectura)</h3>
									<p className="mt-1 text-sm text-slate-500">Esta vista es informativa. Para guardar cambios usa el botón Actualizar.</p>
								</div>
								<button onClick={() => setModalLlamadaInicialAbierto(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
									<X size={20} />
								</button>
							</div>

							<div className="border-b border-slate-200 px-5 py-3 md:px-6">
								<div className="grid gap-2 sm:grid-cols-2">
									<button
										type="button"
										onClick={() => setDiagnosticoTab('solicitante')}
										className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${diagnosticoTab === 'solicitante' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
									>
										Datos del Solicitante
									</button>
									<button
										type="button"
										onClick={() => setDiagnosticoTab('prospecto')}
										className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${diagnosticoTab === 'prospecto' ? 'bg-[#7E1D3B] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
									>
										Datos del Prospecto
									</button>
								</div>
							</div>

							<div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
								{diagnosticoTab === 'solicitante' ? (
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
										<ReadOnlySelect label="Fuente de referencia" value={diagnosticoReadOnlyData.solicitante.fuenteReferencia} />
										<ReadOnlyField label="Nombre(s)" value={diagnosticoReadOnlyData.solicitante.nombres} />
										<ReadOnlyField label="Apellido paterno" value={diagnosticoReadOnlyData.solicitante.apellidoPaterno} />
										<ReadOnlyField label="Apellido materno" value={diagnosticoReadOnlyData.solicitante.apellidoMaterno} />
										<ReadOnlyField label="Lugar de donde nos visitan" value={diagnosticoReadOnlyData.solicitante.lugarVisita} />
										<ReadOnlyField label="A qué se dedica" value={diagnosticoReadOnlyData.solicitante.dedicacion} />
										<ReadOnlyField label="Parentesco con el paciente" value={diagnosticoReadOnlyData.solicitante.parentesco} />
										<ReadOnlyField label="Número teléfono" value={diagnosticoReadOnlyData.solicitante.telefono} />
										<ReadOnlyField label="Número celular" value={diagnosticoReadOnlyData.solicitante.celular} />

										<div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 md:col-span-2 xl:col-span-3">
											<p className="mb-3 text-sm font-bold text-[#7E1D3B]">Dirección del solicitante</p>
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
												<ReadOnlyField label="Calle" value={diagnosticoReadOnlyData.solicitante.direccionCalle} />
												<ReadOnlyField label="No. Ext." value={diagnosticoReadOnlyData.solicitante.direccionNoExt} />
												<ReadOnlyField label="No. Int." value={diagnosticoReadOnlyData.solicitante.direccionNoInt} />
												<ReadOnlyField label="Colonia" value={diagnosticoReadOnlyData.solicitante.direccionColonia} />
												<ReadOnlyField label="Mpio. o delegación" value={diagnosticoReadOnlyData.solicitante.direccionMunicipioDelegacion} />
												<ReadOnlyField label="C.P." value={diagnosticoReadOnlyData.solicitante.direccionCp} />
												<ReadOnlyField label="Ciudad o estado" value={diagnosticoReadOnlyData.solicitante.direccionCiudadEstado} />
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-8">
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
											<ReadOnlyField label="Nombre(s)" value={diagnosticoReadOnlyData.prospecto.nombres} />
											<ReadOnlyField label="Apellido paterno" value={diagnosticoReadOnlyData.prospecto.apellidoPaterno} />
											<ReadOnlyField label="Apellido materno" value={diagnosticoReadOnlyData.prospecto.apellidoMaterno} />
											<ReadOnlyField label="Edad" value={diagnosticoReadOnlyData.prospecto.edad} type="number" />
											<ReadOnlySelect label="Estado civil" value={diagnosticoReadOnlyData.prospecto.estadoCivil} />
											<ReadOnlyField label="Cuántos hijos tiene" value={diagnosticoReadOnlyData.prospecto.hijos} type="number" />
											<ReadOnlySelect label="Escolaridad" value={diagnosticoReadOnlyData.prospecto.escolaridad} />
											<ReadOnlyField label="Origen" value={diagnosticoReadOnlyData.prospecto.origen} />
											<ReadOnlyField label="Teléfono de contacto" value={diagnosticoReadOnlyData.prospecto.telefono} />
											<ReadOnlyField label="Ocupación" value={diagnosticoReadOnlyData.prospecto.dedicacion} />
											<ReadOnlySelect label="Sustancia de consumo" value={diagnosticoReadOnlyData.prospecto.sustanciaConsumo} />
										</div>

										<div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
											<p className="mb-3 text-sm font-bold text-[#7E1D3B]">Dirección del prospecto</p>
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
												<ReadOnlyField label="Calle" value={diagnosticoReadOnlyData.prospecto.direccionCalle} />
												<ReadOnlyField label="No. Ext." value={diagnosticoReadOnlyData.prospecto.direccionNoExt} />
												<ReadOnlyField label="No. Int." value={diagnosticoReadOnlyData.prospecto.direccionNoInt} />
												<ReadOnlyField label="Colonia" value={diagnosticoReadOnlyData.prospecto.direccionColonia} />
												<ReadOnlyField label="Mpio. o delegación" value={diagnosticoReadOnlyData.prospecto.direccionMunicipioDelegacion} />
												<ReadOnlyField label="C.P." value={diagnosticoReadOnlyData.prospecto.direccionCp} />
												<ReadOnlyField label="Ciudad o estado" value={diagnosticoReadOnlyData.prospecto.direccionCiudadEstado} />
											</div>
										</div>

										<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<p className="mb-4 text-sm font-bold uppercase text-slate-700">Valoración y criterios de internamiento</p>
											<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
												<ReadOnlyRadio
													label="¿Está dispuesto a internarse?"
													selectedValue={diagnosticoReadOnlyData.prospecto.internamiento}
													options={[
														{ value: 'acepta', label: 'Sí acepta' },
														{ value: 'no', label: 'No acepta' },
														{ value: 'duda', label: 'Duda' },
													]}
												/>
												<ReadOnlyRadio
													label="Se requiere intervenir"
													selectedValue={diagnosticoReadOnlyData.prospecto.criterioInternamiento}
													options={[
														{ value: 'si', label: 'Sí' },
														{ value: 'no', label: 'No' },
													]}
												/>
											</div>
											<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
												<ReadOnlySelect label="¿Ha estado en tratamiento anteriormente?" value={diagnosticoReadOnlyData.prospecto.tratamientoAnterior} />
												<ReadOnlyField label="Posibilidades económicas" value={diagnosticoReadOnlyData.prospecto.posibilidadesEconomicas} />
												<ReadOnlyField label="Conclusión" value={diagnosticoReadOnlyData.prospecto.conclusionIntervencion} />
											</div>
										</div>

										<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<p className="mb-4 text-sm font-bold uppercase text-slate-700">Seguimiento y programación</p>
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<ReadOnlySelect label="Tipo de llamada inicial" value={diagnosticoReadOnlyData.prospecto.llamarPaciente} />
												<ReadOnlySelect label="Estado de seguimiento" value={diagnosticoReadOnlyData.prospecto.estadoSeguimiento} />
												<ReadOnlyField label="Fecha de cita o llamada" value={diagnosticoReadOnlyData.prospecto.fechaCita} type="datetime-local" />
												<ReadOnlyField label="Acuerdo" value={diagnosticoReadOnlyData.prospecto.acuerdo} />
											</div>
										</div>
									</div>
								)}
							</div>

							<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 md:px-6">
								<button
									type="button"
									onClick={() => setModalLlamadaInicialAbierto(false)}
									className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
								>
									Cerrar
								</button>
								<button
									type="button"
									onClick={() => navigate('/admisiones/valoracion-diagnostica', {
										state: {
											pacienteId: prospectoSeleccionado?.id,
											solicitanteId: prospectoSeleccionado?.solicitante?.id || detalleExpediente?.llamadaInicial?.solicitante?.id || null,
											llamadaInicial: detalleExpediente?.llamadaInicial || null,
										},
									})}
									className="rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#63162e]"
								>
									Actualizar
								</button>
							</div>
						</div>
					</div>
				) : null}

				{modalRechazoAbierto ? (
					<div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
						<div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]">
							<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-600">Rechazo administrativo</p>
									<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Especifica el motivo del rechazo</h3>
									<p className="mt-1 text-sm text-slate-500">Este cambio dejará el expediente como denegado y registrará una nota administrativa.</p>
								</div>
								<button onClick={() => setModalRechazoAbierto(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-rose-300 hover:text-rose-600">
									<X size={20} />
								</button>
							</div>

							<div className="space-y-4 px-5 py-5 md:px-6">
								<div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-900">
									<p className="font-bold uppercase tracking-[0.16em]">Paciente</p>
									<p className="mt-1 font-semibold">{getNombreProspecto(prospectoSeleccionado) || 'Sin nombre'}</p>
									<p className="text-xs text-rose-700">Clave: {prospectoSeleccionado?.clavePaciente || '--'} • Estado actual: {formatEstadoPacienteDisplay(prospectoSeleccionado?.estadoPaciente)}</p>
								</div>

								<div>
									<label className="mb-2 block text-sm font-bold text-slate-700">Motivo del rechazo</label>
									<textarea
										value={motivoRechazo}
										onChange={(event) => setMotivoRechazo(event.target.value)}
										rows={6}
										placeholder="Explica por qué se rechaza el ingreso: insuficiencia económica, falta de cupo, documentación incompleta, etc."
										className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 md:flex-row md:justify-end md:px-6">
								<button
									type="button"
									onClick={() => setModalRechazoAbierto(false)}
									className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
								>
									Cancelar
								</button>
								<button
									type="button"
									onClick={registrarRechazoAdministrativo}
									disabled={procesandoRechazo || !motivoRechazo.trim()}
									className="rounded-2xl border border-rose-300 bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-300"
								>
									{procesandoRechazo ? 'Registrando rechazo...' : 'Confirmar rechazo'}
								</button>
							</div>
						</div>
					</div>
				) : null}

				{/* MODAL PARA GENERAR RECIBO */}
				{modalReciboAbierto && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
						<div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.32)]">

							{/* ── HEADER ─────────────────────────────────── */}
							<div className="relative overflow-hidden bg-[#7E1D3B] px-6 py-5">
								<div className="relative z-10 flex items-start justify-between gap-4">
									<div>
										<p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Instituto Marakame · Admisiones</p>
										<h3 className="mt-0.5 text-xl font-black text-white md:text-2xl">Generador de Recibo</h3>
										<p className="mt-1 text-sm text-white/65">Los campos marcados se auto-completan desde el expediente.</p>
									</div>
									<button
										type="button"
										onClick={() => setModalReciboAbierto(false)}
										className="flex-shrink-0 rounded-full border border-white/20 bg-white/10 p-2 text-white/80 transition hover:bg-white/20"
									>
										<X size={18} />
									</button>
								</div>
								<div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5" />
								<div className="pointer-events-none absolute -bottom-12 -right-4 h-24 w-24 rounded-full bg-white/5" />
							</div>

							{/* ── BODY ───────────────────────────────────── */}
							<div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

								{/* Banner auto-completado */}
								{(datosRecibo.nombrePagador || datosRecibo.nombrePaciente) && (
									<div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
										<CheckCircle2 size={15} className="flex-shrink-0 text-emerald-600" />
										<p className="text-sm text-emerald-800">
											<span className="font-bold">Datos auto-completados</span> desde el expediente del paciente y del solicitante. Puedes editarlos si es necesario.
										</p>
									</div>
								)}

								{/* ── Sección 1: Quien paga ── */}
								<section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
									<div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
										<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B]">
											<User size={14} />
										</div>
										<div>
											<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Quien realiza el pago</p>
											<p className="text-[11px] font-medium text-slate-400">Solicitante / familiar responsable</p>
										</div>
									</div>
									<div className="space-y-4 p-5">
										<div>
											<p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Nombre completo *</p>
											<div className="grid gap-3 sm:grid-cols-3">
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Nombre(s)</label>
													<input type="text" value={datosRecibo.nombrePagador}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, nombrePagador: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Nombre(s)" />
												</div>
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Apellido paterno</label>
													<input type="text" value={datosRecibo.apellidoPaternoPagador}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoPaternoPagador: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Apellido paterno" />
												</div>
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Apellido materno</label>
													<input type="text" value={datosRecibo.apellidoMaternoPagador}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoMaternoPagador: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Apellido materno" />
												</div>
											</div>
										</div>
										<div>
											<p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Domicilio</p>
											<div className="grid gap-3 sm:grid-cols-2">
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Calle</label>
													<input type="text" value={datosRecibo.direccionCalle}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionCalle: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Calle" />
												</div>
												<div className="grid grid-cols-2 gap-3">
													<div>
														<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">No. Ext.</label>
														<input type="text" value={datosRecibo.direccionNoExt}
															onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionNoExt: e.target.value })}
															className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
															placeholder="No. Ext." />
													</div>
													<div>
														<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">No. Int.</label>
														<input type="text" value={datosRecibo.direccionNoInt}
															onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionNoInt: e.target.value })}
															className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
															placeholder="No. Int." />
													</div>
												</div>
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Colonia</label>
													<input type="text" value={datosRecibo.direccionColonia}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionColonia: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Colonia" />
												</div>
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Municipio / Delegación</label>
													<input type="text" value={datosRecibo.direccionMunicipioDelegacion}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionMunicipioDelegacion: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Municipio / Delegación" />
												</div>
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">C.P.</label>
													<input type="text" value={datosRecibo.codigoPostal}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, codigoPostal: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="C.P." />
												</div>
												<div>
													<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Ciudad / Estado</label>
													<input type="text" value={datosRecibo.direccionCiudadEstado}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionCiudadEstado: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Ciudad / Estado" />
												</div>
											</div>
										</div>
										<div className="grid gap-3 sm:grid-cols-3">
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">RFC</label>
												<input type="text" value={datosRecibo.rfc}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, rfc: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="RFC del pagador" />
											</div>
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Teléfono</label>
												<input type="tel" value={datosRecibo.telefonoPagador}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, telefonoPagador: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="Teléfono" />
											</div>
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Fecha de pago</label>
												<input type="date" value={datosRecibo.fechaPago}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, fechaPago: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15" />
											</div>
										</div>
									</div>
								</section>

								{/* ── Sección 2: Paciente ── */}
								<section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
									<div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
										<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B]">
											<HeartPulse size={14} />
										</div>
										<div>
											<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Datos del paciente</p>
											<p className="text-[11px] font-medium text-slate-400">Auto-completado desde el expediente</p>
										</div>
									</div>
									<div className="space-y-4 p-5">
										<div className="grid gap-3 sm:grid-cols-3">
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Nombre(s)</label>
												<input type="text" value={datosRecibo.nombrePaciente}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, nombrePaciente: e.target.value })}
													className="w-full rounded-xl border border-slate-100 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#7E1D3B]/40 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/10"
													placeholder="Auto-completado" />
											</div>
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Apellido paterno</label>
												<input type="text" value={datosRecibo.apellidoPaternoPaciente}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoPaternoPaciente: e.target.value })}
													className="w-full rounded-xl border border-slate-100 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#7E1D3B]/40 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/10"
													placeholder="Auto-completado" />
											</div>
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-semibold text-slate-500">Apellido materno</label>
												<input type="text" value={datosRecibo.apellidoMaternoPaciente}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoMaternoPaciente: e.target.value })}
													className="w-full rounded-xl border border-slate-100 bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#7E1D3B]/40 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/10"
													placeholder="Auto-completado" />
											</div>
										</div>
										<div className="grid gap-3 sm:grid-cols-2">
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Clave del paciente</label>
												<input type="text" value={datosRecibo.clavePaciente} readOnly
													className="w-full cursor-not-allowed rounded-xl border border-slate-100 bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-600 outline-none" />
											</div>
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Concepto del pago</label>
												<input type="text" value={datosRecibo.concepto}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, concepto: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="Ej. Tratamiento de desintoxicación" />
											</div>
										</div>
									</div>
								</section>

								{/* ── Sección 3: Importes ── */}
								<section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
									<div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
										<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B]">
											<Briefcase size={14} />
										</div>
										<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Importes del pago</p>
									</div>
									<div className="p-5">
										<div className="grid items-end gap-4 sm:grid-cols-3">
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Tratamiento ($)</label>
												<input type="number" value={datosRecibo.montoPago}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, montoPago: parseFloat(e.target.value) || 0 })}
													className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="0.00" step="0.01" min="0" />
											</div>
											<div>
												<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Programa familiar ($)</label>
												<input type="number" value={datosRecibo.montoPrograma}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, montoPrograma: parseFloat(e.target.value) || 0 })}
													className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="0.00" step="0.01" min="0" />
											</div>
											<div className="rounded-2xl bg-[#7E1D3B] px-4 py-3.5 text-center">
												<p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">Total</p>
												<p className="mt-0.5 text-2xl font-black leading-none text-white">
													${(parseFloat(datosRecibo.montoPago || 0) + parseFloat(datosRecibo.montoPrograma || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
												</p>
											</div>
										</div>
									</div>
								</section>

								{/* ── Sección 4: Quien recibe ── */}
								<section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
									<div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
										<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#7E1D3B]/10 text-[#7E1D3B]">
											<Paperclip size={14} />
										</div>
										<div>
											<p className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Responsable de Admisiones</p>
											<p className="text-[11px] font-medium text-slate-400">Quien firma el recibo como responsable</p>
										</div>
									</div>
									<div className="p-5">
										<label className="mb-1.5 ml-0.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Nombre de quien recibe el pago</label>
										<input type="text" value={datosRecibo.nombreRecibe}
											onChange={(e) => setDatosRecibo({ ...datosRecibo, nombreRecibe: e.target.value })}
											className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-[#7E1D3B]/50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/15"
											placeholder="Nombre completo del responsable de admisiones" />
									</div>
								</section>

								{/* ── Recibos subidos ── */}
								{recibosSubidos.length > 0 && (
									<section className="overflow-hidden rounded-[20px] border border-emerald-200 bg-emerald-50/50">
										<div className="flex items-center gap-3 border-b border-emerald-100 px-5 py-3.5">
											<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
												<FileText size={14} />
											</div>
											<p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900">Recibos firmados subidos</p>
										</div>
										<div className="space-y-3 p-5">
											{recibosSubidos.map((recibo, idx) => (
												<div key={idx} className="space-y-2.5">
													<div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3">
														<div className="flex min-w-0 items-center gap-3">
															<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
																<FileText size={15} />
															</div>
															<div className="min-w-0">
																<p className="truncate text-sm font-semibold text-slate-900">{recibo.nombre}</p>
																<p className="text-xs text-slate-500">{recibo.fecha}</p>
															</div>
														</div>
														<a href={recibo.url} target="_blank" rel="noreferrer"
															className="flex-shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100">
															<Download size={14} />
														</a>
													</div>
													<button onClick={generarTokenIngreso} disabled={generandoToken || tokenGenerado}
														className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
															tokenGenerado
																? 'cursor-not-allowed border-emerald-200 bg-emerald-50 text-emerald-700'
																: 'border-cyan-400 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg'
														}`}>
														{generandoToken ? 'Generando token...' : tokenGenerado ? (
															<><CheckCircle2 size={15} /> Token: <code className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs text-emerald-800">{tokenGenerado.substring(0, 10)}</code></>
														) : 'Generar token para ingreso'}
													</button>
												</div>
											))}
										</div>
									</section>
								)}
							</div>

							{/* ── FOOTER ─────────────────────────────────── */}
							<div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
								<button type="button" onClick={() => setModalReciboAbierto(false)}
									className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
									Cancelar
								</button>
								<div className="flex flex-wrap items-center gap-2">
									<label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${pagoValidadoFinanzas ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100' : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'}`}>
										<Upload size={15} />
										Subir firmado
										<input type="file" accept=".pdf,.jpg,.jpeg,.png"
											onChange={manejarCargaRecibo}
											disabled={cargandoRecibo || !pagoValidadoFinanzas}
											className="hidden" />
									</label>
									<button
										type="button"
										onClick={descargarRecibo}
										disabled={generandoRecibo || !datosRecibo.nombrePagador || datosRecibo.montoPago + datosRecibo.montoPrograma === 0}
										className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#63162e] disabled:cursor-not-allowed disabled:opacity-50"
									>
										<Download size={15} />
										{generandoRecibo ? 'Generando...' : 'Descargar PDF'}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ExpedienteAdmisiones;