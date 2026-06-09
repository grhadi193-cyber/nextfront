import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/cart', '/checkout', '/profile', '/payment']
const ADMIN_PROTECTED = ['/admin']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('afi_token')?.value
  const { pathname } = request.nextUrl

  // Protected routes — require auth token
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Admin routes — require admin token
  if (ADMIN_PROTECTED.some((p) => pathname.startsWith(p)) && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('afi_admin_token')?.value
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/payment/:path*',
    '/admin/:path*',
  ],
}
