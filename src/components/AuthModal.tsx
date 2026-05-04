// src/app/components/AuthModal.tsx
'use client';
import { useState } from 'react';
import { registrarUsuario, iniciarSesion } from '../app/actions';

export default function AuthModal({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage('');
    
    const action = isLogin ? iniciarSesion : registrarUsuario;
    const result = await action(formData) as { success: boolean; error?: string };
    
    if (result.success) {
      onLogin();
    } else {
      setMessage(result.error || 'Error al procesar');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 border border-green-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚽</span>
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
              className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white"
              required
            />
          )}
          
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white"
            required
          />
          
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white"
            required
          />

          {message && (
            <p className="text-red-400 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-green-600 to-green-500 rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
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
        
        <div className="mt-4 text-center">
          <button
            onClick={async () => {
              const demoForm = new FormData();
              demoForm.set('email', 'demo@test.com');
              demoForm.set('password', '123456');
              demoForm.set('nombre', 'Demo User');
              const result = await iniciarSesion(demoForm);
              if (result.success) onLogin();
            }}
            className="text-gray-500 text-xs hover:text-green-400 transition"
          >
            🚪 Acceso rápido (demo)
          </button>
        </div>
      </div>
    </div>
  );
}