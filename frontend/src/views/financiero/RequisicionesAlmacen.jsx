import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, ScanLine, AlertCircle, Receipt, FileCheck,
  PackageSearch, Landmark, Send, X
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Archivo Contable',         icon: FolderOpen,    key: 'archivo',      path: '/financiero/archivo-contable' },
  { label: 'Digitalizar Comprobantes', icon: ScanLine,      key: 'digitalizar',  path: '/financiero/digitalizar-comprobantes' },
  { label: 'Gestionar Correcciones',   icon: AlertCircle,   key: 'correcciones', path: '/financiero/gestionar-correcciones' },
  { label: 'Factura Electrónica',      icon: Receipt,       key: 'factura',      path: '/financiero/factura-electronica' },
  { label: 'Comprobantes Fiscales',    icon: FileCheck,     key: 'comprobantes', path: '/financiero/comprobantes-fiscales' },
  { label: 'Requisiciones Almacén',    icon: PackageSearch, key: 'requisiciones',path: '/financiero/requisiciones-almacen' },
  { label: 'Depósito Bancario',        icon: Landmark,      key: 'deposito',     path: '/financiero/deposito-bancario' },
];

const areas = [
  'Farmacia', 'Cocina', 'Dirección', 'Enfermería', 'Clínico',
  'Admisiones', 'Recursos Humanos', 'Mantenimiento', 'Otro',
];

const tiposInsumo = [
  'Medicamento', 'Material de curación', 'Papelería y útiles',
  'Alimentos', 'Limpieza', 'Equipo médico', 'Otro',
];

const prioridades = ['Crítica', 'Urgente', 'Normal', 'Baja'];

const prioridadClass = {
  Crítica:  'bg-rose-100 text-rose-700',
  Urgente:  'bg-amber-100 text-amber-700',
  Normal:   'bg-sky-100 text-sky-700',
  Baja:     'bg-slate-100 text-slate-500',
  APROBADA: 'bg-emerald-100 text-emerald-700',
  CRÍTICA:  'bg-rose-100 text-rose-700',
  URGENTE:  'bg-amber-100 text-amber-700',
};

const requisicionesMock = [
  { id: 1, req: 'REQ-017', area: 'FARMACIA',   concepto: 'BUPRENORFINA / NALOXONA', prioridad: 'CRÍTICA'  },
  { id: 2, req: 'REQ-016', area: 'COCINA',     concepto: 'MAT. CURACIÓN / VENDAJES', prioridad: 'URGENTE' },
  { id: 3, req: 'REQ-015', area: 'DIRECCIÓN',  concepto: 'PAPELERÍA Y ÚTILES',       prioridad: 'APROBADA'},
];

const RequisicionesAlmacen = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]         = useState('requisiciones');
  const [requisiciones, setRequisiciones] = useState(requisicionesMock);
  const [form, setForm]                   = useState({
    folio: '', fechaRequerida: '', area: '', tipoInsumo: '',
    descripcion: '', cantidad: '', costoEstimado: '', prioridad: '',
  });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };
  const handleChange   = (e)    => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEnviar = () => {
    if (!form.folio.trim() || !form.area) return;
    setRequisiciones(prev => [{
      id:        Date.now(),
      req:       form.folio.toUpperCase(),
      area:      form.area.toUpperCase(),
      concepto:  form.descripcion.toUpperCase() || form.tipoInsumo.toUpperCase() || '—',
      prioridad: form.prioridad.toUpperCase() || 'NORMAL',
    }, ...prev]);
    setForm({ folio: '', fechaRequerida: '', area: '', tipoInsumo: '', descripcion: '', cantidad: '', costoEstimado: '', prioridad: '' });
  };

  const handleCancelar = () => {
    setForm({ folio: '', fechaRequerida: '', area: '', tipoInsumo: '', descripcion: '', cantidad: '', costoEstimado: '', prioridad: '' });
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800
                      focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50
                      placeholder:text-slate-300 transition-all`;
  const labelClass = `block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img src={marakameLogo} alt="Logo Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema de Gestión Marakame</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo Financiero</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <Landmark size={16} className="text-[#7E1D3B]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Financiero</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* ── Sidebar ── */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon: Icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  <Icon size={15} className="shrink-0" /><span>{label}</span>
                </button>
              ))}
            </aside>

            {/* ── Main ── */}
            <main className="space-y-5">

              {/* Título */}
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">
                Nueva Requisición de Almacén
              </h2>

              {/* ── Formulario ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">

                {/* Folio + Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Folio Requisición<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input name="folio" value={form.folio} onChange={handleChange}
                      placeholder="Ej. REQ-018" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Fecha Requerida<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input type="date" name="fechaRequerida" value={form.fechaRequerida}
                      onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                {/* Área + Tipo insumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Área / Servicio Solicitante<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <select name="area" value={form.area} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar</option>
                      {areas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Tipo de Insumo<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <select name="tipoInsumo" value={form.tipoInsumo} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar</option>
                      {tiposInsumo.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className={labelClass}>Descripción del Insumo<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                    rows={3} placeholder="Describe el insumo solicitado con detalle..."
                    className={`${inputClass} resize-none`} />
                </div>

                {/* Cantidad + Costo estimado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Cantidad<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange}
                      placeholder="Ej. 50" min={1} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Costo Estimado ($)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                      <input type="number" name="costoEstimado" value={form.costoEstimado} onChange={handleChange}
                        placeholder="0.00" min={0} step={0.01}
                        className={`${inputClass} pl-7`} />
                    </div>
                  </div>
                </div>

                {/* Prioridad */}
                <div className="md:w-1/2">
                  <label className={labelClass}>Prioridad<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                  <select name="prioridad" value={form.prioridad} onChange={handleChange} className={inputClass}>
                    <option value="">Seleccionar</option>
                    {prioridades.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Acciones */}
                <div className="flex gap-3 justify-end pt-1">
                  <button onClick={handleCancelar}
                    className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl
                               text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm shadow-sm">
                    <X size={15} /> Cancelar
                  </button>
                  <button onClick={handleEnviar}
                    className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                               font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                    <Send size={15} /> Enviar Requisición
                  </button>
                </div>
              </section>

              {/* ── Tabla requisiciones ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['REQ', 'Área', 'Concepto', 'Prioridad'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requisiciones.map((r, i) => (
                      <tr key={r.id}
                        className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-4 py-3 font-bold text-[#7E1D3B]">{r.req}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{r.area}</td>
                        <td className="px-4 py-3 text-slate-600">{r.concepto}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${prioridadClass[r.prioridad] || 'bg-slate-100 text-slate-500'}`}>
                            {r.prioridad}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">
                    {requisiciones.length} requisición{requisiciones.length !== 1 ? 'es' : ''} registrada{requisiciones.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default RequisicionesAlmacen;