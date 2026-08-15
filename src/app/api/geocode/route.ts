import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/lib/geocoding';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (q.length < 2) return NextResponse.json({ results: [] });

  const results = await searchLocations(q);
  return NextResponse.json({ results });
}
