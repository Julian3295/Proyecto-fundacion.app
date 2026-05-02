"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { registrarMiembro } from "./actions"
import PokemonSearch from "../components/PokemonSearch";
import Footer from "../components/Footer";
import SosHabilidoso from '@/components/SosHabilidoso';
import MusicSearch from '@/components/MusicSearch';

export default function Home() {
  const container = useRef(null);
  const [pokemon, setPokemon] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  // Lógica para Pokémon (Scouting de Fútbol)
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

  // Lógica para Juegos (RAWG)
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
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );

    if (pokemon.length > 0) {
      gsap.to(".stat-bar", {
        width: (index, target: any) => target.getAttribute('data-width'), 
        duration: 1.5,
        delay: 0.5,
        ease: "power4.out",
        stagger: 0.1
      });
    }
  }, { scope: container, dependencies: [pokemon] });

  return (
    <main ref={container} className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      {/* Contenedor Central con Margen Superior para el Header */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-20">
        
        {/* HEADER DE BIENVENIDA */}
        <header className="anim-item text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.6)] italic">
            HABILIDOSOS F.C.
          </h1>
          <p className="text-gray-400 mt-3 text-lg">Tecnología aplicada al deporte y la recreación</p>
        </header>

        {/* SECCIÓN DE REGISTRO - ESTILO DASHBOARD */}
        <section className="anim-item grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="p-8 border border-green-500/20 rounded-3xl bg-gray-900/40 backdrop-blur-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
              <span className="bg-green-400/10 p-2 rounded-lg text-sm">⚽</span> 
              Registrar Nuevo Miembro
            </h2>
            <form action={registrarMiembro} className="flex flex-col gap-5">
              <input 
                name="nombre"
                placeholder="Nombre completo del deportista" 
                className="p-3 rounded-xl bg-black border border-gray-800 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                required
              />
              <select 
                name="rol" 
                className="p-3 rounded-xl bg-black border border-gray-800 text-white focus:border-green-500 outline-none transition-all"
                required
              >
                <option value="Jugador">Jugador</option>
                <option value="Entrenador">Entrenador</option>
                <option value="Voluntario">Voluntario</option>
              </select>
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-900/20"
              >
                Guardar en Base de Datos
              </button>
            </form>
          </div>
          
          <div className="space-y-6">
            <PokemonSearch />
            <div className="p-6 border border-gray-800 rounded-3xl bg-gray-900/20">
              <p className="text-sm text-gray-400 italic">"La disciplina supera al talento cuando el talento no se disciplina."</p>
            </div>
          </div>
        </section>

        {/* GRID DE CONTENIDO DINÁMICO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* SCOUTING POKÉMON */}
          <div className="anim-item p-6 border border-gray-800 rounded-3xl bg-gray-900/30 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-green-400">
              <span className="w-2 h-8 bg-green-400 rounded-full inline-block"></span>
              Scouting Pokémon
            </h2>
            <div className="space-y-5">
              {pokemon.map((p) => (
                <div key={p.id} className="p-4 bg-black/40 rounded-2xl border border-gray-800/50 flex items-center gap-4 hover:border-green-500/30 transition-colors">
                  <div className="bg-gray-800/50 rounded-full p-1">
                    <img src={p.sprites.front_default} className="w-14 h-14" alt={p.name} />
                  </div>
                  <div className="flex-1">
                    <p className="uppercase text-xs font-black tracking-widest text-white mb-2">{p.name}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
                          <span>Velocidad</span>
                          <span className="text-green-400">{p.stats[5].base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full">
                          <div 
                            className="bg-green-500 h-full rounded-full stat-bar transition-all" 
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

          {/* ZONA DE JUEGOS */}
          <div className="anim-item p-6 border border-gray-800 rounded-3xl bg-gray-900/30 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-purple-400">
              <span className="w-2 h-8 bg-purple-400 rounded-full inline-block"></span>
              Zona de Juegos
            </h2>
            <div className="grid gap-5">
              {games && games.map((game) => (
                <div key={game.id} className="group relative overflow-hidden rounded-2xl h-36 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <img src={game.background_image} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#030712] via-transparent to-transparent p-5 flex flex-col justify-end">
                    <h3 className="text-sm font-bold group-hover:text-purple-300 transition-colors">{game.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-yellow-400 font-bold">★ {game.rating}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Sports</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RITMO HABILIDOSOS (Spotify) */}
          <div className="anim-item p-6 border border-gray-800 rounded-3xl bg-gray-900/30 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-blue-400">
              <span className="w-2 h-8 bg-blue-400 rounded-full inline-block"></span>
              Ritmo Habilidosos
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-800">
              <iframe 
                style={{ borderRadius: "0px" }} 
                src="https://open.spotify.com/embed/album/1DFv95Z8Vp5869796v8p6G?utm_source=generator&theme=0" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </main>
  );
}