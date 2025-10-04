import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { challengesService } from '../../services/firestoreService';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  requirements: string[];
}

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'electronics', 'batteries', 'appliances', 'computers', 'mobile'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  useEffect(() => {
    const unsubscribe = challengesService.listenToChallenges((challengesData) => {
      const activeChallenges = challengesData.filter(challenge => challenge.status === 'active');
      setChallenges(activeChallenges);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, selectedCategory, selectedDifficulty]);

  const filterChallenges = () => {
    let filtered = challenges;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    setFilteredChallenges(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mobile': return '📱';
      case 'computers': return '💻';
      case 'batteries': return '🔋';
      case 'appliances': return '🔌';
      case 'electronics': return '📺';
      default: return '♻';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="customer">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Recycling Challenges 🎯</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take on exciting challenges to recycle e-waste and earn points. Each challenge helps protect our environment!
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Challenges</h2>
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

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">{challenge.title}</h3>
              <p className="text-gray-600 mb-4">{challenge.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Points:</span>
                  <span className="font-semibold text-green-600">{challenge.points} pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-semibold text-blue-600">{challenge.estimatedTime}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
                Start Challenge
              </button>
            </div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No challenges found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new challenges.</p>
          </div>
        )}

        {/* Challenge Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Challenge Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{challenges.length}</div>
              <div className="text-gray-600">Total Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {challenges.filter(c => c.difficulty === 'easy').length}
              </div>
              <div className="text-gray-600">Easy Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {challenges.reduce((sum, c) => sum + c.points, 0)}
              </div>
              <div className="text-gray-600">Total Points Available</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
