'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import { parseJsonField } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    shortDesc: string;
    thumbnailUrl: string | null;
    techStack: string;
    category: string;
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const techStack = parseJsonField<string[]>(project.techStack, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden card-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
          <div className="relative h-44 bg-[var(--bg-tertiary)]">
            {project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--text-muted)] font-mono text-2xl">
                &lt;/&gt;
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <Badge variant="outline" className="self-start mb-2">
              {project.category}
            </Badge>
            <h3 className="text-lg font-semibold font-mono text-[var(--text-primary)] mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3 flex-1">
              {project.shortDesc}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {techStack.slice(0, 5).map((tech) => (
                <Badge key={tech} variant="default">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
