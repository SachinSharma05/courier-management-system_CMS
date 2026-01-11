import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files & auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login')
  ) {
    return NextResponse.next();
  }

  // Read token (cookie or localStorage is NOT available here)
  const token = req.cookies.get('access_token')?.value;

  // 🔒 Not logged in
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    const role = payload.role;

    // 🔁 Root redirect
    if (pathname === '/') {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }

      if (role === 'client') {
        return NextResponse.redirect(new URL('/client/dashboard', req.url));
      }

      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
