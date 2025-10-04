import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import RewardsStore from '../../components/user/RewardsStore';

export default function RewardsPage() {
  return (
    <ProtectedRoute requiredRole="customer">
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center">
              <span className="text-4xl mr-3">🎁</span>
              Rewards Store
            </h1>
            <RewardsStore />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
