import { FadeIn } from '@/components/effects/FadeIn';
import { Search, MapPin, Compass, MessageSquare } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search Your Flight',
    description: 'Enter your flight number or route to start tracking in real-time.',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'View Real-Time Tracking',
    description: 'Watch your aircraft move across the interactive map with live updates.',
  },
  {
    number: '03',
    icon: Compass,
    title: 'Explore & Discover',
    description: 'Find nearby amenities, restaurants, and services at any airport.',
  },
  {
    number: '04',
    icon: MessageSquare,
    title: 'Ask AI Anything',
    description: 'Get personalized travel tips and answers from our intelligent assistant.',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-tertiary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-foreground">How It </span>
              <span className="text-gradient-aurora">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our intuitive four-step process.
            </p>
          </div>
        </FadeIn>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 150}>
                <div className="relative flex flex-col items-center text-center group">
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
