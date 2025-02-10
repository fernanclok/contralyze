import { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';



interface AuthContextType{
    isAuthenticated: boolean;
    user: any;
    login: (user: any) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = async (user: any) => {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(user)); // Guarda el token
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Error saving userInfo:', error);
    }
  };

   const logout = async () => {
    try {
      // Elimina el token de AsyncStorage
      await AsyncStorage.removeItem('userInfo'); // Guarda el token
      setIsAuthenticated(false);
    } catch (error) {
        console.error('Error removing userInfo:', error);
      }
    };
    
    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          const user = await AsyncStorage.getItem('userInfo');
          if (user) {
            setIsAuthenticated(true);
            setUser(JSON.parse(user));
          }
        }  catch (error) {
          console.error('Error checking authentication status:', error);
        }
      };
    
      checkAuthStatus();
    }, []);
    
    return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();  
  
    useEffect(() => {
      const checkAuth = async () => {
        setIsLoading(false);
      };
  
      checkAuth();
    }, []);
  
    useEffect(() => {
      if (!isAuthenticated && !isLoading) {
        router.replace("/");
      }
    }, [isAuthenticated, isLoading]);
  
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  
    if (!isAuthenticated) {
      return null; 
    }
  
    return <>{children}</>;
  }