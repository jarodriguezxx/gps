import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Search, Sparkles, X, Download, Upload, CheckCircle2, Briefcase, Phone, User, HeartPulse } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';
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

const toDateTimeLocalValue = (value) => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	const pad = (part) => String(part).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

const convertirNumeroALetra = (num) => {
	const numeros = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
	const decenas = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
	const centenas = ['ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
	
	const n = Math.floor(num);
	if (n === 0) return 'cero';
	if (n < 10) return numeros[n];
	if (n < 20) return decenas[n - 10];
	if (n < 100) {
		const dec = Math.floor(n / 10);
		const unit = n % 10;
		return unit === 0 ? decenas[dec + 8] : decenas[dec + 8] + ' y ' + numeros[unit];
	}
	if (n < 1000) {
		const cent = Math.floor(n / 100);
		const rest = n % 100;
		return cent === 1 && rest === 0 ? 'cien' : centenas[cent - 1] + (rest > 0 ? ' ' + convertirNumeroALetra(rest) : '');
	}
	return String(n);
};

const generarReciboHTML = (datos) => {
	const totalMonto = parseFloat(datos.montoPago || 0) + parseFloat(datos.montoPrograma || 0);
	const nombreCompletoPagador = `${datos.nombrePagador || ''} ${datos.apellidoPaternoPagador || ''} ${datos.apellidoMaternoPagador || ''}`.trim();
	
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<style>
				body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
				.recibo { border: 2px solid #333; padding: 30px; max-width: 800px; margin: 0 auto; }
				.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #7E1D3B; padding-bottom: 15px; }
				.header h1 { margin: 0; color: #7E1D3B; font-size: 28px; }
				.header p { margin: 5px 0; font-size: 12px; color: #666; }
				.numero-recibo { position: absolute; top: 20px; right: 30px; font-size: 14px; font-weight: bold; }
				.grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
				.grid-2 { grid-template-columns: 1fr 1fr; }
				.campo { margin-bottom: 12px; }
				.campo label { font-weight: bold; font-size: 10px; color: #333; display: block; margin-bottom: 2px; }
				.campo-valor { border-bottom: 1px solid #333; padding: 3px 0; font-size: 11px; }
				.full-width { grid-column: 1 / -1; }
				.tabla { width: 100%; border-collapse: collapse; margin: 20px 0; }
				.tabla th { background: #7E1D3B; color: white; padding: 8px; text-align: left; font-size: 11px; }
				.tabla td { border-bottom: 1px solid #ddd; padding: 8px; font-size: 11px; }
				.tabla tr:last-child td { border-bottom: 2px solid #333; }
				.firmas { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
				.firma { text-align: center; border-top: 1px solid #333; padding-top: 10px; font-size: 11px; }
				.firma-linea { margin-top: 60px; }
			</style>
		</head>
		<body>
			<div class="recibo">
				<div class="numero-recibo">Nº ${new Date().getTime().toString().slice(-4)}</div>
				<div class="header">
					<h1>RECIBO DE PAGO</h1>
					<p>Instituto Marakame • Centro de Tratamiento</p>
					<p>Fecha: ${new Date().toLocaleDateString('es-MX')}</p>
				</div>

				<div class="grid grid-2">
					<div class="campo">
						<label>Nombre(s):</label>
						<div class="campo-valor">${datos.nombrePagador || ''}</div>
					</div>
					<div class="campo">
						<label>Apellido paterno:</label>
						<div class="campo-valor">${datos.apellidoPaternoPagador || ''}</div>
					</div>
					<div class="campo">
						<label>Apellido materno:</label>
						<div class="campo-valor">${datos.apellidoMaternoPagador || ''}</div>
					</div>
					<div class="campo">
						<label>Fecha de pago:</label>
						<div class="campo-valor">${datos.fechaPago || ''}</div>
					</div>
					<div class="campo">
						<label>RFC:</label>
						<div class="campo-valor">${datos.rfc || ''}</div>
					</div>
					<div class="campo">
						<label>Teléfono:</label>
						<div class="campo-valor">${datos.telefonoPagador || ''}</div>
					</div>
				</div>

				<div style="border-top: 2px solid #7E1D3B; padding-top: 15px; margin: 20px 0;">
					<p style="font-weight: bold; margin-bottom: 8px;">Dirección:</p>
					<div class="grid grid-2">
						<div class="campo">
							<label>Calle:</label>
							<div class="campo-valor">${datos.direccionCalle || ''}</div>
						</div>
						<div class="campo">
							<label>No. Exterior:</label>
							<div class="campo-valor">${datos.direccionNoExt || ''}</div>
						</div>
						<div class="campo">
							<label>No. Interior:</label>
							<div class="campo-valor">${datos.direccionNoInt || ''}</div>
						</div>
						<div class="campo">
							<label>Colonia:</label>
							<div class="campo-valor">${datos.direccionColonia || ''}</div>
						</div>
						<div class="campo">
							<label>Municipio/Delegación:</label>
							<div class="campo-valor">${datos.direccionMunicipioDelegacion || ''}</div>
						</div>
						<div class="campo">
							<label>C.P.:</label>
							<div class="campo-valor">${datos.codigoPostal || ''}</div>
						</div>
						<div class="campo full-width">
							<label>Ciudad/Estado:</label>
							<div class="campo-valor">${datos.direccionCiudadEstado || ''}</div>
						</div>
					</div>
				</div>

				<div style="border: 2px solid #7E1D3B; padding: 15px; margin: 20px 0;">
					<div class="grid grid-2">
						<div class="campo">
							<label>Nombre(s) del paciente:</label>
							<div class="campo-valor">${datos.nombrePaciente || ''}</div>
						</div>
						<div class="campo">
							<label>Apellido paterno:</label>
							<div class="campo-valor">${datos.apellidoPaternoPaciente || ''}</div>
						</div>
						<div class="campo">
							<label>Apellido materno:</label>
							<div class="campo-valor">${datos.apellidoMaternoPaciente || ''}</div>
						</div>
						<div class="campo">
							<label>Clave del paciente:</label>
							<div class="campo-valor">${datos.clavePaciente || ''}</div>
						</div>
						<div class="campo full-width">
							<label>Concepto del pago:</label>
							<div class="campo-valor">${datos.concepto || ''}</div>
						</div>
					</div>
				</div>

				<table class="tabla">
					<thead>
						<tr>
							<th>Concepto de pago</th>
							<th style="text-align: right;">Monto</th>
						</tr>
					</thead>
					<tbody>
						${datos.montoPago > 0 ? `<tr><td>Tratamiento</td><td style="text-align: right;">$${parseFloat(datos.montoPago).toFixed(2)}</td></tr>` : ''}
						${datos.montoPrograma > 0 ? `<tr><td>Programa Familiar</td><td style="text-align: right;">$${parseFloat(datos.montoPrograma).toFixed(2)}</td></tr>` : ''}
						<tr style="font-weight: bold;">
							<td>TOTAL</td>
							<td style="text-align: right;">$${totalMonto.toFixed(2)}</td>
						</tr>
					</tbody>
				</table>

				<div class="campo full-width" style="margin-top: 20px;">
					<label>Cantidad en letra:</label>
					<div class="campo-valor" style="font-size: 13px; text-transform: capitalize;">${convertirNumeroALetra(Math.floor(totalMonto))} pesos con ${String(totalMonto).split('.')[1] || '00'} centavos</div>
				</div>

				<div class="firmas">
					<div class="firma">
						<div class="firma-linea"></div>
						<div>Persona que recibe el pago</div>
						<div>${datos.nombreRecibe || ''}</div>
					</div>
					<div class="firma">
						<div class="firma-linea"></div>
						<div>Persona que realiza el pago</div>
						<div>${nombreCompletoPagador}</div>
					</div>
				</div>
			</div>
		</body>
		</html>
	`;
};

const ExpedienteAdmisiones = () => {
	const navigate = useNavigate();
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
	const [modalLlamadaInicialAbierto, setModalLlamadaInicialAbierto] = useState(false);
	const [diagnosticoTab, setDiagnosticoTab] = useState('solicitante');
	const [modalReciboAbierto, setModalReciboAbierto] = useState(false);
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
	const [cargandoRecibo, setCargandoRecibo] = useState(false);
	const [tokenGenerado, setTokenGenerado] = useState(null);
	const [generandoToken, setGenerandoToken] = useState(false);
	const [expedienteModo, setExpedienteModo] = useState('prospecto');
	const seleccionarProspecto = async (prospecto) => {
		setProspectoSeleccionado(prospecto);
		setBusquedaExpediente(getNombreProspecto(prospecto));
		setMostrarResultados(false);
		setModalLlamadaInicialAbierto(false);
		setDiagnosticoTab('solicitante');

		// Consultar el estado real del paciente desde el backend
		try {
			const response = await fetch(`http://localhost:4000/api/pacientes/${prospecto.id}`);
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

		// Autocompletar datos del recibo con formato correcto
		setDatosRecibo(prev => ({
			...prev,
			nombrePaciente: prospecto.nombres || '',
			apellidoPaternoPaciente: prospecto.apellidoPaterno || '',
			apellidoMaternoPaciente: prospecto.apellidoMaterno || '',
			clavePaciente: prospecto.clavePaciente || formatClave(prospecto),
			direccionCalle: prospecto.direccionCalle || '',
			direccionNoExt: prospecto.direccionNoExt || '',
			direccionNoInt: prospecto.direccionNoInt || '',
			direccionColonia: prospecto.direccionColonia || '',
			direccionMunicipioDelegacion: prospecto.direccionMunicipioDelegacion || '',
			codigoPostal: prospecto.direccionCp || '',
			direccionCiudadEstado: prospecto.direccionCiudadEstado || '',
		}));
	};

	const descargarRecibo = () => {
		const html = generarReciboHTML(datosRecibo);
		const element = document.createElement('div');
		element.innerHTML = html;
		
		const opt = {
			margin: 5,
			filename: `recibo-${datosRecibo.nombrePaciente}-${new Date().getTime().toString().slice(-4)}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { orientation: 'portrait', unit: 'mm', format: 'letter' }
		};
		
		html2pdf().set(opt).from(element).save();
	};

	const manejarCargaRecibo = (event) => {
		const archivos = event.target.files;
		if (archivos && archivos.length > 0) {
			setCargandoRecibo(true);
			const archivo = archivos[0];
			
			// Simular carga (en producción enviarías al backend)
			setTimeout(() => {
				setRecibosSubidos(prev => [...prev, {
					nombre: archivo.name,
					fecha: new Date().toLocaleDateString('es-MX'),
					tamaño: `${(archivo.size / 1024).toFixed(2)} KB`,
					tipo: 'Recibo firmado',
					url: URL.createObjectURL(archivo)
				}]);
				setCargandoRecibo(false);
			}, 1000);
		}
	};

	const generarTokenIngreso = async () => {
		if (!recibosSubidos.length) {
			alert('Debe subir el recibo firmado antes de generar el token');
			return;
		}

		setGenerandoToken(true);

		try {
			// Llamar al backend para validar ingreso y generar token
			const response = await fetch(`http://localhost:4000/api/pacientes/${prospectoSeleccionado.id}/validar-ingreso`, {
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
				alert(`✅ Token generado exitosamente:\n\n${tokenGenerado}\n\nEl prospecto ahora es PACIENTE INGRESADO`);
				setTokenGenerado(null);
				setRecibosSubidos([]);
				// Recargar detalles del paciente para obtener estado actualizado
				if (prospectoSeleccionado?.id) {
					// Aquí podrías volver a cargar el detalle si lo necesitas
				}
			}, 500);
		} catch (error) {
			console.error('Error al generar token:', error);
			alert(`Error al generar el token: ${error.message}`);
		} finally {
			setGenerandoToken(false);
		}
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
				const response = await fetch(`http://localhost:4000/api/pacientes/busqueda?query=${encodeURIComponent(query)}`, {
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
		setModalLlamadaInicialAbierto(false);
		setDiagnosticoTab('solicitante');
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
							<section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
								<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7E1D3B]">Diseño de expediente</p>
										<h2 className="text-2xl font-black text-slate-900">Separado por Prospecto y Paciente</h2>
										<p className="mt-1 text-sm text-slate-500">Usa Prospecto para la admisión inicial y Paciente cuando ya existe una ficha activa en el sistema.</p>
									</div>
									<div className="inline-flex rounded-2xl bg-slate-100 p-1">
										<button
											type="button"
											onClick={() => setExpedienteModo('prospecto')}
											className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${expedienteModo === 'prospecto' ? 'bg-[#7E1D3B] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
										>
											Prospecto
										</button>
										<button
											type="button"
											onClick={() => setExpedienteModo('ingresado')}
											className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${expedienteModo === 'ingresado' ? 'bg-[#7E1D3B] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
										>
											Paciente
										</button>
									</div>
								</div>

								<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
									{(expedienteModo === 'prospecto' ? [
										{ title: 'Captura inicial', text: 'Datos del solicitante, contacto y origen de referencia.', icon: User },
										{ title: 'Llamadas y agenda', text: 'Citas, seguimiento telefónico y pendientes urgentes.', icon: Phone },
										{ title: 'Estudio socioeconómico', text: 'Evaluación social y económica previa al ingreso.', icon: FileText },
										{ title: 'Valoración diagnóstica', text: 'Criterios de internamiento y lectura clínica inicial.', icon: HeartPulse },
									] : [
										{ title: 'Paciente activo', text: 'Clave de paciente, estado actual y fecha de ingreso.', icon: CheckCircle2 },
										{ title: 'Evolución clínica', text: 'Notas, indicaciones y seguimiento de tratamiento.', icon: HeartPulse },
										{ title: 'Documentos', text: 'Recibos, formatos firmados y evidencia de ingreso.', icon: FileText },
										{ title: 'Salida / egreso', text: 'Preparación de cierre, alta o cambio de área.', icon: ArrowRight },
									]).map((item) => {
										const Icon = item.icon;

										return (
											<article key={item.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
												<div className="flex items-start gap-3">
													<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7E1D3B]/10 text-[#7E1D3B]">
														<Icon size={18} />
													</div>
													<div>
														<p className="font-black text-slate-900">{item.title}</p>
														<p className="mt-1 text-sm text-slate-500">{item.text}</p>
													</div>
												</div>
											</article>
										);
									})}
								</div>
							</section>
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
                                <p className="text-base font-black text-slate-900">Valoración Diagnóstica Inicial</p>
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
                <div className="flex flex-col gap-4 rounded-2xl border border-cyan-200 bg-cyan-50/80 p-5 transition-all hover:border-cyan-300 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 flex-shrink-0">
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-base font-black text-slate-900">Recibo de Pago</p>
                                {recibosSubidos.length === 0 ? (
                                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                                        <X size={10} /> Pendiente
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                                        {recibosSubidos.length} adjunto{recibosSubidos.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">Generar y subir recibos firmados como evidencia de pago.</p>
                            {recibosSubidos.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {recibosSubidos.map((recibo, idx) => (
                                        <div key={idx} className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 border border-emerald-100">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className="text-lg">📎</div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold text-slate-700 truncate">{recibo.nombre}</p>
                                                    <p className="text-xs text-slate-400">{recibo.fecha}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={generarTokenIngreso}
                                                disabled={generandoToken || tokenGenerado}
                                                className={`ml-2 text-xs font-bold px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                                                    tokenGenerado
                                                        ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-200'
                                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 border border-cyan-400'
                                                }`}
                                            >
                                                {generandoToken ? (
                                                    <>
                                                        <span className="animate-spin inline-block">⏳</span>
                                                        <span>Procesando...</span>
                                                    </>
                                                ) : tokenGenerado ? (
                                                    <>
                                                        <span>✅</span>
                                                        <span className="hidden sm:inline text-xs">{tokenGenerado.substring(0, 6)}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>🔑</span>
                                                        <span>Generar</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                        <button
                            type="button"
                            onClick={() => setModalReciboAbierto(true)}
                            className="rounded-xl border border-cyan-300 bg-white px-4 py-2 text-xs font-bold text-cyan-700 transition hover:bg-cyan-50 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Download size={14} />
                            Generar
                        </button>
                        <label className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-cyan-700 flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <Upload size={14} />
                            Subir firmado
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={manejarCargaRecibo}
                                disabled={cargandoRecibo}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* 2. LISTADO DE DOCUMENTOS PDF Y REGISTROS DINÁMICOS */}
                <div className="grid gap-3">
                    {documentosProspecto.length > 0 ? (
                        documentosProspecto.map((doc, idx) => (
                            <div key={`${doc.nombre}-${idx}`} className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${doc.estado === 'Adjunto' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900">{doc.nombre}</p>
                                            <span className={`text-[10px] font-bold uppercase ${doc.estado === 'Adjunto' ? 'text-emerald-500' : 'text-slate-400'}`}>
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
									<button type="button" onClick={() => navigate('/admisiones/valoracion-diagnostica', {
										state: {
											pacienteId: prospectoSeleccionado?.id,
											llamadaInicial: detalleExpediente?.llamadaInicial || null,
										},
									})} className="rounded-2xl border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 px-4 py-4 text-left text-sm font-semibold text-[#7E1D3B] transition hover:bg-[#7E1D3B]/12">Abrir valoración diagnóstica</button>
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

				{/* MODAL PARA GENERAR RECIBO */}
				{modalReciboAbierto && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
						<div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]">
							<div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.3em] text-[#7E1D3B]">Generador de Recibos</p>
									<h3 className="text-2xl font-black text-slate-900 md:text-3xl">Crear recibo de pago</h3>
									<p className="mt-1 text-sm text-slate-500">Complete los datos y descargue el PDF. El recibo no se guardará en el sistema.</p>
								</div>
								<button onClick={() => setModalReciboAbierto(false)} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#7E1D3B] hover:text-[#7E1D3B]">
									<X size={20} />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
								<div className="space-y-6">
									{/* SECCIÓN 1: Datos del Pagador */}
									<div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
										<h4 className="mb-4 text-sm font-bold uppercase text-amber-900">Datos de la persona que realiza el pago</h4>
										
										{/* Nombres desglosados */}
										<div className="mb-4">
											<p className="text-xs font-semibold text-slate-600 mb-3">Nombre completo *</p>
											<div className="grid gap-3 md:grid-cols-3">
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Nombre(s)</label>
													<input
														type="text"
														value={datosRecibo.nombrePagador}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, nombrePagador: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Nombre"
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Apellido paterno</label>
													<input
														type="text"
														value={datosRecibo.apellidoPaternoPagador}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoPaternoPagador: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Apellido paterno"
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Apellido materno</label>
													<input
														type="text"
														value={datosRecibo.apellidoMaternoPagador}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoMaternoPagador: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Apellido materno"
													/>
												</div>
											</div>
										</div>

										{/* Dirección desglosada */}
										<div className="mb-4">
											<p className="text-xs font-semibold text-slate-600 mb-3">Dirección</p>
											<div className="grid gap-3 md:grid-cols-2 mb-3">
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Calle</label>
													<input
														type="text"
														value={datosRecibo.direccionCalle}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionCalle: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Calle"
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">No. Exterior</label>
													<input
														type="text"
														value={datosRecibo.direccionNoExt}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionNoExt: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="No. Ext."
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">No. Interior</label>
													<input
														type="text"
														value={datosRecibo.direccionNoInt}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionNoInt: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="No. Int."
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Colonia</label>
													<input
														type="text"
														value={datosRecibo.direccionColonia}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionColonia: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Colonia"
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Municipio/Delegación</label>
													<input
														type="text"
														value={datosRecibo.direccionMunicipioDelegacion}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionMunicipioDelegacion: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Municipio/Delegación"
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">C.P.</label>
													<input
														type="text"
														value={datosRecibo.codigoPostal}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, codigoPostal: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="C.P."
													/>
												</div>
												<div className="md:col-span-2">
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Ciudad/Estado</label>
													<input
														type="text"
														value={datosRecibo.direccionCiudadEstado}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, direccionCiudadEstado: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Ciudad/Estado"
													/>
												</div>
											</div>
										</div>

										{/* Datos adicionales */}
										<div className="grid gap-3 md:grid-cols-2">
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Fecha de pago</label>
												<input
													type="date"
													value={datosRecibo.fechaPago}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, fechaPago: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
												/>
											</div>
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">RFC</label>
												<input
													type="text"
													value={datosRecibo.rfc}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, rfc: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="RFC"
												/>
											</div>
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Teléfono</label>
												<input
													type="tel"
													value={datosRecibo.telefonoPagador}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, telefonoPagador: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="Teléfono"
												/>
											</div>
										</div>
									</div>

									{/* SECCIÓN 2: Datos del Paciente */}
									<div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
										<h4 className="mb-4 text-sm font-bold uppercase text-rose-900">Datos del paciente</h4>
										
										{/* Nombres desglosados del paciente */}
										<div className="mb-4">
											<p className="text-xs font-semibold text-slate-600 mb-3">Nombre completo</p>
											<div className="grid gap-3 md:grid-cols-3 mb-4">
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Nombre(s)</label>
													<input
														type="text"
														value={datosRecibo.nombrePaciente}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, nombrePaciente: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Nombre"
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Apellido paterno</label>
													<input
														type="text"
														value={datosRecibo.apellidoPaternoPaciente}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoPaternoPaciente: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Apellido paterno"
													/>
												</div>
												<div>
													<label className="mb-2 ml-1 block text-xs font-semibold text-slate-600">Apellido materno</label>
													<input
														type="text"
														value={datosRecibo.apellidoMaternoPaciente}
														onChange={(e) => setDatosRecibo({ ...datosRecibo, apellidoMaternoPaciente: e.target.value })}
														className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
														placeholder="Apellido materno"
													/>
												</div>
											</div>
										</div>
										
										<div className="grid gap-4 md:grid-cols-2">
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Clave del paciente</label>
												<input
													type="text"
													value={datosRecibo.clavePaciente}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, clavePaciente: e.target.value })}
													readOnly
													className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-600 outline-none"
													placeholder="Se autocompleta"
												/>
											</div>
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Concepto del pago</label>
												<input
													type="text"
													value={datosRecibo.concepto}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, concepto: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="Concepto del pago"
												/>
											</div>
										</div>
									</div>

									{/* SECCIÓN 3: Montos */}
									<div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
										<h4 className="mb-4 text-sm font-bold uppercase text-emerald-900">Detalles del pago</h4>
										<div className="grid gap-4 md:grid-cols-3">
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Pago Tratamiento ($)</label>
												<input
													type="number"
													value={datosRecibo.montoPago}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, montoPago: parseFloat(e.target.value) || 0 })}
													className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="0.00"
													step="0.01"
												/>
											</div>
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Pago Programa Familiar ($)</label>
												<input
													type="number"
													value={datosRecibo.montoPrograma}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, montoPrograma: parseFloat(e.target.value) || 0 })}
													className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="0.00"
													step="0.01"
												/>
											</div>
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Total</label>
												<div className="flex items-center rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-bold text-emerald-700">
													${(parseFloat(datosRecibo.montoPago || 0) + parseFloat(datosRecibo.montoPrograma || 0)).toFixed(2)}
												</div>
											</div>
										</div>
									</div>

									{/* SECCIÓN 4: Firmas */}
									<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
										<h4 className="mb-4 text-sm font-bold uppercase text-slate-700">Personas que firman</h4>
										<div className="grid gap-4 md:grid-cols-2">
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Persona que recibe el pago</label>
												<input
													type="text"
													value={datosRecibo.nombreRecibe}
													onChange={(e) => setDatosRecibo({ ...datosRecibo, nombreRecibe: e.target.value })}
													className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
													placeholder="Nombre completo"
												/>
											</div>
											<div>
												<label className="mb-2 ml-1 block text-xs font-bold uppercase text-slate-600">Nota sobre firmas</label>
												<div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
													Las firmas se añadirán al documento impreso
												</div>
											</div>
										</div>
									</div>

									{/* VISTA PREVIA */}
									<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
										<h4 className="mb-3 text-sm font-bold uppercase text-slate-700">Información del recibo</h4>
										<div className="grid gap-3 md:grid-cols-3">
											<div className="flex items-center gap-2 rounded-lg bg-white p-3 text-xs">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 font-bold text-lg">👤</div>
												<div>
													<p className="text-slate-500">Pagador</p>
													<p className="font-semibold text-slate-900">{`${datosRecibo.nombrePagador || ''} ${datosRecibo.apellidoPaternoPagador || ''} ${datosRecibo.apellidoMaternoPagador || ''}`.trim() || 'No especificado'}</p>
												</div>
											</div>
											<div className="flex items-center gap-2 rounded-lg bg-white p-3 text-xs">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-lg">💰</div>
												<div>
													<p className="text-slate-500">Total</p>
													<p className="font-semibold text-slate-900">${(parseFloat(datosRecibo.montoPago || 0) + parseFloat(datosRecibo.montoPrograma || 0)).toFixed(2)}</p>
												</div>
											</div>
											<div className="flex items-center gap-2 rounded-lg bg-white p-3 text-xs">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">📅</div>
												<div>
													<p className="text-slate-500">Fecha</p>
													<p className="font-semibold text-slate-900">{new Date(datosRecibo.fechaPago).toLocaleDateString('es-MX')}</p>
												</div>
											</div>
										</div>
									</div>

									{/* RECIBOS SUBIDOS */}
									{recibosSubidos.length > 0 && (
										<div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
											<h4 className="mb-3 text-sm font-bold uppercase text-emerald-900 flex items-center gap-2">
												<FileText size={16} /> Recibos firmados subidos
											</h4>
											<div className="space-y-2">
												{recibosSubidos.map((recibo, idx) => (
													<div key={idx} className="flex flex-col rounded-lg bg-white p-3 text-sm space-y-3">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-3 flex-1 min-w-0">
																<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0">
																	<FileText size={18} />
																</div>
																<div className="min-w-0 flex-1">
																	<p className="font-semibold text-slate-900 truncate">{recibo.nombre}</p>
																	<p className="text-xs text-slate-500">{recibo.fecha} • {recibo.tamaño}</p>
																</div>
															</div>
															<a
																href={recibo.url}
																target="_blank"
																rel="noreferrer"
																className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-100 transition flex-shrink-0"
															>
																<Download size={16} />
															</a>
														</div>
														{/* BOTÓN GENERAR TOKEN */}
														<button
															onClick={generarTokenIngreso}
															disabled={generandoToken || tokenGenerado}
															className={`rounded-xl px-4 py-3 text-sm font-bold transition flex items-center justify-center gap-2 border ${
																tokenGenerado
																	? 'bg-emerald-50 text-emerald-700 cursor-not-allowed border-emerald-200'
																	: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105 border-cyan-400 active:scale-95'
															}`}
														>
															{generandoToken ? (
																<>
																	<div className="animate-spin text-lg">⏳</div>
																	<span>Generando token...</span>
																</>
															) : tokenGenerado ? (
																<>
																	<span className="text-lg">✅</span>
																	<span>Token: <code className="bg-emerald-100 px-2 py-1 rounded text-xs font-mono">{tokenGenerado.substring(0, 10)}</code></span>
																</>
															) : (
																<>
																	<span className="text-lg">🔑</span>
																	<span>Generar token para ingreso</span>
																</>
															)}
														</button>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 md:px-6 md:flex-row md:items-center md:justify-between">
								<button
									type="button"
									onClick={() => setModalReciboAbierto(false)}
									className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
								>
									Cancelar
								</button>
								<div className="flex gap-2 flex-wrap">
									<label className="flex items-center gap-2 rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 cursor-pointer hover:bg-cyan-100 transition">
										<Upload size={16} />
										Subir recibo firmado
										<input
											type="file"
											accept=".pdf,.jpg,.jpeg,.png"
											onChange={manejarCargaRecibo}
											disabled={cargandoRecibo}
											className="hidden"
										/>
									</label>
									<button
										type="button"
										onClick={descargarRecibo}
										disabled={!datosRecibo.nombrePagador || datosRecibo.montoPago + datosRecibo.montoPrograma === 0}
										className="flex items-center gap-2 rounded-xl bg-[#7E1D3B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#63162e] disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Download size={16} />
										Descargar PDF
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
