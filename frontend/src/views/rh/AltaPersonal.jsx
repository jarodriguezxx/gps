import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, UserPlus, UserMinus, Tag, ShieldCheck, Eye, EyeOff, CheckCircle, KeyRound, RefreshCw, Wallet, AlertTriangle, ClipboardList } from 'lucide-react';
import marakameLogo from '../../assets/marakame.jpeg';

const navItems = [
  { label: 'Alta de Personal',     icon: UserPlus,      key: 'alta',              path: '/rh/alta-personal' },
  { label: 'Baja de Personal',     icon: UserMinus,     key: 'baja',              path: '/rh/baja-personal' },
  { label: 'Catálogo de Roles',    icon: Tag,           key: 'catalogo',          path: '/rh/catalogo-roles' },
  { label: 'Asignación de Roles',  icon: ShieldCheck,   key: 'asignacion',        path: '/rh/asignacion-roles' },
  { label: 'Nómina',               icon: Wallet,        key: 'nomina',            path: '/rh/nomina' },
  { label: 'Registrar Incidencia', icon: AlertTriangle, key: 'incidencias',       path: '/rh/registrar-incidencia' },
  { label: 'Tabla de Incidencias', icon: ClipboardList, key: 'tabla-incidencias', path: '/rh/tabla-incidencias' },
];

const PUESTOS_POR_DEPARTAMENTO = {
  'DEPARTAMENTO DE ADMINISTRACIÓN': [
    'ASISTENTE CONTABLE',
    'ASISTENTE DE DIRECCIÓN',
    'CHOFER DE DIRECCIÓN',
    'DIRECTORA GENERAL',
    'ENCARGADA (O) DE ALMACÉN',
    'ENCARGADA (O) DE RECURSOS FINANCIEROS',
    'ENCARGADA (O) DE RECURSOS MATERIALES',
    'ENCARGADA (O) DE RECURSOS HUMANOS',
    'JEFA (E) DEP. ADMINISTRACIÓN',
    'TITULAR DE UNIDAD JURÍDICA',
    'TITULAR DE LA UNIDAD DE TRANSPARENCIA',
    'ENCARGADA (O) DE DIFUSIÓN Y MEDIOS',
  ],
  'DEPARTAMENTO CLÍNICO': [
    'AUXILIAR ADMINISTRATIVO',
    'CONSEJERA (O) ASIGNADO',
    'COTERAPEUTA',
    'PSICÓLOGA (O)',
    'TERAPEUTA DE POST-TRATAMIENTO',
    'ENCARGADA (O) DE FAMILIA',
    'ENCARGADA (O) DE CONSEJEROS ASIGNADOS',
    'ENCARGADA (O) DE POST TRATAMIENTO',
    'JEFA (E) DEP. CLÍNICO',
    'TERAPEUTA DE GRUPO',
    'TERAPEUTA FAMILIAR',
  ],
  'DEPARTAMENTO DE ADMISIONES': [
    'JEFA (E) DEP. ADMISIONES',
    'ASESOR (A)',
    'ENCARGADA (O) DE PREVENCIÓN Y ESTADÍSTICA',
    'RECEPCIÓN',
  ],
  'DEPARTAMENTO DE MANTENIMIENTO E INTENDENCIA': [
    'ENCARGADA (O) DE MANTENIMIENTO E INTENDENCIA',
    'AUXILIAR DE MANTENIMIENTO',
    'AUXILIAR DE INTENDENCIA',
  ],
  'DEPARTAMENTO MÉDICO': [
    'JEFA (E) DEP. MÉDICO',
    'MÉDICO',
    'NUTRIÓLOGA (O)',
    'ENFERMERA (O)',
  ],
  'DEPARTAMENTO DE COCINA': [
    'AUXILIAR DE COCINA',
  ],
};

const ESCOLARIDADES = [
  'PRIMARIA', 'SECUNDARIA', 'PREPARATORIA / BACHILLERATO',
  'TÉCNICO / VOCACIONAL', 'LICENCIATURA', 'ESPECIALIDAD', 'MAESTRÍA', 'DOCTORADO',
];

const ROLES_SISTEMA = [
  'ADMIN', 'RH', 'MÉDICO', 'ADMISIONES', 'CLINICO', 'FINANCIERO', 'ALMACÉN', 'MATERIALES',
];

const CURP_REGEX = /^[A-Z][AEIOU][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$/;
const RFC_REGEX   = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarCURP       = (v) => CURP_REGEX.test(v.toUpperCase());
const validarRFC        = (v) => RFC_REGEX.test(v.toUpperCase());
const validarEmail      = (v) => EMAIL_REGEX.test(v);
const validarTelefono   = (v) => /^\d{10}$/.test(v.replace(/[\s\-()]/g, ''));
const validarMayorDeEdad = (fecha) => {
  if (!fecha) return false;
  const hoy = new Date();
  const nac = new Date(fecha + 'T00:00:00');
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad >= 18;
};

const generarUsername = (nombre, apellido) => {
  const inicial = (nombre.trim().split(' ')[0][0] || '').toLowerCase();
  const base = inicial + apellido.trim().toLowerCase();
  return base.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
};

const generarPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const inputBase = 'w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2';
const inputOk   = 'border-slate-200 bg-slate-50 text-slate-800 focus:ring-[#7E1D3B]/30 focus:border-[#7E1D3B]/50 placeholder:text-slate-300';
const inputErr  = 'border-rose-300 bg-rose-50 text-slate-800 focus:ring-rose-300/40 focus:border-rose-400';

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 ml-0.5 text-xs text-rose-600 font-medium">{msg}</p> : null;

const InputField = ({ label, required, type = 'text', placeholder = '', name, value, onChange, error }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
      {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className={`${inputBase} ${error ? inputErr : inputOk}`} />
    <FieldError msg={error} />
  </div>
);

const SelectField = ({ label, required, name, value, onChange, options = [], error, disabled = false }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
      {label}{required && <span className="text-[#7E1D3B] ml-0.5">*</span>}
    </label>
    <select name={name} value={value} onChange={onChange} disabled={disabled}
      className={`${inputBase} ${error ? inputErr : inputOk} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <option value="">{disabled ? '— Selecciona un departamento primero —' : '— Seleccionar —'}</option>
      {options.map((op) => <option key={op} value={op}>{op}</option>)}
    </select>
    <FieldError msg={error} />
  </div>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="h-5 w-1 rounded-full bg-[#7E1D3B]" />
    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">{title}</h2>
  </div>
);

const FORM_INICIAL = {
  nombre: '', apellidoPaterno: '', apellidoMaterno: '',
  curp: '', rfc: '', fechaNacimiento: '', sexo: '', estadoCivil: '',
  telefono: '', correoElectronico: '', domicilio: '',
  departamento: '', puesto: '', fechaIngreso: '',
  tipoContrato: '', escolaridad: '', anosExperiencia: '',
};

const CRED_INICIAL = { username: '', password: '', rol: '', mostrarPass: false };

const RHLayout = ({ navigate, children }) => (
  <div className="min-h-screen bg-slate-100 text-slate-900">
    <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6">
      <header className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm mb-5">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <img src={marakameLogo} alt="Logo Marakame"
              className="h-12 w-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm" />
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
              <p className="text-xs text-slate-500">Sesión activa</p>
              <p className="font-semibold text-slate-700">Recursos Humanos</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-4 py-5 md:grid-cols-[220px_1fr] md:px-6">
          <aside className="rounded-2xl bg-gradient-to-b from-slate-100 to-white p-3 shadow-inner self-start">
            {navItems.map(({ label, icon: Icon, key, path }) => (
              <button key={key} onClick={() => navigate(path)}
                className={`mb-2 w-full rounded-xl px-3 py-3 text-sm font-semibold transition flex items-center gap-2.5 ${
                  key === 'alta'
                    ? 'bg-[#7E1D3B] text-white shadow-md hover:bg-[#63162e]'
                    : 'border border-[#7E1D3B]/20 bg-[#7E1D3B]/8 text-[#7E1D3B] hover:bg-[#7E1D3B]/12'
                }`}>
                <Icon size={15} />{label}
              </button>
            ))}
          </aside>
          <main className="space-y-5">{children}</main>
        </div>
      </header>
    </div>
  </div>
);

const AltaPersonal = () => {
  const navigate = useNavigate();

  // Paso 1 — formulario empleado
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');

  // Paso 2 — credenciales
  const [personalGuardado, setPersonalGuardado] = useState(null);
  const [credForm, setCredForm]     = useState(CRED_INICIAL);
  const [credError, setCredError]   = useState('');
  const [credLoading, setCredLoading] = useState(false);

  // Paso 3 — confirmación final
  const [usuarioCreado, setUsuarioCreado] = useState(null);

  const puestosDisponibles = PUESTOS_POR_DEPARTAMENTO[formData.departamento] ?? [];

  /* ── Paso 1: guardar empleado ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'curp' || name === 'rfc') ? value.toUpperCase() : value,
      ...(name === 'departamento' ? { puesto: '' } : {}),
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const e = {};
    if (!formData.nombre.trim())          e.nombre          = 'Campo requerido.';
    if (!formData.apellidoPaterno.trim())  e.apellidoPaterno  = 'Campo requerido.';
    if (!formData.apellidoMaterno.trim())  e.apellidoMaterno  = 'Campo requerido.';
    if (!formData.curp)                   e.curp            = 'Campo requerido.';
    else if (!validarCURP(formData.curp))  e.curp            = 'CURP inválida. Verifica el formato (18 caracteres).';
    if (!formData.rfc)                    e.rfc             = 'Campo requerido.';
    else if (!validarRFC(formData.rfc))    e.rfc             = 'RFC inválido. Verifica el formato (12-13 caracteres).';
    if (!formData.fechaNacimiento)         e.fechaNacimiento  = 'Campo requerido.';
    else if (!validarMayorDeEdad(formData.fechaNacimiento)) e.fechaNacimiento = 'El empleado debe ser mayor de 18 años.';
    if (!formData.sexo)        e.sexo        = 'Selecciona una opción.';
    if (!formData.estadoCivil) e.estadoCivil = 'Selecciona una opción.';
    if (!formData.telefono)                     e.telefono = 'Campo requerido.';
    else if (!validarTelefono(formData.telefono)) e.telefono = 'Debe contener exactamente 10 dígitos.';
    if (!formData.correoElectronico)                  e.correoElectronico = 'Campo requerido.';
    else if (!validarEmail(formData.correoElectronico)) e.correoElectronico = 'Correo electrónico inválido.';
    if (!formData.domicilio.trim()) e.domicilio   = 'Campo requerido.';
    if (!formData.departamento)    e.departamento = 'Selecciona un departamento.';
    if (puestosDisponibles.length > 0 && !formData.puesto) e.puesto = 'Selecciona un puesto.';
    if (!formData.fechaIngreso) e.fechaIngreso = 'Campo requerido.';
    if (!formData.tipoContrato) e.tipoContrato = 'Selecciona un tipo de contrato.';
    if (!formData.escolaridad)  e.escolaridad  = 'Selecciona una escolaridad.';
    return e;
  };

  const handleGuardar = async () => {
    setApiError('');
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      ...formData,
      anosExperiencia: formData.anosExperiencia !== '' ? parseInt(formData.anosExperiencia) : null,
    };

    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Error al registrar el personal. Verifica los datos e intenta de nuevo.');

      const data = await res.json();
      setPersonalGuardado(data);
      setCredForm({
        username:    generarUsername(formData.nombre, formData.apellidoPaterno),
        password:    generarPassword(),
        rol:         '',
        mostrarPass: false,
      });
      setErrors({});
      setFormData(FORM_INICIAL);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Paso 2: crear credenciales ── */
  const handleCrearAcceso = async () => {
    if (!credForm.username.trim()) { setCredError('El nombre de usuario es requerido.'); return; }
    if (credForm.password.length < 6) { setCredError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (!credForm.rol) { setCredError('Selecciona el módulo de acceso.'); return; }

    setCredLoading(true);
    setCredError('');
    try {
      const res = await fetch('http://localhost:4000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalId: personalGuardado.id,
          username:   credForm.username.trim().toLowerCase(),
          password:   credForm.password,
          rol:        credForm.rol,
        }),
      });
      const body = await res.json();
      if (!res.ok) { setCredError(body.error || 'Error al crear el acceso.'); return; }

      setUsuarioCreado({ username: credForm.username.trim().toLowerCase(), password: credForm.password });
      setPersonalGuardado(null);
      setCredForm(CRED_INICIAL);
    } catch {
      setCredError('No se pudo conectar con el servidor.');
    } finally {
      setCredLoading(false);
    }
  };

  const handleOmitir = () => {
    setUsuarioCreado({ username: null, password: null });
    setPersonalGuardado(null);
  };

  const field = (name) => ({ name, value: formData[name], onChange: handleChange, error: errors[name] });

  /* ══ Paso 3: Confirmación final ══ */
  if (usuarioCreado) {
    return (
      <RHLayout navigate={navigate}>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
          <p className="text-sm text-slate-400 font-medium tracking-wide">Alta de Personal</p>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">¡Registro completado!</h3>
            <p className="text-sm text-slate-500 mt-1">El empleado ha sido dado de alta exitosamente.</p>
          </div>

          {usuarioCreado.username ? (
            <>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 max-w-sm mx-auto">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 mb-3">Credenciales de acceso</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Usuario</span>
                  <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-lg text-sm">
                    {usuarioCreado.username}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Contraseña temporal</span>
                  <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-lg text-sm">
                    {usuarioCreado.password}
                  </span>
                </div>
              </div>
              <p className="text-xs text-amber-600 font-semibold">
                Entrega estas credenciales al empleado. La contraseña deberá cambiarse en el primer inicio de sesión.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">No se creó acceso al sistema para este empleado.</p>
          )}

          <button onClick={() => setUsuarioCreado(null)}
            className="mx-auto flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm">
            <UserPlus size={16} /> Registrar otro empleado
          </button>
        </section>
      </RHLayout>
    );
  }

  /* ══ Paso 2: Crear credenciales ══ */
  if (personalGuardado) {
    return (
      <RHLayout navigate={navigate}>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
          <p className="text-sm text-slate-400 font-medium tracking-wide">Alta de Personal — Acceso al Sistema</p>
        </div>

        {/* Confirmación empleado creado */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Empleado registrado correctamente</p>
            <p className="text-xs text-emerald-600">
              {[personalGuardado.nombre, personalGuardado.apellidoPaterno, personalGuardado.apellidoMaterno].filter(Boolean).join(' ')}
              {personalGuardado.puesto ? ` · ${personalGuardado.puesto}` : ''}
            </p>
          </div>
        </div>

        {/* Formulario de credenciales */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <KeyRound size={18} className="text-[#7E1D3B]" />
            <SectionTitle title="Configurar acceso al sistema" />
          </div>
          <p className="text-xs text-slate-500 -mt-3">
            Se generaron credenciales automáticamente. Puedes modificarlas antes de guardar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                Nombre de usuario<span className="text-[#7E1D3B] ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={credForm.username}
                onChange={e => setCredForm(p => ({ ...p, username: e.target.value }))}
                className={`${inputBase} ${inputOk} font-mono`}
                placeholder="usuario"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                Contraseña temporal<span className="text-[#7E1D3B] ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={credForm.mostrarPass ? 'text' : 'password'}
                  value={credForm.password}
                  onChange={e => setCredForm(p => ({ ...p, password: e.target.value }))}
                  className={`${inputBase} ${inputOk} font-mono pr-20`}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <button type="button"
                    onClick={() => setCredForm(p => ({ ...p, password: generarPassword() }))}
                    title="Generar nueva contraseña"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                    <RefreshCw size={13} />
                  </button>
                  <button type="button"
                    onClick={() => setCredForm(p => ({ ...p, mostrarPass: !p.mostrarPass }))}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                    {credForm.mostrarPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Módulo / Rol */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
                Módulo de acceso<span className="text-[#7E1D3B] ml-0.5">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLES_SISTEMA.map(rol => (
                  <button key={rol} type="button"
                    onClick={() => setCredForm(p => ({ ...p, rol }))}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                      credForm.rol === rol
                        ? 'bg-[#7E1D3B] text-white border-[#7E1D3B] shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>
                    {rol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {credError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium">
              {credError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={handleOmitir}
              className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold shadow-sm text-sm">
              <X size={16} /> Omitir acceso
            </button>
            <button onClick={handleCrearAcceso} disabled={credLoading}
              className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              <KeyRound size={16} /> {credLoading ? 'Creando acceso...' : 'Crear acceso'}
            </button>
          </div>
        </section>
      </RHLayout>
    );
  }

  /* ══ Paso 1: Formulario empleado ══ */
  return (
    <RHLayout navigate={navigate}>
      <div>
        <h2 className="text-2xl font-black text-slate-800">Recursos Humanos</h2>
        <p className="text-sm text-slate-400 font-medium tracking-wide">Alta de Personal</p>
      </div>

      {apiError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 font-medium">
          {apiError}
        </div>
      )}

      {/* ── Datos Personales ── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <SectionTitle title="Datos Personales" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Nombre (s)"       required {...field('nombre')} />
          <InputField label="Apellido Paterno"  required {...field('apellidoPaterno')} />
          <InputField label="Apellido Materno"  required {...field('apellidoMaterno')} />

          <InputField label="CURP" required placeholder="AAAA000000AAAAAA00" {...field('curp')} />
          <InputField label="RFC"  required placeholder="AAAA000000AAA"      {...field('rfc')} />
          <InputField label="Fecha de Nacimiento" required type="date" {...field('fechaNacimiento')} />

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
              Sexo<span className="text-[#7E1D3B] ml-0.5">*</span>
            </label>
            <div className="flex flex-col gap-1.5 pt-1">
              {['Masculino', 'Femenino', 'Indistinto'].map(op => (
                <label key={op} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="sexo" value={op}
                    checked={formData.sexo === op} onChange={handleChange}
                    className="accent-[#7E1D3B] w-3.5 h-3.5" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{op}</span>
                </label>
              ))}
            </div>
            <FieldError msg={errors.sexo} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 ml-0.5">
              Estado Civil<span className="text-[#7E1D3B] ml-0.5">*</span>
            </label>
            <div className="flex flex-col gap-1.5 pt-1">
              {['Soltera/o', 'Casada/o'].map(op => (
                <label key={op} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="estadoCivil" value={op}
                    checked={formData.estadoCivil === op} onChange={handleChange}
                    className="accent-[#7E1D3B] w-3.5 h-3.5" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">{op}</span>
                </label>
              ))}
            </div>
            <FieldError msg={errors.estadoCivil} />
          </div>
        </div>
      </section>

      {/* ── Contacto + Puesto ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionTitle title="Contacto" />
          <div className="grid grid-cols-1 gap-4">
            <InputField label="Teléfono" required type="tel" placeholder="10 dígitos" {...field('telefono')} />
            <InputField label="Correo Electrónico" required type="email" placeholder="ejemplo@correo.com" {...field('correoElectronico')} />
            <InputField label="Domicilio" required {...field('domicilio')} />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionTitle title="Datos del Puesto" />
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Departamento" required {...field('departamento')}
                options={Object.keys(PUESTOS_POR_DEPARTAMENTO)} />
              {puestosDisponibles.length > 0 ? (
                <SelectField label="Puesto / Rol" required {...field('puesto')} options={puestosDisponibles} />
              ) : (
                <SelectField label="Puesto / Rol" name="puesto" value="" onChange={() => {}} options={[]} disabled />
              )}
            </div>
            <InputField label="Fecha de Ingreso" required type="date" {...field('fechaIngreso')} />
            <SelectField label="Tipo de Contrato" required {...field('tipoContrato')}
              options={['BASE', 'HONORARIOS', 'CONFIANZA', 'SERVICIO SOCIAL', 'PRÁCTICAS PROFESIONALES']} />
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Escolaridad" required {...field('escolaridad')} options={ESCOLARIDADES} />
              <InputField label="Años de Experiencia" type="number" {...field('anosExperiencia')} />
            </div>
          </div>
        </section>
      </div>

      {/* ── Acciones ── */}
      <div className="flex justify-end gap-3 pb-2">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold shadow-sm text-sm">
          <X size={16} /> Cancelar
        </button>
        <button onClick={handleGuardar} disabled={loading}
          className="flex items-center gap-2 px-7 py-2.5 bg-[#7E1D3B] text-white rounded-xl font-semibold hover:bg-[#63162e] shadow-sm transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed">
          <Save size={16} /> {loading ? 'Guardando...' : 'Registrar Personal'}
        </button>
      </div>
    </RHLayout>
  );
};

export default AltaPersonal;
