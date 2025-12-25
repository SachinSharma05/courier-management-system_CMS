import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get('access_token')?.value ||
    req.headers.get('authorization');

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};