import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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

import MedicoInicio from './views/Medico/Medico-inicio';
import EvaluacionNutricional from './views/Medico/Nutriologia/EvaluacionNutricional';
import InventarioPertenencias from './views/Medico/InventarioPertenencias';
import HistoriaMedica from './views/Medico/HistoriaMedica';
import NutriologiaInicio from './views/Nutriologia/Nutriologia-inicio';
import ExpedienteAdmisiones from './views/admisiones/ExpedienteAdmisiones';
import ExpedienteMedico from './views/Medico/ExpedienteMedico';
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
  { label: 'Historial Paciente', path: '/medico/historial-paciente' },
  { label: 'Nutriología', path: '/nutriologia' },
  { label: 'Evaluación Nutri', path: '/nutriologia/evaluacion-nutricional' },
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
  { label: 'Rec. Materiales', path: '/rec-materiales' },
  { label: 'Rec. Proveedores', path: '/rec-materiales/proveedores' },
  { label: 'Rec. Historial', path: '/rec-materiales/historial' },
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
        <Route path="/"                                        element={<Navigate to="/admisiones" replace />} />
        <Route path="/login"                                   element={<Login />} />
        <Route path="/admisiones"                              element={<AdmisionesInicio />} />
        <Route path="/admisiones/expediente"                   element={<ExpedienteAdmisiones />} />
        <Route path="/admisiones/estudio-socioeconomico"       element={<EstudioSocioeconomico />} />
        <Route path="/admisiones/valoracion-diagnostica"       element={<ValoracionDiagnostica />} />

        <Route path="/medico"                                  element={<MedicoInicio />} />
        <Route path="/medico/expediente"                       element={<ExpedienteMedico />} />
        <Route path="/medico/historia-medica"                  element={<HistoriaMedica />} />
        <Route path="/medico/inventario-pertenencias"          element={<InventarioPertenencias />} />
        <Route path="/rh/alta-personal"                        element={<AltaPersonal />} />
        <Route path="/rh/baja-personal"                        element={<BajaPersonal />} />
        <Route path="/rh/catalogo-roles"                       element={<CatalogoRoles />} />
        <Route path="/rh/asignacion-roles"                     element={<AsignacionRoles />} />

        <Route path="/medico/evaluacion-medica"                element={<EvaluacionEnfermeria />} />
        <Route path="/medico/protocolo-desintoxicacion"        element={<ProtocoloDesintoxicacion />} />
        <Route path="/medico/pacientes-activos"                element={<PacientesActivos />} />
        <Route path="/medico/historial-paciente"               element={<HistorialMedicoPaciente />} />

        <Route path="/nutriologia"                             element={<NutriologiaInicio />} />
        <Route path="/nutriologia/evaluacion-nutricional"      element={<EvaluacionNutricional />} />
        <Route path="/medico/nutriologia/evaluacion-nutricional" element={<EvaluacionNutricional />} />
        <Route path="/medico/cuestionario-salud"               element={<EvaluacionNutricional />} />

        <Route path="/financiero/archivo-contable"             element={<ArchivoContable />} />
        <Route path="/financiero/digitalizar-comprobantes"     element={<DigitalizarComprobantes />} />
        <Route path="/financiero/factura-electronica"          element={<FacturaElectronica />} />
        <Route path="/financiero/comprobantes-fiscales"        element={<ComprobantesFiscales />} />
        <Route path="/financiero/requisiciones-almacen"        element={<RequisicionesAlmacen />} />
        <Route path="/financiero/gestionar-correcciones"       element={<GestionarCorreciones />} />
        <Route path="/financiero/deposito-bancario"            element={<DepositoBancario />} />

        {/* Rutas para rec Materiales y compras e inventario*/}
        <Route path='/:rol' element = {<RecMaterialesDashboard/>}>

          {/* Estas son las rutas hijas  */}
          <Route index element={<ListaRequisiciones requisiciones={REQUISICIONES_COMPLETO}/>}/>
          <Route path='proveedores' element = {<Proveedores/>}/>
          <Route path='historial' element = {<Historial/>}/>
          <Route path='requisicion/:id' element={<DetallesRequisicion/>}/>
          <Route path='orden-compra/:id' element={<OrdenCompra/>}/>
        </Route>

        <Route path="*"                                        element={<Navigate to="/admisiones" replace />} />
      </Routes>
      <QuickNavigator />
    </BrowserRouter>
  );
}

export default App;