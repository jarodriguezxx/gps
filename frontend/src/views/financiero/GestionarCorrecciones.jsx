import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, ScanLine, AlertCircle, Receipt, FileCheck,
  PackageSearch, Landmark, Save, X, Plus, ChevronRight
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

const tiposError = [
  'Monto incorrecto',
  'RFC incorrecto',
  'Folio duplicado',
  'Fecha incorrecta',
  'Concepto erróneo',
  'Proveedor incorrecto',
  'Otro',
];

const correccionesMock = [
  { id: 1, folio: 'MK-0420', tipo: 'MONTO INCORRECTO',  detalle: 'Se Registró $18,400  —  factura proveedor $18,640' },
  { id: 2, folio: 'MK-0408', tipo: 'RFC INCORRECTO',    detalle: 'El RFC de (LAB. pisa) Es incorrecto o no se logró verificar' },
  { id: 3, folio: 'MK-0415', tipo: 'MONTO INCORRECTO',  detalle: 'Se Registró $15,000  —  factura proveedor $14,500' },
];

const GestionarCorrecciones = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]         = useState('correcciones');
  const [correcciones, setCorrecciones]   = useState(correccionesMock);
  const [seleccionada, setSeleccionada]   = useState(null);
  const [mostrarForm, setMostrarForm]     = useState(false);
  const [form, setForm]                   = useState({
    folio: '', tipoError: '', descripcion: '', datoOriginal: '', datoCorregido: '', autoriza: '',
  });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };
  const handleChange   = (e)    => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSeleccionar = (c) => {
    setSeleccionada(c);
    setForm({
      folio:         c.folio,
      tipoError:     c.tipo,
      descripcion:   c.detalle,
      datoOriginal:  '',
      datoCorregido: '',
      autoriza:      '',
    });
    setMostrarForm(true);
  };

  const handleNueva = () => {
    setSeleccionada(null);
    setForm({ folio: '', tipoError: '', descripcion: '', datoOriginal: '', datoCorregido: '', autoriza: '' });
    setMostrarForm(true);
  };

  const handleGuardar = () => {
    if (!form.folio.trim()) return;
    if (!seleccionada) {
      setCorrecciones(prev => [...prev, {
        id:      Date.now(),
        folio:   form.folio,
        tipo:    (form.tipoError || 'OTRO').toUpperCase(),
        detalle: form.descripcion,
      }]);
    } else {
      setCorrecciones(prev => prev.filter(c => c.id !== seleccionada.id));
    }
    setForm({ folio: '', tipoError: '', descripcion: '', datoOriginal: '', datoCorregido: '', autoriza: '' });
    setMostrarForm(false);
    setSeleccionada(null);
  };

  const handleCancelar = () => {
    setForm({ folio: '', tipoError: '', descripcion: '', datoOriginal: '', datoCorregido: '', autoriza: '' });
    setMostrarForm(false);
    setSeleccionada(null);
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
              {navItems.map(({ label, icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 text-left ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  {React.createElement(icon, { size: 15, className: 'shrink-0' })}<span>{label}</span>
                </button>
              ))}
            </aside>

            {/* ── Main ── */}
            <main className="space-y-5">

              {/* Título */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Gestión de Correcciones</h2>
                <button onClick={handleNueva}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                             font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm shrink-0">
                  <Plus size={15} /> Agregar Corrección
                </button>
              </div>

              {/* ── Correcciones pendientes ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Correcciones Pendientes</h3>
                  <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#7E1D3B] text-white text-[10px] font-black">
                    {correcciones.length}
                  </span>
                </div>

                {correcciones.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No hay correcciones pendientes.</p>
                ) : (
                  <div className="space-y-3">
                    {correcciones.map(c => (
                      <button key={c.id} onClick={() => handleSeleccionar(c)}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all group ${
                          seleccionada?.id === c.id
                            ? 'border-[#7E1D3B]/40 bg-[#7E1D3B]/5'
                            : 'border-slate-200 bg-slate-50 hover:border-[#7E1D3B]/30 hover:bg-[#7E1D3B]/3'
                        }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-slate-800">
                              {c.folio} — <span className="text-[#7E1D3B]">{c.tipo}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{c.detalle}</p>
                          </div>
                          <ChevronRight size={15} className="text-slate-300 group-hover:text-[#7E1D3B] transition shrink-0 mt-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Formulario corrección ── */}
              {mostrarForm && (
                <section className="bg-white rounded-2xl border border-[#7E1D3B]/20 shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">
                      {seleccionada ? `Editar Corrección — ${seleccionada.folio}` : 'Nueva Corrección'}
                    </h3>
                  </div>

                  {/* Folio + Tipo error */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Folio a Corregir<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                      <input name="folio" value={form.folio} onChange={handleChange}
                        placeholder="Ej. MK-0420" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Tipo de Error<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                      <select name="tipoError" value={form.tipoError} onChange={handleChange} className={inputClass}>
                        <option value="">Seleccionar</option>
                        {tiposError.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className={labelClass}>Descripción de la Corrección<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                      rows={4} placeholder="Describe el error y la corrección necesaria..."
                      className={`${inputClass} resize-none`} />
                  </div>

                  {/* Dato original + Dato corregido */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Dato Original</label>
                      <input name="datoOriginal" value={form.datoOriginal} onChange={handleChange}
                        placeholder="Valor registrado incorrectamente" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Dato Corregido</label>
                      <input name="datoCorregido" value={form.datoCorregido} onChange={handleChange}
                        placeholder="Valor correcto" className={inputClass} />
                    </div>
                  </div>

                  {/* Quién autoriza */}
                  <div>
                    <label className={labelClass}>Quién Autoriza</label>
                    <input name="autoriza" value={form.autoriza} onChange={handleChange}
                      placeholder="Nombre del responsable que autoriza" className={inputClass} />
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-3 justify-end pt-1">
                    <button onClick={handleCancelar}
                      className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl
                                 text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm shadow-sm">
                      <X size={15} /> Cancelar
                    </button>
                    <button onClick={handleGuardar}
                      className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                                 font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                      <Save size={15} /> Guardar Corrección
                    </button>
                  </div>
                </section>
              )}

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default GestionarCorrecciones;