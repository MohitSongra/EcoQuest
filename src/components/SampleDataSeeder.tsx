import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { sampleQuizzes, sampleChallenges } from '../utils/sampleData';

export default function SampleDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string>('');

  const seedSampleData = async () => {
    setIsSeeding(true);
    setSeedStatus('Seeding sample data...');

    try {
      // Seed sample quizzes
      setSeedStatus('Adding sample quizzes...');
      for (const quiz of sampleQuizzes) {
        await addDoc(collection(db, 'quizzes'), {
          ...quiz,
          createdAt: new Date()
        });
      }

      // Seed sample challenges
      setSeedStatus('Adding sample challenges...');
      for (const challenge of sampleChallenges) {
        await addDoc(collection(db, 'challenges'), {
          ...challenge,
          createdAt: new Date()
        });
      }

      setSeedStatus('Sample data seeded successfully! 🎉');
      setTimeout(() => setSeedStatus(''), 3000);
    } catch (error) {
      console.error('Error seeding data:', error);
      setSeedStatus('Error seeding data. Please try again.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-2">🚀 Quick Start</h4>
      <p className="text-sm text-blue-700 mb-3">
        Get started quickly by adding sample quizzes and challenges to test the system.
      </p>
      <button
        onClick={seedSampleData}
        disabled={isSeeding}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {isSeeding ? 'Adding Sample Data...' : 'Add Sample Data'}
      </button>
      {seedStatus && (
        <p className="mt-2 text-sm text-blue-700">{seedStatus}</p>
      )}
    </div>
  );
}
