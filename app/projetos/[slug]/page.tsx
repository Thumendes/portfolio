// app/projetos/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconBrandGithub,
  IconExternalLink,
} from '@tabler/icons-react';
import { projects } from '@/lib/data';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { Tag } from '@/components/ui/Tag';
import { ProjectDiagram } from '@/components/sections/ProjectDiagram';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return {};

  return {
    title: `${project.name} — Arthur Mendes`,
    description: project.description,
    openGraph: {
      title: `${project.name} — Arthur Mendes`,
      description: project.description,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const currentIndex = projects.findIndex((p) => p.id === slug);
  const project = projects[currentIndex];
  if (!project) notFound();

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/#projetos"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors mb-8"
      >
        <IconArrowLeft size={14} />
        Todos os projetos
      </Link>

      {/* Header */}
      <div className="space-y-3 mb-10">
        <CategoryBadge label={project.badge.label} color={project.badge.color} />
        <h1 className="font-display text-[32px] md:text-[40px] leading-tight text-foreground">
          {project.name}
        </h1>
        <p className="text-[15px] font-light font-body text-muted max-w-2xl">
          {project.description}
        </p>
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-12">
        {/* Left: description */}
        <div className="space-y-8">
          <div className="space-y-3">
            {project.fullDescription.map((para, i) => (
              <p key={i} className="text-[14px] font-light font-body text-muted leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {project.challenges.length > 0 && (
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                Desafios técnicos
              </h4>
              <ul className="space-y-2">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex gap-2 text-[13px] font-light font-body text-muted">
                    <span className="text-accent flex-shrink-0 mt-px">–</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.learnings.length > 0 && (
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                O que aprendi
              </h4>
              <ul className="space-y-2">
                {project.learnings.map((l, i) => (
                  <li key={i} className="flex gap-2 text-[13px] font-light font-body text-muted">
                    <span className="text-accent flex-shrink-0 mt-px">→</span>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: diagram + tags + links */}
        <div className="space-y-6">
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
              Arquitetura
            </h4>
            <ProjectDiagram chart={project.diagram} />
          </div>

          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
              Tecnologias
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          {(project.links.github || project.links.demo) && (
            <div className="flex gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors"
                >
                  <IconBrandGithub size={14} /> GitHub
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors"
                >
                  <IconExternalLink size={14} /> Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prev/next nav */}
      <div className="flex items-center justify-between mt-16 pt-6 border-t border-border">
        {prevProject ? (
          <Link
            href={`/projetos/${prevProject.id}`}
            className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors"
          >
            <IconChevronLeft size={14} />
            {prevProject.name}
          </Link>
        ) : (
          <span />
        )}
        {nextProject ? (
          <Link
            href={`/projetos/${nextProject.id}`}
            className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors"
          >
            {nextProject.name}
            <IconChevronRight size={14} />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
