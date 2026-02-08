import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { challengesService, quizzesService } from '../../services/firestoreService';
import { QuizTaker } from '../../components/user/QuizTakerModal';
import { EWasteReporter } from '../../components/user/EWasteReporter';
import { ChallengeParticipant } from '../../components/user/ChallengeParticipant';
import Leaderboard from '../../components/user/Leaderboard';
import MyReports from '../../components/user/MyReports';
import { Quiz, Challenge } from '../../types';

export default function Dashboard() {
  const { currentUser, userRole } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showEWasteReporter, setShowEWasteReporter] = useState(false);
  const [userPoints, setUserPoints] = useState(0);


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

      // Set up real-time listener for user points
      const setupPointsListener = async () => {
        const { doc, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../services/firebase');
        
        const userRef = doc(db, 'userRoles', currentUser.uid);
        const unsubscribePoints = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserPoints(userData.points || 0);
          }
        });
        
        return unsubscribePoints;
      };

      let unsubscribePoints: (() => void) | undefined;
      setupPointsListener().then(unsub => {
        unsubscribePoints = unsub;
      });

      // Cleanup listeners on unmount
      return () => {
        unsubscribeChallenges();
        unsubscribeQuizzes();
        if (unsubscribePoints) unsubscribePoints();
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="space-y-8 p-6">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-2xl p-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIzIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 shadow-lg">
                <span className="text-5xl">♻️</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Welcome back, {userRole?.displayName || 'Champion'}!
              </h1>
              <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                Continue your e-waste recycling journey. Complete challenges, take quizzes, and earn points to climb the leaderboard!
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Your Total Points</p>
                <p className="text-6xl font-bold">{userPoints}</p>
                <p className="text-blue-100 text-sm mt-2">
                  Earn points by completing challenges, quizzes, and reporting e-waste!
                </p>
              </div>
              <div className="text-8xl opacity-80">💎</div>
            </div>
          </div>

          {/* My E-Waste Reports */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="text-3xl mr-3">📱</span>
                My E-Waste Reports
              </h2>
              <button 
                onClick={() => setShowEWasteReporter(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                + Report E-Waste
              </button>
            </div>
            <MyReports />
          </div>

          {/* Available Challenges */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="text-3xl mr-3">🎯</span>
              Available Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-emerald-400">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      challenge.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-800' :
                      challenge.difficulty === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">{challenge.points} pts</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">{challenge.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{challenge.category}</span>
                    <button 
                      onClick={() => setSelectedChallenge(challenge)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start
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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-cyan-100 p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="text-3xl mr-3">🧠</span>
              Available Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-cyan-400">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-100 text-cyan-800">
                      QUIZ
                    </span>
                    <span className="text-sm font-bold text-cyan-600">{quiz.points} pts</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{quiz.questions?.length || 0} questions • {quiz.timeLimit || 10} min</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{quiz.category}</span>
                    <button 
                      onClick={() => setSelectedQuiz(quiz)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            {quizzes.length === 0 && (
              <p className="text-gray-500 text-center col-span-full py-8">No quizzes available at the moment</p>
            )}
          </div>
        </div>

          {/* Leaderboard */}
          <Leaderboard />

        {/* Modals */}
        {selectedQuiz && (
          <QuizTaker quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />
        )}

        {selectedChallenge && (
          <ChallengeParticipant challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} />
        )}

        {showEWasteReporter && (
          <EWasteReporter onClose={() => setShowEWasteReporter(false)} />
        )}
        </div>
      </div>
    </ProtectedRoute>
  );

}
