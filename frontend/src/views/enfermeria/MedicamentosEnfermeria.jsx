import React, { useState, useEffect } from 'react';
import { Pill, RefreshCw, Send, X, AlertTriangle } from 'lucide-react';
import { API_BASE } from '../../config/api';

const MedicamentosEnfermeria = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [pacientes, setPacientes]       = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [modal, setModal]               = useState(null); // { medicamento }
  const [form, setForm]                 = useState({ pacienteId: '', cantidad: 1, observaciones: '' });
  const [enviando, setEnviando]         = useState(false);
  const [error, setError]               = useState('');

  const getSesion = () => {
    try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
  };

  const cargarMedicamentos = async () => {
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

  const cargarPacientes = async () => {
    try {
      const res = await fetch(`${API_BASE}/pacientes`);
      if (!res.ok) return;
      const data = await res.json();
      setPacientes(data.filter(p =>
        (p.estadoPaciente || p.estado || '').toUpperCase() === 'INGRESADO'
      ));
    } catch { /* silencioso */ }
  };

  useEffect(() => {
    cargarMedicamentos();
    cargarPacientes();
  }, []);

  const abrirModal = (med) => {
    setModal(med);
    setForm({ pacienteId: '', cantidad: 1, observaciones: '' });
    setError('');
  };

  const dispensar = async () => {
    if (!form.pacienteId) { setError('Selecciona un paciente.'); return; }
    if (form.cantidad < 1) { setError('La cantidad debe ser al menos 1.'); return; }

    const sesion    = getSesion();
    const paciente  = pacientes.find(p => String(p.id) === String(form.pacienteId));

    setEnviando(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/enfermeria/dispensar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventarioId:   modal.id,
          pacienteId:     Number(form.pacienteId),
          pacienteNombre: paciente
            ? paciente.nombreCompleto ||
              [paciente.nombre, paciente.apellidoPaterno, paciente.apellidoMaterno].filter(Boolean).join(' ')
            : '',
          cantidad:       Number(form.cantidad),
          enfermero:      sesion.nombreCompleto || sesion.username || 'Enfermero',
          observaciones:  form.observaciones,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || 'Error al dispensar.');
        return;
      }

      setModal(null);
      cargarMedicamentos();
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  const stockBajo = (med) => {
    const min = med.nivelMinimoAlerta ?? 5;
    return (med.stockEnfermeria ?? 0) <= min;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill size={20} className="text-[#7E1D3B]" />
          <h2 className="text-lg font-bold text-slate-800">Medicamentos en Enfermería</h2>
        </div>
        <button onClick={cargarMedicamentos} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition">
          <RefreshCw size={13} /> Actualizar
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="py-16 text-center text-slate-400 text-sm">Cargando medicamentos...</div>
        ) : medicamentos.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm italic">
            No hay medicamentos registrados con categoría MEDICO.<br />
            El encargado de almacén debe registrar los medicamentos con esa categoría.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Medicamento</th>
                <th className="px-5 py-3 text-center">Stock enfermería</th>
                <th className="px-5 py-3 text-center">Unidad</th>
                <th className="px-5 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {medicamentos.map(med => {
                const stock = med.stockEnfermeria ?? 0;
                const bajo  = stockBajo(med);
                return (
                  <tr key={med.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      {med.nombreArticulo}
                      {bajo && (
                        <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                          <AlertTriangle size={9} /> Stock bajo
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xl font-black ${bajo ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {stock}
                      </span>
                      <span className="ml-1 text-xs text-slate-400">{med.unidadMinima || med.unidadMedida || 'uds.'}</span>
                    </td>
                    <td className="px-5 py-3 text-center text-slate-500">
                      {med.unidadMinima ? `${med.unidadMinima} (${med.unidadMedida || 'empaque'})` : med.unidadMedida || '—'}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => abrirModal(med)}
                        disabled={stock === 0}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#7E1D3B] text-white hover:bg-[#63162e] transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send size={11} /> Dispensar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de dispensación */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Dispensar medicamento</h3>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Medicamento</p>
              <p className="font-bold text-slate-800">{modal.nombreArticulo}</p>
              <p className="text-xs text-slate-500 mt-1">
                Stock disponible: <span className="font-bold text-emerald-600">{modal.stockEnfermeria ?? 0}</span>{' '}
                {modal.unidadMinima || modal.unidadMedida || 'unidades'}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Paciente</label>
                <select
                  value={form.pacienteId}
                  onChange={e => setForm(f => ({ ...f, pacienteId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30"
                >
                  <option value="">Seleccionar paciente...</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nombreCompleto ||
                        [p.nombre, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(' ') ||
                        `Paciente MK-${p.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad a dispensar</label>
                <input
                  type="number"
                  min={1}
                  max={modal.stockEnfermeria ?? 1}
                  value={form.cantidad}
                  onChange={e => setForm(f => ({ ...f, cantidad: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Observaciones (opcional)</label>
                <textarea
                  value={form.observaciones}
                  onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
                  rows={2}
                  placeholder="Dosis, horario, indicación especial..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={dispensar}
                disabled={enviando}
                className="flex-1 py-2 rounded-xl bg-[#7E1D3B] text-white text-sm font-bold hover:bg-[#63162e] transition disabled:opacity-50"
              >
                {enviando ? 'Registrando...' : 'Confirmar dispensación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicamentosEnfermeria;
