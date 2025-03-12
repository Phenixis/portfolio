import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';

export type ActionState = {
    error?: string;
    success?: string;
    [key: string]: any; // This allows for additional properties
};

const protectedRoutes = ['/my'];
const unaccessibleWhenLoggedIn = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getSession();
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL(`/login?redirectTo=${pathname}`, request.url));
  }

  if (unaccessibleWhenLoggedIn.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/my', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
