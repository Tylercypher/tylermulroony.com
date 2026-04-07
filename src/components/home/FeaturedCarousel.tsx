'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/Badge';
import { parseJsonField } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  thumbnailUrl: string | null;
  techStack: string;
  category: string;
}

interface FeaturedCarouselProps {
  projects: Project[];
}

export default function FeaturedCarousel({ projects }: FeaturedCarouselProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  if (projects.length === 0) return null;

  return (
    <section id="featured-projects" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold font-mono text-[var(--text-primary)] mb-4">
          <span className="text-[var(--accent)]">//</span> Featured Projects
        </h2>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Highlighted work spanning cybersecurity tools, web applications, and infrastructure automation.
        </p>
      </motion.div>

      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {projects.map((project, index) => {
          const techStack = parseJsonField<string[]>(project.techStack, []);
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="flex-shrink-0 w-[340px] sm:w-[400px] snap-start"
            >
              <Link href={`/projects/${project.slug}`}>
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden card-hover transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="relative h-48 bg-[var(--bg-tertiary)]">
                    {project.thumbnailUrl ? (
                      <Image
                        src={project.thumbnailUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[var(--text-muted)] font-mono text-sm">
                        &lt;/&gt;
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <Badge variant="outline" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="text-lg font-semibold font-mono text-[var(--text-primary)] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                      {project.shortDesc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.slice(0, 4).map((tech) => (
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
        })}
      </div>
    </section>
  );
}
