import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Save, X, User, Phone, Activity, HeartPulse, Clipboard, Search, ArrowRight } from 'lucide-react';
import InstitutionalHeader from '../../components/layout/InstitutionalHeader';

const ValoracionDiagnostica = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInicioActive = location.pathname === '/admisiones';
  const isExpedienteActive = location.pathname === '/admisiones/expediente';
  const isEstudioActive = location.pathname === '/admisiones/estudio-socioeconomico';
  const isValoracionActive = location.pathname === '/admisiones/valoracion-diagnostica';
  const [tab, setTab] = useState('solicitante');
  const [formData, setFormData] = useState({
    fechaAtencion: '',
    diaSemanana: '',
    nombreQuienAtiende: '',
    fuenteReferencia: '',
    fuenteReferenciaOtro: '',
    nombreSolicitante: '',
    lugarVisita: '',
    domicilioSolicitante: '',
    telefonoSolicitante: '',
    celularSolicitante: '',
    dedicacionSolicitante: '',
    parentesco: '',
    nombrePaciente: '',
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
    Conclusion: '',
    tratamientoAnterior: '',
    posibilidadesEconomicas: '',
    llamarPaciente: '',
    fechaLlamada: '',
    estadoSeguimiento: '',
    acuerdo: '',
    nombreMedicoValoro: '',
    conclusionMedica: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] p-4 md:p-6">
        <header className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <InstitutionalHeader
            title="Sistema Integral Marakame"
            moduleLabel="Módulo de Admisiones"
            areaLabel="Área responsable: Admisiones"
            sessionValue="Admisiones"
            badge={<Phone size={16} className="text-[#7E1D3B]" />}
          />
        </header>

        <main className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <aside className="rounded-3xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
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
              

        {/* Datos Generales */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Fecha de Atención *</label>
            <input
              type="date"
              name="fechaAtencion"
              value={formData.fechaAtencion}
              onChange={handleInputChange}
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
              placeholder="Ej. Lunes"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre de quien atiende *</label>
            <input
              type="text"
              name="nombreQuienAtiende"
              value={formData.nombreQuienAtiende}
              onChange={handleInputChange}
              placeholder="Nombre del recepcionista"
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
            onClick={() => setTab('paciente')}
            className={`flex-1 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm text-base ${
              tab === 'paciente'
                ? 'bg-[#7E1D3B] text-white shadow-sm'
                : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User size={20} /> Datos del Paciente
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[600px] animate-fadeIn">
          {tab === 'solicitante' ? (
            // SECCIÓN: SOLICITANTE
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
                    <option value="">Seleccionar fuente...</option>
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
                  label="Nombre de quien solicita información"
                  name="nombreSolicitante"
                  value={formData.nombreSolicitante}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                />
                <InputGroup
                  label="Domicilio particular"
                  name="domicilioSolicitante"
                  value={formData.domicilioSolicitante}
                  onChange={handleInputChange}
                  placeholder="Calle, número, etc."
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
            // SECCIÓN: PACIENTE
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <InputGroup
                  label="Nombre completo del paciente"
                  name="nombrePaciente"
                  value={formData.nombrePaciente}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                />
                <InputGroup
                  label="Edad del paciente"
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
                  label="Domicilio particular"
                  name="domicilioPaciente"
                  value={formData.domicilioPaciente}
                  onChange={handleInputChange}
                  placeholder="Calle, número, etc."
                />
                <InputGroup
                  label="Telefono de contacto"
                  name="pacienteTelefonoCelular"
                  value={formData.pacienteTelefonoCelular}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                />
                <InputGroup
                  label="Ocupacion"
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
                  label="Conclusion"
                  name="criterioInternamiento"
                  value={formData.Conclusion}
                  onChange={handleInputChange}
                  placeholder="..."
                />
                  </div>
                )}
                <InputGroup
                label="Ha estado en tratamiento anteriormente"
                name="tratamientoAnterior"
                value={formData.tratamientoAnterior}
                onChange={handleInputChange}
                placeholder="...."
              />
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
                  <p className="font-bold text-sm mb-4 text-slate-700 uppercase">Llamar al paciente</p>
                  <div className="space-y-3">
                    <RadioOption
                      label="Sí"
                      name="llamarPaciente"
                      value="si"
                      checked={formData.llamarPaciente === 'si'}
                      onChange={handleInputChange}
                    />
                    <RadioOption
                      label="No"
                      name="llamarPaciente"
                      value="no"
                      checked={formData.llamarPaciente === 'no'}
                      onChange={handleInputChange}
                    />
                    
                  </div>
                </div>
                 <div className="space-y-4">
                 
                  <div className="space-y-3">
                    <InputGroup
                label="otro"
                name="acuerdo"
                value={formData.acuerdo}
                onChange={handleInputChange}
                placeholder="en que se acordó con el paciente para su  internamiento"
              />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-bold text-sm mb-4 text-slate-700 uppercase flex items-center gap-2">
                    <Clipboard size={16} /> Estado de seguimiento
                  </p>
                  <div className="space-y-3">
                    <RadioOption
                      label="En espera de llamada del paciente"
                      name="estadoSeguimiento"
                      value="espera_llamada"
                      checked={formData.estadoSeguimiento === 'espera_llamada'}
                      onChange={handleInputChange}
                    />
                    <RadioOption
                      label="En espera de visita del paciente"
                      name="estadoSeguimiento"
                      value="espera_visita"
                      checked={formData.estadoSeguimiento === 'espera_visita'}
                      onChange={handleInputChange}
                    />
                    <RadioOption
                      label="En espera de Posible Ingreso"
                      name="estadoSeguimiento"
                      value="Posible_Ingreso"
                      checked={formData.estadoSeguimiento === 'Posible_Ingreso'}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Mostrar fecha solo si se llamara al paciente */}
                  {formData.llamarPaciente === 'si'  && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Fecha de llamada</label>
                      <input
                        type="datetime-local"
                        name="fechaLlamada"
                        value={formData.fechaLlamada}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      />
                    </div>
                  )}
                  {/*llamda del pacinete hora */}
                  {formData.estadoSeguimiento === 'espera_llamada' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Fecha de llamada del paciente</label>
                      <input
                        type="datetime-local"
                        name="espera_llamada"
                        value={formData.estadoSeguimiento}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      />
                    </div>
                  )}
                  {/*llamda del pacinete hora */}
                  {formData.estadoSeguimiento === 'espera_visita' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Fecha de visita del paciente</label>
                      <input
                        type="datetime-local"
                        name="espera_visita"
                        value={formData.estadoSeguimiento}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      />
                    </div>
                  )}
                   {/*Posible ingreso */}
                  {formData.estadoSeguimiento === 'Posible_Ingreso' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2 ml-1">Fecha de Posible Ingreso</label>
                      <input
                        type="datetime-local"
                        name="Posible_Ingreso"
                        value={formData.estadoSeguimiento}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/20 outline-none transition-all min-h-[48px]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  <InputGroup
                    label="Nombre del medico que lo valoro"
                    name="nombreMedicoValoro"
                    value={formData.nombreMedicoValoro}
                    onChange={handleInputChange}
                    placeholder="Nombre completo del medico"
                  />
                  <InputGroup
                    label=" Conclusion medica"
                    name="conclusionMedica"
                    value={formData.conclusionMedica}
                    onChange={handleInputChange}
                    placeholder="Escriba la conclusion medica"
                  />
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
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all">
            <Save size={18} /> Guardar Paciente
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
