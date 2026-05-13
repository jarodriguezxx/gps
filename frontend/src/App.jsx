import React from 'react';
import { API_BASE } from './config/api.ts';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// Autenticación
import Login from './views/login';

// Admisiones
import AdmisionesInicio from './views/admisiones/Admisiones-inicio';
import BandejaOperativa from './views/admisiones/BandejaOperativa';
import AgendaCitas from './views/admisiones/AgendaCitas';
import SeguimientoTelefonico from './views/admisiones/SeguimientoTelefonico';
import ExpedienteAdmisiones from './views/admisiones/ExpedienteAdmisiones';
import DirectorioAdmisiones from './views/admisiones/DirectorioAdmisiones';
import EstudioSocioeconomico from './views/admisiones/EstudioSocioeconomico';
import ValoracionDiagnostica from './views/admisiones/ValoracionDiagnostica';
import RequisicionesAdmisiones from './views/admisiones/RequisicionesAdmisiones';
import ValidarRequisicionesAdmisiones from './views/admisiones/ValidarRequisicionesAdmisiones';
import RequisicionesMedico     from './views/medico/RequisicionesMedico';
import ValidarRequisicionesMedico from './views/medico/ValidarRequisicionesMedico';
import RequisicionesClinico    from './views/clinico/RequisicionesClinico';
import ValidarRequisicionesClinico from './views/clinico/ValidarRequisicionesClinico';
import RequisicionesNutriologo from './views/nutriologo/RequisicionesNutriologo';
import RequisicionesEnfermeria from './views/enfermeria/RequisicionesEnfermeria';

// Médico
import InicioJefeMedico from './views/medico/InicioJefeMedico';
import PacientesActivos from './views/medico/PacientesActivos';
import ExpedientesClinicos from './views/medico/ExpedientesClinicos';
import DetalleExpediente from './views/medico/DetalleExpediente';
import ValoracionMedica from './views/medico/ValoracionMedica';
import Prospectos from './views/medico/Prospectos';
import HistoriaMedica from './views/medico/HistoriaMedica';
import NuevaEvolucion from './views/medico/NuevaEvolucion';
import ControlMonitoreo from './views/medico/ControlMonitoreo';

//Nutriólogo
import InicioNutricion from './views/nutriologo/InicioNutricion';
import PacientesNutricion from './views/nutriologo/PacientesNutricion'; 
import EvaluacionNutricional from './views/nutriologo/EvaluacionNutricional.jsx';
import ExpedientesNutricion from './views/nutriologo/ExpedientesNutricion';
import ReportesNutricion from './views/nutriologo/ReportesNutricion';
import VistaExpedienteNutricion from './views/nutriologo/VistaExpedienteNutricion';

//Clínico
import InicioJefeClinico from './views/clinico/InicioJefeClinico';
import DirectorioJefeClinico from './views/clinico/DirectorioJefeClinico';
import CalendarioJefeClinico from './views/clinico/CalendarioJefeClinico';
import InicioPsicologia from './views/clinico/InicioPsicologia';
import ExpedientePsicologia from './views/clinico/ExpedientePsicologia';
import RequisicionesPsicologia from './views/psicologia/RequisicionesPsicologia';
import RequisicionesConsejeria from './views/clinico/RequisicionesConsejeria';
import RequisicionesFamilia from './views/clinico/RequisicionesFamilia';
import RequisicionesTerapeuta from './views/clinico/RequisicionesTerapeuta';
import InicioTerapeuta from './views/clinico/InicioTerapeuta';
import AuditoriaExpediente from './views/clinico/AuditoriaExpediente';
import AsignacionesTerapeutas from './views/clinico/AsignacionesTerapeutas';
import AgendaPsicologia from './views/clinico/AgendaPsicologia';
import InicioConsejeria from './views/clinico/InicioConsejeria';
import ExpedienteConsejeria from './views/clinico/ExpedienteConsejeria';
import AgendaConsejeria from './views/clinico/AgendaConsejeria';
import InicioFamilia from './views/clinico/InicioFamilia';
import ExpedienteFamilia from './views/clinico/ExpedienteFamilia';
import AgendaFamilia from './views/clinico/AgendaFamilia';

// Recursos Humanos
import AltaPersonal from './views/rh/AltaPersonal';
import BajaPersonal from './views/rh/BajaPersonal';
import CatalogoRoles from './views/rh/CatalogoRoles';
import AsignacionRoles from './views/rh/AsignacionRoles';

// Financiero
import ArchivoContable from './views/financiero/ArchivoContable';
import DigitalizarComprobantes from './views/financiero/DigitalizarComprobantes';
import GestionarCorreciones from './views/financiero/GestionarCorrecciones';
import FacturaElectronica from './views/financiero/FacturaElectronica';
import ComprobantesFiscales from './views/financiero/ComprobantesFiscales';
import RequisicionesAlmacen from './views/financiero/RequisicionesAlmacen';
import DepositoBancario from './views/financiero/DepositoBancario';
import ValidacionPagos from './views/financiero/ValidacionPagos';

// Recursos Materiales
import RecMaterialesDashboard from './views/rec-materiales/Dashboard.tsx';
import Proveedores from './views/rec-materiales/Proveedores.tsx';
import ListaRequisiciones from './views/rec-materiales/ListaRequisiciones.tsx';
import DetallesRequisicion from './views/rec-materiales/DetallesRequisicion.tsx';
import OrdenCompra from './views/rec-materiales/OrdenCompra.tsx';
import Historial from './views/rec-materiales/Historial.tsx';

// Almacén
import AlmacenDashboard from './views/almacen/AlmacenDashboard';

// Enfermería
import EnfermeriaDashboard from './views/enfermeria/EnfermeriaDashboard';
import FarmaciaMedico from './views/medico/FarmaciaMedico';

const getUsuarioSesion = () => {
  try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
};

const PrivateRoute = ({ children }) => {
  const user = window.localStorage.getItem('marakame_user');
  return user ? children : <Navigate to="/login" replace />;
};

const QUICK_VIEWS = [
  { label: 'Login',                  path: '/login' },
  { label: 'Admisiones',             path: '/admisiones' },
  { label: 'Bandeja Operativa',      path: '/admisiones/bandeja-operativa' },
  { label: 'Agenda Citas',           path: '/admisiones/agenda-citas' },
  { label: 'Seguimiento Tel.',       path: '/admisiones/seguimiento-telefonico' },
  { label: 'Exp. Admisiones',        path: '/admisiones/expediente' },
  { label: 'Estudio Socioeconómico', path: '/admisiones/estudio-socioeconomico' },
  { label: 'Valoración Diagnóstica', path: '/admisiones/valoracion-diagnostica' },
  { label: 'Médico - Inicio',        path: '/medico/inicio-jefe-medico' },
  { label: 'Médico - Pacientes',     path: '/medico/pacientes' },
  { label: 'Médico - Expedientes',   path: '/medico/expedientes' },
  { label: 'Médico - Prospectos',    path: '/medico/prospectos' },
  { label: 'Medico - Historia '  ,   path: '/medico/historia-medica' },
  { label: 'Medico - Nueva ',        path: '/medico/nueva-evolucion/1' },
  { label: 'Medico - Monitoreo',     path: '/medico/monitoreo/1' },
  { label: 'Nutriólogo - Inicio',    path: '/nutriologo/inicio' },
  { label: 'Nutriólogo - Pacientes', path: '/nutriologo/pacientes' },
  { label: 'Nutriólogo  Evaluación', path: '/nutriologo/evaluacion/1' },
  { label: 'Nutri - Expedientes',    path: '/nutriologo/expedientes' },
  { label: 'Jefe Clínico - Inicio',  path: '/clinico/inicio' },
  { label: 'Jefe Clínico - Direc',   path: '/clinico/directorio' },
  { label: 'Jefe Clínico - Calend',  path: '/clinico/calendario' },
  { label: 'Jefe Clínico - Asig.',   path: '/clinico/asignaciones' },
  { label: 'Psicología - Inicio',    path: '/psicologia/inicio' },
  { label: 'Psicología - Exp',       path: '/psicologia/expediente/1' },
  { label: 'Terapeuta - Inicio',     path: '/clinico/inicio-terapeuta' },
  { label: 'Consejería - Inicio',    path: '/consejeria/inicio' },
  { label: 'Familia - Inicio',       path: '/familia/inicio' },
  { label: 'RH - Alta',              path: '/rh/alta-personal' },
  { label: 'RH - Baja',              path: '/rh/baja-personal' },
  { label: 'RH - Catálogo',          path: '/rh/catalogo-roles' },
  { label: 'RH - Asignación',        path: '/rh/asignacion-roles' },
  { label: 'Fin - Archivo',          path: '/financiero/archivo-contable' },
  { label: 'Fin - Digitalizar',      path: '/financiero/digitalizar-comprobantes' },
  { label: 'Fin - Correcciones',     path: '/financiero/gestionar-correcciones' },
  { label: 'Fin - Factura',          path: '/financiero/factura-electronica' },
  { label: 'Fin - Comprobantes',     path: '/financiero/comprobantes-fiscales' },
  { label: 'Fin - Requisiciones',    path: '/financiero/requisiciones-almacen' },
  { label: 'Fin - Depósito',         path: '/financiero/deposito-bancario' },
  { label: 'Fin - Validación',       path: '/financiero/validacion-pagos' },
  { label: 'Rec. Materiales',        path: '/rec-materiales/rec-materiales' },
  { label: 'Rec. Proveedores',       path: '/rec-materiales/rec-materiales/proveedores' },
  { label: 'Rec. Historial',         path: '/rec-materiales/rec-materiales/historial' },
  { label: 'Almacén',                path: '/almacen' },
];

const PuestoRoute = ({ children, puestosPermitidos = null, puestosExcluidos = [], fallback = '/admisiones' }) => {
  const puesto = getUsuarioSesion().puesto || '';
  if (puestosPermitidos && !puestosPermitidos.includes(puesto)) return <Navigate to={fallback} replace />;
  if (puestosExcluidos.includes(puesto)) return <Navigate to={fallback} replace />;
  return children;
};

const AreaRoute = ({ children, area, fallback = '/admisiones' }) => {
  const usuario = getUsuarioSesion();
  const rol = usuario.rol || '';
  
  // Validar área: puede ser un string o un array de áreas permitidas
  const areasPermitidas = Array.isArray(area) ? area : [area];
  
  // Si el rol coincide O el puesto está en una de las áreas permitidas, permitir acceso
  if (areasPermitidas.includes(rol)) return children;
  
  // También permitir si el puesto contiene una de las palabras clave del área
  const areaKeywords = {
    'CLINICO': ['psicologia', 'psicologo', 'clinico', 'consejeria', 'consejera', 'consejero', 'familia', 'terapeuta', 'coterapeuta'],
    'MÉDICO': ['medico', 'nutriolog', 'enfermer'],
    'ADMISIONES': ['admisiones', 'recepcion']
  };
  
  const keywords = areaKeywords[area] || [];
  const puestoLower = (usuario.puesto || '').toLowerCase();
  if (keywords.some(kw => puestoLower.includes(kw))) return children;
  
  return <Navigate to={fallback} replace />;
};

const LegacyRecMaterialesRedirect = () => {
  const location = useLocation();
  const legacySuffix = location.pathname.replace(/^\/rec-materiales/, '') || '/rec-materiales';
  return <Navigate to={`/materiales${legacySuffix}`} replace />;
};

const LogoutButton = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  if (location.pathname === '/login') return null;
  if (!localStorage.getItem('marakame_user')) return null;

  const handleLogout = () => {
    localStorage.removeItem('marakame_user');
    navigate('/login', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      title="Cerrar sesión"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5
                 bg-white border border-slate-200 text-slate-600 rounded-2xl
                 text-xs font-semibold shadow-lg hover:bg-rose-50 hover:text-rose-600
                 hover:border-rose-200 transition-all"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Cerrar sesión
    </button>
  );
};

function App() {

  return (
    <BrowserRouter>
      <LogoutButton />
      <Routes>
        <Route path="/"      element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admisiones */}
        <Route path="/admisiones"                              element={<PrivateRoute><AdmisionesInicio /></PrivateRoute>} />
        <Route path="/admisiones/bandeja-operativa"            element={<PrivateRoute><BandejaOperativa /></PrivateRoute>} />
        <Route path="/admisiones/agenda-citas"                 element={<PrivateRoute><AgendaCitas /></PrivateRoute>} />
        <Route path="/admisiones/seguimiento-telefonico"       element={<PrivateRoute><SeguimientoTelefonico /></PrivateRoute>} />
        <Route path="/admisiones/expediente"                   element={<PrivateRoute><DirectorioAdmisiones /></PrivateRoute>} />
        <Route path="/admisiones/expediente-digital/:id"       element={<PrivateRoute><ExpedienteAdmisiones /></PrivateRoute>} />
        <Route path="/admisiones/requisiciones"                element={<PrivateRoute><RequisicionesAdmisiones /></PrivateRoute>} />
        <Route path="/admisiones/validar-requisiciones"        element={<PrivateRoute><ValidarRequisicionesAdmisiones /></PrivateRoute>} />
<Route path="/admisiones/estudio-socioeconomico"       element={<PrivateRoute><EstudioSocioeconomico /></PrivateRoute>} />
        <Route path="/admisiones/valoracion-diagnostica"       element={<PrivateRoute><ValoracionDiagnostica /></PrivateRoute>} />
        <Route path="/admisiones/bandeja"                      element={<Navigate to="/admisiones/bandeja-operativa" replace />} />

        {/* Médico */}
        <Route path="/medico"                                  element={<Navigate to="/medico/inicio-jefe-medico" replace />} />
        <Route path="/medico/inicio-jefe-medico"               element={<PrivateRoute><InicioJefeMedico /></PrivateRoute>} />
        <Route path="/medico/pacientes"                        element={<PrivateRoute><PacientesActivos /></PrivateRoute>} />
        <Route path="/medico/expedientes"                      element={<PrivateRoute><ExpedientesClinicos /></PrivateRoute>} />
        <Route path="/medico/expedientes/:id"                  element={<PrivateRoute><DetalleExpediente /></PrivateRoute>} />
        <Route path="/medico/prospectos"                       element={<PrivateRoute><Prospectos /></PrivateRoute>} />
        <Route path="/medico/valoracion/:id"                   element={<PrivateRoute><ValoracionMedica /></PrivateRoute>} />
        <Route path="/medico/historia-medica"                  element={<PrivateRoute><HistoriaMedica /></PrivateRoute>} />
        <Route path="/medico/nueva-evolucion/:id"              element={<PrivateRoute><NuevaEvolucion /></PrivateRoute>} />
        <Route path="/medico/monitoreo/:id"                    element={<PrivateRoute><ControlMonitoreo /></PrivateRoute>} />
        <Route path="/medico/requisiciones"                    element={<PrivateRoute><AreaRoute area={'MÉDICO'} fallback="/medico/inicio-jefe-medico"><RequisicionesMedico /></AreaRoute></PrivateRoute>} />
        <Route path="/medico/validar-requisiciones"            element={<PrivateRoute><PuestoRoute puestosPermitidos={['JEFA (E) DEP. MÉDICO', 'JEFE DEPARTAMENTO MÉDICO']} fallback="/medico/inicio-jefe-medico"><ValidarRequisicionesMedico /></PuestoRoute></PrivateRoute>} />
        <Route path="/medico/farmacia"                         element={<PrivateRoute><FarmaciaMedico /></PrivateRoute>} />

        <Route path="/nutriologo/pacientes"                    element={<PrivateRoute><PacientesNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/inicio"                       element={<PrivateRoute><InicioNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/evaluacion/:id"               element={<PrivateRoute><EvaluacionNutricional /></PrivateRoute>} />
        <Route path="/nutriologo/expedientes"                  element={<PrivateRoute><ExpedientesNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/reportes"                     element={<PrivateRoute><ReportesNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/vista-expediente/:id"         element={<PrivateRoute><VistaExpedienteNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/requisiciones"                element={<PrivateRoute><AreaRoute area={'MÉDICO'} fallback="/nutriologo/inicio"><RequisicionesNutriologo /></AreaRoute></PrivateRoute>} />

        <Route path="/clinico/inicio"                          element={<PrivateRoute><InicioJefeClinico /></PrivateRoute>} />
        <Route path="/clinico/inicio-terapeuta"                element={<PrivateRoute><InicioTerapeuta /></PrivateRoute>} />
        <Route path="/clinico/directorio"                      element={<PrivateRoute><DirectorioJefeClinico /></PrivateRoute>} />
        <Route path="/clinico/calendario"                      element={<PrivateRoute><CalendarioJefeClinico /></PrivateRoute>} />
        <Route path="/clinico/asignaciones"                    element={<PrivateRoute><AsignacionesTerapeutas /></PrivateRoute>} />
        <Route path="/clinico/auditoria/:id"                   element={<PrivateRoute><AuditoriaExpediente /></PrivateRoute>} />
        <Route path="/clinico/requisiciones"                   element={<PrivateRoute><AreaRoute area={'CLINICO'} fallback="/clinico/inicio"><RequisicionesClinico /></AreaRoute></PrivateRoute>} />
        <Route path="/clinico/validar-requisiciones"           element={<PrivateRoute><PuestoRoute puestosPermitidos={['JEFA (E) DEP. CLÍNICO', 'JEFE DEPARTAMENTO CLÍNICO']} fallback="/clinico/inicio"><ValidarRequisicionesClinico /></PuestoRoute></PrivateRoute>} />
        <Route path="/psicologia/inicio"                       element={<PrivateRoute><InicioPsicologia /></PrivateRoute>} />
        <Route path="/psicologia/requisiciones"                element={<PrivateRoute><AreaRoute area={'CLINICO'} fallback="/psicologia/inicio"><RequisicionesPsicologia /></AreaRoute></PrivateRoute>} />
        <Route path="/psicologia/expediente/:id"               element={<PrivateRoute><ExpedientePsicologia /></PrivateRoute>} />
        <Route path="/psicologia/agendar"                      element={<PrivateRoute><AgendaPsicologia /></PrivateRoute>} />
        <Route path="/consejeria/inicio"                       element={<PrivateRoute><InicioConsejeria /></PrivateRoute>} />
        <Route path="/consejeria/expediente/:id"               element={<PrivateRoute><ExpedienteConsejeria /></PrivateRoute>} />
        <Route path="/consejeria/agendar"                      element={<PrivateRoute><AgendaConsejeria /></PrivateRoute>} />
        <Route path="/consejeria/requisiciones"                element={<PrivateRoute><AreaRoute area={'CLINICO'} fallback="/consejeria/inicio"><RequisicionesConsejeria /></AreaRoute></PrivateRoute>} />
        <Route path="/familia/inicio"                          element={<PrivateRoute><InicioFamilia /></PrivateRoute>} />
        <Route path="/familia/expediente/:id"                  element={<PrivateRoute><ExpedienteFamilia /></PrivateRoute>} />
        <Route path="/familia/agendar"                         element={<PrivateRoute><AgendaFamilia /></PrivateRoute>} />
        <Route path="/familia/requisiciones"                   element={<PrivateRoute><AreaRoute area={'CLINICO'} fallback="/familia/inicio"><RequisicionesFamilia /></AreaRoute></PrivateRoute>} />
        <Route path="/clinico/requisiciones-terapeuta"         element={<PrivateRoute><AreaRoute area={'CLINICO'} fallback="/clinico/inicio-terapeuta"><RequisicionesTerapeuta /></AreaRoute></PrivateRoute>} />

        {/* Recursos Humanos */}
        <Route path="/rh/alta-personal"                        element={<PrivateRoute><AltaPersonal /></PrivateRoute>} />
        <Route path="/rh/baja-personal"                        element={<PrivateRoute><BajaPersonal /></PrivateRoute>} />
        <Route path="/rh/catalogo-roles"                       element={<PrivateRoute><CatalogoRoles /></PrivateRoute>} />
        <Route path="/rh/asignacion-roles"                     element={<PrivateRoute><AsignacionRoles /></PrivateRoute>} />

        {/* Financiero */}
        <Route path="/financiero/archivo-contable"             element={<PrivateRoute><ArchivoContable /></PrivateRoute>} />
        <Route path="/financiero/digitalizar-comprobantes"     element={<PrivateRoute><DigitalizarComprobantes /></PrivateRoute>} />
        <Route path="/financiero/factura-electronica"          element={<PrivateRoute><FacturaElectronica /></PrivateRoute>} />
        <Route path="/financiero/comprobantes-fiscales"        element={<PrivateRoute><ComprobantesFiscales /></PrivateRoute>} />
        <Route path="/financiero/requisiciones-almacen"        element={<PrivateRoute><RequisicionesAlmacen /></PrivateRoute>} />
        <Route path="/financiero/gestionar-correcciones"       element={<PrivateRoute><GestionarCorreciones /></PrivateRoute>} />
        <Route path="/financiero/deposito-bancario"            element={<PrivateRoute><DepositoBancario /></PrivateRoute>} />
        <Route path="/financiero/validacion-pagos"             element={<PrivateRoute><ValidacionPagos /></PrivateRoute>} />

        {/* Rutas para Recursos Materiales y Compras/Inventario */}
        <Route path="/rec-materiales" element={<LegacyRecMaterialesRedirect />} />
        <Route path="/rec-materiales/*" element={<LegacyRecMaterialesRedirect />} />
        <Route path="/materiales/:rol" element={<PrivateRoute><RecMaterialesDashboard /></PrivateRoute>}>
          <Route index element={<PrivateRoute><ListaRequisiciones /></PrivateRoute>} />
          <Route path="proveedores" element={<PrivateRoute><Proveedores /></PrivateRoute>} />
          <Route path="historial" element={<PrivateRoute><Historial /></PrivateRoute>} />
          <Route path="requisicion/:id" element={<PrivateRoute><DetallesRequisicion /></PrivateRoute>} />
          <Route path="orden-compra/:id" element={<PrivateRoute><OrdenCompra /></PrivateRoute>} />
        </Route>

        {/* Almacén */}
        <Route path="/almacen" element={<PrivateRoute><AlmacenDashboard /></PrivateRoute>} />

        {/* Enfermería */}
        <Route path="/enfermeria" element={<PrivateRoute><EnfermeriaDashboard /></PrivateRoute>} />
        <Route path="/enfermeria/requisiciones"                element={<PrivateRoute><AreaRoute area={'MÉDICO'} fallback="/enfermeria"><RequisicionesEnfermeria /></AreaRoute></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;