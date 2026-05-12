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

const getPacienteNombre = (paciente) => {
  const nombre = [
    paciente.nombres || paciente.nombreCompleto || '',
    paciente.apellidoPaterno || '',
    paciente.apellidoMaterno || '',
  ].join(' ').replace(/\s+/g, ' ').trim() || 'Sin nombre';
  return nombre.replace(/\b\w/g, (c) => c.toUpperCase());
};

const getFolioCorto = (folio) => {
  if (!folio) return '--';
  const partes = folio.split('-');
  if (partes.length >= 3) return `${partes[0]}-${partes[1]}`;
  return folio;
};

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
                <p className="font-semibold text-slate-700">{JSON.parse(localStorage.getItem('marakame_user')||'{}').nombreCompleto||'Usuario'}</p>
                <p className="text-xs text-slate-500">{JSON.parse(localStorage.getItem('marakame_user')||'{}').puesto||'Sin puesto'}</p>
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
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* ── Encabezado de sección ── */}
                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Validación de Pagos</h2>
                    <p className="mt-0.5 text-sm text-slate-400">Pagos pendientes de confirmación por el área de Finanzas.</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold ${
                      pendientesCount > 0
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${pendientesCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                      {pendientesCount > 0 ? `${pendientesCount} pendiente${pendientesCount === 1 ? '' : 's'}` : 'Sin pendientes'}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={11} />
                      Actualizado: {lastUpdate.toLocaleTimeString('es-MX')}
                    </div>
                  </div>
                </div>

                {/* ── Banner de Error ── */}
                {error && (
                  <div className="mx-6 mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">Error de conexión</p>
                      <p className="mt-0.5 text-xs text-rose-600">{error}</p>
                    </div>
                    <button type="button" onClick={dismissError} className="shrink-0 text-rose-400 hover:text-rose-700 transition">
                      <X size={15} />
                    </button>
                  </div>
                )}

                {/* ── Tabla ── */}
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="w-20 px-6 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">#</th>
                        <th className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Paciente</th>
                        <th className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Folio</th>
                        <th className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Fecha</th>
                        <th className="px-4 py-3.5 text-center text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Estado</th>
                        <th className="px-6 py-3.5 text-right text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && pendientes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3 text-slate-400">
                              <RefreshCw size={22} className="animate-spin text-[#7E1D3B]/40" />
                              <span className="text-sm font-medium">Cargando registros...</span>
                            </div>
                          </td>
                        </tr>
                      ) : pendientes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                <CheckCircle2 size={22} className="text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-600">Todo validado</p>
                                <p className="text-xs text-slate-400">No hay pagos pendientes por validar</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        pendientes.map((paciente, idx) => {
                          const isCompleted  = completado === paciente.id;
                          const isProcessing = accionId  === paciente.id;
                          return (
                            <tr
                              key={paciente.id}
                              className={`border-b border-slate-100 transition-all duration-500 ${
                                isCompleted
                                  ? 'bg-emerald-50 animate-success'
                                  : idx % 2 === 0 ? 'bg-white hover:bg-[#7E1D3B]/[0.025]' : 'bg-slate-50/60 hover:bg-[#7E1D3B]/[0.025]'
                              }`}
                            >
                              {/* ID */}
                              <td className="px-6 py-4">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#7E1D3B]/8 text-xs font-black text-[#7E1D3B]">
                                  {paciente.id}
                                </span>
                              </td>

                              {/* Nombre */}
                              <td className="px-4 py-4">
                                <p className="font-semibold text-slate-800">{getPacienteNombre(paciente)}</p>
                              </td>

                              {/* Folio */}
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-block rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                                    {getFolioCorto(paciente.folioRecibo)}
                                  </span>
                                  {paciente.folioRecibo && paciente.folioRecibo.split('-').length > 2 && (
                                    <span className="ml-0.5 text-[10px] text-slate-300 font-mono">
                                      {paciente.folioRecibo.split('-').slice(2).join('-').substring(0, 10)}…
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Fecha */}
                              <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                                {formatDateOnlyEs(paciente.fechaRegistroRecibo || paciente.fechaIngreso)}
                              </td>

                              {/* Estado */}
                              <td className="px-4 py-4 text-center">
                                {isCompleted ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                                    <CheckCircle2 size={11} />
                                    Validado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                                    <Clock size={11} />
                                    Pendiente
                                  </span>
                                )}
                              </td>

                              {/* Acción */}
                              <td className="px-6 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => confirmarPago(paciente.id)}
                                  disabled={isProcessing || isCompleted}
                                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all ${
                                    isCompleted
                                      ? 'bg-emerald-500 cursor-default'
                                      : 'bg-[#7E1D3B] hover:bg-[#63162e] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <><CheckCircle2 size={13} /> Validado</>
                                  ) : isProcessing ? (
                                    <><RefreshCw size={13} className="animate-spin" /> Validando...</>
                                  ) : (
                                    <><CheckCircle2 size={13} /> Confirmar</>
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

                {/* ── Pie ── */}
                <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className={`h-2 w-2 rounded-full ${pendientesCount === 0 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    {pendientesCount === 0
                      ? 'Todos los pagos están validados'
                      : `${pendientesCount} registro${pendientesCount === 1 ? '' : 's'} esperando validación`}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-500">
                      <input
                        type="checkbox"
                        checked={autoRefreshEnabled}
                        onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-slate-300 accent-[#7E1D3B]"
                      />
                      Auto-actualizar (30s)
                    </label>
                    <button
                      type="button"
                      onClick={loadPendientes}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    >
                      <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
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