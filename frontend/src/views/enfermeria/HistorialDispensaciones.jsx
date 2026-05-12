import React, { useState, useEffect } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { API_BASE } from '../../config/api';

const HistorialDispensaciones = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando]   = useState(true);

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${API_BASE}/enfermeria/historial`);
      if (!res.ok) throw new Error();
      setHistorial(await res.json());
    } catch {
      setHistorial([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const fmt = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={20} className="text-[#7E1D3B]" />
          <h2 className="text-lg font-bold text-slate-800">Historial de Dispensaciones</h2>
        </div>
        <button onClick={cargar} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition">
          <RefreshCw size={13} /> Actualizar
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="py-16 text-center text-slate-400 text-sm">Cargando historial...</div>
        ) : historial.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm italic">Sin registros aún.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Fecha y hora</th>
                <th className="px-5 py-3 text-left">Medicamento</th>
                <th className="px-5 py-3 text-left">Paciente</th>
                <th className="px-5 py-3 text-center">Cant.</th>
                <th className="px-5 py-3 text-left">Enfermero(a)</th>
                <th className="px-5 py-3 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {historial.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap text-xs">{fmt(d.fechaHora)}</td>
                  <td className="px-5 py-3 font-semibold text-slate-800">{d.medicamentoNombre}</td>
                  <td className="px-5 py-3 text-slate-700">{d.pacienteNombre || `Paciente #${d.pacienteId}`}</td>
                  <td className="px-5 py-3 text-center font-bold text-[#7E1D3B]">{d.cantidad}</td>
                  <td className="px-5 py-3 text-slate-500">{d.enfermero || '—'}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs italic">{d.observaciones || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistorialDispensaciones;
