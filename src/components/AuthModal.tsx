import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firebaseAvailable } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: Props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!firebaseAvailable || !auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        onClose();
        navigate('/map');
      }
    });
    return () => unsub();
  }, [onClose, navigate]);

  const handleAuth = async () => {
    try {
      if (!firebaseAvailable || !auth) {
        // Firebase not configured — fallback to guest flow
        onClose();
        navigate('/map');
        return;
      }

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error('Auth error', err);
      alert('Authentication failed. Check console for details.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent>
        <div className="p-4">
          <DialogTitle>{isSignUp ? 'Create an account' : 'Sign in'}</DialogTitle>

          <div className="mt-4 grid gap-2">
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex items-center justify-between gap-2 mt-2">
              <Button className="bg-gradient-sky" onClick={handleAuth}>{isSignUp ? 'Sign up' : 'Sign in'}</Button>
              <Button variant="ghost" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Have an account? Sign in' : "Don't have an account? Sign up"}</Button>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">Signing up stores your AI assistant queries in your account. No personal data is shared externally.</div>

            <div className="mt-3 text-right">
              <DialogClose asChild>
                <button className="text-sm text-muted-foreground">Close</button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
