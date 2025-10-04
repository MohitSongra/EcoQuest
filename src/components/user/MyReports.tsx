import React, { useState, useEffect } from 'react';
import { ewasteReportsService, EWasteReport } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

export default function MyReports() {
  const [reports, setReports] = useState<EWasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = ewasteReportsService.listenToReports((allReports) => {
      const userReports = allReports.filter(r => r.userId === currentUser.uid);
      setReports(userReports);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'collected': return '📦';
      case 'processed': return '✅';
      default: return '📋';
    }
  };

  const getPointsForStatus = (status: string) => {
    switch (status) {
      case 'collected': return 50;
      case 'processed': return 100;
      default: return 0;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    collected: reports.filter(r => r.status === 'collected').length,
    processed: reports.filter(r => r.status === 'processed').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
          <p className="text-sm opacity-80 mb-1">Total Reports</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white">
          <p className="text-sm opacity-80 mb-1">Pending</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-4 text-white">
          <p className="text-sm opacity-80 mb-1">Collected</p>
          <p className="text-3xl font-bold">{stats.collected}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
          <p className="text-sm opacity-80 mb-1">Processed</p>
          <p className="text-3xl font-bold">{stats.processed}</p>
        </div>
      </div>

      {/* Points Info */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-2xl mr-2">💡</span>
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-semibold text-gray-800">Report Collected</p>
              <p className="text-gray-600">Earn 50 points when your report is collected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Report Processed</p>
              <p className="text-gray-600">Earn 100 points when your report is processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getStatusIcon(report.status)}</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {report.brand} {report.model || report.deviceType}
                  </h3>
                  <p className="text-sm text-gray-600">{report.deviceType}</p>
                </div>
              </div>
              <span className={`px-4 py-2 text-xs font-bold rounded-full ${getStatusBadge(report.status)}`}>
                {report.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Condition</p>
                <p className="font-semibold text-gray-800 capitalize">{report.condition}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-800">{report.location}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Reported On</p>
                <p className="font-semibold text-gray-800">{formatDate(report.reportedAt)}</p>
              </div>
            </div>

            {report.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12 bg-white/80 rounded-3xl">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Yet</h3>
            <p className="text-gray-600">Start reporting e-waste devices to earn points!</p>
          </div>
        )}
      </div>
    </div>
  );
}
