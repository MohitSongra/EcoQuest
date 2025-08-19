import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

// Interfaces
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
  creator: string;
  createdAt: Date;
  imageUrl?: string;
}

interface EWasteDevice {
  id: string;
  deviceType: string;
  brand: string;
  model: string;
  condition: 'working' | 'broken' | 'partially-working';
  location: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'collected' | 'processed';
  estimatedValue?: number;
}

// QuizTaker Component
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
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (selectedQuiz && timeLeft === 0) {
      handleQuizSubmit();
    }
  }, [timeLeft, selectedQuiz]);

  const fetchQuizzes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzesData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Quiz))
        .filter(quiz => quiz.status === 'active');
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

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

// ChallengeParticipant Component
export function ChallengeParticipant({ onClose }: { onClose: () => void }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [participationData, setParticipationData] = useState({
    description: '',
    evidence: '',
    location: ''
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'challenges'));
      const challengesData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Challenge))
        .filter(challenge => challenge.status === 'active');
      setChallenges(challengesData);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const handleParticipate = async () => {
    if (!selectedChallenge || !currentUser) return;

    try {
      await addDoc(collection(db, 'challengeParticipations'), {
        challengeId: selectedChallenge.id,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        description: participationData.description,
        evidence: participationData.evidence,
        location: participationData.location,
        status: 'pending',
        submittedAt: new Date(),
        points: selectedChallenge.points
      });

      alert('Challenge participation submitted successfully!');
      setSelectedChallenge(null);
      setParticipationData({ description: '', evidence: '', location: '' });
    } catch (error) {
      console.error('Error submitting participation:', error);
      alert('Error submitting participation. Please try again.');
    }
  };

  if (selectedChallenge) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Participate in Challenge</h2>
            <button
              onClick={() => setSelectedChallenge(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedChallenge.title}</h3>
            <p className="text-gray-600 mb-4">{selectedChallenge.description}</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Requirements:</h4>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                {selectedChallenge.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description of your participation
              </label>
              <textarea
                value={participationData.description}
                onChange={(e) => setParticipationData({...participationData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Describe how you completed this challenge..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence/Proof (URL or description)
              </label>
              <input
                type="text"
                value={participationData.evidence}
                onChange={(e) => setParticipationData({...participationData, evidence: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Photo URL, document link, or description of evidence..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={participationData.location}
                onChange={(e) => setParticipationData({...participationData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Where did you complete this challenge?"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleParticipate}
              disabled={!participationData.description || !participationData.location}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Submit Participation
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
          <h2 className="text-2xl font-bold text-gray-800">Available Challenges</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{challenge.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>⏱️ {challenge.estimatedTime} min</span>
                <span>🏆 {challenge.points} points</span>
              </div>
              
              <button
                onClick={() => setSelectedChallenge(challenge)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Participate
              </button>
            </div>
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Challenges Available</h3>
            <p className="text-gray-600">Check back later for new challenges!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// EWasteReporter Component
export function EWasteReporter({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    condition: 'working' as 'working' | 'broken' | 'partially-working',
    location: '',
    description: '',
    estimatedValue: ''
  });
  const { currentUser } = useAuth();

  const deviceTypes = [
    'Smartphone', 'Laptop', 'Desktop Computer', 'Tablet', 'Television',
    'Printer', 'Router', 'Gaming Console', 'Smart Watch', 'Headphones',
    'Camera', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const deviceData: Partial<EWasteDevice> = {
        deviceType: formData.deviceType,
        brand: formData.brand,
        model: formData.model,
        condition: formData.condition,
        location: formData.location,
        reportedBy: currentUser.uid,
        reportedAt: new Date(),
        status: 'pending',
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined
      };

      await addDoc(collection(db, 'ewasteReports'), deviceData);
      
      alert('E-waste device reported successfully!');
      setFormData({
        deviceType: '',
        brand: '',
        model: '',
        condition: 'working',
        location: '',
        description: '',
        estimatedValue: ''
      });
      onClose();
    } catch (error) {
      console.error('Error reporting device:', error);
      alert('Error reporting device. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Report E-Waste Device</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Type *
            </label>
            <select
              value={formData.deviceType}
              onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select device type</option>
              {deviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Apple, Samsung, Dell"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., iPhone 12, Galaxy S21"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="working">Working</option>
              <option value="partially-working">Partially Working</option>
              <option value="broken">Broken</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, State or full address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Value (optional)
            </label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Estimated value in USD"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any additional details about the device..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Report Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
