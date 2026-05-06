import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma'; // Importamos tu cliente de Prisma

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    // Si no hay cookie, devolvemos un 401 (No autorizado)
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscamos al usuario en PostgreSQL usando el ID
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        nombre: true,
        email: true,
        pokemonAvatar: true, // Esto es lo que necesita AvatarAnimado
      }
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Error en API /api/user:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}