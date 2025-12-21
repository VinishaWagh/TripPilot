import { FadeIn } from '@/components/effects/FadeIn';
import { CountUp } from '@/components/effects/CountUp';
import { Plane, Globe, MapPin, Clock } from 'lucide-react';

const stats = [
  { icon: Plane, value: 10000, suffix: '+', label: 'Flights Tracked' },
  { icon: Globe, value: 50, suffix: '+', label: 'Countries' },
  { icon: MapPin, value: 500, suffix: '+', label: 'Airports' },
  { icon: Clock, value: 24, suffix: '/7', label: 'Real-Time Updates' },
];

export const Stats = () => (
  <section className="py-20 px-4 bg-muted/20">
    <div className="container mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <FadeIn key={stat.label} delay={index * 100}>
            <div className="text-center">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
