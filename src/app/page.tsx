"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { registrarMiembro } from "./actions";
import PokemonSearch from "../components/PokemonSearch";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Image from 'next/image';

export default function Home() {
  const container = useRef(null);
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  // Scouting Pokémon (4 primeros)
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=4');
        const data = await response.json();
        const detailedData = await Promise.all(
          data.results.map(async (p: any) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );
        setPokemon(detailedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPokemon();
  }, []);

  // Zona de Juegos (sports)
  useEffect(() => {
    const fetchGames = async () => {
      const key = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${key}&genres=sports&page_size=3`);
        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGames();
  }, []);

  useGSAP(() => {
    gsap.fromTo(".anim-item", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
    );

    if (pokemon.length > 0) {
      gsap.to(".stat-bar", {
        width: (index, target: any) => target.getAttribute('data-width'), 
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out",
        stagger: 0.08
      });
    }
  }, { scope: container, dependencies: [pokemon] });

  return (
    <main ref={container} className="min-h-screen bg-linear-to-b from-[#030712] via-[#0a0f1a] to-[#030712] text-white overflow-x-hidden">
      
      <Menu />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 space-y-16 sm:space-y-20 md:space-y-24">
        
        {/* HERO - Logo y bienvenida con tu nuevo logo */}
        <header id="inicio" className="anim-item text-center pt-4 sm:pt-8">
          <div className="flex justify-center mb-6">
            <Image 
              src="/imagenes/logososbeta v1.png"  // ← Cambiado a tu logo anterior
              alt="Habilidosos FC"
              width={320}
              height={100}
              className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-2xl"
              priority
            />
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Tecnología aplicada al deporte y la recreación
          </p>
        </header>

        {/* SECCIÓN 1 - REGISTRO DE MIEMBROS */}
        <section id="registro" className="anim-item">
          <div className="bg-linear-to-br from-gray-900/40 to-gray-800/20 rounded-3xl p-6 sm:p-8 border border-green-500/20 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
                Registrar Nuevo Miembro
              </h2>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <form action={registrarMiembro} className="flex flex-col gap-5">
                <input 
                  name="nombre"
                  placeholder="Nombre completo del deportista" 
                  className="p-4 rounded-xl bg-black/50 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  required
                />
                <select 
                  name="rol" 
                  className="p-4 rounded-xl bg-black/50 border border-gray-700 text-white focus:border-green-500 outline-none transition-all cursor-pointer"
                  required
                >
                  <option value="Jugador">👤 Jugador</option>
                  <option value="Entrenador">📋 Entrenador</option>
                  <option value="Voluntario">🤝 Voluntario</option>
                </select>
                <button 
                  type="submit" 
                  className="bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-900/30"
                >
                  💾 Guardar en Base de Datos
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2 - SCOUTING POKÉMON */}
        <section id="scouting" className="anim-item">
          <div className="bg-gray-900/30 rounded-3xl p-6 sm:p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
                Scouting Pokémon
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pokemon.map((p) => (
                <div key={p.id} className="group p-4 bg-black/40 rounded-2xl border border-gray-800/50 hover:border-green-500/30 transition-all hover:bg-black/60">
                  <div className="flex items-center gap-4">
                    <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-full p-2 group-hover:scale-110 transition-transform">
                      <img src={p.sprites.front_default} className="w-12 h-12" alt={p.name} />
                    </div>
                    <div className="flex-1">
                      <p className="uppercase text-sm font-bold text-white group-hover:text-green-400 transition-colors">
                        {p.name}
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Velocidad</span>
                          <span className="text-green-400">{p.stats[5].base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-linear-to-r from-green-500 to-green-400 h-full rounded-full stat-bar" 
                            data-width={`${p.stats[5].base_stat}%`}
                            style={{ width: '0%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 3 - ZONA DE JUEGOS */}
        <section id="juegos" className="anim-item">
          <div className="bg-gray-900/30 rounded-3xl p-6 sm:p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-400">
                Zona de Juegos
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {games && games.map((game) => (
                <div key={game.id} className="group relative overflow-hidden rounded-2xl h-48 border border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer">
                  <img 
                    src={game.background_image} 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110" 
                    alt={game.name}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent p-5 flex flex-col justify-end">
                    <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors line-clamp-1">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-400 font-bold">★ {game.rating?.toFixed(1)}</span>
                      <span className="text-xs text-gray-400 uppercase">SPORTS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4 - RITMO HABILIDOSOS (SPOTIFY CORREGIDO) */}
        <section id="ritmo" className="anim-item">
          <div className="bg-gray-900/30 rounded-3xl p-6 sm:p-8 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🎵</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-400">
                Ritmo Habilidosos
              </h2>
            </div>
            
            {/* Spotify Embed CORREGIDO - Usando un playlist real y funcional */}
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 bg-black/40 p-4">
              <iframe 
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="rounded-xl"
              ></iframe>
              <p className="text-gray-500 text-xs text-center mt-3">
                Playlist oficial - Música para entrenar ⚽
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5 - ANALIZADOR DE CAPACIDAD */}
        <section className="anim-item">
          <PokemonSearch />
        </section>

        {/* FRASE MOTIVACIONAL - ELIMINADA */}

        <Footer />
      </div>
    </main>
  );
}