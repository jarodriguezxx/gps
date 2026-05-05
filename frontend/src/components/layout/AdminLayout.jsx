import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, FileText, Folder, Inbox, LayoutDashboard, PhoneCall } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

export const AdminHeader = ({ submodule = 'Módulo de Admisiones' }) => (
  <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
    <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3">
        <img 
          src={marakameLogo} 
          alt="Logo Marakame"
          className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" 
        />
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7E1D3B]">Instituto Marakame</p>
          <h1 className="text-xl font-black md:text-2xl text-slate-800">Sistema Integral Marakame</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">{submodule}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="h-10 w-10 rounded-full border-2 border-[#7E1D3B]/30 bg-[#7E1D3B]/10 flex items-center justify-center">
          <span className="text-sm font-black text-[#7E1D3B]">ADM</span>
        </div>
        <div>
          <p className="text-xs text-slate-500">Sesión activa</p>
          <p className="font-semibold text-slate-700">{submodule}</p>
        </div>
      </div>
    </div>
  </header>
);

export const AdminSidebar = ({ navItems, activeKey }) => {
  const navigate = useNavigate();
  
  return (
    <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
      {navItems.map(({ label, icon, key, path }) => {
        const NavIcon = icon;

        return (
        <button 
          key={key} 
          onClick={() => navigate(path)}
          className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
            key === activeKey
              ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
              : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
          }`}
        >
          {React.createElement(NavIcon, { size: 15 })}
          {label}
        </button>
        );
      })}
    </aside>
  );
};

const admisionesNavItems = [
  { label: 'Dashboard de Inicio', icon: LayoutDashboard, key: 'dashboard', path: '/admisiones' },
  { label: 'Bandeja Operativa', icon: Inbox, key: 'bandeja', path: '/admisiones/bandeja-operativa' },
  { label: 'Expediente', icon: Folder, key: 'expediente', path: '/admisiones/expediente' },
  { label: 'Agenda de Citas', icon: CalendarDays, key: 'agenda', path: '/admisiones/agenda-citas' },
  { label: 'Seguimiento Telefónico', icon: PhoneCall, key: 'seguimiento', path: '/admisiones/seguimiento-telefonico' },
  // Estudio Socioeconómico removido del sidebar: acceso controlado desde expediente
];

export const AdmisionesSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
      {admisionesNavItems.map(({ label, icon, key, path }) => {
        const active = location.pathname === path || location.pathname.startsWith(`${path}/`);
        const NavIcon = icon;

        return (
          <button
            key={key}
            type="button"
            onClick={() => navigate(path)}
            className={`mb-2 w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition flex items-center gap-2.5 ${
              active
                ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
            }`}
          >
            {React.createElement(NavIcon, { size: 15, className: 'shrink-0' })}
            <span>{label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export const AdminMainTitle = ({ title, subtitle }) => (
  <div>
    <h2 className="text-2xl font-black text-slate-800">{title}</h2>
    <p className="text-sm text-slate-400 font-medium tracking-wide">{subtitle}</p>
  </div>
);

export const AdminSectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

export const AdminFieldError = ({ msg }) =>
  msg ? <p className="mt-1 ml-0.5 text-xs text-rose-600 font-medium">{msg}</p> : null;

export const inputBase = 'w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2';
export const inputOk = 'border-slate-200 bg-slate-50 text-slate-800 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 placeholder:text-slate-300';
export const inputErr = 'border-rose-300 bg-rose-50 text-slate-800 focus:ring-rose-300/40 focus:border-rose-400';

export const AdminInputField = ({ label, required, type = 'text', placeholder = '', name, value, onChange, error }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
      {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${inputBase} ${error ? inputErr : inputOk}`}
    />
    <AdminFieldError msg={error} />
  </div>
);

export const AdminSelectField = ({ label, required, name, value, onChange, options = [], error, disabled = false }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
      {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${inputBase} ${error ? inputErr : inputOk} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="">{disabled ? '— Selecciona una opción primero —' : '— Seleccionar —'}</option>
      {options.map((op) => <option key={op} value={op}>{op}</option>)}
    </select>
    <AdminFieldError msg={error} />
  </div>
);

export const AdminErrorAlert = ({ message }) =>
  message ? (
    <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium">
      {message}
    </div>
  ) : null;

export const AdminSuccessAlert = ({ message }) =>
  message ? (
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
      {message}
    </div>
  ) : null;
