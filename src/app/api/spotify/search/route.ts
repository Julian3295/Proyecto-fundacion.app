// src/app/api/spotify/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  // Por ahora, devolvemos resultados de ejemplo
  const mockResults = [
    { id: '4cOdK2wGLETKBW3PvgPWqT', name: 'Eye of the Tiger', artist: 'Survivor', album: { images: [{ url: '' }] } },
    { id: '2fzVYV0aM0n9UyX4j2gJkL', name: 'We Will Rock You', artist: 'Queen', album: { images: [{ url: '' }] } },
    { id: '3pLpFJjz3pXqJ5pLpFJjz3p', name: 'Lose Yourself', artist: 'Eminem', album: { images: [{ url: '' }] } },
    { id: '5cOdK2wGLETKBW3PvgPWqT', name: 'Till I Collapse', artist: 'Eminem', album: { images: [{ url: '' }] } },
    { id: '6dOdK2wGLETKBW3PvgPWqT', name: 'Stronger', artist: 'Kanye West', album: { images: [{ url: '' }] } },
  ];

  // Filtrar por la búsqueda
  const filteredResults = mockResults.filter(track => 
    track.name.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json({ tracks: filteredResults });
}