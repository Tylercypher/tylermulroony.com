import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import { formatDate, calculateReadingTime, parseJsonField } from '@/lib/utils';

interface PostCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    coverImageUrl: string | null;
    tags: string;
    content: string;
    publishedAt: Date | null;
    createdAt: Date;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const tags = parseJsonField<string[]>(post.tags, []);
  const readingTime = calculateReadingTime(post.content);
  const date = post.publishedAt || post.createdAt;

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden card-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {post.coverImageUrl && (
          <div className="relative h-44 bg-[var(--bg-tertiary)]">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono mb-3">
            <time>{formatDate(date)}</time>
            <span>&middot;</span>
            <span>{readingTime} min read</span>
          </div>
          <h2 className="text-lg font-semibold font-mono text-[var(--text-primary)] mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
