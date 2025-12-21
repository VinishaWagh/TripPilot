import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import InteractiveDemo from '@/components/sections/InteractiveDemo';
import Stats from '@/components/sections/Stats';
import FAQ from '@/components/sections/FAQ';
import Newsletter, { Footer } from '@/components/sections/Newsletter';

const Landing = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <InteractiveDemo />
      <Stats />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Landing;
