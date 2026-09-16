import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'cookie';

import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const response = await checkSession();

      const setCookieHeaders = response.headers['set-cookie'];

      const nextResponse = isPublicRoute
        ? NextResponse.redirect(new URL('/', request.url))
        : NextResponse.next();

      if (setCookieHeaders) {
        const cookieHeaders = Array.isArray(setCookieHeaders)
          ? setCookieHeaders
          : [setCookieHeaders];

        cookieHeaders.forEach(cookieHeader => {
          const parsedCookie = parseSetCookie(cookieHeader);

          if (!parsedCookie.name || !parsedCookie.value) {
            return;
          }

          const {
            name,
            value,
            expires,
            maxAge,
            domain,
            path,
            secure,
            httpOnly,
            sameSite,
          } = parsedCookie;

          nextResponse.cookies.set(name, value, {
            expires,
            maxAge,
            domain,
            path,
            secure,
            httpOnly,
            sameSite,
          });
        });
      }

      return nextResponse;
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};
