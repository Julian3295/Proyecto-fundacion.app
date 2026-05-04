"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUsuarioActual, cerrarSesion } from './actions';
import { useAnimeIntro } from './hooks/useAnime';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import SpotifySearch from '../components/SpotifySearch';
import AuthModal from '../components/AuthModal';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const containerRef = useAnimeIntro();

  // Cargar juegos
  useEffect(() => {
    const fetchGames = async () => {
      const key = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${key}&genres=sports&page_size=3`);
        const data = await response.json();
        setGames(data.results || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGames();
  }, []);

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const usuario = await getUsuarioActual();
      if (usuario) {
        setUser(usuario);
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    window.location.reload();
  };

  const handleLogout = async () => {
    await cerrarSesion();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Mostrar modal de login si no está autenticado
  if (!isAuthenticated) {
    return <AuthModal onLogin={handleLogin} />;
  }

  return (
    <main ref={containerRef} className="min-h-screen bg-linear-to-b from-[#030712] to-[#0a0f1a] text-white">
      
      {/* Menú con botón de salir */}
      <Menu user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
        
        {/* HEADER CON LOGO BETA */}
        <header id="inicio" className="text-center anime-item">
          <div className="relative anime-logo inline-block">
            <Image 
              src="/images/logo-habilidosos.png"
              alt="HABILIDOSOS BETA"
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

        {/* REGISTRO DE MIEMBROS*/}
        <section id="registro" className="anime-item">
          {/*<div className="bg-gray-900/30 rounded-3xl p-6 border border-green-500/20">
            {/*<h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>📝</span> Registrar Nuevo Miembro
            </h2>
            <form className="space-y-4 max-w-md mx-auto">
              <input 
                type="text"
                placeholder="Nombre completo del deportista"
                className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white"
              />
              <select className="w-full p-3 rounded-xl bg-black/50 border border-gray-600 text-white">
                <option>Jugador</option>
                <option>Entrenador</option>
                <option>Voluntario</option>
              </select>
              <button className="w-full p-3 bg-linear-to-r from-green-600 to-green-500 rounded-xl font-bold">
                💾 Guardar en Base de Datos
              </button>
            </form>
          </div>*/}
        </section>

        {/* SCOUTING POKÉMON */}
        <section id="scouting" className="anime-item">
          {/*<div className="bg-gray-900/30 rounded-3xl p-6 border border-yellow-500/20">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span>⚡</span> Scouting Pokémon
            </h2>
            <p className="text-gray-400 text-center py-8">
              Próximamente: Estadísticas de Pokémon
            </p>
          </div>*/}
        </section>

        {/* ZONA DE JUEGOS */}
        <section id="juegos" className="anime-item">
          <div className="bg-gray-900/30 rounded-3xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <span>🎮</span> Zona de Juegos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-8">
                  Cargando juegos...
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