import type { NextRequest } from 'next/server';
import { proxyRequest } from '../../api';
interface Context { params: Promise<{ id: string }>; }
export async function GET(request: NextRequest, { params }: Context) { const { id } = await params; return proxyRequest(request, `/notes/${id}`); }
export async function DELETE(request: NextRequest, { params }: Context) { const { id } = await params; return proxyRequest(request, `/notes/${id}`); }
