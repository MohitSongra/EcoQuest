import React, { useState } from 'react';

export default function Quizzes() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock quizzes data - in real app this would come from Firebase
  const quizzes = [
    {
      id: 1,
      title: 'E-Waste Basics',
      description: 'Test your knowledge about electronic waste and its environmental impact',
      questions: 10,
      timeLimit: '15 min',
      difficulty: 'Beginner',
      points: 100,
      category: 'basics',
      completed: false,
      bestScore: null
    },
    {
      id: 2,
      title: 'Recycling Methods',
      description: 'Learn about different methods of recycling electronic devices',
      questions: 15,
      timeLimit: '20 min',
      difficulty: 'Intermediate',
      points: 150,
      category: 'methods',
      completed: true,
      bestScore: 85
    },
    {
      id: 3,
      title: 'Environmental Impact',
      description: 'Understand the environmental consequences of improper e-waste disposal',
      questions: 12,
      timeLimit: '18 min',
      difficulty: 'Advanced',
      points: 200,
      category: 'environment',
      completed: false,
      bestScore: null
    },
    {
      id: 4,
      title: 'Sustainable Tech',
      description: 'Explore sustainable technology practices and green alternatives',
      questions: 8,
      timeLimit: '12 min',
      difficulty: 'Beginner',
      points: 75,
      category: 'sustainability',
      completed: true,
      bestScore: 92
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'basics', name: 'Basics', icon: '🔰' },
    { id: 'methods', name: 'Methods', icon: '♻' },
    { id: 'environment', name: 'Environment', icon: '🌍' },
    { id: 'sustainability', name: 'Sustainability', icon: '🌱' }
  ];

  const filteredQuizzes = selectedCategory === 'all' 
    ? quizzes 
    : quizzes.filter(quiz => quiz.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '📚';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Knowledge Quizzes</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Test your knowledge about e-waste recycling and earn bonus points. 
          Challenge yourself with quizzes of varying difficulty levels!
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{getCategoryIcon(quiz.category)}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-500">Questions</p>
                  <p className="font-semibold text-blue-600">{quiz.questions}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time Limit</p>
                  <p className="font-semibold text-gray-800">{quiz.timeLimit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Points</p>
                  <p className="font-semibold text-green-600">{quiz.points}</p>
                </div>
                <div>
                  <p className="text-gray-500">Best Score</p>
                  <p className="font-semibold text-purple-600">
                    {quiz.bestScore ? `${quiz.bestScore}%` : 'Not taken'}
                  </p>
                </div>
              </div>
              
              {quiz.completed && quiz.bestScore && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Completed!</span> Best score: {quiz.bestScore}%
                  </p>
                </div>
              )}
              
              <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                quiz.completed
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                {quiz.completed ? 'Completed' : 'Start Quiz'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No quizzes found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}

      {/* Quiz Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">{quizzes.length}</div>
            <p className="text-blue-100">Total Quizzes</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">{quizzes.filter(q => q.completed).length}</div>
            <p className="text-blue-100">Completed</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">{quizzes.reduce((sum, q) => sum + q.points, 0)}</div>
            <p className="text-blue-100">Total Points</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">
              {Math.round(quizzes.filter(q => q.completed && q.bestScore).reduce((sum, q) => sum + (q.bestScore || 0), 0) / Math.max(quizzes.filter(q => q.completed).length, 1))}%
            </div>
            <p className="text-blue-100">Average Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
