import React, { useState } from 'react';
import { Bell, CheckCircle2, FileText, Printer, Mail, ArrowRight, Building2, PackageCheck, AlertCircle } from 'lucide-react';

const Paso7Notificacion = ({ setActiveTab, recepcionActiva, articulosParaInventario }) => {
  const [enviado, setEnviado] = useState(false);

  const finalizarProceso = () => {
    // Aquí podrías disparar un correo real o una notificación push a Rec. Materiales
    setEnviado(true);
    setTimeout(() => {
      alert("Proceso finalizado. El inventario ha sido actualizado y Recursos Materiales ha sido notificado.");
      setActiveTab('dashboard'); // Cerramos el ciclo regresando al inicio
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
      
      {/* Encabezado con Icono de Notificación */}
      <div className="px-6 py-6 border-b border-slate-100 bg-[#7E1D3B] text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Bell className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black">Paso 7: Notificación a Recursos Materiales</h2>
            <p className="text-xs font-medium text-white/70 uppercase tracking-widest">Cierre de proceso de recepción</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div id="reporte-final" className="max-w-3xl mx-auto space-y-6">
          
          {/* Tarjeta 1: Estado del Proceso */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <CheckCircle2 className="text-emerald-500 w-12 h-12 opacity-20" />
             </div>
             
             <div className="flex items-center gap-2 mb-6 text-[#7E1D3B]">
                <PackageCheck size={20} />
                <h3 className="font-black uppercase text-xs tracking-tighter">Resumen de Entrada al Almacén</h3>
             </div>

             <div className="grid grid-cols-2 gap-8">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Proveedor</p>
                    <p className="text-sm font-bold text-slate-800">{recepcionActiva?.proveedor || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Folio de Factura</p>
                    <p className="text-sm font-bold text-slate-800 font-mono">{recepcionActiva?.folio || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Fecha de Ingreso</p>
                    <p className="text-sm font-bold text-slate-800">{recepcionActiva?.fechaRecepcion || 'Hoy'}</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Cuidado Especial</p>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase">
                        {recepcionActiva?.cuidadosEspeciales || 'Estándar'}
                    </span>
                </div>
             </div>
          </div>

          {/* Tarjeta 2: Listado Detallado */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase">Artículos Ingresados al Inventario Digital</span>
                <span className="text-[10px] font-black bg-[#7E1D3B] text-white px-2 py-0.5 rounded-full">
                    {articulosParaInventario?.length || 0} Ítems
                </span>
             </div>
             <div className="divide-y divide-slate-50">
                {articulosParaInventario?.map((art, idx) => (
                    <div key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-700">{art.articuloNombre}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Categoría: {art.categoria}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-[#7E1D3B]">+{art.stock} {art.unidad}</p>
                            <p className="text-[9px] text-slate-400 font-bold">FECHA CAD: {recepcionActiva?.caducidad || 'N/A'}</p>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Advertencia Final */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
             <AlertCircle className="text-amber-500 shrink-0" size={18} />
             <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Este resumen será enviado automáticamente al departamento de <strong>Recursos Materiales</strong> para su validación administrativa. Recuerde entregar las facturas originales foliadas físicamente.
             </p>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="px-6 py-6 bg-white border-t border-slate-100 flex justify-between items-center">
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
        >
          <Printer size={18} /> Imprimir Reporte
        </button>

        <div className="flex gap-3">
            <button className="px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2">
                <Mail size={18} /> Enviar Copia Email
            </button>
            
            <button 
                onClick={finalizarProceso}
                disabled={enviado}
                className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                    enviado ? 'bg-emerald-500' : 'bg-[#7E1D3B] hover:shadow-[#7E1D3B]/20'
                }`}
            >
                {enviado ? (
                    <>¡Notificado! <CheckCircle2 size={18} /></>
                ) : (
                    <>Finalizar y Notificar <ArrowRight size={18} /></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Paso7Notificacion;