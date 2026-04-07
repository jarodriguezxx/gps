import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdmisionesInicio from './views/admisiones/Admisiones-inicio';
import Login from './views/login';
import ValoracionDiagnostica from './views/admisiones/ValoracionDiagnostica';
import EstudioSocioeconomico from './views/admisiones/EstudioSocioeconomico';
import AltaPersonal from './views/rh/AltaPersonal';
import BajaPersonal from './views/rh/BajaPersonal';
import CatalogoRoles from './views/rh/CatalogoRoles';
import AsignacionRoles from './views/rh/AsignacionRoles';

import MedicoInicio from './views/Medico/Medico-inicio';
import InventarioPertenencias from './views/Medico/InventarioPertenencias';
import HistoriaMedica from './views/Medico/HistoriaMedica';
import ExpedienteAdmisiones from './views/admisiones/ExpedienteAdmisiones';
import ExpedienteMedico from './views/Medico/ExpedienteMedico';
// Importaciones para Recursos Materiales
import RecMaterialesDashboard from './views/rec-materiales/Dashboard';
import Proveedores from './views/rec-materiales/Proveedores';
import ListaRequisiciones from './views/rec-materiales/ListaRequisiciones';
import Historial from './views/rec-materiales/Historial';


const quickViews = [
  { label: 'Login', path: '/login', tone: 'slate' },
  { label: 'Admisiones', path: '/admisiones', tone: 'slate' },
  { label: 'Médico', path: '/medico', tone: 'rose' },
  { label: 'Historia', path: '/medico/historia-medica', tone: 'rose' },
  { label: 'Inventario', path: '/medico/inventario-pertenencias', tone: 'rose' },
  { label: 'Exp. Admisiones', path: '/admisiones/expediente', tone: 'rose' },
  { label: 'Exp. Médico', path: '/medico/expediente', tone: 'rose' },
  { label: 'Estudio', path: '/admisiones/estudio-socioeconomico', tone: 'rose' },
  { label: 'Valoración', path: '/admisiones/valoracion-diagnostica', tone: 'rose' },
  { label: 'RecMateriales', path: '/rec-materiales', tone: 'rose' },

  { label: 'RH - Alta', path: '/rh/alta-personal', tone: 'slate' },
  { label: 'RH - Baja', path: '/rh/baja-personal', tone: 'slate' },
  { label: 'RH - Catalogos Roles', path: '/rh/catalogo-roles', tone: 'slate' },
  { label: 'RH - Asignacion Roles', path: '/rh/asignacion-roles', tone: 'slate' },

];

const QuickNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[210px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.14)] backdrop-blur">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Vistas rápidas</p>
      <div className="grid gap-2">
        {quickViews.map((view) => {
          const active = location.pathname === view.path;
          return (
            <button
              key={view.path}
              onClick={() => navigate(view.path)}
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
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas para admisiones */}
        <Route path="/" element={<Navigate to="/admisiones" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admisiones" element={<AdmisionesInicio />} />
        <Route path="/admisiones/expediente" element={<ExpedienteAdmisiones />} />
        <Route path="/admisiones/estudio-socioeconomico" element={<EstudioSocioeconomico />} />
        <Route path="/admisiones/valoracion-diagnostica" element={<ValoracionDiagnostica />} />
        <Route path="/medico" element={<MedicoInicio />} />
        <Route path="/medico/expediente" element={<ExpedienteMedico />} />
        <Route path="/medico/historia-medica" element={<HistoriaMedica />} />
        <Route path="/medico/inventario-pertenencias" element={<InventarioPertenencias />} />

        <Route path="/rh/alta-personal" element={<AltaPersonal />} />
        <Route path="/rh/baja-personal" element={<BajaPersonal />} />
        <Route path="/rh/catalogo-roles" element={<CatalogoRoles />} />
        <Route path="/rh/asignacion-roles" element={<AsignacionRoles />} />

        <Route path="*" element={<Navigate to="/admisiones" replace />} />

        {/* Rutas para rec Materiales */}
        <Route path='/rec-materiales' element = {<RecMaterialesDashboard/>}>

          {/* Estas son las rutas hijas  */}
          <Route index element={<ListaRequisiciones/>}/>
          <Route path='proveedores' element = {<Proveedores/>}/>
          <Route path='historial' element = {<Historial/>}/>
        </Route>
      </Routes>
      <QuickNavigator />
    </BrowserRouter>
  );
}

export default App;