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

const ivaOpciones = [
  { label: '0% - EXENTO (medicamentos)', valor: 0    },
  { label: '8% - Región fronteriza',     valor: 0.08 },
  { label: '16% - Tasa general',         valor: 0.16 },
];

const facturasMock = [
  { id: 1, uuid: 'A-204', proveedor: 'FARM. DEL AHORRO', concepto: 'MEDICAMENTOS',   total: '$15,000', estado: 'VALIDADO' },
  { id: 2, uuid: 'A-203', proveedor: 'LAB. PISA',        concepto: 'MAT. CURACIÓN',  total: '$8,700',  estado: 'VALIDADO' },
  { id: 3, uuid: 'A-202', proveedor: 'NADRO',            concepto: 'MEDICAMENTOS',   total: '$10,000', estado: 'VALIDADO' },
  { id: 4, uuid: 'A-201', proveedor: 'PAPELERÍA NTE',    concepto: 'ÚTILES OFICINA', total: '$5,000',  estado: 'VALIDADO' },
];

const estadoClass = {
  VALIDADO:   'bg-emerald-100 text-emerald-700',
  PENDIENTE:  'bg-amber-100 text-amber-700',
  RECHAZADO:  'bg-rose-100 text-rose-700',
};

const FacturaElectronica = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('factura');
  const [facturas, setFacturas]   = useState(facturasMock);
  const [form, setForm]           = useState({
    uuid: '', fechaEmision: '', rfcProveedor: '',
    nombreProveedor: '', descripcion: '',
    iva: 0, subtotal: '',
  });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIva = (e) => {
    setForm(prev => ({ ...prev, iva: parseFloat(e.target.value) }));
  };

  const subtotalNum  = parseFloat(form.subtotal) || 0;
  const ivaNum       = subtotalNum * form.iva;
  const totalConIva  = subtotalNum + ivaNum;

  const formatMXN = (num) =>
    num > 0 ? `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '';

  const handleGuardar = () => {
    if (!form.uuid.trim() || !form.nombreProveedor.trim()) return;
    setFacturas(prev => [{
      id:        Date.now(),
      uuid:      form.uuid,
      proveedor: form.nombreProveedor.toUpperCase(),
      concepto:  form.descripcion.toUpperCase() || '—',
      total:     formatMXN(totalConIva) || '—',
      estado:    'PENDIENTE',
    }, ...prev]);
    setForm({ uuid: '', fechaEmision: '', rfcProveedor: '', nombreProveedor: '', descripcion: '', iva: 0, subtotal: '' });
  };

  const handleCancelar = () => {
    setForm({ uuid: '', fechaEmision: '', rfcProveedor: '', nombreProveedor: '', descripcion: '', iva: 0, subtotal: '' });
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
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Factura Electrónica</h2>

              {/* ── Formulario ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">

                {/* UUID */}
                <div>
                  <label className={labelClass}>UUID del CFDI<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                  <input name="uuid" value={form.uuid} onChange={handleChange}
                    placeholder="Ej. A-205 o UUID completo del CFDI"
                    className={inputClass} />
                </div>

                {/* Fecha + RFC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Fecha de Emisión<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input type="date" name="fechaEmision" value={form.fechaEmision}
                      onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>RFC del Proveedor<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input name="rfcProveedor" value={form.rfcProveedor} onChange={handleChange}
                      placeholder="Ej. FAH-920301-AB1" className={inputClass} />
                  </div>
                </div>

                {/* Nombre proveedor */}
                <div>
                  <label className={labelClass}>Nombre del Proveedor<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                  <input name="nombreProveedor" value={form.nombreProveedor} onChange={handleChange}
                    placeholder="Razón social del proveedor" className={inputClass} />
                </div>

                {/* Descripción */}
                <div>
                  <label className={labelClass}>Descripción del Producto o Servicio</label>
                  <input name="descripcion" value={form.descripcion} onChange={handleChange}
                    placeholder="Ej. Medicamentos, material de curación..." className={inputClass} />
                </div>

                {/* IVA */}
                <div>
                  <label className={labelClass}>IVA Aplicado</label>
                  <select value={form.iva} onChange={handleIva} className={inputClass}>
                    {ivaOpciones.map(op => (
                      <option key={op.valor} value={op.valor}>{op.label}</option>
                    ))}
                  </select>
                </div>

                {/* Subtotal + Total con IVA */}
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
                    <label className={labelClass}>Total con IVA ($)</label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100
                                    text-sm font-bold transition-all ${
                                      totalConIva > 0 ? 'text-[#7E1D3B]' : 'text-slate-400'
                                    }`}>
                      {totalConIva > 0 ? formatMXN(totalConIva) : '$0.00'}
                    </div>
                    {form.iva > 0 && subtotalNum > 0 && (
                      <p className="text-[10px] text-slate-400 mt-1 ml-0.5">
                        IVA ({(form.iva * 100).toFixed(0)}%): {formatMXN(ivaNum)}
                      </p>
                    )}
                  </div>
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
                    <Save size={15} /> Guardar CFDI
                  </button>
                </div>
              </section>

              {/* ── Tabla facturas ── */}
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
                    {facturas.map((f, i) => (
                      <tr key={f.id}
                        className={`border-b border-slate-100 hover:bg-[#7E1D3B]/3 transition ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-4 py-3 font-bold text-[#7E1D3B]">{f.uuid}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{f.proveedor}</td>
                        <td className="px-4 py-3 text-slate-600">{f.concepto}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{f.total}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${estadoClass[f.estado] || 'bg-slate-100 text-slate-500'}`}>
                            {f.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">{facturas.length} factura{facturas.length !== 1 ? 's' : ''} registrada{facturas.length !== 1 ? 's' : ''}</p>
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default FacturaElectronica;