import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('marakame_user');
  return user ? children : <Navigate to="/login" replace />;
};
import AdmisionesInicio from './views/admisiones/Admisiones-inicio';
import Login from './views/login';
import ValoracionDiagnostica from './views/admisiones/ValoracionDiagnostica';
import EstudioSocioeconomico from './views/admisiones/EstudioSocioeconomico';
import AltaPersonal from './views/rh/AltaPersonal';
import BajaPersonal from './views/rh/BajaPersonal';
import CatalogoRoles from './views/rh/CatalogoRoles';
import AsignacionRoles from './views/rh/AsignacionRoles';
import EvaluacionEnfermeria from './views/medico/EvaluacionEnfermeria';
import ProtocoloDesintoxicacion from './views/medico/ProtocoloDesintoxicacion';
import PacientesActivos from './views/medico/PacientesActivos';
import HistorialMedicoPaciente from './views/medico/HistorialMedicoPaciente';
import ArchivoContable from './views/financiero/ArchivoContable';
import DigitalizarComprobantes from './views/financiero/DigitalizarComprobantes';
import GestionarCorreciones from './views/financiero/GestionarCorrecciones';
import FacturaElectronica from './views/financiero/FacturaElectronica';
import ComprobantesFiscales from './views/financiero/ComprobantesFiscales';
import RequisicionesAlmacen from './views/financiero/RequisicionesAlmacen';
import DepositoBancario from './views/financiero/DepositoBancario';
import AlmacenDashboard from './views/almacen/AlmacenDashboard';


import MedicoInicio from './views/Medico/Medico-inicio';
import EvaluacionNutricional from './views/Medico/Nutriologia/EvaluacionNutricional';
import InventarioPertenencias from './views/Medico/InventarioPertenencias';
import HistoriaMedica from './views/Medico/HistoriaMedica';
import NutriologiaInicio from './views/Nutriologia/Nutriologia-inicio';
import ExpedienteAdmisiones from './views/admisiones/ExpedienteAdmisiones';
import ExpedienteMedico from './views/Medico/ExpedienteMedico';
import ConsultaDiaria from './views/Medico/ConsultaDiaria';
import ControlTensionArterial from './views/Medico/ControlTensionArterial';
import ControlGlicemia from './views/Medico/ControlGlicemia';
import HistorialPreAdmision from './views/Medico/HistorialPreAdmision.jsx'; 


//Clinico
import PsicologiaInicio from './views/Clinico/PsicologiaInicio'; 
import GestionDocumentosPsicologia from './views/Clinico/GestionDocumentosPsicologia';
import NotasEvolucionPsicologia from './views/Clinico/NotasEvolucionPsicologia';

// Importaciones para Recursos Materiales
import RecMaterialesDashboard from './views/rec-materiales/Dashboard';
import Proveedores from './views/rec-materiales/Proveedores';
import ListaRequisiciones from './views/rec-materiales/ListaRequisiciones';
import DetallesRequisicion from './views/rec-materiales/DetallesRequisicion';
import OrdenCompra from './views/rec-materiales/OrdenCompra';
import Historial from './views/rec-materiales/Historial';
import { REQUISICIONES_COMPLETO } from '../src/types/requisicion.ts'



const quickViews = [
  { label: 'Login', path: '/login' },
  { label: 'Admisiones', path: '/admisiones' },
  { label: 'Exp. Admisiones', path: '/admisiones/expediente' },
  { label: 'Estudio', path: '/admisiones/estudio-socioeconomico' },
  { label: 'Valoración', path: '/admisiones/valoracion-diagnostica' },
  { label: 'Médico', path: '/medico' },
  { label: 'Exp. Médico', path: '/medico/expediente' },
  { label: 'Historia', path: '/medico/historia-medica' },
  { label: 'Inventario', path: '/medico/inventario-pertenencias' },
  { label: 'Eval. Enfermería', path: '/medico/evaluacion-medica' },
  { label: 'Protocolo', path: '/medico/protocolo-desintoxicacion' },
  { label: 'Pacientes Activos', path: '/medico/pacientes-activos' },
  { label: 'Consulta Diaria', path: '/medico/consulta-diaria' },
  { label: 'Historial Paciente', path: '/medico/historial-paciente' },
  { label: 'Nutriología', path: '/nutriologia' },
  { label: 'Evaluación Nutri', path: '/nutriologia/evaluacion-nutricional' },
  
  { label: 'Historial Pre-Admisión', path: '/medico/historial-pre-admision' },
  { label: 'Inicio Psicología', path: '/psicologia' },
  { label: 'Psi. Documentos', path: '/psicologia/paciente/HGU-18/documentos' },
  { label: 'Psi. Notas Evol.', path: '/psicologia/paciente/HGU-18/notas-evolucion' },
  { label: 'RH - Alta', path: '/rh/alta-personal' },
  { label: 'RH - Baja', path: '/rh/baja-personal' },
  { label: 'RH - Catálogo', path: '/rh/catalogo-roles' },
  { label: 'RH - Asignación', path: '/rh/asignacion-roles' },
  { label: 'Fin - Archivo', path: '/financiero/archivo-contable' },
  { label: 'Fin - Digitalizar', path: '/financiero/digitalizar-comprobantes' },
  { label: 'Fin - Correcciones', path: '/financiero/gestionar-correcciones' },
  { label: 'Fin - Factura', path: '/financiero/factura-electronica' },
  { label: 'Fin - Comprobantes', path: '/financiero/comprobantes-fiscales' },
  { label: 'Fin - Requisiciones', path: '/financiero/requisiciones-almacen' },
  { label: 'Fin - Depósito', path: '/financiero/deposito-bancario' },
  { label: 'Rec. Materiales', path: '/rec-materiales/rec-materiales' },
  { label: 'Rec. Proveedores', path: '/rec-materiales/rec-materiales/proveedores' },
  { label: 'Rec. Historial', path: '/rec-materiales/rec-materiales/historial' },
  { label: 'Almacén', path: '/almacen' },
];

const QuickNavigator = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [abierto, setAbierto] = useState(false);
  const uniqueQuickViews = Array.from(new Map(quickViews.map((view) => [view.path, view])).values());

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Panel desplegable */}
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

      {/* Botón flotante toggle */}
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

        <Route path="/admisiones"                              element={<PrivateRoute><AdmisionesInicio /></PrivateRoute>} />
        <Route path="/admisiones/expediente"                   element={<PrivateRoute><ExpedienteAdmisiones /></PrivateRoute>} />
        <Route path="/admisiones/estudio-socioeconomico"       element={<PrivateRoute><EstudioSocioeconomico /></PrivateRoute>} />
        <Route path="/admisiones/valoracion-diagnostica"       element={<PrivateRoute><ValoracionDiagnostica /></PrivateRoute>} />

        <Route path="/medico"                                  element={<PrivateRoute><MedicoInicio /></PrivateRoute>} />
        <Route path="/medico/expediente"                       element={<PrivateRoute><ExpedienteMedico /></PrivateRoute>} />
        <Route path="/medico/historia-medica"                  element={<PrivateRoute><HistoriaMedica /></PrivateRoute>} />
        <Route path="/medico/inventario-pertenencias"          element={<PrivateRoute><InventarioPertenencias /></PrivateRoute>} />
        <Route path="/rh/alta-personal"                        element={<PrivateRoute><AltaPersonal /></PrivateRoute>} />
        <Route path="/rh/baja-personal"                        element={<PrivateRoute><BajaPersonal /></PrivateRoute>} />
        <Route path="/rh/catalogo-roles"                       element={<PrivateRoute><CatalogoRoles /></PrivateRoute>} />
        <Route path="/rh/asignacion-roles"                     element={<PrivateRoute><AsignacionRoles /></PrivateRoute>} />

        <Route path="/medico/evaluacion-medica"                element={<PrivateRoute><EvaluacionEnfermeria /></PrivateRoute>} />
        <Route path="/medico/protocolo-desintoxicacion"        element={<PrivateRoute><ProtocoloDesintoxicacion /></PrivateRoute>} />
        <Route path="/medico/pacientes-activos"                element={<PrivateRoute><PacientesActivos /></PrivateRoute>} />
        <Route path="/medico/historial-paciente"               element={<PrivateRoute><HistorialMedicoPaciente /></PrivateRoute>} />
        <Route path="/medico/consulta-diaria"                  element={<PrivateRoute><ConsultaDiaria /></PrivateRoute>} />
        <Route path="/medico/pacientes/:pacienteId/consulta-diaria" element={<PrivateRoute><ConsultaDiaria /></PrivateRoute>} />
        <Route path="/medico/pacientes/:id/tension"            element={<PrivateRoute><ControlTensionArterial /></PrivateRoute>} />
        <Route path="/medico/pacientes/:id/glicemia"           element={<PrivateRoute><ControlGlicemia /></PrivateRoute>} />
        <Route path="/medico/pacientes/:pacienteId/expediente" element={<PrivateRoute><ExpedienteMedico /></PrivateRoute>} />
        <Route path="/medico/historial-pre-admision"           element={<PrivateRoute><HistorialPreAdmision /></PrivateRoute>} />

        <Route path="/nutriologia"                             element={<PrivateRoute><NutriologiaInicio /></PrivateRoute>} />
        <Route path="/nutriologia/evaluacion-nutricional"      element={<PrivateRoute><EvaluacionNutricional /></PrivateRoute>} />
        <Route path="/medico/nutriologia/evaluacion-nutricional" element={<PrivateRoute><EvaluacionNutricional /></PrivateRoute>} />
        <Route path="/medico/cuestionario-salud"               element={<PrivateRoute><EvaluacionNutricional /></PrivateRoute>} />

        <Route path="/psicologia"                              element={<PrivateRoute><PsicologiaInicio /></PrivateRoute>} />
        <Route path="/psicologia/paciente/:id/documentos"      element={<PrivateRoute><GestionDocumentosPsicologia /></PrivateRoute>} />
        <Route path="/psicologia/paciente/:id/notas-evolucion" element={<PrivateRoute><NotasEvolucionPsicologia /></PrivateRoute>} />

        <Route path="/financiero/archivo-contable"             element={<PrivateRoute><ArchivoContable /></PrivateRoute>} />
        <Route path="/financiero/digitalizar-comprobantes"     element={<PrivateRoute><DigitalizarComprobantes /></PrivateRoute>} />
        <Route path="/financiero/factura-electronica"          element={<PrivateRoute><FacturaElectronica /></PrivateRoute>} />
        <Route path="/financiero/comprobantes-fiscales"        element={<PrivateRoute><ComprobantesFiscales /></PrivateRoute>} />
        <Route path="/financiero/requisiciones-almacen"        element={<PrivateRoute><RequisicionesAlmacen /></PrivateRoute>} />
        <Route path="/financiero/gestionar-correcciones"       element={<PrivateRoute><GestionarCorreciones /></PrivateRoute>} />
        <Route path="/financiero/deposito-bancario"            element={<PrivateRoute><DepositoBancario /></PrivateRoute>} />

        <Route path='/rec-materiales/:rol' element={<PrivateRoute><RecMaterialesDashboard /></PrivateRoute>}>
          <Route index element={<ListaRequisiciones requisiciones={REQUISICIONES_COMPLETO}/>}/>
          <Route path='proveedores' element={<Proveedores/>}/>
          <Route path='historial' element={<Historial/>}/>
          <Route path='requisicion/:id' element={<DetallesRequisicion/>}/>
          <Route path='orden-compra/:id' element={<OrdenCompra/>}/>
        </Route>

        <Route path="/almacen" element={<PrivateRoute><AlmacenDashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <QuickNavigator />
    </BrowserRouter>
  );
}


export default App;