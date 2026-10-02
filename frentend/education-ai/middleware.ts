import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'eduinsight_access_token';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE);
  console.log('Middleware Cookie Check:', authCookie);
  if (!authCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};