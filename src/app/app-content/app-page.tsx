"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cerrarSesion } from '../actions';
import { useAnimeIntro } from '../hooks/useAnime';
import Menu from '../../components/Menu';
import Footer from '../../components/Footer';
import SpotifySearch from '../../components/SpotifySearch';
import { Images } from 'lucide-react';

const POKEMON_STATS: Record<string, any> = {
  charmander: { tipo: "🔥 Fuego", color: "text-orange-400", poder: "85%", lvl: 99 },
  bulbasaur: { tipo: "🌿 Planta", color: "text-green-400", poder: "75%", lvl: 82 },
  squirtle: { tipo: "💧 Agua", color: "text-blue-400", poder: "80%", lvl: 88 },
  pikachu: { tipo: "⚡ Eléctrico", color: "text-yellow-400", poder: "90%", lvl: 95 },
};

export default function AppPage() {
  const [user, setUser] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [showStats, setShowStats] = useState(false);
  const containerRef = useAnimeIntro();

  const handleLogout = async () => {
    await cerrarSesion();
    window.location.reload();
  };

  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(data => setUser(data));
    fetch('/api/games')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error("Error cargando juegos:", err));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentPokemon = (user?.pokemonAvatar || 'charmander').toLowerCase();
  const stats = POKEMON_STATS[currentPokemon] || { tipo: "Normal", color: "text-white", poder: "50%", lvl: 10 };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#030712] text-white relative">
      <nav className="fixed top-0 left-0 right-0 z-60 bg-[#030712]/60 backdrop-blur-xl border-b border-white/5 px-4 md:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <div className="hidden md:block">
            <Menu user={user} onLogout={handleLogout} />
          </div>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowStats(true);
            }}
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 p-1 pr-4 rounded-full border border-emerald-500/30 transition-all cursor-pointer relative z-70"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-emerald-500 overflow-hidden bg-black">
              <img
                src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${currentPokemon}.gif`}
                alt="Pokemon Avatar"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter">{user?.nombre?.split(' ')[0] || 'USUARIO'}</p>
              <p className="text-[8px] text-emerald-400 font-bold">● ONLINE</p>
            </div>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 space-y-20">
        <header className="text-center mb-10">
          <Image
            src="/images/logo-habilidosos.png"
            alt="Logo Hero"
            width={400}
            height={150}
            priority
            className="mx-auto w-64 md:w-96 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] h-auto"
          />
          <div className="mt-6 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">Versión Beta 2.0</span>
          </div>
        </header>

        <section id="juegos" className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Zona de Juegos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.length > 0 ? (
              games.map((juego) => (
                <div key={juego.id} className="group relative bg-gray-900/40 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 transition-all duration-500 shadow-xl">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-t from-[#030712] to-transparent z-10" />
                    <Image
                      src={juego.thumbnail || juego.imagen || ""}
                      alt={juego.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70"
                      unoptimized
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        {juego.genre || "Game"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 relative z-20">
                    <h3 className="text-xl font-black italic uppercase mb-4 tracking-tighter line-clamp-1">{juego.title}</h3>
                    <a
                      href={juego.game_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center py-3 bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 rounded-xl font-bold text-xs uppercase transition-all duration-300"
                    >
                      Jugar Ahora
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Cargando servidores...</p>
              </div>
            )}
          </div>
        </section>

        <section id="ritmo" className="bg-gray-900/30 backdrop-blur-sm p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl">🎵</span>
            <h2 className="text-2xl font-black italic uppercase text-blue-400">Ritmo Habilidosos</h2>
          </div>
          <SpotifySearch />
        </section>

        <Footer />
      </div>

      {showStats && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowStats(false)} />
          <div className="relative bg-[#0a0f1a] border border-emerald-500/50 rounded-[2.5rem] p-10 max-w-85 w-full shadow-2xl animate-in zoom-in duration-300">
            <button onClick={() => setShowStats(false)} className="absolute top-6 right-6 text-white/20 hover:text-white">✕</button>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-6 bg-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/20">
                <img src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${currentPokemon}.gif`} className="w-16 h-16 object-contain" />
              </div>
              <h2 className="text-3xl font-black italic uppercase mb-1">{currentPokemon}</h2>
              <p className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase mb-8">Estatus Habilidoso</p>
              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Tipo</p>
                  <p className={`font-bold text-sm ${stats.color}`}>{stats.tipo}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl">
                  <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Nivel</p>
                  <p className="font-bold text-sm text-emerald-400">LVL {stats.lvl}</p>
                </div>
              </div>
              <div className="w-full text-left space-y-2">
                <div className="flex justify-between text-[10px] font-black">
                  <span>PODER</span>
                  <span className="text-emerald-400">{stats.poder}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full p-0.5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: stats.poder }} />
                </div>
              </div>
              <button onClick={() => setShowStats(false)} className="mt-10 w-full py-4 bg-emerald-500 text-black font-black rounded-2xl text-xs uppercase hover:bg-emerald-400 transition-all">
                Cerrar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
