
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore internal Next.js routes, static assets, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const session = await getSession();

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/superadmin/dashboard');
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/confirm-email') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/superadmin/login') ||
    pathname.startsWith('/superadmin/signup');

  // If there's no session and the user is trying to access a protected route, redirect to login.
  if (!session && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    console.log(`[Middleware] No session. Redirecting from protected route ${pathname} to /login.`);
    return NextResponse.redirect(url);
  }

  // If there is a session and the user is trying to access an auth route, redirect to the dashboard.
  if (session && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.startsWith('/superadmin') ? '/superadmin/dashboard' : '/dashboard';
    console.log(`[Middleware] Session found. Redirecting from auth route ${pathname} to ${url.pathname}.`);
    return NextResponse.redirect(url);
  }
  
  if (pathname.startsWith('/superadmin') && session) {
      // In a real app, we'd fetch user roles from the session/DB.
      // For this app, we'll just check the email. A better approach is roles in the JWT.
      const user = await getSession();
      if(user) {
        // This is a placeholder check. In a real app, get the user's role from the session.
        // For now, we assume if you're trying to access superadmin, you should be allowed
        // if you're logged in. The superadmin layout will do the final email check.
      }
  }


  return NextResponse.next();
}

export const config = {
  // Match all paths except for the ones explicitly ignored above
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
