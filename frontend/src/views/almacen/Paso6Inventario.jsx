import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, Edit2, Save, X, RefreshCw } from 'lucide-react';

const Paso6Inventario = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoStockMinimo, setNuevoStockMinimo] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/almacen/inventario');
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Error cargando inventario:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const clasificacion = (item) => {
    const t = `${item.categoria || ''} ${item.nombreArticulo || ''}`.toLowerCase();
    return (t.includes('literatura') || t.includes('medalla') || t.includes('reactivo') || t.includes('antidoping'))
      ? 'Extraordinaria' : 'Ordinaria';
  };

  const caducidad = (fecha) => {
    if (!fecha) return { texto: '—', clase: 'text-slate-400' };
    const d = Array.isArray(fecha)
      ? new Date(fecha[0], fecha[1] - 1, fecha[2])
      : new Date(fecha);
    const dias = Math.ceil((d - new Date()) / 86400000);
    if (dias < 0) return { texto: '¡Caducado!', clase: 'text-rose-600 font-bold' };
    if (dias <= 30) return { texto: `${dias}d`, clase: 'text-amber-600 font-semibold' };
    return { texto: d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' }), clase: 'text-slate-600' };
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    if (Array.isArray(fecha))
      return `${fecha[0]}-${String(fecha[1]).padStart(2, '0')}-${String(fecha[2]).padStart(2, '0')}`;
    return fecha;
  };

  const guardarStockMinimo = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/almacen/inventario/stock-minimo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nivelMinimoAlerta: parseInt(nuevoStockMinimo) }),
      });
      if (!res.ok) throw new Error();
      setItems(prev => prev.map(i => i.id === id ? { ...i, nivelMinimoAlerta: parseInt(nuevoStockMinimo) } : i));
      setEditandoId(null);
    } catch {
      alert('No se pudo guardar el stock mínimo.');
    }
  };

  const filtrados = items.filter(item => {
    const texto = `${item.nombreArticulo || ''} ${item.categoria || ''}`.toLowerCase();
    const coincideTexto = texto.includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === 'Todos' || clasificacion(item) === filtroTipo;
    return coincideTexto && coincideTipo;
  });

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Encabezado */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Almacén</p>
          <h2 className="text-xl font-black text-slate-900">Inventario Maestro</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#7E1D3B]/40">
              <option value="Todos">Todas</option>
              <option value="Ordinaria">Ordinaria</option>
              <option value="Extraordinaria">Extraordinaria</option>
            </select>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Buscar…" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              className="pl-8 pr-3 py-2 w-48 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#7E1D3B]/40" />
          </div>
          <button onClick={cargar} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <RefreshCw size={14} /> Actualizar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#7E1D3B] text-white">
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Artículo</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Ubicación</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Lote</th>
              <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.15em]">Caducidad</th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-[0.15em]">Tipo</th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-[0.15em]">Mín.</th>
              <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-[0.15em]">Stock</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400">Cargando inventario…</td>
              </tr>
            ) : filtrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                  {items.length === 0 ? 'El inventario está vacío.' : 'Sin resultados para esa búsqueda.'}
                </td>
              </tr>
            ) : filtrados.map((item, idx) => {
              const minimo = item.nivelMinimoAlerta ?? 0;
              const stockCritico = item.cantidadDisponible <= minimo;
              const cad = caducidad(item.fechaCaducidad);
              const tipo = clasificacion(item);
              const zona = item.zonaAlmacen
                ? item.zonaAlmacen.replace('General - ', '').replace('Médico - ', '')
                : null;

              return (
                <tr key={item.id}
                  className={`border-t border-slate-100 transition hover:bg-[#7E1D3B]/[0.03] ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} ${stockCritico ? 'border-l-2 border-l-rose-400' : ''}`}>

                  {/* Artículo */}
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.nombreArticulo || '—'}</td>

                  {/* Categoría */}
                  <td className="px-4 py-3 text-slate-500 text-xs">{item.categoria || '—'}</td>

                  {/* Ubicación */}
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {zona ? (
                      <span>
                        {zona}{item.estante ? <span className="text-slate-400"> · {item.estante}</span> : null}
                      </span>
                    ) : (
                      <span className="text-amber-500 font-semibold">Sin asignar</span>
                    )}
                  </td>

                  {/* Lote */}
                  <td className="px-4 py-3 text-xs text-slate-500">{item.lote || '—'}</td>

                  {/* Caducidad */}
                  <td className="px-4 py-3 text-xs">
                    <span className={cad.clase}>{formatFecha(item.fechaCaducidad)}</span>
                    {item.fechaCaducidad && (
                      <span className={`ml-1.5 text-[10px] ${cad.clase}`}>({cad.texto})</span>
                    )}
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                      tipo === 'Ordinaria'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}>
                      {tipo}
                    </span>
                  </td>

                  {/* Mínimo editable */}
                  <td className="px-4 py-3 text-center">
                    {editandoId === item.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input type="number" min="0" value={nuevoStockMinimo}
                          onChange={e => setNuevoStockMinimo(e.target.value)}
                          autoFocus
                          className="w-14 rounded-lg border border-[#7E1D3B]/40 bg-rose-50 px-2 py-1 text-center text-sm font-bold outline-none" />
                        <button onClick={() => guardarStockMinimo(item.id)}
                          className="rounded-lg bg-emerald-100 p-1 text-emerald-700 hover:bg-emerald-200">
                          <Save size={12} />
                        </button>
                        <button onClick={() => setEditandoId(null)}
                          className="rounded-lg bg-rose-100 p-1 text-rose-700 hover:bg-rose-200">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditandoId(item.id); setNuevoStockMinimo(minimo); }}
                        className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                        {minimo}
                        <Edit2 size={11} className="text-slate-300 group-hover:text-[#7E1D3B]" />
                      </button>
                    )}
                  </td>

                  {/* Stock actual */}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-black ${stockCritico ? 'text-rose-600' : 'text-slate-800'}`}>
                      {item.cantidadDisponible ?? 0}
                    </span>
                    <span className="ml-1 text-[10px] text-slate-400 uppercase">{item.unidadMedida || 'pza'}</span>
                    {stockCritico && (
                      <div className="mt-0.5 flex items-center justify-center gap-1 text-[9px] font-bold text-rose-600">
                        <AlertTriangle size={9} /> Crítico
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer con conteo */}
      {!loading && filtrados.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-2.5 text-xs text-slate-400">
          {filtrados.length} artículo(s)
          {filtrados.filter(i => (i.cantidadDisponible ?? 0) <= (i.nivelMinimoAlerta ?? 0)).length > 0 && (
            <span className="ml-3 font-semibold text-rose-500">
              · {filtrados.filter(i => (i.cantidadDisponible ?? 0) <= (i.nivelMinimoAlerta ?? 0)).length} con stock crítico
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Paso6Inventario;
