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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

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
      showMessage('success', 'Challenge created successfully!');
    } catch (error) {
      console.error('Error creating challenge:', error);
      showMessage('error', 'Error creating challenge. Please try again.');
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
      showMessage('success', 'Challenge updated successfully!');
    } catch (error) {
      console.error('Error updating challenge:', error);
      showMessage('error', 'Error updating challenge. Please try again.');
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;
    
    try {
      await deleteDoc(doc(db, 'challenges', challengeId));
      onChallengesUpdate();
      showMessage('success', 'Challenge deleted.');
    } catch (error) {
      console.error('Error deleting challenge:', error);
      showMessage('error', 'Error deleting challenge. Please try again.');
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
      {/* Inline Message */}
      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          message.type === 'success'
            ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88]'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">Challenge Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          + Create New Challenge
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-xl font-bold text-neutral-200 mb-6 font-[family-name:var(--font-clash-display)]">
            {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="label-primary">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-primary"
                placeholder="Enter challenge title"
              />
            </div>
            
            <div>
              <label className="label-primary">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="select-primary"
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
              <label className="label-primary">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="input-primary"
                min="10"
                max="2000"
              />
            </div>
            
            <div>
              <label className="label-primary">Estimated Time (minutes)</label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
                className="input-primary"
                min="5"
                max="300"
              />
            </div>
            
            <div>
              <label className="label-primary">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                className="select-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="label-primary">Image URL (Optional)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="input-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="label-primary">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="textarea-primary"
              rows={4}
              placeholder="Describe the challenge and what participants need to do"
            />
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="label-primary">Requirements</label>
              <button
                type="button"
                onClick={addRequirement}
                className="text-[#00ff88] hover:text-[#4ade80] text-sm font-medium transition-colors"
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
                    className="input-primary flex-1"
                    placeholder={`Requirement ${index + 1}`}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-400 hover:text-red-300 p-1 transition-colors"
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
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={editingChallenge ? handleUpdateChallenge : handleCreateChallenge}
              disabled={!formData.title || !formData.category || !formData.description}
              className="btn btn-primary"
            >
              {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
            </button>
          </div>
        </div>
      )}

      {/* Challenges List */}
      <div className="card">
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border border-[rgba(0,255,136,0.1)] rounded-xl p-4 hover:bg-[rgba(0,255,136,0.03)] transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-200">{challenge.title}</h3>
                    <span className={`badge ${
                      challenge.status === 'active' ? 'badge-success' :
                      challenge.status === 'pending' ? 'badge-warning' :
                      'badge-info'
                    }`}>
                      {challenge.status}
                    </span>
                    <span className={`badge ${
                      challenge.difficulty === 'easy' ? 'badge-success' :
                      challenge.difficulty === 'medium' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-neutral-400 mb-3">{challenge.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-2">
                    <span>🏷️ {challenge.category}</span>
                    <span>🏆 {challenge.points} points</span>
                    <span>⏱️ ~{challenge.estimatedTime} min</span>
                  </div>
                  {challenge.requirements && challenge.requirements.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-neutral-400 mb-1">Requirements:</p>
                      <ul className="text-sm text-neutral-500 space-y-1">
                        {challenge.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#00ff88] mr-2">•</span>
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
                    className="select-primary text-sm !py-1 !px-2"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    onClick={() => startEdit(challenge)}
                    className="text-[#00ffff] hover:text-[#67e8f9] p-1 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteChallenge(challenge.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {challenges.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl font-semibold text-neutral-300 mb-2">No Challenges Yet</p>
              <p className="text-neutral-500">Create your first challenge!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
