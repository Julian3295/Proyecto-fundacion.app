"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cerrarSesion, actualizarAvatar } from '../actions';
import { useAnimeIntro, useAnimeScroll } from '../hooks/useAnime';
import Menu from '../../components/Menu';
import Footer from '../../components/Footer';
import SpotifySearch from '../../components/SpotifySearch';
import PokemonSelector from '../../components/PokemonSelector';
import { FaMusic } from 'react-icons/fa';
import { X, Flame, Leaf, Droplet, Zap, RefreshCw, Weight, Ruler, Star } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  fire: "text-orange-400", grass: "text-green-400", water: "text-blue-400",
  electric: "text-yellow-400", normal: "text-gray-300", fighting: "text-red-500",
  flying: "text-indigo-300", poison: "text-purple-500", ground: "text-amber-600",
  rock: "text-yellow-700", bug: "text-lime-400", ghost: "text-violet-500",
  steel: "text-gray-400", ice: "text-cyan-300", dragon: "text-indigo-600",
  dark: "text-neutral-600", fairy: "text-pink-300", psychic: "text-fuchsia-400",
};

const TYPE_ICONS: Record<string, any> = {
  fire: Flame, grass: Leaf, water: Droplet, electric: Zap,
};

interface PokemonDetails {
  stats: { name: string; value: number }[];
  types: { name: string }[];
  height: number;
  weight: number;
  abilities: string[];
}

function statLabel(name: string): string {
  const map: Record<string, string> = {
    hp: "HP", attack: "ATK", defense: "DEF",
    "special-attack": "SP.ATK", "special-defense": "SP.DEF", speed: "SPD",
  };
  return map[name] || name.toUpperCase();
}

function statColor(value: number): string {
  if (value >= 100) return "bg-green-500";
  if (value >= 70) return "bg-emerald-400";
  if (value >= 50) return "bg-yellow-400";
  return "bg-red-400";
}

export default function AppPage() {
  const [user, setUser] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [changingPokemon, setChangingPokemon] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const containerRef = useAnimeIntro();
  useAnimeScroll();

  const handleLogout = async () => {
    await cerrarSesion();
    window.location.reload();
  };

  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(data => {
      if (data?.id) setUser(data);
    }).catch(err => console.error("Error fetching user:", err));
    fetch('/api/games')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error("Error cargando juegos:", err));
  }, []);

  useEffect(() => {
    if (!showStats || changingPokemon) return;
    const pokemon = (user?.pokemonAvatar || 'charmander').toLowerCase();
    fetchDetails(pokemon);
  }, [showStats, changingPokemon, user?.pokemonAvatar]);

  const fetchDetails = async (pokemon: string) => {
    setDetailsLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      const data = await res.json();
      setPokemonDetails({
        stats: data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        types: data.types.map((t: any) => ({ name: t.type.name })),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((a: any) => a.ability.name),
      });
    } catch {
      setPokemonDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentPokemon = (user?.pokemonAvatar || 'charmander').toLowerCase();

  return (
    <main ref={containerRef} className="min-h-screen bg-[#030712] text-white relative flex flex-col">
      <Menu
        user={user}
        onLogout={handleLogout}
        pokemonName={currentPokemon}
        onShowStats={() => setShowStats(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 pt-32 pb-12 space-y-20">
        <header id="inicio" className="text-center mb-10">
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
            <FaMusic className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-black italic uppercase text-blue-400">Ritmo Habilidosos</h2>
          </div>
          <SpotifySearch />
        </section>
      </div>

      <Footer />

      {showStats && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => { setShowStats(false); setChangingPokemon(false); }} />
          <div className="relative bg-[#0a0f1a] border border-emerald-500/50 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setShowStats(false); setChangingPokemon(false); }} className="absolute top-4 right-4 text-white/20 hover:text-white z-10"><X className="w-5 h-5" /></button>

            {changingPokemon ? (
              <div className="flex flex-col items-center pt-4">
                <h2 className="text-2xl font-black italic uppercase mb-2 text-emerald-400">Cambiar Pokémon</h2>
                <p className="text-gray-400 text-sm mb-6">Selecciona tu nuevo compañero</p>
                <PokemonSelector
                  onSelect={async (pokemonNombre) => {
                    const result = await actualizarAvatar(pokemonNombre);
                    if (result.success) {
                      setUser((prev: any) => ({ ...prev, pokemonAvatar: pokemonNombre }));
                      setPokemonDetails(null);
                      setChangingPokemon(false);
                    }
                  }}
                  selectedPokemon={currentPokemon}
                />
                <button
                  onClick={() => setChangingPokemon(false)}
                  className="mt-6 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center pt-2">
                <div className="w-24 h-24 mb-4 bg-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <img src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${currentPokemon}.gif`} alt={currentPokemon} className="w-16 h-16 object-contain" />
                </div>
                <h2 className="text-3xl font-black italic uppercase mb-1">{currentPokemon}</h2>
                <p className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase mb-6">Estatus Habilidoso</p>

                {detailsLoading ? (
                  <div className="py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                  </div>
                ) : pokemonDetails ? (
                  <>
                    {/* Type badges */}
                    <div className="flex gap-2 mb-6">
                      {pokemonDetails.types.map((t) => {
                        const Icon = TYPE_ICONS[t.name];
                        return (
                          <span key={t.name} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/5 ${TYPE_COLORS[t.name] || "text-gray-300"}`}>
                            {Icon && <Icon className="w-3 h-3" />}
                            {t.name}
                          </span>
                        );
                      })}
                    </div>

                    {/* Base Stats */}
                    <div className="w-full space-y-3 mb-6">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest text-left">Stats Base</p>
                      {pokemonDetails.stats.map((s) => (
                        <div key={s.name} className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-gray-400 w-14 text-right">{statLabel(s.name)}</span>
                          <span className="text-xs font-black w-7 text-right text-white">{s.value}</span>
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${statColor(s.value)}`}
                              style={{ width: `${Math.min((s.value / 255) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Overall power */}
                    <div className="w-full mb-6">
                      {(() => {
                        const avg = Math.round(pokemonDetails.stats.reduce((a, s) => a + s.value, 0) / pokemonDetails.stats.length);
                        return (
                          <div className="w-full text-left space-y-2">
                            <div className="flex justify-between text-[10px] font-black">
                              <span>PODER TOTAL</span>
                              <span className="text-emerald-400">{avg}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full p-0.5">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avg}%` }} />
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Height, Weight, Abilities */}
                    <div className="grid grid-cols-3 gap-3 w-full mb-6">
                      <div className="bg-white/5 p-3 rounded-2xl">
                        <Ruler className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                        <p className="text-[8px] text-gray-500 font-black uppercase mb-0.5">Altura</p>
                        <p className="font-bold text-sm">{(pokemonDetails.height / 10).toFixed(1)} m</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl">
                        <Weight className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                        <p className="text-[8px] text-gray-500 font-black uppercase mb-0.5">Peso</p>
                        <p className="font-bold text-sm">{(pokemonDetails.weight / 10).toFixed(1)} kg</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl">
                        <Star className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                        <p className="text-[8px] text-gray-500 font-black uppercase mb-0.5">Habilidades</p>
                        <p className="font-bold text-xs leading-tight capitalize">{pokemonDetails.abilities.slice(0, 2).join(", ")}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm mb-6">No se pudieron cargar los datos</p>
                )}

                <button
                  onClick={() => setChangingPokemon(true)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Cambiar Pokémon
                </button>
                <button onClick={() => setShowStats(false)} className="mt-3 w-full py-4 bg-emerald-500 text-black font-black rounded-2xl text-xs uppercase hover:bg-emerald-400 transition-all">
                  Cerrar Reporte
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
