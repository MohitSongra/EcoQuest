import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Mock data - in real app this would come from Firebase
  const userStats = {
    totalPoints: 1250,
    level: 8,
    challengesCompleted: 12,
    currentStreak: 5,
    rank: 'Silver Recycler',
    nextLevelPoints: 200,
    progressToNextLevel: 65
  };

  const recentActivities = [
    { id: 1, type: 'challenge', title: 'Phone Recycling Mission', points: 150, date: '2 hours ago', status: 'completed' },
    { id: 2, type: 'quiz', title: 'E-Waste Basics Quiz', points: 75, date: '1 day ago', status: 'completed' },
    { id: 3, type: 'challenge', title: 'Laptop Collection Drive', points: 200, date: '3 days ago', status: 'completed' },
    { id: 4, type: 'challenge', title: 'Battery Recycling Challenge', points: 100, date: '5 days ago', status: 'in-progress' },
  ];

  const achievements = [
    { id: 1, name: 'First Challenge', description: 'Complete your first recycling challenge', icon: '🎯', unlocked: true, date: '2 weeks ago' },
    { id: 2, name: 'Quiz Master', description: 'Score 90%+ on 5 quizzes', icon: '🧠', unlocked: true, date: '1 week ago' },
    { id: 3, name: 'Streak Champion', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false, progress: 5 },
    { id: 4, name: 'Community Leader', description: 'Help 10 other users', icon: '👥', unlocked: false, progress: 3 },
  ];

  const timeframes = [
    { id: 'week', label: 'This Week', icon: '📅' },
    { id: 'month', label: 'This Month', icon: '📊' },
    { id: 'year', label: 'This Year', icon: '🎯' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      default: return '⏸️';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-blue-600 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back, Eco Warrior! 🌱
              </h1>
              <p className="text-xl text-green-100 max-w-2xl">
                Track your progress and continue your recycling journey. You're making a real difference!
              </p>
            </div>
            <Link 
              href="/challenges" 
              className="mt-6 lg:mt-0 group relative px-8 py-4 bg-white text-green-600 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Find New Challenges</span>
              <div className="absolute inset-0 bg-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                {userStats.totalPoints.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🏆</div>
          </div>
        </div>
        
        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Level</p>
              <p className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                {userStats.level}
              </p>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">⭐</div>
          </div>
        </div>
        
        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Challenges</p>
              <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                {userStats.challengesCompleted}
              </p>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🎯</div>
          </div>
        </div>
        
        <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                {userStats.currentStreak} days
              </p>
            </div>
            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🔥</div>
          </div>
        </div>
      </div>

      {/* Rank and Progress */}
      <div className="bg-gradient-to-r from-green-500 via-green-400 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Rank: {userStats.rank}</h2>
              <p className="text-green-100 text-lg">Keep recycling to reach the next level!</p>
            </div>
            <div className="text-8xl animate-pulse">🥈</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Level {userStats.level}</span>
              <span>Level {userStats.level + 1}</span>
            </div>
            <div className="w-full bg-green-300/30 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-white h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${userStats.progressToNextLevel}%` }}
              />
            </div>
            <div className="text-center text-sm text-green-100">
              {userStats.progressToNextLevel}% complete • {userStats.nextLevelPoints} points to next level
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Activity Overview</h2>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe.id
                    ? 'bg-white text-green-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{timeframe.icon}</span>
                <span className="hidden sm:inline">{timeframe.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                  activity.type === 'challenge' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                } group-hover:scale-110 transition-transform duration-300`}>
                  {activity.type === 'challenge' ? '🎯' : '🧠'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {getStatusIcon(activity.status)} {activity.status}
                </span>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{activity.points} pts</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/challenges" 
            className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
          >
            View All Activities →
          </Link>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`p-4 rounded-xl border transition-all duration-300 ${
              achievement.unlocked 
                ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`text-3xl ${achievement.unlocked ? 'animate-bounce' : 'opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm ${achievement.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <p className="text-xs text-green-600 mt-1">Unlocked {achievement.date}</p>
                  ) : (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/quizzes" 
          className="group bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-8 rounded-3xl border border-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <div className="flex items-center space-x-6">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🧠</div>
            <div>
              <h3 className="text-2xl font-bold text-blue-800 group-hover:text-blue-900 transition-colors">Take a Quiz</h3>
              <p className="text-blue-600 group-hover:text-blue-700 transition-colors">Test your knowledge and earn bonus points</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/challenges" 
          className="group bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-8 rounded-3xl border border-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <div className="flex items-center space-x-6">
            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🎯</div>
            <div>
              <h3 className="text-2xl font-bold text-green-800 group-hover:text-green-900 transition-colors">New Challenge</h3>
              <p className="text-green-600 group-hover:text-green-700 transition-colors">Find your next recycling mission</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
