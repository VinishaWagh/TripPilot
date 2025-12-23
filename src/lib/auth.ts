// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';

// Simulated delay to mimic real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (stored in localStorage for persistence)
const USERS_KEY = 'trippilot_users';
const CURRENT_USER_KEY = 'trippilot_current_user';

// Predefined test accounts
const TEST_ACCOUNTS = [
  {
    id: '1',
    email: 'demo@trippilot.com',
    password: 'Demo@123',
    name: 'Demo User',
    createdAt: new Date(),
  },
];

interface StoredUser extends User {
  password: string;
}

const getStoredUsers = (): StoredUser[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    // Initialize with test accounts
    localStorage.setItem(USERS_KEY, JSON.stringify(TEST_ACCOUNTS));
    return TEST_ACCOUNTS;
  }
  return JSON.parse(stored);
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(1000); // Simulate network delay
    
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!user) {
      throw new Error('No account found with this email address');
    }
    
    if (user.password !== credentials.password) {
      throw new Error('Incorrect password. Please try again.');
    }
    
    // Special error test case
    if (credentials.email.toLowerCase() === 'error@test.com') {
      throw new Error('Something went wrong. Please try again later.');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    if (credentials.rememberMe) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    } else {
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    }
    
    return userWithoutPassword;
  },
  
  async signup(credentials: SignupCredentials): Promise<User> {
    await delay(1200); // Simulate network delay
    
    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === credentials.email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    
    // Special error test case
    if (credentials.email.toLowerCase() === 'existing@test.com') {
      throw new Error('Email already in use');
    }
    
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: credentials.email,
      name: credentials.name,
      password: credentials.password,
      createdAt: new Date(),
    };
    
    users.push(newUser);
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },
  
  async forgotPassword(email: string): Promise<void> {
    await delay(800); // Simulate network delay
    
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Always return success for security (don't reveal if email exists)
    // In a real app, this would send an email
    console.log(`Password reset requested for: ${email}`);
    if (user) {
      console.log('User found, would send reset email');
    }
  },
  
  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
  },
  
  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    
    const storedUser = localStorage.getItem(CURRENT_USER_KEY) || sessionStorage.getItem(CURRENT_USER_KEY);
    
    if (!storedUser) {
      return null;
    }
    
    return JSON.parse(storedUser);
  },
  
  async loginWithGoogle(): Promise<User> {
    await delay(1500); // Simulate OAuth flow
    
    // Mock Google user
    const googleUser: User = {
      id: crypto.randomUUID(),
      email: 'google.user@gmail.com',
      name: 'Google User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
      createdAt: new Date(),
    };
    
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(googleUser));
    return googleUser;
  },
};
