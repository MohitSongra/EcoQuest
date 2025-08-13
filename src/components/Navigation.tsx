import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, userRole, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => router.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊', show: !!currentUser },
    { href: '/challenges', label: 'Challenges', icon: '🎯', show: !!currentUser },
    { href: '/quizzes', label: 'Quizzes', icon: '🧠', show: !!currentUser },
    { href: '/admin', label: 'Admin', icon: '⚙️', show: isAdmin }
  ].filter(item => item.show);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
              isScrolled ? 'bg-emerald-600 text-white' : 'bg-black text-white'
            }`}>
              <span className="text-lg font-bold">♻</span>
            </div>
            <div className="hidden sm:block">
              <span className={`font-bold text-xl transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-gray-900'
              }`}>
                EcoQuest
              </span>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-gray-600'
              }`}>
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
                className={`group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, {userRole?.displayName || userRole?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/admin/login"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Toggle mobile menu"
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
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? isScrolled 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white/20 text-white'
                    : isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-green-100 hover:bg-white/20'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Welcome, {userRole?.displayName || userRole?.email}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    Admin Login
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
