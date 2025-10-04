import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { challengesService, quizzesService } from '../../services/firestoreService';
import { QuizTaker } from '../../components/user/QuizTaker';
import { EWasteReporter } from '../../components/user/EWasteReporter';
import { ChallengeParticipant } from '../../components/user/ChallengeParticipant';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  estimatedTime: number;
  creator?: string;
  createdAt?: Date;
  imageUrl?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  status: 'active' | 'draft' | 'inactive';
  category: string;
  points: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt?: Date;
}

export default function Dashboard() {
  const { currentUser, userRole } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showEWasteReporter, setShowEWasteReporter] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPoints: 1250,
    level: 8,
    challengesCompleted: 12,
    quizzesCompleted: 5,
    rank: 'Gold',
    streak: 7
  });


  useEffect(() => {
    if (currentUser && userRole) {
      // Set up real-time listeners for active content
      const unsubscribeChallenges = challengesService.listenToChallenges((challengesData) => {
        const activeChallenges = challengesData.filter(c => c.status === 'active');
        setChallenges(activeChallenges);
        setLoading(false);
      });

      const unsubscribeQuizzes = quizzesService.listenToQuizzes((quizzesData) => {
        const activeQuizzes = quizzesData.filter(q => q.status === 'active');
        setQuizzes(activeQuizzes);
      });

      // Cleanup listeners on unmount
      return () => {
        unsubscribeChallenges();
        unsubscribeQuizzes();
      };
    } else if (!currentUser) {
      // No user, stop loading
      setLoading(false);
    }
    // If currentUser exists but userRole is null, keep loading (role is being fetched)
  }, [currentUser, userRole]);

  // Show loading only if we're actually loading or if user is authenticated but role is still being fetched
  if (loading || (currentUser && !userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user, this will be handled by ProtectedRoute
  if (!currentUser || !userRole) {
    return null;
  }

  return (
    <ProtectedRoute requiredRole="customer">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome back, {userRole?.displayName || 'Champion'}! ♻
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Continue your e-waste recycling journey. Complete challenges, take quizzes, and earn points to climb the leaderboard!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-green-600">{userStats.level}</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rank</p>
                <p className="text-2xl font-bold text-purple-600">{userStats.rank}</p>
              </div>
              <div className="text-3xl">🥇</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.streak} days</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Challenges Completed</span>
                <span className="font-semibold text-green-600">{userStats.challengesCompleted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(userStats.challengesCompleted / 20) * 100}%` }}></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Quizzes Completed</span>
                <span className="font-semibold text-blue-600">{userStats.quizzesCompleted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(userStats.quizzesCompleted / 10) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Challenges */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-sm font-medium text-gray-500">{challenge.points} pts</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{challenge.category}</span>
                  <button 
                    onClick={() => setSelectedChallenge(challenge)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    Participate
                  </button>
                </div>
              </div>
            ))}
            {challenges.length === 0 && (
              <p className="text-gray-500 text-center col-span-full py-8">No challenges available at the moment</p>
            )}
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Quiz
                  </span>
                  <span className="text-sm font-medium text-gray-500">{quiz.points} pts</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{quiz.questions?.length || 0} questions</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{quiz.category}</span>
                  <button 
                    onClick={() => setSelectedQuiz(quiz)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    Take Quiz
                  </button>
                </div>
              </div>
            ))}
            {quizzes.length === 0 && (
              <p className="text-gray-500 text-center col-span-full py-8">No quizzes available at the moment</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowEWasteReporter(true)}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-medium transition-colors"
            >
              📱 Report E-Waste
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-medium transition-colors">
              📚 Learn More
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-medium transition-colors">
              👥 Invite Friends
            </button>
          </div>
        </div>

        {/* Modals */}
        {selectedQuiz && (
          <QuizTaker onClose={() => setSelectedQuiz(null)} />
        )}

        {selectedChallenge && (
          <ChallengeParticipant onClose={() => setSelectedChallenge(null)} />
        )}

        {showEWasteReporter && (
          <EWasteReporter onClose={() => setShowEWasteReporter(false)} />
        )}
      </div>
    </ProtectedRoute>
  );

}
