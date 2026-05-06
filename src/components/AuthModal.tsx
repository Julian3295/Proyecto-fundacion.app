'use client';
import { useState } from 'react';
import Image from 'next/image';
import { registrarUsuario, iniciarSesion } from '../app/actions';
import PokemonSelector from './PokemonSelector'; // Asegúrate de que la ruta sea correcta
import { actualizarAvatar } from '../app/actions'; // Crearemos esta acción ahora

const PokemonesIniciales = [
  { nombre: 'Pikachu', stats: { velocidad: 90, ataque: 55 }, img: 'https://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif' },
  { nombre: 'Bulbasaur', stats: { defensa: 49, salud: 45 }, img: 'https://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif' },
  { nombre: 'Charmander', stats: { ataque: 52, velocidad: 65 }, img: 'https://img.pokemondb.net/sprites/black-white/anim/normal/charmander.gif' }
];

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
          // Si es registro exitoso, vamos al paso 2
          setPaso(2);
        } else {
          // SI ES LOGIN EXITOSO:
          // 1. Ejecutamos onLogin() para actualizar el estado local
          onLogin();
          // 2. IMPORTANTE: Recargamos la ventana para que el middleware/page.tsx 
          // lea las cookies recién creadas y no te rebote.
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
    // Llamamos a una acción del servidor para guardar el nombre del Pokémon
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 border border-green-500/30 shadow-2xl">
        
        {paso === 1 ? (
          <>
            <div className="text-center mb-6">
              <div className="relative anime-logo inline-block">
                <Image 
                  src="/images/habiupscalemediapreview.png" 
                  alt="HABILIDOSOS BETA"
                  width={280}
                  height={90}
                  className="mx-auto drop-shadow-2xl relative z-10"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold text-green-400">
                {isLogin ? 'Bienvenido' : 'Únete a HABILIDOSOS BETA'}
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratis'}
              </p>
            </div>

            <form action={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  name="nombre"
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white focus:border-green-500 outline-none"
                  required
                />
              )}
              
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white focus:border-green-500 outline-none"
                required
              />
              
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white focus:border-green-500 outline-none"
                required
              />

              {message && (
                <p className="text-red-400 text-sm text-center">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-green-600 to-green-500 rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 text-white shadow-lg shadow-green-900/20"
              >
                {loading ? 'Cargando...' : (isLogin ? '🚀 Iniciar Sesión' : '✨ Registrarse')}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-4">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-green-400 hover:underline"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </>
        ) : (
  /* PASO 2: AHORA CON 151 OPCIONES */
  <div className="animate-in fade-in zoom-in duration-300">
    <h2 className="text-2xl font-bold text-white text-center mb-2">¡Elige tu compañero!</h2>
    
    {/* Usamos el componente que ya tenías guardado */}
    <PokemonSelector 
      onSelect={(pokemonNombre) => setSeleccionado({ name: pokemonNombre })} 
      selectedPokemon={seleccionado?.name}
    />

    <button 
      onClick={finalizarRegistro}
      disabled={!seleccionado || loading}
      className="w-full mt-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-green-900/40"
    >
      {loading ? 'Guardando...' : 'Completar Perfil 🎮'}
    </button>
  </div>
)}
      </div>
    </div>
  );
}