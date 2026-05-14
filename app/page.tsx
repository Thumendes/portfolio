// app/page.tsx
import { Suspense } from 'react';
import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { Stack } from '@/components/sections/Stack';
import { HowIWork } from '@/components/sections/HowIWork';
import { Projects } from '@/components/sections/Projects';
import { Timeline } from '@/components/sections/Timeline';
import { Contact, Footer } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stack />
        <HowIWork />
        <Suspense>
          <Projects />
        </Suspense>
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
