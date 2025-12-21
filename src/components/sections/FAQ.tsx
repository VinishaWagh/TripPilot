import { FadeIn } from '@/components/effects/FadeIn';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'How accurate is the flight tracking?', a: 'We use real-time data from multiple aviation sources to provide updates every few seconds with high accuracy.' },
  { q: 'Which airports are supported?', a: 'TripPilot covers 500+ major airports worldwide across 50+ countries.' },
  { q: 'How does the AI assistant work?', a: 'Our AI is powered by Google Gemini, trained to help with travel questions, recommendations, and flight information.' },
  { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption and never share your personal information with third parties.' },
];

export const FAQ = () => (
  <section id="faq" className="py-24 px-4">
    <div className="container mx-auto max-w-3xl">
      <FadeIn>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
          <span className="text-gradient-primary">Frequently Asked</span> Questions
        </h2>
      </FadeIn>
      <FadeIn delay={100}>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="glass rounded-lg px-6 border-border/50">
              <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeIn>
    </div>
  </section>
);

export default FAQ;
