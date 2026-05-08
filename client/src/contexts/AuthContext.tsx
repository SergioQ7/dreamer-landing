import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple admin credentials (stored in localStorage after login)
// In production, you should validate these on the backend
// Use environment variables for simple credentials instead of hardcoding them
const ADMIN_CREDENTIALS = [
  { 
    email: import.meta.env.VITE_ADMIN_EMAIL || "admin@dreamerwholesale.com", 
    password: import.meta.env.VITE_ADMIN_PASSWORD || "change-me-in-vercel!" 
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check if user is already logged in (on component mount)
  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_email");
    const sessionToken = localStorage.getItem("admin_session");

    if (savedEmail && sessionToken) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 800));

    const validCredential = ADMIN_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (!validCredential) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }

    // Store session
    const sessionToken = Math.random().toString(36).substring(2);
    localStorage.setItem("admin_email", email);
    localStorage.setItem("admin_session", sessionToken);

    setIsAuthenticated(true);
    setUserEmail(email);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_session");
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
