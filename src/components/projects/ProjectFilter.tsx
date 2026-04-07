'use client';

import Badge from '@/components/ui/Badge';

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProjectFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-10">
      <Badge
        variant="outline"
        active={activeCategory === 'All'}
        onClick={() => onCategoryChange('All')}
        className="px-4 py-1.5 text-sm"
      >
        All
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant="outline"
          active={activeCategory === category}
          onClick={() => onCategoryChange(category)}
          className="px-4 py-1.5 text-sm"
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
