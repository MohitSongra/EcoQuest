import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import Link from 'next/link';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const FRAME_COUNT = 133;

/**
 * Total height of the scroll runway in vh units.
 * 600vh ≈ 6 full screens of scroll travel. Combined with Lenis's lerp
 * interpolation this gives approximately 8-12 seconds of animation at
 * comfortable scroll speed — matching the pacing of Apple/Stripe experiences.
 */
const SCROLL_HEIGHT_VH = 600;

interface TextOverlay {
  start: number;
  end: number;
  text: string;
  showCTA?: boolean;
}

const textOverlays: TextOverlay[] = [
  { start: 0.0,  end: 0.2,  text: "It starts with one action." },
  { start: 0.25, end: 0.45, text: "Unlock the potential." },
  { start: 0.5,  end: 0.7,  text: "Nurture the future." },
  { start: 0.75, end: 0.95, text: "EcoQuest: Your Legacy Begins.", showCTA: true },
];

/* ─── Text Overlay Component ────────────────────────────────────────────── */

function TextOverlayItem({
  overlay,
  scrollYProgress,
}: {
  overlay: TextOverlay;
  scrollYProgress: MotionValue<number>;
}) {
  const fadeIn  = overlay.start + 0.02;
  const fadeOut = overlay.end   - 0.02;

  const opacity = useTransform(
    scrollYProgress,
    [overlay.start, fadeIn, fadeOut, overlay.end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [overlay.start, fadeIn, fadeOut, overlay.end],
    [40, 0, 0, -40]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity }}
    >
      <motion.div style={{ y }} className="text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white tracking-tight mb-8 font-[family-name:var(--font-clash-display)] drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
          {overlay.text.split(' ').map((word, i, arr) => (
            <span
              key={i}
              className={i === arr.length - 1 ? 'text-[#00ff88] font-bold' : ''}
            >
              {word}{' '}
            </span>
          ))}
        </h2>

        {overlay.showCTA && (
          <motion.div className="pointer-events-auto" style={{ opacity }}>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-black font-semibold rounded-full hover:from-[#00ffff] hover:to-[#00ff88] transition-all duration-300 hover:scale-105 tracking-wide font-[family-name:var(--font-satoshi)] shadow-[0_0_20px_rgba(0,255,136,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)]"
            >
              Join Now
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */

export default function LifeCycleScroll() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef<number>(-1);

  const [images,          setImages]          = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading,       setIsLoading]       = useState(true);
  const [hasError,        setHasError]        = useState(false);

  /*
   * CRITICAL: useScroll targets containerRef which is ALWAYS in the DOM.
   * The scroll runway (h-[600vh]) is also always rendered — never conditionally
   * toggled. This ensures Framer Motion measures the correct container height
   * from the very first frame and never needs to remeasure after a layout shift.
   *
   * offset: 'start start' → progress=0 when container top hits viewport top
   *         'end end'     → progress=1 when container bottom hits viewport bottom
   *
   * Net scroll distance = 600vh - 100vh = 500vh ≈ 5 full screens of travel.
   */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* ─── Image Preloading ──────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      let loadedCount = 0;

      const promises = Array.from({ length: FRAME_COUNT }, (_, i) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = `/img/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`;
          img.onload = img.onerror = () => {
            loadedCount++;
            if (!cancelled) setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            resolve(img);
          };
        })
      );

      const loaded = await Promise.all(promises);
      if (cancelled) return;

      const valid = loaded.filter((img) => img.complete && img.naturalWidth > 0);
      if (valid.length === 0) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      setImages(valid);
      setLoadingProgress(100);
      setTimeout(() => { if (!cancelled) setIsLoading(false); }, 400);
    })();

    return () => { cancelled = true; };
  }, []);

  /* ─── Canvas Sizing ─────────────────────────────────────────────────── */
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        lastFrameRef.current = -1; // force redraw
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ─── Frame Renderer ────────────────────────────────────────────────── */
  const renderFrame = useCallback(
    (frameValue: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx || images.length === 0) return;

      const frame = Math.max(0, Math.min(Math.round(frameValue), images.length - 1));
      if (frame === lastFrameRef.current) return;
      lastFrameRef.current = frame;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      const img = images[frame];
      if (img?.naturalWidth) {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const sw = img.naturalWidth  * scale;
        const sh = img.naturalHeight * scale;
        ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
      }
    },
    [images]
  );

  /* ─── Scroll → Frame Mapping ────────────────────────────────────────── */
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (images.length > 0) {
      renderFrame(latest * (images.length - 1));
    }
  });

  /* Draw frame 0 once images arrive */
  useEffect(() => {
    if (!isLoading && images.length > 0) renderFrame(0);
  }, [isLoading, images, renderFrame]);

  if (hasError) return null;

  /*
   * LAYOUT STRUCTURE (always fully rendered — never conditionally toggled):
   *
   *   <containerRef>                        ← useScroll target
   *     <div h-[600vh]>                     ← scroll runway (always present)
   *       <div sticky top-0 h-screen>      ← pinned viewport
   *         <canvas>                        ← frame renderer
   *         <gradient-overlay>              ← vignette for text readability
   *         <TextOverlayItem × 4>           ← scroll-driven text
   *         <loading-overlay>               ← fades out when images are ready
   *       </div>
   *     </div>
   *   </containerRef>
   *
   * The loading overlay sits INSIDE the sticky container so the scroll runway
   * maintains its full height throughout. When the user scrolls during loading
   * the sticky container stays pinned but shows the loading UI. Once images
   * load, the overlay fades away and the canvas starts rendering.
   */
  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      aria-label="E-waste lifecycle animation"
    >
      <div style={{ height: `${SCROLL_HEIGHT_VH}vh` }} className="relative">
        {/* Sticky viewport — pinned to screen while scrolling through runway */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'transform' }}
            aria-hidden="true"
          />

          {/* Dark vignette for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

          {/* Text overlays — driven by scroll progress */}
          {textOverlays.map((overlay, index) => (
            <TextOverlayItem
              key={index}
              overlay={overlay}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* Loading overlay — sits on top of everything, fades out */}
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="spinner-neon mx-auto mb-6" />
                <p className="text-[#00ff88] text-lg font-light tracking-wide font-[family-name:var(--font-clash-display)]">
                  Loading Experience...
                </p>
                <div className="w-48 h-1 bg-[rgba(0,255,136,0.1)] rounded-full mx-auto mt-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00ff88] to-[#00ffff] rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-neutral-500 text-sm mt-2 font-[family-name:var(--font-satoshi)]">
                  {loadingProgress}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
