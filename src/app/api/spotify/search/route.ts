import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  images: SpotifyImage[];
  name: string;
}

interface SpotifyTrackItem {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
  external_urls: { spotify: string };
}

interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrackItem[];
  };
}

let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string | null> {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    logger.warn('Spotify credentials not configured', 'spotify');
    return null;
  }

  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      logger.error(`Failed to get Spotify token: ${res.status}`, 'spotify');
      return null;
    }

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000;

    logger.info('Spotify token acquired', 'spotify');
    return accessToken;
  } catch (err) {
    logger.error('Error getting Spotify token', 'spotify', err);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  const token = await getAccessToken();

  if (!token) {
    return NextResponse.json(
      { error: 'Spotify API no configurada. Agregá SPOTIFY_CLIENT_ID y SPOTIFY_CLIENT_SECRET en .env.local' },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      logger.error(`Spotify API error: ${res.status}`, 'spotify');
      return NextResponse.json({ error: 'Error al buscar en Spotify' }, { status: res.status });
    }

    const data = await res.json();

    const dataJson = data as SpotifySearchResponse;
    const tracks = (dataJson.tracks?.items || []).map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: {
        images: track.album.images || [],
        name: track.album.name,
      },
      previewUrl: track.preview_url,
      externalUrl: track.external_urls?.spotify,
    }));

    logger.info(`Spotify search: "${query}" -> ${tracks.length} results`, 'spotify');

    return NextResponse.json({ tracks });
  } catch (err) {
    logger.error('Error searching Spotify', 'spotify', err);
    return NextResponse.json({ error: 'Error de conexión con Spotify' }, { status: 500 });
  }
}
