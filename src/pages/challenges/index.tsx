import React, { useState, useEffect } from 'react';

export default function Challenges() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  // Mock challenges data - in real app this would come from Firebase
  const challenges = [
    {
      id: 1,
      title: 'Phone Recycling Mission',
      description: 'Collect and recycle 5 old mobile phones from your community. Learn about the environmental impact of mobile devices and proper disposal methods.',
      difficulty: 'Easy',
      points: 150,
      duration: '7 days',
      participants: 45,
      category: 'electronics',
      status: 'available',
      tags: ['mobile', 'community', 'beginner'],
      image: '📱',
      featured: true
    },
    {
      id: 2,
      title: 'Laptop Collection Drive',
      description: 'Organize a laptop collection event in your neighborhood. Coordinate with local businesses and schools to maximize impact.',
      difficulty: 'Medium',
      points: 300,
      duration: '14 days',
      participants: 23,
      category: 'electronics',
      status: 'available',
      tags: ['laptop', 'organization', 'intermediate'],
      image: '💻',
      featured: false
    },
    {
      id: 3,
      title: 'Battery Recycling Challenge',
      description: 'Collect 100 used batteries and dispose them properly. Educate others about the dangers of improper battery disposal.',
      difficulty: 'Easy',
      points: 100,
      duration: '5 days',
      participants: 67,
      category: 'batteries',
      status: 'available',
      tags: ['batteries', 'education', 'beginner'],
      image: '🔋',
      featured: false
    },
    {
      id: 4,
      title: 'E-Waste Awareness Campaign',
      description: 'Create and share educational content about e-waste recycling. Use social media to spread awareness and inspire action.',
      difficulty: 'Hard',
      points: 500,
      duration: '30 days',
      participants: 12,
      category: 'education',
      status: 'available',
      tags: ['awareness', 'social media', 'advanced'],
      image: '📚',
      featured: true
    },
    {
      id: 5,
      title: 'Cable Organization Project',
      description: 'Sort and organize old cables, donate usable ones, and properly recycle damaged ones. Reduce cable waste in your home.',
      difficulty: 'Easy',
      points: 75,
      duration: '3 days',
      participants: 89,
      category: 'accessories',
      status: 'available',
      tags: ['cables', 'organization', 'beginner'],
      image: '🔌',
      featured: false
    },
    {
      id: 6,
      title: 'Solar Panel Recycling Initiative',
      description: 'Research and implement solar panel recycling in your community. Work with local solar companies and recycling facilities.',
      difficulty: 'Hard',
      points: 750,
      duration: '45 days',
      participants: 8,
      category: 'electronics',
      status: 'available',
      tags: ['solar', 'research', 'expert'],
      image: '☀️',
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚', color: 'from-gray-500 to-gray-600' },
    { id: 'electronics', name: 'Electronics', icon: '📱', color: 'from-blue-500 to-blue-600' },
    { id: 'batteries', name: 'Batteries', icon: '🔋', color: 'from-yellow-500 to-yellow-600' },
    { id: 'education', name: 'Education', icon: '🎓', color: 'from-green-500 to-green-600' },
    { id: 'accessories', name: 'Accessories', icon: '🔌', color: 'from-purple-500 to-purple-600' }
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular', icon: '🔥' },
    { id: 'newest', label: 'Newest', icon: '🆕' },
    { id: 'points', label: 'Highest Points', icon: '🏆' },
    { id: 'difficulty', label: 'Difficulty', icon: '📈' }
  ];

  const filteredChallenges = challenges
    .filter(challenge => {
      const matchesFilter = filter === 'all' || challenge.category === filter;
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular': return b.participants - a.participants;
        case 'newest': return b.id - a.id;
        case 'points': return b.points - a.points;
        case 'difficulty': return getDifficultyWeight(b.difficulty) - getDifficultyWeight(a.difficulty);
        default: return 0;
      }
    });

  const getDifficultyWeight = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 1;
      case 'Medium': return 2;
      case 'Hard': return 3;
      default: return 1;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '📚';
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Recycling Challenges
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Take on exciting missions to recycle e-waste and earn points. 
          Choose challenges that match your skills and interests!
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xl">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search challenges, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg"
            />
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`group flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filter === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">▼</span>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-white text-green-600 shadow-md' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  ⏹️
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-white text-green-600 shadow-md' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              {/* Featured Badge */}
              {challenge.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ Featured
                  </span>
                </div>
              )}
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {challenge.image}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  {challenge.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {challenge.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {challenge.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-500">Points</p>
                    <p className="font-semibold text-green-600 text-lg">{challenge.points}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-800">{challenge.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="font-semibold text-blue-600">{challenge.participants}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-semibold text-gray-800 capitalize">{challenge.category}</p>
                  </div>
                </div>
                
                {/* Action Button */}
                <button className="w-full group/btn relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="relative z-10">Join Challenge</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {challenge.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      {challenge.featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="text-green-600 font-semibold">🏆 {challenge.points} points</span>
                      <span className="text-gray-600">⏱️ {challenge.duration}</span>
                      <span className="text-blue-600">👥 {challenge.participants} participants</span>
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
                      Join Challenge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6 animate-bounce">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No challenges found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button 
            onClick={() => { setSearchTerm(''); setFilter('all'); }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Challenge Stats */}
      <div className="bg-gradient-to-r from-green-500 via-green-400 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">{challenges.length}</div>
              <p className="text-green-100 text-lg">Active Challenges</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{challenges.reduce((sum, c) => sum + c.points, 0).toLocaleString()}</div>
              <p className="text-green-100 text-lg">Total Points Available</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">{challenges.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}</div>
              <p className="text-green-100 text-lg">Active Participants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
