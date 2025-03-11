import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';

const protectedRoutes = ['/my'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getSession();
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
