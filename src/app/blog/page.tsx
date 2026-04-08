export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PageTransition from '@/components/layout/PageTransition';
import PostCard from '@/components/blog/PostCard';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Cybersecurity writeups, development tutorials, and technical insights by Tyler Mulroony.',
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
  } catch {
    // DB temporarily unavailable
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-primary)] mb-4">
            <span className="text-[var(--accent)]">&gt;</span> Blog
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Security research, technical writeups, and development insights.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--text-muted)] font-mono py-12">
            No posts published yet. Check back soon.
          </p>
        )}
      </div>
    </PageTransition>
  );
}
