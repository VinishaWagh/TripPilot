import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StarBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: string;
}

const StarBorder = ({
  children,
  className,
  color = 'hsl(210, 100%, 50%)',
  speed = '6s',
}: StarBorderProps) => {
  return (
    <div className={cn('relative', className)}>
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          backgroundSize: '200% 100%',
          animation: `shimmer ${speed} linear infinite`,
          opacity: 0.5,
        }}
      />
      <div className="absolute inset-[1px] rounded-xl bg-card" />
      <div className="relative">{children}</div>
    </div>
  );
};

export default StarBorder;
export { StarBorder };
