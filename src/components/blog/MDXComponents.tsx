import type { MDXComponents as MDXComponentsType } from 'mdx/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export const mdxComponents: MDXComponentsType = {
  h1: ({ children, ...props }) => (
    <h1
      id={typeof children === 'string' ? slugify(children) : undefined}
      className="text-3xl font-bold font-mono text-[var(--text-primary)] mt-10 mb-4"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      id={typeof children === 'string' ? slugify(children) : undefined}
      className="text-2xl font-bold font-mono text-[var(--text-primary)] mt-8 mb-3"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      id={typeof children === 'string' ? slugify(children) : undefined}
      className="text-xl font-semibold font-mono text-[var(--text-primary)] mt-6 mb-2"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-[var(--text-secondary)] leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }) => (
    <a
      className="text-[var(--accent)] hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside text-[var(--text-secondary)] mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside text-[var(--text-secondary)] mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-[var(--accent)] pl-4 py-2 my-4 italic text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => {
    return (
      <code className="text-sm" {...props}>
        {children}
      </code>
    );
  },
  hr: () => <hr className="border-[var(--border-color)] my-8" />,
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className="rounded-lg border border-[var(--border-color)] my-4 max-w-full" {...props} />
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-[var(--border-color)]" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-2 text-left font-mono text-sm text-[var(--text-primary)] bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-4 py-2 text-sm text-[var(--text-secondary)] border-b border-[var(--border-color)]"
      {...props}
    >
      {children}
    </td>
  ),
};
