import React, { useState, useEffect } from 'react';
import { ewasteReportsService, EWasteReport } from '../../services/firestoreService';

export default function EWasteReportsManager() {
  const [reports, setReports] = useState<EWasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'collected' | 'processed'>('all');
  const [selectedReport, setSelectedReport] = useState<EWasteReport | null>(null);

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
      alert('Failed to update report status. Please try again.');
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
        return 'bg-green-100 text-green-800';
      case 'partially-working':
        return 'bg-yellow-100 text-yellow-800';
      case 'broken':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'collected':
        return 'bg-blue-100 text-blue-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading e-waste reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-xl">
          <h3 className="font-semibold text-green-800 mb-2">Total Devices</h3>
          <p className="text-2xl font-bold text-green-600">{stats.total}</p>
          <p className="text-sm text-green-600">devices reported</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">This Month</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.thisMonth}</p>
          <p className="text-sm text-blue-600">new reports</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <h3 className="font-semibold text-purple-800 mb-2">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.deviceTypes}</p>
          <p className="text-sm text-purple-600">device types</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Collected</p>
            <p className="text-2xl font-bold text-blue-600">{stats.collected}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Processed</p>
            <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'collected', 'processed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No e-waste reports have been submitted yet.' 
                : `No ${filter} reports at the moment.`}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-4xl">{getDeviceIcon(report.deviceType)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {report.brand} {report.model || report.deviceType}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(report.condition)}`}>
                        {report.condition}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Device Type:</strong> {report.deviceType}</p>
                      <p><strong>Location:</strong> {report.location}</p>
                      {report.description && <p><strong>Description:</strong> {report.description}</p>}
                      {report.estimatedValue && (
                        <p><strong>Estimated Value:</strong> ${report.estimatedValue.toFixed(2)}</p>
                      )}
                      <p className="text-xs text-gray-500">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Mark Collected
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'processed')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Mark Processed
                      </button>
                    </>
                  )}
                  {report.status === 'collected' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'processed')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Mark Processed
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'pending')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Back to Pending
                      </button>
                    </>
                  )}
                  {report.status === 'processed' && (
                    <button
                      onClick={() => handleStatusUpdate(report.id, 'collected')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
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
