import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, ScanLine, AlertCircle, Receipt, FileCheck,
  PackageSearch, Landmark, Save, X
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Archivo Contable',        icon: FolderOpen,   key: 'archivo',      path: '/financiero/archivo-contable' },
  { label: 'Digitalizar Comprobantes',icon: ScanLine,     key: 'digitalizar',  path: '/financiero/digitalizar-comprobantes' },
  { label: 'Gestionar Correcciones',  icon: AlertCircle,  key: 'correcciones', path: '/financiero/gestionar-correcciones' },
  { label: 'Factura Electrónica',     icon: Receipt,      key: 'factura',      path: '/financiero/factura-electronica' },
  { label: 'Comprobantes Fiscales',   icon: FileCheck,    key: 'comprobantes', path: '/financiero/comprobantes-fiscales' },
  { label: 'Requisiciones Almacén',   icon: PackageSearch,key: 'requisiciones',path: '/financiero/requisiciones-almacen' },
  { label: 'Depósito Bancario',       icon: Landmark,     key: 'deposito',     path: '/financiero/deposito-bancario' },
];

const registrosMock = [
  { id: 1, folio: 'MK-0111', concepto: 'Pago de servicios', monto: '+11,000', estado: 'En proceso' },
  { id: 2, folio: 'MK-0321', concepto: 'Factura #231',      monto: '-2,000',  estado: 'OK' },
  { id: 3, folio: 'MK-8721', concepto: 'Depósito',          monto: '+30,000', estado: 'En proceso' },
];

const estadoClass = {
  'En proceso': 'bg-amber-100 text-amber-700',
  'OK':         'bg-emerald-100 text-emerald-700',
  'Rechazado':  'bg-rose-100 text-rose-700',
};

const montoClass = (monto) =>
  monto.startsWith('+') ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';

const tiposMovimiento   = ['Ingreso', 'Egreso', 'Transferencia', 'Depósito', 'Factura'];
const fuentesFinanc     = ['Gobierno del Estado', 'Cuotas de recuperación', 'Donaciones', 'Subsidio Federal', 'Otros'];

const ArchivoContable = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('archivo');
  const [registros, setRegistros] = useState(registrosMock);
  const [form, setForm] = useState({
    folio: '', fecha: '', concepto: '',
    tipoMovimiento: '', fuente: '',
    monto: '', responsable: '', observaciones: '',
  });

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    if (!form.folio.trim() || !form.concepto.trim()) return;
    const nuevo = {
      id:       Date.now(),
      folio:    form.folio,
      concepto: form.concepto,
      monto:    form.tipoMovimiento === 'Egreso' ? `-${form.monto}` : `+${form.monto}`,
      estado:   'En proceso',
    };
    setRegistros(prev => [nuevo, ...prev]);
    setForm({ folio: '', fecha: '', concepto: '', tipoMovimiento: '', fuente: '', monto: '', responsable: '', observaciones: '' });
  };

  const handleCancelar = () => {
    setForm({ folio: '', fecha: '', concepto: '', tipoMovimiento: '', fuente: '', monto: '', responsable: '', observaciones: '' });
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
                  {React.createElement(icon, { size: 15, className: 'shrink-0' })}
                  <span>{label}</span>
                </button>
              ))}
            </aside>

            {/* ── Main ── */}
            <main className="space-y-5">

              {/* ── Formulario nuevo registro ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                  <h2 className="text-base font-black uppercase tracking-[0.2em] text-slate-700">Nuevo Registro Contable</h2>
                </div>

                {/* Folio + Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Folio / Clave<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input name="folio" value={form.folio} onChange={handleChange}
                      placeholder="Ej. MK-0001" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Fecha<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                {/* Concepto */}
                <div className="mb-4">
                  <label className={labelClass}>Concepto<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                  <textarea name="concepto" value={form.concepto} onChange={handleChange}
                    rows={3} placeholder="Descripción del movimiento..."
                    className={`${inputClass} resize-none`} />
                </div>

                {/* Tipo movimiento + Fuente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Tipo de Movimiento<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <select name="tipoMovimiento" value={form.tipoMovimiento} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar</option>
                      {tiposMovimiento.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Fuente de Financiamiento</label>
                    <select name="fuente" value={form.fuente} onChange={handleChange} className={inputClass}>
                      <option value="">Seleccionar</option>
                      {fuentesFinanc.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                {/* Monto + Responsable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Monto<span className="text-[#7E1D3B] ml-0.5">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">$</span>
                      <input type="number" name="monto" value={form.monto} onChange={handleChange}
                        placeholder="0.00" min={0} step={0.01}
                        className={`${inputClass} pl-7`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Responsable</label>
                    <input name="responsable" value={form.responsable} onChange={handleChange}
                      placeholder="Nombre del responsable" className={inputClass} />
                  </div>
                </div>

                {/* Observaciones */}
                <div className="mb-5">
                  <label className={labelClass}>Observaciones</label>
                  <textarea name="observaciones" value={form.observaciones} onChange={handleChange}
                    rows={3} placeholder="Notas adicionales..."
                    className={`${inputClass} resize-none`} />
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
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

              {/* ── Tabla de registros ── */}
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
                  <p className="text-xs text-slate-400 font-medium">{registros.length} registro{registros.length !== 1 ? 's' : ''}</p>
                </div>
              </section>

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ArchivoContable;