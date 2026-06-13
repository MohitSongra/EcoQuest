import React from 'react';

const rewards = [
  { id: 1, title: 'Eco Hoodie', pts: '1500 PT', icon: '🧥', color: 'from-emerald-500/10 to-teal-900/40', border: 'border-teal-500/20' },
  { id: 2, title: 'Digital Gift Card', pts: '2000 PT', icon: '💳', color: 'from-blue-500/10 to-indigo-900/40', border: 'border-blue-500/20' },
  { id: 3, title: 'Plant 5 Trees', pts: '1000 PT', icon: '🌲', color: 'from-[#00ff88]/10 to-emerald-900/40', border: 'border-[#00ff88]/30' },
  { id: 4, title: 'Smart Thermostat', pts: '5000 PT', icon: '🌡️', color: 'from-orange-500/10 to-rose-900/40', border: 'border-orange-500/20' },
  { id: 5, title: 'Recycled Bag', pts: '3000 PT', icon: '🎒', color: 'from-purple-500/10 to-fuchsia-900/40', border: 'border-purple-500/20' },
];

export default function RewardMarquee() {
  return (
    <div className="flex-1 w-full h-[350px] bg-surface-2/50 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-center marquee-container group/container">
      {/* Edge Fades - using surface-1/canvas colors to blend */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none rounded-l-3xl" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none rounded-r-3xl" />
      
      {/* The scrolling track */}
      <div className="marquee-track flex w-max group/track">
        
        {/* Set 1 */}
        <div className="flex gap-6 pr-6">
          {rewards.map((reward) => (
            <div 
              key={`set1-${reward.id}`}
              className={`flex-shrink-0 w-48 h-64 rounded-2xl border ${reward.border} backdrop-blur-xl bg-gradient-to-br ${reward.color} shadow-2xl flex flex-col items-center justify-between p-6 transition-all duration-500 ease-out group-hover/track:opacity-30 hover:!opacity-100 hover:scale-[1.15] hover:-translate-y-2 hover:z-20 relative cursor-pointer`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-2xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/10 mt-2 transition-transform duration-500 group-hover:scale-110">
                {reward.icon}
              </div>
              
              <div className="text-center w-full mb-2">
                <div className="text-white font-medium text-base mb-2">{reward.title}</div>
                <div className="inline-block px-3 py-1 bg-black/50 rounded-full border border-white/10 text-accent text-xs font-bold tracking-widest shadow-inner">{reward.pts}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Set 2 (Exact duplicate for seamless looping) */}
        <div className="flex gap-6 pr-6">
          {rewards.map((reward) => (
            <div 
              key={`set2-${reward.id}`}
              className={`flex-shrink-0 w-48 h-64 rounded-2xl border ${reward.border} backdrop-blur-xl bg-gradient-to-br ${reward.color} shadow-2xl flex flex-col items-center justify-between p-6 transition-all duration-500 ease-out group-hover/track:opacity-30 hover:!opacity-100 hover:scale-[1.15] hover:-translate-y-2 hover:z-20 relative cursor-pointer`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-2xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/10 mt-2 transition-transform duration-500 group-hover:scale-110">
                {reward.icon}
              </div>
              
              <div className="text-center w-full mb-2">
                <div className="text-white font-medium text-base mb-2">{reward.title}</div>
                <div className="inline-block px-3 py-1 bg-black/50 rounded-full border border-white/10 text-accent text-xs font-bold tracking-widest shadow-inner">{reward.pts}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .marquee-track {
          animation: scroll 20s linear infinite;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
