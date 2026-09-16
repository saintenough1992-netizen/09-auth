import type { NextRequest } from 'next/server';
import { proxyRequest } from '../../api';
export async function GET(request: NextRequest) { return proxyRequest(request, '/users/me'); }
export async function PATCH(request: NextRequest) { return proxyRequest(request, '/users/me'); }
