'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProjectFilter from '@/components/projects/ProjectFilter';
import ProjectCard from '@/components/projects/ProjectCard';

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  thumbnailUrl: string | null;
  techStack: string;
  category: string;
}

interface ProjectsClientProps {
  projects: Project[];
  categories: string[];
}

export default function ProjectsClient({ projects, categories }: ProjectsClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <ProjectFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-[var(--text-muted)] font-mono py-12">
          No projects found in this category.
        </p>
      )}
    </>
  );
}
