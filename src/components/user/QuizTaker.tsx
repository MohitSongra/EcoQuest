import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { quizzesService } from '../../services/firestoreService';

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
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

export function QuizTaker({ onClose }: { onClose: () => void }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = quizzesService.listenToQuizzes((quizzesData) => {
      const activeQuizzes = quizzesData.filter(quiz => quiz.status === 'active');
      setQuizzes(activeQuizzes);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (selectedQuiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (selectedQuiz && timeLeft === 0) {
      handleQuizSubmit();
    }
  }, [timeLeft, selectedQuiz]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setTimeLeft(quiz.timeLimit * 60);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handleQuizSubmit = () => {
    if (!selectedQuiz) return;
    
    let correctAnswers = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / selectedQuiz.questions.length) * selectedQuiz.points);
    setScore(finalScore);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{score} Points</div>
              <div className="text-gray-600">
                {answers.filter((answer, index) => answer === selectedQuiz!.questions[index].correctAnswer).length} / {selectedQuiz!.questions.length} Correct
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setShowResults(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Take Another Quiz
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{selectedQuiz.title}</h2>
            <div className="text-right">
              <div className="text-lg font-semibold text-red-600">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-600">
                {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setAnswers([]);
                setCurrentQuestionIndex(0);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={answers[currentQuestionIndex] === -1}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Quizzes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>📝 {quiz.questions.length} questions</span>
                <span>⏱️ {quiz.timeLimit} minutes</span>
                <span>🏆 {quiz.points} points</span>
              </div>
              
              <button
                onClick={() => startQuiz(quiz)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Quizzes Available</h3>
            <p className="text-gray-600">Check back later for new quizzes!</p>
          </div>
        )}
      </div>
    </div>
  );
}
