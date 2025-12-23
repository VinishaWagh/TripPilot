import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  AuthState, 
  AuthAction, 
  User, 
  LoginCredentials, 
  SignupCredentials,
  mockAuthService 
} from '@/lib/auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await mockAuthService.getCurrentUser();
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await mockAuthService.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await mockAuthService.signup(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      await mockAuthService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await mockAuthService.forgotPassword(email);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await mockAuthService.loginWithGoogle();
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        forgotPassword,
        loginWithGoogle,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
