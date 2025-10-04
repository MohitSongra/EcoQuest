import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { challengesService, quizzesService, usersService } from '../../services/firestoreService';
import QuizManager from '../../components/admin/QuizManager';
import ChallengeManager from '../../components/admin/ChallengeManager';
import UserManager from '../../components/admin/UserManager';
import SampleDataSeeder from '../../components/SampleDataSeeder';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  estimatedTime: number; // in minutes
  creator: string;
  createdAt: Date;
  imageUrl?: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: 'active' | 'draft' | 'inactive';
  category: string;
  points: number;
  timeLimit: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'customer';
  points: number;
  status: 'active' | 'suspended';
  createdAt: Date;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout, userRole } = useAuth();
  const router = useRouter();

  // Mock stats - in real app these would be calculated from Firestore data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalChallenges: challenges.length,
    activeChallenges: challenges.filter(c => c.status === 'active').length,
    totalQuizzes: quizzes.length,
    activeQuizzes: quizzes.filter(q => q.status === 'active').length,
    totalPoints: users.reduce((sum, user) => sum + user.points, 0)
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'challenges', name: 'Challenges', icon: '🎯' },
    { id: 'quizzes', name: 'Quizzes', icon: '🧠' },
    { id: 'ewaste', name: 'E-Waste Reports', icon: '♻️' },
    { id: 'reports', name: 'Analytics', icon: '📈' }
  ];

  useEffect(() => {
    // Set up real-time listeners
    const unsubscribeChallenges = challengesService.listenToChallenges((challengesData) => {
      setChallenges(challengesData);
      setLoading(false);
    });

    const unsubscribeQuizzes = quizzesService.listenToQuizzes((quizzesData) => {
      setQuizzes(quizzesData);
    });

    const unsubscribeUsers = usersService.listenToUsers((usersData) => {
      setUsers(usersData);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeChallenges();
      unsubscribeQuizzes();
      unsubscribeUsers();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleChallengeStatus = async (challengeId: string, status: 'active' | 'inactive') => {
    try {
      await challengesService.updateChallenge(challengeId, { status });
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  const handleQuizStatus = async (quizId: string, status: 'active' | 'inactive') => {
    try {
      await quizzesService.updateQuiz(quizId, { status });
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    try {
      await usersService.updateUserStatus(userId, status);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

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

      {/* Sample Data Seeder - Only show if no data exists */}
      {(challenges.length === 0 && quizzes.length === 0) && (
        <SampleDataSeeder />
      )}

      {/* Pending Challenges */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Challenge Approvals</h2>
        <div className="space-y-4">
          {challenges.filter(c => c.status === 'pending').map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div>
                <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
                <p className="text-sm text-gray-500">Created by: {challenge.creator}</p>
                <p className="text-sm text-gray-500">Points: {challenge.points}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleChallengeStatus(challenge.id, 'active')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleChallengeStatus(challenge.id, 'inactive')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {challenges.filter(c => c.status === 'pending').length === 0 && (
            <p className="text-gray-500 text-center py-4">No pending challenges</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <UserManager users={users} onUsersUpdate={fetchData} />
  );

  const renderChallenges = () => (
    <ChallengeManager challenges={challenges} onChallengesUpdate={fetchData} />
  );

  const renderQuizzes = () => (
    <QuizManager quizzes={quizzes} onQuizzesUpdate={fetchData} />
  );

  const renderEWasteReports = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">E-Waste Device Reports</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2">Total Devices</h3>
            <p className="text-2xl font-bold text-green-600">1,247</p>
            <p className="text-sm text-green-600">devices reported</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">This Month</h3>
            <p className="text-2xl font-bold text-blue-600">89</p>
            <p className="text-sm text-blue-600">new reports</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <h3 className="font-semibold text-purple-800 mb-2">Categories</h3>
            <p className="text-2xl font-bold text-purple-600">12</p>
            <p className="text-sm text-purple-600">device types</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-medium text-gray-800 mb-3">Recent Reports</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm">📱 Smartphone - iPhone 12</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm">💻 Laptop - Dell XPS 13</span>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm">🖥️ Monitor - Samsung 24"</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics & Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">User Growth</h3>
          <p className="text-2xl font-bold text-blue-600">+12.5%</p>
          <p className="text-sm text-blue-600">vs last month</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-semibold text-green-800 mb-2">Challenge Completion</h3>
          <p className="text-2xl font-bold text-green-600">78%</p>
          <p className="text-sm text-green-600">average completion rate</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <h3 className="font-semibold text-purple-800 mb-2">Quiz Performance</h3>
          <p className="text-2xl font-bold text-purple-600">82%</p>
          <p className="text-sm text-purple-600">average score</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl">
          <h3 className="font-semibold text-orange-800 mb-2">Points Distribution</h3>
          <p className="text-2xl font-bold text-orange-600">45.6K</p>
          <p className="text-sm text-orange-600">total points awarded</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'challenges': return renderChallenges();
      case 'quizzes': return renderQuizzes();
      case 'ewaste': return renderEWasteReports();
      case 'reports': return renderReports();
      default: return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Panel</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage users, challenges, quizzes, and monitor platform performance. 
              Keep the e-waste recycling community thriving!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {userRole?.displayName || userRole?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Logout
            </button>
          </div>
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
    </ProtectedRoute>
  );
}
