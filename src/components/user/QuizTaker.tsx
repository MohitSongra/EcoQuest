import React, { useState, useEffect } from 'react';
import { doc, updateDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

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
  points: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (score: number, totalPoints: number) => void;
  onClose: () => void;
}

export default function QuizTaker({ quiz, onComplete, onClose }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // Convert to seconds
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    const pointsEarned = Math.round((finalScore / 100) * quiz.points);
    
    setScore(finalScore);
    setShowResults(true);

    // Save quiz result to Firebase
    try {
      await addDoc(collection(db, 'quizResults'), {
        userId: currentUser?.uid,
        quizId: quiz.id,
        score: finalScore,
        pointsEarned,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        answers,
        completedAt: new Date()
      });

      // Update user points (in a real app, you'd have a user points collection)
      onComplete(finalScore, pointsEarned);
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600">Great job on completing "{quiz.title}"</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{score}%</p>
                  <p className="text-sm text-gray-600">Your Score</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{Math.round((score / 100) * quiz.points)}</p>
                  <p className="text-sm text-gray-600">Points Earned</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800">Review Your Answers:</h3>
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-800 mb-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded text-sm ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 text-green-800'
                            : answers[index] === optIndex
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === question.correctAnswer && ' ✓'}
                        {answers[index] === optIndex && optIndex !== question.correctAnswer && ' ✗'}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
              <p className="text-gray-600">{quiz.category} • {quiz.difficulty}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-red-600">
                ⏱️ {formatTime(timeLeft)}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 mt-2"
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                    answers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            
            <div className="flex space-x-2">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600'
                      : answers[index] !== undefined
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={answers[currentQuestionIndex] === undefined}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
