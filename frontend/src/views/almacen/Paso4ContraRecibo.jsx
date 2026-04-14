import React from 'react';
import { CheckSquare, Printer } from 'lucide-react';
// 1. Importamos el logo de Marakame desde tus assets
import marakameLogo from '../../assets/marakame.jpeg';

const Paso4ContraRecibo = ({ setActiveTab }) => {
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 transition-all placeholder:text-slate-300";

  return (
    <div className="grid lg:grid-cols-2 gap-5 animate-in fade-in duration-300">
      
      {/* ── Panel Izquierdo: Formulario y Checklist ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
          <CheckSquare className="text-[#7E1D3B]" size={24} />
          <div>
            <h2 className="text-lg font-black text-slate-800">Recepción Conforme + Contra-recibo</h2>
            <p className="text-xs text-slate-500">Paso 4 — Entradas y Salidas de Almacén</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-xs text-blue-800 leading-relaxed shrink-0">
          ℹ️ Se reciben los artículos, se <strong>sella y firma de recibido</strong> la factura original y las copias. Se guarda una copia para el archivo y se <strong>expide el contra-recibo</strong> al proveedor.
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
          <div>
            <label className={labelClass}>No. Contra-recibo</label>
            <input type="text" placeholder="CR-2795" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha de Recepción</label>
            <input type="date" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>1. Nombre del Proveedor</label>
            <input type="text" placeholder="Razón social" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>2. No. Factura</label>
            <input type="text" placeholder="FC-2318" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>3. Importe ($)</label>
            <input type="number" placeholder="0.00" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>4. Importe con Letra</label>
            <input type="text" placeholder="Cantidad con letra..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>5. Fecha Recepción</label>
            <input type="date" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>6. Pago Programado</label>
            <input type="date" className={inputClass} />
            <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">Fecha estimada de pago</p>
          </div>
        </div>

        {/* Lista de Documentos */}
        <div className="border-t border-slate-100 pt-5 mb-6 flex-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Documentos a Sellar y Firmar</h3>
          <div className="space-y-2">
            {[
              'Factura original del proveedor — sellada y firmada',
              'Copia de factura para el proveedor — sellada y firmada',
              'Copia de factura para archivo del almacén — resguardada'
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <input type="checkbox" className="mt-0.5 w-4 h-4 text-[#7E1D3B] rounded border-slate-300 focus:ring-[#7E1D3B]" />
                <p className="text-sm text-slate-700 flex-1">{item}</p>
                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border text-slate-500 bg-white border-slate-200 shrink-0">Obligatorio</span>
              </label>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 shrink-0">
          <button className="flex items-center justify-center gap-2 flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition shadow-sm">
            <Printer size={16} /> Imprimir CR
          </button>
          <button onClick={() => setActiveTab('paso5')} className="flex-[2] py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold text-sm hover:bg-[#63162e] transition shadow-sm">
            Emitir y Continuar a Inventario →
          </button>
        </div>
      </div>

      {/* ── Panel Derecho: Vista Previa del Documento ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Modelo de Contra-recibo</h3>
        </div>
        
        <div className="p-6 bg-slate-50/50">
          {/* Diseño del documento tipo ticket/papel */}
          <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm text-slate-800">
            <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-4">
              
              {/* 2. Aquí añadimos el logo con flexbox para que quede junto al texto */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <img src={marakameLogo} alt="Logo Marakame" className="h-7 w-auto rounded border border-slate-200" />
               
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed">
                  RFC: MAR080325RRA<br/>
                  Carr. Presa Aguamilpa Km 7 No.10<br/>
                  Vistas de la Cantera, 63173, Tepic, Nay.
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Contra Recibo</p>
                <p className="font-mono text-lg font-black mt-1">Nº 2795</p>
              </div>
            </div>

            <h4 className="text-center font-bold text-sm mb-4">CONTRA RECIBO</h4>
            
            <div className="space-y-3 text-xs">
              <div className="flex">
                <span className="w-24 text-slate-500 shrink-0">Recibimos de:</span>
                <span className="border-b border-slate-300 flex-1 font-medium pl-2">Farmacias del Ahorro S.A.</span>
              </div>
              <p className="text-slate-500 py-2">Para su revisión y pago las Facturas y otros documentos que a continuación se indican:</p>
              <div className="flex">
                <span className="w-32 text-slate-500 shrink-0">2. No. de Factura:</span>
                <span className="border-b border-slate-300 flex-1 font-mono font-bold pl-2">FC-2318</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 shrink-0">3. Importe $:</span>
                <span className="border-b border-slate-300 flex-1 font-mono font-bold pl-2">$ 15,400.00</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 shrink-0">4. Importe letra:</span>
                <span className="border-b border-slate-300 flex-1 pl-2">Quince mil cuatrocientos pesos 00/100 M.N.</span>
              </div>

              <div className="my-4 py-3 border-y border-slate-200 text-[9px] text-slate-500 italic text-justify leading-relaxed">
                "El presente contra-recibo se emite exclusivamente para efectos de control interno de Marakame y no constituye un título de crédito..." <strong className="not-italic text-slate-700">· NO NEGOCIABLE</strong>
              </div>

              <div className="flex">
                <span className="w-32 text-slate-500 shrink-0">5. Fecha Recepción:</span>
                <span className="border-b border-slate-300 flex-1 pl-2">14 de Abril de 2026</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 shrink-0">6. Pago Programado:</span>
                <span className="border-b border-slate-300 flex-1 pl-2">28 de Abril de 2026</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="text-center">
                <div className="border-t border-slate-400 pt-2">
                  <p className="text-[10px] text-slate-600 font-medium">7. Nombre y Firma de quien recibe</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-slate-400 pt-2">
                  <p className="text-[10px] text-slate-600 font-medium">Nombre y Firma del Proveedor</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-500 mt-4 text-center">
            💡 La guía de llenado tiene <strong>7 campos</strong> conforme al Manual Oficial 2017.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Paso4ContraRecibo;