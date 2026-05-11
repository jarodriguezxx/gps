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
import RequisicionesMedico     from './views/medico/RequisicionesMedico';
import RequisicionesClinico    from './views/clinico/RequisicionesClinico';

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
import GestorDocumentosClinicos from './views/clinico/GestorDocumentosClinicos';
import InicioTerapeuta from './views/clinico/InicioTerapeuta';
import PacientesClinico from './views/clinico/PacientesClinico';

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

const getUsuarioSesion = () => {
  try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
};

const PrivateRoute = ({ children }) => {
  const user = window.localStorage.getItem('marakame_user');
  return user ? children : <Navigate to="/login" replace />;
};

// Redirige a `fallback` si el puesto del usuario está en `puestosExcluidos`
const PuestoRoute = ({ children, puestosExcluidos = [], fallback = '/admisiones' }) => {
  const puesto = getUsuarioSesion().puesto || '';
  if (puestosExcluidos.includes(puesto)) return <Navigate to={fallback} replace />;
  return children;
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
        <Route path="/admisiones/requisiciones"                element={<PrivateRoute><PuestoRoute puestosExcluidos={['RECEPCIÓN']} fallback="/admisiones"><RequisicionesAdmisiones /></PuestoRoute></PrivateRoute>} />
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
        <Route path="/medico/requisiciones"                    element={<PrivateRoute><RequisicionesMedico /></PrivateRoute>} />

        <Route path="/nutriologo/pacientes"                    element={<PrivateRoute><PacientesNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/inicio"                       element={<PrivateRoute><InicioNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/evaluacion/:id"               element={<PrivateRoute><EvaluacionNutricional /></PrivateRoute>} />
        <Route path="/nutriologo/expedientes"                  element={<PrivateRoute><ExpedientesNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/reportes"                     element={<PrivateRoute><ReportesNutricion /></PrivateRoute>} />
        <Route path="/nutriologo/vista-expediente/:id"         element={<PrivateRoute><VistaExpedienteNutricion /></PrivateRoute>} />

         {/* Clínico */}
        <Route path="/clinico"                                element={<Navigate to="/clinico/inicio-jefe-clinico" replace />} />
        <Route path="/clinico/inicio-jefe-clinico"            element={<PrivateRoute><InicioJefeClinico /></PrivateRoute>} />
        <Route path="/clinico/pacientes"                      element={<PrivateRoute><PacientesClinico /></PrivateRoute>} />
        <Route path="/clinico/inicio-terapeuta"               element={<PrivateRoute><InicioTerapeuta /></PrivateRoute>} />
        <Route path="/clinico/psicologia/:id"                 element={<PrivateRoute><GestorDocumentosClinicos rolActivo="psicologia" /></PrivateRoute>} />
        <Route path="/clinico/consejeria/:id"                 element={<PrivateRoute><GestorDocumentosClinicos rolActivo="consejeria" /></PrivateRoute>} />
        <Route path="/clinico/familia/:id"                    element={<PrivateRoute><GestorDocumentosClinicos rolActivo="familia" /></PrivateRoute>} />
        <Route path="/clinico/gestor"                         element={<PrivateRoute><GestorDocumentosClinicos rolActivo="general" /></PrivateRoute>} />
        <Route path="/clinico/requisiciones"                  element={<PrivateRoute><RequisicionesClinico /></PrivateRoute>} />

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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;