import React, { useState, useEffect, useCallback } from 'react';
import { rewardsService, rewardRedemptionsService, Reward, usersService } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

export default function RewardsStore() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribeRewards = rewardsService.listenToRewards((rewardsData) => {
      const activeRewards = rewardsData.filter(r => r.status === 'active' && r.stock > 0);
      setRewards(activeRewards);
      setLoading(false);
    });

    // Fetch user points
    if (currentUser) {
      fetchUserPoints();
    }

    return unsubscribeRewards;
  }, [currentUser]);

  // Escape key handler for modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedReward) {
      setSelectedReward(null);
    }
  }, [selectedReward]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const fetchUserPoints = async () => {
    if (!currentUser) return;
    try {
      // Fetch user's own role document which includes points
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../../services/firebase');
      const userDoc = await getDoc(doc(db, 'userRoles', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserPoints(userData.points || 0);
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const handleRedeem = async () => {
    if (!selectedReward || !currentUser) return;

    if (userPoints < selectedReward.pointsCost) {
      setMessage({ type: 'error', text: 'Insufficient points!' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setRedeeming(true);
    try {
      // Generate coupon code
      const couponCode = `ECO${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      // Create redemption
      await rewardRedemptionsService.createRedemption({
        rewardId: selectedReward.id,
        rewardTitle: selectedReward.title,
        userId: currentUser.uid,
        userEmail: currentUser.email!,
        pointsSpent: selectedReward.pointsCost,
        rewardValue: selectedReward.value,
        couponCode: couponCode,
        status: 'pending'
      });

      // Update user points
      const newPoints = userPoints - selectedReward.pointsCost;
      await usersService.updateUserPoints(currentUser.uid, newPoints);
      setUserPoints(newPoints);

      // Update reward stock
      await rewardsService.updateReward(selectedReward.id, {
        stock: selectedReward.stock - 1
      });

      setMessage({ type: 'success', text: `Reward redeemed successfully! Your coupon code: ${couponCode}` });
      setSelectedReward(null);
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Error redeeming reward:', error);
      setMessage({ type: 'error', text: 'Failed to redeem reward. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setRedeeming(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coupon': return '🎟️';
      case 'discount': return '💰';
      case 'cashback': return '💸';
      case 'voucher': return '🎁';
      default: return '🎫';
    }
  };

  const canAfford = (pointsCost: number) => userPoints >= pointsCost;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner-neon"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-[family-name:var(--font-satoshi)]">
      {/* Inline message */}
      {message && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success'
            ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border-[rgba(0,255,136,0.3)]'
            : 'bg-red-500/10 text-red-400 border-red-500/30'
        }`}>
          {message.text}
        </div>
      )}

      {/* User Points Display */}
      <div className="bg-black/80 backdrop-blur-xl border border-[rgba(0,255,136,0.2)] rounded-3xl shadow-[0_0_30px_rgba(0,255,136,0.15)] p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-400 text-sm font-medium mb-2">Your Available Points</p>
            <p className="text-5xl font-bold text-[#00ff88] font-[family-name:var(--font-clash-display)] drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">{userPoints}</p>
          </div>
          <div className="text-7xl opacity-80">💎</div>
        </div>
        <p className="text-neutral-500 text-sm mt-4">
          Redeem your points for amazing rewards and discounts!
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const affordable = canAfford(reward.pointsCost);
          
          return (
            <div
              key={reward.id}
              className={`group bg-black/80 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 ${
                affordable ? 'border-[rgba(0,255,136,0.15)] hover:border-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]' : 'border-[rgba(0,255,136,0.1)] opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{getTypeIcon(reward.type)}</div>
                <div className="text-right">
                  <span className="badge badge-purple uppercase">
                    {reward.type}
                  </span>
                  <p className="text-xs text-neutral-500 mt-2">Stock: {reward.stock}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-neutral-200 mb-2 font-[family-name:var(--font-clash-display)]">{reward.title}</h3>
              <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{reward.description}</p>

              <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Reward Value</span>
                  <span className="text-2xl font-bold text-[#00ff88]">
                    {reward.valueType === 'percentage' ? `${reward.value}% OFF` : `₹${reward.value}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Points Cost</span>
                  <span className="text-xl font-bold text-[#ff00ff]">{reward.pointsCost} pts</span>
                </div>
              </div>

              {reward.termsAndConditions && (
                <p className="text-xs text-neutral-500 mb-4 line-clamp-2">
                  T&C: {reward.termsAndConditions}
                </p>
              )}

              <button
                onClick={() => setSelectedReward(reward)}
                disabled={!affordable}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  affordable
                    ? 'btn btn-primary w-full'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-[rgba(0,255,136,0.1)]'
                }`}
              >
                {affordable ? 'Redeem Now' : 'Insufficient Points'}
              </button>
            </div>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-12 card">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold text-neutral-300 mb-2 font-[family-name:var(--font-clash-display)]">No Rewards Available</h3>
          <p className="text-neutral-500">Check back later for exciting rewards!</p>
        </div>
      )}

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{getTypeIcon(selectedReward.type)}</div>
              <h2 className="text-2xl font-bold text-neutral-200 mb-2 font-[family-name:var(--font-clash-display)]">Confirm Redemption</h2>
              <p className="text-neutral-400">Are you sure you want to redeem this reward?</p>
            </div>

            <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.15)] rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-neutral-200 mb-4">{selectedReward.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Reward Value:</span>
                  <span className="font-bold text-[#00ff88]">
                    {selectedReward.valueType === 'percentage' ? `${selectedReward.value}%` : `₹${selectedReward.value}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Points Cost:</span>
                  <span className="font-bold text-[#ff00ff]">{selectedReward.pointsCost} pts</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[rgba(0,255,136,0.15)]">
                  <span className="text-neutral-400">Your Points After:</span>
                  <span className="font-bold text-[#00ffff]">{userPoints - selectedReward.pointsCost} pts</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedReward(null)}
                disabled={redeeming}
                aria-label="Close"
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="btn btn-primary flex-1"
              >
                {redeeming ? 'Redeeming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
