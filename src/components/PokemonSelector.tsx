'use client';
import { useState, useEffect } from 'react';

interface Pokemon {
  name: string;
  sprites: { front_default: string };
}

export default function PokemonSelector({ onSelect, selectedPokemon }: { 
  onSelect: (pokemon: string) => void;
  selectedPokemon?: string;
}) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        const detailed = await Promise.all(
          data.results.map(async (p: any) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );
        setPokemonList(detailed);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Elige tu Pokémon Avatar ⚡
      </label>
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded-lg bg-black/50 border border-gray-600 text-white"
      />
      
      {loading ? (
        <div className="text-center py-4">Cargando Pokémon...</div>
      ) : (
        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-black/30 rounded-lg">
          {filteredPokemon.slice(0, 20).map((pokemon) => (
            <button
              key={pokemon.name}
              onClick={() => onSelect(pokemon.name)}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                selectedPokemon === pokemon.name 
                  ? 'bg-green-500/30 border border-green-400' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50'
              }`}
            >
              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-12 h-12 mx-auto" />
              <p className="text-xs text-center capitalize mt-1">{pokemon.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}