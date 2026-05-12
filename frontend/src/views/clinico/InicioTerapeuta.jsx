import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, LayoutDashboard } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const InicioTerapeuta = () => {
  const [formulario, setFormulario] = useState({ titulo: '', fecha: '', hora: '', terapeuta: 'Terapeuta Operativo' });

  const enviar = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:4000/api/actividades', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formulario)
    });
    alert("Actividad propuesta con éxito");
    setFormulario({ ...formulario, titulo: '', fecha: '', hora: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 relative">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex items-center gap-3 px-6 py-4 border-b">
            <img src={marakameLogo} alt="Logo" className="h-12 w-auto rounded-xl border p-1" />
            <h1 className="text-xl font-black text-slate-800">Módulo Operativo Terapéutico</h1>
          </div>
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              <button className="w-full rounded-xl px-3 py-3 text-sm font-semibold bg-[#7E1D3B] text-white flex items-center gap-2">
                <LayoutDashboard size={16} /> Proponer Dinámica
              </button>
            </aside>
            <main>
              <form onSubmit={enviar} className="bg-white p-6 rounded-xl border shadow-sm space-y-4 max-w-lg">
                <input type="text" placeholder="Nombre de la dinámica" required value={formulario.titulo} onChange={e => setFormulario({...formulario, titulo: e.target.value})} className="w-full p-3 rounded-xl border text-sm outline-none" />
                <input type="date" required value={formulario.fecha} onChange={e => setFormulario({...formulario, fecha: e.target.value})} className="w-full p-3 rounded-xl border text-sm outline-none" />
                <input type="time" required value={formulario.hora} onChange={e => setFormulario({...formulario, hora: e.target.value})} className="w-full p-3 rounded-xl border text-sm outline-none" />
                <button type="submit" className="w-full py-3 bg-[#7E1D3B] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"><Send size={16} /> Enviar a Jefatura</button>
              </form>
            </main>
          </div>
        </header>
      </div>
    </div>
  );
};
export default InicioTerapeuta;