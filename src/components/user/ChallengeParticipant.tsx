import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { challengesService, challengeParticipationsService } from '../../services/firestoreService';

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

export function ChallengeParticipant({ onClose }: { onClose: () => void }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [participationData, setParticipationData] = useState({
    description: '',
    evidence: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = challengesService.listenToChallenges((challengesData) => {
      const activeChallenges = challengesData.filter(challenge => challenge.status === 'active');
      setChallenges(activeChallenges);
    });

    return unsubscribe;
  }, []);

  const handleParticipate = async () => {
    if (!selectedChallenge || !currentUser) return;

    setIsSubmitting(true);
    setSubmitStatus('Submitting participation...');

    try {
      await challengeParticipationsService.createParticipation({
        challengeId: selectedChallenge.id,
        userId: currentUser.uid,
        userEmail: currentUser.email!,
        description: participationData.description,
        evidence: participationData.evidence,
        location: participationData.location,
        status: 'pending',
        points: selectedChallenge.points
      });

      setSubmitStatus('Challenge participation submitted successfully! 🎉');
      setTimeout(() => {
        setSelectedChallenge(null);
        setParticipationData({ description: '', evidence: '', location: '' });
        setSubmitStatus('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting participation:', error);
      setSubmitStatus('Error submitting participation. Please try again.');
    } finally {
      setIsSubmitting(false);
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

          {submitStatus && (
            <div className={`mb-4 p-3 rounded-lg ${
              submitStatus.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {submitStatus}
            </div>
          )}

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
                required
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
                required
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleParticipate}
              disabled={!participationData.description || !participationData.location || isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Participation'}
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
