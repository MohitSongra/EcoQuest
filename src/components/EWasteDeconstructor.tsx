"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const devices = {
  smartphone: {
    name: "Smartphone",
    width: 240,
    height: 420,
    parts: [
      { id: 'screen', name: 'Glass Display Panel', points: '+50 pts', impact: 'Saves 2kg of CO2 emissions from glass manufacturing.', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400', img: '/images/deconstructor/smartphone_mockup.webp' },
      { id: 'battery', name: 'Lithium-Ion Battery', points: '+120 pts', impact: 'Prevents toxic leakage into soil and recovers cobalt.', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', img: '/images/deconstructor/smartphone_battery.png' },
      { id: 'board', name: 'Logic Board', points: '+200 pts', impact: 'Recycles rare earth metals like gold, silver, and palladium.', color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400', img: '/images/deconstructor/smartphone_board.png' }
    ]
  },
  laptop: {
    name: "Laptop",
    width: 480,
    height: 280,
    parts: [
      { id: 'screen', name: 'LCD/LED Display', points: '+150 pts', impact: 'Saves 8kg CO2 and recovers valuable indium.', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-400', img: '/images/deconstructor/laptop_mockup.jpg' },
      { id: 'battery', name: 'Multi-cell Battery', points: '+300 pts', impact: 'Prevents severe heavy metal pollution and fire hazards.', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', img: '/images/deconstructor/laptop_battery.png' },
      { id: 'board', name: 'Main Motherboard', points: '+400 pts', impact: 'Recycles copper cooling pipes and precious processor metals.', color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-400', img: '/images/deconstructor/laptop_board.png' }
    ]
  }
};

type DeviceType = keyof typeof devices;

export default function EWasteDeconstructor() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('smartphone');
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<number | null>(null);

  const device = devices[activeDevice];
  // Determine which part info to show.
  const displayPart = hoveredPart !== null ? device.parts[hoveredPart] : null;

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Device Selector */}
      <div className="flex gap-2 sm:gap-4 mb-8 relative z-20 bg-surface-2 p-1.5 rounded-full border border-white/5">
        {(Object.keys(devices) as DeviceType[]).map((dev) => (
          <button
            key={dev}
            onClick={() => {
              setActiveDevice(dev);
              setIsExploded(false);
              setHoveredPart(null);
            }}
            className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-sm font-[family-name:var(--font-satoshi)] font-semibold transition-all duration-300 ${
              activeDevice === dev 
                ? 'bg-white text-black shadow-lg' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {devices[dev].name}
          </button>
        ))}
      </div>

      {/* Main Interactive Canvas */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 items-center bg-surface-1/30 rounded-[2.5rem] border border-white/5 overflow-hidden min-h-[600px] relative">
        
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(0,255,136,0.03)_0%,transparent_50%)] pointer-events-none" />

        {/* 3D Visualization Column */}
        <div 
          className="lg:col-span-7 relative h-[450px] lg:h-full w-full flex items-center justify-center perspective-[2000px] cursor-crosshair group overflow-hidden"
          onMouseEnter={() => setIsExploded(true)}
          onMouseLeave={() => { setIsExploded(false); setHoveredPart(null); }}
        >
          {/* Isometric Wrapper */}
          <motion.div
            className="relative flex items-center justify-center transform-style-3d"
            animate={{ 
              rotateX: isExploded ? 60 : 0, 
              rotateZ: isExploded ? -35 : 0,
              scale: isExploded ? (activeDevice === 'laptop' ? 0.8 : 0.9) : (activeDevice === 'laptop' ? 0.9 : 1),
              y: isExploded ? 20 : 0
            }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              width: device.width, 
              height: device.height,
              transformStyle: "preserve-3d"
            }}
          >
            {/* The Layers */}
            {[...device.parts].reverse().map((part) => {
              const index = device.parts.indexOf(part);
              // Base z-offsets for the exploded view
              // Layer 2 (Board) is bottom, Layer 1 (Battery) is middle, Layer 0 (Screen) is top
              const isBase = index === 2;
              const isMiddle = index === 1;
              const isTop = index === 0;
              
              let zOffset = 0;
              if (isExploded) {
                if (isTop) zOffset = 220;
                if (isMiddle) zOffset = 110;
                if (isBase) zOffset = 0;
              }

              // Pop effect if this specific part is hovered
              const isHovered = hoveredPart === index;
              const isDimmed = hoveredPart !== null && !isHovered;
              
              if (isHovered && isExploded) {
                zOffset += 40; // Pop up slightly more
              }

              return (
                <motion.div
                  key={part.id}
                  className="absolute inset-0 flex items-center justify-center transform-style-3d"
                  animate={{ 
                    z: zOffset,
                    opacity: isDimmed ? 0.4 : 1,
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => isExploded && setHoveredPart(index)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Glowing backdrop layer for parts to give them physical presence */}
                  <motion.div 
                    className="absolute inset-0 bg-black/40 rounded-[2rem] border border-white/5 pointer-events-none"
                    animate={{ opacity: isExploded ? 1 : 0 }}
                  />

                  {/* Glowing border on hover */}
                  <div className={`absolute inset-0 rounded-[2rem] transition-opacity duration-300 pointer-events-none ${isHovered ? 'ring-2 ring-white/30 bg-white/5' : ''}`} />
                  
                  {/* The Image */}
                  <div className={`relative w-full h-full mix-blend-screen transition-all duration-300 ${isHovered ? 'drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]' : 'drop-shadow-2xl'}`}>
                    <Image 
                      src={part.img} 
                      alt={part.name} 
                      fill 
                      className={`object-contain rounded-[2rem] p-4 ${isTop && activeDevice === 'laptop' ? 'p-0' : ''}`} 
                      priority
                    />
                  </div>
                </motion.div>
              );
            })}
            
            {/* Floating Instructional Text (Only shows when not exploded) */}
            <motion.div 
              className="absolute -bottom-24 left-0 right-0 text-center pointer-events-none"
              animate={{ opacity: isExploded ? 0 : 1, y: isExploded ? 20 : 0 }}
              transition={{ duration: 0.4 }}
            >
               <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-2 border border-white/10 text-neutral-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">
                 <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_10px_#00ff88]" />
                 Hover to deconstruct
               </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Information Panel Column */}
        <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/5 bg-gradient-to-r from-transparent to-surface-2/30 h-full">
          
          <div className="mb-4">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 font-[family-name:var(--font-clash-display)]">
              Inside the <span className="text-[#00ff88] italic block mt-2">{device.name}.</span>
            </h3>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
              Every component holds hidden value. Hover over the exploded parts to see the environmental impact of recycling them.
            </p>
          </div>

          {/* Dynamic Info Box */}
          <div className="h-[220px] mt-8 relative">
            <AnimatePresence mode="wait">
              {displayPart ? (
                <motion.div
                  key={displayPart.id}
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 mb-5 ${displayPart.iconColor} shadow-lg`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-mono text-sm font-bold tracking-wider">{displayPart.points}</span>
                  </div>
                  
                  <h4 className="text-3xl font-bold text-white mb-3 font-[family-name:var(--font-clash-display)]">{displayPart.name}</h4>
                  <p className="text-neutral-300 text-lg leading-relaxed max-w-md">{displayPart.impact}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-start pt-16"
                >
                   <div className="w-16 h-1 bg-white/10 rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
