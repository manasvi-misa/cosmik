import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { calculateVedicChart } from '@/lib/vedic-engine';
import { calculateWesternChart } from '@/lib/western-engine';
import { calculateBaziChart } from '@/lib/bazi-engine';
import { getTimezoneOffset } from '@/lib/geocoding';

const MAX_CHARTS = parseInt(process.env.MAX_CHARTS_PER_USER || '10');

const chartSchema = z.object({
  name: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: z.string(),
  timeOfBirth: z.string().optional(),
  unknownTime: z.boolean().default(false),
  country: z.string(),
  state: z.string().optional(),
  city: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  notes: z.string().optional(),
  astrologySystem: z.enum(['VEDIC', 'WESTERN', 'BAZI']),
  vedicSchool: z.string().optional(),
  ayanamsa: z.string().optional(),
  houseSystem: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const system = searchParams.get('system') || '';
    const favorite = searchParams.get('favorite') === 'true';

    const charts = await prisma.birthChart.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { country: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(system && { astrologySystem: system as any }),
        ...(favorite && { isFavorite: true }),
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true, name: true, gender: true, dateOfBirth: true,
        timeOfBirth: true, city: true, country: true, astrologySystem: true,
        isFavorite: true, createdAt: true, updatedAt: true, lastViewedAt: true,
      },
    });

    const total = await prisma.birthChart.count({ where: { userId: session.user.id } });

    return NextResponse.json({ charts, total, remaining: MAX_CHARTS - total, max: MAX_CHARTS });
  } catch (err) {
    console.error('GET charts error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = chartSchema.parse(body);

    // Check chart limit
    const count = await prisma.birthChart.count({ where: { userId: session.user.id } });
    if (count >= MAX_CHARTS) {
      return NextResponse.json(
        { error: `Chart limit reached (${MAX_CHARTS}). Delete a chart to create a new one.` },
        { status: 400 }
      );
    }

    // Calculate chart data
    const dob = new Date(data.dateOfBirth);
    const tzOffset = getTimezoneOffset(data.timezone);
    
    let calculatedData: any = null;
    try {
      if (data.astrologySystem === 'VEDIC') {
        calculatedData = calculateVedicChart(
          dob, data.timeOfBirth || '12:00', data.latitude, data.longitude, tzOffset, data.ayanamsa || 'LAHIRI'
        );
      } else if (data.astrologySystem === 'WESTERN') {
        calculatedData = calculateWesternChart(
          dob, data.timeOfBirth || '12:00', data.latitude, data.longitude, tzOffset, data.houseSystem || 'PLACIDUS'
        );
      } else if (data.astrologySystem === 'BAZI') {
        calculatedData = calculateBaziChart(dob, data.timeOfBirth || '12:00', data.gender);
      }
    } catch (calcErr) {
      console.error('Calculation error:', calcErr);
    }

    const chart = await prisma.birthChart.create({
      data: {
        ...data,
        userId: session.user.id,
        dateOfBirth: dob,
        calculatedData: calculatedData ? JSON.parse(JSON.stringify(calculatedData)) : undefined,
      },
    });

    return NextResponse.json({ chart }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error('POST chart error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
