import React, { useState, useRef } from 'react';
import { FileCheck, ArrowRight, UploadCloud, CheckCircle, Loader2, Building2, Trash2, Package } from 'lucide-react';

const Paso4ContraRecibo = ({ setActiveTab, recepcionActiva, articulosParaInventario }) => {
  const [guardando, setGuardando] = useState(false);
  const [folioFisico, setFolioFisico] = useState('');
  const [archivoEscaneado, setArchivoEscaneado] = useState(null);
  const fileInputRef = useRef(null);

  const manejarSubida = (e) => {
    const file = e.target.files[0];
    if (file) setArchivoEscaneado(file);
  };

  const guardarEnInventario = async (e) => {
    e.preventDefault();
    if (!folioFisico || !archivoEscaneado) {
      alert("Debes ingresar el folio y subir el archivo.");
      return;
    }
    
    if (!articulosParaInventario || articulosParaInventario.length === 0) {
        alert("No hay artículos verificados para ingresar al inventario.");
        return;
    }

    setGuardando(true);
    try {
      const promesasGuardado = articulosParaInventario.map(articulo => {
        
        // --- AQUÍ ESTÁ LA CONEXIÓN REAL CON EL PASO 1 ---
        const articuloParaJava = {
          nombreArticulo: articulo.articuloNombre, 
          cantidadDisponible: articulo.stock,      
          // Usamos la unidad que seleccionaste en el Paso 1, o la que traía por defecto
          unidadMedida: recepcionActiva?.unidadMedida || articulo.unidad,           
          categoria: 'Almacén General',
          lote: `L-${Math.floor(Math.random() * 10000)}`, // Lote dinámico simulado
          
          // CONECTADO A LAS VARIABLES DEL PASO 1:
          fechaCaducidad: recepcionActiva?.caducidad || null,
          cuidadosEspeciales: recepcionActiva?.cuidadosEspeciales || 'Ninguno (Temp. Ambiente)'
        };

        return fetch('http://localhost:4000/api/almacen/inventario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articuloParaJava)
        });
      });

      const resultados = await Promise.all(promesasGuardado);
      
      const hayErrores = resultados.some(res => !res.ok);
      if (hayErrores) throw new Error("Algunos artículos no se pudieron guardar");

      alert(`¡Éxito! ${articulosParaInventario.length} artículo(s) ingresado(s) al Inventario Digital.`);
      setActiveTab('paso5');

    } catch (error) {
      console.error(error);
      alert("Error al conectar con la base de datos.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#7E1D3B]" />
          Paso 4: Registro de Contra-recibo
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50 flex justify-center">
        <form onSubmit={guardarEnInventario} className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
          
          {/* COLUMNA IZQUIERDA: RESUMEN */}
          <div className="flex-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Building2 className="w-3 h-3" /> Resumen de Recepción
              </h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Proveedor (P1)</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{recepcionActiva?.proveedor || 'No detectado'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Factura (P1)</p>
                  <p className="text-xs font-bold text-slate-700">{recepcionActiva?.folio || 'Sin folio'}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex justify-between items-end mb-2 shrink-0">
                      <p className="text-[9px] text-[#7E1D3B] uppercase font-black flex items-center gap-1">
                        <Package className="w-3 h-3" /> Artículos Verificados (P2)
                      </p>
                      <span className="text-[10px] font-bold bg-[#7E1D3B]/10 text-[#7E1D3B] px-2 py-0.5 rounded-full">
                          Total: {articulosParaInventario?.length || 0}
                      </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                      {articulosParaInventario && articulosParaInventario.length > 0 ? (
                          articulosParaInventario.map((art, idx) => (
                              <div key={idx} className="bg-[#7E1D3B]/5 p-3 rounded-xl border border-[#7E1D3B]/10 flex justify-between items-center">
                                  <p className="text-sm font-bold text-slate-800 line-clamp-1 flex-1 pr-2">
                                      {art.articuloNombre}
                                  </p>
                                  <div className="text-right shrink-0">
                                      <span className="text-sm font-black text-[#7E1D3B]">+{art.stock}</span>
                                      <span className="text-[9px] text-slate-500 ml-1">{art.unidad}</span>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="text-center py-6 text-slate-400">
                              <p className="text-xs">No hay artículos para ingresar.</p>
                          </div>
                      )}
                  </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: CAPTURA FÍSICA */}
          <div className="flex-1 lg:max-w-md space-y-6 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
              <div className="mb-6">
                <label className="block text-[10px] font-black text-[#7E1D3B] uppercase mb-2">Folio de Contra-recibo Físico</label>
                <input 
                  type="text" required placeholder="Ej. 1386"
                  className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-bold"
                  value={folioFisico} onChange={(e) => setFolioFisico(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#7E1D3B] uppercase mb-2">Evidencia de firma (Foto/PDF)</label>
                {!archivoEscaneado ? (
                  <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:bg-slate-50 transition">
                    <UploadCloud className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-500">Subir documento escaneado</p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl flex justify-between items-center transition">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <CheckCircle className="text-emerald-500 shrink-0" />
                      <p className="text-xs font-bold text-emerald-900 truncate">{archivoEscaneado.name}</p>
                    </div>
                    <button type="button" onClick={() => setArchivoEscaneado(null)} className="text-rose-500 hover:bg-rose-100 p-1.5 rounded-lg shrink-0 transition">
                        <Trash2 size={16}/>
                    </button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={manejarSubida} accept="image/*,.pdf" />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="px-6 py-4 bg-white border-t flex justify-end">
        <button 
          onClick={guardarEnInventario} 
          disabled={guardando || !folioFisico || !archivoEscaneado || !articulosParaInventario?.length}
          className="px-8 py-3.5 bg-[#7E1D3B] text-white font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2 transition hover:bg-[#63162e]"
        >
          {guardando ? <Loader2 className="animate-spin w-5 h-5" /> : <>Cargar Lista a Inventario <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    </div>
  );
};

export default Paso4ContraRecibo;