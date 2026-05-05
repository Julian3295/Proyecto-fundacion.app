"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cerrarSesion } from './actions';
import { useAnimeIntro } from './hooks/useAnime';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import SpotifySearch from '../components/SpotifySearch';
import AuthModal from '../components/AuthModal';

export default function Home() {
  // 1. Iniciamos en null para saber que estamos "cargando" la sesión
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const containerRef = useAnimeIntro();

  // Cargar juegos (RAWG API)
  useEffect(() => {
    const fetchGames = async () => {
      const key = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${key}&genres=sports&page_size=3`);
        const data = await response.json();
        setGames(data.results || []);
      } catch (error) {
        console.error("Error cargando juegos:", error);
      }
    };
    fetchGames();
  }, []);

  // 2. Verificar autenticación al montar el componente
  useEffect(() => {
    const checkAuth = () => {
      // Buscamos la cookie directamente en el navegador
      const match = document.cookie.match(new RegExp('(^| )userId=([^;]+)'));
      if (match) {
        setIsAuthenticated(true);
        // Opcional: podrías recuperar el nombre de la cookie 'userNombre' aquí
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    window.location.reload(); // Recargamos para limpiar estados y asegurar cookies
  };

  const handleLogout = async () => {
    await cerrarSesion();
    setIsAuthenticated(false);
    setUser(null);
  };

  // 3. Mientras verificamos la sesión (milisegundos), no mostramos nada o un spinner
  // Esto evita que el Modal aparezca y desaparezca de golpe
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#030712]" />; 
  }

  // Si definitivamente no está autenticado, mostramos el modal
  if (!isAuthenticated) {
    return <AuthModal onLogin={handleLogin} />;
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-linear-to-b from-[#030712] to-[#0a0f1a] text-white">
      
      <Menu user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
        
        {/* HEADER */}
        <header id="inicio" className="text-center anime-item">
          <div className="relative anime-logo inline-block">
            <Image 
              src="/images/logo-habilidosos.png"
              alt="HABILIDOSOS"
              width={280}
              height={90}
              className="mx-auto drop-shadow-2xl relative z-10"
              priority
            />
          </div>
          <div className="mt-2">
            <span className="inline-block bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              BETA
            </span>
          </div>
          <p className="text-gray-400 mt-4">Tecnología aplicada al deporte y la recreación</p>
        </header>

        {/* ZONA DE JUEGOS */}
        <section id="juegos" className="anime-item">
          <div className="bg-gray-900/30 rounded-3xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <span>🎮</span> Zona de Juegos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-8">
                  Cargando juegos de RAWG...
                </div>
              ) : (
                games.map((game) => (
                  <div key={game.id} className="group relative overflow-hidden rounded-2xl h-40 border border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer">
                    <img 
                      src={game.background_image} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110" 
                      alt={game.name}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent p-4 flex flex-col justify-end">
                      <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors">
                        {game.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400 font-bold">★ {game.rating?.toFixed(1)}</span>
                        <span className="text-xs text-gray-400 uppercase">SPORTS</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* RITMO HABILIDOSOS */}
        <section id="ritmo" className="anime-item">
          <div className="bg-gray-900/30 rounded-3xl p-6 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>🎵</span> Ritmo Habilidosos
            </h2>
            <SpotifySearch />
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}