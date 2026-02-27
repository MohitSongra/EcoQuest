import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin shadow-neon-green"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin shadow-neon-cyan" style={{ animationDelay: '0.2s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="mt-6 text-neutral-400 font-satoshi animate-pulse">Loading your dashboard...</p>
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
      <div className="min-h-screen bg-primary particle-bg">
        <div className="space-y-8 p-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden glass-neon rounded-3xl shadow-neon-green p-8"
          >
            <div className="absolute inset-0 gradient-mesh opacity-20"></div>
            <div className="relative z-10 text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 glass-neon rounded-full mb-4 shadow-neon-cyan"
              >
                <span className="text-5xl animate-pulse">♻️</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-clash text-4xl md:text-5xl font-bold text-gradient mb-3 tracking-tight"
              >
                Welcome back, {userRole?.displayName || 'Champion'}!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-neutral-400 text-lg max-w-2xl mx-auto font-satoshi"
              >
                Continue your e-waste recycling journey. Complete challenges, take quizzes, and earn points to climb the leaderboard!
              </motion.p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="glass-neon rounded-3xl shadow-neon-purple p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm font-medium mb-2 font-satoshi">Your Total Points</p>
                <motion.p 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.8, type: "spring" }}
                  className="font-clash text-6xl md:text-7xl font-bold text-gradient"
                >
                  {userPoints}
                </motion.p>
                <p className="text-neutral-500 text-sm mt-2 font-satoshi">
                  Earn points by completing challenges, quizzes, and reporting e-waste!
                </p>
              </div>
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-8xl opacity-80"
              >
                💎
              </motion.div>
            </div>
          </motion.div>

          {/* My E-Waste Reports */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="glass-neon rounded-3xl shadow-neon-cyan p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="font-clash text-3xl font-bold text-neutral-300 flex items-center"
              >
                <motion.span 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-3xl mr-3"
                >
                  📱
                </motion.span>
                My E-Waste Reports
              </motion.h2>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEWasteReporter(true)}
                className="btn btn-primary font-satoshi"
              >
                + Report E-Waste
              </motion.button>
            </div>
            <MyReports />
          </motion.div>

          {/* Available Challenges */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="glass-neon rounded-3xl shadow-neon-green p-8"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="font-clash text-3xl font-bold text-neutral-300 mb-8 flex items-center"
            >
              <motion.span 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-3xl mr-3"
              >
                🎯
              </motion.span>
              Available Challenges
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <motion.div 
                  key={challenge.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
                  className="card hover-lift group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full font-satoshi ${
                      challenge.difficulty === 'easy' ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' :
                      challenge.difficulty === 'medium' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' :
                      'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                    }`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-neon-green font-satoshi">{challenge.points} pts</span>
                  </div>
                  <h3 className="font-clash font-bold text-neutral-300 mb-3 text-lg">{challenge.title}</h3>
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2 font-satoshi">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide font-satoshi">{challenge.category}</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedChallenge(challenge)}
                      className="btn btn-primary text-sm font-satoshi"
                    >
                      Start
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              {challenges.length === 0 && (
                <p className="text-neutral-500 text-center col-span-full py-8 font-satoshi">No challenges available at the moment</p>
              )}
            </div>
          </motion.div>

          {/* Available Quizzes */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="glass-neon rounded-3xl shadow-neon-purple p-8"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.6 }}
              className="font-clash text-3xl font-bold text-neutral-300 mb-8 flex items-center"
            >
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                className="text-3xl mr-3"
              >
                🧠
              </motion.span>
              Available Quizzes
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz, index) => (
                <motion.div 
                  key={quiz.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.1, duration: 0.6 }}
                  className="card hover-lift group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30 font-satoshi">
                      QUIZ
                    </span>
                    <span className="text-sm font-bold text-neon-purple font-satoshi">{quiz.points} pts</span>
                  </div>
                  <h3 className="font-clash font-bold text-neutral-300 mb-3 text-lg">{quiz.title}</h3>
                  <p className="text-sm text-neutral-400 mb-4 font-satoshi">{quiz.questions?.length || 0} questions • {quiz.timeLimit || 10} min</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide font-satoshi">{quiz.category}</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedQuiz(quiz)}
                      className="btn btn-primary text-sm font-satoshi"
                    >
                      Start
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              {quizzes.length === 0 && (
                <p className="text-neutral-500 text-center col-span-full py-8 font-satoshi">No quizzes available at the moment</p>
              )}
            </div>
          </motion.div>
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <Leaderboard />
          </motion.div>

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
