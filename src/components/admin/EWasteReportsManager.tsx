import React, { useState, useEffect } from 'react';
import { ewasteReportsService, EWasteReport } from '../../services/firestoreService';

export default function EWasteReportsManager() {
  const [reports, setReports] = useState<EWasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'collected' | 'processed'>('all');
  const [selectedReport, setSelectedReport] = useState<EWasteReport | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    // Set up real-time listener for e-waste reports
    const unsubscribe = ewasteReportsService.listenToReports((reportsData) => {
      setReports(reportsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleStatusUpdate = async (reportId: string, newStatus: 'pending' | 'collected' | 'processed') => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      const oldStatus = report.status;
      
      // Award points BEFORE updating status to avoid race conditions
      if (newStatus === 'collected' && oldStatus === 'pending') {
        // Award 50 points for collected
        await awardPointsToUser(report.userId, 50);
      } else if (newStatus === 'processed') {
        // Award 100 points for processed (total)
        // If already collected (50 pts), add 50 more. If pending, add full 100.
        const pointsToAward = oldStatus === 'collected' ? 50 : 100;
        await awardPointsToUser(report.userId, pointsToAward);
      }

      // Update status after awarding points
      await ewasteReportsService.updateReportStatus(reportId, newStatus);

      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error updating report status:', error);
      showMessage('error', 'Failed to update report status. Please try again.');
    }
  };

  const awardPointsToUser = async (userId: string, points: number) => {
    try {
      const { doc, getDoc, updateDoc, increment } = await import('firebase/firestore');
      const { db } = await import('../../services/firebase');
      
      const userRef = doc(db, 'userRoles', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          points: increment(points)
        });
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'working':
        return 'badge-success';
      case 'partially-working':
        return 'badge-warning';
      case 'broken':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'collected':
        return 'badge-info';
      case 'processed':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType.toLowerCase();
    if (type.includes('phone') || type.includes('smartphone')) return '📱';
    if (type.includes('laptop')) return '💻';
    if (type.includes('desktop') || type.includes('computer')) return '🖥️';
    if (type.includes('tablet')) return '📱';
    if (type.includes('television') || type.includes('tv')) return '📺';
    if (type.includes('printer')) return '🖨️';
    if (type.includes('router')) return '📡';
    if (type.includes('console')) return '🎮';
    if (type.includes('watch')) return '⌚';
    if (type.includes('headphone')) return '🎧';
    if (type.includes('camera')) return '📷';
    return '📦';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    collected: reports.filter(r => r.status === 'collected').length,
    processed: reports.filter(r => r.status === 'processed').length,
    thisMonth: reports.filter(r => {
      const reportDate = new Date(r.reportedAt);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length,
    deviceTypes: new Set(reports.map(r => r.deviceType)).size
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="spinner-neon mx-auto"></div>
          <p className="mt-4 text-neutral-400 animate-pulse">Loading e-waste reports...</p>
        </div>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card !bg-[rgba(0,255,136,0.05)] !border-[rgba(0,255,136,0.15)]">
          <h3 className="font-semibold text-[#00ff88] mb-2 font-[family-name:var(--font-clash-display)]">Total Devices</h3>
          <p className="text-2xl font-bold text-[#00ff88]">{stats.total}</p>
          <p className="text-sm text-neutral-500">devices reported</p>
        </div>
        <div className="card !bg-[rgba(0,255,255,0.05)] !border-[rgba(0,255,255,0.15)]">
          <h3 className="font-semibold text-[#00ffff] mb-2 font-[family-name:var(--font-clash-display)]">This Month</h3>
          <p className="text-2xl font-bold text-[#00ffff]">{stats.thisMonth}</p>
          <p className="text-sm text-neutral-500">new reports</p>
        </div>
        <div className="card !bg-[rgba(255,0,255,0.05)] !border-[rgba(255,0,255,0.15)]">
          <h3 className="font-semibold text-[#ff00ff] mb-2 font-[family-name:var(--font-clash-display)]">Categories</h3>
          <p className="text-2xl font-bold text-[#ff00ff]">{stats.deviceTypes}</p>
          <p className="text-sm text-neutral-500">device types</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="card">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-neutral-500">Pending</p>
            <p className="text-2xl font-bold text-[#ffaa00]">{stats.pending}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Collected</p>
            <p className="text-2xl font-bold text-[#00ffff]">{stats.collected}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Processed</p>
            <p className="text-2xl font-bold text-[#00ff88]">{stats.processed}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'collected', 'processed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === status
                ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                : 'bg-black/40 text-neutral-400 border border-[rgba(0,255,136,0.1)] hover:bg-[rgba(0,255,136,0.05)] hover:text-neutral-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && ` (${reports.filter(r => r.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 card">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-neutral-300 mb-2 font-[family-name:var(--font-clash-display)]">No Reports Found</h3>
            <p className="text-neutral-500">
              {filter === 'all' 
                ? 'No e-waste reports have been submitted yet.' 
                : `No ${filter} reports at the moment.`}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="card hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-4xl">{getDeviceIcon(report.deviceType)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-200">
                        {report.brand} {report.model || report.deviceType}
                      </h3>
                      <span className={`badge ${getConditionBadge(report.condition)}`}>
                        {report.condition}
                      </span>
                      <span className={`badge ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-neutral-400">
                      <p><strong className="text-neutral-300">Device Type:</strong> {report.deviceType}</p>
                      <p><strong className="text-neutral-300">Location:</strong> {report.location}</p>
                      {report.description && <p><strong className="text-neutral-300">Description:</strong> {report.description}</p>}
                      {report.estimatedValue && (
                        <p><strong className="text-neutral-300">Estimated Value:</strong> ${report.estimatedValue.toFixed(2)}</p>
                      )}
                      <p className="text-xs text-neutral-500">
                        Reported {formatDate(report.reportedAt)} • ID: {report.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'collected')}
                        className="btn btn-secondary !text-sm !px-4 !py-2 whitespace-nowrap"
                      >
                        Mark Collected
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'processed')}
                        className="btn btn-primary !text-sm !px-4 !py-2 whitespace-nowrap"
                      >
                        Mark Processed
                      </button>
                    </>
                  )}
                  {report.status === 'collected' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'processed')}
                        className="btn btn-primary !text-sm !px-4 !py-2 whitespace-nowrap"
                      >
                        Mark Processed
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'pending')}
                        className="btn btn-outline !text-sm !px-4 !py-2 whitespace-nowrap"
                      >
                        Back to Pending
                      </button>
                    </>
                  )}
                  {report.status === 'processed' && (
                    <button
                      onClick={() => handleStatusUpdate(report.id, 'collected')}
                      className="btn btn-outline !text-sm !px-4 !py-2 whitespace-nowrap"
                    >
                      Back to Collected
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
