import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats counter
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: '10K+', label: 'Active Users', icon: '👥', color: 'from-blue-500 to-blue-600' },
    { number: '50K+', label: 'Challenges Completed', icon: '🎯', color: 'from-green-500 to-green-600' },
    { number: '1M+', label: 'Points Earned', icon: '🏆', color: 'from-purple-500 to-purple-600' },
    { number: '100+', label: 'Cities Covered', icon: '🌍', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Gamified E-Waste
              <br />
              <span className="text-5xl md:text-7xl">Challenge</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join exciting challenges, earn points, and make a real impact on our planet. 
              Turn e-waste recycling into a fun, rewarding adventure that saves the Earth!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/dashboard" 
                className="group relative px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
              >
                <span className="relative z-10">Get Started Today</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <Link 
                href="/challenges" 
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                <span className="relative z-10">View Challenges</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Making a Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our community has achieved incredible milestones in e-waste recycling
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`group relative p-8 rounded-3xl bg-white shadow-xl border border-gray-100 text-center transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                  currentStat === index ? 'ring-4 ring-green-500/20' : ''
                }`}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed the ultimate e-waste recycling experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Gamified Experience</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Turn recycling into an exciting game with challenges, levels, and rewards. 
                    Every action contributes to your progress and environmental impact.
                  </p>
                </div>
              </div>
              
              <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300">
                  📊
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Progress Tracking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monitor your recycling impact with detailed analytics, achievements, 
                    and real-time progress updates. See the difference you're making.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300">
                  🏅
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Community</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Connect with like-minded environmentalists, share achievements, 
                    and participate in community challenges. Together we're stronger.
                  </p>
                </div>
              </div>
              
              <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform duration-300">
                  💡
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Educational</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Learn about e-waste and sustainable practices through interactive quizzes, 
                    expert content, and real-world application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-blue-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl md:text-2xl text-green-100 mb-12 leading-relaxed">
            Join thousands of users already making an impact on our planet. 
            Every challenge completed helps create a sustainable future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/dashboard" 
              className="group relative px-12 py-6 bg-white text-green-600 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link 
              href="/challenges" 
              className="px-12 py-6 border-2 border-white text-white rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-white hover:text-green-600 transform hover:scale-105"
            >
              Explore Challenges
            </Link>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-green-200 text-lg">
              🌱 <span className="font-semibold">Free to join</span> • <span className="font-semibold">Instant access</span> • <span className="font-semibold">Start today</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
