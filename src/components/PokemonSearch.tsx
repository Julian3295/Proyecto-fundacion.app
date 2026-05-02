"use client"; // Necesario para usar estados (useState)

import { useState } from "react";

export default function PokemonSearch() {
  const [query, setQuery] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState(false);

  const searchPokemon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (!res.ok) throw new Error();
      const data = await res.ok ? await res.json() : null;
      setPokemon(data);
    } catch (err) {
      setError(true);
      setPokemon(null);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto p-6 bg-gray-900/80 rounded-3xl border border-blue-500/30 backdrop-blur-sm my-10">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">Analizador de Capacidad (API Test)</h2>
      
      <form onSubmit={searchPokemon} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca un Pokémon (ej: pikachu)" 
          className="flex-1 p-3 rounded-xl bg-black border border-gray-700 text-white focus:border-blue-500 outline-none transition-all"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-transform active:scale-95">
          Buscar
        </button>
      </form>

      {error && <p className="text-red-400 text-center">No se encontró ese espécimen. Intenta de nuevo.</p>}

      {pokemon && (
        <div className="bg-linear-to-br from-gray-800 to-black p-6 rounded-2xl border border-blue-400/20 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={pokemon.sprites.other["official-artwork"].front_default} 
              alt={pokemon.name}
              className="w-48 h-48 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-black capitalize text-white mb-2">{pokemon.name}</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {pokemon.types.map((t: any) => (
                  <span key={t.type.name} className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs font-bold uppercase border border-blue-500/30">
                    {t.type.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <p><span className="text-gray-500">Altura:</span> {pokemon.height / 10}m</p>
                <p><span className="text-gray-500">Peso:</span> {pokemon.weight / 10}kg</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}