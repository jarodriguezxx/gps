import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Stethoscope, Users, ClipboardList, Activity, FileBarChart, UserPlus,
  FileText, ArrowLeft, Save, ShoppingCart
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Historia Médica',       icon: FileText,       key: 'historia',    path: '/medico/historia-medica' },
  { label: 'Expedientes Clínicos',    icon: ClipboardList, key: 'expedientes',   path: '/medico/expedientes' },
  { label: 'Requisiciones',           icon: ShoppingCart,  key: 'requisiciones', path: '/medico/requisiciones' },
  { label: 'Personal Médico',         icon: Stethoscope,   key: 'personal',      path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart,  key: 'reportes',      path: '/medico/reportes' },
];

const NuevaEvolucion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [guardandoNota, setGuardandoNota] = useState(false);
  const [activeNav, setActiveNav] = useState('pacientes');

  const [formData, setFormData] = useState({
    noSesion: '', ta: '', temp: '', fc: '', fr: '', peso: '', talla: '',
    evolucion: '', exploracion: '', resultados: '', diagnostico: '',
    pronostico: '', tratamiento: '', observaciones: '', fechaProxima: '', cedula: ''
  });

  useEffect(() => {
    fetch(`http://localhost:4000/api/pacientes/${id}/expediente`)
      .then(res => res.json())
      .then(data => setPaciente(data.paciente))
      .catch(err => console.error(err));
  }, [id]);

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const guardarNota = async () => {
  if (!formData.evolucion.trim()) return alert("El campo de Evolución es obligatorio.");
  setGuardandoNota(true);

  // Mandamos los datos separados exactamente como los espera tu nueva entidad de Java
  const nuevaNota = {
    pacienteId: id, // Mandamos el ID del paciente para que Java busque su Expediente
    medicoAsignado: "Jefe Médico",
    ta: formData.ta,
    temp: formData.temp,
    fc: formData.fc,
    fr: formData.fr,
    peso: formData.peso,
    talla: formData.talla,
    evolucionCuadroClinico: formData.evolucion,
    exploracionFisica: formData.exploracion,
    resultadosEstudios: formData.resultados,
    diagnosticoProblemas: formData.diagnostico,
    pronosticos: formData.pronostico,
    tratamientoIndicaciones: formData.tratamiento,
    observaciones: formData.observaciones
  };

  try {
    const response = await fetch('http://localhost:4000/api/notas-evolucion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaNota)
    });

    if (response.ok) {
      alert("Nota guardada exitosamente.");
      navigate('/medico/pacientes'); 
    } else {
      const errorText = await response.text();
      alert("Error del servidor: " + errorText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión al guardar.");
  } finally {
    setGuardandoNota(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Stethoscope size={18} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Jefe Médico</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]' : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  {React.createElement(icon, { size: 16, className: 'shrink-0' })}
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            <main>
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-[#7E1D3B]" />
                    <div>
                      <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Nota de Evolución Médica</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Folio: MK-{id?.padStart(4, '0')} | {paciente?.nombreCompleto}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                    <ArrowLeft size={14} /> Volver
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-[11px] font-black text-[#7E1D3B] uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">Signos Vitales</h4>
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">No. Sesión</label>
                        <input type="text" name="noSesion" value={formData.noSesion} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm" placeholder="Ej. 1" />
                      </div>
                      {['ta', 'temp', 'fc', 'fr', 'peso', 'talla'].map(vital => (
                        <div key={vital}>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">{vital.replace('ta', 'T.A').replace('temp', 'Temp').replace('fc', 'F.C').replace('fr', 'F.R')}</label>
                          <input type="text" name={vital} value={formData[vital]} onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#7E1D3B]/30" placeholder="..." />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Evolución y Actualización del Cuadro Clínico *</label>
                      <textarea name="evolucion" value={formData.evolucion} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/30 min-h-[120px]"></textarea>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Exploración Física</label>
                      <textarea name="exploracion" value={formData.exploracion} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7E1D3B]/30 min-h-[80px]"></textarea>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Resultados de Estudios Auxiliares</label>
                      <textarea name="resultados" value={formData.resultados} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white min-h-[60px]"></textarea>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Diagnóstico o Problemas Clínicos</label>
                        <textarea name="diagnostico" value={formData.diagnostico} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white min-h-[80px]"></textarea>
                      </div>
                      <div>
                        <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Pronósticos</label>
                        <textarea name="pronostico" value={formData.pronostico} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white min-h-[80px]"></textarea>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Tratamiento e Indicaciones Médicas</label>
                      <textarea name="tratamiento" value={formData.tratamiento} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white min-h-[80px]"></textarea>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1 block">Observaciones</label>
                      <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-slate-50 focus:bg-white min-h-[60px]"></textarea>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 bg-slate-100 p-5 rounded-xl border border-slate-200">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha de la próxima sesión</label>
                      <input type="date" name="fechaProxima" value={formData.fechaProxima} onChange={handleInputChange} className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cédula Profesional</label>
                      <input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Ej. 12345678" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button onClick={guardarNota} disabled={guardandoNota} className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#7E1D3B] hover:bg-[#63162e] shadow-md flex items-center gap-2">
                      <Save size={18} /> {guardandoNota ? 'Guardando...' : 'Firmar y Guardar Nota'}
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

export default NuevaEvolucion;