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
        return 'bg-[rgba(255,170,0,0.2)] text-[#ffaa00] border border-[rgba(255,170,0,0.3)]';
      case 'collected':
        return 'bg-[rgba(0,255,255,0.2)] text-[#00ffff] border border-[rgba(0,255,255,0.3)]';
      case 'processed':
        return 'bg-[rgba(0,255,136,0.2)] text-[#00ff88] border border-[rgba(0,255,136,0.3)]';
      default:
        return 'bg-black/40 text-neutral-400 border border-[rgba(0,255,136,0.1)]';
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
        <div className="spinner-neon"></div>
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
    <div className="space-y-6 font-[family-name:var(--font-satoshi)]">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/80 backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-4 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
          <p className="text-sm text-neutral-400 mb-1">Total Reports</p>
          <p className="text-3xl font-bold text-[#00ffff] font-[family-name:var(--font-clash-display)]">{stats.total}</p>
        </div>
        <div className="bg-black/80 backdrop-blur-xl border border-[rgba(255,170,0,0.2)] rounded-2xl p-4 shadow-[0_0_15px_rgba(255,170,0,0.1)]">
          <p className="text-sm text-neutral-400 mb-1">Pending</p>
          <p className="text-3xl font-bold text-[#ffaa00] font-[family-name:var(--font-clash-display)]">{stats.pending}</p>
        </div>
        <div className="bg-black/80 backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-4 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
          <p className="text-sm text-neutral-400 mb-1">Collected</p>
          <p className="text-3xl font-bold text-[#00ffff] font-[family-name:var(--font-clash-display)]">{stats.collected}</p>
        </div>
        <div className="bg-black/80 backdrop-blur-xl border border-[rgba(0,255,136,0.2)] rounded-2xl p-4 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
          <p className="text-sm text-neutral-400 mb-1">Processed</p>
          <p className="text-3xl font-bold text-[#00ff88] font-[family-name:var(--font-clash-display)]">{stats.processed}</p>
        </div>
      </div>

      {/* Points Info */}
      <div className="bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.15)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-neutral-200 mb-3 flex items-center font-[family-name:var(--font-clash-display)]">
          <span className="text-2xl mr-2">💡</span>
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-semibold text-neutral-200">Report Collected</p>
              <p className="text-neutral-400">Earn 50 points when your report is collected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-neutral-200">Report Processed</p>
              <p className="text-neutral-400">Earn 100 points when your report is processed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="card hover:border-[rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getStatusIcon(report.status)}</div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">
                    {report.brand} {report.model || report.deviceType}
                  </h3>
                  <p className="text-sm text-neutral-400">{report.deviceType}</p>
                </div>
              </div>
              <span className={`px-4 py-2 text-xs font-bold rounded-full ${getStatusBadge(report.status)}`}>
                {report.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">Condition</p>
                <p className="font-semibold text-neutral-300 capitalize">{report.condition}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Location</p>
                <p className="font-semibold text-neutral-300">{report.location}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Reported On</p>
                <p className="font-semibold text-neutral-300">{formatDate(report.reportedAt)}</p>
              </div>
            </div>

            {report.description && (
              <div className="mt-4 pt-4 border-t border-[rgba(0,255,136,0.1)]">
                <p className="text-sm text-neutral-400">{report.description}</p>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-12 card">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-neutral-300 mb-2 font-[family-name:var(--font-clash-display)]">No Reports Yet</h3>
            <p className="text-neutral-500">Start reporting e-waste devices to earn points!</p>
          </div>
        )}
      </div>
    </div>
  );
}
