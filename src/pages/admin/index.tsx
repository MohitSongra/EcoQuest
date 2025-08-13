import React, { useState } from 'react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data - in real app this would come from Firebase
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalChallenges: 15,
    activeChallenges: 12,
    totalQuizzes: 8,
    totalPoints: 45600
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', points: 1250, status: 'active', joinDate: '2 days ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', points: 890, status: 'active', joinDate: '1 week ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', points: 2100, status: 'active', joinDate: '3 days ago' }
  ];

  const pendingChallenges = [
    { id: 1, title: 'Solar Panel Recycling', creator: 'EcoTech Corp', status: 'pending', points: 500 },
    { id: 2, title: 'Battery Collection Drive', creator: 'Green Community', status: 'pending', points: 300 }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'challenges', name: 'Challenges', icon: '🎯' },
    { id: 'quizzes', name: 'Quizzes', icon: '🧠' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalPoints.toLocaleString()}</p>
            </div>
            <div className="text-3xl">🏆</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Challenges</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalChallenges}</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quizzes</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalQuizzes}</p>
            </div>
            <div className="text-3xl">🧠</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Challenges</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeChallenges}</p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Users</h2>
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{user.points} pts</p>
                <p className="text-sm text-gray-500">{user.joinDate}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All Users →
          </button>
        </div>
      </div>

      {/* Pending Challenges */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Challenge Approvals</h2>
        <div className="space-y-4">
          {pendingChallenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div>
                <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                <p className="text-sm text-gray-500">Created by: {challenge.creator}</p>
                <p className="text-sm text-gray-500">Points: {challenge.points}</p>
              </div>
              <div className="flex space-x-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Approve
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
      <p className="text-gray-600">User management interface coming soon...</p>
    </div>
  );

  const renderChallenges = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Challenge Management</h2>
      <p className="text-gray-600">Challenge management interface coming soon...</p>
    </div>
  );

  const renderQuizzes = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Management</h2>
      <p className="text-gray-600">Quiz management interface coming soon...</p>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>
      <p className="text-gray-600">Reports and analytics interface coming soon...</p>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'challenges': return renderChallenges();
      case 'quizzes': return renderQuizzes();
      case 'reports': return renderReports();
      default: return renderOverview();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Panel</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage users, challenges, quizzes, and monitor platform performance. 
          Keep the e-waste recycling community thriving!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
}
