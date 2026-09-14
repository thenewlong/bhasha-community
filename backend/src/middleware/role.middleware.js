import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('auth_token')?.value; 
  const userRole = req.cookies.get('user_role')?.value; // 'admin', 'moderator', 'contributor'
  const { pathname } = req.nextUrl;

  // 1. Agar user logged in nahi hai aur protected routes par jaa raha hai
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/moderator'))) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // 2. Moderator route restriction: Moderator admin page access nahi kar sakta
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // 3. Admin access: Admin admin aur moderator dono routes access kar sakta hai
  if (pathname.startsWith('/moderator') && userRole !== 'admin' && userRole !== 'moderator') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/moderator/:path*'],
};