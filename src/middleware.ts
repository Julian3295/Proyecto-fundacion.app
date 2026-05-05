import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId');
  const { pathname } = request.nextUrl;

  // Si no hay sesión y no está en la landing, lo mandamos al inicio
  if (!userId && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Rutas que queremos proteger
export const config = {
  matcher: ['/juegos/:path*', '/ritmo/:path*', '/perfil/:path*'],
};