import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ children, isLoading, loadingText, className, disabled, variant, ...props }, ref) => {
    const isPrimary = !variant || variant === 'default';
    
    return (
      <motion.div
        whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className="relative group"
      >
        {/* Glow effect for primary buttons */}
        {isPrimary && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-glow-secondary to-primary rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity" />
        )}
        
        <Button
          ref={ref}
          disabled={disabled || isLoading}
          variant={variant}
          className={cn(
            'relative w-full h-12 text-base font-semibold',
            'transition-all duration-300',
            isPrimary && 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-auth-button',
            variant === 'outline' && 'bg-transparent border-border/50 text-foreground hover:bg-secondary hover:border-border',
            className
          )}
          {...props}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {loadingText || 'Please wait...'}
            </span>
          ) : (
            children
          )}
        </Button>
      </motion.div>
    );
  }
);

AuthButton.displayName = 'AuthButton';
