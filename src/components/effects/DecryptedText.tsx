import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  characters?: string;
  delay?: number;
  animateOnView?: boolean;
}

const DecryptedText = ({
  text,
  className,
  speed = 50,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
  delay = 0,
  animateOnView = true,
}: DecryptedTextProps) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ' ').join(''));
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animateOnView) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => startAnimation(), delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [animateOnView, delay, hasAnimated]);

  const startAnimation = () => {
    if (isAnimating || hasAnimated) return;
    setIsAnimating(true);
    setHasAnimated(true);

    let currentIndex = 0;
    const textArray = text.split('');
    const result = [...displayText.split('')];

    const interval = setInterval(() => {
      // Scramble upcoming characters
      for (let i = currentIndex; i < textArray.length; i++) {
        if (textArray[i] !== ' ') {
          result[i] = characters[Math.floor(Math.random() * characters.length)];
        } else {
          result[i] = ' ';
        }
      }

      // Reveal current character
      if (currentIndex < textArray.length) {
        result[currentIndex] = textArray[currentIndex];
        currentIndex++;
      }

      setDisplayText(result.join(''));

      if (currentIndex >= textArray.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, speed);

    return () => clearInterval(interval);
  };

  return (
    <span
      ref={elementRef}
      className={cn('font-mono tracking-wider', className)}
      aria-label={text}
    >
      {displayText.split('').map((char, index) => (
        <span
          key={index}
          className={cn(
            'inline-block transition-all duration-100',
            char !== text[index] && isAnimating && 'text-primary/60'
          )}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default DecryptedText;
export { DecryptedText };