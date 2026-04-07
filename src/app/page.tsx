import { prisma } from '@/lib/prisma';
import Hero from '@/components/home/Hero';
import SkillsGrid from '@/components/home/SkillsGrid';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import PageTransition from '@/components/layout/PageTransition';

export default async function HomePage() {
  const settings = await prisma.siteSettings.findFirst({
    where: { id: 'default' },
  });

  const featuredProjects = await prisma.project.findMany({
    where: { featured: true, published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <PageTransition>
      <Hero tagline={settings?.heroTagline || 'Securing systems. Building solutions. Breaking assumptions.'} />
      <SkillsGrid />
      <FeaturedCarousel projects={featuredProjects} />
    </PageTransition>
  );
}
