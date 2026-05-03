import React, { useState, useEffect } from 'react';
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

// Médico
import InicioJefeMedico from './views/medico/InicioJefeMedico';
import PacientesActivos from './views/medico/PacientesActivos';
import ExpedientesClinicos from './views/medico/ExpedientesClinicos';
import DetalleExpediente from './views/medico/DetalleExpediente';
import ValoracionMedica from './views/medico/ValoracionMedica';
import Prospectos from './views/medico/Prospectos';
import HistoriaMedica from './views/medico/HistoriaMedica';

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

// Recursos Materiales
import RecMaterialesDashboard from './views/rec-materiales/Dashboard';
import Proveedores from './views/rec-materiales/Proveedores';
import ListaRequisiciones from './views/rec-materiales/ListaRequisiciones';
import DetallesRequisicion from './views/rec-materiales/DetallesRequisicion';
import OrdenCompra from './views/rec-materiales/OrdenCompra';
import Historial from './views/rec-materiales/Historial';

// Almacén
import AlmacenDashboard from './views/almacen/AlmacenDashboard';

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('marakame_user');
  return user ? children : <Navigate to="/login" replace />;
};

const quickViews = [
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
  { label: 'Rec. Materiales',        path: '/rec-materiales/rec-materiales' },
  { label: 'Rec. Proveedores',       path: '/rec-materiales/rec-materiales/proveedores' },
  { label: 'Rec. Historial',         path: '/rec-materiales/rec-materiales/historial' },
  { label: 'Almacén',                path: '/almacen' },
];

const QuickNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);
  const uniqueQuickViews = Array.from(new Map(quickViews.map((v) => [v.path, v])).values());

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {abierto && (
        <div className="mb-2 w-[220px] rounded-2xl border border-slate-200 bg-white/95 p-3
                        shadow-[0_12px_30px_rgba(15,23,42,0.14)] backdrop-blur
                        max-h-[70vh] overflow-y-auto">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">
            Vistas rápidas
          </p>
          <div className="grid gap-1.5">
            {uniqueQuickViews.map((view) => {
              const active = location.pathname === view.path;
              return (
                <button
                  key={`${view.label}-${view.path}`}
                  onClick={() => { navigate(view.path); setAbierto(false); }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                    active
                      ? 'bg-[#7E1D3B] text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setAbierto(prev => !prev)}
        className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[#7E1D3B] text-white
                   rounded-2xl font-semibold text-xs shadow-lg hover:bg-[#63162e] transition-all"
      >
        {abierto ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            Cerrar
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            Vistas
          </>
        )}
      </button>
    </div>
  );
};

function App() {

  return (
    <BrowserRouter>
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
        <Route path="/medico/historia-medica"              element={<PrivateRoute><HistoriaMedica /></PrivateRoute>} />

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

{/* Rutas para Recursos Materiales y Compras/Inventario */}
        <Route path='/materiales/:rol' element={<RecMaterialesDashboard/>}>
          <Route index element={<ListaRequisiciones />}/>
          <Route path='proveedores' element={<Proveedores/>}/>
          <Route path='historial' element={<Historial />}/>
          <Route path='requisicion/:id' element={<DetallesRequisicion />}/>
          <Route path='orden-compra/:id' element={<OrdenCompra />}/>
        </Route>

        {/* Almacén */}
        <Route path="/almacen" element={<PrivateRoute><AlmacenDashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <QuickNavigator />
    </BrowserRouter>
  );
}

export default App;