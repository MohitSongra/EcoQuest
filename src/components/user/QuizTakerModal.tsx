import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Quiz, Question, QuizSubmission } from '../../types';
import { ValidationService } from '../../services/validationService';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface QuizTakerProps {
  quiz: Quiz;
  onClose: () => void;
}

export function QuizTaker({ quiz, onClose }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { currentUser } = useAuth();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  // Escape key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateScore();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = async () => {
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    // Calculate score based on correct answers
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * quiz.points);
    
    // Create quiz submission for server-side validation
    if (currentUser && currentUser.email) {
      try {
        const submission: QuizSubmission = {
          id: '', // Will be set by Firestore
          quizId: quiz.id,
          userId: currentUser.uid,
          userEmail: currentUser.email,
          score: finalScore,
          totalQuestions: quiz.questions.length,
          correctAnswers,
          submittedAt: new Date()
        };
        
        // Validate submission
        const validation = ValidationService.validateQuizSubmission(submission, quiz);
        if (!validation.isValid) {
          console.error('Quiz submission validation failed:', validation.errors);
          // Still show results to user but log the error
        }
        
        // Save submission to Firestore
        await setDoc(doc(db, 'quizSubmissions', `${currentUser.uid}_${quiz.id}_${Date.now()}`), {
          ...submission,
          submittedAt: serverTimestamp()
        });
        
      } catch (error) {
        console.error('Error saving quiz submission:', error);
        // Continue with showing results even if saving fails
      }
    }
    
    setScore(finalScore);
    setShowResults(true);
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const correctCount = quiz.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);

    return (
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal-content p-8 max-w-2xl w-full mx-4 font-[family-name:var(--font-satoshi)]">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-neutral-200 mb-4 font-[family-name:var(--font-clash-display)]">Quiz Complete!</h2>
            <p className="text-neutral-400 mb-6">Here are your results:</p>
            
            <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.15)] rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Score</p>
                  <p className="text-3xl font-bold text-[#00ffff] font-[family-name:var(--font-clash-display)]">{score}</p>
                  <p className="text-xs text-neutral-500">points</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Accuracy</p>
                  <p className="text-3xl font-bold text-[#00ff88] font-[family-name:var(--font-clash-display)]">{percentage}%</p>
                  <p className="text-xs text-neutral-500">{correctCount}/{quiz.questions.length} correct</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRetake}
                className="btn btn-secondary"
              >
                Retake Quiz
              </button>
              <button
                onClick={onClose}
                className="btn btn-outline"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content p-8 max-w-3xl w-full mx-4 font-[family-name:var(--font-satoshi)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">{quiz.title}</h2>
            <p className="text-sm text-neutral-400">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-[#00ff88] text-2xl transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/50 border border-[rgba(0,255,136,0.1)] rounded-full h-2 mb-6">
          <div 
            className="bg-[#00ff88] h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,255,136,0.5)]"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-neutral-200 mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-[#00ff88] bg-[rgba(0,255,136,0.1)] shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                    : 'border-[rgba(0,255,136,0.1)] hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.05)]'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-[#00ff88] bg-[#00ff88]'
                      : 'border-neutral-600'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-3 h-3 bg-black rounded-full" />
                    )}
                  </div>
                  <span className="text-neutral-300">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
