// components/sections/ProjectCard.tsx
import Link from 'next/link';
import { type ProjectData } from '@/lib/data';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectData;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  if (project.featured) {
    return (
      <Link
        href={`/projetos/${project.id}`}
        className={cn(
          'text-left w-full p-5 rounded-xl border border-border bg-background hover:bg-secondary transition-colors block',
          'lg:col-span-2 grid lg:grid-cols-2 gap-6',
          className,
        )}
      >
        {/* Left column */}
        <div className="flex flex-col gap-3">
          <CategoryBadge label={project.badge.label} color={project.badge.color} />
          <h3 className="text-[16px] font-medium font-body text-foreground">
            {project.name}
          </h3>
          <p className="text-[13px] font-light font-body text-muted leading-relaxed flex-1">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        {/* Right column — highlights */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-1">
            Destaques
          </p>
          {project.highlights.map((h, i) => (
            <div key={i} className="flex gap-2 text-[13px] font-light font-body text-muted">
              <span className="text-accent mt-px flex-shrink-0">–</span>
              <span>{h}</span>
            </div>
          ))}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/projetos/${project.id}`}
      className={cn(
        'text-left w-full p-5 rounded-xl border border-border bg-background hover:bg-secondary transition-colors flex flex-col gap-3',
        className,
      )}
    >
      <CategoryBadge label={project.badge.label} color={project.badge.color} />
      <h3 className="text-[16px] font-medium font-body text-foreground">
        {project.name}
      </h3>
      <p className="text-[13px] font-light font-body text-muted leading-relaxed flex-1">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </Link>
  );
}
