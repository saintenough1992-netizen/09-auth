import type { NextRequest } from 'next/server';
import { proxyRequest } from '../api';
export async function GET(request: NextRequest) { return proxyRequest(request, '/notes'); }
export async function POST(request: NextRequest) { return proxyRequest(request, '/notes'); }
