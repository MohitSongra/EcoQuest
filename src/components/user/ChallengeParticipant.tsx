import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requirements: string[];
  estimatedTime: number;
  imageUrl?: string;
}

interface ChallengeParticipantProps {
  challenge: Challenge;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChallengeParticipant({ challenge, onClose, onSuccess }: ChallengeParticipantProps) {
  const [step, setStep] = useState<'overview' | 'participate' | 'submit'>('overview');
  const [evidence, setEvidence] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const handleStartChallenge = () => {
    setStep('participate');
  };

  const handleSubmitEvidence = async () => {
    if (!evidence.trim()) {
      alert('Please provide evidence of your participation');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'challengeParticipations'), {
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        evidence,
        status: 'pending',
        submittedAt: new Date(),
        pointsEarned: 0 // Will be updated when approved
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting challenge participation:', error);
      alert('Error submitting participation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (step === 'overview') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h2 className="text-2xl font-bold text-gray-800">{challenge.title}</h2>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                ✕
              </button>
            </div>

            {challenge.imageUrl && (
              <div className="mb-6">
                <img
                  src={challenge.imageUrl}
                  alt={challenge.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600">{challenge.points}</div>
                <div className="text-sm text-blue-700">Points</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">~{challenge.estimatedTime}</div>
                <div className="text-sm text-green-700">Minutes</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <div className="text-lg font-bold text-purple-600">{challenge.category}</div>
                <div className="text-sm text-purple-700">Category</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements:</h3>
              <ul className="space-y-2">
                {challenge.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl mb-6">
              <h4 className="font-medium text-yellow-800 mb-2">📋 How it works:</h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Click "Start Challenge" to begin</li>
                <li>2. Complete the required activities</li>
                <li>3. Submit evidence of your participation</li>
                <li>4. Wait for admin approval to earn points</li>
              </ol>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleStartChallenge}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'participate') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Challenge in Progress</h2>
                <p className="text-gray-600">{challenge.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-green-50 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">🎯 Your Mission:</h3>
              <p className="text-green-700 mb-4">{challenge.description}</p>
              
              <h4 className="font-medium text-green-800 mb-2">Requirements Checklist:</h4>
              <ul className="space-y-2">
                {challenge.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 text-green-600 rounded"
                    />
                    <span className="text-green-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Submit Evidence</h3>
              <p className="text-gray-600 mb-4">
                Describe what you did to complete this challenge. Include details, photos, or any proof of your participation.
              </p>
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={6}
                placeholder="Describe your participation in detail. What did you do? What was the outcome? Include any relevant details that show you completed the challenge requirements."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h4 className="font-medium text-blue-800 mb-2">💡 Tips for good evidence:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific about what you did and when</li>
                <li>• Include measurable results if applicable</li>
                <li>• Mention any photos or documentation you have</li>
                <li>• Explain how your actions align with the challenge goals</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setStep('overview')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitEvidence}
                disabled={isSubmitting || !evidence.trim()}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
