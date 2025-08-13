import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  creator: string;
  createdAt: Date;
  category: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: number;
  status: 'active' | 'draft' | 'inactive';
  createdAt: Date;
  category: string;
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
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch challenges
      const challengesSnapshot = await getDocs(collection(db, 'challenges'));
      const challengesData = challengesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Challenge[];
      setChallenges(challengesData);

      // Fetch quizzes
      const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzesData = quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Quiz[];
      setQuizzes(quizzesData);

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'userRoles'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        points: Math.floor(Math.random() * 2000) + 100, // Mock points
        status: 'active' as const
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await updateDoc(doc(db, 'challenges', challengeId), { status });
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, status } : c
      ));
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  const handleQuizStatus = async (quizId: string, status: 'active' | 'inactive') => {
    try {
      await updateDoc(doc(db, 'quizzes', quizId), { status });
      setQuizzes(prev => prev.map(q => 
        q.id === quizId ? { ...q, status } : q
      ));
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    try {
      await updateDoc(doc(db, 'userRoles', userId), { status });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status } : u
      ));
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {user.displayName?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.displayName || 'No Name'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.points}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Challenge Management</h2>
      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h3 className="font-semibold text-gray-800">{challenge.title}</h3>
              <p className="text-sm text-gray-500">{challenge.description}</p>
              <p className="text-sm text-gray-500">Points: {challenge.points} | Category: {challenge.category}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                challenge.status === 'active' ? 'bg-green-100 text-green-800' :
                challenge.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {challenge.status}
              </span>
              <button
                onClick={() => handleChallengeStatus(challenge.id, challenge.status === 'active' ? 'inactive' : 'active')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  challenge.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {challenge.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
        {challenges.length === 0 && (
          <p className="text-gray-500 text-center py-4">No challenges found</p>
        )}
      </div>
    </div>
  );

  const renderQuizzes = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Management</h2>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h3 className="font-semibold text-gray-800">{quiz.title}</h3>
              <p className="text-sm text-gray-500">Questions: {quiz.questions} | Category: {quiz.category}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                quiz.status === 'active' ? 'bg-green-100 text-green-800' :
                quiz.status === 'draft' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {quiz.status}
              </span>
              <button
                onClick={() => handleQuizStatus(quiz.id, quiz.status === 'active' ? 'inactive' : 'active')}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  quiz.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {quiz.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <p className="text-gray-500 text-center py-4">No quizzes found</p>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>
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
