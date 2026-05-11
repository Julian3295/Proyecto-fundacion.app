'use client';
import { useState } from 'react';
import { Search, Music, Play, ExternalLink, Volume2 } from 'lucide-react';

interface TrackResult {
  id: string;
  name: string;
  artist: string;
  album: { images: { url: string }[]; name: string };
  previewUrl: string | null;
  externalUrl: string | null;
}

export default function SpotifySearch() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrackResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const searchSongs = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(search.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al buscar canciones');
        return;
      }

      setResults(data.tracks || []);
      if (data.tracks?.length === 0) {
        setError('No se encontraron canciones. Probá con otro término.');
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const playPreview = (trackId: string, url: string | null) => {
    if (playing === trackId) {
      setPlaying(null);
      return;
    }
    if (!url) return;
    setPlaying(trackId);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscá cualquier canción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchSongs()}
          className="flex-1 p-3 rounded-xl bg-black/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={searchSongs}
          disabled={loading}
          className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-4 h-4" /> Buscar
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          <span className="text-gray-400">Buscando en Spotify...</span>
        </div>
      )}

      {error && !loading && searched && results.length === 0 && (
        <div className="text-center py-8 text-gray-500">{error}</div>
      )}

      {results.length > 0 && !loading && (
        <div className="space-y-2">
          {results.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-3 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors group"
            >
              {track.album?.images?.[0]?.url && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{track.name}</p>
                <p className="text-gray-400 text-xs truncate">{track.artist}</p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {track.previewUrl && (
                  <button
                    onClick={() => playPreview(track.id, track.previewUrl)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Escuchar preview"
                  >
                    {playing === track.id ? (
                      <Volume2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                )}

                {track.externalUrl && (
                  <a
                    href={track.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Abrir en Spotify"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {playing && (
        <audio
          key={playing}
          src={results.find((t) => t.id === playing)?.previewUrl || ''}
          autoPlay
          onEnded={() => setPlaying(null)}
          className="hidden"
        />
      )}

      <div className="rounded-2xl overflow-hidden bg-black/40 p-4">
        <iframe
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen"
          className="rounded-xl"
        />
        <p className="text-gray-500 text-xs text-center mt-3">
          <Music className="w-4 h-4 inline-block" /> Playlist oficial - Música para entrenar
        </p>
      </div>
    </div>
  );
}
