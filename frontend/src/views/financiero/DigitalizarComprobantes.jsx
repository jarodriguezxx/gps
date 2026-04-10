import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, ScanLine, AlertCircle, Receipt, FileCheck,
  PackageSearch, Landmark, Save, X, Upload, Folder
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

const tiposComprobante = ['Factura', 'Nota de crédito', 'Recibo de pago', 'Ticket', 'Comprobante de transferencia', 'Otro'];

const registrosMock = [
  { id: 1, folio: 'FC-00121', concepto: 'Factura física',  monto: '+11,000', estado: 'Guardado' },
  { id: 2, folio: 'NC-00034', concepto: 'Nota crédito',    monto: '-2,000',  estado: 'Guardado' },
  { id: 3, folio: 'RP-00210', concepto: 'Recibo pago',     monto: '+30,000', estado: 'Guardado' },
];

const estadoClass = {
  Guardado:    'bg-emerald-100 text-emerald-700',
  'En proceso':'bg-amber-100 text-amber-700',
  Rechazado:   'bg-rose-100 text-rose-700',
};

const montoClass = (monto) =>
  monto.startsWith('+') ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';

const DigitalizarComprobantes = () => {
  const navigate  = useNavigate();
  const fileRef   = useRef(null);
  const [activeNav, setActiveNav] = useState('digitalizar');
  const [archivo, setArchivo]     = useState(null);
  const [drag, setDrag]           = useState(false);
  const [registros, setRegistros] = useState(registrosMock);
  const [form, setForm]           = useState({
    tipo: '', fecha: '', folio: '', monto: '', emisor: '', notas: '',
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

  const handleGuardar = () => {
    if (!form.folio.trim()) return;
    const nuevo = {
      id:       Date.now(),
      folio:    form.folio,
      concepto: form.tipo || 'Comprobante',
      monto:    form.monto ? `+${form.monto}` : '—',
      estado:   'Guardado',
    };
    setRegistros(prev => [nuevo, ...prev]);
    setForm({ tipo: '', fecha: '', folio: '', monto: '', emisor: '', notas: '' });
    setArchivo(null);
  };

  const handleCancelar = () => {
    setForm({ tipo: '', fecha: '', folio: '', monto: '', emisor: '', notas: '' });
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

              <div>
                <h2 className="text-2xl font-black text-slate-800">Digitalizar comprobantes</h2>
              </div>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

                {/* ── Zona de carga ── */}
                <div
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed
                              cursor-pointer transition-all py-10 px-6 ${
                    drag
                      ? 'border-[#7E1D3B] bg-[#7E1D3B]/5'
                      : archivo
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-300 bg-slate-50 hover:border-[#7E1D3B]/50 hover:bg-[#7E1D3B]/3'
                  }`}
                >
                  <input ref={fileRef} type="file" className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.xml"
                    onChange={e => procesarArchivo(e.target.files[0])} />

                  {archivo ? (
                    <>
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FileCheck size={20} className="text-emerald-600" />
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
                      <Folder size={32} className="text-amber-400" />
                      <p className="text-sm text-slate-500 font-medium">
                        Arrastra tu archivo aquí o haz click para seleccionar
                      </p>
                      <p className="text-xs text-slate-400">Máx. 10 MB · PDF, JPG, PNG, XML</p>
                    </>
                  )}
                </div>

                {/* ── Tipo + Fecha ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tipo de Comprobante<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar</option>
                      {tiposComprobante.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Fecha<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                {/* ── Folio + Monto ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Folio del Documento<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input name="folio" value={form.folio} onChange={handleChange}
                      placeholder="Ej. FC-00122" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Monto ($)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                      <input type="number" name="monto" value={form.monto} onChange={handleChange}
                        placeholder="0.00" min={0} step={0.01}
                        className={`${inputClass} pl-7`} />
                    </div>
                  </div>
                </div>

                {/* ── Emisor ── */}
                <div>
                  <label className={labelClass}>Emisor / Proveedor</label>
                  <input name="emisor" value={form.emisor} onChange={handleChange}
                    placeholder="Nombre del emisor o proveedor" className={inputClass} />
                </div>

                {/* ── Notas ── */}
                <div>
                  <label className={labelClass}>Notas</label>
                  <textarea name="notas" value={form.notas} onChange={handleChange}
                    rows={3} placeholder="Observaciones adicionales..."
                    className={`${inputClass} resize-none`} />
                </div>

                {/* ── Acciones ── */}
                <div className="flex gap-3 justify-end">
                  <button onClick={handleCancelar}
                    className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl
                               text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm shadow-sm">
                    <X size={15} /> Cancelar
                  </button>
                  <button onClick={handleGuardar}
                    className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                               font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                    <Save size={15} /> Guardar Registro
                  </button>
                </div>
              </section>

              {/* ── Tabla ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['Folio', 'Concepto', 'Monto', 'Estado'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map((r, i) => (
                      <tr key={r.id}
                        className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-4 py-3 font-bold text-[#7E1D3B]">{r.folio}</td>
                        <td className="px-4 py-3 text-slate-700">{r.concepto}</td>
                        <td className={`px-4 py-3 ${montoClass(r.monto)}`}>{r.monto}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${estadoClass[r.estado] || 'bg-slate-100 text-slate-500'}`}>
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">{registros.length} comprobante{registros.length !== 1 ? 's' : ''}</p>
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default DigitalizarComprobantes;