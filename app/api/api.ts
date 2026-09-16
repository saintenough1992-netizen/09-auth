import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://notehub-api.goit.study';

export async function proxyRequest(request: NextRequest, path: string) {
  const url = new URL(path, API_URL);
  request.nextUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value));

  const headers = new Headers();
  const cookie = request.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);
  headers.set('content-type', 'application/json');

  const method = request.method;
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.text();
  const response = await fetch(url, { method, headers, body, cache: 'no-store' });
  const responseBody = response.status === 204 ? null : await response.text();
  const nextResponse = new NextResponse(responseBody, { status: response.status });

  const contentType = response.headers.get('content-type');
  if (contentType) nextResponse.headers.set('content-type', contentType);

  const setCookies = response.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    setCookies.forEach(value => nextResponse.headers.append('set-cookie', value));
  } else {
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) nextResponse.headers.set('set-cookie', setCookie);
  }

  return nextResponse;
}
