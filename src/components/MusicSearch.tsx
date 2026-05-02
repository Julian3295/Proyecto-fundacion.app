"use client";
import { useState } from "react";

export default function MusicSearch() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);

  const searchMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Usamos un proxy para evitar errores de CORS en desarrollo
      const res = await fetch(`https://api.deezer.com/search?q=${query}&limit=6`);
      const data = await res.json();
      setTracks(data.data || []);
    } catch (err) {
      console.error("Error buscando música", err);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto p-6 my-10">
      <h2 className="text-2xl font-bold text-pink-500 mb-6 text-center italic">
        Buscador de Ritmo Habilidoso 🎵
      </h2>
      
      <form onSubmit={searchMusic} className="flex gap-2 mb-10 max-w-md mx-auto">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca una canción o álbum..." 
          className="flex-1 p-3 rounded-xl bg-black border border-pink-500/30 text-white focus:border-pink-500 outline-none"
        />
        <button type="submit" className="bg-pink-600 hover:bg-pink-500 px-6 py-3 rounded-xl font-bold transition-all">
          Buscar
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div key={track.id} className="bg-gray-900/50 p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-gray-800 transition-colors group">
            <img 
              src={track.album.cover_medium} 
              alt={track.title} 
              className="w-20 h-20 rounded-lg shadow-lg group-hover:scale-105 transition-transform"
            />
            <div className="overflow-hidden">
              <h3 className="font-bold text-white truncate">{track.title}</h3>
              <p className="text-gray-400 text-sm truncate">{track.artist.name}</p>
              <p className="text-xs text-pink-400 mt-1 uppercase font-semibold">{track.album.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}