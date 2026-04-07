import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit, sanitizeInput } from '@/lib/utils';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(messages);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const msg = await prisma.contactMessage.update({ where: { id }, data });
  return NextResponse.json(msg);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, subject, message, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    const validSubjects = [
      'General Inquiry',
      'Project Collaboration',
      'Job Opportunity',
      'Security Consultation',
      'Other',
    ];

    if (!validSubjects.includes(subject)) {
      return NextResponse.json(
        { error: 'Invalid subject' },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: {
        name: sanitizeInput(name.trim()),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: sanitizeInput(message.trim()),
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
