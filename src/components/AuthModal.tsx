"use client";

import { useState } from 'react';
import Image from 'next/image';
import { registrarUsuario, iniciarSesion, actualizarAvatar } from '../app/actions';
import PokemonSelector from './PokemonSelector';

export default function AuthModal({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paso, setPaso] = useState(1);
  const [seleccionado, setSeleccionado] = useState<any>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage('');
    
    try {
      const action = isLogin ? iniciarSesion : registrarUsuario;
      const result = await action(formData) as any; 
      
      if (result && result.success) {
        if (!isLogin && paso === 1) {
          setPaso(2);
        } else {
          onLogin();
          window.location.reload();
        }
      } else {
        setMessage(result?.error || 'Error al procesar');
      }
    } catch (err) {
      setMessage('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const finalizarRegistro = async () => {
    if (!seleccionado) return;
    setLoading(true);
    try {
      const result = await actualizarAvatar(seleccionado.name || seleccionado.nombre);
      if (result.success) {
        onLogin();
        window.location.reload(); 
      } else {
        setMessage("No se pudo guardar el avatar");
      }
    } catch (err) {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      {/* CONTENEDOR PRINCIPAL - Estilo moderno redondeado */}
      <div className="w-full max-w-md bg-[#111827] border border-gray-700/50 rounded-4xl p-8 shadow-2xl text-center">
        
        {paso === 1 ? (
          <>
            {/* LOGO PERSONAJE / ARDILLA */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-52 h-52 transition-transform duration-300 ease-out hover:scale-110 cursor-pointer">
                <Image 
                  src="/images/habiupscalemediapreview.png" 
                  alt="Habi Logo"
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  priority
                />
              </div>
            </div>

            {/* TEXTOS */}
            <h2 className="text-3xl font-bold text-[#10b981] mb-1">
              {isLogin ? 'Bienvenido' : 'Únete ahora'}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta de Habilidosos'}
            </p>

            {/* FORMULARIO */}
            <form action={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre de Habilidoso"
                  className="w-full px-6 py-4 rounded-xl bg-[#e5edff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-gray-500"
                  required
                />
              )}
              
              <input
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full px-6 py-4 rounded-xl bg-[#e5edff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-gray-500"
                required
              />
              
              <input
                name="password"
                type="password"
                placeholder="••••••••••"
                className="w-full px-6 py-4 rounded-xl bg-[#e5edff] text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium placeholder:text-gray-500"
                required
              />

              {message && (
                <p className="text-red-400 text-sm font-semibold">{message}</p>
              )}

              {/* BOTÓN CON GRADIENTE VERDE */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-linear-to-r from-[#10b981] to-[#059669] text-white font-bold text-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : (isLogin ? '🚀 Iniciar Sesión' : '✨ Registrarse')}
              </button>
            </form>

            {/* SWITCHER */}
            <div className="mt-8 text-sm">
              <span className="text-gray-400">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya eres parte?'}
              </span>{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
                className="text-[#10b981] font-bold hover:underline ml-1"
              >
                {isLogin ? 'Regístrate' : 'Inicia Sesión'}
              </button>
            </div>
          </>
        ) : (
          /* PASO 2: SELECCIÓN DE POKÉMON CON EL MISMO ESTILO */
          <div className="animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-[#10b981] mb-2">¡Casi listo!</h2>
            <p className="text-gray-400 text-sm mb-6">Elige a tu compañero de aventura</p>
            
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
              <PokemonSelector 
                onSelect={(pokemonNombre) => setSeleccionado({ name: pokemonNombre })} 
                selectedPokemon={seleccionado?.name}
              />
            </div>

            <button 
              onClick={finalizarRegistro}
              disabled={!seleccionado || loading}
              className="w-full mt-8 py-4 bg-linear-to-r from-[#10b981] to-[#059669] text-white rounded-2xl font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Guardando...' : 'Completar Perfil 🎮'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}