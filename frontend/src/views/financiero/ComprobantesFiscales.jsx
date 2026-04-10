import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, ScanLine, AlertCircle, Receipt, FileCheck,
  PackageSearch, Landmark, Save, X
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

const tiposComprobante = [
  'Ingreso - Cuota de recuperación',
  'Ingreso - Subsidio',
  'Egreso - Proveedor',
  'Egreso - Nómina',
  'Traslado',
  'Pago',
];

const clavesSAT = [
  '85101700 - SERVICIOS DE SALUD',
  '85101600 - SERVICIOS DE ENFERMERÍA',
  '85121800 - SERVICIOS DE FARMACIA',
  '56101500 - SERVICIOS ADMINISTRATIVOS',
  '44121700 - ÚTILES DE OFICINA',
  '51102700 - PRODUCTOS FARMACÉUTICOS',
];

const ivaOpciones = [
  { label: '0% - EXENTO (servicios médicos)', valor: 0    },
  { label: '8% - Región fronteriza',          valor: 0.08 },
  { label: '16% - Tasa general',              valor: 0.16 },
];

const comprobantesMock = [
  { id: 1, uuid: 'A-204', proveedor: 'FARM. DEL AHORRO', concepto: 'MEDICAMENTOS',   total: '$15,000', estado: 'VALIDADO' },
  { id: 2, uuid: 'A-203', proveedor: 'LAB. PISA',        concepto: 'MAT. CURACIÓN',  total: '$8,700',  estado: 'VALIDADO' },
  { id: 3, uuid: 'A-202', proveedor: 'NADRO',            concepto: 'MEDICAMENTOS',   total: '$10,000', estado: 'VALIDADO' },
  { id: 4, uuid: 'A-201', proveedor: 'PAPELERÍA NTE',    concepto: 'ÚTILES OFICINA', total: '$5,000',  estado: 'VALIDADO' },
];

const estadoClass = {
  VALIDADO:  'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-amber-100 text-amber-700',
  RECHAZADO: 'bg-rose-100 text-rose-700',
};

const ComprobantesFiscales = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]       = useState('comprobantes');
  const [comprobantes, setComprobantes] = useState(comprobantesMock);
  const [form, setForm]                 = useState({
    tipo: 'Ingreso - Cuota de recuperación',
    periodo: '',
    concepto: '',
    claveSAT: '85101700 - SERVICIOS DE SALUD',
    subtotal: '',
    iva: 0,
    observaciones: '',
  });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };
  const handleChange   = (e)    => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleIva      = (e)    => setForm(prev => ({ ...prev, iva: parseFloat(e.target.value) }));

  const subtotalNum = parseFloat(form.subtotal) || 0;
  const totalConIva = subtotalNum + subtotalNum * form.iva;

  const formatMXN = (num) =>
    num > 0 ? `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '—';

  const handleGenerar = () => {
    if (!form.concepto.trim()) return;
    setComprobantes(prev => [{
      id:        Date.now(),
      uuid:      `A-${200 + prev.length + 5}`,
      proveedor: form.tipo.toUpperCase(),
      concepto:  form.concepto.toUpperCase(),
      total:     formatMXN(totalConIva),
      estado:    'PENDIENTE',
    }, ...prev]);
    setForm({
      tipo: 'Ingreso - Cuota de recuperación', periodo: '', concepto: '',
      claveSAT: '85101700 - SERVICIOS DE SALUD', subtotal: '', iva: 0, observaciones: '',
    });
  };

  const handleCancelar = () => {
    setForm({
      tipo: 'Ingreso - Cuota de recuperación', periodo: '', concepto: '',
      claveSAT: '85101700 - SERVICIOS DE SALUD', subtotal: '', iva: 0, observaciones: '',
    });
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
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Comprobantes Fiscales</h2>

              {/* ── Formulario ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">

                {/* Tipo + Periodo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tipo de Comprobante<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                      {tiposComprobante.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Periodo Fiscal<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input type="date" name="periodo" value={form.periodo}
                      onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                {/* Concepto */}
                <div>
                  <label className={labelClass}>Concepto<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                  <textarea name="concepto" value={form.concepto} onChange={handleChange}
                    rows={3} placeholder="Descripción del comprobante fiscal..."
                    className={`${inputClass} resize-none`} />
                </div>

                {/* Clave SAT */}
                <div>
                  <label className={labelClass}>Clave SAT del Servicio</label>
                  <select name="claveSAT" value={form.claveSAT} onChange={handleChange} className={inputClass}>
                    {clavesSAT.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Subtotal + IVA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Subtotal ($)<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                      <input type="number" name="subtotal" value={form.subtotal} onChange={handleChange}
                        placeholder="0.00" min={0} step={0.01}
                        className={`${inputClass} pl-7`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>IVA Aplicado</label>
                    <select value={form.iva} onChange={handleIva} className={inputClass}>
                      {ivaOpciones.map(op => (
                        <option key={op.valor} value={op.valor}>{op.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Total calculado */}
                {subtotalNum > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#7E1D3B]/5 border border-[#7E1D3B]/15">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total con IVA:</span>
                    <span className="text-base font-black text-[#7E1D3B]">{formatMXN(totalConIva)}</span>
                    {form.iva > 0 && (
                      <span className="text-xs text-slate-400 ml-1">
                        (IVA {(form.iva * 100).toFixed(0)}%: {formatMXN(subtotalNum * form.iva)})
                      </span>
                    )}
                  </div>
                )}

                {/* Observaciones fiscales */}
                <div>
                  <label className={labelClass}>Observaciones Fiscales</label>
                  <textarea name="observaciones" value={form.observaciones} onChange={handleChange}
                    rows={3} placeholder="Notas o aclaraciones fiscales adicionales..."
                    className={`${inputClass} resize-none`} />
                </div>

                {/* Acciones */}
                <div className="flex gap-3 justify-end pt-1">
                  <button onClick={handleCancelar}
                    className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-xl
                               text-slate-600 hover:bg-slate-50 transition-all font-semibold text-sm shadow-sm">
                    <X size={15} /> Cancelar
                  </button>
                  <button onClick={handleGenerar}
                    className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl
                               font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
                    <Save size={15} /> Generar Comprobante
                  </button>
                </div>
              </section>

              {/* ── Tabla ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {['UUID', 'Proveedor', 'Concepto', 'Total', 'Estado'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em] text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comprobantes.map((c, i) => (
                      <tr key={c.id}
                        className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-4 py-3 font-bold text-[#7E1D3B]">{c.uuid}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{c.proveedor}</td>
                        <td className="px-4 py-3 text-slate-600">{c.concepto}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{c.total}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${estadoClass[c.estado] || 'bg-slate-100 text-slate-500'}`}>
                            {c.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">
                    {comprobantes.length} comprobante{comprobantes.length !== 1 ? 's' : ''} registrado{comprobantes.length !== 1 ? 's' : ''}
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

export default ComprobantesFiscales;