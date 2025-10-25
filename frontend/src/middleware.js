import { NextResponse } from 'next/server';

// Define which routes need authentication
const protectedRoutes = ['/cart', '/checkout', '/orders', '/profile'];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('accessToken')?.value;

  // 🟩 Allow all static/public assets & Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // 🟩 Skip auth for public pages
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/products');

  // 🟥 If route is protected & no token → redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname); // optional redirect back
    return NextResponse.redirect(loginUrl);
  }

  // 🟩 If logged in and visiting /login or /signup → redirect to home
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match all routes except static files and API routes.
      This keeps performance high.
    */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
