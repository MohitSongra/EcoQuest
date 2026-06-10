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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

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
        showMsg('success', 'Reward updated successfully!');
      } else {
        await rewardsService.createReward(formData);
        showMsg('success', 'Reward created successfully!');
      }
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving reward:', error);
      showMsg('error', 'Failed to save reward');
    }
  };

  const handleDelete = async (rewardId: string) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      try {
        await rewardsService.deleteReward(rewardId);
        showMsg('success', 'Reward deleted.');
      } catch (error) {
        console.error('Error deleting reward:', error);
        showMsg('error', 'Failed to delete reward');
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
      showMsg('error', 'Failed to update redemption status');
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
    return status === 'active' ? 'badge-success' : 'badge-info';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner-neon mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inline Message */}
      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          message.type === 'success'
            ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] text-[#00ff88]'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'rewards'
                ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                : 'text-neutral-400 border border-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.05)]'
            }`}
          >
            Rewards ({rewards.length})
          </button>
          <button
            onClick={() => setActiveTab('redemptions')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'redemptions'
                ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                : 'text-neutral-400 border border-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.05)]'
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
                  if (window.confirm('Seed demo rewards? This will create 6 sample rewards.')) {
                    try {
                      await seedDemoRewards();
                      showMsg('success', 'Demo rewards created successfully!');
                    } catch (error) {
                      showMsg('error', 'Failed to seed rewards');
                    }
                  }
                }}
                className="btn btn-secondary"
              >
                🌱 Seed Demo Rewards
              </button>
            )}
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="btn btn-primary"
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
            <div key={reward.id} className="card hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{getTypeIcon(reward.type)}</div>
                <span className={`badge ${getStatusBadge(reward.status)}`}>
                  {reward.status.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-200 mb-2 font-[family-name:var(--font-clash-display)]">{reward.title}</h3>
              <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{reward.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Points Cost:</span>
                  <span className="font-bold text-[#ff00ff]">{reward.pointsCost} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Value:</span>
                  <span className="font-bold text-[#00ff88]">
                    {reward.valueType === 'percentage' ? `${reward.value}%` : `₹${reward.value}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Stock:</span>
                  <span className="font-bold text-[#00ffff]">{reward.stock}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(reward)}
                  className="flex-1 btn btn-outline !text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(reward.id)}
                  className="flex-1 btn btn-danger !text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {rewards.length === 0 && (
            <div className="col-span-full text-center py-12 card">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-neutral-300 mb-2 font-[family-name:var(--font-clash-display)]">No Rewards Yet</h3>
              <p className="text-neutral-500">Create your first reward to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Redemptions Tab */}
      {activeTab === 'redemptions' && (
        <div className="space-y-4">
          {redemptions.map((redemption) => (
            <div key={redemption.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-200 mb-2">{redemption.rewardTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500">User: <span className="font-semibold text-neutral-300">{redemption.userEmail}</span></p>
                      <p className="text-neutral-500">Points Spent: <span className="font-semibold text-[#ff00ff]">{redemption.pointsSpent}</span></p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Value: <span className="font-semibold text-[#00ff88]">₹{redemption.rewardValue}</span></p>
                      <p className="text-neutral-500">Date: <span className="font-semibold text-neutral-300">{redemption.redeemedAt.toLocaleDateString()}</span></p>
                    </div>
                  </div>
                  {redemption.couponCode && (
                    <p className="mt-2 text-sm text-neutral-500">Code: <span className="font-mono font-bold text-[#00ffff]">{redemption.couponCode}</span></p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <span className={`badge text-center ${
                    redemption.status === 'approved' ? 'badge-success' :
                    redemption.status === 'used' ? 'badge-info' :
                    redemption.status === 'expired' ? 'badge-danger' :
                    'badge-warning'
                  }`}>
                    {redemption.status.toUpperCase()}
                  </span>
                  
                  {redemption.status === 'pending' && (
                    <button
                      onClick={() => handleRedemptionStatusUpdate(redemption.id, 'approved')}
                      className="btn btn-primary !text-sm !px-4 !py-2"
                    >
                      Approve
                    </button>
                  )}
                  {redemption.status === 'approved' && (
                    <button
                      onClick={() => handleRedemptionStatusUpdate(redemption.id, 'used')}
                      className="btn btn-secondary !text-sm !px-4 !py-2"
                    >
                      Mark Used
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {redemptions.length === 0 && (
            <div className="text-center py-12 card">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-neutral-300 mb-2 font-[family-name:var(--font-clash-display)]">No Redemptions Yet</h3>
              <p className="text-neutral-500">Redemptions will appear here when users redeem rewards</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-neutral-200 mb-6 font-[family-name:var(--font-clash-display)]">
              {editingReward ? 'Edit Reward' : 'Create New Reward'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-primary">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-primary"
                  required
                />
              </div>
              
              <div>
                <label className="label-primary">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="textarea-primary"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-primary">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="select-primary"
                  >
                    <option value="coupon">Coupon</option>
                    <option value="discount">Discount</option>
                    <option value="cashback">Cashback</option>
                    <option value="voucher">Voucher</option>
                  </select>
                </div>
                
                <div>
                  <label className="label-primary">Points Cost *</label>
                  <input
                    type="number"
                    value={formData.pointsCost}
                    onChange={(e) => setFormData({...formData, pointsCost: parseInt(e.target.value)})}
                    className="input-primary"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-primary">Value *</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                    className="input-primary"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary">Value Type *</label>
                  <select
                    value={formData.valueType}
                    onChange={(e) => setFormData({...formData, valueType: e.target.value as any})}
                    className="select-primary"
                  >
                    <option value="fixed">Fixed (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-primary">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    className="input-primary"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="label-primary">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="select-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="label-primary">Terms & Conditions</label>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
                  className="textarea-primary"
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
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
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
