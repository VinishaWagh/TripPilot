import { motion } from 'framer-motion';

export function AuthDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative my-6"
    >
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/50" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-4 text-muted-foreground font-medium tracking-wider">
          Or continue with
        </span>
      </div>
    </motion.div>
  );
}
