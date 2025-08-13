import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/' 
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
