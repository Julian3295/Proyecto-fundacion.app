"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { registrarMiembro } from "./actions"

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
        // Buscamos específicamente juegos de deportes para el tema de la fundación
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
    // 1. Animamos la entrada de TODO lo que tenga la clase anim-item
    // Usamos opacity: 1 al final para asegurar que se vea
    gsap.fromTo(".anim-item", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
    );

    // 2. Animación de las barras (Independiente)
    if (pokemon.length > 0) {
      gsap.to(".stat-bar", {
        width: (index, target) => target.style.width, // Lee el ancho real del estilo
        duration: 1.5,
        delay: 0.5,
        ease: "power4.out",
        stagger: 0.1
      });
    }
  }, { scope: container, dependencies: [pokemon] });

  return (
    <main ref={container} className="flex min-h-screen flex-col items-center p-12 bg-black text-white">
      <header className="anim-item text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent italic">
          HABILIDOSOS F.C.
        </h1>
        <p className="text-gray-400 mt-2">Tecnología aplicada al deporte y la recreación</p>
      </header>

<section className="anim-item mb-12 p-6 border border-green-500/30 rounded-2xl bg-gray-900/50 max-w-md w-full">
  <h2 className="text-xl font-bold mb-4 text-green-400">Registrar Nuevo Miembro</h2>
  <form action={registrarMiembro} className="flex flex-col gap-4">
    <input 
      name="nombre"
      placeholder="Nombre completo" 
      className="p-2 rounded bg-black border border-gray-700 text-white focus:border-green-500 outline-none"
      required
    />
    <select 
      name="rol" 
      className="p-2 rounded bg-black border border-gray-700 text-white focus:border-green-500 outline-none"
      required
    >
      <option value="Jugador">Jugador</option>
      <option value="Entrenador">Entrenador</option>
      <option value="Voluntario">Voluntario</option>
    </select>
    <button 
      type="submit" 
      className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      Guardar en Base de Datos
    </button>
  </form>
</section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        
        {/* SECCIÓN POKÉMON - SCOUTING */}
        <div className="anim-item p-6 border border-gray-800 rounded-2xl bg-gray-900/30">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-400">
            ⚽ Scouting Pokémon
          </h2>
          <div className="space-y-4">
            {pokemon.map((p) => (
              <div key={p.id} className="p-3 bg-black/50 rounded-xl border border-gray-800 flex items-center gap-4">
                <img src={p.sprites.front_default} className="w-16 h-16" alt={p.name} />
                <div className="flex-1">
                  <p className="uppercase text-xs font-bold text-white mb-1">{p.name}</p>
                  
                  {/* Barra de Velocidad */}
                  <div className="mt-1">
                    <p className="text-[10px] text-gray-400 flex justify-between">
                      <span>Velocidad (Speed)</span>
                      <span>{p.stats[5].base_stat}</span>
                    </p>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full stat-bar w-0" // Agrega w-0 aquí
                        style={{ width: `${p.stats[5].base_stat}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Barra de Potencia */}
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-400 flex justify-between">
                      <span>Potencia (Attack)</span>
                      <span>{p.stats[1].base_stat}</span>
                    </p>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full stat-bar" 
                        style={{ width: `${p.stats[1].base_stat}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN JUEGOS - ENTRETENIMIENTO */}
        <div className="anim-item p-6 border border-gray-800 rounded-2xl bg-gray-900/30">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-400">
            🎮 Zona de Juegos
          </h2>
          <div className="grid gap-4">
            {games && games.map((game) => (
              <div key={game.id} className="group relative overflow-hidden rounded-xl h-32 border border-gray-700">
                <img src={game.background_image} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-sm font-bold">{game.name}</h3>
                  <span className="text-xs text-yellow-400">★ {game.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN SPOTIFY - REPRODUCTOR REAL */}
        <div className="anim-item p-6 border border-gray-800 rounded-2xl bg-gray-900/30">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
            🎵 Ritmo Habilidosos
          </h2>
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-blue-500/20">
            <iframe 
              style={{ borderRadius: "12px" }} 
              src="https://open.spotify.com/embed/album/1DFv95Z8Vp5869796v8p6G?utm_source=generator&theme=0" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 text-center">
            Música motivacional para el entrenamiento diario.
          </p>
        </div>

      </div>
    </main>
  );
}