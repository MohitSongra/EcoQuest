import React, { useState } from 'react';
import { dataSeedingService } from '../services/firestoreService';

export default function SampleDataSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string>('');

  const seedSampleData = async () => {
    setIsSeeding(true);
    setSeedStatus('Seeding sample data...');

    try {
      setSeedStatus('Adding sample quizzes and challenges...');
      await dataSeedingService.seedSampleData();
      
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
    <div className="card !bg-[rgba(0,255,136,0.05)] !border-[rgba(0,255,136,0.2)]">
      <h4 className="font-medium text-[#00ff88] mb-2 font-[family-name:var(--font-clash-display)]">🚀 Quick Start</h4>
      <p className="text-sm text-neutral-400 mb-3">
        Get started quickly by adding sample quizzes and challenges to test the system.
      </p>
      <button
        onClick={seedSampleData}
        disabled={isSeeding}
        className="btn btn-primary"
      >
        {isSeeding ? 'Adding Sample Data...' : 'Add Sample Data'}
      </button>
      {seedStatus && (
        <p className="mt-2 text-sm text-[#00ff88]">{seedStatus}</p>
      )}
    </div>
  );
}
