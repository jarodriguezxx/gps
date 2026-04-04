import React, { useState } from 'react';
import AdmisionesInicio from './views/Admisiones-inicio';
import Login from './views/login';
import ValoracionDiagnostica from './views/ValoracionDiagnostica';

function App() {
  const [currentView, setCurrentView] = useState('admisiones'); // 'login', 'admisiones', 'valoracion'

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login />;
      case 'admisiones':
        return <AdmisionesInicio />;
      case 'valoracion':
        return <ValoracionDiagnostica />;
      default:
        return <AdmisionesInicio />;
    }
  };

  // Dev buttons to switch views (remove in production)
  return (
    <div>
      {renderView()}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => setCurrentView('login')}
          className="rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
        >
          Login
        </button>
        <button
          onClick={() => setCurrentView('admisiones')}
          className="rounded bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-800"
        >
          Admisiones
        </button>
        <button
          onClick={() => setCurrentView('valoracion')}
          className="rounded bg-rose-700 px-3 py-1 text-xs text-white hover:bg-rose-800"
        >
          Valoración
        </button>
      </div>
    </div>
  );
}

export default App;