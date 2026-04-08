export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.siteSettings.findFirst({
    where: { id: 'default' },
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: body,
      create: { id: 'default', ...body },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
