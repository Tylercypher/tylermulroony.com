import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PageTransition from '@/components/layout/PageTransition';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Cybersecurity tools, web applications, and automation projects by Tyler Mulroony.',
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  const categories = [...new Set(projects.map((p) => p.category))];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-[var(--text-primary)] mb-4">
            <span className="text-[var(--accent)]">&gt;</span> Projects
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            A collection of security tools, web applications, and infrastructure automation projects.
          </p>
        </div>
        <ProjectsClient projects={projects} categories={categories} />
      </div>
    </PageTransition>
  );
}
