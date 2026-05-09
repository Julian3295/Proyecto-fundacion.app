// src/app/components/SpotifySearch.tsx
'use client';
import { useState } from 'react';

export default function SpotifySearch() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const searchSongs = async () => {
    if (!search) return;
    setLoading(true);
    // Simulamos búsqueda
    setTimeout(() => {
      setLoading(false);
      //alert(`Buscando: ${search} - Próximamente conectaremos con Spotify API`);//
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar canción para entrenar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchSongs()}
          className="flex-1 p-3 rounded-xl bg-black/50 border border-gray-600 text-white placeholder-gray-500"
        />
        <button
          onClick={searchSongs}
          className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl font-bold hover:scale-105 transition-all"
        >
          🔍 Buscar
        </button>
      </div>

      {loading && <div className="text-center py-8">Buscando canciones...</div>}

      {/* Reproductor de Spotify por defecto */}
      <div className="rounded-2xl overflow-hidden bg-black/40 p-4">
        <iframe
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          className="rounded-xl"
        ></iframe>
        <p className="text-gray-500 text-xs text-center mt-3">
          🎵 Playlist oficial - Música para entrenar
        </p>
      </div>
    </div>
  );
}