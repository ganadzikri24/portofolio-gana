import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all routes under /admin except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const authCookie = request.cookies.get('admin_auth_token');
    
    // If not authenticated, redirect to login
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If authenticated and trying to access login page, redirect to dashboard
  if (path === '/admin/login') {
    const authCookie = request.cookies.get('admin_auth_token');
    if (authCookie && authCookie.value === 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
