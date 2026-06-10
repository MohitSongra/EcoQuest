import React, { useState, useEffect } from 'react';
import { leaderboardService, LeaderboardEntry } from '../../services/firestoreService';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = leaderboardService.listenToLeaderboard((entries) => {
      setLeaderboard(entries);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankGlow = (rank: number) => {
    switch (rank) {
      case 1: return 'shadow-[0_0_25px_rgba(255,215,0,0.4)] border-[rgba(255,215,0,0.4)]';
      case 2: return 'shadow-[0_0_20px_rgba(192,192,192,0.3)] border-[rgba(192,192,192,0.3)]';
      case 3: return 'shadow-[0_0_20px_rgba(205,127,50,0.3)] border-[rgba(205,127,50,0.3)]';
      default: return 'border-[rgba(0,255,136,0.15)]';
    }
  };

  const getWeekDates = () => {
    if (leaderboard.length === 0) {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return { start: weekStart, end: weekEnd };
    }
    return {
      start: leaderboard[0].weekStartDate,
      end: leaderboard[0].weekEndDate
    };
  };

  const weekDates = getWeekDates();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner-neon"></div>
      </div>
    );
  }

  return (
    <div className="card p-8 font-[family-name:var(--font-satoshi)]">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-neutral-200 mb-3 flex items-center justify-center font-[family-name:var(--font-clash-display)]">
          <span className="text-4xl mr-3">🏆</span>
          Weekly Leaderboard
        </h2>
        <p className="text-neutral-400 text-lg">
          {weekDates.start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {weekDates.end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm text-[#ff00ff] font-semibold mt-2">
          Top contributors win cash prizes! 💰
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-black/60 border-2 border-[rgba(192,192,192,0.4)] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(192,192,192,0.3)] mb-3 transform hover:scale-110 transition-transform">
                <span className="text-4xl">🥈</span>
              </div>
              {leaderboard[1].prize && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[rgba(0,255,136,0.2)] text-[#00ff88] border border-[rgba(0,255,136,0.3)] px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                  ₹{leaderboard[1].prize}
                </div>
              )}
            </div>
            <div className="bg-black/60 border border-[rgba(192,192,192,0.2)] rounded-2xl p-4 w-32 text-center shadow-[0_0_15px_rgba(192,192,192,0.15)]">
              <p className="font-bold text-neutral-200 text-sm truncate">{leaderboard[1].displayName}</p>
              <p className="text-xs text-neutral-400 mt-1">{leaderboard[1].weeklyPoints} pts</p>
              <p className="text-xs text-neutral-500">{leaderboard[1].devicesReported} devices</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-8">
            <div className="relative">
              <div className="w-32 h-32 bg-black/60 border-2 border-[rgba(255,215,0,0.5)] rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.4)] mb-3 transform hover:scale-110 transition-transform animate-glow-pulse">
                <span className="text-5xl">👑</span>
              </div>
              {leaderboard[0].prize && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[rgba(0,255,136,0.2)] text-[#00ff88] border border-[rgba(0,255,136,0.3)] px-4 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                  ₹{leaderboard[0].prize}
                </div>
              )}
            </div>
            <div className="bg-black/60 border border-[rgba(255,215,0,0.3)] rounded-2xl p-4 w-36 text-center shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              <p className="font-bold text-neutral-200 truncate">{leaderboard[0].displayName}</p>
              <p className="text-sm text-[#00ff88] mt-1 font-semibold">{leaderboard[0].weeklyPoints} pts</p>
              <p className="text-xs text-neutral-400">{leaderboard[0].devicesReported} devices</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-black/60 border-2 border-[rgba(205,127,50,0.4)] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(205,127,50,0.3)] mb-3 transform hover:scale-110 transition-transform">
                <span className="text-4xl">🥉</span>
              </div>
              {leaderboard[2].prize && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[rgba(0,255,136,0.2)] text-[#00ff88] border border-[rgba(0,255,136,0.3)] px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                  ₹{leaderboard[2].prize}
                </div>
              )}
            </div>
            <div className="bg-black/60 border border-[rgba(205,127,50,0.2)] rounded-2xl p-4 w-32 text-center shadow-[0_0_15px_rgba(205,127,50,0.15)]">
              <p className="font-bold text-neutral-200 text-sm truncate">{leaderboard[2].displayName}</p>
              <p className="text-xs text-neutral-400 mt-1">{leaderboard[2].weeklyPoints} pts</p>
              <p className="text-xs text-neutral-500">{leaderboard[2].devicesReported} devices</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="space-y-3 mt-8">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
              index < 3
                ? `bg-black/60 ${getRankGlow(entry.rank)}`
                : 'bg-black/40 border-[rgba(0,255,136,0.1)] hover:border-[rgba(0,255,136,0.3)] hover:shadow-[0_0_15px_rgba(0,255,136,0.1)]'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                index < 3 ? 'bg-[rgba(0,255,136,0.1)]' : 'bg-black/40 border border-[rgba(0,255,136,0.1)]'
              }`}>
                <span className="text-2xl">{getRankIcon(entry.rank)}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className={`font-bold text-lg ${index < 3 ? 'text-neutral-200' : 'text-neutral-300'}`}>
                    {entry.displayName}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    index < 3 ? 'bg-[rgba(0,255,136,0.15)] text-[#00ff88]' : 'bg-black/40 text-neutral-400 border border-[rgba(0,255,136,0.1)]'
                  }`}>
                    #{entry.rank}
                  </span>
                </div>
                <p className={`text-sm ${index < 3 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {entry.userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className={`text-2xl font-bold ${index < 3 ? 'text-[#00ff88]' : 'text-[#00ff88]/80'}`}>
                  {entry.weeklyPoints}
                </p>
                <p className={`text-xs ${index < 3 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  points
                </p>
              </div>
              
              <div className="text-right">
                <p className={`text-xl font-bold ${index < 3 ? 'text-[#00ffff]' : 'text-[#00ffff]/80'}`}>
                  {entry.devicesReported}
                </p>
                <p className={`text-xs ${index < 3 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  devices
                </p>
              </div>

              {entry.prize && (
                <div className={`text-right px-4 py-2 rounded-lg ${
                  index < 3 ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)]' : 'bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)]'
                }`}>
                  <p className={`text-xl font-bold ${index < 3 ? 'text-[#00ff88]' : 'text-[#00ff88]/80'}`}>
                    ₹{entry.prize}
                  </p>
                  <p className={`text-xs ${index < 3 ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    prize
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-neutral-300 mb-2 font-[family-name:var(--font-clash-display)]">No Entries Yet</h3>
          <p className="text-neutral-500">Be the first to contribute this week and win prizes!</p>
        </div>
      )}

      {/* Prize Information */}
      <div className="mt-8 bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.15)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-neutral-200 mb-3 flex items-center font-[family-name:var(--font-clash-display)]">
          <span className="text-2xl mr-2">💰</span>
          Weekly Cash Prizes
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-[rgba(255,215,0,0.9)] drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">₹5,000</p>
            <p className="text-sm text-neutral-400">1st Place</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-400 drop-shadow-[0_0_10px_rgba(192,192,192,0.3)]">₹3,000</p>
            <p className="text-sm text-neutral-500">2nd Place</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[rgba(205,127,50,0.9)] drop-shadow-[0_0_10px_rgba(205,127,50,0.3)]">₹2,000</p>
            <p className="text-sm text-neutral-500">3rd Place</p>
          </div>
        </div>
        <p className="text-xs text-neutral-500 text-center mt-4">
          * Winners are determined by total e-waste contribution points earned during the week
        </p>
      </div>
    </div>
  );
}
