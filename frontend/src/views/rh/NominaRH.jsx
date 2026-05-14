import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, UserMinus, Tag, ShieldCheck, Wallet,
  Upload, FileSpreadsheet, X, AlertCircle,
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',    icon: UserPlus,    key: 'alta',       path: '/rh/alta-personal' },
  { label: 'Baja de Personal',    icon: UserMinus,   key: 'baja',       path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',   icon: Tag,         key: 'catalogo',   path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles', icon: ShieldCheck, key: 'asignacion', path: '/rh/asignacion-roles' },
  { label: 'Nómina',              icon: Wallet,      key: 'nomina',     path: '/rh/nomina' },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n) =>
  Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

/** Devuelve el separador predominante de un texto CSV (coma o punto y coma). */
const detectarSeparador = (linea) => (linea.split(';').length > linea.split(',').length ? ';' : ',');

/** Parsea texto CSV básico (sin saltos de línea dentro de campos). */
function parseCsv(texto) {
  const lineas = texto.trim().split(/\r?\n/);
  if (lineas.length < 2) return { encabezados: [], filas: [] };
  const sep = detectarSeparador(lineas[0]);
  const encabezados = lineas[0].split(sep).map((h) => h.trim().replace(/^"|"$/g, ''));
  const filas = lineas.slice(1)
    .filter((l) => l.trim())
    .map((l) => {
      const vals = l.split(sep).map((v) => v.trim().replace(/^"|"$/g, ''));
      return encabezados.reduce((obj, h, i) => ({ ...obj, [h]: vals[i] ?? '' }), {});
    });
  return { encabezados, filas };
}

/** Busca un elemento por localName dentro del documento XML. */
const byLocal = (nodo, nombre) =>
  Array.from(nodo.getElementsByTagName('*')).find((el) => el.localName === nombre);

const todosByLocal = (nodo, nombre) =>
  Array.from(nodo.getElementsByTagName('*')).filter((el) => el.localName === nombre);

/** Parsea uno o varios CFDI de nómina desde texto XML. */
function parseXmlNomina(texto) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(texto, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('El archivo XML no es válido.');

  // Busca todos los Comprobante (pueden estar en la raíz o anidados en un wrapper)
  const comprobantes = todosByLocal(doc, 'Comprobante');
  if (comprobantes.length === 0) throw new Error('No se encontraron comprobantes CFDI en el archivo.');

  const registros = [];

  comprobantes.forEach((comp) => {
    const receptor  = byLocal(comp, 'Receptor');
    const nomina    = byLocal(comp, 'Nomina');
    if (!nomina) return; // no es nómina

    const percepciones = byLocal(nomina, 'Percepciones');
    const deducciones  = byLocal(nomina, 'Deducciones');

    const totalPerc = percepciones
      ? (parseFloat(percepciones.getAttribute('TotalSueldos') || 0) +
         parseFloat(percepciones.getAttribute('TotalSeparacionIndemnizacion') || 0) +
         parseFloat(percepciones.getAttribute('TotalJubilacionPensionRetiro') || 0))
      : parseFloat(comp.getAttribute('SubTotal') || 0);

    const totalDed = deducciones
      ? (parseFloat(deducciones.getAttribute('TotalOtrasDeducciones') || 0) +
         parseFloat(deducciones.getAttribute('TotalImpuestosRetenidos') || 0))
      : 0;

    registros.push({
      nombre:      receptor?.getAttribute('Nombre') || receptor?.getAttribute('NombreReceptor') || 'Sin nombre',
      rfc:         receptor?.getAttribute('Rfc') || '—',
      numEmpleado: receptor?.getAttribute('NumEmpleado') || '—',
      tipoPeriodo: nomina.getAttribute('TipoNomina') === 'O' ? 'Ordinaria' : 'Extraordinaria',
      numDias:     nomina.getAttribute('NumDiasPagados') || '—',
      fechaPago:   (nomina.getAttribute('FechaPago') || comp.getAttribute('Fecha') || '').slice(0, 10),
      percepciones: totalPerc,
      deducciones:  totalDed,
      neto:         parseFloat(comp.getAttribute('Total') || 0),
    });
  });

  if (registros.length === 0) throw new Error('El XML no contiene recibos de nómina (complemento Nomina12).');
  return registros;
}

// ── Componente ─────────────────────────────────────────────────────────────

const NominaRH = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem('marakame_user');
  const nombreUsuario = userData ? JSON.parse(userData)?.nombreCompleto : null;

  const [activeNav, setActiveNav] = useState('nomina');
  const [archivo,   setArchivo]   = useState(null);
  const [tipo,      setTipo]      = useState(null);   // 'csv' | 'xml'
  const [xmlDatos,  setXmlDatos]  = useState([]);
  const [csvDatos,  setCsvDatos]  = useState({ encabezados: [], filas: [] });
  const [error,     setError]     = useState('');
  const [dragOver,  setDragOver]  = useState(false);
  const fileRef = useRef(null);

  const handleNavClick = (item) => { setActiveNav(item.key); navigate(item.path); };

  const procesarArchivo = (file) => {
    if (!file) return;
    setError('');
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xml'].includes(ext)) {
      setError('Formato no soportado. Carga un archivo CSV o XML (CFDI nómina).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const texto = e.target.result;
      try {
        if (ext === 'csv') {
          const parsed = parseCsv(texto);
          if (parsed.filas.length === 0) { setError('El CSV no contiene datos.'); return; }
          setCsvDatos(parsed);
          setTipo('csv');
        } else {
          const registros = parseXmlNomina(texto);
          setXmlDatos(registros);
          setTipo('xml');
        }
        setArchivo(file);
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const limpiar = () => {
    setArchivo(null); setTipo(null);
    setXmlDatos([]); setCsvDatos({ encabezados: [], filas: [] });
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const totalPerc = xmlDatos.reduce((s, r) => s + r.percepciones, 0);
  const totalDed  = xmlDatos.reduce((s, r) => s + r.deducciones,  0);
  const totalNeto = xmlDatos.reduce((s, r) => s + r.neto,         0);

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
                <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Módulo de Recursos Humanos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
                <span className="text-sm font-black text-[#7E1D3B]">RH</span>
              </div>
              <div className="text-right md:text-left">
                <p className="text-xs text-slate-500">Sesión activa{nombreUsuario ? ` - ${nombreUsuario}` : ''}</p>
                <p className="font-semibold text-slate-700">Recursos Humanos</p>
              </div>
            </div>
          </div>

          {/* ── Layout ── */}
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">

            {/* Sidebar */}
            <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
              {navItems.map(({ label, icon, key, path }) => (
                <button key={key} onClick={() => handleNavClick({ key, path })}
                  className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                    activeNav === key
                      ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                      : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                  }`}>
                  {React.createElement(icon, { size: 15 })}
                  {label}
                </button>
              ))}
            </aside>

            {/* Main */}
            <main className="space-y-5">

              {/* Título sección */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Nómina — Nomipak</h2>
              </div>

              {/* Zona de carga */}
              {!archivo && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); procesarArchivo(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-14 text-center transition-all ${
                    dragOver
                      ? 'border-[#7E1D3B] bg-[#7E1D3B]/5'
                      : 'border-slate-200 bg-white hover:border-[#7E1D3B]/50 hover:bg-slate-50'
                  }`}
                >
                  <input ref={fileRef} type="file" accept=".csv,.xml" className="hidden"
                    onChange={(e) => procesarArchivo(e.target.files[0])} />
                  <Upload size={34} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-bold text-slate-700 mb-1">Arrastra el archivo de nómina aquí</p>
                  <p className="text-sm text-slate-400 mb-3">o haz clic para seleccionarlo</p>
                  <div className="inline-flex gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 uppercase tracking-wide">.CSV</span>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 uppercase tracking-wide">.XML (CFDI)</span>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
                  <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-700 font-medium">{error}</p>
                </div>
              )}

              {/* Archivo cargado */}
              {archivo && (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-emerald-600 shrink-0" />
                    <span className="text-sm font-semibold text-emerald-800">{archivo.name}</span>
                    <span className="text-xs text-emerald-600">({(archivo.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button onClick={limpiar} title="Quitar archivo"
                    className="p-1.5 rounded-lg hover:bg-emerald-100 transition">
                    <X size={14} className="text-emerald-700" />
                  </button>
                </div>
              )}

              {/* ── Vista XML (CFDI) ── */}
              {tipo === 'xml' && xmlDatos.length > 0 && (
                <>
                  {/* Tarjetas resumen */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">Total Percepciones</p>
                      <p className="text-2xl font-black text-emerald-600">{fmt(totalPerc)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{xmlDatos.length} empleado{xmlDatos.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">Total Deducciones</p>
                      <p className="text-2xl font-black text-rose-500">{fmt(totalDed)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">ISR · IMSS · Otros</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">Neto a Dispersar</p>
                      <p className="text-2xl font-black text-[#7E1D3B]">{fmt(totalNeto)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Transferencia bancaria</p>
                    </div>
                  </div>

                  {/* Tabla empleados */}
                  <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                      <div className="h-4 w-1 rounded-full bg-[#7E1D3B]" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Detalle por Empleado</h3>
                      <span className="ml-auto text-xs text-slate-400 font-semibold">{xmlDatos.length} registros</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                            <th className="px-5 py-3">Empleado</th>
                            <th className="px-5 py-3">RFC</th>
                            <th className="px-5 py-3">No. Emp.</th>
                            <th className="px-5 py-3">Fecha Pago</th>
                            <th className="px-5 py-3">Días</th>
                            <th className="px-5 py-3 text-right">Percepciones</th>
                            <th className="px-5 py-3 text-right">Deducciones</th>
                            <th className="px-5 py-3 text-right">Neto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {xmlDatos.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-5 py-3.5 font-semibold text-slate-800">{r.nombre}</td>
                              <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{r.rfc}</td>
                              <td className="px-5 py-3.5 text-slate-500">{r.numEmpleado}</td>
                              <td className="px-5 py-3.5 text-slate-500">{r.fechaPago || '—'}</td>
                              <td className="px-5 py-3.5 text-slate-500">{r.numDias}</td>
                              <td className="px-5 py-3.5 text-right font-semibold text-emerald-600">{fmt(r.percepciones)}</td>
                              <td className="px-5 py-3.5 text-right font-semibold text-rose-500">{fmt(r.deducciones)}</td>
                              <td className="px-5 py-3.5 text-right font-black text-[#7E1D3B]">{fmt(r.neto)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                            <td colSpan={5} className="px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-slate-500">Totales</td>
                            <td className="px-5 py-3 text-right font-black text-emerald-600">{fmt(totalPerc)}</td>
                            <td className="px-5 py-3 text-right font-black text-rose-500">{fmt(totalDed)}</td>
                            <td className="px-5 py-3 text-right font-black text-[#7E1D3B]">{fmt(totalNeto)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* ── Vista CSV ── */}
              {tipo === 'csv' && csvDatos.filas.length > 0 && (
                <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-[#7E1D3B]" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-700">Datos del archivo</h3>
                    <span className="ml-auto text-xs text-slate-400 font-semibold">{csvDatos.filas.length} registros · {csvDatos.encabezados.length} columnas</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                          {csvDatos.encabezados.map((h) => (
                            <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {csvDatos.filas.map((fila, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                            {csvDatos.encabezados.map((h) => (
                              <td key={h} className="px-4 py-3 text-slate-700 whitespace-nowrap">{fila[h]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </main>
          </div>
        </header>
      </div>
    </div>
  );
};

export default NominaRH;
