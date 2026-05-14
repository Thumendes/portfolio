// components/sections/ProjectModal.tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconBrandGithub,
  IconExternalLink,
} from '@tabler/icons-react';
import { type ProjectData } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';

const MermaidDiagram = dynamic(
  () =>
    import('@/components/effects/MermaidDiagram').then((m) => ({
      default: m.MermaidDiagram,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 rounded-lg bg-secondary animate-pulse" />
    ),
  },
);

interface ProjectModalProps {
  project: ProjectData | null;
  projects: ProjectData[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export function ProjectModal({
  project,
  projects,
  onClose,
  onNavigate,
}: ProjectModalProps) {
  const open = project !== null;
  const currentIndex = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && project && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Content */}
            <Dialog.Content asChild>
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed inset-4 md:inset-8 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-4xl z-50 flex flex-col bg-background border border-border rounded-2xl overflow-hidden max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-border flex-shrink-0">
                  <div className="space-y-2">
                    <Badge label={project.badge.label} color={project.badge.color} />
                    <Dialog.Title className="font-display text-[28px] leading-tight text-foreground">
                      {project.name}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
                    aria-label="Fechar"
                  >
                    <IconX size={18} />
                  </Dialog.Close>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid lg:grid-cols-[1fr_300px] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
                    {/* Left: description */}
                    <div className="p-6 space-y-6">
                      <div className="space-y-3">
                        {project.fullDescription.map((para, i) => (
                          <p
                            key={i}
                            className="text-[14px] font-light font-body text-muted leading-relaxed"
                          >
                            {para}
                          </p>
                        ))}
                      </div>

                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                          Desafios técnicos
                        </h4>
                        <ul className="space-y-2">
                          {project.challenges.map((c, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-[13px] font-light font-body text-muted"
                            >
                              <span className="text-accent flex-shrink-0 mt-px">–</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                          O que aprendi
                        </h4>
                        <ul className="space-y-2">
                          {project.learnings.map((l, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-[13px] font-light font-body text-muted"
                            >
                              <span className="text-accent flex-shrink-0 mt-px">→</span>
                              {l}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: diagram + tags + links */}
                    <div className="p-6 space-y-5">
                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-subtle mb-3">
                          Arquitetura
                        </h4>
                        <MermaidDiagram chart={project.diagram} />
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
                </div>

                {/* Footer nav */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0">
                  <button
                    onClick={() => prevProject && onNavigate(prevProject.id)}
                    disabled={!prevProject}
                    className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <IconChevronLeft size={14} />
                    {prevProject?.name ?? 'Anterior'}
                  </button>
                  <button
                    onClick={() => nextProject && onNavigate(nextProject.id)}
                    disabled={!nextProject}
                    className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {nextProject?.name ?? 'Próximo'}
                    <IconChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
