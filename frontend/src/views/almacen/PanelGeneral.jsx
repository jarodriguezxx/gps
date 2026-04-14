import React from 'react';
import { AlertCircle, FileText, ArrowRight } from 'lucide-react';

const PanelGeneral = ({ setActiveTab }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* ── KPIs (Indicadores Principales) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Entradas Esta Semana', value: '4', sub: 'Pedidos recibidos el jueves', color: 'emerald' },
          { title: 'Pendientes Revisión', value: '2', sub: 'Por verificar vs requisición', color: 'amber' },
          { title: 'Solicitudes de Baja', value: '3', sub: 'Áreas esperando consumibles', color: 'rose' },
          { title: 'Contra-recibos', value: '2', sub: 'Emitidos hoy', color: 'indigo' }
        ].map((kpi, i) => (
          <div key={i} className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm border-b-4 border-b-${kpi.color}-500 relative overflow-hidden transition-all hover:shadow-md`}>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{kpi.title}</p>
            <p className={`text-3xl font-black text-${kpi.color}-600`}>{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        
        {/* ── Panel: Procedimiento Operativo ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#7E1D3B]" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Procedimiento — Entradas y Salidas</h3>
          </div>
          
          <div className="p-5 flex-1">
            {/* Normas Oficiales */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-xs text-blue-800 leading-relaxed">
              <span className="font-bold block mb-1">📌 Normas de Operación (Manual Oficial 2017)</span>
              • Horario de recepción: <strong>jueves de 9:00 a 14:00 hrs</strong><br/>
              • Todo bien recibe inspección visual (empaque, tipo, cantidad).<br/>
              • Alimentos: mínimo <strong>6 meses de vigencia</strong>.<br/>
              • Toda salida requiere <strong>formato con firma de autorización</strong>.
            </div>
            
            {/* Lista de Pasos */}
            <div className="space-y-2">
              <button onClick={() => setActiveTab('paso1')} className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition text-left group">
                <div className="flex gap-3 items-center">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition">1. Recibir consumibles y factura</p>
                    <p className="text-xs text-slate-500">4 pedidos recibidos este jueves</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-200 text-emerald-700 text-[10px] rounded-full font-bold shrink-0">Completado</span>
              </button>
              
              <button onClick={() => setActiveTab('paso2')} className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition text-left group">
                <div className="flex gap-3 items-center">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition">2. Revisar vs Requisición</p>
                    <p className="text-xs text-slate-500">2 pedidos en proceso de verificación</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-amber-200 text-amber-700 text-[10px] rounded-full font-bold shrink-0">En proceso</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition text-left">
                <div className="flex gap-3 items-center">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">3a</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">3a. Devolver al proveedor</p>
                    <p className="text-xs text-slate-400">Si no cumple con la requisición</p>
                  </div>
                </div>
              </button>

              {[
                { num: '4', title: 'Recibir artículos, sellar y contra-recibo' },
                { num: '5', title: 'Registrar en inventario digital' },
                { num: '6', title: 'Ubicar mercancía en almacén' },
                { num: '7', title: 'Notificar a Recursos Materiales' },
              ].map((paso, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition text-left">
                  <div className="flex gap-3 items-center">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">{paso.num}</div>
                    <p className="text-sm font-semibold text-slate-600">{paso.num}. {paso.title}</p>
                  </div>
                </button>
              ))}

              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition text-left mt-2">
                <div className="flex gap-3 items-center">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-xs font-bold">8</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">8. Baja de Consumibles</p>
                    <p className="text-xs text-slate-500">3 solicitudes pendientes de despacho</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-rose-200 text-rose-700 text-[10px] rounded-full font-bold shrink-0">3 Urgentes</span>
              </button>

            </div>
          </div>
        </div>

        {/* ── Panel: Últimos Movimientos ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#7E1D3B]" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Últimos Movimientos</h3>
            </div>
            <button className="text-xs font-bold text-[#7E1D3B] hover:bg-[#7E1D3B]/10 px-3 py-1.5 rounded-lg transition">Exportar</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Folio</th>
                  <th className="px-5 py-3">Insumo</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Cant.</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B]">ENT-0089</td>
                  <td className="px-5 py-3 text-slate-700 font-medium">Buprenorfina 8mg</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">Entrada</td>
                  <td className="px-5 py-3 font-bold text-emerald-600">+100</td>
                  <td className="px-5 py-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] rounded-full font-bold">En revisión</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B]">BAJ-0088</td>
                  <td className="px-5 py-3 text-slate-700 font-medium">Mat. curación</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">Baja</td>
                  <td className="px-5 py-3 font-bold text-rose-600">-5 kits</td>
                  <td className="px-5 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-bold">Despachado</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B]">ENT-0087</td>
                  <td className="px-5 py-3 text-slate-700 font-medium">Víveres quincena</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">Entrada</td>
                  <td className="px-5 py-3 font-bold text-emerald-600">+1 lote</td>
                  <td className="px-5 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-bold">Aceptado</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 font-mono font-bold text-[#7E1D3B]">ENT-0085</td>
                  <td className="px-5 py-3 text-slate-700 font-medium">Metadona 10mg/mL</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">Entrada</td>
                  <td className="px-5 py-3 font-bold text-slate-400">-</td>
                  <td className="px-5 py-3"><span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] rounded-full font-bold">Devuelto</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <button className="text-xs font-bold text-slate-500 hover:text-[#7E1D3B] flex items-center justify-center gap-1 w-full transition">
              Ver todos los movimientos <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PanelGeneral;