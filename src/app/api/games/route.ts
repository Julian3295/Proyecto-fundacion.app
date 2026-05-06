import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = 'efdb0f78a1634e18b745d50fb3b24293'; // Tu API Key real
  
  try {
    // Buscamos específicamente esos juegos en la base de datos de RAWG
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=fall guys,dirt 5&page_size=2`
    );
    
    const data = await response.json();

    // Mapeamos la respuesta para que el frontend la entienda
    const games = data.results.map((game: any) => ({
      id: game.id,
      title: game.name,
      genre: game.genres[0]?.name.toUpperCase() || "GAME",
      thumbnail: game.background_image, // Esta es la URL que te daba error antes
      game_url: `https://rawg.io/games/${game.slug}`
    }));

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Error consultando RAWG" }, { status: 500 });
  }
}