"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as authSignIn,
  signUp as authSignUp,
  logout as authSignOut,
  checkAuthState,
} from "@/lib/auth";

// ---------------- TYPES ----------------

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

// ---------------- CONTEXT ----------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------- PROVIDER ----------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // ✅ Check auth on mount
  useEffect(() => {
    try {
      const { isAuthenticated, user } = checkAuthState();
      setState({
        user,
        isAuthenticated,
        isLoading: false,
        error: null,
      });
    } catch {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // ✅ Sync logout across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "auth_token" && !e.newValue) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        router.push("/login");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  // ---------------- ACTIONS ----------------

  const signIn = useCallback(
    async (email: string, password: string) => {
      setState((p) => ({ ...p, isLoading: true, error: null }));
      try {
        const { user } = await authSignIn(email, password);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        router.push("/dashboard");
      } catch (err: any) {
        setState((p) => ({
          ...p,
          isLoading: false,
          error: err?.message || "Sign in failed",
        }));
        throw err;
      }
    },
    [router]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      setState((p) => ({ ...p, isLoading: true, error: null }));
      try {
        const { user } = await authSignUp(email, password);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        router.push("/dashboard");
      } catch (err: any) {
        setState((p) => ({
          ...p,
          isLoading: false,
          error: err?.message || "Sign up failed",
        }));
        throw err;
      }
    },
    [router]
  );

  const signOut = useCallback(() => {
    authSignOut();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    router.push("/login");
  }, [router]);

  const clearError = useCallback(() => {
    setState((p) => ({ ...p, error: null }));
  }, []);

  // ---------------- PROVIDER ----------------

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- HOOKS ----------------

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

// ✅ Protect pages
export function useRequireAuth() {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isReady: !isLoading && isAuthenticated,
  };
}

// ✅ Redirect from login/signup if already logged in
export function useRedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);
}
