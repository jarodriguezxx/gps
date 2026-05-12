import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, RefreshCw, PackagePlus, Settings, X, ArrowLeft } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';
import { API_BASE } from '../../config/api';

const FarmaciaMedico = () => {
  const navigate = useNavigate();
  const [medicamentos, setMedicamentos] = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [modalRecibir, setModalRecibir] = useState(null);
  const [modalConfig, setModalConfig]   = useState(null);
  const [formRecibir, setFormRecibir]   = useState({ cantidadEmpaques: 1 });
  const [formConfig, setFormConfig]     = useState({ unidadesPorEmpaque: 1 });
  const [enviando, setEnviando]         = useState(false);
  const [error, setError]               = useState('');
  const [exito, setExito]               = useState('');

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${API_BASE}/enfermeria/medicamentos`);
      if (!res.ok) throw new Error();
      setMedicamentos(await res.json());
    } catch {
      setMedicamentos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const recibirMedicamento = async () => {
    setError('');
    if (formRecibir.cantidadEmpaques < 1) { setError('Ingresa al menos 1 empaque.'); return; }
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/enfermeria/recibir/${modalRecibir.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidadEmpaques: Number(formRecibir.cantidadEmpaques) }),
      });
      if (!res.ok) { setError(await res.text()); return; }
      const upe = modalRecibir.unidadesPorEmpaque || 1;
      setExito(`Se agregaron ${formRecibir.cantidadEmpaques * upe} unidades al stock de enfermería.`);
      setTimeout(() => setExito(''), 4000);
      setModalRecibir(null);
      cargar();
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  const guardarConfig = async () => {
    setError('');
    if (formConfig.unidadesPorEmpaque < 1) { setError('Debe ser al menos 1.'); return; }
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/enfermeria/medicamentos/${modalConfig.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unidadesPorEmpaque: Number(formConfig.unidadesPorEmpaque) }),
      });
      if (!res.ok) { setError(await res.text()); return; }
      setModalConfig(null);
      cargar();
    } catch {
      setError('Error al guardar configuración.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">

          {/* Header */}
          <header className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 bg-white">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Farmacia — Jefe Médico</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Gestión de medicamentos a enfermería</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/medico/inicio-jefe-medico')}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition"
            >
              <ArrowLeft size={15} /> Volver al inicio
            </button>
          </header>

          <div className="px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill size={18} className="text-[#7E1D3B]" />
                <h2 className="font-bold text-slate-800">Medicamentos (categoría MEDICO)</h2>
              </div>
              <button onClick={cargar} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition">
                <RefreshCw size={13} /> Actualizar
              </button>
            </div>

            {exito && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
                {exito}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {cargando ? (
                <div className="py-16 text-center text-slate-400 text-sm">Cargando...</div>
              ) : medicamentos.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm italic">
                  No hay medicamentos registrados con categoría MEDICO en inventario de almacén.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">Medicamento</th>
                      <th className="px-5 py-3 text-center">Stock almacén</th>
                      <th className="px-5 py-3 text-center">Stock enfermería</th>
                      <th className="px-5 py-3 text-center">Uds./empaque</th>
                      <th className="px-5 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {medicamentos.map(med => (
                      <tr key={med.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-semibold text-slate-800">{med.nombreArticulo}</td>
                        <td className="px-5 py-3 text-center text-slate-600 font-bold">{med.cantidadDisponible ?? 0}</td>
                        <td className="px-5 py-3 text-center">
                          <span className="text-lg font-black text-[#7E1D3B]">{med.stockEnfermeria ?? 0}</span>
                          <span className="text-xs text-slate-400 ml-1">{med.unidadMedida || 'uds.'}</span>
                        </td>
                        <td className="px-5 py-3 text-center text-slate-500">{med.unidadesPorEmpaque ?? '—'}</td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setModalConfig(med); setFormConfig({ unidadesPorEmpaque: med.unidadesPorEmpaque || 1 }); setError(''); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                            >
                              <Settings size={11} /> Config
                            </button>
                            <button
                              onClick={() => { setModalRecibir(med); setFormRecibir({ cantidadEmpaques: 1 }); setError(''); }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#7E1D3B] text-white hover:bg-[#63162e] transition"
                            >
                              <PackagePlus size={11} /> Recibir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <p className="text-xs text-slate-400 italic">
              Los medicamentos se agregan al inventario desde el módulo de Almacén con categoría "MEDICO".
              Aquí solo se gestiona el stock que se transfiere a enfermería y la cantidad de unidades por empaque.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Recibir medicamento */}
      {modalRecibir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Recibir de Almacén</h3>
              <button onClick={() => setModalRecibir(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <p className="text-sm text-slate-600 mb-1 font-semibold">{modalRecibir.nombreArticulo}</p>
            <p className="text-xs text-slate-400 mb-4">
              Factor de conversión: <b>{modalRecibir.unidadesPorEmpaque || 1}</b> unidades por empaque.
              {!modalRecibir.unidadesPorEmpaque && ' (Configura el factor primero para mayor precisión.)'}
            </p>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Empaques recibidos de Almacén</label>
            <input
              type="number" min={1}
              value={formRecibir.cantidadEmpaques}
              onChange={e => setFormRecibir({ cantidadEmpaques: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30"
            />
            <p className="text-xs text-emerald-600 mb-3">
              Se agregarán <b>{formRecibir.cantidadEmpaques * (modalRecibir.unidadesPorEmpaque || 1)}</b> unidades al stock de enfermería.
            </p>
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setModalRecibir(null)} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Cancelar</button>
              <button onClick={recibirMedicamento} disabled={enviando} className="flex-1 py-2 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold disabled:opacity-50">
                {enviando ? 'Guardando...' : 'Confirmar recepción'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar unidades por empaque */}
      {modalConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Configurar factor de conversión</h3>
              <button onClick={() => setModalConfig(null)}><X size={18} className="text-slate-400" /></button>
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">{modalConfig.nombreArticulo}</p>
            <p className="text-xs text-slate-400 mb-4">
              Define cuántas unidades de dispensación (ej. pastillas) contiene cada empaque de almacén (ej. caja).
            </p>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Unidades por empaque</label>
            <input
              type="number" min={1}
              value={formConfig.unidadesPorEmpaque}
              onChange={e => setFormConfig({ unidadesPorEmpaque: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30"
            />
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setModalConfig(null)} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">Cancelar</button>
              <button onClick={guardarConfig} disabled={enviando} className="flex-1 py-2 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold disabled:opacity-50">
                {enviando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmaciaMedico;
