'use client';

import { motion } from 'framer-motion';
import { useQueryState } from 'nuqs';
import { projects } from '@/lib/data';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

export function Projects() {
  const [projectId, setProjectId] = useQueryState('project', {
    history: 'push',
    scroll: false,
  });

  const selectedProject = projects.find((p) => p.id === projectId) ?? null;

  return (
    <>
      <section id="projetos" className="max-w-5xl mx-auto px-6 py-16">
        <SectionLabel>Projetos</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className={project.featured ? 'lg:col-span-2' : ''}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
            >
              <ProjectCard
                project={project}
                onClick={() => setProjectId(project.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        projects={projects}
        onClose={() => setProjectId(null)}
        onNavigate={(id) => setProjectId(id)}
      />
    </>
  );
}
