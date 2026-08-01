// app/page.tsx
import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { Chat } from '@/components/sections/Chat';
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
        <Chat />
        <HowIWork />
        <Projects />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
