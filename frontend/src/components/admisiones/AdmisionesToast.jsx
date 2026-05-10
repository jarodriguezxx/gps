import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

const variantConfig = {
  success: {
    ring: 'border-emerald-200 ring-1 ring-emerald-100',
    iconWrap: 'bg-emerald-50 text-emerald-600',
    label: 'Confirmación',
    icon: CheckCircle2,
  },
  error: {
    ring: 'border-rose-200 ring-1 ring-rose-100',
    iconWrap: 'bg-rose-50 text-rose-600',
    label: 'Aviso',
    icon: AlertTriangle,
  },
  info: {
    ring: 'border-sky-200 ring-1 ring-sky-100',
    iconWrap: 'bg-sky-50 text-sky-600',
    label: 'Información',
    icon: Info,
  },
};

const AdmisionesToast = ({ message, variant = 'info', onClose, duration = 5000, title }) => {
  useEffect(() => {
    if (!message || !onClose) {
      return undefined;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) {
    return null;
  }

  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.icon;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 w-[min(92vw,24rem)] animate-fadeIn">
      <div className={`pointer-events-auto rounded-2xl border bg-white/95 p-4 shadow-2xl backdrop-blur ${config.ring}`}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconWrap}`}>
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              {title || config.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{message}</p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdmisionesToast;