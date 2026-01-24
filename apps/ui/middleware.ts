// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   // 🔑 Disable middleware completely in local dev
//   if (process.env.NODE_ENV !== 'production') {
//     return NextResponse.next();
//   }

//   // Production: do nothing (auth handled in React)
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1️⃣ Ignore Next internals & static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Root → login (avoid blank page)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3️⃣ Allow login page always
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // 4️⃣ Allow everything else
  // Auth + role protection happens in React (AdminAuthGuard)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
