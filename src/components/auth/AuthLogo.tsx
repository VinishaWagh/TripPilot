import { Plane } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const textSizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export function AuthLogo({ size = 'md' }: AuthLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-3"
    >
      <div className="relative">
        {/* Glow behind logo */}
        <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full" />
        
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className={`relative ${sizeClasses[size]} rounded-xl bg-gradient-to-br from-primary to-glow-secondary flex items-center justify-center shadow-glow`}
        >
          <Plane className={`${iconSizes[size]} text-primary-foreground`} />
        </motion.div>
      </div>
      <span className={`${textSizes[size]} font-bold text-foreground`}>
        Trip<span className="text-primary">Pilot</span>
      </span>
    </motion.div>
  );
}
