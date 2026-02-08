import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../services/firestoreService';
import { ValidationService } from '../../services/validationService';

export default function FixUserPoints() {
  const { isAdmin } = useAuth();
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">You don't have permission to access this admin tool.</p>
      </div>
    );
  }

  const handleFixPoints = async () => {
    if (!userId.trim()) {
      setError('Please enter a valid user ID');
      return;
    }

    if (!ValidationService.isValidPoints(points)) {
      setError('Please enter a valid points amount (non-negative integer)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify user exists before updating points
      const users = await usersService.getAllUsers();
      const targetUser = users.find(u => u.id === userId.trim());
      
      if (!targetUser) {
        setError('User not found. Please verify the user ID.');
        return;
      }

      await usersService.updateUserPoints(userId.trim(), points);
      
      alert(`Successfully updated ${targetUser.email}'s points to ${points}`);
      setUserId('');
      setPoints(0);
    } catch (error) {
      console.error('Error updating points:', error);
      setError('Failed to update points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Fix User Points (Admin Tool)</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter user ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter points amount"
          />
        </div>
        <button
          onClick={handleFixPoints}
          disabled={loading || !userId.trim() || !ValidationService.isValidPoints(points)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Updating...' : 'Update User Points'}
        </button>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
