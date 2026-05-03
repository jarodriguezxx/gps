import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Search, User, Briefcase, Wallet, Heart, Home, Users, Info, CheckCircle2, Circle, Plus, Trash2, ArrowLeft, ArrowRight, AlertTriangle, FileText, FileX, Phone, Calculator, DollarSign } from 'lucide-react';
import { AdminHeader, AdminMainTitle, AdminErrorAlert, AdminSuccessAlert } from '../../components/layout/AdminLayout';

const EstudioSocioeconomico = () => {
  const navigate = useNavigate();
  // Estado para controlar qué pestaña está activa
  const [activeTab, setActiveTab] = useState('solicitante');
  const [isDirty, setIsDirty] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [activeHouseholdRow, setActiveHouseholdRow] = useState(0);
  const [activeContributorRow, setActiveContributorRow] = useState(0);
  const [activeVehicleRow, setActiveVehicleRow] = useState(0);
  const [activeFamilyReferenceRow, setActiveFamilyReferenceRow] = useState(0);
  const [pacientesBase, setPacientesBase] = useState([]);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [cargandoPacientes, setCargandoPacientes] = useState(false);
  const [errorPacientes, setErrorPacientes] = useState('');
  const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState(null);
  const [indiceResaltado, setIndiceResaltado] = useState(-1);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [checklistVisible, setChecklistVisible] = useState(false);
  const [checklistItems, setChecklistItems] = useState([]);
  const [guardandoEstudio, setGuardandoEstudio] = useState(false);
  const [rechazoModalAbierto, setRechazoModalAbierto] = useState(false);
  const [observacionesRechazo, setObservacionesRechazo] = useState('');
  const [errorRechazo, setErrorRechazo] = useState('');
  const [guardandoRechazo, setGuardandoRechazo] = useState(false);
  const [rechazoRegistrado, setRechazoRegistrado] = useState(false);
  const [citasRegistradas, setCitasRegistradas] = useState([]);
  const [cargandoCitasRegistradas, setCargandoCitasRegistradas] = useState(true);
  const [errorCitasRegistradas, setErrorCitasRegistradas] = useState('');
  const [householdMembers, setHouseholdMembers] = useState([
    { nombre: '', parentesco: '', edad: '', sexo: '', estadoCivil: '', ocupacionLugar: '' },
  ]);
  const [incomeContributors, setIncomeContributors] = useState([
    { parentesco: '', cantidadMensual: '' },
  ]);
  const [vehicleAssets, setVehicleAssets] = useState([
    { marca: '', ano: '', propietario: '' },
  ]);
  const [monthlyIncomes, setMonthlyIncomes] = useState({
    solicitante: '',
    conyuge: '',
    hijos: '',
    otros: '',
  });
  const [monthlyExpenses, setMonthlyExpenses] = useState({
    alimentacion: '',
    renta: '',
    luz: '',
    agua: '',
    combustible: '',
    transporte: '',
    educacion: '',
    telefono: '',
    gastosMedicos: '',
    esparcimiento: '',
    otros: '',
  });
  const [foodFrequency, setFoodFrequency] = useState({
    carneRes: '',
    carnePollo: '',
    carneCerdo: '',
    pescado: '',
    leche: '',
    cereales: '',
    huevo: '',
    frutas: '',
    verduras: '',
    leguminosas: '',
  });
  const [familyReferences, setFamilyReferences] = useState([
    { nombre: '', telefono: '', relacion: '', tiempoConocer: '' },
    { nombre: '', telefono: '', relacion: '', tiempoConocer: '' },
  ]);

  const splitNombreCompleto = (nombreCompleto = '') => {
    const partes = String(nombreCompleto || '').trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) {
      return { nombres: '', apellidoPaterno: '', apellidoMaterno: '' };
    }
    if (partes.length === 1) {
      return { nombres: partes[0], apellidoPaterno: '', apellidoMaterno: '' };
    }
    if (partes.length === 2) {
      return { nombres: partes[0], apellidoPaterno: partes[1], apellidoMaterno: '' };
    }
    return {
      nombres: partes.slice(0, -2).join(' '),
      apellidoPaterno: partes[partes.length - 2],
      apellidoMaterno: partes[partes.length - 1],
    };
  };

  const composeNombreCompleto = (nombres, apellidoPaterno, apellidoMaterno) => {
    return [nombres, apellidoPaterno, apellidoMaterno]
      .map((parte) => String(parte || '').trim())
      .filter(Boolean)
      .join(' ');
  };

  const FIXED_KIT_COST = 550;

  const createDiagnosticoEconomicoState = () => ({
    puntosNivel1: '',
    costoNivel1: '',
    puntosNivel2: '',
    costoNivel2: '',
    puntosNivel3: '',
    costoNivel3: '',
    totalPuntos: '0',
    costoBase: '0',
    diasTratamiento: '',
    montoKit: String(FIXED_KIT_COST),
    costoTotal: '0',
  });

  const getNestedFieldValue = (source, path) => {
    if (!path.includes('.')) {
      return source?.[path];
    }

    return path.split('.').reduce((accumulator, key) => {
      if (accumulator && typeof accumulator === 'object') {
        return accumulator[key];
      }

      return undefined;
    }, source);
  };

  const setNestedFieldValue = (source, path, value) => {
    if (!path.includes('.')) {
      return { ...source, [path]: value };
    }

    const keys = path.split('.');
    const next = { ...source };
    let current = next;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
        return;
      }

      current[key] = { ...(current[key] || {}) };
      current = current[key];
    });

    return next;
  };

  const calculateDiagnosticoEconomico = (diagnostico = {}) => {
    const puntosNivel1 = Number(diagnostico.puntosNivel1) || 0;
    const costoNivel1 = Number(diagnostico.costoNivel1) || 0;
    const puntosNivel2 = Number(diagnostico.puntosNivel2) || 0;
    const costoNivel2 = Number(diagnostico.costoNivel2) || 0;
    const puntosNivel3 = Number(diagnostico.puntosNivel3) || 0;
    const costoNivel3 = Number(diagnostico.costoNivel3) || 0;
    const totalPuntos = puntosNivel1 + puntosNivel2 + puntosNivel3;
    const costoBase = costoNivel1 + costoNivel2 + costoNivel3;
    const montoKit = FIXED_KIT_COST;
    const diasTratamiento = Number(diagnostico.diasTratamiento) || 35;

    // Calcular precio por día con 4 decimales
    const precioPorDia = costoBase > 0 ? (costoBase / 35).toFixed(4) : 0;
    // Aplicar fórmula: (precioPorDia × diasTratamiento) + montoKit
    const costoTotal = (Number(precioPorDia) * diasTratamiento + montoKit).toFixed(2);

    return {
      totalPuntos: String(totalPuntos),
      costoBase: String(costoBase),
      costoTotal: String(costoTotal),
    };
  };

  const calculateNivel1Cost = (points) => {
    const p = Number(points) || 0;
    if (p <= 1) return 6000;
    if (p === 2) return 9421;
    if (p === 3) return 12842;
    if (p === 4) return 16263;
    if (p === 5) return 19684;
    if (p >= 6 && p <= 7) return 23947;
    return 0; // 8-10 no aplica en este nivel
  };

  const calculateNivel2Cost = (points) => {
    const p = Number(points) || 0;
    if (p <= 0) return 0;
    if (p === 1) return 3421;
    if (p === 2) return 6842;
    return 0;
  };

  const calculateNivel3Cost = (points) => {
    const p = Number(points) || 0;
    if (p <= 1) return 0;
    if (p === 2) return 6842;
    if (p === 3) return 10263;
    if (p === 4) return 13684;
    if (p === 5) return 17105;
    if (p === 6) return 20526;
    if (p === 7) return 23947;
    if (p === 8) return 27368;
    if (p === 9) return 30789;
    if (p === 10) return 34210;
    return 0;
  };

  const calculateVehiclePoints = (vehicles = []) => {
    // Suma 1 punto por cada vehículo con año >= 2020
    return vehicles.reduce((total, vehicle) => {
      const year = Number(vehicle.ano) || 0;
      return total + (year >= 2020 ? 1 : 0);
    }, 0);
  };

  const detectTcaLudopatiaAndSetDays = (data) => {
    // Si hay TCA/Ludopatía con frecuencia → 45 días, si no → 35 días
    const hasTcaLudopatia = data.saludAdicTcaLudopatiaFrecuencia && data.saludAdicTcaLudopatiaFrecuencia.trim() !== '';
    return hasTcaLudopatia ? 45 : 35;
  };

  const calculateAportacionFamiliarPoints = (aportaIngreso) => {
    // Aportación de otros familiares: Si = 1, No = 0
    return aportaIngreso === 'si' ? 1 : 0;
  };

  const calculateBalancePoints = (balanceType) => {
    // Calcula puntos según balance económico
    // Déficit = 0, Superávit = 1
    return balanceType === 'superavit' ? 1 : 0;
  };

  const calculateHousingPoints = (data) => {
    // Suma puntos de vivienda: régimen + total habitaciones + tipo + materiales
    const regimen = Number(data.viviendaRegimenNumero) || 0;
    const totalHabitaciones = Number(data.viviendaTotalHabitacionesNumero) || 0;
    const tipo = Number(data.viviendaTipoNumero) || 0;
    const materialPiso = Number(data.viviendaMaterialPisoNumero) || 0;
    const materialMuros = Number(data.viviendaMaterialMurosNumero) || 0;
    const materialTecho = Number(data.viviendaMaterialTechoNumero) || 0;
    return regimen + totalHabitaciones + tipo + materialPiso + materialMuros + materialTecho;
  };

  const [formData, setFormData] = useState({
    nombreSolicitante: '',
    solicitanteNombres: '',
    solicitanteApellidoPaterno: '',
    solicitanteApellidoMaterno: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    edad: '',
    sexo: '',
    escolaridad: '',
    ocupacion: '',
    estadoCivil: '',
    direccionCalle: '',
    direccionNoExt: '',
    direccionNoInt: '',
    direccionColonia: '',
    direccionMunicipioDelegacion: '',
    direccionCp: '',
    direccionCiudadEstado: '',
    telefonoCasa: '',
    telefonoCelular: '',
    cuentaConTarjeta: '',
    pacienteNombre: '',
    pacienteNombres: '',
    pacienteApellidoPaterno: '',
    pacienteApellidoMaterno: '',
    pacienteFechaNacimiento: '',
    pacienteLugarNacimiento: '',
    pacienteEdad: '',
    pacienteSexo: '',
    pacienteEscolaridad: '',
    pacienteOcupacion: '',
    pacienteEstadoCivil: '',
    pacienteDireccion: '',
    pacienteTelefonoCasa: '',
    pacienteTelefonoCelular: '',
    laboralCuentaConEmpleo: '',
    laboralLugarTrabajo: '',
    laboralAntiguedad: '',
    laboralPuesto: '',
    laboralHorario: '',
    laboralDependientes: '',
    laboralIngresoMensual: '',
    laboralOtrosIngresos: '',
    laboralCategoriaOcupacion: '',
    laboralNumeroOcupacion: '',
    conyugeOcupacion: '',
    conyugeLugarTrabajo: '',
    conyugeAntiguedad: '',
    conyugeIngresoMensual: '',
    familiarAportaIngreso: '',
    numeroIntegrantesAportan: '',
    balanceEconomico: '',
    patrimonioCuentaAuto: '',
    patrimonioCantidad: '',
    vehiculoCategoria: '',
    vehiculoNumero: '',
    saludAsistenciaOpciones: [],
    saludMontoConsultas: '',
    saludOtrosServicios: '',
    saludMiembrosConAsistencia: '',
    saludAdicAlcoholismoDetalle: '',
    saludAdicAlcoholismoFrecuencia: '',
    saludAdicAlcoholismoSeveridad: '',
    saludAdicTcaLudopatiaDetalle: '',
    saludAdicTcaLudopatiaFrecuencia: '',
    saludAdicTcaLudopatiaSeveridad: '',
    saludAdicDrogadiccionDetalle: '',
    saludAdicDrogadiccionFrecuencia: '',
    saludAdicDrogadiccionSeveridad: '',
    saludAdicOtrosDetalle: '',
    saludAdicOtrosFrecuencia: '',
    saludAdicOtrosSeveridad: '',
    saludRelacionFamiliar: '',
    viviendaRegimen: '',
    viviendaRegimenNumero: '',
    viviendaTipo: '',
    viviendaTipoNumero: '',
    viviendaTotalHabitaciones: '',
    viviendaTotalHabitacionesNumero: '',
    viviendaConformacion: [],
    viviendaBanos: '',
    viviendaRecamaras: '',
    viviendaEspecificarSinBanos: '',
    viviendaOtrasCaracteristicas: '',
    viviendaMaterialPiso: '',
    viviendaMaterialPisoNumero: '',
    viviendaMaterialMuros: '',
    viviendaMaterialMurosNumero: '',
    viviendaMaterialTecho: '',
    viviendaMaterialTechoNumero: '',
    diagnosticoEconomico: createDiagnosticoEconomicoState(),
    familiarDiagnostico: '',
    familiarObservacionesTrabajoSocial: '',
    familiarObservacionesVisitaDomiciliaria: '',
  });

  // Pestañas basadas en tu boceto
  const tabs = [
    { id: 'solicitante', label: 'Solicitante', icon: <Info size={16}/> },
    { id: 'paciente', label: 'Paciente', icon: <User size={16}/> },
    { id: 'laboral', label: 'Laboral', icon: <Briefcase size={16}/> },
    { id: 'economico', label: 'Económico', icon: <Wallet size={16}/> },
    { id: 'salud', label: 'Salud', icon: <Heart size={16}/> },
    { id: 'vivienda', label: 'Vivienda', icon: <Home size={16}/> },
    { id: 'familiar', label: 'Familiar', icon: <Users size={16}/> },
  ];

  const fieldLabels = {
    pacienteEstadoCivil: 'Estado civil del paciente',
    balanceEconomico: 'Balance económico',
    patrimonioCantidad: 'Cantidad de autos',
    familiarAportaIngreso: 'Aportación de otros familiares',
    numeroIntegrantesAportan: 'Número de integrantes que aportan',
    'diagnosticoEconomico.diasTratamiento': 'Días de tratamiento',
  };

  const sectionRequiredFields = {
    solicitante: [
      'nombreSolicitante',
      'fechaNacimiento',
      'edad',
      'sexo',
      'escolaridad',
      'estadoCivil',
      'direccionCalle',
      'direccionColonia',
      'direccionMunicipioDelegacion',
      'direccionCp',
      'direccionCiudadEstado',
      'telefonoCelular',
    ],
    paciente: [
      'pacienteNombre',
      'pacienteFechaNacimiento',
      'pacienteEdad',
      'pacienteSexo',
      'pacienteEscolaridad',
      'pacienteEstadoCivil',
      'pacienteDireccion',
      'pacienteTelefonoCelular',
    ],
    laboral: [
      'laboralCuentaConEmpleo',
      'laboralLugarTrabajo',
      'laboralPuesto',
      'laboralIngresoMensual',
      'laboralCategoriaOcupacion',
    ],
    economico: [
      'balanceEconomico',
      'patrimonioCuentaAuto',
      'vehiculoCategoria',
    ],
    salud: [
      'saludAsistenciaOpciones',
      'saludMiembrosConAsistencia',
    ],
    vivienda: [
      'viviendaRegimen',
      'viviendaTipo',
      'viviendaTotalHabitaciones',
      'viviendaConformacion',
      'viviendaMaterialPiso',
      'viviendaMaterialMuros',
      'viviendaMaterialTecho',
    ],
    familiar: [
      'diagnosticoEconomico.diasTratamiento',
      'familiarDiagnostico',
    ],
  };

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const isFirstStep = currentTabIndex === 0;
  const isLastStep = currentTabIndex === tabs.length - 1;

  const occupationScale = [
    { value: 'desempleado', label: 'Desempleado', score: '0' },
    { value: 'empleo_temporal', label: 'Empleo temporal', score: '0' },
    { value: 'obrero_empleado', label: 'Obrero/Empleado', score: '1' },
    { value: 'profesionista', label: 'Profesionista', score: '2' },
    { value: 'empresario', label: 'Empresario', score: '3' },
  ];

  const vehicleScale = [
    { value: 'ninguno', label: 'Ninguno', score: '0' },
    { value: 'uno_dos', label: '1-2 auto', score: '1' },
    { value: 'mas_dos', label: 'Mas de 2 autos', score: '2' },
  ];

  const housingRegimeScale = [
    { value: 'sin_vivienda', label: 'Sin vivienda', score: '0' },
    { value: 'rentada', label: 'Rentada', score: '0' },
    { value: 'prestada', label: 'Prestada', score: '0' },
    { value: 'familiar', label: 'Familiar', score: '0' },
    { value: 'propia', label: 'Propia', score: '1' },
    { value: 'mas_vivienda', label: 'Mas de 1 vivienda', score: '2' },
  ];

  const housingTypeScale = [
    { value: 'vecindad', label: 'Vecindad', score: '0' },
    { value: 'condominio', label: 'condominio', score: '0' },
    { value: 'interes_social', label: 'Interés Social', score: '0' },
    { value: 'casa_habitacion', label: 'Casa Habitacion', score: '0' },
    { value: 'residencial_m', label: 'Residencial M.', score: '1' },
    { value: 'residencial_a', label: 'Residencial A.', score: '2' },
  ];

  const roomsScale = [
    { value: 'dos_uno', label: '1-2 dormitorios', score: '0' },
    { value: 'tres_cuatro', label: '3-4 dormitorios', score: '1' },
    { value: 'mas_cuatro', label: 'Mas de 4', score: '2' },
  ];

  const floorMaterialScale = [
    { value: 'tierra', label: 'Tierra', score: '0' },
    { value: 'concreto', label: 'Concreto', score: '0' },
    { value: 'mosaico', label: 'Mosaico', score: '0' },
    { value: 'vitropiso', label: 'Vitropiso', score: '1' },
    { value: 'otros', label: 'Otros', score: '2' },
  ];

  const wallMaterialScale = [
    { value: 'adobe_tabuique', label: 'Adobe/Tabique', score: '0' },
    { value: 'concreto', label: 'Concreto', score: '1' },
    { value: 'otros', label: 'Otros', score: '2' },
  ];

  const roofMaterialScale = [
    { value: 'lamina_carton', label: 'Lámina cartón/asbesto', score: '0' },
    { value: 'concreto', label: 'Concreto', score: '1' },
    { value: 'otros', label: 'Otros', score: '2' },
  ];

  const foodFrequencyOptions = [
    { value: 'diario', label: 'Diario' },
    { value: 'cada_tercer_dia', label: 'C/tercer día' },
    { value: 'semanal', label: '1 vez a la semana' },
    { value: 'mensual', label: '1 vez al mes' },
    { value: 'ocasional', label: 'Ocasionalmente' },
  ];

  const calculateAgeFromDate = (dateValue) => {
    if (!dateValue) return '';

    const birthDate = new Date(dateValue);
    if (Number.isNaN(birthDate.getTime())) return '';

    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years -= 1;
    }

    return String(Math.max(years, 0));
  };

  const totalIncomes = Object.values(monthlyIncomes).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const totalExpenses = Object.values(monthlyExpenses).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const economicResult = totalIncomes - totalExpenses;
  const hasVehicle = formData.patrimonioCuentaAuto === 'si';
  const diagnosticoEconomico = formData.diagnosticoEconomico || createDiagnosticoEconomicoState();
  const diagnosticoEconomicoCalculado = calculateDiagnosticoEconomico(diagnosticoEconomico);
  const diagnosticoEconomicoDias = String(diagnosticoEconomico.diasTratamiento || '').trim() || '0';
  const diagnosticoEconomicoCostoBase = Number(diagnosticoEconomicoCalculado.costoBase || 0);
  const diagnosticoEconomicoMontoKit = FIXED_KIT_COST;
  const diagnosticoEconomicoCostoTotal = Number(diagnosticoEconomicoCalculado.costoTotal || 0);
  const validIncomeContributors = incomeContributors.filter(
    (row) => String(row.parentesco || '').trim() && Number(row.cantidadMensual || 0) > 0
  ).length;
  const validFamilyReferences = familyReferences.filter(
    (row) =>
      String(row.nombre || '').trim() &&
      String(row.telefono || '').trim() &&
      String(row.relacion || '').trim() &&
      String(row.tiempoConocer || '').trim()
  ).length;
  const hasMinimumFamilyReferences = validFamilyReferences >= 2;

  const validateField = (name, value) => {
    const camposLaboralesDependenEmpleo = [
      'laboralLugarTrabajo',
      'laboralAntiguedad',
      'laboralPuesto',
      'laboralHorario',
    ];

    if (rechazoRegistrado && name === 'diagnosticoEconomico.diasTratamiento') {
      return '';
    }

    if (name === 'diagnosticoEconomico.diasTratamiento') {
      if (!String(value || '').trim()) {
        return 'Este campo es obligatorio.';
      }

      if (Number(value) <= 0) {
        return 'Los días de tratamiento deben ser mayores a 0.';
      }
    }

    if (
      name.startsWith('diagnosticoEconomico.') &&
      name !== 'diagnosticoEconomico.diasTratamiento' &&
      value !== '' &&
      Number(value) < 0
    ) {
      return 'El valor no puede ser negativo.';
    }

    if (camposLaboralesDependenEmpleo.includes(name) && formData.laboralCuentaConEmpleo === 'no') {
      return '';
    }

    if (name === 'vehiculoCategoria' && formData.patrimonioCuentaAuto === 'no') {
      return '';
    }

    if (name === 'saludAsistenciaOpciones' && (!Array.isArray(value) || value.length === 0)) {
      return 'Selecciona al menos una opción.';
    }

    if (name === 'viviendaConformacion' && (!Array.isArray(value) || value.length === 0)) {
      return 'Selecciona al menos una opción.';
    }

    const requiredInCurrentTab = sectionRequiredFields[activeTab]?.includes(name);
    if (requiredInCurrentTab && !String(value || '').trim()) {
      return 'Este campo es obligatorio.';
    }

    if ((name === 'edad' || name === 'pacienteEdad') && value && Number(value) < 0) {
      return 'La edad no puede ser negativa.';
    }

    if (
      [
        'laboralIngresoMensual',
        'laboralOtrosIngresos',
        'conyugeIngresoMensual',
        'numeroIntegrantesAportan',
        'patrimonioCantidad',
        'saludMontoConsultas',
        'saludMiembrosConAsistencia',
        'viviendaBanos',
        'viviendaRecamaras',
      ].includes(name) &&
      value &&
      Number(value) < 0
    ) {
      return 'El valor no puede ser negativo.';
    }

    if (
      (
        name === 'telefonoCasa' ||
        name === 'telefonoCelular' ||
        name === 'pacienteTelefonoCasa' ||
        name === 'pacienteTelefonoCelular'
      ) &&
      value &&
      !/^[0-9\-\s()+]{7,20}$/.test(value)
    ) {
      return 'Formato de teléfono no válido.';
    }

    return '';
  };

  const getCrossRuleFindings = (tabId = null) => {
    const findings = [];

    if (formData.balanceEconomico === 'deficit' && economicResult >= 0) {
      findings.push({
        tabId: 'economico',
        field: 'balanceEconomico',
        severity: 'error',
        message: 'Marcaste déficit pero los ingresos no son menores a los egresos.',
      });
    }

    if (formData.balanceEconomico === 'superavit' && economicResult < 0) {
      findings.push({
        tabId: 'economico',
        field: 'balanceEconomico',
        severity: 'error',
        message: 'Marcaste superávit pero los egresos superan a los ingresos.',
      });
    }

    if (formData.patrimonioCuentaAuto === 'no' && Number(formData.patrimonioCantidad || 0) > 0) {
      findings.push({
        tabId: 'economico',
        field: 'patrimonioCantidad',
        severity: 'error',
        message: 'Si no cuenta con automóvil, la cantidad debe ser 0.',
      });
    }

    if (formData.familiarAportaIngreso === 'si' && validIncomeContributors === 0) {
      findings.push({
        tabId: 'laboral',
        field: 'familiarAportaIngreso',
        severity: 'error',
        message: 'Captura al menos una aportación válida (parentesco y monto mayor a 0).',
      });
    }

    if (formData.familiarAportaIngreso === 'si' && Number(formData.numeroIntegrantesAportan || 0) <= 0) {
      findings.push({
        tabId: 'laboral',
        field: 'numeroIntegrantesAportan',
        severity: 'error',
        message: 'Debe ser mayor a 0 cuando sí aportan otros familiares.',
      });
    }

    if (formData.familiarAportaIngreso === 'no' && Number(formData.numeroIntegrantesAportan || 0) > 0) {
      findings.push({
        tabId: 'laboral',
        field: 'numeroIntegrantesAportan',
        severity: 'error',
        message: 'Debe ser 0 cuando no aportan otros familiares.',
      });
    }

    if (
      Number(formData.pacienteEdad || 0) > 0 &&
      Number(formData.pacienteEdad || 0) < 18 &&
      ['Casado(a)', 'Divorciado(a)', 'Unión Libre'].includes(formData.pacienteEstadoCivil)
    ) {
      findings.push({
        tabId: 'paciente',
        field: 'pacienteEstadoCivil',
        severity: 'warning',
        message: 'Revisa estado civil: la edad del paciente es menor de 18.',
      });
    }

    if (!tabId) {
      return findings;
    }

    return findings.filter((item) => item.tabId === tabId);
  };

  const getFindingsByField = (field, severity = null) => {
    const findings = getCrossRuleFindings().filter((item) => item.field === field);
    if (!severity) {
      return findings;
    }
    return findings.filter((item) => item.severity === severity);
  };

  const getActiveRequiredFields = (tabId) => {
    const fields = [...(sectionRequiredFields[tabId] || [])];

    if (tabId === 'familiar' && rechazoRegistrado) {
      return fields.filter((name) => name !== 'diagnosticoEconomico.diasTratamiento');
    }

    if (tabId === 'laboral' && formData.laboralCuentaConEmpleo === 'no') {
      return fields.filter((name) => !['laboralLugarTrabajo', 'laboralPuesto'].includes(name));
    }

    if (tabId === 'economico' && formData.patrimonioCuentaAuto === 'no') {
      return fields.filter((name) => name !== 'vehiculoCategoria');
    }

    return fields;
  };

  useEffect(() => {
    const nextCalculated = calculateDiagnosticoEconomico(formData.diagnosticoEconomico || {});

    setFormData((prev) => {
      const currentDiagnostico = prev.diagnosticoEconomico || createDiagnosticoEconomicoState();

      if (
        currentDiagnostico.totalPuntos === nextCalculated.totalPuntos &&
        currentDiagnostico.costoBase === nextCalculated.costoBase &&
        currentDiagnostico.costoTotal === nextCalculated.costoTotal
      ) {
        return prev;
      }

      return {
        ...prev,
        diagnosticoEconomico: {
          ...currentDiagnostico,
          ...nextCalculated,
        },
      };
    });
  }, [
    formData.diagnosticoEconomico,
    formData.diagnosticoEconomico?.puntosNivel1,
    formData.diagnosticoEconomico?.costoNivel1,
    formData.diagnosticoEconomico?.puntosNivel2,
    formData.diagnosticoEconomico?.costoNivel2,
    formData.diagnosticoEconomico?.puntosNivel3,
    formData.diagnosticoEconomico?.costoNivel3,
    formData.diagnosticoEconomico?.montoKit,
  ]);

  useEffect(() => {
    const autoBalance = economicResult < 0 ? 'deficit' : 'superavit';

    setFormData((prev) => {
      if (prev.balanceEconomico === autoBalance) {
        return prev;
      }

      return {
        ...prev,
        balanceEconomico: autoBalance,
      };
    });
  }, [economicResult]);

  // Actualizar puntos de Nivel 1 (categoría + aportación + balance), Nivel 2 (vehículos), Nivel 3 (vivienda), más días de tratamiento
  useEffect(() => {
    setFormData((prev) => {
      // Puntos Nivel 1: categoría de ocupación + aportación de otros familiares + balance
      const ocupacionPoints = Number(prev.laboralNumeroOcupacion) || Number(prev.laboralCategoriaOcupacion) || 0;
      const aportacionFamiliarPoints = calculateAportacionFamiliarPoints(prev.familiarAportaIngreso);
      const balancePoints = calculateBalancePoints(prev.balanceEconomico);
      const totalNivel1 = ocupacionPoints + aportacionFamiliarPoints + balancePoints;

      // Puntos Nivel 2: vehículos
      const vehiclePoints = Math.min(calculateVehiclePoints(vehicleAssets), 2);
      
      // Puntos Nivel 3: vivienda (régimen + habitaciones + tipo + materiales)
      const housingPoints = calculateHousingPoints(prev);

      // Costos por nivel según tabulador institucional
      const costoNivel1 = calculateNivel1Cost(totalNivel1);
      const costoNivel2 = calculateNivel2Cost(vehiclePoints);
      const costoNivel3 = calculateNivel3Cost(housingPoints);
      
      // Días de tratamiento detectados automáticamente
      const autoDetectedDays = detectTcaLudopatiaAndSetDays(prev);

      const updatedDiagnostico = {
        ...prev.diagnosticoEconomico,
        puntosNivel1: String(totalNivel1),
        costoNivel1: String(costoNivel1),
        puntosNivel2: String(vehiclePoints),
        costoNivel2: String(costoNivel2),
        puntosNivel3: String(housingPoints),
        costoNivel3: String(costoNivel3),
        diasTratamiento: String(autoDetectedDays),
        montoKit: String(FIXED_KIT_COST),
      };

      return {
        ...prev,
        diagnosticoEconomico: updatedDiagnostico,
      };
    });
  }, [vehicleAssets, formData.laboralCategoriaOcupacion, formData.laboralNumeroOcupacion, formData.familiarAportaIngreso, formData.balanceEconomico, formData.saludAdicTcaLudopatiaFrecuencia, formData.viviendaRegimenNumero, formData.viviendaTotalHabitacionesNumero, formData.viviendaTipoNumero, formData.viviendaMaterialPisoNumero, formData.viviendaMaterialMurosNumero, formData.viviendaMaterialTechoNumero]);

  const handleDiagnosticoEconomicoChange = (name, value) => {
    setIsDirty(true);
    setFormData((prev) => setNestedFieldValue(prev, `diagnosticoEconomico.${name}`, value));
  };

  const handleChange = (name, value) => {
    setIsDirty(true);
    setFormData((prev) => {
      const next = setNestedFieldValue(prev, name, value);

      if ([
        'solicitanteNombres',
        'solicitanteApellidoPaterno',
        'solicitanteApellidoMaterno',
      ].includes(name)) {
        next.nombreSolicitante = composeNombreCompleto(
          name === 'solicitanteNombres' ? value : next.solicitanteNombres,
          name === 'solicitanteApellidoPaterno' ? value : next.solicitanteApellidoPaterno,
          name === 'solicitanteApellidoMaterno' ? value : next.solicitanteApellidoMaterno
        );
      }

      if (['pacienteNombres', 'pacienteApellidoPaterno', 'pacienteApellidoMaterno'].includes(name)) {
        next.pacienteNombre = composeNombreCompleto(
          name === 'pacienteNombres' ? value : next.pacienteNombres,
          name === 'pacienteApellidoPaterno' ? value : next.pacienteApellidoPaterno,
          name === 'pacienteApellidoMaterno' ? value : next.pacienteApellidoMaterno
        );
      }

      if (name === 'fechaNacimiento') {
        next.edad = calculateAgeFromDate(value);
      }

      if (name === 'pacienteFechaNacimiento') {
        next.pacienteEdad = calculateAgeFromDate(value);
      }

      if (name === 'laboralCategoriaOcupacion') {
        const selected = occupationScale.find((item) => item.value === value || `${item.label} (${item.score})` === value);
        next.laboralNumeroOcupacion = selected ? selected.score : '';
      }

      if (name === 'vehiculoCategoria') {
        const selectedVehicle = vehicleScale.find((item) => item.value === value);
        next.vehiculoNumero = selectedVehicle ? selectedVehicle.score : '';
      }

      if (name === 'viviendaRegimen') {
        const selected = housingRegimeScale.find((item) => item.value === value);
        next.viviendaRegimenNumero = selected ? selected.score : '';
      }

      if (name === 'viviendaTipo') {
        const selected = housingTypeScale.find((item) => item.value === value);
        next.viviendaTipoNumero = selected ? selected.score : '';
      }

      if (name === 'viviendaTotalHabitaciones') {
        const selected = roomsScale.find((item) => item.value === value);
        next.viviendaTotalHabitacionesNumero = selected ? selected.score : '';
      }

      if (name === 'viviendaMaterialPiso') {
        const selected = floorMaterialScale.find((item) => item.value === value);
        next.viviendaMaterialPisoNumero = selected ? selected.score : '';
      }

      if (name === 'viviendaMaterialMuros') {
        const selected = wallMaterialScale.find((item) => item.value === value);
        next.viviendaMaterialMurosNumero = selected ? selected.score : '';
      }

      if (name === 'viviendaMaterialTecho') {
        const selected = roofMaterialScale.find((item) => item.value === value);
        next.viviendaMaterialTechoNumero = selected ? selected.score : '';
      }

      if (name === 'patrimonioCuentaAuto' && value === 'no') {
        next.patrimonioCantidad = '0';
        next.vehiculoCategoria = '';
        next.vehiculoNumero = '';
      }

      if (name === 'laboralCuentaConEmpleo' && value === 'no') {
        next.laboralLugarTrabajo = '';
        next.laboralAntiguedad = '';
        next.laboralPuesto = '';
        next.laboralHorario = '';
      }

      if (name === 'familiarAportaIngreso' && value === 'no') {
        next.numeroIntegrantesAportan = '0';
      }

      return next;
    });

    if (name === 'patrimonioCuentaAuto' && value === 'no') {
      setVehicleAssets([{ marca: '', ano: '', propietario: '' }]);
      setActiveVehicleRow(0);
      setErrors((prev) => ({ ...prev, vehiculoCategoria: '' }));
      setFeedback({
        type: 'info',
        message: 'Autocorrección aplicada: se reinició la sección de vehículos y la cantidad quedó en 0.',
      });
    }

    if (name === 'laboralCuentaConEmpleo' && value === 'no') {
      setErrors((prev) => ({
        ...prev,
        laboralLugarTrabajo: '',
        laboralAntiguedad: '',
        laboralPuesto: '',
        laboralHorario: '',
      }));
      setFeedback({
        type: 'info',
        message: 'Autocorrección aplicada: se limpiaron los datos laborales que no aplican cuando no hay empleo.',
      });
    }

    if (name === 'familiarAportaIngreso' && value === 'no') {
      setIncomeContributors([{ parentesco: '', cantidadMensual: '' }]);
      setActiveContributorRow(0);
      setFeedback({
        type: 'info',
        message: 'Autocorrección aplicada: se bloqueó aportación de familiares y se estableció 0 integrantes.',
      });
    }
  };

  useEffect(() => {
    const cargarCitasRegistradas = async () => {
      try {
        setCargandoCitasRegistradas(true);
        setErrorCitasRegistradas('');
        const response = await fetch('http://localhost:4000/api/seguimientos/tablas');

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'No se pudieron cargar las citas registradas.');
        }

        const data = await response.json();
        setCitasRegistradas(Array.isArray(data.citas) ? data.citas : []);
      } catch (error) {
        console.error('Error al cargar citas registradas para validar estudio:', error);
        setErrorCitasRegistradas('No se pudieron validar las citas registradas.');
      } finally {
        setCargandoCitasRegistradas(false);
      }
    };

    cargarCitasRegistradas();
  }, []);

  useEffect(() => {
    const nombre = busquedaPaciente.trim();
    const controller = new AbortController();

    if (nombre.length < 2) {
      setPacientesBase([]);
      setIndiceResaltado(-1);
      setMostrarResultados(false);
      setErrorPacientes('');
      setCargandoPacientes(false);
      return () => controller.abort();
    }

    const cargarPacientes = async () => {
      try {
        setCargandoPacientes(true);
        setErrorPacientes('');
        const response = await fetch(
          `http://localhost:4000/api/pacientes/busqueda?query=${encodeURIComponent(nombre)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'No se pudieron cargar los pacientes.');
        }

        const data = await response.json();
        const resultados = Array.isArray(data) ? data : [];
        setPacientesBase(resultados);

        setMostrarResultados(true);
        setIndiceResaltado(resultados.length > 0 ? 0 : -1);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error al buscar pacientes por nombre:', error);
          setErrorPacientes('No se pudo consultar pacientes por nombre.');
          setMostrarResultados(true);
        }
      } finally {
        setCargandoPacientes(false);
      }
    };

    cargarPacientes();
    return () => controller.abort();
  }, [busquedaPaciente]);

  const handleBusquedaPacienteKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setMostrarResultados(true);
      setIndiceResaltado((prev) => {
        const siguiente = prev + 1;
        return siguiente >= pacientesBase.length ? 0 : siguiente;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setMostrarResultados(true);
      setIndiceResaltado((prev) => {
        const anterior = prev - 1;
        return anterior < 0 ? pacientesBase.length - 1 : anterior;
      });
      return;
    }

    if (event.key === 'Escape') {
      setMostrarResultados(false);
      return;
    }

    if (event.key === 'Enter' && pacientesBase.length > 0) {
      event.preventDefault();
      const indiceObjetivo = indiceResaltado >= 0 ? indiceResaltado : 0;
      seleccionarPaciente(pacientesBase[indiceObjetivo]);
      setMostrarResultados(false);
    }
  };

  const seleccionarPaciente = (paciente) => {
    if (cargandoCitasRegistradas) {
      setFeedback({
        type: 'info',
        message: 'Validando citas registradas, espera un momento e intenta de nuevo.',
      });
      return;
    }

    if (errorCitasRegistradas) {
      setFeedback({
        type: 'warning',
        message: 'No fue posible validar la cita del paciente. Revisa la conexión con backend.',
      });
      return;
    }

    const tieneCitaRegistrada = citasRegistradas.some((item) => item.pacienteId === paciente.id);
    if (!tieneCitaRegistrada) {
      setFeedback({
        type: 'warning',
        message: 'Este paciente no tiene cita registrada. Primero agenda una cita para continuar con el estudio socioeconómico.',
      });
      return;
    }

    setPacienteSeleccionadoId(paciente.id);
    setBusquedaPaciente(paciente.nombreCompleto || '');
    setIsDirty(true);
    setActiveTab('solicitante');
    setFeedback(null);
    setRechazoModalAbierto(false);
    setObservacionesRechazo('');
    setErrorRechazo('');
    setGuardandoRechazo(false);
    setRechazoRegistrado(false);
    const nombreSolicitanteCompleto = paciente.solicitante?.nombre || '';
    const solicitantePartes = splitNombreCompleto(nombreSolicitanteCompleto);
    const pacientePartes = splitNombreCompleto(paciente.nombreCompleto || '');
    setFormData((prev) => ({
      ...prev,
      nombreSolicitante: nombreSolicitanteCompleto,
      solicitanteNombres: paciente.solicitante?.nombres || solicitantePartes.nombres,
      solicitanteApellidoPaterno: paciente.solicitante?.apellidoPaterno || solicitantePartes.apellidoPaterno,
      solicitanteApellidoMaterno: paciente.solicitante?.apellidoMaterno || solicitantePartes.apellidoMaterno,
      fechaNacimiento: paciente.solicitante?.fechaNacimiento || '',
      lugarNacimiento: paciente.solicitante?.lugar || '',
      edad: paciente.solicitante?.edad ? String(paciente.solicitante.edad) : '',
      sexo: paciente.solicitante?.sexo || '',
      escolaridad: paciente.solicitante?.escolaridad || '',
      ocupacion: paciente.solicitante?.ocupacion || '',
      estadoCivil: paciente.solicitante?.estadoCivil || '',
      direccionCalle: paciente.solicitante?.direccionCalle || paciente.solicitante?.domicilioParticular || '',
      direccionNoExt: paciente.solicitante?.direccionNoExt || '',
      direccionNoInt: paciente.solicitante?.direccionNoInt || '',
      direccionColonia: paciente.solicitante?.direccionColonia || '',
      direccionMunicipioDelegacion: paciente.solicitante?.direccionMunicipioDelegacion || '',
      direccionCp: paciente.solicitante?.direccionCp || '',
      direccionCiudadEstado: paciente.solicitante?.direccionCiudadEstado || '',
      telefonoCasa: paciente.solicitante?.telefono || '',
      telefonoCelular: paciente.solicitante?.celular || '',
      cuentaConTarjeta: paciente.solicitante?.cuentaConTarjeta || '',
      pacienteNombre: paciente.nombreCompleto || '',
      pacienteNombres: paciente.nombres || pacientePartes.nombres,
      pacienteApellidoPaterno: paciente.apellidoPaterno || pacientePartes.apellidoPaterno,
      pacienteApellidoMaterno: paciente.apellidoMaterno || pacientePartes.apellidoMaterno,
      pacienteFechaNacimiento: paciente.fechaNacimiento || '',
      pacienteLugarNacimiento: paciente.origen || '',
      pacienteEdad: paciente.edad ? String(paciente.edad) : '',
      pacienteSexo: paciente.sexo || '',
      pacienteEscolaridad: paciente.escolaridad || '',
      pacienteOcupacion: paciente.ocupacion || '',
      pacienteEstadoCivil: paciente.estadoCivil || '',
      pacienteDireccion: paciente.domicilioParticular || '',
      pacienteTelefonoCasa: paciente.telefonoCasa || '',
      pacienteTelefonoCelular: paciente.telefonoContacto || '',
      sustanciaConsumo: paciente.sustanciaConsumo || '',
      diagnosticoEconomico: createDiagnosticoEconomicoState(),
    }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, getNestedFieldValue(formData, name));
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleMedicalAssistanceToggle = (option) => {
    setIsDirty(true);
    setFormData((prev) => {
      const current = Array.isArray(prev.saludAsistenciaOpciones) ? prev.saludAsistenciaOpciones : [];
      const nextOptions = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      return { ...prev, saludAsistenciaOpciones: nextOptions };
    });

    if (touched.saludAsistenciaOpciones) {
      const current = Array.isArray(formData.saludAsistenciaOpciones) ? formData.saludAsistenciaOpciones : [];
      const nextOptions = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      const msg = validateField('saludAsistenciaOpciones', nextOptions);
      setErrors((prev) => ({ ...prev, saludAsistenciaOpciones: msg }));
    }
  };

  const handleHousingCompositionToggle = (option) => {
    setIsDirty(true);
    setFormData((prev) => {
      const current = Array.isArray(prev.viviendaConformacion) ? prev.viviendaConformacion : [];
      const nextOptions = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      return { ...prev, viviendaConformacion: nextOptions };
    });

    if (touched.viviendaConformacion) {
      const current = Array.isArray(formData.viviendaConformacion) ? formData.viviendaConformacion : [];
      const nextOptions = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      const msg = validateField('viviendaConformacion', nextOptions);
      setErrors((prev) => ({ ...prev, viviendaConformacion: msg }));
    }
  };

  const handleHouseholdMemberChange = (index, field, value) => {
    setIsDirty(true);
    setHouseholdMembers((prev) =>
      prev.map((member, i) => (i === index ? { ...member, [field]: value } : member))
    );
    setActiveHouseholdRow(index);
  };

  const handleAddHouseholdMember = () => {
    setIsDirty(true);
    setHouseholdMembers((prev) => [
      ...prev,
      { nombre: '', parentesco: '', edad: '', sexo: '', estadoCivil: '', ocupacionLugar: '' },
    ]);
    setActiveHouseholdRow(householdMembers.length);
  };

  const handleRemoveHouseholdMember = (index) => {
    setIsDirty(true);
    setHouseholdMembers((prev) => {
      if (prev.length === 1) {
        setActiveHouseholdRow(0);
        return [{ nombre: '', parentesco: '', edad: '', sexo: '', estadoCivil: '', ocupacionLugar: '' }];
      }
      const next = prev.filter((_, i) => i !== index);
      setActiveHouseholdRow((current) => Math.max(0, Math.min(current, next.length - 1)));
      return next;
    });
  };

  const handleContributorChange = (index, field, value) => {
    setIsDirty(true);
    setIncomeContributors((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
    setActiveContributorRow(index);
  };

  const handleAddContributor = () => {
    setIsDirty(true);
    setIncomeContributors((prev) => [...prev, { parentesco: '', cantidadMensual: '' }]);
    setActiveContributorRow(incomeContributors.length);
  };

  const handleRemoveContributor = (index) => {
    setIsDirty(true);
    setIncomeContributors((prev) => {
      if (prev.length === 1) {
        setActiveContributorRow(0);
        return [{ parentesco: '', cantidadMensual: '' }];
      }
      const next = prev.filter((_, i) => i !== index);
      setActiveContributorRow((current) => Math.max(0, Math.min(current, next.length - 1)));
      return next;
    });
  };

  const handleIncomeChange = (field, value) => {
    setIsDirty(true);
    setMonthlyIncomes((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpenseChange = (field, value) => {
    setIsDirty(true);
    setMonthlyExpenses((prev) => ({ ...prev, [field]: value }));
  };

  const handleFoodFrequencyChange = (foodKey, value) => {
    setIsDirty(true);
    setFoodFrequency((prev) => ({ ...prev, [foodKey]: value }));
  };

  const handleFamilyReferenceChange = (index, field, value) => {
    setIsDirty(true);
    setFamilyReferences((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
    setActiveFamilyReferenceRow(index);

    if (touched.familiarReferencias) {
      setErrors((prev) => ({ ...prev, familiarReferencias: '' }));
    }
  };

  const handleAddFamilyReference = () => {
    setIsDirty(true);
    setFamilyReferences((prev) => [...prev, { nombre: '', telefono: '', relacion: '', tiempoConocer: '' }]);
    setActiveFamilyReferenceRow(familyReferences.length);
  };

  const handleRemoveFamilyReference = (index) => {
    setIsDirty(true);
    setFamilyReferences((prev) => {
      if (prev.length <= 2) {
        return prev;
      }
      const next = prev.filter((_, i) => i !== index);
      setActiveFamilyReferenceRow((current) => Math.max(0, Math.min(current, next.length - 1)));
      return next;
    });
  };

  const handleVehicleAssetChange = (index, field, value) => {
    setIsDirty(true);
    setVehicleAssets((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
    setActiveVehicleRow(index);
  };

  const handleAddVehicleAsset = () => {
    setIsDirty(true);
    setVehicleAssets((prev) => [...prev, { marca: '', ano: '', propietario: '' }]);
    setActiveVehicleRow(vehicleAssets.length);
  };

  const handleRemoveVehicleAsset = (index) => {
    setIsDirty(true);
    setVehicleAssets((prev) => {
      if (prev.length === 1) {
        setActiveVehicleRow(0);
        return [{ marca: '', ano: '', propietario: '' }];
      }
      const next = prev.filter((_, i) => i !== index);
      setActiveVehicleRow((current) => Math.max(0, Math.min(current, next.length - 1)));
      return next;
    });
  };

  const isTabCompleted = (tabId) => {
    const fields = getActiveRequiredFields(tabId);
    if (fields.length === 0) return false;

    const requiredFieldsDone = fields.every((name) => {
      const fieldValue = getNestedFieldValue(formData, name);
      return validateField(name, fieldValue) === '';
    });
    if (tabId === 'familiar') {
      return requiredFieldsDone && hasMinimumFamilyReferences;
    }

    const tabBlockingFindings = getCrossRuleFindings(tabId).filter((item) => item.severity === 'error');
    if (tabBlockingFindings.length > 0) {
      return false;
    }

    return requiredFieldsDone;
  };

  const validateCurrentTab = () => {
    const reqFields = getActiveRequiredFields(activeTab);
    const newErrors = {};

    reqFields.forEach((name) => {
      const msg = validateField(name, getNestedFieldValue(formData, name));
      if (msg) newErrors[name] = msg;
    });

    setTouched((prev) => {
      const updates = { ...prev };
      reqFields.forEach((field) => {
        updates[field] = true;
      });
      return updates;
    });

    if (activeTab === 'familiar' && !hasMinimumFamilyReferences) {
      newErrors.familiarReferencias = 'Captura al menos 2 referencias completas (nombre, teléfono, relación y tiempo de conocerse).';
      setTouched((prev) => ({ ...prev, familiarReferencias: true }));
    }

    const tabBlockingFindings = getCrossRuleFindings(activeTab).filter((item) => item.severity === 'error');
    tabBlockingFindings.forEach((finding) => {
      newErrors[finding.field] = finding.message;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const buildValidationChecklist = () => {
    const checklist = [];

    tabs.forEach((tab) => {
      const reqFields = getActiveRequiredFields(tab.id);
      reqFields.forEach((name) => {
        const msg = validateField(name, formData[name]);
        if (msg) {
          checklist.push({
            id: `required-${tab.id}-${name}`,
            tabId: tab.id,
            field: name,
            severity: 'error',
            message: `${fieldLabels[name] || name}: ${msg}`,
          });
        }
      });

      if (tab.id === 'familiar' && !hasMinimumFamilyReferences) {
        checklist.push({
          id: 'required-familiar-referencias',
          tabId: 'familiar',
          field: 'familiarReferencias',
          severity: 'error',
          message: 'Familiar: captura al menos 2 referencias completas.',
        });
      }
    });

    getCrossRuleFindings().forEach((finding, index) => {
      checklist.push({
        id: `cross-${finding.tabId}-${finding.field}-${index}`,
        ...finding,
      });
    });

    return checklist;
  };

  const applyChecklistToErrors = (items) => {
    const newErrors = {};
    const nextTouched = { ...touched };

    items
      .filter((item) => item.severity === 'error')
      .forEach((item) => {
        if (item.field) {
          newErrors[item.field] = item.message;
          nextTouched[item.field] = true;
        }
      });

    setTouched(nextTouched);
    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const openChecklist = (items) => {
    setChecklistItems(items);
    setChecklistVisible(true);
  };

  const handlePreviousStep = () => {
    if (isFirstStep) return;
    setActiveTab(tabs[currentTabIndex - 1].id);
  };

  const handleNextStep = () => {
    const isValid = validateCurrentTab();
    if (!isValid) {
      setFeedback({
        type: 'error',
        message: 'Completa los campos obligatorios de esta sección antes de continuar.',
      });
      return;
    }
    setFeedback(null);
    if (!isLastStep) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('Tienes cambios sin guardar. ¿Deseas salir de todos modos?');
      if (!confirmed) return;
    }
    setFormData({
      nombreSolicitante: '',
      solicitanteNombres: '',
      solicitanteApellidoPaterno: '',
      solicitanteApellidoMaterno: '',
      fechaNacimiento: '',
      lugarNacimiento: '',
      edad: '',
      sexo: '',
      escolaridad: '',
      ocupacion: '',
      estadoCivil: '',
      direccionCalle: '',
      direccionNoExt: '',
      direccionNoInt: '',
      direccionColonia: '',
      direccionMunicipioDelegacion: '',
      direccionCp: '',
      direccionCiudadEstado: '',
      telefonoCasa: '',
      telefonoCelular: '',
      cuentaConTarjeta: '',
      pacienteNombre: '',
      pacienteNombres: '',
      pacienteApellidoPaterno: '',
      pacienteApellidoMaterno: '',
      pacienteFechaNacimiento: '',
      pacienteLugarNacimiento: '',
      pacienteEdad: '',
      pacienteSexo: '',
      pacienteEscolaridad: '',
      pacienteOcupacion: '',
      pacienteEstadoCivil: '',
      pacienteDireccion: '',
      pacienteTelefonoCasa: '',
      pacienteTelefonoCelular: '',
      laboralCuentaConEmpleo: '',
      laboralLugarTrabajo: '',
      laboralAntiguedad: '',
      laboralPuesto: '',
      laboralHorario: '',
      laboralDependientes: '',
      laboralIngresoMensual: '',
      laboralOtrosIngresos: '',
      laboralCategoriaOcupacion: '',
      laboralNumeroOcupacion: '',
      conyugeOcupacion: '',
      conyugeLugarTrabajo: '',
      conyugeAntiguedad: '',
      conyugeIngresoMensual: '',
      familiarAportaIngreso: '',
      numeroIntegrantesAportan: '',
      balanceEconomico: '',
      patrimonioCuentaAuto: '',
      patrimonioCantidad: '',
      vehiculoCategoria: '',
      vehiculoNumero: '',
      saludAsistenciaOpciones: [],
      saludMontoConsultas: '',
      saludOtrosServicios: '',
      saludMiembrosConAsistencia: '',
      saludAdicAlcoholismoDetalle: '',
      saludAdicAlcoholismoFrecuencia: '',
      saludAdicAlcoholismoSeveridad: '',
      saludAdicTcaLudopatiaDetalle: '',
      saludAdicTcaLudopatiaFrecuencia: '',
      saludAdicTcaLudopatiaSeveridad: '',
      saludAdicDrogadiccionDetalle: '',
      saludAdicDrogadiccionFrecuencia: '',
      saludAdicDrogadiccionSeveridad: '',
      saludAdicOtrosDetalle: '',
      saludAdicOtrosFrecuencia: '',
      saludAdicOtrosSeveridad: '',
      saludRelacionFamiliar: '',
      viviendaRegimen: '',
      viviendaRegimenNumero: '',
      viviendaTipo: '',
      viviendaTipoNumero: '',
      viviendaTotalHabitaciones: '',
      viviendaTotalHabitacionesNumero: '',
      viviendaConformacion: [],
      viviendaBanos: '',
      viviendaRecamaras: '',
      viviendaEspecificarSinBanos: '',
      viviendaOtrasCaracteristicas: '',
      viviendaMaterialPiso: '',
      viviendaMaterialPisoNumero: '',
      viviendaMaterialMuros: '',
      viviendaMaterialMurosNumero: '',
      viviendaMaterialTecho: '',
      viviendaMaterialTechoNumero: '',
      diagnosticoEconomico: createDiagnosticoEconomicoState(),
      familiarDiagnostico: '',
      familiarObservacionesTrabajoSocial: '',
      familiarObservacionesVisitaDomiciliaria: '',
    });
    setHouseholdMembers([{ nombre: '', parentesco: '', edad: '', sexo: '', estadoCivil: '', ocupacionLugar: '' }]);
    setIncomeContributors([{ parentesco: '', cantidadMensual: '' }]);
    setVehicleAssets([{ marca: '', ano: '', propietario: '' }]);
    setMonthlyIncomes({ solicitante: '', conyuge: '', hijos: '', otros: '' });
    setMonthlyExpenses({
      alimentacion: '',
      renta: '',
      luz: '',
      agua: '',
      combustible: '',
      transporte: '',
      educacion: '',
      telefono: '',
      gastosMedicos: '',
      esparcimiento: '',
      otros: '',
    });
    setFoodFrequency({
      carneRes: '',
      carnePollo: '',
      carneCerdo: '',
      pescado: '',
      leche: '',
      cereales: '',
      huevo: '',
      frutas: '',
      verduras: '',
      leguminosas: '',
    });
    setFamilyReferences([
      { nombre: '', telefono: '', relacion: '', tiempoConocer: '' },
      { nombre: '', telefono: '', relacion: '', tiempoConocer: '' },
    ]);
    setActiveFamilyReferenceRow(0);
    setRechazoModalAbierto(false);
    setObservacionesRechazo('');
    setErrorRechazo('');
    setGuardandoRechazo(false);
    setRechazoRegistrado(false);
    setTouched({});
    setErrors({});
    setIsDirty(false);
    navigate('/admisiones');
  };

  const handleSaveDraft = () => {
    // Base para escalado: aquí luego se puede guardar sección por sección en backend.
    setIsDirty(false);
    setFeedback({
      type: 'success',
      message: `Borrador guardado para la sección "${activeTab}".`,
    });
  };

  const handleOpenRechazoAdministrativo = () => {
    setErrorRechazo('');
    setObservacionesRechazo('');
    setRechazoModalAbierto(true);
  };

  const handleConfirmarRechazoAdministrativo = async () => {
    if (guardandoRechazo) {
      return;
    }

    const observaciones = observacionesRechazo.trim();
    if (!observaciones) {
      setErrorRechazo('Debes registrar las observaciones del rechazo.');
      return;
    }

    try {
      setGuardandoRechazo(true);
      setErrorRechazo('');

      const response = await fetch(`http://localhost:4000/api/pacientes/${pacienteSeleccionadoId}/rechazo-administrativo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'RECHAZADO_ECONOMICO',
          observaciones,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'No se pudo registrar el rechazo administrativo.');
      }

      setRechazoRegistrado(true);
      setRechazoModalAbierto(false);
      setObservacionesRechazo('');
      setFeedback({
        type: 'success',
        message: 'Se registró la denegación por insuficiencia económica y el expediente quedó marcado como DENEGADO.',
      });
    } catch (error) {
      setErrorRechazo(error.message || 'No se pudo registrar el rechazo.');
    } finally {
      setGuardandoRechazo(false);
    }
  };

  const cargarDatosDePrueba = () => {
    setIsDirty(true);
    setActiveTab('solicitante');
    setFormData((prev) => ({
      ...prev,
      nombreSolicitante: 'María Fernanda López Rivera',
      solicitanteNombres: 'María Fernanda',
      solicitanteApellidoPaterno: 'López',
      solicitanteApellidoMaterno: 'Rivera',
      fechaNacimiento: '1985-04-18',
      lugarNacimiento: 'Guadalajara, Jalisco',
      edad: '40',
      sexo: 'femenino',
      escolaridad: 'Licenciatura',
      ocupacion: 'Administrativa',
      estadoCivil: 'Casado(a)',
      direccionCalle: 'Av. del Lago',
      direccionNoExt: '245',
      direccionNoInt: '3B',
      direccionColonia: 'Residencial Victoria',
      direccionMunicipioDelegacion: 'Zapopan',
      direccionCp: '45019',
      direccionCiudadEstado: 'Jalisco',
      telefonoCasa: '33 3812 4455',
      telefonoCelular: '33 1122 3344',
      cuentaConTarjeta: 'Débito',
      pacienteNombre: 'Juan Pablo López Rivera',
      pacienteNombres: 'Juan Pablo',
      pacienteApellidoPaterno: 'López',
      pacienteApellidoMaterno: 'Rivera',
      pacienteFechaNacimiento: '2008-09-02',
      pacienteLugarNacimiento: 'Guadalajara, Jalisco',
      pacienteEdad: '17',
      pacienteSexo: 'masculino',
      pacienteEscolaridad: 'Preparatoria',
      pacienteOcupacion: 'Estudiante',
      pacienteEstadoCivil: 'Soltero(a)',
      pacienteDireccion: 'Av. del Lago 245, Residencial Victoria, Zapopan, Jalisco',
      pacienteTelefonoCasa: '33 3812 4455',
      pacienteTelefonoCelular: '33 1122 3344',
      laboralCuentaConEmpleo: 'si',
      laboralLugarTrabajo: 'Empresa Logística del Centro',
      laboralAntiguedad: '4 años',
      laboralPuesto: 'Coordinadora administrativa',
      laboralHorario: '08:00 a 16:00 hrs',
      laboralDependientes: '2',
      laboralIngresoMensual: '18500',
      laboralOtrosIngresos: '2000',
      laboralCategoriaOcupacion: 'profesionista',
      laboralNumeroOcupacion: '2',
      conyugeOcupacion: 'Comerciante',
      conyugeLugarTrabajo: 'Mercado San Juan',
      conyugeAntiguedad: '6 años',
      conyugeIngresoMensual: '12000',
      familiarAportaIngreso: 'si',
      numeroIntegrantesAportan: '2',
      balanceEconomico: 'superavit',
      patrimonioCuentaAuto: 'si',
      patrimonioCantidad: '1',
      vehiculoCategoria: 'uno_dos',
      vehiculoNumero: '1',
      saludAsistenciaOpciones: ['seguro_social', 'consulta_privada'],
      saludMontoConsultas: '700',
      saludOtrosServicios: '250',
      saludMiembrosConAsistencia: '3',
      saludAdicAlcoholismoDetalle: 'No aplica',
      saludAdicAlcoholismoFrecuencia: 'Ocasional',
      saludAdicAlcoholismoSeveridad: 'Baja',
      saludAdicTcaLudopatiaDetalle: 'No aplica',
      saludAdicTcaLudopatiaFrecuencia: 'Ninguna',
      saludAdicTcaLudopatiaSeveridad: 'Nula',
      saludAdicDrogadiccionDetalle: 'No aplica',
      saludAdicDrogadiccionFrecuencia: 'Ninguna',
      saludAdicDrogadiccionSeveridad: 'Nula',
      saludAdicOtrosDetalle: 'Sin datos relevantes',
      saludAdicOtrosFrecuencia: 'Esporádica',
      saludAdicOtrosSeveridad: 'Baja',
      saludRelacionFamiliar: 'Estable',
      viviendaRegimen: 'propia',
      viviendaRegimenNumero: '1',
      viviendaTipo: 'casa_habitacion',
      viviendaTipoNumero: '0',
      viviendaTotalHabitaciones: 'mas_cuatro',
      viviendaTotalHabitacionesNumero: '2',
      viviendaConformacion: ['solicitante', 'conyuge', 'hijos'],
      viviendaBanos: '2',
      viviendaRecamaras: '4',
      viviendaEspecificarSinBanos: 'No aplica',
      viviendaOtrasCaracteristicas: 'Patio y cochera',
      viviendaMaterialPiso: 'vitropiso',
      viviendaMaterialPisoNumero: '1',
      viviendaMaterialMuros: 'concreto',
      viviendaMaterialMurosNumero: '1',
      viviendaMaterialTecho: 'concreto',
      viviendaMaterialTechoNumero: '1',
      diagnosticoEconomico: {
        puntosNivel1: '2',
        costoNivel1: '1500',
        puntosNivel2: '1',
        costoNivel2: '1200',
        puntosNivel3: '1',
        costoNivel3: '900',
        totalPuntos: '4',
        costoBase: '3600',
        diasTratamiento: '30',
        montoKit: '550',
        costoTotal: '4400',
      },
      familiarDiagnostico: 'Entorno familiar funcional con soporte económico estable.',
      familiarObservacionesTrabajoSocial: 'Se observa red de apoyo suficiente para el proceso de ingreso.',
      familiarObservacionesVisitaDomiciliaria: 'Vivienda limpia, organizada y con condiciones adecuadas para evaluación institucional.',
    }));

    setHouseholdMembers([
      { nombre: 'María Fernanda López Rivera', parentesco: 'Madre', edad: '40', sexo: 'femenino', estadoCivil: 'Casado(a)', ocupacionLugar: 'Administrativa' },
      { nombre: 'Juan Pablo López Rivera', parentesco: 'Hijo', edad: '17', sexo: 'masculino', estadoCivil: 'Soltero(a)', ocupacionLugar: 'Estudiante' },
      { nombre: 'Carlos Alberto Rivera', parentesco: 'Esposo', edad: '42', sexo: 'masculino', estadoCivil: 'Casado(a)', ocupacionLugar: 'Comerciante' },
    ]);

    setIncomeContributors([
      { parentesco: 'Solicitante', cantidadMensual: '18500' },
      { parentesco: 'Cónyuge', cantidadMensual: '12000' },
    ]);

    setVehicleAssets([
      { marca: 'Toyota', ano: '2020', propietario: 'Solicitante' },
      { marca: 'Nissan', ano: '2018', propietario: 'Cónyuge' },
    ]);

    setMonthlyIncomes({
      solicitante: '18500',
      conyuge: '12000',
      hijos: '0',
      otros: '2000',
    });

    setMonthlyExpenses({
      alimentacion: '7000',
      renta: '0',
      luz: '650',
      agua: '300',
      combustible: '1500',
      transporte: '700',
      educacion: '2500',
      telefono: '850',
      gastosMedicos: '900',
      esparcimiento: '1200',
      otros: '1100',
    });

    setFoodFrequency({
      carneRes: 'semanal',
      carnePollo: 'diario',
      carneCerdo: 'semanal',
      pescado: 'mensual',
      leche: 'diario',
      cereales: 'diario',
      huevo: 'diario',
      frutas: 'diario',
      verduras: 'diario',
      leguminosas: 'semanal',
    });

    setFamilyReferences([
      { nombre: 'Laura Medina', telefono: '33 4556 7788', relacion: 'Vecina', tiempoConocer: '10 años' },
      { nombre: 'Ricardo Torres', telefono: '33 7788 9900', relacion: 'Hermano', tiempoConocer: '17 años' },
    ]);

    setFeedback({
      type: 'success',
      message: 'Se cargaron datos de prueba para Solicitante, Paciente y secciones principales.',
    });
  };

  const handleSaveStudy = async (allowWarnings = false) => {
    if (guardandoEstudio) {
      return;
    }

    if (!pacienteSeleccionadoId) {
      setFeedback({
        type: 'warning',
        message: 'Primero selecciona un paciente para actualizar Solicitante y Paciente.',
      });
      return;
    }

    if (cargandoCitasRegistradas || errorCitasRegistradas) {
      setFeedback({
        type: 'warning',
        message: 'No se puede validar la cita registrada del paciente en este momento.',
      });
      return;
    }

    const pacienteTieneCita = citasRegistradas.some((item) => item.pacienteId === pacienteSeleccionadoId);
    if (!pacienteTieneCita) {
      setFeedback({
        type: 'warning',
        message: 'Para guardar estudio socioeconómico, el paciente debe tener una cita registrada.',
      });
      return;
    }

    const checklist = buildValidationChecklist();
    const hasBlockingIssues = checklist.some((item) => item.severity === 'error');
    const hasWarnings = checklist.some((item) => item.severity === 'warning');

    if (hasBlockingIssues || (hasWarnings && !allowWarnings)) {
      applyChecklistToErrors(checklist);
      openChecklist(checklist);

      if (hasBlockingIssues) {
        setFeedback({
          type: 'error',
          message: 'Hay inconsistencias que bloquean el guardado. Revísalas en el checklist.',
        });
      } else {
        setFeedback({
          type: 'warning',
          message: 'Hay advertencias revisables antes de generar PDF. Puedes continuar si lo deseas.',
        });
      }

      return;
    }

    try {
      setGuardandoEstudio(true);
      setFeedback({
        type: 'info',
        message: 'Guardando estudio y generando PDF, espera un momento...',
      });
      const payload = {
        nombreSolicitante: formData.nombreSolicitante,
        solicitanteNombres: formData.solicitanteNombres,
        solicitanteApellidoPaterno: formData.solicitanteApellidoPaterno,
        solicitanteApellidoMaterno: formData.solicitanteApellidoMaterno,
        fechaNacimientoSolicitante: formData.fechaNacimiento,
        edadSolicitante: formData.edad ? Number(formData.edad) : null,
        sexoSolicitante: formData.sexo,
        escolaridadSolicitante: formData.escolaridad,
        estadoCivilSolicitante: formData.estadoCivil,
        lugarNacimientoSolicitante: formData.lugarNacimiento,
        ocupacionSolicitante: formData.ocupacion,
        direccionCalleSolicitante: formData.direccionCalle,
        direccionNoExtSolicitante: formData.direccionNoExt,
        direccionNoIntSolicitante: formData.direccionNoInt,
        direccionColoniaSolicitante: formData.direccionColonia,
        direccionMunicipioDelegacionSolicitante: formData.direccionMunicipioDelegacion,
        direccionCpSolicitante: formData.direccionCp,
        direccionCiudadEstadoSolicitante: formData.direccionCiudadEstado,
        telefonoCasaSolicitante: formData.telefonoCasa,
        telefonoCelularSolicitante: formData.telefonoCelular,
        cuentaConTarjetaSolicitante: formData.cuentaConTarjeta,
        nombrePaciente: formData.pacienteNombre,
        pacienteNombres: formData.pacienteNombres,
        pacienteApellidoPaterno: formData.pacienteApellidoPaterno,
        pacienteApellidoMaterno: formData.pacienteApellidoMaterno,
        fechaNacimientoPaciente: formData.pacienteFechaNacimiento,
        edadPaciente: formData.pacienteEdad ? Number(formData.pacienteEdad) : null,
        sexoPaciente: formData.pacienteSexo,
        estadoCivilPaciente: formData.pacienteEstadoCivil,
        escolaridadPaciente: formData.pacienteEscolaridad,
        ocupacionPaciente: formData.pacienteOcupacion,
        lugarNacimientoPaciente: formData.pacienteLugarNacimiento,
        direccionPaciente: formData.pacienteDireccion,
        telefonoCasaPaciente: formData.pacienteTelefonoCasa,
        telefonoCelularPaciente: formData.pacienteTelefonoCelular,
      };

      // Sólo actualizar datos básicos (activar ficha de solicitante) si la cita programada
      // para este paciente ya ocurrió (o es exactamente ahora).
      const citaPaciente = citasRegistradas.find((c) => c.pacienteId === pacienteSeleccionadoId);
      const ahora = new Date();

      if (citaPaciente && citaPaciente.fechaHoraProgramada) {
        const fechaCita = new Date(citaPaciente.fechaHoraProgramada);
        if (fechaCita.getTime() <= ahora.getTime()) {
          // La cita ya ocurrió, activar la ficha
          const response = await fetch(`http://localhost:4000/api/pacientes/${pacienteSeleccionadoId}/datos-basicos`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'No fue posible actualizar los datos.');
          }
        } else {
          // La cita está en el futuro, no activamos la ficha aún
          setFeedback({
            type: 'info',
            message: 'La ficha de solicitante se activará cuando llegue la fecha y hora de la cita.',
          });
        }
      } else {
        // No hay cita registrada, mostrar aviso pero continuar con el PDF
        setFeedback({
          type: 'warning',
          message: 'No se encontró cita registrada para este paciente; la ficha no se activará.',
        });
      }

      const pdfPayload = {
        estudio: {
          formData,
          diagnosticoEconomico: {
            ...formData.diagnosticoEconomico,
            ...calculateDiagnosticoEconomico(formData.diagnosticoEconomico || {}),
          },
          householdMembers,
          incomeContributors,
          vehicleAssets,
          monthlyIncomes,
          monthlyExpenses,
          foodFrequency,
          familyReferences,
        },
      };

      const pdfResponse = await fetch(`http://localhost:4000/api/pacientes/${pacienteSeleccionadoId}/estudio-socioeconomico/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfPayload),
      });

      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text();
        throw new Error(errorText || 'No fue posible generar el PDF del estudio.');
      }

      const pdfData = await pdfResponse.json();

      setIsDirty(false);
      setGuardandoEstudio(false);
      setChecklistVisible(false);
      setChecklistItems([]);
      setFeedback({
        type: 'success',
        message: `Se actualizó Solicitante y Paciente y se generó el PDF ${pdfData?.nombreArchivo || ''}.`,
      });
      navigate('/admisiones');
    } catch (error) {
      console.error('Error guardando estudio basico:', error);
      setGuardandoEstudio(false);
      setFeedback({
        type: 'error',
        message: 'No se pudo guardar. Verifica backend o conexión.',
      });
    }
  };

  const handleContinueAfterWarnings = () => {
    const hasBlockingIssues = checklistItems.some((item) => item.severity === 'error');
    if (hasBlockingIssues || guardandoEstudio) {
      return;
    }
    setChecklistVisible(false);
    setChecklistItems([]);
    handleSaveStudy(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(126,29,59,0.10),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] font-sans">
        <div className="mx-auto max-w-[1600px] p-4 md:p-6">

      {/* --- HEADER DE ACCIÓN --- */}
      <AdminHeader submodule="Estudio Socioeconómico" />

        <main className="space-y-5">

        {feedback && (
          <section
            className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${
              feedback.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : feedback.type === 'info'
                ? 'border-sky-200 bg-sky-50 text-sky-800'
                : feedback.type === 'warning'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{feedback.message}</p>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide opacity-80 hover:opacity-100"
              >
                Cerrar
              </button>
            </div>
          </section>
        )}
        
        {/* --- BUSCADOR DE SOLICITANTE --- */}
        <section className="mb-8">
          <div className="relative group z-20">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7E1D3B] transition-colors" size={20}/>
            <input 
              type="text" 
              value={busquedaPaciente}
              onChange={(e) => setBusquedaPaciente(e.target.value)}
              onFocus={() => {
                if (busquedaPaciente.trim().length >= 2) {
                  setMostrarResultados(true);
                }
              }}
              onBlur={() => {
                window.setTimeout(() => setMostrarResultados(false), 120);
              }}
              onKeyDown={handleBusquedaPacienteKeyDown}
              placeholder="Escribe el nombre del paciente (minimo 2 letras)..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/20 focus:border-[#7E1D3B] transition-all text-sm hover:shadow-md"
            />
            {mostrarResultados && busquedaPaciente.trim().length >= 2 && (
              <div className="absolute left-0 right-0 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Resultados por nombre
                </div>

                {cargandoPacientes && (
                  <p className="px-4 py-3 text-sm text-slate-500">Buscando pacientes...</p>
                )}

                {errorPacientes && (
                  <p className="px-4 py-3 text-sm text-rose-700 bg-rose-50">{errorPacientes}</p>
                )}

                {!cargandoPacientes && !errorPacientes && pacientesBase.length === 0 && (
                  <p className="px-4 py-3 text-sm text-slate-500">No se encontraron pacientes con ese nombre.</p>
                )}

                {!cargandoPacientes && !errorPacientes && pacientesBase.length > 0 && (
                  <ul className="max-h-72 overflow-y-auto">
                    {pacientesBase.map((paciente, index) => {
                      const activo = pacienteSeleccionadoId === paciente.id;
                      const resaltado = index === indiceResaltado;

                      return (
                        <li key={paciente.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setIndiceResaltado(index)}
                            onClick={() => {
                              seleccionarPaciente(paciente);
                              setMostrarResultados(false);
                            }}
                            className={`w-full border-b border-slate-100 px-4 py-2 text-left transition last:border-b-0 ${
                              resaltado || activo
                                ? 'bg-[#7E1D3B]/10'
                                : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <p className="text-sm font-semibold text-slate-900">{paciente.nombreCompleto}</p>
                            <p className="text-xs text-slate-500">
                              Solicitante: {paciente.solicitante?.nombre || 'Sin nombre'} • Tel: {paciente.telefonoContacto || paciente.solicitante?.telefono || '--'}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>

          {!errorPacientes && busquedaPaciente.trim().length < 2 && (
            <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Escribe al menos 2 letras del nombre del paciente para iniciar la busqueda.
            </p>
          )}
        </section>

        {!cargandoCitasRegistradas && errorCitasRegistradas && (
          <section className="-mt-2 mb-2">
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {errorCitasRegistradas}
            </p>
          </section>
        )}

        <nav className="flex flex-wrap gap-2 mb-8 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-[#7E1D3B] text-white shadow-sm scale-[1.01]' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              {isTabCompleted(tab.id) ? (
                <CheckCircle2 size={14} />
              ) : (
                <Circle size={14} />
              )}
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        

        {/* --- CONTENEDOR DEL FORMULARIO --- */}
          <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rose-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-14 h-32 w-32 rounded-full bg-slate-100 blur-2xl" />
          
          {/* Solo llenamos SOLICITANTE como pediste */}
          {activeTab === 'solicitante' && (
              <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <Info size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Información del Solicitante</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Captura inicial</p>
                </div>
              </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                  <InputGroup label="Nombre(s) del Solicitante" name="solicitanteNombres" value={formData.solicitanteNombres} error={errors.nombreSolicitante} required onChange={handleChange} onBlur={handleBlur} placeholder="Nombre(s)" />
                  <InputGroup label="Apellido paterno" name="solicitanteApellidoPaterno" value={formData.solicitanteApellidoPaterno} onChange={handleChange} onBlur={handleBlur} placeholder="Apellido paterno" />
                  <InputGroup label="Apellido materno" name="solicitanteApellidoMaterno" value={formData.solicitanteApellidoMaterno} onChange={handleChange} onBlur={handleBlur} placeholder="Apellido materno" />
                <InputGroup label="Fecha de Nacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} error={errors.fechaNacimiento} required onChange={handleChange} onBlur={handleBlur} type="date" />
                
                <InputGroup label="Lugar de Nacimiento" name="lugarNacimiento" value={formData.lugarNacimiento} error={errors.lugarNacimiento} onChange={handleChange} onBlur={handleBlur} placeholder="Estado / Municipio" />
                <InputGroup label="Edad" name="edad" value={formData.edad} error={errors.edad} required onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" readOnly />

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Sexo <span className="text-[#7E1D3B]">*</span></label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all group">
                      <input
                        type="radio"
                        name="sexo"
                        value="masculino"
                        checked={formData.sexo === 'masculino'}
                        onChange={(e) => handleChange('sexo', e.target.value)}
                        onBlur={() => handleBlur('sexo')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">Masculino</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                      <input
                        type="radio"
                        name="sexo"
                        value="femenino"
                        checked={formData.sexo === 'femenino'}
                        onChange={(e) => handleChange('sexo', e.target.value)}
                        onBlur={() => handleBlur('sexo')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">Femenino</span>
                    </label>
                  </div>
                  {errors.sexo && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.sexo}</p>}
                </div>

                <SelectGroup
                  label="Grado de Escolaridad"
                  name="escolaridad"
                  value={formData.escolaridad}
                  error={errors.escolaridad}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={['Primaria', 'Secundaria', 'Preparatoria', 'Licenciatura', 'Postgrado', 'Ninguno']}
                />
                
                <InputGroup label="Ocupación Actual" name="ocupacion" value={formData.ocupacion} error={errors.ocupacion} onChange={handleChange} onBlur={handleBlur} placeholder="A qué se dedica..." />
                <SelectGroup
                  label="Estado Civil"
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  error={errors.estadoCivil}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Unión Libre']}
                />

                <InputGroup label="Número Telefónico (Casa)" name="telefonoCasa" value={formData.telefonoCasa} error={errors.telefonoCasa} onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />
                <InputGroup label="Teléfono Celular" name="telefonoCelular" value={formData.telefonoCelular} error={errors.telefonoCelular} required onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />
                <SelectGroup
                  label="Cuenta con alguna tarjeta? (crédito, débito, ahorro)"
                  name="cuentaConTarjeta"
                  value={formData.cuentaConTarjeta}
                  error={errors.cuentaConTarjeta}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={['No', 'Crédito', 'Débito', 'Ahorro']}
                />

                  <div className="md:col-span-2 xl:col-span-3 bg-rose-50/70 p-4 rounded-2xl border border-rose-100/70">
                   <p className="mb-3 text-sm font-bold text-[#7E1D3B]">Dirección actual</p>
                   <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
                     <InputGroup label="Calle" name="direccionCalle" value={formData.direccionCalle} error={errors.direccionCalle} required onChange={handleChange} onBlur={handleBlur} placeholder="Calle" />
                     <InputGroup label="No. Ext." name="direccionNoExt" value={formData.direccionNoExt} error={errors.direccionNoExt} onChange={handleChange} onBlur={handleBlur} placeholder="No. Ext." />
                     <InputGroup label="No. Int." name="direccionNoInt" value={formData.direccionNoInt} error={errors.direccionNoInt} onChange={handleChange} onBlur={handleBlur} placeholder="No. Int." />
                   </div>
                   <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-4">
                     <InputGroup label="Colonia" name="direccionColonia" value={formData.direccionColonia} error={errors.direccionColonia} required onChange={handleChange} onBlur={handleBlur} placeholder="Colonia" />
                     <InputGroup label="Mpio. o Delegación" name="direccionMunicipioDelegacion" value={formData.direccionMunicipioDelegacion} error={errors.direccionMunicipioDelegacion} required onChange={handleChange} onBlur={handleBlur} placeholder="Municipio o Delegación" />
                     <InputGroup label="C.P." name="direccionCp" value={formData.direccionCp} error={errors.direccionCp} required onChange={handleChange} onBlur={handleBlur} placeholder="C.P." />
                     <InputGroup label="Ciudad o Estado" name="direccionCiudadEstado" value={formData.direccionCiudadEstado} error={errors.direccionCiudadEstado} required onChange={handleChange} onBlur={handleBlur} placeholder="Ciudad o Estado" />
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paciente' && (
            <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <User size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Información del Paciente</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Captura clínica inicial</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                <InputGroup label="Nombre(s) del Paciente" name="pacienteNombres" value={formData.pacienteNombres} error={errors.pacienteNombre} required onChange={handleChange} onBlur={handleBlur} placeholder="Nombre(s)" />
                <InputGroup label="Apellido paterno" name="pacienteApellidoPaterno" value={formData.pacienteApellidoPaterno} onChange={handleChange} onBlur={handleBlur} placeholder="Apellido paterno" />
                <InputGroup label="Apellido materno" name="pacienteApellidoMaterno" value={formData.pacienteApellidoMaterno} onChange={handleChange} onBlur={handleBlur} placeholder="Apellido materno" />
                <InputGroup label="Fecha de Nacimiento" name="pacienteFechaNacimiento" value={formData.pacienteFechaNacimiento} error={errors.pacienteFechaNacimiento} required onChange={handleChange} onBlur={handleBlur} type="date" />

                <InputGroup label="Lugar de Nacimiento" name="pacienteLugarNacimiento" value={formData.pacienteLugarNacimiento} error={errors.pacienteLugarNacimiento} onChange={handleChange} onBlur={handleBlur} placeholder="Estado / Municipio" />
                <InputGroup label="Edad" name="pacienteEdad" value={formData.pacienteEdad} error={errors.pacienteEdad} required onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" readOnly />

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Sexo <span className="text-[#7E1D3B]">*</span></label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all group">
                      <input
                        type="radio"
                        name="pacienteSexo"
                        value="masculino"
                        checked={formData.pacienteSexo === 'masculino'}
                        onChange={(e) => handleChange('pacienteSexo', e.target.value)}
                        onBlur={() => handleBlur('pacienteSexo')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">Masculino</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                      <input
                        type="radio"
                        name="pacienteSexo"
                        value="femenino"
                        checked={formData.pacienteSexo === 'femenino'}
                        onChange={(e) => handleChange('pacienteSexo', e.target.value)}
                        onBlur={() => handleBlur('pacienteSexo')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">Femenino</span>
                    </label>
                  </div>
                  {errors.pacienteSexo && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.pacienteSexo}</p>}
                </div>

                <SelectGroup
                  label="Grado de Escolaridad"
                  name="pacienteEscolaridad"
                  value={formData.pacienteEscolaridad}
                  error={errors.pacienteEscolaridad}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={['Primaria', 'Secundaria', 'Preparatoria', 'Licenciatura', 'Postgrado', 'Ninguno']}
                />

                <InputGroup label="Ocupación Actual" name="pacienteOcupacion" value={formData.pacienteOcupacion} error={errors.pacienteOcupacion} onChange={handleChange} onBlur={handleBlur} placeholder="A qué se dedica..." />
                <SelectGroup
                  label="Estado Civil"
                  name="pacienteEstadoCivil"
                  value={formData.pacienteEstadoCivil}
                  error={errors.pacienteEstadoCivil}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={['Soltero(a)', 'Casado(a)', 'Divorciado(a)', 'Viudo(a)', 'Unión Libre']}
                />
                {getFindingsByField('pacienteEstadoCivil', 'warning').map((item) => (
                  <div key={`warn-${item.field}`} className="md:col-span-2 xl:col-span-3 -mt-2">
                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                      {item.message}
                    </p>
                  </div>
                ))}

                <div className="md:col-span-2 xl:col-span-3">
                  <InputGroup label="Dirección Actual" name="pacienteDireccion" value={formData.pacienteDireccion} error={errors.pacienteDireccion} required onChange={handleChange} onBlur={handleBlur} placeholder="Calle, Número, Colonia, C.P." />
                </div>

                <InputGroup label="No. telefónico" name="pacienteTelefonoCasa" value={formData.pacienteTelefonoCasa} error={errors.pacienteTelefonoCasa} onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />
                <InputGroup label="Teléfono Celular" name="pacienteTelefonoCelular" value={formData.pacienteTelefonoCelular} error={errors.pacienteTelefonoCelular} required onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />
              </div>

              <HouseholdMembersTable
                rows={householdMembers}
                onChange={handleHouseholdMemberChange}
                onAddRow={handleAddHouseholdMember}
                onRemoveRow={handleRemoveHouseholdMember}
                activeRow={activeHouseholdRow}
                onRowFocus={setActiveHouseholdRow}
              />
            </div>
          )}

          {activeTab === 'laboral' && (
            <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <Briefcase size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Datos Laborales</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Situación económica familiar</p>
                </div>
              </div>

              <section>
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">Datos Laborales del Solicitante</h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Cuenta con Empleo <span className="text-[#7E1D3B]">*</span></label>
                    <div className="flex gap-4">
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                        <input
                          type="radio"
                          name="laboralCuentaConEmpleo"
                          value="si"
                          checked={formData.laboralCuentaConEmpleo === 'si'}
                          onChange={(e) => handleChange('laboralCuentaConEmpleo', e.target.value)}
                          onBlur={() => handleBlur('laboralCuentaConEmpleo')}
                          className="accent-[#7E1D3B]"
                        />
                        <span className="text-sm font-bold text-slate-600">Si</span>
                      </label>
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                        <input
                          type="radio"
                          name="laboralCuentaConEmpleo"
                          value="no"
                          checked={formData.laboralCuentaConEmpleo === 'no'}
                          onChange={(e) => handleChange('laboralCuentaConEmpleo', e.target.value)}
                          onBlur={() => handleBlur('laboralCuentaConEmpleo')}
                          className="accent-[#7E1D3B]"
                        />
                        <span className="text-sm font-bold text-slate-600">No</span>
                      </label>
                    </div>
                    {errors.laboralCuentaConEmpleo && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.laboralCuentaConEmpleo}</p>}
                  </div>

                  {formData.laboralCuentaConEmpleo !== 'no' && (
                    <>
                      <InputGroup label="Lugar de Trabajo/Empleo" name="laboralLugarTrabajo" value={formData.laboralLugarTrabajo} error={errors.laboralLugarTrabajo} required onChange={handleChange} onBlur={handleBlur} placeholder="Empresa o negocio" />
                      <InputGroup label="Antiguedad Laboral" name="laboralAntiguedad" value={formData.laboralAntiguedad} error={errors.laboralAntiguedad} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. 2 anos" />
                      <InputGroup label="Puesto que ocupa" name="laboralPuesto" value={formData.laboralPuesto} error={errors.laboralPuesto} required onChange={handleChange} onBlur={handleBlur} placeholder="Puesto actual" />
                      <InputGroup label="Horario de Trabajo" name="laboralHorario" value={formData.laboralHorario} error={errors.laboralHorario} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. 8:00 - 16:00" />
                    </>
                  )}

                  <SelectGroup
                    label="No. de dependientes Económicos"
                    name="laboralDependientes"
                    value={formData.laboralDependientes}
                    error={errors.laboralDependientes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={['0', '1', '2', '3', '4', '5 o más']}
                  />

                  <InputGroup label="Ingreso Mensual neto" name="laboralIngresoMensual" value={formData.laboralIngresoMensual} error={errors.laboralIngresoMensual} required onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" />
                  <InputGroup label="Otros Ingresos" name="laboralOtrosIngresos" value={formData.laboralOtrosIngresos} error={errors.laboralOtrosIngresos} onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" />

                  <div className="md:col-span-2 xl:col-span-3">
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">
                      Categoria de Ocupación <span className="text-[#7E1D3B]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3 items-start">
                      <select
                        id="laboralCategoriaOcupacion"
                        name="laboralCategoriaOcupacion"
                        value={formData.laboralCategoriaOcupacion}
                        onChange={(e) => handleChange('laboralCategoriaOcupacion', e.target.value)}
                        onBlur={() => handleBlur('laboralCategoriaOcupacion')}
                        aria-invalid={Boolean(errors.laboralCategoriaOcupacion)}
                        aria-describedby={errors.laboralCategoriaOcupacion ? 'laboralCategoriaOcupacion-error' : undefined}
                        className={`w-full bg-slate-50 border p-3.5 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 transition-all font-medium appearance-none cursor-pointer hover:border-slate-200 min-h-[48px] ${
                          errors.laboralCategoriaOcupacion
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                            : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
                        }`}
                      >
                        <option value="">Seleccionar...</option>
                        {occupationScale.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </select>

                      <div className="h-[48px] rounded-xl border border-[#7E1D3B]/30 bg-[#7E1D3B]/5 flex items-center justify-between px-3">
                        <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Numero</span>
                        <span className="text-lg font-black text-[#7E1D3B] leading-none">
                          {formData.laboralNumeroOcupacion || '-'}
                        </span>
                      </div>
                    </div>
                    {errors.laboralCategoriaOcupacion && (
                      <p id="laboralCategoriaOcupacion-error" className="mt-1 text-xs font-semibold text-rose-700">
                        {errors.laboralCategoriaOcupacion}
                      </p>
                    )}
                  </div>
                </div>

              </section>

              <section className="mt-10">
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">Datos Laborales del Cónyuge (si aplica)</h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                  <InputGroup label="Ocupación" name="conyugeOcupacion" value={formData.conyugeOcupacion} error={errors.conyugeOcupacion} onChange={handleChange} onBlur={handleBlur} placeholder="Ocupación actual" />
                  <InputGroup label="Lugar de Trabajo/Empleo" name="conyugeLugarTrabajo" value={formData.conyugeLugarTrabajo} error={errors.conyugeLugarTrabajo} onChange={handleChange} onBlur={handleBlur} placeholder="Empresa o negocio" />
                  <InputGroup label="Antiguedad Laboral" name="conyugeAntiguedad" value={formData.conyugeAntiguedad} error={errors.conyugeAntiguedad} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. 1 ano" />
                  <InputGroup label="Ingreso mensual Neto" name="conyugeIngresoMensual" value={formData.conyugeIngresoMensual} error={errors.conyugeIngresoMensual} onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" />
                </div>
              </section>

              <section className="mt-10">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Otro miembro aporta al ingreso familiar</label>
                  <div className="flex gap-4 max-w-md">
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                      <input
                        type="radio"
                        name="familiarAportaIngreso"
                        value="si"
                        checked={formData.familiarAportaIngreso === 'si'}
                        onChange={(e) => handleChange('familiarAportaIngreso', e.target.value)}
                        onBlur={() => handleBlur('familiarAportaIngreso')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">Si</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                      <input
                        type="radio"
                        name="familiarAportaIngreso"
                        value="no"
                        checked={formData.familiarAportaIngreso === 'no'}
                        onChange={(e) => handleChange('familiarAportaIngreso', e.target.value)}
                        onBlur={() => handleBlur('familiarAportaIngreso')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className="text-sm font-bold text-slate-600">No</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <IncomeContributorsTable
                      rows={incomeContributors}
                      onChange={handleContributorChange}
                      onAddRow={handleAddContributor}
                      onRemoveRow={handleRemoveContributor}
                      activeRow={activeContributorRow}
                      onRowFocus={setActiveContributorRow}
                      disabled={formData.familiarAportaIngreso === 'no'}
                    />
                    {formData.familiarAportaIngreso === 'no' && (
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        Tabla bloqueada porque se seleccionó que ningún otro miembro aporta al ingreso familiar.
                      </p>
                    )}
                    {getFindingsByField('familiarAportaIngreso', 'error').map((item) => (
                      <p key={`err-${item.field}`} className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {item.message}
                      </p>
                    ))}
                  </div>
                  <div>
                    <InputGroup label="Numero de integrantes que aportan" name="numeroIntegrantesAportan" value={formData.numeroIntegrantesAportan} error={errors.numeroIntegrantesAportan} onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" readOnly={formData.familiarAportaIngreso === 'no'} />
                    {getFindingsByField('numeroIntegrantesAportan', 'error').map((item) => (
                      <p key={`err-${item.field}`} className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {item.message}
                      </p>
                    ))}
                    <div className="mt-3 h-[44px] rounded-xl border border-[#7E1D3B]/30 bg-[#7E1D3B]/5 flex items-center justify-between px-3">
                      <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Puntos Aportación</span>
                      <span className="text-base font-black text-[#7E1D3B] leading-none">{calculateAportacionFamiliarPoints(formData.familiarAportaIngreso)}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'economico' && (
            <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <Wallet size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Análisis de Ingresos y Egresos</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Capacidad y balance económico</p>
                </div>
              </div>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">Ingresos Mensuales</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-xs">
                      <tbody>
                        {[
                          ['Solicitante', 'solicitante'],
                          ['Esposo(a)', 'conyuge'],
                          ['Hijos(as)', 'hijos'],
                          ['Otros', 'otros'],
                        ].map(([label, key]) => (
                          <tr key={key} className="border-t border-slate-200 first:border-t-0">
                            <td className="px-3 py-2 font-medium text-slate-700">{label}</td>
                            <td className="w-48 p-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={monthlyIncomes[key]}
                                  onChange={(e) => handleIncomeChange(key, e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-slate-300 bg-slate-100/70">
                          <td className="px-3 py-2 font-black text-slate-700">Total</td>
                          <td className="px-3 py-2 text-right font-black text-[#7E1D3B]">$ {totalIncomes.toLocaleString('es-MX')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">Egresos Mensuales</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-xs">
                      <tbody>
                        {[
                          ['Alimentación', 'alimentacion'],
                          ['Renta o Predio', 'renta'],
                          ['Luz', 'luz'],
                          ['Agua', 'agua'],
                          ['Combustible', 'combustible'],
                          ['Transporte', 'transporte'],
                          ['Educación', 'educacion'],
                          ['Teléfono', 'telefono'],
                          ['Gastos médicos', 'gastosMedicos'],
                          ['Esparcimiento', 'esparcimiento'],
                          ['Otros', 'otros'],
                        ].map(([label, key], idx) => (
                          <tr key={key} className={`border-t border-slate-200 ${idx % 2 === 1 ? 'bg-slate-50/60' : ''}`}>
                            <td className="px-3 py-2 font-medium text-slate-700">{label}</td>
                            <td className="w-48 p-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={monthlyExpenses[key]}
                                  onChange={(e) => handleExpenseChange(key, e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-slate-300 bg-slate-100/70">
                          <td className="px-3 py-2 font-black text-slate-700">Total</td>
                          <td className="px-3 py-2 text-right font-black text-[#7E1D3B]">$ {totalExpenses.toLocaleString('es-MX')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Balance Económico (Ingresos - Egresos) <span className="text-[#7E1D3B]">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3 items-start max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`flex items-center justify-center gap-2 p-3 border rounded-xl transition-all ${
                      formData.balanceEconomico === 'deficit'
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-slate-200 bg-slate-100'
                    }`}>
                      <span className={`text-sm font-bold ${formData.balanceEconomico === 'deficit' ? 'text-rose-700' : 'text-slate-500'}`}>Déficit (Falta)</span>
                    </div>
                    <div className={`flex items-center justify-center gap-2 p-3 border rounded-xl transition-all ${
                      formData.balanceEconomico === 'superavit'
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-slate-200 bg-slate-100'
                    }`}>
                      <span className={`text-sm font-bold ${formData.balanceEconomico === 'superavit' ? 'text-emerald-700' : 'text-slate-500'}`}>Superávit (Sobra)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`h-[48px] rounded-xl border px-3 flex items-center justify-between ${
                      economicResult < 0
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-emerald-300 bg-emerald-50'
                    }`}>
                      <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Resultado</span>
                      <span className={`text-sm font-black ${economicResult < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        $ {economicResult.toLocaleString('es-MX')}
                      </span>
                    </div>
                    <div className="h-[48px] rounded-xl border border-[#7E1D3B]/30 bg-[#7E1D3B]/5 flex items-center justify-between px-3">
                      <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Puntos</span>
                      <span className="text-base font-black text-[#7E1D3B] leading-none">{calculateBalancePoints(formData.balanceEconomico)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Este campo se calcula automáticamente con base en Ingresos - Egresos.
                </p>
                {errors.balanceEconomico && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.balanceEconomico}</p>}
                {getFindingsByField('balanceEconomico', 'error').map((item) => (
                  <p key={`err-${item.field}`} className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                    {item.message}
                  </p>
                ))}
              </section>

              <section className="mt-10">
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">Patrimonio - Vehículos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Cuenta con automóvil <span className="text-[#7E1D3B]">*</span></label>
                    <div className="flex gap-4">
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                        <input
                          type="radio"
                          name="patrimonioCuentaAuto"
                          value="si"
                          checked={formData.patrimonioCuentaAuto === 'si'}
                          onChange={(e) => handleChange('patrimonioCuentaAuto', e.target.value)}
                          onBlur={() => handleBlur('patrimonioCuentaAuto')}
                          className="accent-[#7E1D3B]"
                        />
                        <span className="text-sm font-bold text-slate-600">Si</span>
                      </label>
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-100 rounded-xl bg-slate-50 cursor-pointer hover:bg-white hover:border-[#7E1D3B] transition-all">
                        <input
                          type="radio"
                          name="patrimonioCuentaAuto"
                          value="no"
                          checked={formData.patrimonioCuentaAuto === 'no'}
                          onChange={(e) => handleChange('patrimonioCuentaAuto', e.target.value)}
                          onBlur={() => handleBlur('patrimonioCuentaAuto')}
                          className="accent-[#7E1D3B]"
                        />
                        <span className="text-sm font-bold text-slate-600">No</span>
                      </label>
                    </div>
                    {errors.patrimonioCuentaAuto && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.patrimonioCuentaAuto}</p>}
                  </div>

                  <InputGroup label="Cantidad" name="patrimonioCantidad" value={formData.patrimonioCantidad} error={errors.patrimonioCantidad} onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" readOnly={!hasVehicle} />
                </div>
                {getFindingsByField('patrimonioCantidad', 'error').map((item) => (
                  <p key={`err-${item.field}`} className="-mt-4 mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                    {item.message}
                  </p>
                ))}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                  <div className={`xl:col-span-2 rounded-2xl border p-4 md:p-5 ${hasVehicle ? 'border-slate-200 bg-slate-50/40' : 'border-slate-200 bg-slate-100/70 opacity-70'}`}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="text-sm font-black uppercase tracking-wide text-slate-700">Detalle de Vehículos</h4>
                      <button
                        type="button"
                        onClick={handleAddVehicleAsset}
                        disabled={!hasVehicle}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#7E1D3B]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#7E1D3B] hover:bg-[#7E1D3B]/5"
                      >
                        <Plus size={14} /> Agregar fila
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table className="min-w-[680px] w-full text-xs">
                        <thead className="bg-slate-100 text-slate-600 uppercase tracking-wide">
                          <tr>
                            <th className="px-3 py-2 text-left">Marca</th>
                            <th className="px-3 py-2 text-left">Año</th>
                            <th className="px-3 py-2 text-left">Propietario</th>
                            <th className="px-3 py-2 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehicleAssets.map((row, index) => (
                            <tr
                              key={`vehicle-row-${index}`}
                              className={`border-t border-slate-200 transition-colors ${
                                index === activeVehicleRow ? 'bg-rose-50/90' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                              }`}
                            >
                              <td className="p-2">
                                <input
                                  value={row.marca}
                                  onChange={(e) => handleVehicleAssetChange(index, 'marca', e.target.value)}
                                  onFocus={() => setActiveVehicleRow(index)}
                                  disabled={!hasVehicle}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="number"
                                  min="1900"
                                  max="2099"
                                  value={row.ano}
                                  onChange={(e) => handleVehicleAssetChange(index, 'ano', e.target.value)}
                                  onFocus={() => setActiveVehicleRow(index)}
                                  disabled={!hasVehicle}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                                  placeholder="Ej: 2020"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  value={row.propietario}
                                  onChange={(e) => handleVehicleAssetChange(index, 'propietario', e.target.value)}
                                  onFocus={() => setActiveVehicleRow(index)}
                                  disabled={!hasVehicle}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVehicleAsset(index)}
                                  disabled={!hasVehicle}
                                  className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100"
                                  aria-label="Eliminar fila"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-4 md:p-5 ${hasVehicle ? 'border-slate-200 bg-slate-50/40' : 'border-slate-200 bg-slate-100/70 opacity-70'}`}>
                    <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">Escala de vehículos <span className="text-[#7E1D3B]">*</span></label>
                    <select
                      id="vehiculoCategoria"
                      name="vehiculoCategoria"
                      value={formData.vehiculoCategoria}
                      onChange={(e) => handleChange('vehiculoCategoria', e.target.value)}
                      onBlur={() => handleBlur('vehiculoCategoria')}
                      disabled={!hasVehicle}
                      className={`w-full bg-white border p-3 rounded-xl text-sm outline-none focus:ring-2 transition-all font-medium appearance-none cursor-pointer ${
                        errors.vehiculoCategoria
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
                      }`}
                    >
                      <option value="">Seleccionar...</option>
                      {vehicleScale.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    {errors.vehiculoCategoria && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.vehiculoCategoria}</p>}

                    <div className="mt-3 h-[48px] rounded-xl border border-[#7E1D3B]/30 bg-[#7E1D3B]/5 flex items-center justify-between px-3">
                      <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Numero</span>
                      <span className="text-lg font-black text-[#7E1D3B] leading-none">{formData.vehiculoNumero || '-'}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'salud' && (
            <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <Heart size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Asistencia Médica</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Condiciones de salud y entorno familiar</p>
                </div>
              </div>

              <section className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">
                    Donde recibe asistencia médica <span className="text-[#7E1D3B]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {['IMSS', 'Seguro Popular', 'ISSSTE', 'Consulta particular', 'Seguro Privado', 'Centro de salud'].map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={Array.isArray(formData.saludAsistenciaOpciones) && formData.saludAsistenciaOpciones.includes(option)}
                          onChange={() => handleMedicalAssistanceToggle(option)}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, saludAsistenciaOpciones: true }));
                            const msg = validateField('saludAsistenciaOpciones', formData.saludAsistenciaOpciones);
                            setErrors((prev) => ({ ...prev, saludAsistenciaOpciones: msg }));
                          }}
                          className="accent-[#7E1D3B]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.saludAsistenciaOpciones && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.saludAsistenciaOpciones}</p>}
                </div>

                <InputGroup
                  label="Monto mensual en consultas particulares"
                  name="saludMontoConsultas"
                  value={formData.saludMontoConsultas}
                  error={errors.saludMontoConsultas}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                  placeholder="0"
                />

                <InputGroup
                  label="Otros servicios médicos"
                  name="saludOtrosServicios"
                  value={formData.saludOtrosServicios}
                  error={errors.saludOtrosServicios}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ej. terapias, especialistas"
                />

                <InputGroup
                  label="Cuántos miembros de la familia cuentan con asistencia médica"
                  name="saludMiembrosConAsistencia"
                  value={formData.saludMiembrosConAsistencia}
                  error={errors.saludMiembrosConAsistencia}
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                  placeholder="0"
                />
              </section>

              <section className="mt-10 grid grid-cols-1 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
                  <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">Adicciones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AdiccionLineItem
                      title="Alcoholismo"
                      detailName="saludAdicAlcoholismoDetalle"
                      detailValue={formData.saludAdicAlcoholismoDetalle}
                      freqName="saludAdicAlcoholismoFrecuencia"
                      freqValue={formData.saludAdicAlcoholismoFrecuencia}
                      severityName="saludAdicAlcoholismoSeveridad"
                      severityValue={formData.saludAdicAlcoholismoSeveridad}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <AdiccionLineItem
                      title="TCA/Ludopatía"
                      detailName="saludAdicTcaLudopatiaDetalle"
                      detailValue={formData.saludAdicTcaLudopatiaDetalle}
                      freqName="saludAdicTcaLudopatiaFrecuencia"
                      freqValue={formData.saludAdicTcaLudopatiaFrecuencia}
                      severityName="saludAdicTcaLudopatiaSeveridad"
                      severityValue={formData.saludAdicTcaLudopatiaSeveridad}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <AdiccionLineItem
                      title="Drogadicción"
                      detailName="saludAdicDrogadiccionDetalle"
                      detailValue={formData.saludAdicDrogadiccionDetalle}
                      freqName="saludAdicDrogadiccionFrecuencia"
                      freqValue={formData.saludAdicDrogadiccionFrecuencia}
                      severityName="saludAdicDrogadiccionSeveridad"
                      severityValue={formData.saludAdicDrogadiccionSeveridad}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <AdiccionLineItem
                      title="Otros"
                      detailName="saludAdicOtrosDetalle"
                      detailValue={formData.saludAdicOtrosDetalle}
                      freqName="saludAdicOtrosFrecuencia"
                      freqValue={formData.saludAdicOtrosFrecuencia}
                      severityName="saludAdicOtrosSeveridad"
                      severityValue={formData.saludAdicOtrosSeveridad}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <TextAreaGroup
                  label="Relación familiar"
                  name="saludRelacionFamiliar"
                  value={formData.saludRelacionFamiliar}
                  error={errors.saludRelacionFamiliar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />
              </section>
            </div>
          )}

          {activeTab === 'vivienda' && (
            <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <Home size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Características de la Vivienda</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Condiciones de habitabilidad y alimentación</p>
                </div>
              </div>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScaleSelectorWithScore
                  label="Régimen de Vivienda"
                  name="viviendaRegimen"
                  value={formData.viviendaRegimen}
                  score={formData.viviendaRegimenNumero}
                  options={housingRegimeScale}
                  required
                  error={errors.viviendaRegimen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ScaleSelectorWithScore
                  label="Tipo de Vivienda"
                  name="viviendaTipo"
                  value={formData.viviendaTipo}
                  score={formData.viviendaTipoNumero}
                  options={housingTypeScale}
                  required
                  error={errors.viviendaTipo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ScaleSelectorWithScore
                  label="Total de habitaciones"
                  name="viviendaTotalHabitaciones"
                  value={formData.viviendaTotalHabitaciones}
                  score={formData.viviendaTotalHabitacionesNumero}
                  options={roomsScale}
                  required
                  error={errors.viviendaTotalHabitaciones}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">
                    ¿Cómo está conformada su vivienda? <span className="text-[#7E1D3B]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-white p-3">
                    {['Sala', 'Comedor', 'Cocina'].map((item) => (
                      <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={Array.isArray(formData.viviendaConformacion) && formData.viviendaConformacion.includes(item)}
                          onChange={() => handleHousingCompositionToggle(item)}
                          onBlur={() => {
                            setTouched((prev) => ({ ...prev, viviendaConformacion: true }));
                            const msg = validateField('viviendaConformacion', formData.viviendaConformacion);
                            setErrors((prev) => ({ ...prev, viviendaConformacion: msg }));
                          }}
                          className="accent-[#7E1D3B]"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                  {errors.viviendaConformacion && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.viviendaConformacion}</p>}

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputGroup
                      label="Baños"
                      name="viviendaBanos"
                      value={formData.viviendaBanos}
                      error={errors.viviendaBanos}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      placeholder="0"
                    />
                    <InputGroup
                      label="Recámaras"
                      name="viviendaRecamaras"
                      value={formData.viviendaRecamaras}
                      error={errors.viviendaRecamaras}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="number"
                      placeholder="0"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                  label="En caso de no contar con baños, especificar"
                  name="viviendaEspecificarSinBanos"
                  value={formData.viviendaEspecificarSinBanos}
                  error={errors.viviendaEspecificarSinBanos}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Descripción"
                />
                <InputGroup
                  label="Otras características de la vivienda"
                  name="viviendaOtrasCaracteristicas"
                  value={formData.viviendaOtrasCaracteristicas}
                  error={errors.viviendaOtrasCaracteristicas}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Observaciones"
                />
              </section>

              <section className="mt-10">
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">Material de construcción</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ScaleSelectorWithScore
                    label="Material del piso"
                    name="viviendaMaterialPiso"
                    value={formData.viviendaMaterialPiso}
                    score={formData.viviendaMaterialPisoNumero}
                    options={floorMaterialScale}
                    required
                    error={errors.viviendaMaterialPiso}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    compact
                  />
                  <ScaleSelectorWithScore
                    label="Material de los muros"
                    name="viviendaMaterialMuros"
                    value={formData.viviendaMaterialMuros}
                    score={formData.viviendaMaterialMurosNumero}
                    options={wallMaterialScale}
                    required
                    error={errors.viviendaMaterialMuros}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    compact
                  />
                  <ScaleSelectorWithScore
                    label="Material del techo"
                    name="viviendaMaterialTecho"
                    value={formData.viviendaMaterialTecho}
                    score={formData.viviendaMaterialTechoNumero}
                    options={roofMaterialScale}
                    required
                    error={errors.viviendaMaterialTecho}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    compact
                  />
                </div>
              </section>

              <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">Tipo y Frecuencia de Alimentos</h3>
                <FoodFrequencyTable
                  data={foodFrequency}
                  onChange={handleFoodFrequencyChange}
                  options={foodFrequencyOptions}
                />
              </section>
            </div>
          )}

          {activeTab === 'familiar' && (
            <div className="relative p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="bg-[#7E1D3B]/10 p-2 rounded-lg text-[#7E1D3B]">
                  <Users size={24}/>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#7E1D3B]">Referencias Personales y Conclusiones</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Entorno, soporte y evaluación social</p>
                </div>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Referencias personales (2 mínimo)</h3>
                  <p className="text-xs text-slate-500 mt-1">Registra al menos 2 referencias completas para validar esta sección.</p>
                </div>

                <FamilyReferencesTable
                  rows={familyReferences}
                  onChange={handleFamilyReferenceChange}
                  onAddRow={handleAddFamilyReference}
                  onRemoveRow={handleRemoveFamilyReference}
                  activeRow={activeFamilyReferenceRow}
                  onRowFocus={setActiveFamilyReferenceRow}
                />

                {errors.familiarReferencias && (
                  <p className="mt-2 text-xs font-semibold text-rose-700">{errors.familiarReferencias}</p>
                )}
              </section>

              <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-[#7E1D3B]/10 p-3 text-[#7E1D3B]">
                    <Calculator size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Diagnóstico económico familiar</h3>
                    <p className="text-xs text-slate-500">Captura niveles, puntos, costo base y kit para el tratamiento.</p>
                  </div>
                </div>

                {formData.balanceEconomico === 'deficit' && (
                  <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
                    Aviso: hay déficit económico. Los ingresos no alcanzan para cubrir el costo del tratamiento.
                  </div>
                )}

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-wide">Nivel</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-wide">Puntos</th>
                        <th className="px-4 py-3 text-left font-black uppercase tracking-wide">Costo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Nivel 1 (Categoría, Aportación, Balance)', puntos: 'puntosNivel1', costo: 'costoNivel1', readonly: true },
                        { label: 'Nivel 2 (Transporte/Vehículos)', puntos: 'puntosNivel2', costo: 'costoNivel2', readonly: true },
                        { label: 'Nivel 3 (Vivienda)', puntos: 'puntosNivel3', costo: 'costoNivel3', readonly: true },
                      ].map((row, index) => (
                        <tr key={row.label} className={`border-t border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="px-4 py-3 font-semibold text-slate-700">{row.label}</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              value={diagnosticoEconomico[row.puntos]}
                              onChange={(e) => !row.readonly && handleDiagnosticoEconomicoChange(row.puntos, e.target.value)}
                              readOnly={row.readonly}
                              className={`w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition ${
                                row.readonly
                                  ? 'bg-slate-100 text-slate-700 font-semibold cursor-not-allowed border-slate-300'
                                  : 'bg-slate-50 focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15'
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">$</span>
                              <input
                                type="number"
                                min="0"
                                value={diagnosticoEconomico[row.costo]}
                                readOnly
                                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 font-semibold text-slate-700 outline-none cursor-not-allowed"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-slate-200 bg-slate-50/50">
                        <td className="px-4 py-3 font-black uppercase tracking-wide text-slate-700">Total</td>
                        <td className="px-4 py-3 font-black text-[#7E1D3B]">{diagnosticoEconomicoCalculado.totalPuntos}</td>
                        <td className="px-4 py-3 font-black text-[#7E1D3B]">$ {diagnosticoEconomicoCostoBase.toLocaleString('es-MX')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      <Calculator size={14} /> Días de tratamiento <span className="text-[#7E1D3B]">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={diagnosticoEconomico.diasTratamiento}
                      onChange={(e) => handleDiagnosticoEconomicoChange('diasTratamiento', e.target.value)}
                      onBlur={() => handleBlur('diagnosticoEconomico.diasTratamiento')}
                      aria-invalid={Boolean(errors['diagnosticoEconomico.diasTratamiento'])}
                      className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
                        errors['diagnosticoEconomico.diasTratamiento']
                          ? 'border-rose-300 bg-rose-50 focus:border-rose-500 focus:ring-rose-200'
                          : 'border-slate-200 bg-slate-50 focus:border-[#7E1D3B] focus:ring-[#7E1D3B]/15'
                      }`}
                      placeholder="0"
                    />
                    {errors['diagnosticoEconomico.diasTratamiento'] && (
                      <p className="mt-1 text-xs font-semibold text-rose-700">{errors['diagnosticoEconomico.diasTratamiento']}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      <DollarSign size={14} /> Costo base
                    </label>
                    <input
                      type="number"
                      value={diagnosticoEconomicoCalculado.costoBase}
                      readOnly
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      <DollarSign size={14} /> Costo de Kit
                    </label>
                    <input
                      type="number"
                      value={FIXED_KIT_COST}
                      readOnly
                      className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 font-semibold text-slate-700 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className={`mt-5 rounded-[28px] border px-5 py-5 ${formData.balanceEconomico === 'deficit' ? 'border-rose-200 bg-rose-50' : 'border-[#7E1D3B]/15 bg-[#7E1D3B]/5'}`}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
                    <div className="min-h-[92px] rounded-2xl border border-white/70 bg-white/70 px-4 py-4 shadow-sm">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Resultado</p>
                      <p className={`mt-2 text-xl font-black leading-none ${economicResult < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        $ {economicResult.toLocaleString('es-MX')}
                      </p>
                    </div>
                    <div className="min-h-[92px] rounded-2xl border border-white/70 bg-white/70 px-4 py-4 shadow-sm">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Estado</p>
                      <p className={`mt-2 text-xl font-black leading-none ${formData.balanceEconomico === 'deficit' ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {formData.balanceEconomico === 'deficit' ? 'Déficit' : 'Superávit'}
                      </p>
                    </div>
                    <div className="min-h-[92px] rounded-2xl border border-white/70 bg-white/70 px-4 py-4 shadow-sm">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Total estimado</p>
                      <p className="mt-2 text-xl font-black leading-none text-[#7E1D3B]">
                        $ {diagnosticoEconomicoCostoTotal.toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Tratamiento por {diagnosticoEconomicoDias} días con kit fijo de $ {diagnosticoEconomicoMontoKit.toLocaleString('es-MX')}.
                  </p>
                </div>

                {formData.balanceEconomico === 'deficit' && pacienteSeleccionadoId && !rechazoRegistrado && (
                  <div className="rounded-[28px] border border-rose-200 bg-rose-50/80 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-700">Validación administrativa</p>
                        <h4 className="mt-1 text-xl font-black text-slate-900">El balance está en déficit y puede negarse el ingreso</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          Antes de registrar la denegación, confirma las observaciones administrativas. Esta acción actualizará el expediente como DENEGADO y dejará una nota de trabajo social.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenRechazoAdministrativo}
                        className="inline-flex items-center justify-center rounded-[28px] border border-[#7E1D3B] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#7E1D3B] transition hover:bg-[#7E1D3B] hover:text-white"
                      >
                        Denegar por falta de recursos
                      </button>
                    </div>
                  </div>
                )}

                {rechazoRegistrado && (
                  <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <FileX className="mt-0.5 text-rose-700" size={20} />
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-700">DENEGADO</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          El rechazo administrativo quedó registrado correctamente en el expediente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="mt-8 grid grid-cols-1 gap-6">
                <TextAreaGroup
                  label="Diagnóstico"
                  name="familiarDiagnostico"
                  value={formData.familiarDiagnostico}
                  required
                  error={errors.familiarDiagnostico}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />

                <TextAreaGroup
                  label="Observaciones del trabajador social"
                  name="familiarObservacionesTrabajoSocial"
                  value={formData.familiarObservacionesTrabajoSocial}
                  error={errors.familiarObservacionesTrabajoSocial}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />

                <TextAreaGroup
                  label="Observaciones de la visita domiciliaria"
                  name="familiarObservacionesVisitaDomiciliaria"
                  value={formData.familiarObservacionesVisitaDomiciliaria}
                  error={errors.familiarObservacionesVisitaDomiciliaria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />
              </section>

              <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <p className="text-sm font-semibold text-amber-900 leading-relaxed">
                  El proporcionar información falsa es motivo suficiente para anular el trámite; Marakame se reserva el derecho de investigar la veracidad de lo antes declarado.
                </p>
              </section>
            </div>
          )}

          {activeTab !== 'solicitante' && activeTab !== 'paciente' && activeTab !== 'laboral' && activeTab !== 'economico' && activeTab !== 'salud' && activeTab !== 'vivienda' && activeTab !== 'familiar' && (
            <div className="p-20 text-center flex flex-col items-center justify-center text-slate-300 bg-slate-50/40">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <ClipboardList size={48}/>
              </div>
              <p className="font-bold uppercase tracking-widest text-sm">Próximamente</p>
              <p className="text-xs">Esta sección se activará al recibir los requerimientos.</p>
            </div>
          )}
        </div>

        <section className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-slate-200"
          >
            <X size={18}/> Cancelar
          </button>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={cargarDatosDePrueba}
              className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              Cargar datos de prueba
            </button>

            {!isFirstStep ? (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="px-5 py-2 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <ArrowLeft size={17}/> Anterior
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-6 py-2 bg-white text-[#7E1D3B] border border-[#7E1D3B]/20 font-bold rounded-xl shadow-sm hover:bg-[#7E1D3B]/8 transition-all flex items-center gap-2"
            >
              <Save size={18}/> Guardar borrador
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={handleSaveStudy}
                disabled={guardandoEstudio}
                className={`px-6 py-2 bg-[#7E1D3B] text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 hover:bg-[#63162e] transition-all flex items-center gap-2 ${guardandoEstudio ? 'cursor-wait opacity-70 hover:bg-[#7E1D3B]' : ''}`}
              >
                <Save size={18}/> {guardandoEstudio ? 'Guardando...' : 'Guardar Estudio'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 bg-[#7E1D3B] text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 hover:bg-[#63162e] transition-all flex items-center gap-2"
              >
                Siguiente <ArrowRight size={17}/>
              </button>
            )}
          </div>
        </section>

        {checklistVisible && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#7E1D3B]" />
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Checklist previo a generar PDF</h3>
              </div>
              <button
                type="button"
                onClick={() => setChecklistVisible(false)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-2">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
                    item.severity === 'error'
                      ? 'border-rose-200 bg-rose-50'
                      : 'border-amber-200 bg-amber-50'
                  }`}
                >
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">{tabs.find((tab) => tab.id === item.tabId)?.label || item.tabId}</p>
                    <p className={`text-sm font-semibold ${item.severity === 'error' ? 'text-rose-800' : 'text-amber-800'}`}>
                      {item.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(item.tabId);
                      setChecklistVisible(false);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Ir a corregir
                  </button>
                </div>
              ))}
            </div>

            {checklistItems.length > 0 && !checklistItems.some((item) => item.severity === 'error') && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleContinueAfterWarnings}
                  className="rounded-xl bg-[#7E1D3B] px-4 py-2 text-sm font-bold text-white hover:bg-[#63162e]"
                >
                  Continuar y generar PDF
                </button>
              </div>
            )}
          </section>
        )}
        {rechazoModalAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 md:p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-700">Denegación de ingreso</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">Registrar rechazo por insuficiencia económica</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRechazoModalAbierto(false)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cerrar modal de rechazo"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-5 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Ingresos</p>
                    <p className="mt-2 text-lg font-black text-slate-900">$ {totalIncomes.toLocaleString('es-MX')}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Egresos</p>
                    <p className="mt-2 text-lg font-black text-slate-900">$ {totalExpenses.toLocaleString('es-MX')}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Costo total estimado</p>
                    <p className="mt-2 text-lg font-black text-[#7E1D3B]">$ {diagnosticoEconomicoCostoTotal.toLocaleString('es-MX')}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 text-rose-600" size={18} />
                    <p className="text-sm font-semibold leading-6 text-rose-900">
                      Verifica que las observaciones describan con claridad el motivo de la denegación. Esta nota se guardará como información administrativa del expediente.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-600">Observaciones de rechazo *</label>
                  <textarea
                    value={observacionesRechazo}
                    onChange={(event) => {
                      setObservacionesRechazo(event.target.value);
                      if (errorRechazo) setErrorRechazo('');
                    }}
                    rows={5}
                    className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                    placeholder="Explica por qué el balance económico impide continuar con el ingreso..."
                  />
                  {errorRechazo && <p className="mt-2 text-xs font-semibold text-rose-700">{errorRechazo}</p>}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setRechazoModalAbierto(false)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmarRechazoAdministrativo}
                    disabled={guardandoRechazo}
                    className="rounded-2xl bg-[#7E1D3B] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#63162e] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {guardandoRechazo ? 'Registrando...' : 'Confirmar denegación'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </div>
  );
};

// --- COMPONENTES AUXILIARES PARA LIMPIEZA ---
const InputGroup = ({ label, placeholder, type = 'text', name, value, required = false, error, onChange, onBlur, readOnly = false }) => (
  <div className="flex flex-col">
    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5 ml-1 tracking-widest" htmlFor={name}>
      {label} {required && <span className="text-[#7E1D3B]">*</span>}
    </label>
    <input 
      id={name}
      name={name}
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      readOnly={readOnly}
      className={`w-full bg-slate-50 border p-3.5 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 transition-all font-medium hover:border-slate-200 min-h-[48px] ${
        error
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
          : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
      }`}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs font-semibold text-rose-700">
        {error}
      </p>
    )}
  </div>
);

const SelectGroup = ({ label, options, name, value, required = false, error, onChange, onBlur }) => (
  <div className="flex flex-col">
    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5 ml-1 tracking-widest" htmlFor={name}>
      {label} {required && <span className="text-[#7E1D3B]">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full bg-slate-50 border p-3.5 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 transition-all font-medium appearance-none cursor-pointer hover:border-slate-200 min-h-[48px] ${
        error
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
          : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
      }`}
    >
      <option value="">Seleccionar...</option>
      {options.map((opt) => {
        if (typeof opt === 'string') {
          return <option key={opt} value={opt}>{opt}</option>;
        }

        return <option key={opt.value} value={opt.value}>{opt.label}</option>;
      })}
    </select>
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs font-semibold text-rose-700">
        {error}
      </p>
    )}
  </div>
);

const TextAreaGroup = ({ label, name, value, required = false, error, onChange, onBlur, rows = 4 }) => (
  <div className="flex flex-col">
    <label className="block text-[11px] font-black uppercase text-slate-600 mb-1.5 ml-1 tracking-widest" htmlFor={name}>
      {label} {required && <span className="text-[#7E1D3B]">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full bg-slate-50 border p-3.5 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 transition-all font-medium resize-y min-h-[120px] ${
        error
          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
          : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
      }`}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs font-semibold text-rose-700">
        {error}
      </p>
    )}
  </div>
);

const AdiccionLineItem = ({ title, detailName, detailValue, freqName, freqValue, severityName, severityValue, onChange, onBlur }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
    <div className="mb-2 flex items-center gap-2 text-slate-700">
      <span className="text-[18px] font-medium">{title}</span>
      <div className="flex-1 border-b border-slate-300" />
      <input
        name={detailName}
        value={detailValue}
        onChange={(e) => onChange(detailName, e.target.value)}
        onBlur={() => onBlur(detailName)}
        placeholder="Detalle"
        className="w-36 border-0 border-b border-slate-300 bg-transparent px-1 py-0.5 text-sm font-semibold text-slate-700 outline-none focus:border-[#7E1D3B]"
      />
    </div>

    <div className="flex items-center gap-2">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">Cantidad y Frecuencia</span>
      <input
        name={freqName}
        value={freqValue}
        onChange={(e) => onChange(freqName, e.target.value)}
        onBlur={() => onBlur(freqName)}
        placeholder="Ej. 3 veces por semana"
        className="flex-1 border-0 border-b border-slate-300 bg-transparent px-1 py-0.5 text-sm text-slate-700 outline-none focus:border-[#7E1D3B]"
      />
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">Severidad</span>
      {[
        { value: 'leve', label: 'Leve', activeClass: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
        { value: 'moderada', label: 'Moderada', activeClass: 'bg-amber-100 border-amber-300 text-amber-800' },
        { value: 'alta', label: 'Alta', activeClass: 'bg-rose-100 border-rose-300 text-rose-800' },
      ].map((option) => (
        <label
          key={`${severityName}-${option.value}`}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
            severityValue === option.value
              ? option.activeClass
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
          }`}
        >
          <input
            type="radio"
            name={severityName}
            value={option.value}
            checked={severityValue === option.value}
            onChange={(e) => onChange(severityName, e.target.value)}
            onBlur={() => onBlur(severityName)}
            className="accent-[#7E1D3B]"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const ScaleSelectorWithScore = ({
  label,
  name,
  value,
  score,
  options,
  required = false,
  error,
  onChange,
  onBlur,
}) => (
  <div>
    <label className="block text-[11px] font-black uppercase text-slate-600 mb-2 ml-1 tracking-widest">
      {label} {required && <span className="text-[#7E1D3B]">*</span>}
    </label>

    <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3 items-start">
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full bg-white border p-3 rounded-xl text-sm outline-none focus:ring-2 transition-all font-medium appearance-none cursor-pointer ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-200 focus:ring-[#7E1D3B]/10 focus:border-[#7E1D3B]'
        }`}
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => (
          <option key={`${name}-${option.value}`} value={option.value}>{option.label}</option>
        ))}
      </select>

      <div className="h-[44px] rounded-xl border border-[#7E1D3B]/30 bg-[#7E1D3B]/5 flex items-center justify-between px-3">
        <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Número</span>
        <span className="text-base font-black text-[#7E1D3B] leading-none">{score || '-'}</span>
      </div>
    </div>

    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs font-semibold text-rose-700">
        {error}
      </p>
    )}
  </div>
);

const FoodFrequencyTable = ({ data, onChange, options }) => {
  const foodRows = [
    { key: 'carneRes', label: 'Carne de res' },
    { key: 'carnePollo', label: 'Carne de pollo' },
    { key: 'carneCerdo', label: 'Carne de cerdo' },
    { key: 'pescado', label: 'Pescado' },
    { key: 'leche', label: 'Leche' },
    { key: 'cereales', label: 'Cereales' },
    { key: 'huevo', label: 'Huevo' },
    { key: 'frutas', label: 'Frutas' },
    { key: 'verduras', label: 'Verduras' },
    { key: 'leguminosas', label: 'Leguminosas' },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-[960px] w-full text-xs">
        <thead className="bg-slate-100 text-slate-700 uppercase tracking-wide">
          <tr>
            <th className="px-3 py-2 text-left">Tipo de Alimento</th>
            <th className="px-3 py-2 text-left">Frecuencia</th>
          </tr>
        </thead>
        <tbody>
          {foodRows.map((row, idx) => (
            <tr key={row.key} className={`border-t border-slate-200 ${idx % 2 === 1 ? 'bg-slate-50/70' : ''}`}>
              <td className="px-3 py-2 font-medium text-slate-700">{row.label}</td>
              <td className="p-1.5">
                <select
                  value={data[row.key] || ''}
                  onChange={(e) => onChange(row.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                >
                  <option value="">Seleccionar...</option>
                  {options.map((opt) => (
                    <option key={`${row.key}-${opt.value}`} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FamilyReferencesTable = ({ rows, onChange, onAddRow, onRemoveRow, activeRow, onRowFocus }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="min-w-[760px] w-full text-xs">
      <thead className="bg-slate-100 text-slate-700 uppercase tracking-wide">
        <tr>
          <th className="px-3 py-2 text-left">Nombre</th>
          <th className="px-3 py-2 text-left">Teléfono</th>
          <th className="px-3 py-2 text-left">Relación</th>
          <th className="px-3 py-2 text-left">Tiempo de conocerse</th>
          <th className="px-3 py-2 text-center">Acción</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={`familiar-reference-row-${index}`}
            className={`border-t border-slate-200 transition-colors ${
              index === activeRow ? 'bg-rose-50/90' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
            }`}
          >
            <td className="p-2">
              <input
                value={row.nombre}
                onChange={(e) => onChange(index, 'nombre', e.target.value)}
                onFocus={() => onRowFocus(index)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
              />
            </td>
            <td className="p-2">
              <input
                value={row.telefono}
                onChange={(e) => onChange(index, 'telefono', e.target.value)}
                onFocus={() => onRowFocus(index)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
              />
            </td>
            <td className="p-2">
              <input
                value={row.relacion}
                onChange={(e) => onChange(index, 'relacion', e.target.value)}
                onFocus={() => onRowFocus(index)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
              />
            </td>
            <td className="p-2">
              <input
                value={row.tiempoConocer}
                onChange={(e) => onChange(index, 'tiempoConocer', e.target.value)}
                onFocus={() => onRowFocus(index)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
              />
            </td>
            <td className="p-2 text-center">
              <button
                type="button"
                onClick={() => onRemoveRow(index)}
                disabled={rows.length <= 2}
                className={`inline-flex items-center rounded-lg p-2 ${
                  rows.length <= 2
                    ? 'border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
                aria-label="Eliminar referencia"
              >
                <Trash2 size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        Referencias capturadas: {rows.length}
      </p>
      <button
        type="button"
        onClick={onAddRow}
        className="inline-flex items-center gap-2 rounded-lg border border-[#7E1D3B]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#7E1D3B] hover:bg-[#7E1D3B]/5"
      >
        <Plus size={14} /> Agregar referencia
      </button>
    </div>
  </div>
);

const IncomeContributorsTable = ({ rows, onChange, onAddRow, onRemoveRow, activeRow, onRowFocus, disabled = false }) => (
  <div className={`rounded-2xl border border-slate-200 p-4 md:p-5 ${disabled ? 'bg-slate-100/80 opacity-80' : 'bg-slate-50/40'}`}>
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Aportación de otros familiares</h3>
      <button
        type="button"
        onClick={onAddRow}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold ${disabled ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-[#7E1D3B]/20 bg-white text-[#7E1D3B] hover:bg-[#7E1D3B]/5'}`}
      >
        <Plus size={14} /> Agregar fila
      </button>
    </div>

    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-[520px] w-full text-xs">
        <thead className="bg-slate-100 text-slate-600 uppercase tracking-wide">
          <tr>
            <th className="px-3 py-2 text-left">Parentesco</th>
            <th className="px-3 py-2 text-left">Cantidad Mensual aportada</th>
            <th className="px-3 py-2 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`contributor-row-${index}`}
              className={`border-t border-slate-200 transition-colors ${
                index === activeRow ? 'bg-rose-50/90' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
              }`}
            >
              <td className="p-2">
                <input
                  value={row.parentesco}
                  onChange={(e) => onChange(index, 'parentesco', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  disabled={disabled}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  value={row.cantidadMensual}
                  onChange={(e) => onChange(index, 'cantidadMensual', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  disabled={disabled}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                />
              </td>
              <td className="p-2 text-center">
                <button
                  type="button"
                  onClick={() => onRemoveRow(index)}
                  disabled={disabled}
                  className={`inline-flex items-center rounded-lg border p-2 ${disabled ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed' : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'}`}
                  aria-label="Eliminar fila"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const HouseholdMembersTable = ({ rows, onChange, onAddRow, onRemoveRow, activeRow, onRowFocus }) => (
  <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Personas que habitan en el domicilio</h3>
      <button
        type="button"
        onClick={onAddRow}
        className="inline-flex items-center gap-2 rounded-lg border border-[#7E1D3B]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#7E1D3B] hover:bg-[#7E1D3B]/5"
      >
        <Plus size={14} /> Agregar fila
      </button>
    </div>

    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-[920px] w-full text-xs">
        <thead className="bg-slate-100 text-slate-600 uppercase tracking-wide">
          <tr>
            <th className="px-3 py-2 text-left">Nombre</th>
            <th className="px-3 py-2 text-left">Parentesco</th>
            <th className="px-3 py-2 text-left">Edad</th>
            <th className="px-3 py-2 text-left">Sexo</th>
            <th className="px-3 py-2 text-left">Estado Civil</th>
            <th className="px-3 py-2 text-left">Ocupación/lugar</th>
            <th className="px-3 py-2 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`household-row-${index}`}
              className={`border-t border-slate-200 transition-colors ${
                index === activeRow ? 'bg-rose-50/90' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
              }`}
            >
              <td className="p-2">
                <input
                  value={row.nombre}
                  onChange={(e) => onChange(index, 'nombre', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                />
              </td>
              <td className="p-2">
                <input
                  value={row.parentesco}
                  onChange={(e) => onChange(index, 'parentesco', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  value={row.edad}
                  onChange={(e) => onChange(index, 'edad', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                />
              </td>
              <td className="p-2">
                <select
                  value={row.sexo}
                  onChange={(e) => onChange(index, 'sexo', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </td>
              <td className="p-2">
                <input
                  value={row.estadoCivil}
                  onChange={(e) => onChange(index, 'estadoCivil', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                />
              </td>
              <td className="p-2">
                <input
                  value={row.ocupacionLugar}
                  onChange={(e) => onChange(index, 'ocupacionLugar', e.target.value)}
                  onFocus={() => onRowFocus(index)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
                />
              </td>
              <td className="p-2 text-center">
                <button
                  type="button"
                  onClick={() => onRemoveRow(index)}
                  className="inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100"
                  aria-label="Eliminar fila"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ClipboardList = ({size}) => <Users size={size}/>;

export default EstudioSocioeconomico;