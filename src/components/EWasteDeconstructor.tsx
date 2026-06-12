"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const devices = {
  smartphone: {
    name: "Smartphone",
    width: 240,
    height: 340,
    smWidth: 280,
    smHeight: 400,
    parts: [
      { id: 'screen', name: 'Glass Screen', points: '+50 pts', impact: 'Saves 2kg CO2', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', img: '/images/deconstructor/smartphone_screen.png' },
      { id: 'battery', name: 'Lithium Battery', points: '+120 pts', impact: 'Prevents 5g toxicity', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30', img: '/images/deconstructor/smartphone_battery.png' },
      { id: 'board', name: 'Motherboard', points: '+200 pts', impact: 'Recycles rare earth metals', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', img: '/images/deconstructor/smartphone_board.png' }
    ]
  },
  laptop: {
    name: "Laptop",
    width: 320,
    height: 200,
    smWidth: 420,
    smHeight: 260,
    parts: [
      { id: 'screen', name: 'LCD Display', points: '+150 pts', impact: 'Saves 8kg CO2', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/30', img: '/images/deconstructor/laptop_screen.png' },
      { id: 'battery', name: 'Large Li-ion', points: '+300 pts', impact: 'Prevents 20g toxicity', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30', img: '/images/deconstructor/laptop_battery.png' },
      { id: 'board', name: 'Mainboard', points: '+400 pts', impact: 'Recycles 1g Gold', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', img: '/images/deconstructor/laptop_board.png' }
    ]
  }
};

type DeviceType = keyof typeof devices;

export default function EWasteDeconstructor() {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('smartphone');
  const [isHovered, setIsHovered] = useState(false);

  const device = devices[activeDevice];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center py-12">
      
      {/* Device Selector */}
      <div className="flex gap-4 mb-12 relative z-20">
        {(Object.keys(devices) as DeviceType[]).map((dev) => (
          <button
            key={dev}
            onClick={() => {
              setActiveDevice(dev);
              setIsHovered(false); // Reset hover state on switch
            }}
            className={`px-6 py-2 rounded-full text-sm font-[family-name:var(--font-satoshi)] font-medium transition-all duration-300 ${
              activeDevice === dev 
                ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.2)]' 
                : 'bg-surface-2 text-neutral-400 border border-white/5 hover:text-white'
            }`}
          >
            {devices[dev].name}
          </button>
        ))}
      </div>

      {/* Interactive Canvas */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-[2rem] border border-white/5 bg-surface-1/50 overflow-hidden group cursor-crosshair flex items-center justify-center transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/5 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.05)_0%,transparent_70%)]" />
        
        {/* Instruction overlay */}
        <div className={`absolute top-8 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-neutral-500 text-sm tracking-widest uppercase font-bold flex items-center gap-3 font-[family-name:var(--font-satoshi)]">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" /> 
            Hover to deconstruct
          </p>
        </div>

        {/* The Device Components */}
        <motion.div 
          layout
          className="relative perspective-[1200px]"
          style={{ 
            width: `var(--dev-width)`, 
            height: `var(--dev-height)`
          } as React.CSSProperties}
        >
          {/* Injecting CSS vars for responsive sizing */}
          <style dangerouslySetInnerHTML={{__html: `
            .perspective-\\[1200px\\] {
              --dev-width: ${device.width}px;
              --dev-height: ${device.height}px;
            }
            @media (min-width: 640px) {
              .perspective-\\[1200px\\] {
                --dev-width: ${device.smWidth}px;
                --dev-height: ${device.smHeight}px;
              }
            }
          `}} />

          {/* Base Layer (Motherboard) */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isHovered ? 55 : 0,
              rotateZ: isHovered ? -25 : 0,
              z: isHovered ? -100 : 0,
              y: isHovered ? (activeDevice === 'laptop' ? 120 : 80) : 0,
              x: isHovered ? (activeDevice === 'laptop' ? 80 : 60) : 0,
              opacity: isHovered ? 0.9 : 1
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 rounded-3xl bg-black border border-white/10 ${isHovered ? device.parts[2].border : ''} shadow-2xl flex items-center justify-center overflow-hidden`}
          >
            {/* Real Image with mix-blend-screen to remove black background */}
            <div className="absolute inset-0 mix-blend-screen opacity-90 p-2">
              <Image src={device.parts[2].img} alt={device.parts[2].name} fill className="object-cover rounded-2xl" />
            </div>
            {/* Tint overlay for styling consistency */}
            <div className={`absolute inset-0 bg-gradient-to-br ${device.parts[2].color} mix-blend-overlay opacity-50 pointer-events-none`} />
            
            {/* Tooltip */}
            <motion.div 
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? (activeDevice === 'laptop' ? 220 : 160) : 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="absolute left-[90%] top-1/4 min-w-[220px] pointer-events-none hidden sm:block z-50"
            >
              <div className="bg-surface-2/90 backdrop-blur-md border border-amber-500/30 p-4 rounded-2xl shadow-xl">
                <div className="text-amber-500 font-bold mb-1 font-[family-name:var(--font-clash-display)]">{device.parts[2].name}</div>
                <div className="text-[#00ff88] font-mono text-sm mb-1 bg-[#00ff88]/10 inline-block px-2 py-0.5 rounded">{device.parts[2].points}</div>
                <div className="text-neutral-400 text-xs font-[family-name:var(--font-satoshi)] mt-2">{device.parts[2].impact}</div>
              </div>
              <svg className="absolute top-6 -left-12 w-12 h-px text-amber-500/50"><line x1="0" y1="0" x2="48" y2="0" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" /></svg>
            </motion.div>
          </motion.div>

          {/* Middle Layer (Battery) */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isHovered ? 55 : 0,
              rotateZ: isHovered ? -25 : 0,
              z: isHovered ? 20 : 0,
              y: isHovered ? 0 : 0,
              x: isHovered ? 0 : 0,
              scale: isHovered ? 0.85 : 0.95
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-[5%] left-[5%] right-[5%] bottom-[5%] rounded-2xl bg-black border border-white/10 ${isHovered ? device.parts[1].border : ''} shadow-lg flex items-center justify-center overflow-hidden`}
          >
            {/* Real Image */}
            <div className="absolute inset-0 mix-blend-screen opacity-90 p-2">
               <Image src={device.parts[1].img} alt={device.parts[1].name} fill className="object-cover rounded-xl" />
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br ${device.parts[1].color} mix-blend-overlay opacity-50 pointer-events-none`} />

            {/* Tooltip */}
            <motion.div 
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? (activeDevice === 'laptop' ? -240 : -180) : 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute right-[90%] top-1/3 min-w-[220px] pointer-events-none text-right hidden sm:block z-50"
            >
              <div className="bg-surface-2/90 backdrop-blur-md border border-emerald-500/30 p-4 rounded-2xl shadow-xl flex flex-col items-end">
                <div className="text-emerald-500 font-bold mb-1 font-[family-name:var(--font-clash-display)]">{device.parts[1].name}</div>
                <div className="text-[#00ff88] font-mono text-sm mb-1 bg-[#00ff88]/10 inline-block px-2 py-0.5 rounded">{device.parts[1].points}</div>
                <div className="text-neutral-400 text-xs font-[family-name:var(--font-satoshi)] mt-2">{device.parts[1].impact}</div>
              </div>
              <svg className="absolute top-6 -right-12 w-12 h-px text-emerald-500/50"><line x1="0" y1="0" x2="48" y2="0" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" /></svg>
            </motion.div>
          </motion.div>

          {/* Top Layer (Screen) */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isHovered ? 55 : 0,
              rotateZ: isHovered ? -25 : 0,
              z: isHovered ? 140 : 0,
              y: isHovered ? (activeDevice === 'laptop' ? -120 : -80) : 0,
              x: isHovered ? (activeDevice === 'laptop' ? -80 : -60) : 0,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 rounded-3xl bg-black border border-white/10 ${isHovered ? device.parts[0].border : ''} shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden`}
          >
             {/* Real Image */}
             <div className="absolute inset-0 mix-blend-screen opacity-100 p-1">
               <Image src={device.parts[0].img} alt={device.parts[0].name} fill className="object-cover rounded-[1.25rem]" />
             </div>
             
             {/* Device screen reflection effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-3xl pointer-events-none mix-blend-lighten" />
             <div className={`absolute inset-0 bg-gradient-to-br ${device.parts[0].color} mix-blend-overlay opacity-30 pointer-events-none`} />

            {/* Tooltip */}
            <motion.div 
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? -80 : 0, x: isHovered ? -100 : 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-[90%] left-[10%] min-w-[220px] pointer-events-none hidden sm:block z-50"
            >
              <div className="bg-surface-2/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-2xl shadow-xl">
                <div className="text-blue-400 font-bold mb-1 font-[family-name:var(--font-clash-display)]">{device.parts[0].name}</div>
                <div className="text-[#00ff88] font-mono text-sm mb-1 bg-[#00ff88]/10 inline-block px-2 py-0.5 rounded">{device.parts[0].points}</div>
                <div className="text-neutral-400 text-xs font-[family-name:var(--font-satoshi)] mt-2">{device.parts[0].impact}</div>
              </div>
              <svg className="absolute -bottom-8 left-12 w-px h-8 text-blue-500/50"><line x1="0" y1="0" x2="0" y2="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" /></svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
