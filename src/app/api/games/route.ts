import { NextResponse } from 'next/server';

const GAME_QUERIES = ["fall guys", "dirt 5", "rocket league"];

export async function GET() {
  const API_KEY = process.env.RAWG_API_KEY;

  try {
    const results = await Promise.all(
      GAME_QUERIES.map(async (query) => {
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=1`
        );
        const data = await res.json();
        return data.results?.[0] || null;
      })
    );

    const games = results.filter(Boolean).map((game: any) => ({
      id: game.id,
      title: game.name,
      genre: game.genres?.[0]?.name?.toUpperCase() || "GAME",
      thumbnail: game.background_image,
      game_url: `https://rawg.io/games/${game.slug}`,
    }));

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Error consultando RAWG" }, { status: 500 });
  }
}
