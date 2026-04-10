import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email?: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (token: string, email?: string, full_name?: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("user_email");
    const full_name = localStorage.getItem("user_full_name");

    if (token) {
      setUser({
        email: email || "User",
        full_name: full_name || "",
      });
    }
  }, []);

  const signIn = (token: string, email?: string, full_name?: string) => {
    localStorage.setItem("token", token);

    if (email) localStorage.setItem("user_email", email);
    if (full_name) localStorage.setItem("user_full_name", full_name);

    setUser({
      email: email || "User",
      full_name: full_name || "",
    });
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_full_name");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};