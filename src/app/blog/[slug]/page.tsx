import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { formatDate, calculateReadingTime, parseJsonField } from '@/lib/utils';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PageTransition from '@/components/layout/PageTransition';
import Badge from '@/components/ui/Badge';
import TableOfContents from '@/components/blog/TableOfContents';
import { mdxComponents } from '@/components/blog/MDXComponents';
import ShareButtons from './ShareButtons';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!post) notFound();

  const tags = parseJsonField<string[]>(post.tags, []);
  const readingTime = calculateReadingTime(post.content);
  const date = post.publishedAt || post.createdAt;

  // Related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      slug: { not: post.slug },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <PageTransition>
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] font-mono mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border-color)] mb-8">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)] font-mono mb-4">
          <time>{formatDate(date)}</time>
          <span>&middot;</span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {readingTime} min read
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-primary)] mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Badge key={tag} variant="accent">
              {tag}
            </Badge>
          ))}
        </div>

        <ShareButtons slug={post.slug} title={post.title} />

        {/* Content + ToC */}
        <div className="flex gap-10 mt-8">
          <div className="flex-1 min-w-0">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <TableOfContents content={post.content} />
          </aside>
        </div>

        {/* Mobile ToC */}
        <div className="lg:hidden mt-4">
          <TableOfContents content={post.content} />
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-[var(--border-color)]">
            <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] mb-6">
              <span className="text-[var(--accent)]">{"// "}</span> Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-colors"
                >
                  <p className="text-xs text-[var(--text-muted)] font-mono mb-2">
                    {formatDate(rp.publishedAt || rp.createdAt)}
                  </p>
                  <h3 className="font-semibold font-mono text-[var(--text-primary)]">
                    {rp.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {rp.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageTransition>
  );
}
