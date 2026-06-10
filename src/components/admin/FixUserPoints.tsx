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
  const [success, setSuccess] = useState('');

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-red-400 mb-2 font-[family-name:var(--font-clash-display)]">Access Denied</h3>
        <p className="text-red-400/80">You don't have permission to access this admin tool.</p>
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
    setSuccess('');

    try {
      // Verify user exists before updating points
      const users = await usersService.getAllUsers();
      const targetUser = users.find(u => u.id === userId.trim());
      
      if (!targetUser) {
        setError('User not found. Please verify the user ID.');
        return;
      }

      await usersService.updateUserPoints(userId.trim(), points);
      
      setSuccess(`Successfully updated ${targetUser.email}'s points to ${points}`);
      setUserId('');
      setPoints(0);
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error updating points:', error);
      setError('Failed to update points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-neutral-200 mb-4 font-[family-name:var(--font-clash-display)]">Fix User Points (Admin Tool)</h3>
      <div className="space-y-4">
        <div>
          <label className="label-primary">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input-primary"
            placeholder="Enter user ID"
          />
        </div>
        <div>
          <label className="label-primary">Points</label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="input-primary"
            placeholder="Enter points amount"
          />
        </div>
        <button
          onClick={handleFixPoints}
          disabled={loading || !userId.trim() || !ValidationService.isValidPoints(points)}
          className="w-full btn btn-primary"
        >
          {loading ? 'Updating...' : 'Update User Points'}
        </button>
        
        {success && (
          <div className="bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] rounded-lg p-3">
            <p className="text-[#00ff88] text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
