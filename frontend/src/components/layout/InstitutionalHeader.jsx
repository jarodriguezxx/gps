import React from 'react';
import marakameLogo from '../../assets/marakame.jpeg';

const InstitutionalHeader = ({
  title = 'Sistema Integral Marakame',
  moduleLabel,
  areaLabel,
  sessionValue,
  badge,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3">
        <img src={marakameLogo} alt="Logo Nayarit Marakame" className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
          <h1 className="text-xl font-black md:text-2xl text-slate-800">{title}</h1>
          {moduleLabel ? <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">{moduleLabel}</p> : null}
          {areaLabel ? <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{areaLabel}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center" aria-hidden="true">
          {badge}
        </div>
        <div className="text-right md:text-left">
          <p className="text-xs text-slate-500">Sesión activa</p>
          <p className="font-semibold text-slate-700">{sessionValue}</p>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalHeader;
