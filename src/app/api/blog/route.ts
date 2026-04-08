export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug: customSlug, content, excerpt, coverImageUrl, tags, published } = body;

    if (!title?.trim() || !content?.trim() || !excerpt?.trim()) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const slug = customSlug?.trim() || slugify(title);

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt.trim(),
        coverImageUrl: coverImageUrl || null,
        tags: JSON.stringify(tags || []),
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
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
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    if (data.tags && Array.isArray(data.tags)) {
      data.tags = JSON.stringify(data.tags);
    }

    // Set publishedAt when publishing for the first time
    if (data.published) {
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (existing && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    return NextResponse.json(post);
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
    return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  }

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
