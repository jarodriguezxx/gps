import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, Users, HeartHandshake, FileText, ExternalLink, ShieldAlert } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const AuditoriaExpediente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const resPaciente = await fetch(`http://localhost:4000/api/pacientes/${id}`);
        if (!resPaciente.ok) throw new Error("Paciente no encontrado en el servidor.");
        setPaciente(await resPaciente.json());
        try {
          const resDocs = await fetch(`http://localhost:4000/api/documentos/paciente/${id}`);
          if (resDocs.ok) setDocumentos(await resDocs.json());
        } catch (errDocs) { console.warn("No se cargaron los documentos.", errDocs); }
      } catch (err) { setError(err.message); }
    };
    fetchAuditoria();
  }, [id]);

  if (error) return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-rose-600 text-xl">Error: {error}</div>;
  if (!paciente) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500 font-bold">Cargando auditoría...</div>;

  const docsPorSeccion = (seccion) => documentos.filter(d => d.departamento === seccion);

  const ColumnaAuditoria = ({ titulo, icono: Icono, color, bgIcon, docs }) => (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px]">
      <div className={`p-4 ${color} text-white flex items-center justify-between shadow-sm`}>
        <div className="flex items-center gap-2">
          <Icono size={18} />
          <h3 className="text-xs font-black uppercase tracking-[0.1em]">{titulo}</h3>
        </div>
        <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{docs.length} docs</span>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-50/50">
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <ShieldAlert size={32} className="mb-2 text-slate-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Sin archivos</p>
          </div>
        ) : (
          docs.map((doc, i) => (
            <a key={i} href={`http://localhost:4000/uploads/expedientes/${doc.nombreArchivo}`} target="_blank" rel="noreferrer"
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-[#7E1D3B] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg ${bgIcon} text-white shrink-0`}><FileText size={14} /></div>
                <span className="text-xs font-bold text-slate-700 truncate">{doc.nombrePaso}</span>
              </div>
              <ExternalLink size={14} className="text-slate-300 group-hover:text-[#7E1D3B] shrink-0 ml-2" />
            </a>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden flex flex-col">
          
          <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/clinico/directorio')} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:bg-[#7E1D3B] hover:text-white transition-all shadow-sm">
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#7E1D3B] font-black mb-0.5">Auditoría Clínica Integral</p>
                <h1 className="text-xl md:text-2xl font-black text-slate-800">Expediente: {paciente.nombreCompleto}</h1>
              </div>
            </div>
            <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
          </div>

          <div className="p-6 md:p-8 bg-slate-50 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ColumnaAuditoria titulo="Psicología" icono={Brain} color="bg-[#7E1D3B]" bgIcon="bg-[#7E1D3B]" docs={docsPorSeccion('Psicología')} />
              <ColumnaAuditoria titulo="Consejería" icono={HeartHandshake} color="bg-slate-700" bgIcon="bg-slate-700" docs={docsPorSeccion('Consejería')} />
              <ColumnaAuditoria titulo="Familia" icono={Users} color="bg-[#A13D5A]" bgIcon="bg-[#A13D5A]" docs={docsPorSeccion('Familia')} />
            </div>
          </div>
          
        </header>
      </div>
    </div>
  );
};

export default AuditoriaExpediente;