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

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center">
          <span className="text-4xl mr-3">🏆</span>
          Weekly Leaderboard
        </h2>
        <p className="text-gray-600 text-lg">
          {weekDates.start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {weekDates.end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm text-purple-600 font-semibold mt-2">
          Top contributors win cash prizes! 💰
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-xl mb-3 transform hover:scale-110 transition-transform">
                <span className="text-4xl">🥈</span>
              </div>
              {leaderboard[1].prize && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ₹{leaderboard[1].prize}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl p-4 w-32 text-center shadow-lg">
              <p className="font-bold text-gray-800 text-sm truncate">{leaderboard[1].displayName}</p>
              <p className="text-xs text-gray-700 mt-1">{leaderboard[1].weeklyPoints} pts</p>
              <p className="text-xs text-gray-600">{leaderboard[1].devicesReported} devices</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl mb-3 transform hover:scale-110 transition-transform animate-pulse">
                <span className="text-5xl">👑</span>
              </div>
              {leaderboard[0].prize && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  ₹{leaderboard[0].prize}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl p-4 w-36 text-center shadow-2xl">
              <p className="font-bold text-gray-900 truncate">{leaderboard[0].displayName}</p>
              <p className="text-sm text-gray-800 mt-1 font-semibold">{leaderboard[0].weeklyPoints} pts</p>
              <p className="text-xs text-gray-700">{leaderboard[0].devicesReported} devices</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-xl mb-3 transform hover:scale-110 transition-transform">
                <span className="text-4xl">🥉</span>
              </div>
              {leaderboard[2].prize && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ₹{leaderboard[2].prize}
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-orange-200 to-orange-400 rounded-2xl p-4 w-32 text-center shadow-lg">
              <p className="font-bold text-gray-800 text-sm truncate">{leaderboard[2].displayName}</p>
              <p className="text-xs text-gray-700 mt-1">{leaderboard[2].weeklyPoints} pts</p>
              <p className="text-xs text-gray-600">{leaderboard[2].devicesReported} devices</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="space-y-3 mt-8">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
              index < 3
                ? 'bg-gradient-to-r ' + getRankColor(entry.rank) + ' text-white'
                : 'bg-white border-2 border-gray-200 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                index < 3 ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <span className="text-2xl">{getRankIcon(entry.rank)}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-800'}`}>
                    {entry.displayName}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    index < 3 ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    #{entry.rank}
                  </span>
                </div>
                <p className={`text-sm ${index < 3 ? 'text-white/80' : 'text-gray-600'}`}>
                  {entry.userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className={`text-2xl font-bold ${index < 3 ? 'text-white' : 'text-emerald-600'}`}>
                  {entry.weeklyPoints}
                </p>
                <p className={`text-xs ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                  points
                </p>
              </div>
              
              <div className="text-right">
                <p className={`text-xl font-bold ${index < 3 ? 'text-white' : 'text-blue-600'}`}>
                  {entry.devicesReported}
                </p>
                <p className={`text-xs ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                  devices
                </p>
              </div>

              {entry.prize && (
                <div className={`text-right px-4 py-2 rounded-lg ${
                  index < 3 ? 'bg-white/20' : 'bg-green-50'
                }`}>
                  <p className={`text-xl font-bold ${index < 3 ? 'text-white' : 'text-green-600'}`}>
                    ₹{entry.prize}
                  </p>
                  <p className={`text-xs ${index < 3 ? 'text-white/80' : 'text-green-700'}`}>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Entries Yet</h3>
          <p className="text-gray-600">Be the first to contribute this week and win prizes!</p>
        </div>
      )}

      {/* Prize Information */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="text-2xl mr-2">💰</span>
          Weekly Cash Prizes
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-yellow-600">₹5,000</p>
            <p className="text-sm text-gray-600">1st Place</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-600">₹3,000</p>
            <p className="text-sm text-gray-600">2nd Place</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">₹2,000</p>
            <p className="text-sm text-gray-600">3rd Place</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          * Winners are determined by total e-waste contribution points earned during the week
        </p>
      </div>
    </div>
  );
}
