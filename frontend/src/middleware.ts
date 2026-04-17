import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = ['/admin', '/student', '/profile', '/settings', '/exam', '/results'];

  // Check if current path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    // Use a simple landing logic or fetch role if we had a role cookie
    url.pathname = '/'; 
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/exam/:path*',
    '/results/:path*',
    '/login',
    '/register'
  ],
};
