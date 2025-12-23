import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  AuthCard,
  AuthInput,
  AuthButton,
  AuthLogo,
} from '@/components/auth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword, isLoading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
      toast({
        title: 'Email sent!',
        description: 'Check your inbox for password reset instructions.',
      });
    } catch (error) {
      toast({
        title: 'Request failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center px-4 py-12">
      <AuthCard>
        <div className="space-y-6">
          {/* Logo */}
          <div className="text-center">
            <AuthLogo size="lg" />
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Reset Your Password
                  </h1>
                  <p className="text-muted-foreground">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <AuthInput
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    icon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />

                  <AuthButton
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Sending..."
                    className="mt-6"
                  >
                    Send Reset Instructions
                  </AuthButton>
                </form>

                {/* Back to Login */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                {/* Success State */}
                <div className="mx-auto w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="h-10 w-10 text-success" />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Check Your Email
                  </h2>
                  <p className="text-muted-foreground">
                    We've sent password reset instructions to{' '}
                    <span className="font-medium text-foreground">
                      {getValues('email')}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Try another email
                  </button>
                </div>

                <Link to="/login">
                  <AuthButton variant="outline" className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </AuthButton>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AuthCard>
    </div>
  );
}
