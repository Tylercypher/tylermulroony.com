export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Hero from '@/components/home/Hero';
import SkillsGrid from '@/components/home/SkillsGrid';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import PageTransition from '@/components/layout/PageTransition';

export default async function HomePage() {
  let tagline = 'Securing systems. Building solutions. Breaking assumptions.';
  let featuredProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];

  try {
    const settings = await prisma.siteSettings.findFirst({
      where: { id: 'default' },
    });
    if (settings?.heroTagline) tagline = settings.heroTagline;

    featuredProjects = await prisma.project.findMany({
      where: { featured: true, published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch {
    // DB temporarily unavailable — render with defaults
  }

  return (
    <PageTransition>
      <Hero tagline={tagline} />
      <SkillsGrid />
      <FeaturedCarousel projects={featuredProjects} />
    </PageTransition>
  );
}
