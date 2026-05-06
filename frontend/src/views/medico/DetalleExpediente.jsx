import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HeartPulse, Clipboard, CheckCircle2, FileText, 
  ArrowLeft, Activity, History as HistoryIcon, Stethoscope,
  Download, AlertTriangle, Users, ClipboardList, FileBarChart, 
  UserPlus, Calendar, Phone, Droplet, FilePlus, X
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import marakameLogo from '../../assets/marakame.jpeg'; 

// Menú de navegación lateral unificado
const navItems = [
  { label: 'Inicio Jefatura',       icon: Activity,       key: 'inicio',      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',            icon: UserPlus,       key: 'prospectos',  path: '/medico/prospectos' },
  { label: 'Pacientes Activos',     icon: Users,          key: 'pacientes',   path: '/medico/pacientes' },
  { label: 'Historia Médica',       icon: FileText,       key: 'historia',    path: '/medico/historia-medica' },
  { label: 'Expedientes Clínicos',  icon: ClipboardList,  key: 'expedientes', path: '/medico/expedientes' },
  { label: 'Personal Médico',       icon: Stethoscope,    key: 'personal',    path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart, key: 'reportes',    path: '/medico/reportes' },
];

const DetalleExpediente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [valoracion, setValoracion] = useState(null);
  const [historiaMedica, setHistoriaMedica] = useState(null); 
  const [notasEvolucion, setNotasEvolucion] = useState([]); // <-- Nuevo estado para notas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pestañaActiva, setPestañaActiva] = useState('historial');
  const [activeNav, setActiveNav] = useState('expedientes'); 

  // Estados para el Modal de Nueva Nota
  const [modalAbierto, setModalAbierto] = useState(false);
  const [textoEvolucion, setTextoEvolucion] = useState('');
  const [guardandoNota, setGuardandoNota] = useState(false);

  const fetchExpediente = async () => {
    try {
      setLoading(true);
      // Cargar Datos Generales del Paciente
      const response = await fetch(`http://localhost:4000/api/pacientes/${id}/expediente`);
      if (!response.ok) throw new Error('Expediente no encontrado.');
      setData(await response.json());
      setError(null);

      // Cargar Valoración
      try {
        const valRes = await fetch(`http://localhost:4000/api/valoraciones/paciente/${id}`);
        if (valRes.ok) setValoracion(await valRes.json());
      } catch (err) {}

      // Cargar Historia Médica
      try {
        const histRes = await fetch(`http://localhost:4000/api/historia-medica/paciente/${id}`);
        if (histRes.ok) setHistoriaMedica(await histRes.json());
      } catch (err) {}

      // Cargar Notas de Evolución (¡LA INTEGRACIÓN FALTANTE!)
      try {
        const notasRes = await fetch(`http://localhost:4000/api/notas-evolucion/paciente/${id}`);
        if (notasRes.ok) setNotasEvolucion(await notasRes.json());
      } catch (err) {}

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchExpediente(); }, [id]);

  const handleNavClick = (item) => { 
    setActiveNav(item.key); 
    navigate(item.path); 
  };

  // Función para guardar nota desde el expediente
  const guardarNota = async () => {
    if (!textoEvolucion.trim()) return alert("La nota no puede estar vacía");
    setGuardandoNota(true);

    const nuevaNota = {
      pacienteId: id,
      medicoAsignado: "Jefe Médico",
      evolucionCuadroClinico: textoEvolucion
    };

    try {
      const response = await fetch('http://localhost:4000/api/notas-evolucion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaNota)
      });

      if (response.ok) {
        const notaGuardada = await response.json();
        setNotasEvolucion([notaGuardada, ...notasEvolucion]); // Actualiza la lista al instante
        setModalAbierto(false);
        setTextoEvolucion('');
      } else {
        alert("Error al guardar la nota");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setGuardandoNota(false);
    }
  };

  const descargarHistoriaMedicaPDF = () => {
    // Código de descarga PDF original...
    if (!historiaMedica || !historiaMedica.datosClinicosJson) return;
    const formData = JSON.parse(historiaMedica.datosClinicosJson);
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 30px; font-size: 11px; color: #333;">
        <table style="width: 100%; border-bottom: 2px solid #7E1D3B; padding-bottom: 10px; margin-bottom: 20px;">
          <tr>
            <td style="width: 20%;"><h1 style="color: #7E1D3B; font-size: 18px; margin: 0;">MARAKAME</h1></td>
            <td style="width: 60%; text-align: center;">
              <h2 style="margin: 0; font-size: 16px;">HISTORIA MÉDICA INTEGRAL</h2>
              <p style="margin: 3px 0 0 0; color: #666;">Sistema de Gestión Clínica</p>
            </td>
            <td style="width: 20%; text-align: right; font-weight: bold;">Fecha: ${formData.datosGenerales.fecha}<br>Expediente: ${formData.datosGenerales.expediente}</td>
          </tr>
        </table>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
          <table style="width: 100%; line-height: 1.8;">
            <tr><td colspan="2"><strong>Nombre:</strong> ${formData.datosGenerales.nombre}</td></tr>
            <tr>
              <td style="width: 50%;"><strong>Edad:</strong> ${formData.datosGenerales.edad} años | <strong>Sexo:</strong> ${formData.datosGenerales.sexo}</td>
              <td style="width: 50%;"><strong>Estado Civil:</strong> ${formData.datosGenerales.estadoCivil}</td>
            </tr>
          </table>
        </div>
        <h3 style="background-color: #7E1D3B; color: white; padding: 5px 10px; font-size: 12px; margin-bottom: 10px;">1. HISTORIA DE CONSUMO</h3>
        <p style="border: 1px solid #e2e8f0; padding: 10px; min-height: 50px;">${formData.historiaConsumo || 'Sin datos registrados.'}</p>
        <h3 style="background-color: #7E1D3B; color: white; padding: 5px 10px; font-size: 12px; margin-bottom: 10px; margin-top: 20px;">2. DIAGNÓSTICO Y PLAN</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="border: 1px solid #e2e8f0; padding: 8px; background-color: #fef2f2; color: #7E1D3B; font-weight: bold;">Diagnóstico Principal</td></tr>
          <tr><td style="border: 1px solid #e2e8f0; padding: 10px; font-size: 13px;">${formData.diagnostico.dx1 || 'Sin diagnóstico capturado.'}</td></tr>
          <tr><td style="border: 1px solid #e2e8f0; padding: 8px; font-weight: bold; background-color: #f8fafc;">Plan y Recomendaciones</td></tr>
          <tr><td style="border: 1px solid #e2e8f0; padding: 10px;">${formData.diagnostico.plan1 || 'Sin recomendaciones.'}</td></tr>
        </table>
        <div style="margin-top: 60px; text-align: center; width: 100%;">
          <div style="width: 250px; border-top: 1px solid #000; margin: 0 auto; padding-top: 5px;">
            <strong>MÉDICO TRATANTE</strong><br>${formData.diagnostico.firmaMedico || 'Jefe Médico'}<br>Cédula: ${formData.diagnostico.cedula || 'N/D'}
          </div>
        </div>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = html;
    html2pdf().set({
      margin: 10,
      filename: `HistoriaMedica_MK_${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'letter' }
    }).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* Header Principal */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Clínica</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Jefatura Médica</p>
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
            {/* Sidebar */}
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

            {/* Contenido Principal */}
            <main className="space-y-5">
              {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center text-slate-500 text-sm">
                  <div className="animate-spin h-8 w-8 border-4 border-[#7E1D3B] border-t-transparent rounded-full mx-auto mb-4"></div>
                  Accediendo al archivo clínico...
                </div>
              ) : error ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-red-500 font-bold">
                  <AlertTriangle size={32} className="mx-auto mb-3" />
                  {error}
                </div>
              ) : (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Encabezado del Tablero de Expediente */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1.5 rounded-full bg-[#7E1D3B]" />
                      <div>
                        <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-800">
                          Expediente: <span className="text-[#7E1D3B]">MK-{id.toString().padStart(4, '0')}</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Modo de visualización y descarga de documentos</p>
                      </div>
                    </div>
                    <button onClick={() => navigate(-1)} className="px-4 py-2 mt-4 md:mt-0 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#7E1D3B] transition-colors flex items-center gap-2 shadow-sm">
                      <ArrowLeft size={14} /> Volver
                    </button>
                  </div>

                  {/* Ficha Principal del Paciente */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-[#7E1D3B] flex items-center justify-center text-white font-black text-3xl shadow-md border-2 border-rose-100">
                          {data?.paciente?.nombreCompleto?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-800 tracking-tight">
                            {data?.paciente?.nombreCompleto || 'Sin nombre registrado'}
                          </h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                              <Calendar size={12}/> {data?.paciente?.edad ? `${data?.paciente?.edad} AÑOS` : 'N/D'}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                              {data?.paciente?.estadoCivil || 'S/E'} • {data?.paciente?.sexo || 'S/E'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none bg-amber-50 border border-amber-200 p-3 rounded-xl min-w-[140px]">
                           <p className="text-[10px] text-amber-700/70 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Droplet size={12}/> Sustancia</p>
                           <p className="text-sm font-bold text-amber-900 uppercase truncate">{data?.paciente?.sustanciaConsumo || 'NO ESPECIFICADA'}</p>
                        </div>
                        <div className="flex-1 md:flex-none bg-sky-50 border border-sky-200 p-3 rounded-xl min-w-[140px]">
                           <p className="text-[10px] text-sky-700/70 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Phone size={12}/> Contacto</p>
                           <p className="text-sm font-bold text-sky-900 uppercase">{data?.paciente?.telefonoContacto || 'S/N'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pestañas */}
                  <div className="px-6 pb-6">
                    <div className="flex bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-1.5 overflow-x-auto">
                      <button 
                        onClick={() => setPestañaActiva('historial')} 
                        className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${pestañaActiva === 'historial' ? 'bg-[#7E1D3B] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        <HistoryIcon size={14} /> Historial y Notas
                      </button>
                      <button 
                        onClick={() => setPestañaActiva('docs')} 
                        className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${pestañaActiva === 'docs' ? 'bg-[#7E1D3B] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        <FileText size={14} /> Visor de Documentos
                      </button>
                    </div>
                  </div>

                  {/* Contenedor Inferior */}
                  <div className="bg-slate-50/50 border-t border-slate-200 p-6 min-h-[400px]">
                    
                    {/* TAB: HISTORIAL */}
                    {pestañaActiva === 'historial' && (
                      <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Botón para crear nota desde el Expediente */}
                        <div className="flex justify-end mb-6">
                          <button 
                            onClick={() => setModalAbierto(true)} 
                            className="flex items-center gap-2 bg-[#7E1D3B] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-[#63162e] transition-colors"
                          >
                            <FilePlus size={16} /> Añadir Nota de Evolución
                          </button>
                        </div>

                        {notasEvolucion && notasEvolucion.length > 0 ? (
                          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                            {notasEvolucion.map((nota) => (
                              <div key={nota.id} className="relative pl-8">
                                {/* Punto del Timeline */}
                                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#7E1D3B] border-4 border-slate-50"></div>
                                
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 mb-3 gap-2">
                                    <span className="bg-[#7E1D3B]/10 text-[#7E1D3B] px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                      <Calendar size={12}/> {new Date(nota.fechaRegistro).toLocaleDateString()} a las {new Date(nota.fechaRegistro).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-md flex items-center gap-1.5">
                                      <Stethoscope size={12}/> {nota.medicoAsignado}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Evolución Clínica</h4>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{nota.evolucionCuadroClinico}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                            <ClipboardList size={40} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-black text-slate-700 mb-1">Sin Notas Clínicas</h3>
                            <p className="text-sm font-medium text-slate-500">Aún no se han registrado notas de evolución para este paciente.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: DOCUMENTOS */}
                    {pestañaActiva === 'docs' && (
                      <div className="max-w-4xl mx-auto space-y-4">
                        
                        {/* Historia Médica 24h */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6 hover:border-indigo-200 transition-colors group">
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <FileText size={24} />
                            </div>
                            <div>
                              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Historia Médica Integral</h3>
                              <p className="text-xs text-slate-500 font-medium mb-1">Evaluación clínica de las primeras 24 hrs.</p>
                              {historiaMedica ? (
                                <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                  <CheckCircle2 size={14}/> Completada y archivada
                                </p>
                              ) : (
                                <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <AlertTriangle size={14}/> Pendiente de captura
                                </p>
                              )}
                            </div>
                          </div>
                          {historiaMedica && (
                            <button onClick={descargarHistoriaMedicaPDF} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors shadow-sm">
                              <Download size={16} /> Descargar PDF
                            </button>
                          )}
                        </div>

                        {/* Valoración Inicial */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6 hover:border-[#7E1D3B]/30 transition-colors group">
                          <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-xl bg-[#7E1D3B]/10 text-[#7E1D3B] flex items-center justify-center border border-[#7E1D3B]/20 group-hover:bg-[#7E1D3B] group-hover:text-white transition-colors">
                              <HeartPulse size={24} />
                            </div>
                            <div>
                              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Valoración Diagnóstica</h3>
                              <p className="text-xs text-slate-500 font-medium mb-1">Evaluación del área de admisiones.</p>
                              {valoracion ? (
                                <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                  <CheckCircle2 size={14}/> Completada
                                </p>
                              ) : (
                                <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <AlertTriangle size={14}/> Archivo no encontrado
                                </p>
                              )}
                            </div>
                          </div>
                          {valoracion && (
                            <button onClick={() => alert("Generando PDF de Valoración...")} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-sm">
                              <Download size={16} /> Descargar PDF
                            </button>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                </section>
              )}
            </main>
          </div>
        </header>
      </div>

      {/* --- MODAL PARA NUEVA NOTA DE EVOLUCIÓN DESDE EL EXPEDIENTE --- */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <FilePlus size={18} className="text-[#7E1D3B]" />
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Nueva Nota de Evolución</h3>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
               <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
                 Paciente: <span className="text-[#7E1D3B] ml-1">{data?.paciente?.nombreCompleto}</span>
               </p>
               
               <label className="block text-[11px] font-black text-slate-700 uppercase tracking-widest mb-2">
                 Evolución y Cuadro Clínico
               </label>
               <textarea
                 className="w-full border border-slate-200 bg-slate-50 rounded-xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all shadow-inner"
                 rows="6"
                 placeholder="Describa el estado actual del paciente, signos vitales, avances o retrocesos..."
                 value={textoEvolucion}
                 onChange={(e) => setTextoEvolucion(e.target.value)}
               ></textarea>
            </div>
            
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
               <button 
                 onClick={() => setModalAbierto(false)} 
                 className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
               >
                 Cancelar
               </button>
               <button 
                 onClick={guardarNota} 
                 disabled={guardandoNota}
                 className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7E1D3B] hover:bg-[#63162e] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
               >
                 {guardandoNota ? 'Guardando...' : 'Guardar y Anexar'}
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DetalleExpediente;