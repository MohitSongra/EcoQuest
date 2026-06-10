import React, { useState, useEffect, useCallback } from 'react';
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
  creator?: string;
  createdAt?: Date;
  imageUrl?: string;
}

interface ChallengeParticipantProps {
  challenge?: Challenge;
  onClose: () => void;
}

export function ChallengeParticipant({ challenge, onClose }: ChallengeParticipantProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(challenge || null);
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

  // Escape key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selectedChallenge) {
        setSelectedChallenge(null);
      } else {
        onClose();
      }
    }
  }, [selectedChallenge, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal-content p-8 max-w-2xl w-full mx-4 font-[family-name:var(--font-satoshi)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">Participate in Challenge</h2>
            <button
              onClick={() => setSelectedChallenge(null)}
              className="text-neutral-500 hover:text-[#00ff88] text-2xl transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neutral-200 mb-2 font-[family-name:var(--font-clash-display)]">{selectedChallenge.title}</h3>
            <p className="text-neutral-400 mb-4">{selectedChallenge.description}</p>
            
            <div className="bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.15)] rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-[#00ffff] mb-2">Requirements:</h4>
              <ul className="list-disc list-inside text-neutral-300 space-y-1">
                {selectedChallenge.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {submitStatus && (
            <div className={`mb-4 p-3 rounded-xl ${
              submitStatus.includes('Error') 
                ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                : 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[rgba(0,255,136,0.3)]'
            }`}>
              {submitStatus}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="label-primary">
                Description of your participation
              </label>
              <textarea
                value={participationData.description}
                onChange={(e) => setParticipationData({...participationData, description: e.target.value})}
                className="textarea-primary"
                rows={4}
                placeholder="Describe how you completed this challenge..."
                required
              />
            </div>

            <div>
              <label className="label-primary">
                Evidence/Proof (URL or description)
              </label>
              <input
                type="text"
                value={participationData.evidence}
                onChange={(e) => setParticipationData({...participationData, evidence: e.target.value})}
                className="input-primary"
                placeholder="Photo URL, document link, or description of evidence..."
              />
            </div>

            <div>
              <label className="label-primary">
                Location
              </label>
              <input
                type="text"
                value={participationData.location}
                onChange={(e) => setParticipationData({...participationData, location: e.target.value})}
                className="input-primary"
                placeholder="Where did you complete this challenge?"
                required
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleParticipate}
              disabled={!participationData.description || !participationData.location || isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Participation'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content p-8 max-w-4xl w-full mx-4 font-[family-name:var(--font-satoshi)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">Available Challenges</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-[#00ff88] text-2xl transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="card hover:border-[rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-neutral-200 font-[family-name:var(--font-clash-display)]">{challenge.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  challenge.difficulty === 'easy' ? 'bg-[rgba(0,255,136,0.2)] text-[#00ff88] border border-[rgba(0,255,136,0.3)]' :
                  challenge.difficulty === 'medium' ? 'bg-[rgba(255,170,0,0.2)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]' :
                  'bg-[rgba(255,60,60,0.2)] text-[#ff3c3c] border border-[rgba(255,60,60,0.3)]'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <p className="text-neutral-400 mb-4">{challenge.description}</p>
              
              <div className="flex justify-between items-center text-sm text-neutral-500 mb-4">
                <span>⏱️ {challenge.estimatedTime} min</span>
                <span className="text-[#00ff88]">🏆 {challenge.points} points</span>
              </div>
              
              <button
                onClick={() => setSelectedChallenge(challenge)}
                className="btn btn-primary w-full"
              >
                Participate
              </button>
            </div>
          ))}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-neutral-300 mb-2 font-[family-name:var(--font-clash-display)]">No Challenges Available</h3>
            <p className="text-neutral-500">Check back later for new challenges!</p>
          </div>
        )}
      </div>
    </div>
  );
}
