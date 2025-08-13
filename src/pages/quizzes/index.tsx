import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: number;
  status: 'active' | 'draft' | 'inactive';
  category: string;
  points: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'basics', 'recycling', 'environment', 'technology', 'sustainability'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [quizzes, selectedCategory, selectedDifficulty]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      
      // Fetch active quizzes
      const quizzesSnapshot = await getDocs(query(collection(db, 'quizzes'), where('status', '==', 'active')));
      const quizzesData = quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quiz[];
      
      // Add mock data if no quizzes exist
      if (quizzesData.length === 0) {
        quizzesData.push(
          {
            id: '1',
            title: 'E-Waste Basics',
            description: 'Test your knowledge about electronic waste and its environmental impact.',
            questions: 10,
            status: 'active',
            category: 'basics',
            points: 50,
            estimatedTime: '10 minutes',
            difficulty: 'beginner'
          },
          {
            id: '2',
            title: 'Recycling Best Practices',
            description: 'Learn about proper e-waste recycling methods and procedures.',
            questions: 15,
            status: 'active',
            category: 'recycling',
            points: 75,
            estimatedTime: '15 minutes',
            difficulty: 'intermediate'
          },
          {
            id: '3',
            title: 'Environmental Impact',
            description: 'Understand the environmental consequences of improper e-waste disposal.',
            questions: 20,
            status: 'active',
            category: 'environment',
            points: 100,
            estimatedTime: '20 minutes',
            difficulty: 'advanced'
          },
          {
            id: '4',
            title: 'Sustainable Technology',
            description: 'Explore eco-friendly technology and green computing practices.',
            questions: 12,
            status: 'active',
            category: 'technology',
            points: 60,
            estimatedTime: '12 minutes',
            difficulty: 'intermediate'
          }
        );
      }
      
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = quizzes;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty);
    }

    setFilteredQuizzes(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return '📚';
      case 'recycling': return '♻';
      case 'environment': return '🌍';
      case 'technology': return '💻';
      case 'sustainability': return '🌱';
      default: return '🧠';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="customer">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Knowledge Quizzes 🧠</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test your knowledge about e-waste, recycling, and environmental sustainability. Earn points while learning!
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Quizzes</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{getCategoryIcon(quiz.category)}</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">{quiz.title}</h3>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Questions:</span>
                  <span className="font-semibold text-blue-600">{quiz.questions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Points:</span>
                  <span className="font-semibold text-green-600">{quiz.points} pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-semibold text-purple-600">{quiz.estimatedTime}</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
                Start Quiz
              </button>
            </div>
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No quizzes found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new quizzes.</p>
          </div>
        )}

        {/* Quiz Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{quizzes.length}</div>
              <div className="text-gray-600">Total Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {quizzes.filter(q => q.difficulty === 'beginner').length}
              </div>
              <div className="text-gray-600">Beginner</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {quizzes.filter(q => q.difficulty === 'intermediate').length}
              </div>
              <div className="text-gray-600">Intermediate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {quizzes.reduce((sum, q) => sum + q.points, 0)}
              </div>
              <div className="text-gray-600">Total Points</div>
            </div>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Learning Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Before Taking a Quiz:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Read the description carefully</li>
                <li>• Check the difficulty level</li>
                <li>• Review related materials</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">During the Quiz:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Take your time to think</li>
                <li>• Read questions thoroughly</li>
                <li>• Don't rush through answers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
