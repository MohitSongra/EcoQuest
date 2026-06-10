import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CustomerLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, userRole } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (userRole?.role === 'admin') {
      router.push('/admin');
    } else if (userRole?.role === 'customer') {
      router.push('/dashboard');
    }
  }, [userRole, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (isSignUp && password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      
      if (isSignUp) {
        await signUp(email, password, 'customer', displayName);
      } else {
        await signIn(email, password);
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to authenticate');
      setLoading(false);
    }
  };

  const handleModeToggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setConfirmPassword('');
    if (!isSignUp) setDisplayName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary particle-bg py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[rgba(0,255,136,0.08)] blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-[rgba(0,255,255,0.06)] blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto h-20 w-20 glass-neon rounded-2xl flex items-center justify-center shadow-neon-green"
          >
            <span className="text-[#00ff88] text-3xl font-bold">♻</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-3xl font-bold text-neutral-100 font-[family-name:var(--font-clash-display)]"
          >
            {isSignUp ? 'Join EcoQuest' : 'Welcome Back'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-2 text-sm text-neutral-400 font-[family-name:var(--font-satoshi)]"
          >
            {isSignUp 
              ? 'Create your account and start your sustainability journey' 
              : 'Sign in to continue your eco-journey'
            }
          </motion.p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 space-y-6 card p-8" 
          onSubmit={handleSubmit}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-[family-name:var(--font-satoshi)]"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="displayName" className="label-primary">
                  Full Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required={isSignUp}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input-primary"
                  placeholder="John Doe"
                />
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="label-primary">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-primary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-primary"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="confirmPassword" className="label-primary">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required={isSignUp}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-primary"
                  placeholder="••••••••"
                />
              </motion.div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-base py-3"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner-neon w-5 h-5 mr-2" style={{ borderWidth: '2px' }}></div>
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleModeToggle}
              className="text-sm text-[#00ff88] hover:text-[#4ade80] transition-colors font-[family-name:var(--font-satoshi)]"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

        </motion.form>

        {isSignUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-neutral-500 font-[family-name:var(--font-satoshi)]">
              By signing up, you agree to our terms of service and privacy policy.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
