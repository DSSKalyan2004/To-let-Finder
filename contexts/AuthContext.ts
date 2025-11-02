import { createContext } from 'react';
import { User, UserType } from '../types';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, type: UserType) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => { },
  register:async () => {
  },
  logout: async () => { },
  changePassword: async () => { },
});