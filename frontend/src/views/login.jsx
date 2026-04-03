// src/views/Login/Login.jsx
import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7E1D3B] to-[#1E3A2A] p-4">
      
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md flex flex-col items-center">
        
        {/* Encabezado de Logos */}
        <div className="mb-10 w-full flex flex-col items-center border border-gray-100 p-4 rounded-lg shadow-sm">
           <h2 className="text-[#7E1D3B] font-bold text-xl">NAYARIT | MARAKAME</h2>
           <p className="text-[10px] text-gray-400 uppercase tracking-widest">Gobierno del Estado</p>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-1">Sistema de Gestión</h1>
        <p className="text-gray-500 mb-10 text-sm">Instituto Marakame</p>

        <form className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Usuario</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border-0 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#7E1D3B] outline-none transition-all" 
              placeholder="Introduce tu usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border-0 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#7E1D3B] outline-none transition-all" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#7E1D3B] text-white py-3.5 rounded-lg font-semibold hover:bg-[#63162e] transition-all shadow-lg active:scale-95"
          >
            Iniciar sesión
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