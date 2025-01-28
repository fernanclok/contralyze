import { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';



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
    const { isAuthenticated, user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      };
  
      checkAuth();
    }, []);
  
    if (isLoading) {
       return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
    }
  
    if (!isAuthenticated) {
      return <Redirect href="/" />;
    }
  
    return <>{children}</>;
  }
