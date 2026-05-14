import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, UserMinus, Tag, ShieldCheck, Wallet,
  Upload, FileText, X, AlertCircle, TrendingUp, TrendingDown, DollarSign,
  AlertTriangle, ClipboardList,
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',     icon: UserPlus,      key: 'alta',              path: '/rh/alta-personal' },
  { label: 'Baja de Personal',     icon: UserMinus,     key: 'baja',              path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',    icon: Tag,           key: 'catalogo',          path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles',  icon: ShieldCheck,   key: 'asignacion',        path: '/rh/asignacion-roles' },
  { label: 'Nómina',               icon: Wallet,        key: 'nomina',            path: '/rh/nomina' },
  { label: 'Registrar Incidencia', icon: AlertTriangle, key: 'incidencias',       path: '/rh/registrar-incidencia' },
  { label: 'Tabla de Incidencias', icon: ClipboardList, key: 'tabla-incidencias', path: '/rh/tabla-incidencias' },
];

const fmt = (n) =>
  Number(n).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const parseCSV = (text) => {
  const lines = text.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return null;
  const sep = lines[0].split(';').length > lines[0].split(',').length ? ';' : ',';
  const headers = lines[0].split(sep).map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(sep).map((v) => v.trim().replace(/^"|"$/g, ''));
    return headers.reduce((obj, h, i) => ({ ...obj, [h]: values[i] ?? '' }), {});
  });
  return { headers, rows };
};

const parseCFDIXML = (text) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  const allEls = (root) => [...root.getElementsByTagName('*')];

  const nominaNode = allEls(doc).find((el) => el.localName === 'Nomina');
  if (!nominaNode) return null;

  const receptorNode    = allEls(nominaNode).find((el) => el.localName === 'Receptor');
  const percepcionesNode = allEls(nominaNode).find((el) => el.localName === 'Percepciones');
  const deduccionesNode  = allEls(nominaNode).find((el) => el.localName === 'Deducciones');

  const totalGravado      = parseFloat(percepcionesNode?.getAttribute('TotalGravado') || 0);
  const totalExento       = parseFloat(percepcionesNode?.getAttribute('TotalExento')  || 0);
  const totalPercepciones = totalGravado + totalExento ||
    parseFloat(percepcionesNode?.getAttribute('TotalSueldos') || 0) +
    parseFloat(percepcionesNode?.getAttribute('TotalSeparacionIndemnizacion') || 0) +
    parseFloat(percepcionesNode?.getAttribute('TotalJubilacionPensionRetiro') || 0);

  const totalImpuestos    = parseFloat(deduccionesNode?.getAttribute('TotalImpuestosRetenidos') || 0);
  const totalOtras        = parseFloat(deduccionesNode?.getAttribute('TotalOtrasDeducciones')   || 0);
  const totalDeducciones  = totalImpuestos + totalOtras;

  const comprobanteNeto =
    parseFloat(doc.documentElement.getAttribute('Total') || 0) ||
    totalPercepciones - totalDeducciones;

  return {
    empleado: {
      nombre:      receptorNode?.getAttribute('Nombre')      || '—',
      rfc:         receptorNode?.getAttribute('Rfc')         || '—',
      curp:        receptorNode?.getAttribute('Curp')        || receptorNode?.getAttribute('CURP') || '—',
      numEmpleado: receptorNode?.getAttribute('NumEmpleado') || '—',
      departamento:receptorNode?.getAttribute('Departamento')|| '—',
      puesto:      receptorNode?.getAttribute('Puesto')      || '—',
    },
    totalPercepciones,
    totalDeducciones,
    neto: comprobanteNeto,
    percepciones: percepcionesNode
      ? allEls(percepcionesNode)
          .filter((el) => el.localName === 'Percepcion')
          .map((p) => ({
            concepto: p.getAttribute('Concepto') || '—',
            gravado:  parseFloat(p.getAttribute('ImporteGravado') || 0),
            exento:   parseFloat(p.getAttribute('ImporteExento')  || 0),
          }))
      : [],
    deducciones: deduccionesNode
      ? allEls(deduccionesNode)
          .filter((el) => el.localName === 'Deduccion')
          .map((d) => ({
            concepto: d.getAttribute('Concepto') || '—',
            importe:  parseFloat(d.getAttribute('Importe') || 0),
          }))
      : [],
  };
};

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const SummaryCard = ({ label, value, colorClass, icon: Icon }) => (
  <div className={`rounded-2xl border p-5 flex items-center gap-4 ${colorClass}`}>
    <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-70">{label}</p>
      <p className="text-xl font-black mt-0.5">{value}</p>
    </div>
  </div>
);

const NominaRH = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('nomina');
  const [archivo, setArchivo]     = useState(null);
  const [parseResult, setParseResult] = useState(null);
  const [error, setError]         = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef = useRef(null);

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    navigate(item.path);
  };

  const processFile = useCallback((file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xml', 'csv'].includes(ext)) {
      setError('Formato no soportado. Sube un archivo .xml (CFDI) o .csv exportado de Nomipaq.');
      return;
    }
    setError(null);
    setArchivo({ name: file.name, size: file.size });
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (ext === 'xml') {
        const data = parseCFDIXML(text);
        if (!data) {
          setError('No se pudo leer el XML. Verifica que sea un CFDI de nómina (nomina12).');
          setParseResult(null);
        } else {
          setParseResult({ type: 'xml', data });
        }
      } else {
        const data = parseCSV(text);
        if (!data) {
          setError('No se pudo leer el CSV. Verifica que el archivo tenga encabezados y datos.');
          setParseResult(null);
        } else {
          setParseResult({ type: 'csv', data });
        }
      }
    };
    reader.readAsText(file, 'utf-8');
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      processFile(e.dataTransfer.files[0]);
    },
    [processFile],
  );

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleLimpiar = () => {
    setArchivo(null);
    setParseResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">

        {/* ── Header ── */}
        <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-3">
              <img
                src={marakameLogo}
                alt="Logo Nayarit Marakame"
                className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                  Módulo de Recursos Humanos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <span className="text-sm font-black text-[#7E1D3B]">RH</span>
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">Sesión activa</p>
                <p className="font-semibold text-slate-700">Recursos Humanos</p>
              </div>
            </div>
          </div>

          {/* ── Layout ── */}
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* Sidebar */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon, key, path }) => (
                <button
                  key={key}
                  onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}
                >
                  {React.createElement(icon, { size: 15 })}
                  {label}
                </button>
              ))}
            </aside>

            {/* Main */}
            <main className="space-y-5">

              <div>
                <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
                <p className="text-sm text-slate-400 font-medium tracking-wide">
                  Carga y Visualización de Nómina
                </p>
              </div>

              {/* ── Zona de carga ── */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <SectionTitle title="Cargar Archivo de Nómina" />

                {!archivo ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center
                      cursor-pointer transition-all select-none
                      ${dragOver
                        ? 'border-[#7E1D3B] bg-[#7E1D3B]/5'
                        : 'border-slate-300 hover:border-[#7E1D3B]/50 hover:bg-slate-50'}`}
                  >
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                      <Upload size={24} className="text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-700 text-base">
                      Arrastra el archivo aquí
                    </p>
                    <p className="text-sm text-slate-400 mt-1">o haz clic para seleccionar</p>
                    <p className="text-xs text-slate-300 mt-3 font-medium uppercase tracking-wider">
                      Formatos aceptados: .xml (CFDI nómina) &nbsp;·&nbsp; .csv
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xml,.csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="h-10 w-10 rounded-xl bg-[#7E1D3B]/10 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-[#7E1D3B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{archivo.name}</p>
                      <p className="text-xs text-slate-400">{(archivo.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={handleLimpiar}
                      className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}
              </section>

              {/* ── Resultado XML (CFDI nómina12) ── */}
              {parseResult?.type === 'xml' && (
                <>
                  {/* Tarjetas resumen */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryCard
                      label="Total Percepciones"
                      value={fmt(parseResult.data.totalPercepciones)}
                      colorClass="bg-emerald-50 border-emerald-200 text-emerald-800"
                      icon={TrendingUp}
                    />
                    <SummaryCard
                      label="Total Deducciones"
                      value={fmt(parseResult.data.totalDeducciones)}
                      colorClass="bg-red-50 border-red-200 text-red-800"
                      icon={TrendingDown}
                    />
                    <SummaryCard
                      label="Neto a Pagar"
                      value={fmt(parseResult.data.neto)}
                      colorClass="bg-[#7E1D3B]/5 border-[#7E1D3B]/20 text-[#7E1D3B]"
                      icon={DollarSign}
                    />
                  </div>

                  {/* Datos del empleado */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <SectionTitle title="Datos del Empleado" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                      {[
                        ['Nombre',        parseResult.data.empleado.nombre],
                        ['RFC',           parseResult.data.empleado.rfc],
                        ['CURP',          parseResult.data.empleado.curp],
                        ['No. Empleado',  parseResult.data.empleado.numEmpleado],
                        ['Departamento',  parseResult.data.empleado.departamento],
                        ['Puesto',        parseResult.data.empleado.puesto],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-slate-800">{val}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Tabla de percepciones */}
                  {parseResult.data.percepciones.length > 0 && (
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <SectionTitle title="Percepciones" />
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Concepto</th>
                              <th className="px-4 py-3 text-right font-semibold">Gravado</th>
                              <th className="px-4 py-3 text-right font-semibold">Exento</th>
                              <th className="px-4 py-3 text-right font-semibold">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {parseResult.data.percepciones.map((p, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-3 text-slate-700">{p.concepto}</td>
                                <td className="px-4 py-3 text-right text-slate-600">{fmt(p.gravado)}</td>
                                <td className="px-4 py-3 text-right text-slate-600">{fmt(p.exento)}</td>
                                <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                                  {fmt(p.gravado + p.exento)}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-emerald-50 font-black">
                              <td className="px-4 py-3 text-slate-700" colSpan={3}>
                                Total Percepciones
                              </td>
                              <td className="px-4 py-3 text-right text-emerald-800">
                                {fmt(parseResult.data.totalPercepciones)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  {/* Tabla de deducciones */}
                  {parseResult.data.deducciones.length > 0 && (
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <SectionTitle title="Deducciones" />
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold">Concepto</th>
                              <th className="px-4 py-3 text-right font-semibold">Importe</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {parseResult.data.deducciones.map((d, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-3 text-slate-700">{d.concepto}</td>
                                <td className="px-4 py-3 text-right text-red-600">{fmt(d.importe)}</td>
                              </tr>
                            ))}
                            <tr className="bg-red-50 font-black">
                              <td className="px-4 py-3 text-slate-700">Total Deducciones</td>
                              <td className="px-4 py-3 text-right text-red-800">
                                {fmt(parseResult.data.totalDeducciones)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* ── Resultado CSV ── */}
              {parseResult?.type === 'csv' && (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                      Datos de Nómina &mdash; {parseResult.data.rows.length} registros
                    </h2>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                        <tr>
                          {parseResult.data.headers.map((h) => (
                            <th key={h} className="px-4 py-3 text-left font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parseResult.data.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition">
                            {parseResult.data.headers.map((h) => (
                              <td key={h} className="px-4 py-3 text-slate-700">
                                {row[h]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default NominaRH;
