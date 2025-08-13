import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Navigation />
      <main className="pt-20 pb-8">
        {children}
      </main>
      
      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-r from-green-800 via-green-700 to-green-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xl">♻</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">E-Waste Challenge</h3>
                  <p className="text-green-200 text-sm">Making recycling fun and rewarding</p>
                </div>
              </div>
              <p className="text-green-100 max-w-md">
                Join thousands of environmental champions in the mission to reduce e-waste 
                and create a sustainable future for our planet.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/dashboard" className="text-green-200 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/challenges" className="text-green-200 hover:text-white transition-colors">Challenges</a></li>
                <li><a href="/quizzes" className="text-green-200 hover:text-white transition-colors">Quizzes</a></li>
                <li><a href="/admin" className="text-green-200 hover:text-white transition-colors">Admin</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Get in Touch</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-green-200">
                  <span>📧</span>
                  <span>hello@ewaste-challenge.com</span>
                </li>
                <li className="flex items-center space-x-2 text-green-200">
                  <span>🌐</span>
                  <span>www.ewaste-challenge.com</span>
                </li>
                <li className="flex items-center space-x-2 text-green-200">
                  <span>📱</span>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-green-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-200 text-sm text-center md:text-left">
              ♻ Making e-waste recycling fun and rewarding since 2024
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="Twitter">
                🐦
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="Instagram">
                📷
              </a>
              <a href="#" className="text-green-200 hover:text-white transition-colors" aria-label="LinkedIn">
                💼
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
