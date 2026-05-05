'use client';
import { useState } from 'react';
import Image from 'next/image';
import { registrarUsuario, iniciarSesion } from '../app/actions';

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
    setLoading(true);
    setTimeout(() => {
      onLogin();
      window.location.reload(); // Recarga tras elegir Pokémon
    }, 1000);
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
          /* PASO 2: SELECTOR POKÉMON */
          <div className="animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white text-center mb-2">¡Casi listo!</h2>
            <p className="text-gray-400 text-center text-sm mb-6">Selecciona tu avatar inicial</p>
            
            <div className="grid grid-cols-1 gap-4">
              {PokemonesIniciales.map((poke) => (
                <div 
                  key={poke.nombre}
                  onClick={() => setSeleccionado(poke)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    seleccionado?.nombre === poke.nombre 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <img src={poke.img} alt={poke.nombre} className="w-14 h-14 object-contain" />
                  <div className="flex-1">
                    <p className="text-white font-bold">{poke.nombre}</p>
                    <div className="mt-1 space-y-1">
                      {Object.entries(poke.stats).map(([stat, val]: [string, any]) => (
                        <div key={stat} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 uppercase w-12">{stat}</span>
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400" style={{ width: `${val}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={finalizarRegistro}
              disabled={!seleccionado || loading}
              className="w-full mt-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              Completar Perfil 🎮
            </button>
          </div>
        )}
      </div>
    </div>
  );
}