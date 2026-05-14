import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE } from '../../config/api';
import {
  Activity, BadgeCheck, BrainCircuit, CalendarDays, ClipboardList, FileBarChart, Folder,
  Inbox, LayoutDashboard, MessageSquare, PhoneCall, ShoppingCart,
  Stethoscope, UserPlus, Users, Users2,
} from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const getUsuarioHeader = () => {
  try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
};

export const AdminHeader = ({ submodule = 'Módulo de Admisiones' }) => {
  const usuario = getUsuarioHeader();
  const nombre = usuario.nombre || usuario.nombreCompleto || 'Usuario';
  const puesto = usuario.puesto || usuario.rol || '';
  const iniciales = nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
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
            <span className="text-sm font-black text-[#7E1D3B]">{iniciales}</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 leading-tight">{nombre}</p>
            {puesto && <p className="text-xs text-slate-500 uppercase tracking-wide">{puesto}</p>}
          </div>
        </div>
      </div>
    </header>
  );
};

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
  { label: 'Dashboard de Inicio',    icon: LayoutDashboard, key: 'dashboard',           path: '/admisiones' },
  { label: 'Bandeja Operativa',      icon: Inbox,           key: 'bandeja',             path: '/admisiones/bandeja-operativa' },
  { label: 'Expediente',             icon: Folder,          key: 'expediente',          path: '/admisiones/expediente' },
  { label: 'Requisiciones',          icon: ClipboardList,   key: 'requisiciones',       path: '/admisiones/requisiciones' },
  { label: 'Validar Requisiciones',  icon: BadgeCheck,      key: 'validar-requisiciones',path: '/admisiones/validar-requisiciones',
    soloParaPuesto: ['JEFE DE ADMISIONES', 'ENCARGADO DE ADMISIONES'] },
  { label: 'Agenda de Citas',        icon: CalendarDays,    key: 'agenda',              path: '/admisiones/agenda-citas' },
  { label: 'Llamada Inicial ', icon: PhoneCall,       key: 'seguimiento',         path: '/admisiones/seguimiento-telefonico' },
  // Estudio Socioeconómico removido del sidebar: acceso controlado desde expediente
];

// Ítems del sidebar que cada puesto NO puede ver
const ADMISIONES_ITEMS_OCULTOS_POR_PUESTO = {
  'RECEPCIÓN': ['requisiciones', 'validar-requisiciones'],
};

const getUsuarioSesion = () => {
  try { return JSON.parse(localStorage.getItem('marakame_user') || '{}'); } catch { return {}; }
};

const LIMITE_PACIENTES = 40;

export const AdmisionesSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activos, setActivos] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/pacientes`)
      .then(r => r.json())
      .then(data => {
        const count = Array.isArray(data)
          ? data.filter(p => p.estadoPaciente === 'INGRESADO').length
          : 0;
        setActivos(count);
      })
      .catch(() => setActivos(0));
  }, []);

  const puesto = getUsuarioSesion().puesto || '';
  const itemsOcultos = ADMISIONES_ITEMS_OCULTOS_POR_PUESTO[puesto] ?? [];
  const itemsVisibles = admisionesNavItems.filter(item => {
    if (itemsOcultos.includes(item.key)) return false;
    if (item.soloParaPuesto && !item.soloParaPuesto.includes(puesto)) return false;
    return true;
  });

  const porcentaje = activos !== null ? Math.min((activos / LIMITE_PACIENTES) * 100, 100) : 0;
  const restantes  = activos !== null ? LIMITE_PACIENTES - activos : null;
  const colorBarra = activos >= 38 ? 'bg-rose-500' : activos >= 35 ? 'bg-amber-400' : 'bg-emerald-500';
  const alerta     = activos !== null && activos >= 35;

  return (
    <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
      {itemsVisibles.map(({ label, icon, key, path }) => {
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

      {activos !== null && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          {alerta && (
            <div className={`mb-2 rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1.5 ${
              activos >= 38
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}>
              {activos >= 38 ? '🔴' : '⚠️'}
              {restantes === 0 ? 'Capacidad máxima' : `Quedan ${restantes} lugar${restantes === 1 ? '' : 'es'}`}
            </div>
          )}
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Capacidad</p>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>{activos} pacientes</span>
            <span>/ {LIMITE_PACIENTES}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${colorBarra}`} style={{ width: `${porcentaje}%` }} />
          </div>
        </div>
      )}
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

// ── Sidebar Médico ────────────────────────────────────────────────
const medicoNavItems = [
  { label: 'Inicio Jefatura',         icon: Activity,      path: '/medico/inicio-jefe-medico' },
  { label: 'Prospectos',              icon: UserPlus,      path: '/medico/prospectos' },
  { label: 'Pacientes Activos',       icon: Users,         path: '/medico/pacientes' },
  { label: 'Expedientes Clínicos',    icon: ClipboardList, path: '/medico/expedientes' },
  { label: 'Requisiciones',           icon: ShoppingCart,  path: '/medico/requisiciones' },
  { label: 'Personal Médico',         icon: Stethoscope,   path: '/medico/personal' },
  { label: 'Reportes y Estadísticas', icon: FileBarChart,  path: '/medico/reportes' },
];

export const MedicoSidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  return (
    <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
      {medicoNavItems.map(({ label, icon, path }) => {
        const active   = location.pathname === path || location.pathname.startsWith(`${path}/`);
        const NavIcon  = icon;
        return (
          <button key={path} type="button" onClick={() => navigate(path)}
            className={`mb-2 w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition flex items-center gap-2.5
              ${active
                ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
            {React.createElement(NavIcon, { size: 15, className: 'shrink-0' })}
            <span>{label}</span>
          </button>
        );
      })}
    </aside>
  );
};

// ── Sidebar Clínico ───────────────────────────────────────────────
const clinicoNavItems = [
  { label: 'Inicio Jefatura',   icon: LayoutDashboard, path: '/clinico/inicio-jefe-clinico' },
  { label: 'Pacientes',         icon: Users,           path: '/clinico/pacientes' },
  { label: 'Auditoría Psico.',  icon: BrainCircuit,    path: '/clinico/pacientes' },
  { label: 'Auditoría Consej.', icon: MessageSquare,   path: '/clinico/pacientes' },
  { label: 'Auditoría Familia', icon: Users2,          path: '/clinico/pacientes' },
  { label: 'Terapeuta',         icon: Stethoscope,     path: '/clinico/inicio-terapeuta' },
  { label: 'Requisiciones',     icon: ShoppingCart,    path: '/clinico/requisiciones' },
];

export const ClinicoSidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  return (
    <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
      {clinicoNavItems.map(({ label, icon, path }) => {
        const active   = location.pathname === path || location.pathname.startsWith(`${path}/`);
        const NavIcon  = icon;
        return (
          <button key={`${label}-${path}`} type="button" onClick={() => navigate(path)}
            className={`mb-2 w-full rounded-xl px-3 py-3 text-left text-sm font-semibold transition flex items-center gap-2.5
              ${active
                ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'}`}>
            {React.createElement(NavIcon, { size: 15, className: 'shrink-0' })}
            <span>{label}</span>
          </button>
        );
      })}
    </aside>
  );
};
