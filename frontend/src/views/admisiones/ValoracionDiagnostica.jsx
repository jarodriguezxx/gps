import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Phone, Activity, HeartPulse, Clipboard, Search, ArrowRight, FileText, Briefcase, CheckCircle2 } from 'lucide-react';
import { AdminHeader, AdmisionesSidebar } from '../../components/layout/AdminLayout';

const structuredAddressDefaults = {
  solicitanteDireccionCalle: '',
  solicitanteDireccionNoExt: '',
  solicitanteDireccionNoInt: '',
  solicitanteDireccionColonia: '',
  solicitanteDireccionMunicipioDelegacion: '',
  solicitanteDireccionCp: '',
  solicitanteDireccionCiudadEstado: '',
  prospectoDireccionCalle: '',
  prospectoDireccionNoExt: '',
  prospectoDireccionNoInt: '',
  prospectoDireccionColonia: '',
  prospectoDireccionMunicipioDelegacion: '',
  prospectoDireccionCp: '',
  prospectoDireccionCiudadEstado: '',
};

const formatStructuredAddress = (address) => {
  const parts = [
    address.calle,
    address.noExt ? `No. Ext. ${address.noExt}` : '',
    address.noInt ? `No. Int. ${address.noInt}` : '',
    address.colonia,
    address.municipioDelegacion,
    address.cp,
    address.ciudadEstado,
  ].filter((part) => String(part || '').trim());

  return parts.join(', ');
};

const toLocalDateTimeValue = (date) => {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const isPastLocalDateTime = (value) => {
  if (!value) {
    return false;
  }

  const selectedDate = new Date(value);
  if (Number.isNaN(selectedDate.getTime())) {
    return false;
  }

  return selectedDate.getTime() < Date.now();
};

const isValidPhoneValue = (value) => /^[0-9\-\s()+]{7,20}$/.test(String(value || '').trim());

const getSystemDateValue = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const getSystemDayValue = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(now);
};

const requiredTextFields = {
  solicitante: [
    { name: 'fuenteReferencia', label: 'Fuente de referencia' },
    { name: 'nombreSolicitante', label: 'Nombre de quien solicita información' },
    { name: 'solicitanteDireccionCalle', label: 'Calle del solicitante' },
    { name: 'solicitanteDireccionNoExt', label: 'No. Ext. del solicitante' },
    { name: 'solicitanteDireccionColonia', label: 'Colonia del solicitante' },
    { name: 'solicitanteDireccionMunicipioDelegacion', label: 'Mpio. o delegación del solicitante' },
    { name: 'solicitanteDireccionCp', label: 'C.P. del solicitante' },
    { name: 'solicitanteDireccionCiudadEstado', label: 'Ciudad o estado del solicitante' },
    { name: 'telefonoSolicitante', label: 'Número teléfono del solicitante' },
    { name: 'celularSolicitante', label: 'Número celular del solicitante' },
    { name: 'lugarVisita', label: 'Lugar de donde nos visitan' },
    { name: 'dedicacionSolicitante', label: 'A qué se dedica el solicitante' },
    { name: 'parentesco', label: 'Parentesco con el paciente' },
  ],
  prospecto: [
    { name: 'nombrePaciente', label: 'Nombre completo del prospecto' },
    { name: 'edadPaciente', label: 'Edad del prospecto' },
    { name: 'estadoCivilPaciente', label: 'Estado civil del prospecto' },
    { name: 'hijosCount', label: 'Cuántos hijos tiene' },
    { name: 'escolaridadPaciente', label: 'Escolaridad' },
    { name: 'origenPaciente', label: 'Origen' },
    { name: 'prospectoDireccionCalle', label: 'Calle del prospecto' },
    { name: 'prospectoDireccionNoExt', label: 'No. Ext. del prospecto' },
    { name: 'prospectoDireccionColonia', label: 'Colonia del prospecto' },
    { name: 'prospectoDireccionMunicipioDelegacion', label: 'Mpio. o delegación del prospecto' },
    { name: 'prospectoDireccionCp', label: 'C.P. del prospecto' },
    { name: 'prospectoDireccionCiudadEstado', label: 'Ciudad o estado del prospecto' },
    { name: 'pacienteTelefonoCelular', label: 'Teléfono de contacto del prospecto' },
    { name: 'dedicacionPaciente', label: 'Ocupación' },
    { name: 'sustanciaConsumo', label: 'Sustancia de consumo' },
    { name: 'internamiento', label: '¿Está dispuesto a internarse?' },
    { name: 'tratamientoAnterior', label: '¿Ha estado en tratamiento anteriormente?' },
    { name: 'posibilidadesEconomicas', label: 'Posibilidades económicas' },
    { name: 'llamarPaciente', label: 'Tipo de llamada inicial' },
    { name: 'acuerdo', label: 'Acuerdo' },
  ],
};

const getFieldValue = (formData, name) => formData[name];

const findFirstValidationIssue = (formData) => {
  for (const field of requiredTextFields.solicitante) {
    const value = getFieldValue(formData, field.name);
    if (!String(value ?? '').trim()) {
      return { tab: 'solicitante', label: field.label };
    }
  }

  if (!isValidPhoneValue(formData.telefonoSolicitante)) {
    return { tab: 'solicitante', label: 'Número teléfono del solicitante' };
  }

  if (!isValidPhoneValue(formData.celularSolicitante)) {
    return { tab: 'solicitante', label: 'Número celular del solicitante' };
  }

  if (String(formData.fuenteReferencia).trim() === 'otro' && !String(formData.fuenteReferenciaOtro || '').trim()) {
    return { tab: 'solicitante', label: 'Otro: especifique' };
  }

  for (const field of requiredTextFields.prospecto) {
    const value = getFieldValue(formData, field.name);
    if (!String(value ?? '').trim()) {
      return { tab: 'prospecto', label: field.label };
    }
  }

  if (!Number.isFinite(Number(formData.edadPaciente)) || Number(formData.edadPaciente) < 0) {
    return { tab: 'prospecto', label: 'Edad del prospecto' };
  }

  if (!Number.isFinite(Number(formData.hijosCount)) || Number(formData.hijosCount) < 0) {
    return { tab: 'prospecto', label: 'Cuántos hijos tiene' };
  }

  if (!isValidPhoneValue(formData.pacienteTelefonoCelular)) {
    return { tab: 'prospecto', label: 'Teléfono de contacto del prospecto' };
  }

  if (String(formData.sustanciaConsumo).trim() === 'otros' && !String(formData.sustanciaEspecifica || '').trim()) {
    return { tab: 'prospecto', label: 'Especifique la sustancia' };
  }

  if (String(formData.internamiento).trim() === 'no' || String(formData.internamiento).trim() === 'duda') {
    if (!String(formData.criterioInternamiento || '').trim()) {
      return { tab: 'prospecto', label: 'Se requiere intervenir' };
    }

    if (!String(formData.conclusionIntervencion || '').trim()) {
      return { tab: 'prospecto', label: 'Conclusión' };
    }
  }

  if (String(formData.llamarPaciente).trim() === 'nosotros' || String(formData.llamarPaciente).trim() === 'prospecto') {
    if (!String(formData.fechaLlamada || '').trim()) {
      return { tab: 'prospecto', label: 'Fecha de llamada' };
    }
  } else {
    if (!String(formData.estadoSeguimiento || '').trim()) {
      return { tab: 'prospecto', label: 'Estado de seguimiento' };
    }

    if (String(formData.estadoSeguimiento).trim() === 'espera_visita' && !String(formData.fechaEsperaVisita || '').trim()) {
      return { tab: 'prospecto', label: 'Fecha de visita del prospecto' };
    }

    if (String(formData.estadoSeguimiento).trim() === 'Posible_Ingreso' && !String(formData.fechaPosibleIngreso || '').trim()) {
      return { tab: 'prospecto', label: 'Fecha de posible ingreso' };
    }
  }

  if (!String(formData.fechaLlamada || formData.fechaEsperaVisita || formData.fechaPosibleIngreso || formData.fechaLlamadaPaciente || '').trim()) {
    return { tab: 'prospecto', label: 'Fecha de cita o llamada' };
  }

  if ([formData.fechaLlamada, formData.fechaLlamadaPaciente, formData.fechaEsperaLlamada, formData.fechaEsperaVisita, formData.fechaPosibleIngreso].some(isPastLocalDateTime)) {
    return { tab: 'prospecto', label: 'Fecha de cita o llamada' };
  }

  return null;
};

const ValoracionDiagnostica = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('solicitante');
  const [isSaving, setIsSaving] = useState(false);

  const composeNombreCompleto = (nombres, apellidoPaterno, apellidoMaterno) => {
    return [nombres, apellidoPaterno, apellidoMaterno]
      .map((parte) => String(parte || '').trim())
      .filter(Boolean)
      .join(' ');
  };

  const [formData, setFormData] = useState({
    ...structuredAddressDefaults,
    fechaAtencion: getSystemDateValue(),
    diaSemanana: getSystemDayValue(),
    nombreQuienAtiende: '',
    fuenteReferencia: '',
    fuenteReferenciaOtro: '',
    nombreSolicitante: '',
    solicitanteNombres: '',
    solicitanteApellidoPaterno: '',
    solicitanteApellidoMaterno: '',
    lugarVisita: '',
    domicilioSolicitante: '',
    telefonoSolicitante: '',
    celularSolicitante: '',
    dedicacionSolicitante: '',
    parentesco: '',
    nombrePaciente: '',
    pacienteNombres: '',
    pacienteApellidoPaterno: '',
    pacienteApellidoMaterno: '',
    origenPaciente: '',
    edadPaciente: '',
    estadoCivilPaciente: '',
    hijosCount: '',
    escolaridadPaciente: '',
    domicilioPaciente: '',
    pacienteTelefonoCelular: '',
    dedicacionPaciente: '',
    sustanciaConsumo: '',
    sustanciaEspecifica: '',
    internamiento: '',
    criterioInternamiento: '',
    conclusionIntervencion: '',
    tratamientoAnterior: '',
    posibilidadesEconomicas: '',
    llamarPaciente: '',
    fechaLlamada: '',
    fechaLlamadaPaciente: '',
    fechaEsperaLlamada: '',
    fechaEsperaVisita: '',
    fechaPosibleIngreso: '',
    estadoSeguimiento: '',
    acuerdo: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('marakame_user');
    const nombreUsuario = userData ? JSON.parse(userData)?.nombreCompleto : null;

    setFormData((prev) => ({
      ...prev,
      fechaAtencion: getSystemDateValue(),
      diaSemanana: getSystemDayValue(),
      nombreQuienAtiende: nombreUsuario || 'Pendiente de login',
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const seleccionarTipoLlamada = name === 'llamarPaciente' && !!value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'solicitanteNombres' || name === 'solicitanteApellidoPaterno' || name === 'solicitanteApellidoMaterno'
        ? {
            nombreSolicitante: composeNombreCompleto(
              name === 'solicitanteNombres' ? value : prev.solicitanteNombres,
              name === 'solicitanteApellidoPaterno' ? value : prev.solicitanteApellidoPaterno,
              name === 'solicitanteApellidoMaterno' ? value : prev.solicitanteApellidoMaterno
            ),
          }
        : {}),
      ...(name === 'pacienteNombres' || name === 'pacienteApellidoPaterno' || name === 'pacienteApellidoMaterno'
        ? {
            nombrePaciente: composeNombreCompleto(
              name === 'pacienteNombres' ? value : prev.pacienteNombres,
              name === 'pacienteApellidoPaterno' ? value : prev.pacienteApellidoPaterno,
              name === 'pacienteApellidoMaterno' ? value : prev.pacienteApellidoMaterno
            ),
          }
        : {}),
      ...(seleccionarTipoLlamada
        ? {
            estadoSeguimiento: '',
            fechaEsperaLlamada: '',
            fechaEsperaVisita: '',
            fechaPosibleIngreso: '',
          }
        : {}),
    }));
  };

  const handleSavePaciente = async () => {
    const validationIssue = findFirstValidationIssue(formData);
    if (validationIssue) {
      window.alert(`Completa el campo: ${validationIssue.label}.`);
      setTab(validationIssue.tab);
      return;
    }

    const solicitantePayload = {
      nombre: formData.nombreSolicitante,
      nombres: formData.solicitanteNombres,
      apellidoPaterno: formData.solicitanteApellidoPaterno,
      apellidoMaterno: formData.solicitanteApellidoMaterno,
      lugar: formData.lugarVisita,
      ocupacion: formData.dedicacionSolicitante,
      direccionCalle: formData.solicitanteDireccionCalle,
      direccionNoExt: formData.solicitanteDireccionNoExt,
      direccionNoInt: formData.solicitanteDireccionNoInt,
      direccionColonia: formData.solicitanteDireccionColonia,
      direccionMunicipioDelegacion: formData.solicitanteDireccionMunicipioDelegacion,
      direccionCp: formData.solicitanteDireccionCp,
      direccionCiudadEstado: formData.solicitanteDireccionCiudadEstado,
      domicilioParticular: formatStructuredAddress({
        calle: formData.solicitanteDireccionCalle,
        noExt: formData.solicitanteDireccionNoExt,
        noInt: formData.solicitanteDireccionNoInt,
        colonia: formData.solicitanteDireccionColonia,
        municipioDelegacion: formData.solicitanteDireccionMunicipioDelegacion,
        cp: formData.solicitanteDireccionCp,
        ciudadEstado: formData.solicitanteDireccionCiudadEstado,
      }) || formData.domicilioSolicitante,
      parentescoPaciente: formData.parentesco,
      telefono: formData.telefonoSolicitante,
      celular: formData.celularSolicitante,
    };

    const pacientePayload = {
      nombre: formData.nombrePaciente,
      nombres: formData.pacienteNombres,
      apellidoPaterno: formData.pacienteApellidoPaterno,
      apellidoMaterno: formData.pacienteApellidoMaterno,
      edad: formData.edadPaciente ? Number(formData.edadPaciente) : null,
      estadocivil: formData.estadoCivilPaciente,
      hijos: formData.hijosCount ? Number(formData.hijosCount) : null,
      escolaridad: formData.escolaridadPaciente,
      origen: formData.origenPaciente,
      direccionCalle: formData.prospectoDireccionCalle,
      direccionNoExt: formData.prospectoDireccionNoExt,
      direccionNoInt: formData.prospectoDireccionNoInt,
      direccionColonia: formData.prospectoDireccionColonia,
      direccionMunicipioDelegacion: formData.prospectoDireccionMunicipioDelegacion,
      direccionCp: formData.prospectoDireccionCp,
      direccionCiudadEstado: formData.prospectoDireccionCiudadEstado,
      domicilio: formatStructuredAddress({
        calle: formData.prospectoDireccionCalle,
        noExt: formData.prospectoDireccionNoExt,
        noInt: formData.prospectoDireccionNoInt,
        colonia: formData.prospectoDireccionColonia,
        municipioDelegacion: formData.prospectoDireccionMunicipioDelegacion,
        cp: formData.prospectoDireccionCp,
        ciudadEstado: formData.prospectoDireccionCiudadEstado,
      }) || formData.domicilioPaciente,
      telefono: formData.pacienteTelefonoCelular,
      ocupacion: formData.dedicacionPaciente,
      sustancia: formData.sustanciaConsumo,
      solicitanteId: null,
      llamarPaciente: formData.llamarPaciente,
      estadoSeguimiento: formData.estadoSeguimiento,
      fechaCita: formData.fechaLlamada || formData.fechaEsperaVisita || formData.fechaPosibleIngreso || formData.fechaLlamadaPaciente || null,
      motivoAccion: formData.acuerdo,
    };

    try {
      setIsSaving(true);
      const solicitanteResponse = await fetch('http://localhost:4000/api/solicitantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitantePayload),
      });

      if (!solicitanteResponse.ok) {
        const errorText = await solicitanteResponse.text();
        throw new Error(errorText || 'No se pudo guardar el solicitante.');
      }

      const solicitanteGuardado = await solicitanteResponse.json();

      const pacienteResponse = await fetch('http://localhost:4000/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...pacientePayload, solicitanteId: solicitanteGuardado.id }),
      });

      if (!pacienteResponse.ok) {
        const errorText = await pacienteResponse.text();
        throw new Error(errorText || 'No se pudo guardar el paciente.');
      }

      window.alert('Valoracion diagnostica guardada correctamente.');
      navigate('/admisiones/expediente');
    } catch (error) {
      console.error('Error al guardar valoracion diagnostica:', error);
      window.alert('Error al guardar. Revisa que el backend este corriendo en el puerto 4000.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <AdminHeader submodule="Valoración Diagnóstica" />

        <main className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <AdmisionesSidebar />

            <div className="space-y-5">
              

        {/* Datos Generales */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Fecha de Atención *</label>
            <input
              type="date"
              name="fechaAtencion"
              value={formData.fechaAtencion}
              onChange={handleInputChange}
              readOnly
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Día de la Semana</label>
            <input
              type="text"
              name="diaSemanana"
              value={formData.diaSemanana}
              onChange={handleInputChange}
              readOnly
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre de quien atiende</label>
            <input
              type="text"
              name="nombreQuienAtiende"
              value={formData.nombreQuienAtiende}
              onChange={handleInputChange}
              readOnly
              placeholder="Nombre del usuario autenticado"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </div>
        </section>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('solicitante')}
            className={`flex-1 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-base ${
              tab === 'solicitante'
                ? 'bg-[#7E1D3B] text-white shadow-sm'
                : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Phone size={20} /> Datos del Solicitante
          </button>
          <button
            onClick={() => setTab('prospecto')}
            className={`flex-1 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-base ${
              tab === 'prospecto'
                ? 'bg-[#7E1D3B] text-white shadow-sm'
                : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User size={20} /> Datos del Prospecto
          </button>
        </div>
            
        {/* Contenido Dinámico */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[600px] animate-fadeIn">
          {tab === 'solicitante' ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-5 xl:col-span-2">
                <h3 className="text-[#7E1D3B] font-bold text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Clipboard size={18} /> Información de Contacto
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Fuente de referencia</label>
                  <select
                    name="fuenteReferencia"
                    value={formData.fuenteReferencia}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                  >
                    <option >selecciona</option>
                    <option value="internet">Internet</option>
                    <option value="expaciente">Ex paciente</option>
                    <option value="familiar">Familiar</option>
                    <option value="revista">Revista</option>
                    <option value="anuncio_prof_salud">Anuncio prof./salud</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {formData.fuenteReferencia === 'otro' && (
                  <InputGroup
                    label="Otro: especifique"
                    name="fuenteReferenciaOtro"
                    value={formData.fuenteReferenciaOtro}
                    onChange={handleInputChange}
                    placeholder="Especifique la fuente"
                  />
                )}

                <InputGroup
                  label="Nombre(s) de quien solicita información"
                  name="solicitanteNombres"
                  value={formData.solicitanteNombres}
                  onChange={handleInputChange}
                  placeholder="Nombre(s)"
                />
                <InputGroup
                  label="Apellido paterno"
                  name="solicitanteApellidoPaterno"
                  value={formData.solicitanteApellidoPaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido paterno"
                />
                <InputGroup
                  label="Apellido materno"
                  name="solicitanteApellidoMaterno"
                  value={formData.solicitanteApellidoMaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido materno"
                />
                <AddressSection
                  title="Dirección actual"
                  prefix="solicitanteDireccion"
                  values={formData}
                  onChange={handleInputChange}
                />
                <InputGroup
                  label="Número teléfono"
                  name="telefonoSolicitante"
                  value={formData.telefonoSolicitante}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  type="tel"
                />
                <InputGroup
                  label="Número celular"
                  name="celularSolicitante"
                  value={formData.celularSolicitante}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  type="tel"
                />
              </div>

              <div className="space-y-5 xl:col-span-1">
                <h3 className="text-[#7E1D3B] font-bold text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Activity size={18} /> Relación y Ocupación
                </h3>
                <InputGroup
                  label="Lugar de donde nos visitan"
                  name="lugarVisita"
                  value={formData.lugarVisita}
                  onChange={handleInputChange}
                  placeholder="Ciudad, municipio, etc."
                />
                <InputGroup
                  label="A qué se dedica el solicitante"
                  name="dedicacionSolicitante"
                  value={formData.dedicacionSolicitante}
                  onChange={handleInputChange}
                  placeholder="Profesión u ocupación"
                />
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Parentesco con el paciente</label>
                  <select
                    name="parentesco"
                    value={formData.parentesco}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                  >
                    <option value="">Seleccionar parentesco...</option>
                    <option value="padre">Padre</option>
                    <option value="madre">Madre</option>
                    <option value="hermano">Hermano/a</option>
                    <option value="hijo">Hijo/a</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            // SECCIÓN: PROSPECTO
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <InputGroup
                  label="Nombre(s) del prospecto"
                  name="pacienteNombres"
                  value={formData.pacienteNombres}
                  onChange={handleInputChange}
                  placeholder="Nombre(s)"
                />
                <InputGroup
                  label="Apellido paterno"
                  name="pacienteApellidoPaterno"
                  value={formData.pacienteApellidoPaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido paterno"
                />
                <InputGroup
                  label="Apellido materno"
                  name="pacienteApellidoMaterno"
                  value={formData.pacienteApellidoMaterno}
                  onChange={handleInputChange}
                  placeholder="Apellido materno"
                />
                <InputGroup
                  label="Edad del prospecto"
                  name="edadPaciente"
                  value={formData.edadPaciente}
                  onChange={handleInputChange}
                  placeholder="Ej. 25"
                  type="number"
                />
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Estado civil</label>
                  <select
                    name="estadoCivilPaciente"
                    value={formData.estadoCivilPaciente}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="soltero">Soltero/a</option>
                    <option value="casado">Casado/a</option>
                    <option value="divorciado">Divorciado/a</option>
                    <option value="viudo">Viudo/a</option>
                  </select>
                </div>
                <InputGroup
                  label="Cuantos hijos tiene"
                  name="hijosCount"
                  value={formData.hijosCount}
                  onChange={handleInputChange}
                  placeholder="Número de hijos"
                  type="number"
                />
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Escolaridad</label>
                  <select
                    name="escolaridadPaciente"
                    value={formData.escolaridadPaciente}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                    <option value="preparatoria">Preparatoria</option>
                    <option value="licenciatura">Licenciatura</option>
                    <option value="posgrado">Posgrado</option>
                  </select>
                </div>
                <InputGroup
                  label="Origen"
                  name="origenPaciente"
                  value={formData.origenPaciente}
                  onChange={handleInputChange}
                  placeholder="Mexico"
                />
                <InputGroup
                  label="Teléfono de contacto"
                  name="pacienteTelefonoCelular"
                  value={formData.pacienteTelefonoCelular}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                />
                <AddressSection
                  title="Dirección actual"
                  prefix="prospectoDireccion"
                  values={formData}
                  onChange={handleInputChange}
                />
                <InputGroup
                  label="Ocupación"
                  name="dedicacionPaciente"
                  value={formData.dedicacionPaciente}
                  onChange={handleInputChange}
                  placeholder="Profesión u ocupación"
                />
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Sustancia de consumo</label>
                  <select
                    name="sustanciaConsumo"
                    value={formData.sustanciaConsumo}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                  >                    <option value="">Seleccionar...</option>
                    <option value="alcohol">ALCOHOL</option>
                    <option value="cocaina">COCAÍNA</option>
                    <option value="marihuana">MARIHUANA</option>
                    <option value="base">BASE</option>
                    <option value="extasis">ÉXTASIS</option>
                    <option value="cristal">CRISTAL</option>
                    <option value="heroina">TABACO</option>
                    <option value="metanfetaminas">BZD</option>
                    <option value="solventes">INHALANTES</option>
                    <option value="tca">TCA</option>
                    <option value="ludopatia">LUDOPATIA</option>
                    <option value=" acidos">ACIDOS</option>
                    <option value="otros">OTROS</option>
                    
                  
                  </select>
                  {(formData.sustanciaConsumo === 'otros' ) && (
                  <div className="space-y-3">
                      <InputGroup
                  label="especifique la sustancia"
                  name="sustanciaEspecifica"
                  value={formData.sustanciaEspecifica}
                  onChange={handleInputChange}
                  placeholder="..."
                />
                  </div>
                )}
                </div>
                
              </div>
              <h3 className="text-[#7E1D3B] font-bold text-lg border-b border-slate-100 pb-3">Valoración y Criterios de internamiento</h3>
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 shadow-sm">
                <div className="space-y-3">
                  <p className="font-bold text-sm mb-4 text-slate-700 uppercase flex items-center gap-2">
                    <HeartPulse size={16} /> ¿Está dispuesto a internarse?
                  </p>
                  <RadioOption
                    label="si acepta"
                    name="internamiento"
                    value="acepta"
                    checked={formData.internamiento === 'acepta'}
                    onChange={handleInputChange}
                  />
                  <RadioOption
                    label="no acepta"
                    name="internamiento"
                    value="no"
                    checked={formData.internamiento === 'no'}
                    onChange={handleInputChange}
                  />
                  <RadioOption
                    label="duda"
                    name="internamiento"
                    value="duda"
                    checked={formData.internamiento === 'duda'}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Mostrar a la derecha si no acepta o está en duda */}
                {(formData.internamiento === 'no' || formData.internamiento === 'duda') && (
                  <div className="space-y-3">
                    <p className="font-bold text-sm mb-4 text-slate-700 uppercase flex items-center gap-2">
                      <Activity size={16} /> Se requiere intervenir
                    </p>
                    <RadioOption
                      label="Sí"
                      name="criterioInternamiento"
                      value="si"
                      checked={formData.criterioInternamiento === 'si'}
                      onChange={handleInputChange}
                    />
                    <RadioOption
                      label="No"
                      name="criterioInternamiento"
                      value="no"
                      checked={formData.criterioInternamiento === 'no'}
                      onChange={handleInputChange}
                    />
                    <InputGroup
                      label="Conclusión"
                      name="conclusionIntervencion"
                      value={formData.conclusionIntervencion}
                      onChange={handleInputChange}
                      placeholder="..."
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 ml-1">¿Ha estado en tratamiento anteriormente?</label>
                  <select
                    name="tratamientoAnterior"
                    value={formData.tratamientoAnterior}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                  >
                    <option value="">Sin seleccionar</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
                 <InputGroup
                label="Posibilidades Económicas"
                name="posibilidadesEconomicas"
                value={formData.posibilidadesEconomicas}
                onChange={handleInputChange}
                placeholder="Ingreso mensual aproximado"
              />
              </div>
              
              {/* Criterios de Internamiento */}
              <label className="text-[#7E1D3B] font-bold text-lg border-b border-slate-100 pb-3">Seguimiento y Programación</label>
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
                <div>
                  <p className="mb-4 font-bold text-sm text-slate-700 uppercase">Tipo de llamada inicial</p>
                  <select
                    name="llamarPaciente"
                    value={formData.llamarPaciente}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                  >
                    <option value="">Sin seleccionar</option>
                    <option value="nosotros">Nosotros le llamamos</option>
                    <option value="prospecto">El prospecto nos llama</option>
                  </select>
                </div>
                 <div className="space-y-4">
                 
                  <div className="space-y-3">
                    <InputGroup
                label="Acuerdo"
                name="acuerdo"
                value={formData.acuerdo}
                onChange={handleInputChange}
                placeholder="En qué se acordó con el prospecto para su internamiento"
              />
                  </div>
                </div>

                <div className="space-y-4">
                  {!formData.llamarPaciente && (
                    <div>
                      <p className="mb-4 font-bold text-sm text-slate-700 uppercase flex items-center gap-2">
                        <Clipboard size={16} /> Estado de seguimiento
                      </p>
                      <select
                        name="estadoSeguimiento"
                        value={formData.estadoSeguimiento}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      >
                        <option value="">Sin seleccionar</option>
                        <option value="espera_visita">En espera de visita del paciente</option>
                        <option value="Posible_Ingreso">En espera de Posible Ingreso</option>
                      </select>
                    </div>
                  )}

                  {/* Mostrar fecha solo si hay tipo de llamada */}
                  {formData.llamarPaciente && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">
                        {formData.llamarPaciente === 'nosotros' ? 'Fecha programada de nuestra llamada inicial' : 'Fecha de llamada del prospecto'}
                      </label>
                      <input
                        type="datetime-local"
                        name="fechaLlamada"
                        value={formData.fechaLlamada}
                        onChange={handleInputChange}
                        min={toLocalDateTimeValue(new Date())}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      />
                    </div>
                  )}
                  {/*llamda del pacinete hora */}
                  {!formData.llamarPaciente && formData.estadoSeguimiento === 'espera_visita' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Fecha de visita del prospecto</label>
                      <input
                        type="datetime-local"
                        name="fechaEsperaVisita"
                        value={formData.fechaEsperaVisita}
                        onChange={handleInputChange}
                        min={toLocalDateTimeValue(new Date())}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      />
                    </div>
                  )}
                   {/*Posible ingreso */}
                  {!formData.llamarPaciente && formData.estadoSeguimiento === 'Posible_Ingreso' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Fecha de posible ingreso</label>
                      <input
                        type="datetime-local"
                        name="fechaPosibleIngreso"
                        value={formData.fechaPosibleIngreso}
                        onChange={handleInputChange}
                        min={toLocalDateTimeValue(new Date())}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      />
                    </div>
                  )}
                </div>
              </div>

              
            </div>
          )}
        </div>

        {/* Botones Finales */}
        <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate('/admisiones')}
            className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold shadow-sm"
          >
            <X size={18} /> Cancelar
          </button>
          <button
            type="button"
            onClick={handleSavePaciente}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} /> {isSaving ? 'Guardando...' : 'Guardar '}
          </button>
        </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Componentes Reutilizables
const InputGroup = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
      placeholder={placeholder}
    />
  </div>
);

const AddressSection = ({ title, prefix, values, onChange }) => (
  <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-sm md:col-span-2 xl:col-span-3">
    <h4 className="mb-4 text-base font-bold text-[#7E1D3B]">{title}</h4>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="xl:col-span-2">
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Calle *</label>
        <input
          type="text"
          name={`${prefix}Calle`}
          value={values[`${prefix}Calle`] || ''}
          onChange={onChange}
          placeholder="Calle"
          className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">No. Ext.</label>
        <input
          type="text"
          name={`${prefix}NoExt`}
          value={values[`${prefix}NoExt`] || ''}
          onChange={onChange}
          placeholder="No. Ext."
          className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">No. Int.</label>
        <input
          type="text"
          name={`${prefix}NoInt`}
          value={values[`${prefix}NoInt`] || ''}
          onChange={onChange}
          placeholder="No. Int."
          className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Colonia *</label>
        <input
          type="text"
          name={`${prefix}Colonia`}
          value={values[`${prefix}Colonia`] || ''}
          onChange={onChange}
          placeholder="Colonia"
          className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Mpio. o delegación *</label>
        <input
          type="text"
          name={`${prefix}MunicipioDelegacion`}
          value={values[`${prefix}MunicipioDelegacion`] || ''}
          onChange={onChange}
          placeholder="Municipio o Delegación"
          className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">C.P. *</label>
        <input
          type="text"
          name={`${prefix}Cp`}
          value={values[`${prefix}Cp`] || ''}
          onChange={onChange}
          placeholder="C.P."
          className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Ciudad o estado *</label>
        <input
          type="text"
          name={`${prefix}CiudadEstado`}
          value={values[`${prefix}CiudadEstado`] || ''}
          onChange={onChange}
          placeholder="Ciudad o Estado"
          className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
        />
      </div>
    </div>
  </div>
);

const RadioOption = ({ label, name, value, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 accent-[#7E1D3B]"
    />
    <span className="text-sm text-slate-600 group-hover:text-slate-900">{label}</span>
  </label>
);

export default ValoracionDiagnostica;
