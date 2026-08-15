import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chart = await prisma.birthChart.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!chart) return NextResponse.json({ error: 'Chart not found' }, { status: 404 });

    // Update last viewed
    await prisma.birthChart.update({
      where: { id },
      data: { lastViewedAt: new Date() },
    });

    return NextResponse.json({ chart });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const chart = await prisma.birthChart.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!chart) return NextResponse.json({ error: 'Chart not found' }, { status: 404 });

    const updated = await prisma.birthChart.update({
      where: { id },
      data: {
        notes: body.notes,
        isFavorite: body.isFavorite,
      },
    });

    return NextResponse.json({ chart: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chart = await prisma.birthChart.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!chart) return NextResponse.json({ error: 'Chart not found' }, { status: 404 });

    await prisma.birthChart.delete({ where: { id } });

    return NextResponse.json({ message: 'Chart deleted' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}