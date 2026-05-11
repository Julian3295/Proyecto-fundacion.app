'use client';
import { useState, useEffect } from 'react';
import { Zap, Flame, Leaf, Droplet, Weight, Ruler, Star } from 'lucide-react';

interface Pokemon {
  name: string;
  sprites: { front_default: string };
}

interface PokemonDetails {
  stats: { name: string; value: number }[];
  types: { name: string }[];
  height: number;
  weight: number;
  abilities: string[];
}

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

export default function PokemonSelector({ onSelect, selectedPokemon }: { 
  onSelect: (pokemon: string) => void;
  selectedPokemon?: string;
}) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=649');
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

  useEffect(() => {
    if (!selectedPokemon) { setDetails(null); return; }
    const fetchDetails = async () => {
      setDetailsLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon.toLowerCase()}`);
        const data = await res.json();
        setDetails({
          stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
          types: data.types.map((t: any) => ({ name: t.type.name })),
          height: data.height,
          weight: data.weight,
          abilities: data.abilities.map((a: any) => a.ability.name),
        });
      } catch { setDetails(null); } finally { setDetailsLoading(false); }
    };
    fetchDetails();
  }, [selectedPokemon]);

  const filteredPokemon = pokemonList.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        <>Elige tu Pokémon Avatar <Zap className="w-4 h-4 inline-block" /></>
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

      {selectedPokemon && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mt-3">
          {detailsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : details ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <img src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${selectedPokemon.toLowerCase()}.gif`} alt={selectedPokemon} className="w-12 h-12" />
                <span className="text-lg font-bold capitalize text-emerald-400">{selectedPokemon}</span>
              </div>
              <div className="flex gap-2 justify-center">
                {details.types.map((t) => {
                  const Icon = TYPE_ICONS[t.name];
                  return (
                    <span key={t.name} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/5 ${TYPE_COLORS[t.name] || "text-gray-300"}`}>
                      {Icon && <Icon className="w-3 h-3" />}
                      {t.name}
                    </span>
                  );
                })}
              </div>
              <div className="space-y-1">
                {details.stats.slice(0, 3).map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-gray-400 w-12 text-right">{statLabel(s.name)}</span>
                    <span className="text-[10px] font-black w-5 text-right text-white">{s.value}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${statColor(s.value)}`} style={{ width: `${Math.min((s.value / 255) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
                {details.stats.length > 3 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-gray-400 w-12 text-right">+{details.stats.length - 3} más</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-white/5 rounded-lg p-2">
                  <Ruler className="w-3 h-3 mx-auto mb-0.5 text-gray-400" />
                  <span className="text-gray-300 font-bold">{(details.height / 10).toFixed(1)} m</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <Weight className="w-3 h-3 mx-auto mb-0.5 text-gray-400" />
                  <span className="text-gray-300 font-bold">{(details.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <Star className="w-3 h-3 mx-auto mb-0.5 text-gray-400" />
                  <span className="text-gray-300 font-bold capitalize">{details.abilities[0]}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}