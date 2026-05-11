import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const userId = request.cookies.get('userId');
  const { pathname } = request.nextUrl;

  if (!userId && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images/|favicon.ico|api).*)'],
};
