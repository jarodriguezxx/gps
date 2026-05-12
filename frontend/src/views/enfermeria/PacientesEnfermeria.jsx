import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, User } from 'lucide-react';
import { API_BASE } from '../../config/api';

const PacientesEnfermeria = () => {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${API_BASE}/pacientes`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const ingresados = data.filter(p =>
        (p.estadoPaciente || p.estado || '').toUpperCase() === 'INGRESADO'
      );
      setPacientes(ingresados);
    } catch {
      setPacientes([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-[#7E1D3B]" />
          <h2 className="text-lg font-bold text-slate-800">Pacientes Internados</h2>
        </div>
        <button onClick={cargar} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition">
          <RefreshCw size={13} /> Actualizar
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {cargando ? (
          <div className="py-16 text-center text-slate-400 text-sm">Cargando pacientes...</div>
        ) : pacientes.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm italic">No hay pacientes internados actualmente.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Paciente</th>
                <th className="px-5 py-3 text-left">No. Expediente</th>
                <th className="px-5 py-3 text-left">Habitación</th>
                <th className="px-5 py-3 text-left">Ingreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pacientes.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#7E1D3B]/10 flex items-center justify-center">
                        <User size={13} className="text-[#7E1D3B]" />
                      </div>
                      <span className="font-semibold text-slate-800">
                        {p.nombreCompleto ||
                          [p.nombre, p.apellidoPaterno, p.apellidoMaterno].filter(Boolean).join(' ') ||
                          'Sin nombre registrado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{p.numeroExpediente || `MK-${p.id}`}</td>
                  <td className="px-5 py-3 text-slate-500">{p.habitacion || '—'}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {p.fechaIngreso ? new Date(p.fechaIngreso).toLocaleDateString('es-MX') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PacientesEnfermeria;
