import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const rewards = [
  { id: 1, title: 'Eco Merch', pts: '500 PT', icon: '👕', color: 'from-emerald-500/10 to-teal-900/40', border: 'border-teal-500/20' },
  { id: 2, title: 'Plant a Tree', pts: '1000 PT', icon: '🌳', color: 'from-[#00ff88]/20 to-emerald-900/40', border: 'border-[#00ff88]/30' },
  { id: 3, title: 'Smart Tech', pts: '2500 PT', icon: '🎧', color: 'from-blue-500/10 to-indigo-900/40', border: 'border-blue-500/20' },
];

export default function InteractiveRewardCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position relative to container center (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth the mouse values
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  // Transform mouse values into 3D rotation angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse relative to container top-left
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Percentage from center (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    // Reset to flat when mouse leaves
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex-1 w-full h-[350px] bg-surface-2/50 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center perspective-[1000px] cursor-crosshair group"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
      
      {/* 3D Scene Container */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {rewards.map((reward, index) => {
          // Compute staggered layout offsets
          const isCenter = index === 1;
          const xOffset = index === 0 ? -80 : index === 2 ? 80 : 0;
          const yOffset = isCenter ? -10 : 10;
          const zOffset = isCenter ? 40 : 0;
          const rotateOffset = index === 0 ? -8 : index === 2 ? 8 : 0;
          const zIndex = isCenter ? 30 : 10;
          
          return (
            <motion.div
              key={reward.id}
              className={`absolute w-44 h-60 rounded-2xl border ${reward.border} backdrop-blur-xl bg-gradient-to-br ${reward.color} shadow-2xl flex flex-col items-center justify-between p-5 overflow-hidden`}
              style={{
                x: xOffset,
                y: yOffset,
                z: zOffset,
                rotateZ: rotateOffset,
                zIndex,
                transformStyle: "preserve-3d"
              }}
              whileHover={{ 
                scale: 1.05, 
                z: zOffset + 30, // Pop out heavily on hover
                rotateZ: isCenter ? 0 : rotateOffset * 0.5,
                transition: { duration: 0.3, ease: "easeOut" } 
              }}
            >
              {/* Glass reflection highlight overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-2xl pointer-events-none" />
              
              {/* Floating Icon */}
              <div 
                className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/10"
                style={{ transform: "translateZ(40px)" }} // Float above card
              >
                {reward.icon}
              </div>
              
              {/* Floating Content */}
              <div 
                className="text-center w-full"
                style={{ transform: "translateZ(30px)" }} // Float above card
              >
                <div className="text-white font-medium text-sm mb-2 drop-shadow-md">{reward.title}</div>
                <div className="inline-block px-3 py-1 bg-black/50 rounded-full border border-white/10 text-[#00ff88] text-xs font-bold tracking-widest shadow-inner">{reward.pts}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
