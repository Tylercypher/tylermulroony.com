export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title, slug: customSlug, shortDesc, fullDesc, category, techStack,
      thumbnailUrl, galleryUrls, githubUrl, demoUrl, featured, published,
    } = body;

    if (!title?.trim() || !shortDesc?.trim() || !fullDesc?.trim() || !category?.trim()) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const slug = customSlug?.trim() || slugify(title);

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        slug,
        shortDesc: shortDesc.trim(),
        fullDesc: fullDesc.trim(),
        category: category.trim(),
        techStack: JSON.stringify(techStack || []),
        thumbnailUrl: thumbnailUrl || null,
        galleryUrls: JSON.stringify(galleryUrls || []),
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        featured: featured || false,
        published: published ?? true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    if (data.techStack && Array.isArray(data.techStack)) {
      data.techStack = JSON.stringify(data.techStack);
    }
    if (data.galleryUrls && Array.isArray(data.galleryUrls)) {
      data.galleryUrls = JSON.stringify(data.galleryUrls);
    }

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
