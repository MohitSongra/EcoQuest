import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  displayName?: string;
  createdAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'admin' | 'customer', displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  async function signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // User role will be fetched in useEffect when auth state changes
    } catch (error) {
      throw error;
    }
  }

  async function signUp(email: string, password: string, role: 'admin' | 'customer', displayName?: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user role document
      const userRoleData: UserRole = {
        uid: result.user.uid,
        email: result.user.email!,
        role,
        displayName,
        createdAt: new Date()
      };

      await setDoc(doc(db, 'userRoles', result.user.uid), userRoleData);
      setUserRole(userRoleData);
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUserRole(null);
    } catch (error) {
      throw error;
    }
  }

  async function fetchUserRole(uid: string, email: string) {
    try {
      const userRoleDoc = await getDoc(doc(db, 'userRoles', uid));
      if (userRoleDoc.exists()) {
        const roleData = userRoleDoc.data() as UserRole;
        // Handle Firestore timestamp conversion
        if (roleData.createdAt && typeof roleData.createdAt === 'object' && 'toDate' in roleData.createdAt) {
          roleData.createdAt = (roleData.createdAt as any).toDate();
        }
        setUserRole(roleData);
      } else {
        // Create default customer role for users without roles
        const defaultUserRole: UserRole = {
          uid,
          email,
          role: 'customer',
          displayName: email.split('@')[0],
          createdAt: new Date()
        };
        
        await setDoc(doc(db, 'userRoles', uid), defaultUserRole);
        setUserRole(defaultUserRole);
      }
    } catch (error) {
      console.error('Error fetching/creating user role:', error);
      // Set a fallback role to prevent infinite loading
      setUserRole({
        uid,
        email,
        role: 'customer',
        displayName: email.split('@')[0],
        createdAt: new Date()
      });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        await fetchUserRole(user.uid, user.email);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userRole,
    loading,
    signIn,
    signUp,
    logout,
    isAdmin: userRole?.role === 'admin',
    isCustomer: userRole?.role === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
