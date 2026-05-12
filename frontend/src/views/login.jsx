import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import marakameLogo from '../assets/marakame.jpeg';

const RUTAS_POR_ROL = {
  'ADMISIONES': '/admisiones',
  'MÉDICO':     '/medico/inicio-jefe-medico',
  'CLINICO':    '/clinico/inicio',
  'RH':         '/rh/alta-personal',
  'FINANCIERO': '/financiero/archivo-contable',
  'MATERIALES': '/materiales/rec-materiales',
  'ALMACÉN':    '/almacen',
  'ADMIN':      '/admisiones',
};

// Puestos con ruta propia — tienen prioridad sobre el rol
const RUTAS_POR_PUESTO = {
  'NUTRIÓLOGA (O)':                        '/nutriologo/inicio',
  'JEFA (E) DEP. ADMINISTRACIÓN':          '/materiales/administracion',
  'DIRECTORA GENERAL':                     '/materiales/direccion-general',
  'ENCARGADA (O) DE ALMACÉN':              '/almacen',
  // Clínico — jefatura
  'JEFA (E) DEP. CLÍNICO':                '/clinico/inicio',
  // Clínico — psicología
  'PSICÓLOGA (O)':                         '/psicologia/inicio',
  // Clínico — familia
  'TERAPEUTA FAMILIAR':                    '/familia/inicio',
  'ENCARGADA (O) DE FAMILIA':              '/familia/inicio',
  // Clínico — consejería
  'CONSEJERA (O) ASIGNADO':               '/consejeria/inicio',
  'ENCARGADA (O) DE CONSEJEROS ASIGNADOS':'/consejeria/inicio',
  // Clínico — terapeutas operativos
  'TERAPEUTA DE GRUPO':                    '/clinico/inicio-terapeuta',
  'COTERAPEUTA':                           '/clinico/inicio-terapeuta',
  'TERAPEUTA DE POST-TRATAMIENTO':         '/clinico/inicio-terapeuta',
  'ENCARGADA (O) DE POST TRATAMIENTO':     '/clinico/inicio-terapeuta',
  'AUXILIAR ADMINISTRATIVO':               '/clinico/inicio-terapeuta',
};

const getRutaInicial = (rol, puesto) => RUTAS_POR_PUESTO[puesto] ?? RUTAS_POR_ROL[rol] ?? '/admisiones';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión.');
        return;
      }

      localStorage.setItem('marakame_user', JSON.stringify(data));
      navigate(getRutaInicial(data.rol, data.puesto), { replace: true });
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7E1D3B] to-[#1E3A2A] p-4">

      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md flex flex-col items-center">

        <div className="mb-10 w-full flex flex-col items-center border border-gray-100 p-4 rounded-lg shadow-sm">
          <img
            src={marakameLogo}
            alt="Logo Nayarit Marakame"
            className="mb-3 h-auto w-full max-w-[380px] rounded-md"
          />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Gobierno del Estado</p>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-1">Sistema de Gestión</h1>
        <p className="text-gray-500 mb-10 text-sm">Instituto Marakame</p>

        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-0 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#7E1D3B] outline-none transition-all"
              placeholder="Introduce tu usuario"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-0 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#7E1D3B] outline-none transition-all"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7E1D3B] text-white py-3.5 rounded-lg font-semibold hover:bg-[#63162e] transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <a href="#" className="mt-6 text-sm text-[#7E1D3B] font-medium hover:underline">
          ¿Olvidó sus credenciales?
        </a>

        <div className="mt-12 text-center text-[10px] text-gray-400 leading-tight">
          <p className="font-semibold">CONFORME A NOM-004-SSA3-2012 Y NOM-028-SSA3-2012</p>
          <p className="mt-1">© 2026 Instituto Marakame - Tepic, Nayarit</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
