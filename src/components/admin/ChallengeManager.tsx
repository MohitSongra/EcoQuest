import React, { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'pending' | 'inactive';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  estimatedTime: number; // in minutes
  creator: string;
  createdAt: Date;
  imageUrl?: string;
}

interface ChallengeManagerProps {
  challenges: Challenge[];
  onChallengesUpdate: () => void;
}

export default function ChallengeManager({ challenges, onChallengesUpdate }: ChallengeManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    points: 100,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    requirements: [''],
    estimatedTime: 30,
    imageUrl: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      points: 100,
      difficulty: 'medium',
      requirements: [''],
      estimatedTime: 30,
      imageUrl: ''
    });
    setEditingChallenge(null);
    setShowCreateForm(false);
  };

  const handleCreateChallenge = async () => {
    try {
      const challengeData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        status: 'active' as const,
        creator: 'Admin',
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'challenges'), challengeData);
      onChallengesUpdate();
      resetForm();
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Error creating challenge. Please try again.');
    }
  };

  const handleUpdateChallenge = async () => {
    if (!editingChallenge) return;
    
    try {
      const updateData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== '')
      };
      await updateDoc(doc(db, 'challenges', editingChallenge.id), updateData);
      onChallengesUpdate();
      resetForm();
    } catch (error) {
      console.error('Error updating challenge:', error);
      alert('Error updating challenge. Please try again.');
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    
    try {
      await deleteDoc(doc(db, 'challenges', challengeId));
      onChallengesUpdate();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      alert('Error deleting challenge. Please try again.');
    }
  };

  const handleStatusChange = async (challengeId: string, status: 'active' | 'pending' | 'inactive') => {
    try {
      await updateDoc(doc(db, 'challenges', challengeId), { status });
      onChallengesUpdate();
    } catch (error) {
      console.error('Error updating challenge status:', error);
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const startEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      points: challenge.points,
      difficulty: challenge.difficulty,
      requirements: challenge.requirements.length > 0 ? challenge.requirements : [''],
      estimatedTime: challenge.estimatedTime,
      imageUrl: challenge.imageUrl || ''
    });
    setShowCreateForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Challenge Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          + Create New Challenge
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter challenge title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Collection">Collection</option>
                <option value="Recycling">Recycling</option>
                <option value="Education">Education</option>
                <option value="Community">Community</option>
                <option value="Innovation">Innovation</option>
                <option value="Awareness">Awareness</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="10"
                max="2000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time (minutes)</label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="5"
                max="300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Describe the challenge and what participants need to do"
            />
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Requirements</label>
              <button
                type="button"
                onClick={addRequirement}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                + Add Requirement
              </button>
            </div>
            <div className="space-y-3">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Requirement ${index + 1}`}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingChallenge ? handleUpdateChallenge : handleCreateChallenge}
              disabled={!formData.title || !formData.category || !formData.description}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
            </button>
          </div>
        </div>
      )}

      {/* Challenges List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      challenge.status === 'active' ? 'bg-green-100 text-green-800' :
                      challenge.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {challenge.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>🏷️ {challenge.category}</span>
                    <span>🏆 {challenge.points} points</span>
                    <span>⏱️ ~{challenge.estimatedTime} min</span>
                  </div>
                  {challenge.requirements && challenge.requirements.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Requirements:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {challenge.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={challenge.status}
                    onChange={(e) => handleStatusChange(challenge.id, e.target.value as 'active' | 'pending' | 'inactive')}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => startEdit(challenge)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteChallenge(challenge.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {challenges.length === 0 && (
            <p className="text-gray-500 text-center py-8">No challenges found. Create your first challenge!</p>
          )}
        </div>
      </div>
    </div>
  );
}
