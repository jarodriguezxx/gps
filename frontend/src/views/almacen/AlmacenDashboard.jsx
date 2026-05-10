import React, { useState } from 'react';
import { Package, Undo2, CheckSquare, MonitorSmartphone, MapPin, Bell, Upload, ShoppingCart, ClipboardCheck, Inbox } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

// Importamos los componentes
import PanelGeneral from './PanelGeneral';
import Paso1Y2RecepcionVerificacion from './Paso1Y2RecepcionVerificacion';
import Paso3Devolucion from './Paso3Devolucion';
import Paso4ContraRecibo from './Paso4ContraRecibo';
import Paso5Ubicacion from './Paso5Ubicacion';
import Paso6Inventario from './Paso6Inventario';
import Paso7Notificacion from './Paso7Notificacion';
import Paso8Bajas from './Paso8Bajas';
import Paso9Requisicion from './Paso9Requisicion';
import PanelBandejaRequisiciones from './PanelBandejaRequisiciones';

const navItems = [
  { label: 'Panel General',           icon: Package,       key: 'dashboard',   section: 'General' },
  { label: 'Bandeja de Solicitudes',  icon: Inbox,         key: 'bandeja-req', section: 'General' },
  { label: '1. Recepción y Verificación', icon: ClipboardCheck, key: 'paso1', section: 'Procedimiento' },
  { label: '3. Devolución al Proveedor', icon: Undo2, key: 'paso3', section: 'Procedimiento' },
  { label: '4. Contra-recibo', icon: CheckSquare, key: 'paso4', section: 'Procedimiento' },
  { label: '5. Ubicar en Almacén', icon: MapPin, key: 'paso5', section: 'Procedimiento' },
  { label: '6. Inventario Maestro', icon: MonitorSmartphone, key: 'paso6', section: 'Procedimiento' },
  { label: '7. Notificar a Rec. Mat.', icon: Bell, key: 'paso7', section: 'Procedimiento' },
  { label: '8. Baja de Consumibles', icon: Upload, key: 'paso8', section: 'Procedimiento' },
  { label: '9. Generar Requisición', icon: ShoppingCart, key: 'paso9', section: 'Procedimiento' },
];

const AlmacenDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [articulosParaInventario, setArticulosParaInventario] = useState([]);
  const [recepcionActiva, setRecepcionActiva] = useState(null);
  const [datosIncidencia, setDatosIncidencia] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Almacén</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[240px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.filter(i => i.section === 'General').map(({ label, icon: Icon, key }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition mb-3 ${
                    activeTab === key ? 'bg-[#7E1D3B] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                  }`}>
                  <Icon size={18} /> {label}
                </button>
              ))}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-4">Procedimiento</p>
              {navItems.filter(i => i.section === 'Procedimiento').map(({ label, icon: Icon, key }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition mb-1 ${
                    activeTab === key ? 'bg-[#7E1D3B]/10 text-[#7E1D3B] border border-[#7E1D3B]/20' : 'text-slate-500 border border-transparent hover:bg-slate-50'
                  }`}>
                  <Icon size={16} /> {label}
                </button>
              ))}
            </aside>

            <main>
              {activeTab === 'dashboard'   && <PanelGeneral setActiveTab={setActiveTab} />}
              {activeTab === 'bandeja-req' && <PanelBandejaRequisiciones />}
              
              {activeTab === 'paso1' && (
                <Paso1Y2RecepcionVerificacion 
                  setActiveTab={setActiveTab} 
                  setRecepcionActiva={setRecepcionActiva} 
                  setArticulosParaInventario={setArticulosParaInventario}
                  setDatosIncidencia={setDatosIncidencia}
                />
              )}
      
              {activeTab === 'paso3' && (
                <Paso3Devolucion 
                  setActiveTab={setActiveTab} 
                  recepcionActiva={recepcionActiva}
                  datosIncidencia={datosIncidencia}
                />
              )}

              {activeTab === 'paso4' && (
                <Paso4ContraRecibo 
                  setActiveTab={setActiveTab} 
                  recepcionActiva={recepcionActiva} 
                  articulosParaInventario={articulosParaInventario}
                />
              )}

              {activeTab === 'paso5' && <Paso5Ubicacion setActiveTab={setActiveTab} />} 
              {activeTab === 'paso6' && <Paso6Inventario setActiveTab={setActiveTab} />} 

              {activeTab === 'paso7' && (
                <Paso7Notificacion 
                  setActiveTab={setActiveTab} 
                  recepcionActiva={recepcionActiva} 
                  articulosParaInventario={articulosParaInventario}
                />
              )}

              {activeTab === 'paso8' && <Paso8Bajas setActiveTab={setActiveTab} />} 
              {activeTab === 'paso9' && <Paso9Requisicion setActiveTab={setActiveTab} />}
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default AlmacenDashboard;