"use client"; // <--- ¡Muy importante!

import React from 'react';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Home() {
  const container = useRef(null);

  // Estado para guardar los Pokémon
  const [pokemon, setPokemon] = useState<any[]>([]);

  useEffect(() => {
    // Función para traer datos de la API
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=6');
        const data = await response.json();
        
        // Obtenemos los detalles de cada pokemon (para tener la imagen)
        const detailedData = await Promise.all(
          data.results.map(async (p: any) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );
        setPokemon(detailedData);
      } catch (error) {
        console.error("Error trayendo pokémon:", error);
      }
    };

    fetchPokemon();
  }, []);

  useGSAP(() => {
    // Animación de entrada: aparece desde abajo y con opacidad
    gsap.from(".anim-item", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.3, // Esto hace que aparezcan uno tras otro
      ease: "power3.out"
    });
  }, { scope: container });

  return (
    <main ref={container} className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <h1 className="anim-item text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        🚀 Proyecto Fundación Habilidosos
      </h1>
      
      <p className="anim-item mt-4 text-xl text-gray-400">
        Bienvenido, Julian. Vamos a romperla con Next.js 15.
      </p>
      
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="anim-item p-6 border border-gray-700 rounded-xl hover:border-blue-500 transition-colors">
          <h2 className="text-xl font-semibold">🎵 Spotify API</h2>
          <p className="text-sm text-gray-500">Escucha el ritmo del éxito.</p>
        </div>
        
        <div className="anim-item p-6 border border-gray-700 rounded-xl hover:border-purple-500 transition-colors">
          <h2 className="text-xl font-semibold">🎮 Games API</h2>
          <p className="text-sm text-gray-500">Diversión para la comunidad.</p>
        </div>
        
        <div className="anim-item p-6 border border-gray-700 rounded-xl hover:border-pink-500 transition-colors bg-gray-900/50">
          <h2 className="text-xl font-semibold mb-4 text-pink-500 text-center">🐙 Habilidades Pokémon</h2>
          <div className="grid grid-cols-2 gap-2">
            {pokemon.map((p) => (
              <div key={p.id} className="flex flex-col items-center p-2 bg-black/40 rounded-lg border border-gray-800">
                <img 
                  src={p.sprites.front_default} 
                  alt={p.name} 
                  className="w-16 h-16"
                />
                <span className="text-[10px] uppercase font-bold text-gray-300">{p.name}</span>
                <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-pink-500 h-full" 
                    style={{ width: `${p.base_experience > 100 ? 100 : p.base_experience}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {pokemon.length === 0 && <p className="text-center text-gray-500 animate-pulse">Cargando stats...</p>}
        </div>
      </div>
    </main>
  );
}