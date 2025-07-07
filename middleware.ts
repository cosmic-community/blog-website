import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /login)
  const { pathname } = request.nextUrl

  // Check if the user is trying to access the dashboard
  if (pathname.startsWith('/dashboard')) {
    // Check for the session cookie
    const sessionCookie = request.cookies.get('admin-session')
    
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If trying to access login while already authenticated, redirect to dashboard
  if (pathname === '/login') {
    const sessionCookie = request.cookies.get('admin-session')
    
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}