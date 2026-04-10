import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, ScanLine, AlertCircle, Receipt, FileCheck,
  PackageSearch, Landmark, Save, X, Folder, FileCheck2
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

const origenesRecurso = [
  'Cuotas Recuperación',
  'Recursos Federales',
  'Transferencia SPEI',
  'Subsidio Estatal',
  'Donaciones',
  'Otro',
];

const bancosReceptores = [
  'BBVA', 'Banamex', 'Banorte', 'HSBC', 'Santander',
  'Scotiabank', 'Inbursa', 'Otro',
];

const tiposDeposito = [
  'Transferencia SPEI',
  'Depósito en ventanilla',
  'Cheque',
  'Transferencia interbancaria',
  'Pago en línea',
];

const depositosMock = [
  { id: 1, ref: 'DEP-0325', origen: 'CUOTAS RECUPERACIÓN', banco: 'BBVA',    monto: '$15,000',  estado: 'REGISTRADO' },
  { id: 2, ref: 'DEP-0312', origen: 'TRANSFERENCIA SPEI',  banco: 'BBVA',    monto: '$120,700', estado: 'REGISTRADO' },
  { id: 3, ref: 'DEP-0320', origen: 'CUOTAS RECUPERACIÓN', banco: 'BANAMEX', monto: '$10,000',  estado: 'REGISTRADO' },
  { id: 4, ref: 'DEP-0310', origen: 'RECURSOS FEDERALES',  banco: 'BANORTE', monto: '$85,000',  estado: 'REGISTRADO' },
];

const estadoClass = {
  REGISTRADO: 'bg-emerald-100 text-emerald-700',
  PENDIENTE:  'bg-amber-100 text-amber-700',
  RECHAZADO:  'bg-rose-100 text-rose-700',
};

const DepositoBancario = () => {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const [activeNav, setActiveNav]     = useState('deposito');
  const [depositos, setDepositos]     = useState(depositosMock);
  const [archivo, setArchivo]         = useState(null);
  const [drag, setDrag]               = useState(false);
  const [form, setForm]               = useState({
    numeroRef: '', fechaDeposito: '', origenRecurso: '', bancoReceptor: '',
    clabe: '', monto: '', tipoDeposito: 'Transferencia SPEI', concepto: '',
  });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };
  const handleChange   = (e)    => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const procesarArchivo = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('El archivo supera 10 MB'); return; }
    setArchivo(file);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    procesarArchivo(e.dataTransfer.files[0]);
  };

  const handleRegistrar = () => {
    if (!form.numeroRef.trim() || !form.origenRecurso) return;
    setDepositos(prev => [{
      id:     Date.now(),
      ref:    form.numeroRef.toUpperCase(),
      origen: form.origenRecurso.toUpperCase(),
      banco:  form.bancoReceptor.toUpperCase() || '—',
      monto:  form.monto ? `$${parseFloat(form.monto).toLocaleString('es-MX')}` : '—',
      estado: 'REGISTRADO',
    }, ...prev]);
    setForm({ numeroRef: '', fechaDeposito: '', origenRecurso: '', bancoReceptor: '', clabe: '', monto: '', tipoDeposito: 'Transferencia SPEI', concepto: '' });
    setArchivo(null);
  };

  const handleCancelar = () => {
    setForm({ numeroRef: '', fechaDeposito: '', origenRecurso: '', bancoReceptor: '', clabe: '', monto: '', tipoDeposito: 'Transferencia SPEI', concepto: '' });
    setArchivo(null);
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
                Registrar Depósito Bancario
              </h2>

              {/* ── Formulario ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">

                {/* Número de ref + Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Número de Ref<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input name="numeroRef" value={form.numeroRef} onChange={handleChange}
                      placeholder="Ej. DEP-0326" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Fecha del Depósito<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input type="date" name="fechaDeposito" value={form.fechaDeposito}
                      onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                {/* Origen + Banco receptor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Origen del Recurso<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <select name="origenRecurso" value={form.origenRecurso} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar</option>
                      {origenesRecurso.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Banco Receptor<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <select name="bancoReceptor" value={form.bancoReceptor} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar</option>
                      {bancosReceptores.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                {/* CLABE + Monto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>CLABE / Núm. Cuenta</label>
                    <input name="clabe" value={form.clabe} onChange={handleChange}
                      placeholder="18 dígitos CLABE o núm. cuenta" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Monto Depositado ($)<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                      <input type="number" name="monto" value={form.monto} onChange={handleChange}
                        placeholder="0.00" min={0} step={0.01}
                        className={`${inputClass} pl-7`} />
                    </div>
                  </div>
                </div>

                {/* Tipo depósito */}
                <div className="md:w-1/2">
                  <label className={labelClass}>Tipo de Depósito</label>
                  <select name="tipoDeposito" value={form.tipoDeposito} onChange={handleChange} className={inputClass}>
                    {tiposDeposito.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Concepto */}
                <div>
                  <label className={labelClass}>Concepto</label>
                  <textarea name="concepto" value={form.concepto} onChange={handleChange}
                    rows={3} placeholder="Descripción o referencia del depósito..."
                    className={`${inputClass} resize-none`} />
                </div>

                {/* ── Adjuntar ficha ── */}
                <div
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed
                              cursor-pointer transition-all py-8 px-6 ${
                    drag
                      ? 'border-[#7E1D3B] bg-[#7E1D3B]/5'
                      : archivo
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-300 bg-slate-50 hover:border-[#7E1D3B]/50 hover:bg-[#7E1D3B]/3'
                  }`}
                >
                  <input ref={fileRef} type="file" className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => procesarArchivo(e.target.files[0])} />

                  {archivo ? (
                    <>
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FileCheck2 size={20} className="text-emerald-600" />
                      </div>
                      <p className="text-sm font-semibold text-emerald-700">{archivo.name}</p>
                      <p className="text-xs text-slate-400">{(archivo.size / 1024).toFixed(1)} KB</p>
                      <button onClick={e => { e.stopPropagation(); setArchivo(null); }}
                        className="text-xs text-rose-500 hover:underline font-medium">
                        Quitar archivo
                      </button>
                    </>
                  ) : (
                    <>
                      <Folder size={28} className="text-amber-400" />
                      <p className="text-sm text-slate-500 font-medium">
                        Adjuntar Ficha de Depósito o Comprobante SPEI
                      </p>
                      <p className="text-xs text-slate-400">Máx. 10 MB · PDF, JPG, PNG</p>
                    </>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-3 justify-end pt-1">
                  <button onClick={handleCancelar}
                    className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl
                               text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm shadow-sm">
                    <X size={15} /> Cancelar
                  </button>
                  <button onClick={handleRegistrar}
                    className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                               font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                    <Save size={15} /> Registrar Depósito
                  </button>
                </div>
              </section>

              {/* ── Tabla depósitos ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['Referencia', 'Origen', 'Banco', 'Monto', 'Estado'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {depositos.map((d, i) => (
                      <tr key={d.id}
                        className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-4 py-3 font-bold text-[#7E1D3B]">{d.ref}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{d.origen}</td>
                        <td className="px-4 py-3 text-slate-600">{d.banco}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{d.monto}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${estadoClass[d.estado] || 'bg-slate-100 text-slate-500'}`}>
                            {d.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">
                    {depositos.length} depósito{depositos.length !== 1 ? 's' : ''} registrado{depositos.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs font-bold text-[#7E1D3B]">
                    Total: ${depositos.reduce((acc, d) => {
                      const n = parseFloat(d.monto.replace(/[$,]/g, '')) || 0;
                      return acc + n;
                    }, 0).toLocaleString('es-MX')}
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

export default DepositoBancario;