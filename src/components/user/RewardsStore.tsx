import React, { useState, useEffect } from 'react';
import { rewardsService, rewardRedemptionsService, Reward, usersService } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

export default function RewardsStore() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState(false);
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
      alert('Insufficient points!');
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

      alert(`Reward redeemed successfully! Your coupon code: ${couponCode}`);
      setSelectedReward(null);
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward. Please try again.');
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Points Display */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-2">Your Available Points</p>
            <p className="text-5xl font-bold">{userPoints}</p>
          </div>
          <div className="text-7xl opacity-80">💎</div>
        </div>
        <p className="text-purple-100 text-sm mt-4">
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
              className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${
                affordable ? 'border-transparent hover:border-emerald-400' : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{getTypeIcon(reward.type)}</div>
                <div className="text-right">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800 uppercase">
                    {reward.type}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">Stock: {reward.stock}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{reward.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{reward.description}</p>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Reward Value</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {reward.valueType === 'percentage' ? `${reward.value}% OFF` : `₹${reward.value}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points Cost</span>
                  <span className="text-xl font-bold text-purple-600">{reward.pointsCost} pts</span>
                </div>
              </div>

              {reward.termsAndConditions && (
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  T&C: {reward.termsAndConditions}
                </p>
              )}

              <button
                onClick={() => setSelectedReward(reward)}
                disabled={!affordable}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  affordable
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {affordable ? 'Redeem Now' : 'Insufficient Points'}
              </button>
            </div>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-3xl">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rewards Available</h3>
          <p className="text-gray-600">Check back later for exciting rewards!</p>
        </div>
      )}

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{getTypeIcon(selectedReward.type)}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Redemption</h2>
              <p className="text-gray-600">Are you sure you want to redeem this reward?</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">{selectedReward.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reward Value:</span>
                  <span className="font-bold text-emerald-600">
                    {selectedReward.valueType === 'percentage' ? `${selectedReward.value}%` : `₹${selectedReward.value}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points Cost:</span>
                  <span className="font-bold text-purple-600">{selectedReward.pointsCost} pts</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-purple-200">
                  <span className="text-gray-600">Your Points After:</span>
                  <span className="font-bold text-blue-600">{userPoints - selectedReward.pointsCost} pts</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedReward(null)}
                disabled={redeeming}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
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
