import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { parseJsonField } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import PageTransition from '@/components/layout/PageTransition';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProjectGallery from '@/components/projects/ProjectGallery';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.shortDesc,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!project) notFound();

  const techStack = parseJsonField<string[]>(project.techStack, []);
  const galleryUrls = parseJsonField<string[]>(project.galleryUrls, []);

  // Get adjacent projects for nav
  const allProjects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true },
  });

  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <PageTransition>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] font-mono mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>

        {/* Hero image */}
        {project.thumbnailUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border-color)] mb-8">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title & meta */}
        <Badge variant="outline" className="mb-3">
          {project.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-primary)] mb-4">
          {project.title}
        </h1>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mb-8">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                <GithubIcon size={16} className="mr-2" />
                Source Code
              </Button>
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                <ExternalLink size={16} className="mr-2" />
                Live Demo
              </Button>
            </a>
          )}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {techStack.map((tech) => (
            <Badge key={tech} variant="accent">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Full description */}
        <div
          className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: project.fullDesc }}
        />

        {/* Gallery */}
        {galleryUrls.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] mb-4">
              <span className="text-[var(--accent)]">{"// "}</span> Screenshots
            </h2>
            <ProjectGallery images={galleryUrls} title={project.title} />
          </section>
        )}

        {/* Nav */}
        <div className="flex justify-between items-center pt-8 border-t border-[var(--border-color)]">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] font-mono transition-colors"
            >
              <ArrowLeft size={14} />
              {prevProject.title}
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] font-mono transition-colors"
            >
              {nextProject.title}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>
    </PageTransition>
  );
}
