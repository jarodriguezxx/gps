import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, BrainCircuit, MessageSquare, 
  Users2, ChevronRight, FileText, FileUp, CheckCircle2, 
  ArrowLeft, Brain, ShieldCheck, Heart, AlertTriangle
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const CONFIG_ROLES = {
  psicologia: { titulo: 'Módulo de Psicología', icono: Brain, color: 'text-sky-600', bg: 'bg-sky-50', pasos: ["Entrevista inicial", "Primera terapia grupal", "Evaluación psicosocial", "Plan de tratamiento psicológico", "Daños por consumo / 10 consecuencias", "Sesión familiar", "Notas de evolución", "Despedida grupal", "Entrevista de cierre"] },
  consejeria: { titulo: 'Módulo de Consejería', icono: ShieldCheck, color: 'text-slate-700', bg: 'bg-slate-100', pasos: ["Nota de ingreso", "Presentación de consejero", "Entrevista introductoria", "Plan de consejería", "Nota de evolución 'primer paso'", "Nota de evolución 'duelo'", "Nota de evolución 'Grupal'", "Nota de evolución 'Individual'", "Nota de evolución '2do y 3er paso'", "Compromisos", "Nota de egreso", "Reporte final", "Satisfacción"] },
  familia: { titulo: 'Módulo de Atención a Familia', icono: Heart, color: 'text-amber-600', bg: 'bg-amber-50', pasos: ["Cuestionario familia", "Formato entrevista", "Compromiso familiar", "Autorización info", "Nota evolución #1", "Nota evolución #2", "Notificación arribo", "Inventarios Beck", "Cuestionario apoyo", "Nota evolución #3", "Cuestionario usuario", "Nota evolución #4"] }
};

const GestorDocumentosClinicos = ({ rolActivo = 'psicologia' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const config = CONFIG_ROLES[rolActivo];

  if (!config) return <div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="bg-white p-8 rounded-2xl shadow-sm text-center"><AlertTriangle size={48} className="text-rose-500 mx-auto mb-4" /><h2 className="text-xl font-black">Error de Rol</h2><p className="text-slate-500 mt-2 mb-6">El rol "{rolActivo}" no es válido.</p><button onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold">Regresar</button></div></div>;
  if (!id) return <div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="bg-white p-8 rounded-2xl shadow-sm text-center"><Users size={48} className="text-amber-500 mx-auto mb-4" /><h2 className="text-xl font-black">Falta Paciente</h2><p className="text-slate-500 mt-2 mb-6">Seleccione un paciente del censo.</p><button onClick={() => navigate('/clinico/pacientes')} className="px-6 py-2 bg-[#7E1D3B] text-white rounded-xl font-bold">Ir al Censo</button></div></div>;

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/pacientes/${id}`).then(res => res.json()).then(data => { setPaciente(data); setLoading(false); });
  }, [id]);

  const navItems = [
    { label: 'Inicio Jefatura Clínica', icon: LayoutDashboard, path: '/clinico/inicio-jefe-clinico' },
    { label: 'Censo de Pacientes',      icon: Users,           path: '/clinico/pacientes' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">Cargando...</div>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3"><img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" /><div><p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p><h1 className="text-xl font-black md:text-2xl text-slate-800">{config.titulo}</h1></div></div>
            <div className="flex items-center gap-3"><button onClick={() => navigate('/clinico/pacientes')} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex gap-2"><ArrowLeft size={14} /> Volver</button><div className={`h-10 w-10 rounded-full border-2 border-slate-200 ${config.bg} flex items-center justify-center ${config.color}`}><config.icono size={20} /></div></div>
          </div>
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map((item) => (<button key={item.path} onClick={() => navigate(item.path)} className="mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-[#7E1D3B] hover:bg-[#7E1D3B]/10"><item.icon size={16} /><span>{item.label}</span></button>))}
            </aside>
            <main className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center"><div className="flex items-center gap-2"><div className="h-5 w-1 rounded-full bg-[#7E1D3B]" /><div><h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Progreso: {paciente?.nombreCompleto}</h2><p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Expediente Secuencial</p></div></div></div>
                <div className="p-6 space-y-3">{config.pasos.map((paso, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all shadow-sm">
                    <div className="flex items-center gap-4"><div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400">{i + 1}</div><p className="text-sm font-bold text-slate-700">{paso}</p></div>
                    <div className="flex gap-2"><button className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase"><FileText size={12}/></button><button className="px-3 py-1.5 bg-[#7E1D3B] text-white rounded-lg text-[10px] font-bold uppercase shadow-sm"><FileUp size={12}/></button></div>
                  </div>
                ))}</div>
              </section>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default GestorDocumentosClinicos;