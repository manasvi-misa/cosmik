import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (dbUser?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [totalUsers, totalCharts, systemBreakdown, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.birthChart.count(),
      prisma.birthChart.groupBy({ by: ['astrologySystem'], _count: true }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, name: true, email: true, createdAt: true, role: true } }),
    ]);

    return NextResponse.json({ totalUsers, totalCharts, systemBreakdown, recentUsers });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
