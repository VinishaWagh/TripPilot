import { FadeIn } from '@/components/effects/FadeIn';
import { StarBorder } from '@/components/effects/StarBorder';
import VideoDemo from '@/components/demo/VideoDemo';

export const InteractiveDemo = () => {
  return (
    <section id="demo" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-foreground">See It </span>
              <span className="text-gradient-aurora">In Action</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how TripPilot makes travel planning effortless with real-time tracking and intelligent AI assistance.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="max-w-4xl mx-auto">
            <StarBorder>
              <VideoDemo />
            </StarBorder>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default InteractiveDemo;
