'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconDownload, IconMenu2, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const links = [
  { label: 'sobre', href: '#sobre' },
  { label: 'projetos', href: '#projetos' },
  { label: 'experiência', href: '#experiencia' },
  { label: 'contato', href: '#contato' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 768) setDrawerOpen(false); };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-border'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#sobre" className="font-mono text-sm font-medium">
            <span className="text-accent">//</span>
            <span className="text-muted"> thumendes</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-body text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/curriculo.pdf"
              download
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-foreground transition-colors"
            >
              <IconDownload size={14} />
              currículo
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-muted hover:text-foreground transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
          >
            <IconMenu2 size={20} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 z-50 w-64 bg-background border-l border-border flex flex-col p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-sm">
                  <span className="text-accent">//</span>
                  <span className="text-muted"> thumendes</span>
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-muted hover:text-foreground"
                  aria-label="Fechar menu"
                >
                  <IconX size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="text-[15px] text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="/curriculo.pdf"
                  download
                  className="inline-flex items-center gap-2 text-[15px] text-muted hover:text-foreground mt-2"
                >
                  <IconDownload size={15} />
                  currículo
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
