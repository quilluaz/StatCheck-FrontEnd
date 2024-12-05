import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    if (window.location.pathname === '/') {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Checking auth status...');
      const response = await fetch("/api/auth/verify-token", {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Auth status response:', response.status);
      const data = await response.json();
      console.log('Auth status data:', data);

      if (response.ok && data.valid) {
        console.log('Setting user:', data);
        setUser({
          email: data.email,
          role: data.role,
          id: data.userId
        });
      } else {
        console.log('Clearing user state');
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (credentials) => {
    try {
      console.log('AuthContext: Attempting login...');
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      console.log('AuthContext: Login response status:', response.status);
      const data = await response.json();
      console.log('AuthContext: Login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      setUser({
        email: data.email,
        role: data.role
      });

      return data;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    checkAuthStatus,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8a333b]"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
