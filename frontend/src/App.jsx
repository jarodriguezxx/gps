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

const quickViews = [
  { label: 'Login',                              path: '/login' },
  { label: 'Admisiones',                         path: '/admisiones' },
  { label: 'Estudio',                            path: '/admisiones/estudio-socioeconomico' },
  { label: 'Valoración',                         path: '/admisiones/valoracion-diagnostica' },
  { label: 'RH - Alta',                          path: '/rh/alta-personal' },
  { label: 'RH - Baja',                          path: '/rh/baja-personal' },
  { label: 'RH - Catálogo Roles',                path: '/rh/catalogo-roles' },
  { label: 'RH - Asignación Roles',              path: '/rh/asignacion-roles' },
  { label: 'Médico - Evaluación Enfermería',     path: '/medico/evaluacion-medica' },
  { label: 'Médico - Protocolo Desintoxicación', path: '/medico/protocolo-desintoxicacion' },
  { label: 'Médico - Pacientes Activos',         path: '/medico/pacientes-activos' },
  { label: 'Médico - Historial Médico',          path: '/medico/historial-paciente' },
  { label: 'Financiero - Archivo Contable',      path: '/financiero/archivo-contable' },
  { label: 'Financiero - Digitalizar Comprobantes',      path: '/financiero/digitalizar-comprobantes' },
  { label: 'Financiero - Gestionar Correciones',      path: '/financiero/gestionar-correcciones' },
  { label: 'Financiero - Factura Electronica',      path: '/financiero/factura-electronica' },
  { label: 'Financiero - Comprobantes Fiscales',      path: '/financiero/comprobantes-fiscales' },
  { label: 'Financiero - Requisiciones Almacen',      path: '/financiero/requisiciones-almacen' },
  { label: 'Financiero - Deposito Bancario',      path: '/financiero/deposito-bancario' }
];

const QuickNavigator = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [abierto, setAbierto] = useState(false);

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
            {quickViews.map((view) => {
              const active = location.pathname === view.path;
              return (
                <button
                  key={view.path}
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
        <Route path="/admisiones/estudio-socioeconomico"       element={<EstudioSocioeconomico />} />
        <Route path="/admisiones/valoracion-diagnostica"       element={<ValoracionDiagnostica />} />
        <Route path="/rh/alta-personal"                        element={<AltaPersonal />} />
        <Route path="/rh/baja-personal"                        element={<BajaPersonal />} />
        <Route path="/rh/catalogo-roles"                       element={<CatalogoRoles />} />
        <Route path="/rh/asignacion-roles"                     element={<AsignacionRoles />} />
        <Route path="/medico/evaluacion-medica"                element={<EvaluacionEnfermeria />} />
        <Route path="/medico/protocolo-desintoxicacion"        element={<ProtocoloDesintoxicacion />} />
        <Route path="/medico/pacientes-activos"                element={<PacientesActivos />} />
        <Route path="/medico/historial-paciente"               element={<HistorialMedicoPaciente />} />
        <Route path="/financiero/archivo-contable"             element={<ArchivoContable />} />
        <Route path="/financiero/digitalizar-comprobantes" element={<DigitalizarComprobantes />} />
        <Route path="/financiero/factura-electronica" element={<FacturaElectronica />} />
        <Route path="/financiero/comprobantes-fiscales" element={<ComprobantesFiscales />} />
        <Route path="/financiero/requisiciones-almacen" element={<RequisicionesAlmacen />} />
        <Route path="/financiero/gestionar-correcciones" element={<GestionarCorreciones />} />
        <Route path="/financiero/deposito-bancario" element={<DepositoBancario />} />
        <Route path="*"                                        element={<Navigate to="/admisiones" replace />} />
      </Routes>
      <QuickNavigator />
    </BrowserRouter>
  );
}

export default App;