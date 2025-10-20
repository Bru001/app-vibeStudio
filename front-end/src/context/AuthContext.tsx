import React, { createContext, useState, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface AuthContextData {
  user: any;
  token: string | null;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  async function signIn(email: string, password: string) {
    const response = await axios.post("https://seu-backend.com/api/auth/login", {
      email,
      password,
    });

    const { user, token } = response.data;
    setUser(user);
    setToken(token);

    await AsyncStorage.setItem("@token", token);
  }

  async function signOut() {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("@token");
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);