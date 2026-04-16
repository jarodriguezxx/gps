import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Search, User, Briefcase, Wallet, Heart, Home, Users, Info, CheckCircle2, Circle, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

import InstitutionalHeader from '../../components/layout/InstitutionalHeader';

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
  const [householdMembers, setHouseholdMembers] = useState([
    { nombre: '', parentesco: '', edad: '', sexo: '', estadoCivil: '', ocupacionLugar: '' },
  ]);
  const [incomeContributors, setIncomeContributors] = useState([
    { parentesco: '', cantidadMensual: '' },
  ]);
  const [vehicleAssets, setVehicleAssets] = useState([
    { marca: '', modelo: '', propietario: '' },
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

  const [formData, setFormData] = useState({
    nombreSolicitante: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    edad: '',
    sexo: '',
    escolaridad: '',
    ocupacion: '',
    estadoCivil: '',
    direccion: '',
    telefonoCasa: '',
    telefonoCelular: '',
    habitantesDomicilio: '',
    pacienteNombre: '',
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

  const sectionRequiredFields = {
    solicitante: [
      'nombreSolicitante',
      'fechaNacimiento',
      'edad',
      'sexo',
      'escolaridad',
      'estadoCivil',
      'direccion',
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
      'familiarDiagnostico',
      'familiarObservacionesTrabajoSocial',
      'familiarObservacionesVisitaDomiciliaria',
    ],
  };

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const stepNumber = currentTabIndex + 1;
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

  const validateField = (name, value) => {
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

  const handleChange = (name, value) => {
    setIsDirty(true);
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

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

      return next;
    });

    if (name === 'patrimonioCuentaAuto' && value === 'no') {
      setVehicleAssets([{ marca: '', modelo: '', propietario: '' }]);
      setActiveVehicleRow(0);
      setErrors((prev) => ({ ...prev, vehiculoCategoria: '' }));
    }

    if (touched[name]) {
      const msg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, formData[name]);
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
    setVehicleAssets((prev) => [...prev, { marca: '', modelo: '', propietario: '' }]);
    setActiveVehicleRow(vehicleAssets.length);
  };

  const handleRemoveVehicleAsset = (index) => {
    setIsDirty(true);
    setVehicleAssets((prev) => {
      if (prev.length === 1) {
        setActiveVehicleRow(0);
        return [{ marca: '', modelo: '', propietario: '' }];
      }
      const next = prev.filter((_, i) => i !== index);
      setActiveVehicleRow((current) => Math.max(0, Math.min(current, next.length - 1)));
      return next;
    });
  };

  const totalIncomes = Object.values(monthlyIncomes).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const totalExpenses = Object.values(monthlyExpenses).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const economicResult = totalIncomes - totalExpenses;
  const hasVehicle = formData.patrimonioCuentaAuto === 'si';
  const validFamilyReferences = familyReferences.filter(
    (row) =>
      String(row.nombre || '').trim() &&
      String(row.telefono || '').trim() &&
      String(row.relacion || '').trim() &&
      String(row.tiempoConocer || '').trim()
  ).length;
  const hasMinimumFamilyReferences = validFamilyReferences >= 2;

  const isTabCompleted = (tabId) => {
    const fields = sectionRequiredFields[tabId] || [];
    if (fields.length === 0) return false;

    const requiredFieldsDone = fields.every((name) => String(formData[name] || '').trim() !== '');
    if (tabId === 'familiar') {
      return requiredFieldsDone && hasMinimumFamilyReferences;
    }

    return requiredFieldsDone;
  };

  const validateCurrentTab = () => {
    const reqFields = sectionRequiredFields[activeTab] || [];
    const newErrors = {};

    reqFields.forEach((name) => {
      const msg = validateField(name, formData[name]);
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

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handlePreviousStep = () => {
    if (isFirstStep) return;
    setActiveTab(tabs[currentTabIndex - 1].id);
  };

  const handleNextStep = () => {
    const isValid = validateCurrentTab();
    if (!isValid) {
      window.alert('Completa los campos obligatorios de esta sección antes de continuar.');
      return;
    }
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
      fechaNacimiento: '',
      lugarNacimiento: '',
      edad: '',
      sexo: '',
      escolaridad: '',
      ocupacion: '',
      estadoCivil: '',
      direccion: '',
      telefonoCasa: '',
      telefonoCelular: '',
      habitantesDomicilio: '',
      pacienteNombre: '',
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
      familiarDiagnostico: '',
      familiarObservacionesTrabajoSocial: '',
      familiarObservacionesVisitaDomiciliaria: '',
    });
    setHouseholdMembers([{ nombre: '', parentesco: '', edad: '', sexo: '', estadoCivil: '', ocupacionLugar: '' }]);
    setIncomeContributors([{ parentesco: '', cantidadMensual: '' }]);
    setVehicleAssets([{ marca: '', modelo: '', propietario: '' }]);
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
    setTouched({});
    setErrors({});
    setIsDirty(false);
    navigate('/admisiones');
  };

  const handleSaveDraft = () => {
    // Base para escalado: aquí luego se puede guardar sección por sección en backend.
    setIsDirty(false);
    window.alert(`Borrador guardado para la sección "${activeTab}".`);
  };

  const handleSaveStudy = () => {
    const isValid = validateCurrentTab();
    if (!isValid) {
      window.alert('Completa los campos obligatorios marcados antes de guardar.');
      return;
    }

    // Base para escalado: preparado para guardar expediente completo.
    setIsDirty(false);
    window.alert('Estudio guardado correctamente.');
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
      <header className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <InstitutionalHeader
          title="Estudio Socioeconómico"
          moduleLabel="Formulario de Ingreso Institucional"
          areaLabel={`Paso ${stepNumber} de ${tabs.length} • ${tabs[stepNumber - 1]?.label}`}
          sessionValue="Admisiones"
          badge={<Users size={16} className="text-[#7E1D3B]" />}
        />
      </header>

        <main className="space-y-5">
        
        {/* --- BUSCADOR DE SOLICITANTE --- */}
        <section className="mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7E1D3B] transition-colors" size={20}/>
            <input 
              type="text" 
              placeholder="Buscar Solicitante por Nombre o Folio..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#7E1D3B]/20 focus:border-[#7E1D3B] transition-all text-sm hover:shadow-md"
            />
          </div>
        </section>

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
                <InputGroup label="Nombre Completo del Solicitante" name="nombreSolicitante" value={formData.nombreSolicitante} error={errors.nombreSolicitante} required onChange={handleChange} onBlur={handleBlur} placeholder="Escribe el nombre completo..." />
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

                <div className="md:col-span-2 xl:col-span-3">
                  <InputGroup label="Dirección Actual" name="direccion" value={formData.direccion} error={errors.direccion} required onChange={handleChange} onBlur={handleBlur} placeholder="Calle, Número, Colonia, C.P." />
                </div>

                <InputGroup label="Número Telefónico (Casa)" name="telefonoCasa" value={formData.telefonoCasa} error={errors.telefonoCasa} onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />
                <InputGroup label="Teléfono Celular" name="telefonoCelular" value={formData.telefonoCelular} error={errors.telefonoCelular} required onChange={handleChange} onBlur={handleBlur} placeholder="000-000-0000" />

                  <div className="md:col-span-2 xl:col-span-3 bg-rose-50/70 p-4 rounded-2xl border border-rose-100/70">
                   <InputGroup label="Personas que habitan en el domicilio" name="habitantesDomicilio" value={formData.habitantesDomicilio} error={errors.habitantesDomicilio} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. 4 personas (Padres y hermanos)" />
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
                <InputGroup label="Nombre Completo del Paciente" name="pacienteNombre" value={formData.pacienteNombre} error={errors.pacienteNombre} required onChange={handleChange} onBlur={handleBlur} placeholder="Escribe el nombre completo..." />
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

                  <InputGroup label="Lugar de Trabajo/Empleo" name="laboralLugarTrabajo" value={formData.laboralLugarTrabajo} error={errors.laboralLugarTrabajo} required onChange={handleChange} onBlur={handleBlur} placeholder="Empresa o negocio" />
                  <InputGroup label="Antiguedad Laboral" name="laboralAntiguedad" value={formData.laboralAntiguedad} error={errors.laboralAntiguedad} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. 2 anos" />
                  <InputGroup label="Puesto que ocupa" name="laboralPuesto" value={formData.laboralPuesto} error={errors.laboralPuesto} required onChange={handleChange} onBlur={handleBlur} placeholder="Puesto actual" />
                  <InputGroup label="Horario de Trabajo" name="laboralHorario" value={formData.laboralHorario} error={errors.laboralHorario} onChange={handleChange} onBlur={handleBlur} placeholder="Ej. 8:00 - 16:00" />

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
                    />
                  </div>
                  <div>
                    <InputGroup label="Numero de integrantes que aportan" name="numeroIntegrantesAportan" value={formData.numeroIntegrantesAportan} error={errors.numeroIntegrantesAportan} onChange={handleChange} onBlur={handleBlur} type="number" placeholder="0" />
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
                  <div className="flex gap-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.balanceEconomico === 'deficit'
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-[#7E1D3B]'
                    }`}>
                      <input
                        type="radio"
                        name="balanceEconomico"
                        value="deficit"
                        checked={formData.balanceEconomico === 'deficit'}
                        onChange={(e) => handleChange('balanceEconomico', e.target.value)}
                        onBlur={() => handleBlur('balanceEconomico')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className={`text-sm font-bold ${formData.balanceEconomico === 'deficit' ? 'text-rose-700' : 'text-slate-600'}`}>Déficit (Falta)</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                      formData.balanceEconomico === 'superavit'
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-[#7E1D3B]'
                    }`}>
                      <input
                        type="radio"
                        name="balanceEconomico"
                        value="superavit"
                        checked={formData.balanceEconomico === 'superavit'}
                        onChange={(e) => handleChange('balanceEconomico', e.target.value)}
                        onBlur={() => handleBlur('balanceEconomico')}
                        className="accent-[#7E1D3B]"
                      />
                      <span className={`text-sm font-bold ${formData.balanceEconomico === 'superavit' ? 'text-emerald-700' : 'text-slate-600'}`}>Superávit (Sobra)</span>
                    </label>
                  </div>
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
                </div>
                {errors.balanceEconomico && <p className="mt-1 text-xs font-semibold text-rose-700">{errors.balanceEconomico}</p>}
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
                            <th className="px-3 py-2 text-left">Modelo</th>
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
                                  value={row.modelo}
                                  onChange={(e) => handleVehicleAssetChange(index, 'modelo', e.target.value)}
                                  onFocus={() => setActiveVehicleRow(index)}
                                  disabled={!hasVehicle}
                                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 outline-none focus:border-[#7E1D3B] focus:ring-2 focus:ring-[#7E1D3B]/15"
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
                  required
                  error={errors.familiarObservacionesTrabajoSocial}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                />

                <TextAreaGroup
                  label="Observaciones de la visita domiciliaria"
                  name="familiarObservacionesVisitaDomiciliaria"
                  value={formData.familiarObservacionesVisitaDomiciliaria}
                  required
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
                className="px-6 py-2 bg-[#7E1D3B] text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 hover:bg-[#63162e] transition-all flex items-center gap-2"
              >
                <Save size={18}/> Guardar Estudio
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

const IncomeContributorsTable = ({ rows, onChange, onAddRow, onRemoveRow, activeRow, onRowFocus }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 md:p-5">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">Aportación de otros familiares</h3>
      <button
        type="button"
        onClick={onAddRow}
        className="inline-flex items-center gap-2 rounded-lg border border-[#7E1D3B]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#7E1D3B] hover:bg-[#7E1D3B]/5"
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