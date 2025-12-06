import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários pré-cadastrados com senhas
const PREDEFINED_USERS: Record<string, { name: string; password: string }> = {
  "raphael.vascconcelos": { 
    name: "Raphael Vasconcelos",
    password: "raphael2025"
  },
  "matheus.costa": { 
    name: "Matheus Costa",
    password: "matheus2025"
  },
  "andrea.vasconcelos": { 
    name: "Andrea Vasconcelos",
    password: "andrea2025"
  },
  "marcus.lopes": { 
    name: "Marcus Lopes",
    password: "marcus2025"
  },
};

const STORAGE_KEY = "bncc_manager_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (PREDEFINED_USERS[parsed.username]) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    // Simular um pequeno delay para melhor UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = PREDEFINED_USERS[username];
    // Verificar se o usuário existe e se a senha está correta
    if (user && user.password === password) {
      const userData: User = {
        username,
        name: user.name,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

