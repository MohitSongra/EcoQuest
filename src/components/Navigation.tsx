import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const { currentUser, userRole, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Hide header when scrolling down past 50px, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsMobileMenuOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = isAdmin 
    ? [{ href: '/admin', label: 'Admin Panel', show: true }]
    : [
        { href: '/dashboard', label: 'Dashboard', show: !!currentUser },
        { href: '/rewards', label: 'Rewards', show: !!currentUser }
      ].filter(item => item.show);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className={`transition-all duration-300 ${
        isScrolled ? 'bg-canvas/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span className="text-sm font-bold tracking-tighter">EQ</span>
              </div>
              <span className="font-medium tracking-tight text-white transition-opacity duration-300">
                EcoQuest
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-surface-2 text-white'
                      : 'text-ink-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-ink-muted">
                    {userRole?.displayName || userRole?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-ink-muted hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-ink hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/login"
                      className="btn-primary"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-ink-muted hover:text-white"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.5">
                <span className={`block w-full h-[1.5px] bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''
                }`} />
                <span className={`block w-full h-[1.5px] bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <span className={`block w-full h-[1.5px] bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''
                }`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden bg-surface-1 border-b border-white/5 backdrop-blur-xl ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? 'text-white'
                  : 'text-ink-muted hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile Auth Buttons */}
          <div className="pt-6 mt-6 border-t border-white/5">
            {currentUser ? (
              <div className="space-y-4">
                <div className="text-sm text-ink-muted">
                  {userRole?.displayName || userRole?.email}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-medium text-ink hover:text-white transition-colors py-3 rounded-full border border-white/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
