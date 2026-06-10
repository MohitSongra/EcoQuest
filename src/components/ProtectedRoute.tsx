import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && userRole?.role !== requiredRole) {
        if (userRole?.role === 'admin') {
          router.push('/admin');
        } else if (userRole?.role === 'customer') {
          router.push('/dashboard');
        } else {
          router.push(redirectTo);
        }
        return;
      }
    }
  }, [currentUser, userRole, loading, requiredRole, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="spinner-neon mx-auto"></div>
          <p className="mt-4 text-neutral-400 font-[family-name:var(--font-satoshi)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (requiredRole && userRole?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
