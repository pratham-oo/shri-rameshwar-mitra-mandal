import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminPath = '/admin';
  const loginPath = '/admin/login';
  const isAdminPage = request.nextUrl.pathname.startsWith(adminPath);
  const isLoginPage = request.nextUrl.pathname === loginPath;

  // Check for admin auth cookie
  const adminAuth = request.cookies.get('admin_auth');

  // If trying to access admin page (not login) without auth
  if (isAdminPage && !isLoginPage && !adminAuth) {
    // Redirect to login page
    const url = new URL('/admin/login', request.url);
    return NextResponse.redirect(url);
  }

  // If already logged in and trying to access login page
  if (isLoginPage && adminAuth) {
    // Redirect to admin dashboard
    const url = new URL('/admin', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};