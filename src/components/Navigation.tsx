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
    ? [{ href: '/admin', label: 'Admin Panel', icon: '⚙️', show: true }]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: '📊', show: !!currentUser },
        { href: '/rewards', label: 'Rewards', icon: '🎁', show: !!currentUser }
      ].filter(item => item.show);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-neon-green/20 backdrop-blur-md ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled ? 'glass-neon shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : 'bg-black/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 glass-neon rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-neon-green">
              <span className="text-lg font-bold text-neon-green animate-pulse">♻</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-clash text-xl font-bold text-gradient transition-colors duration-300">
                EcoQuest
              </span>
              <p className="text-xs text-neutral-400 font-satoshi">
                Transform E-Waste
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`group flex items-center space-x-2 px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isActive(item.href)
                    ? 'glass-neon text-neon-green shadow-neon-green transform scale-105'
                    : 'text-neutral-300 hover:text-neon-green hover:bg-neon-green/10'
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="font-satoshi">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-neutral-400 font-satoshi">
                  Welcome, {userRole?.displayName || userRole?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-satoshi"
                >
                  Logout
                </button>
              </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="btn btn-primary font-satoshi"
                  >
                    Login
                  </Link>
                </div>
              )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors duration-300 text-neutral-300 hover:text-neon-green hover:bg-neon-green/10"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 glass-neon border-t border-neon-green/20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'glass-neon text-neon-green shadow-neon-green'
                    : 'text-neutral-300 hover:text-neon-green hover:bg-neon-green/10'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-satoshi">{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-neon-green/20">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-neutral-400 font-satoshi">
                    Welcome, {userRole?.displayName || userRole?.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-red-500/30 font-satoshi"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left btn btn-primary font-satoshi"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
