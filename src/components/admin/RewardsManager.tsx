import React, { useState, useEffect } from 'react';
import { rewardsService, rewardRedemptionsService, Reward, RewardRedemption } from '../../services/firestoreService';
import { seedDemoRewards } from '../../utils/seedRewards';

export default function RewardsManager() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rewards' | 'redemptions'>('rewards');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'coupon' as 'coupon' | 'discount' | 'cashback' | 'voucher',
    pointsCost: 0,
    value: 0,
    valueType: 'fixed' as 'fixed' | 'percentage',
    stock: 0,
    status: 'active' as 'active' | 'inactive',
    termsAndConditions: ''
  });

  useEffect(() => {
    const unsubscribeRewards = rewardsService.listenToRewards((rewardsData) => {
      setRewards(rewardsData);
      setLoading(false);
    });

    const unsubscribeRedemptions = rewardRedemptionsService.listenToRedemptions((redemptionsData) => {
      setRedemptions(redemptionsData);
    });

    return () => {
      unsubscribeRewards();
      unsubscribeRedemptions();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReward) {
        await rewardsService.updateReward(editingReward.id, formData);
      } else {
        await rewardsService.createReward(formData);
      }
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving reward:', error);
      alert('Failed to save reward');
    }
  };

  const handleDelete = async (rewardId: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      try {
        await rewardsService.deleteReward(rewardId);
      } catch (error) {
        console.error('Error deleting reward:', error);
        alert('Failed to delete reward');
      }
    }
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      type: reward.type,
      pointsCost: reward.pointsCost,
      value: reward.value,
      valueType: reward.valueType,
      stock: reward.stock,
      status: reward.status,
      termsAndConditions: reward.termsAndConditions || ''
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'coupon',
      pointsCost: 0,
      value: 0,
      valueType: 'fixed',
      stock: 0,
      status: 'active',
      termsAndConditions: ''
    });
    setEditingReward(null);
  };

  const handleRedemptionStatusUpdate = async (redemptionId: string, status: 'pending' | 'approved' | 'used' | 'expired') => {
    try {
      await rewardRedemptionsService.updateRedemptionStatus(redemptionId, status);
    } catch (error) {
      console.error('Error updating redemption:', error);
      alert('Failed to update redemption status');
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

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'rewards'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Rewards ({rewards.length})
          </button>
          <button
            onClick={() => setActiveTab('redemptions')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'redemptions'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Redemptions ({redemptions.length})
          </button>
        </div>
        
        {activeTab === 'rewards' && (
          <div className="flex gap-3">
            {rewards.length === 0 && (
              <button
                onClick={async () => {
                  if (confirm('Seed demo rewards? This will create 6 sample rewards.')) {
                    try {
                      await seedDemoRewards();
                      alert('Demo rewards created successfully!');
                    } catch (error) {
                      alert('Failed to seed rewards');
                    }
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
              >
                🌱 Seed Demo Rewards
              </button>
            )}
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
            >
              + Create Reward
            </button>
          </div>
        )}
      </div>

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{getTypeIcon(reward.type)}</div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(reward.status)}`}>
                  {reward.status.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{reward.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{reward.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Points Cost:</span>
                  <span className="font-bold text-purple-600">{reward.pointsCost} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Value:</span>
                  <span className="font-bold text-green-600">
                    {reward.valueType === 'percentage' ? `${reward.value}%` : `₹${reward.value}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-bold text-blue-600">{reward.stock}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(reward)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reward.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {rewards.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white/50 rounded-xl">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rewards Yet</h3>
              <p className="text-gray-600">Create your first reward to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Redemptions Tab */}
      {activeTab === 'redemptions' && (
        <div className="space-y-4">
          {redemptions.map((redemption) => (
            <div key={redemption.id} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{redemption.rewardTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">User: <span className="font-semibold">{redemption.userEmail}</span></p>
                      <p className="text-gray-600">Points Spent: <span className="font-semibold text-purple-600">{redemption.pointsSpent}</span></p>
                    </div>
                    <div>
                      <p className="text-gray-600">Value: <span className="font-semibold text-green-600">₹{redemption.rewardValue}</span></p>
                      <p className="text-gray-600">Date: <span className="font-semibold">{redemption.redeemedAt.toLocaleDateString()}</span></p>
                    </div>
                  </div>
                  {redemption.couponCode && (
                    <p className="mt-2 text-sm text-gray-600">Code: <span className="font-mono font-bold">{redemption.couponCode}</span></p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full text-center ${
                    redemption.status === 'approved' ? 'bg-green-100 text-green-800' :
                    redemption.status === 'used' ? 'bg-blue-100 text-blue-800' :
                    redemption.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {redemption.status.toUpperCase()}
                  </span>
                  
                  {redemption.status === 'pending' && (
                    <button
                      onClick={() => handleRedemptionStatusUpdate(redemption.id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Approve
                    </button>
                  )}
                  {redemption.status === 'approved' && (
                    <button
                      onClick={() => handleRedemptionStatusUpdate(redemption.id, 'used')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      Mark Used
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {redemptions.length === 0 && (
            <div className="text-center py-12 bg-white/50 rounded-xl">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Redemptions Yet</h3>
              <p className="text-gray-600">Redemptions will appear here when users redeem rewards</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingReward ? 'Edit Reward' : 'Create New Reward'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="coupon">Coupon</option>
                    <option value="discount">Discount</option>
                    <option value="cashback">Cashback</option>
                    <option value="voucher">Voucher</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points Cost *</label>
                  <input
                    type="number"
                    value={formData.pointsCost}
                    onChange={(e) => setFormData({...formData, pointsCost: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value *</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value Type *</label>
                  <select
                    value={formData.valueType}
                    onChange={(e) => setFormData({...formData, valueType: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="fixed">Fixed (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  {editingReward ? 'Update' : 'Create'} Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
