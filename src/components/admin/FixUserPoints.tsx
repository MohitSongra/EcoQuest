import React, { useState } from 'react';

export default function FixUserPoints() {
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFixPoints = async () => {
    if (!userId || points === 0) {
      alert('Please enter user ID and points amount');
      return;
    }

    setLoading(true);
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../../services/firebase');
      
      const userRef = doc(db, 'userRoles', userId);
      await setDoc(userRef, { points: points }, { merge: true });
      
      alert(`Successfully set user points to ${points}`);
      setUserId('');
      setPoints(0);
    } catch (error) {
      console.error('Error updating points:', error);
      alert('Failed to update points');
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
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Set User Points'}
        </button>
      </div>
    </div>
  );
}
