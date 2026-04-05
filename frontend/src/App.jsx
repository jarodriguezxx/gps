import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdmisionesInicio from './views/admisiones/Admisiones-inicio';
import Login from './views/login';
import ValoracionDiagnostica from './views/admisiones/ValoracionDiagnostica';
import EstudioSocioeconomico from './views/admisiones/EstudioSocioeconomico';

const quickViews = [
  { label: 'Login', path: '/login', tone: 'slate' },
  { label: 'Admisiones', path: '/admisiones', tone: 'slate' },
  { label: 'Estudio', path: '/admisiones/estudio-socioeconomico', tone: 'rose' },
  { label: 'Valoración', path: '/admisiones/valoracion-diagnostica', tone: 'rose' },
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
        <Route path="/" element={<Navigate to="/admisiones" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admisiones" element={<AdmisionesInicio />} />
        <Route path="/admisiones/estudio-socioeconomico" element={<EstudioSocioeconomico />} />
        <Route path="/admisiones/valoracion-diagnostica" element={<ValoracionDiagnostica />} />
        <Route path="*" element={<Navigate to="/admisiones" replace />} />
      </Routes>
      <QuickNavigator />
    </BrowserRouter>
  );
}

export default App;