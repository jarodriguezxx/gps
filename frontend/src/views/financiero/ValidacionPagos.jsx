import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, CircleDollarSign, FileCheck, FolderOpen, Landmark, PackageSearch, RefreshCw, Receipt, ScanLine, X, Clock } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';
import { API_BASE } from '../../config/api.ts';

const navItems = [
  { label: 'Archivo Contable', icon: FolderOpen, key: 'archivo', path: '/financiero/archivo-contable' },
  { label: 'Digitalizar Comprobantes', icon: ScanLine, key: 'digitalizar', path: '/financiero/digitalizar-comprobantes' },
  { label: 'Gestionar Correcciones', icon: AlertCircle, key: 'correcciones', path: '/financiero/gestionar-correcciones' },
  { label: 'Factura Electrónica', icon: Receipt, key: 'factura', path: '/financiero/factura-electronica' },
  { label: 'Comprobantes Fiscales', icon: FileCheck, key: 'comprobantes', path: '/financiero/comprobantes-fiscales' },
  { label: 'Requisiciones Almacén', icon: PackageSearch, key: 'requisiciones', path: '/financiero/requisiciones-almacen' },
  { label: 'Depósito Bancario', icon: Landmark, key: 'deposito', path: '/financiero/deposito-bancario' },
  { label: 'Validación de Pagos', icon: CircleDollarSign, key: 'validacion', path: '/financiero/validacion-pagos' },
];

const formatDate = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const formatDateOnlyEs = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date);
};

const getPacienteNombre = (paciente) => [
  paciente.nombres || paciente.nombreCompleto || '',
  paciente.apellidoPaterno || '',
  paciente.apellidoMaterno || '',
].join(' ').replace(/\s+/g, ' ').trim() || 'Sin nombre';

const ValidacionPagos = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('validacion');
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accionId, setAccionId] = useState(null);
  const [completado, setCompletado] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const loadPendientes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/pacientes/validacion-pagos`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'No fue posible cargar los pagos pendientes');
      }
      setPendientes(Array.isArray(data) ? data.filter((item) => !item.pagoValidado) : []);
      setLastUpdate(new Date());
      setError('');
    } catch (err) {
      setError(err.message || 'Error al cargar la validación de pagos. Intenta recargar.');
      console.error('Error loading pendientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendientes();
    if (!autoRefreshEnabled) return;
    
    const interval = window.setInterval(loadPendientes, 30000);
    return () => window.clearInterval(interval);
  }, [autoRefreshEnabled]);

  const pendientesCount = useMemo(() => pendientes.length, [pendientes]);

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    navigate(item.path);
  };

  const confirmarPago = async (pacienteId) => {
    setAccionId(pacienteId);
    try {
      const response = await fetch(`${API_BASE}/pacientes/${pacienteId}/validar-pago`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo validar el pago');
      }
      
      // Mostrar animación de completado
      setCompletado(pacienteId);
      setTimeout(() => {
        setCompletado(null);
        loadPendientes();
      }, 800);
      
      // Recargar lista
      setTimeout(loadPendientes, 1000);
    } catch (err) {
      setError(err.message || 'Error al validar el pago. Intenta nuevamente.');
      console.error('Error confirming pago:', err);
    } finally {
      setAccionId(null);
    }
  };

  const dismissError = () => setError('');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <style>{`
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
        @keyframes fadeInGreen {
          from { background-color: rgb(255 255 255); }
          to { background-color: rgb(236 253 245); }
        }
        .animate-slide-out {
          animation: slideOutRight 0.6s ease-in-out forwards;
        }
        .animate-success {
          animation: fadeInGreen 0.3s ease-in-out;
        }
      `}</style>
      
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="mb-5 rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black text-slate-800 md:text-2xl">Sistema de Gestión Marakame</h1>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Módulo Financiero</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10">
                <CircleDollarSign size={16} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Finanzas</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[240px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start sticky top-4">
              {navItems.map(({ label, icon, key, path }) => {
                const active = activeNav === key;
                const Icon = icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleNavClick({ key, path })}
                    className={`relative mb-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                        : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                    }`}
                  >
                    <span className="relative">
                      <Icon size={15} className="shrink-0" />
                      {key === 'validacion' && pendientesCount > 0 && (
                        <span className="absolute -right-2 -top-2 inline-flex h-3 w-3 animate-pulse rounded-full bg-rose-500 ring-2 ring-white" />
                      )}
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </aside>

            <main className="space-y-5">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Encabezado */}
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Validación de Pagos</h2>
                    <p className="text-sm text-slate-500">Pacientes con pagos pendientes de validación por Finanzas.</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-[#7E1D3B]/15 bg-[#7E1D3B]/5 px-4 py-2 text-sm font-bold text-[#7E1D3B]">
                      <span className={`h-2.5 w-2.5 rounded-full ${pendientesCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      {pendientesCount} pendiente{pendientesCount === 1 ? '' : 's'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      Ult. actualización: {lastUpdate.toLocaleTimeString('es-MX')}
                    </div>
                  </div>
                </div>

                {/* Banner de Error */}
                {error && (
                  <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">Error de conexión</p>
                      <p className="text-xs text-rose-600 mt-1">{error}</p>
                    </div>
                    <button type="button" onClick={dismissError} className="shrink-0 text-rose-600 hover:text-rose-800">
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Contenedor de Tabla Responsivo */}
                <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">ID Paciente</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500 min-w-[200px]">Nombre del Paciente</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">Folio Recibo</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">Fecha Solicitud</th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">Estado</th>
                        <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-[0.15em] text-slate-500 whitespace-nowrap">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {loading && pendientes.length === 0 ? (
                        <tr>
                          <td className="px-4 py-8 text-center text-slate-400" colSpan={6}>
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw size={16} className="animate-spin" />
                              Cargando registros...
                            </div>
                          </td>
                        </tr>
                      ) : pendientes.length === 0 ? (
                        <tr>
                          <td className="px-4 py-8 text-center text-slate-400" colSpan={6}>
                            <div className="flex flex-col items-center gap-2">
                              <CheckCircle2 size={24} className="text-emerald-500" />
                              <span>✓ No hay pagos pendientes por validar</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        pendientes.map((paciente) => {
                          const isCompleted = completado === paciente.id;
                          const isProcessing = accionId === paciente.id;
                          
                          return (
                            <tr
                              key={paciente.id}
                              className={`transition-all duration-500 ${
                                isCompleted
                                  ? 'animate-success border-l-4 border-emerald-500'
                                  : 'hover:bg-slate-50/70'
                              }`}
                            >
                              <td className="px-4 py-3 font-bold text-[#7E1D3B] whitespace-nowrap">{paciente.id}</td>
                              <td className="px-4 py-3 font-medium text-slate-700 truncate max-w-xs">{getPacienteNombre(paciente)}</td>
                              <td className="px-4 py-3 font-mono text-xs text-slate-600 bg-slate-50 rounded px-2 py-1 whitespace-nowrap">{paciente.folioRecibo || '--'}</td>
                              <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{formatDateOnlyEs(paciente.fechaRegistroRecibo || paciente.fechaIngreso)}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {isCompleted ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700 animate-in fade-in">
                                    <CheckCircle2 size={12} />
                                    Validado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-700">
                                    <Clock size={12} />
                                    Pendiente
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => confirmarPago(paciente.id)}
                                  disabled={isProcessing || isCompleted}
                                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition ${
                                    isCompleted
                                      ? 'bg-emerald-500 cursor-default'
                                      : 'bg-[#7E1D3B] hover:bg-[#63162e] disabled:cursor-not-allowed disabled:opacity-60'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <>
                                      <CheckCircle2 size={14} />
                                      Validado
                                    </>
                                  ) : isProcessing ? (
                                    <>
                                      <RefreshCw size={14} className="animate-spin" />
                                      Validando...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 size={14} />
                                      Confirmar
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pie de tabla */}
                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {pendientesCount === 0 ? 'Sistema sincronizado' : `${pendientesCount} registro${pendientesCount === 1 ? '' : 's'} esperando validación`}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={autoRefreshEnabled}
                        onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#7E1D3B]"
                      />
                      Actualización automática (30s)
                    </label>
                    <button
                      type="button"
                      onClick={loadPendientes}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    >
                      <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                      Recargar
                    </button>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ValidacionPagos;