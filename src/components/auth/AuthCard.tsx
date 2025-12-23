import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-md ${className}`}
    >
      {/* Glow effect behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-glow-secondary/10 to-primary/20 rounded-2xl blur-xl opacity-50" />
      
      {/* Main card */}
      <div className="relative glass-card rounded-2xl p-8">
        {children}
      </div>
    </motion.div>
  );
}
