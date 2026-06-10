import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { challengesService, quizzesService, usersService } from '../../services/firestoreService';
import QuizManager from '../../components/admin/QuizManager';
import ChallengeManager from '../../components/admin/ChallengeManager';
import UserManager from '../../components/admin/UserManager';
import SampleDataSeeder from '../../components/SampleDataSeeder';
import EWasteReportsManager from '../../components/admin/EWasteReportsManager';
import RewardsManager from '../../components/admin/RewardsManager';
import FixUserPoints from '../../components/admin/FixUserPoints';
import Head from 'next/head';
import { Challenge, Quiz, User } from '../../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout, userRole } = useAuth();
  const router = useRouter();

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
    { id: 'rewards', name: 'Rewards', icon: '🎁' },
    { id: 'ewaste', name: 'E-Waste', icon: '♻️' },
    { id: 'reports', name: 'Analytics', icon: '📈' }
  ];

  useEffect(() => {
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

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#00ffff' },
    { label: 'Active Users', value: stats.activeUsers, icon: '✅', color: '#00ff88' },
    { label: 'Total Points', value: stats.totalPoints.toLocaleString(), icon: '🏆', color: '#ff00ff' },
    { label: 'Challenges', value: stats.totalChallenges, icon: '🎯', color: '#ffaa00' },
    { label: 'Quizzes', value: stats.totalQuizzes, icon: '🧠', color: '#00ffff' },
    { label: 'Active Challenges', value: stats.activeChallenges, icon: '🔥', color: '#00ff88' },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card group hover:border-[rgba(0,255,136,0.3)] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 font-[family-name:var(--font-satoshi)]">{stat.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <div className="text-3xl opacity-80" aria-hidden="true">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sample Data Seeder */}
      {(challenges.length === 0 && quizzes.length === 0) && (
        <SampleDataSeeder />
      )}

      {/* Pending Challenges */}
      <div className="card">
        <h2 className="text-xl font-bold text-neutral-200 mb-6 font-[family-name:var(--font-clash-display)]">Pending Challenge Approvals</h2>
        <div className="space-y-4">
          {challenges.filter(c => c.status === 'pending').map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between p-4 bg-[rgba(255,170,0,0.08)] rounded-xl border border-[rgba(255,170,0,0.2)]">
              <div>
                <h3 className="font-semibold text-neutral-200">{challenge.title}</h3>
                <p className="text-sm text-neutral-500">Created by: {challenge.creator}</p>
                <p className="text-sm text-neutral-500">Points: {challenge.points}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleChallengeStatus(challenge.id, 'active')}
                  className="btn btn-primary btn-sm"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleChallengeStatus(challenge.id, 'inactive')}
                  className="btn btn-danger btn-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {challenges.filter(c => c.status === 'pending').length === 0 && (
            <p className="text-neutral-500 text-center py-4 font-[family-name:var(--font-satoshi)]">No pending challenges</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <UserManager users={users} onUsersUpdate={() => {}} />
  );

  const renderChallenges = () => (
    <ChallengeManager challenges={challenges} onChallengesUpdate={() => {}} />
  );

  const renderQuizzes = () => (
    <QuizManager quizzes={quizzes} onQuizzesUpdate={() => {}} />
  );

  const renderRewards = () => (
    <RewardsManager />
  );

  const renderEWasteReports = () => (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-neutral-200 mb-6 font-[family-name:var(--font-clash-display)]">E-Waste Device Reports</h2>
        <EWasteReportsManager />
      </div>
      <FixUserPoints />
    </div>
  );

  const renderReports = () => (
    <div className="card">
      <h2 className="text-xl font-bold text-neutral-200 mb-6 font-[family-name:var(--font-clash-display)]">Analytics & Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[rgba(0,255,255,0.08)] p-5 rounded-xl border border-[rgba(0,255,255,0.2)]">
          <h3 className="font-semibold text-[#00ffff] mb-2 font-[family-name:var(--font-satoshi)]">User Growth</h3>
          <p className="text-2xl font-bold text-[#00ffff]">+12.5%</p>
          <p className="text-sm text-neutral-500">vs last month</p>
        </div>
        <div className="bg-[rgba(0,255,136,0.08)] p-5 rounded-xl border border-[rgba(0,255,136,0.2)]">
          <h3 className="font-semibold text-[#00ff88] mb-2 font-[family-name:var(--font-satoshi)]">Challenge Completion</h3>
          <p className="text-2xl font-bold text-[#00ff88]">78%</p>
          <p className="text-sm text-neutral-500">average completion rate</p>
        </div>
        <div className="bg-[rgba(255,0,255,0.08)] p-5 rounded-xl border border-[rgba(255,0,255,0.2)]">
          <h3 className="font-semibold text-[#ff00ff] mb-2 font-[family-name:var(--font-satoshi)]">Quiz Performance</h3>
          <p className="text-2xl font-bold text-[#ff00ff]">82%</p>
          <p className="text-sm text-neutral-500">average score</p>
        </div>
        <div className="bg-[rgba(255,170,0,0.08)] p-5 rounded-xl border border-[rgba(255,170,0,0.2)]">
          <h3 className="font-semibold text-[#ffaa00] mb-2 font-[family-name:var(--font-satoshi)]">Points Distribution</h3>
          <p className="text-2xl font-bold text-[#ffaa00]">{stats.totalPoints.toLocaleString()}</p>
          <p className="text-sm text-neutral-500">total points awarded</p>
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
      case 'rewards': return renderRewards();
      case 'ewaste': return renderEWasteReports();
      case 'reports': return renderReports();
      default: return renderOverview();
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <Head>
        <title>Admin — EcoQuest</title>
        <meta name="description" content="EcoQuest admin control center" />
      </Head>
      
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-primary">
          <div className="text-center">
            <div className="spinner-neon mx-auto"></div>
            <p className="mt-4 text-neutral-400 font-[family-name:var(--font-satoshi)]">Loading admin data...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-primary particle-bg">
          <div className="relative z-10 space-y-6 p-4 sm:p-6 pt-24">
            {/* Header */}
            <div className="card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 glass-neon rounded-2xl flex items-center justify-center shadow-neon-green">
                    <span className="text-3xl" aria-hidden="true">⚡</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-100 tracking-tight font-[family-name:var(--font-clash-display)]">
                      Admin <span className="text-gradient">Control Center</span>
                    </h1>
                    <p className="text-neutral-500 text-sm font-[family-name:var(--font-satoshi)]">
                      Manage users, challenges, quizzes, and monitor platform performance
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Logged in as</p>
                    <p className="text-sm text-neutral-200 font-semibold font-[family-name:var(--font-satoshi)]">
                      {userRole?.displayName || userRole?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm"
                    title="Log out"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="card p-3 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap font-[family-name:var(--font-satoshi)] ${
                      activeTab === tab.id
                        ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                        : 'text-neutral-400 hover:bg-[rgba(0,255,136,0.08)] hover:text-neutral-200'
                    }`}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
