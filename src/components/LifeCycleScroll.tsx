import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion';

interface TextOverlay {
  start: number;
  end: number;
  text: string;
  showCTA?: boolean;
}

const textOverlays: TextOverlay[] = [
  { start: 0, end: 0.2, text: "It starts with one action." },
  { start: 0.25, end: 0.45, text: "Unlock the potential." },
  { start: 0.5, end: 0.7, text: "Nurture the future." },
  { start: 0.75, end: 1.0, text: "EcoQuest: Your Legacy Begins.", showCTA: true },
];

export default function LifeCycleScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const currentFrameRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Map scroll progress to frame index (0-132 for 133 frames)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 132]);

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];
      
      for (let i = 1; i <= 133; i++) {
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = `/img/ezgif-frame-${i.toString().padStart(3, '0')}.webp`;
          img.onload = () => {
            setLoadingProgress((prev) => Math.min(prev + (100 / 133), 99));
            resolve(img);
          };
          img.onerror = reject;
        });
        imagePromises.push(promise);
      }

      try {
        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
        setLoadingProgress(100);
        setTimeout(() => setIsLoading(false), 500);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  // Set canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current && images.length > 0) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Use first image to determine aspect ratio
          const firstImage = images[0];
          const aspectRatio = firstImage.width / firstImage.height;
          
          // Set canvas to full viewport size
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          
          setCanvasSize({ width: canvas.width, height: canvas.height });
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [images]);

  // Animation loop for smooth rendering
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx && images.length > 0) {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get current frame with clamping
      const frame = Math.max(0, Math.min(Math.floor(frameIndex.get()), 132));
      currentFrameRef.current = frame;
      
      // Draw current frame centered and scaled
      const img = images[frame];
      if (img) {
        // Calculate scaled dimensions to fit canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // Calculate centered position
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [images, frameIndex]);

  // Start animation loop when images are loaded
  useEffect(() => {
    if (!isLoading && images.length > 0) {
      animate();
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isLoading, images, animate]);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-primary z-50 flex items-center justify-center">
          <div className="text-center relative z-10">
            <div className="w-16 h-16 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-neon-green"></div>
            <p className="text-neon-green text-lg font-light tracking-wide font-clash animate-neon-flicker">Loading Resources...</p>
            <p className="text-neon-cyan/60 text-sm mt-2 font-satoshi">{Math.round(loadingProgress)}%</p>
          </div>
        </div>
      )}

      {/* Main Scroll Container */}
      <div ref={containerRef} className="relative bg-primary">
        {/* 500vh scroll container */}
        <div className="h-[500vh] relative">
          {/* Sticky Canvas */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>

          {/* Text Overlays */}
          {textOverlays.map((overlay, index) => (
            <motion.div
              key={index}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
              style={{
                position: 'absolute',
                top: `${overlay.start * 500}vh`,
                height: `${(overlay.end - overlay.start) * 100}vh`,
                zIndex: 10
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: scrollYProgress.get() >= overlay.start && scrollYProgress.get() <= overlay.end ? 1 : 0,
                  y: scrollYProgress.get() >= overlay.start && scrollYProgress.get() <= overlay.end ? 0 : 20
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center px-6 max-w-4xl mx-auto"
              >
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-8 font-clash">
                  {overlay.text.split(' ').map((word, wordIndex) => (
                    <motion.span
                      key={wordIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: scrollYProgress.get() >= overlay.start && scrollYProgress.get() <= overlay.end ? 1 : 0,
                        y: scrollYProgress.get() >= overlay.start && scrollYProgress.get() <= overlay.end ? 0 : 20
                      }}
                      transition={{ delay: wordIndex * 0.1, duration: 0.6 }}
                      className={wordIndex === overlay.text.split(' ').length - 1 ? 'text-neon-green font-bold' : ''}
                    >
                      {word}{' '}
                    </motion.span>
                  ))}
                </h2>
                
                {overlay.showCTA && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="pointer-events-auto"
                  >
                    <a
                      href="/login"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-neon-green to-neon-cyan text-primary font-semibold rounded-full hover:from-neon-cyan hover:to-neon-green transition-all duration-300 hover:scale-105 tracking-wide font-satoshi shadow-neon-green hover:shadow-neon-cyan"
                    >
                      Join Now
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
