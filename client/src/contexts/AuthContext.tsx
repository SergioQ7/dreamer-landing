import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.client.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || null);
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.client.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || null);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }

    setIsAuthenticated(true);
    setUserEmail(data.user.email || null);
    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.client.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        userEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
