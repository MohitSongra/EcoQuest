import React, { useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform } from "framer-motion";
import LifeCycleScroll from "../components/LifeCycleScroll";
import EWasteDeconstructor from "../components/EWasteDeconstructor";

export default function Home() {
  const { currentUser, userRole } = useAuth();
  const router = useRouter();
  
  // Parallax Scroll Hooks for Hero
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -250]);
  const y3 = useTransform(scrollY, [0, 500], [0, -80]);
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0]);

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (currentUser) {
      if (userRole?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [currentUser, userRole, router]);

  // Show loading while checking auth
  if (currentUser) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-canvas selection:bg-accent/30 selection:text-white">
      <Head>
        <title>EcoQuest — Turn E-Waste Into Environmental Wins</title>
        <meta name="description" content="Join a global movement turning electronic waste into environmental wins." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24">
        {/* Subtle Ambient Glow that fades on scroll */}
        <motion.div 
          style={{ opacity: opacityFade }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] pointer-events-none"
        >
          <div className="absolute inset-0 bg-spotlight-emerald blur-3xl mix-blend-screen opacity-30" />
        </motion.div>

        {/* Floating UI Widget 1 (Top Left) */}
        <motion.div
          style={{ y: y1, opacity: opacityFade }}
          className="hidden lg:flex absolute top-[20%] left-[5%] xl:left-[10%] z-20 flex-col items-center p-5 bg-surface-1/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-floating"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">Carbon Offset</div>
          <div className="text-3xl font-medium text-accent">1,204 <span className="text-lg text-ink-muted">kg</span></div>
        </motion.div>

        {/* Floating UI Widget 2 (Bottom Right) */}
        <motion.div
          style={{ y: y2, opacity: opacityFade }}
          className="hidden lg:flex absolute bottom-[15%] right-[5%] xl:right-[10%] z-20 items-center gap-4 p-4 bg-surface-1/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-floating"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
            <span className="text-xl">💻</span>
          </div>
          <div>
            <div className="text-sm font-medium text-white">MacBook Pro 2019</div>
            <div className="text-xs text-accent">Recycled Successfully</div>
          </div>
        </motion.div>

        {/* Floating UI Widget 3 (Top Right) */}
        <motion.div
          style={{ y: y3, opacity: opacityFade }}
          className="hidden md:flex absolute top-[20%] right-[5%] xl:right-[15%] z-0 items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/5 rounded-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-white">Live Impact Tracking</span>
        </motion.div>
        
        {/* Floating UI Widget 4 (Bottom Left) */}
        <motion.div
          style={{ y: y2, opacity: opacityFade }}
          className="hidden md:flex absolute bottom-[20%] left-[5%] xl:left-[15%] z-0 items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/5 rounded-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs font-medium text-white">🏆 +500 pts earned</span>
        </motion.div>

        {/* Main Hero Content (Parallaxes slightly slower) */}
        <motion.div 
          style={{ y: y3, opacity: opacityFade }}
          className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-ink-muted mb-8"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Introducing EcoQuest 2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="display-hero text-white mb-6 max-w-5xl drop-shadow-2xl"
          >
            The end of <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,theme(colors.emerald.400),theme(colors.teal.300))] italic pr-2">e-waste</span> starts here.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="body-editorial mb-10 max-w-2xl"
          >
            Turn forgotten devices into global environmental impact. 
            Join the platform that gamifies sustainability and rewards real-world action.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{ opacity: opacityFade }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-ink-muted uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
              animate={{ y: [0, 48] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>
      </section>

      {/* LifeCycle Scroll Animation (The Journey) */}
      <div id="how-it-works">
        <LifeCycleScroll />
      </div>

      {/* Value Proposition (Framer Style Oversized Cards) */}
      <section className="py-24 md:py-32 px-6 max-w-[1440px] mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="display-section text-white mb-6">Designed for impact.</h2>
          <p className="body-editorial max-w-2xl mx-auto">
            Everything you need to track, measure, and scale your environmental footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="lg:col-span-2 w-full mb-12">
            <EWasteDeconstructor />
          </div>
          
          {/* Full Width Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 card-surface p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center gap-12"
          >
            <div className="flex-1">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-4">
                Community Rewards.
              </h3>
              <p className="body-editorial mb-8 max-w-lg">
                Redeem your hard-earned points for exclusive rewards, discounts, and real prizes. Your eco-actions have tangible value.
              </p>
              <Link href="/login" className="btn-secondary">
                View Rewards Catalog
              </Link>
            </div>
            
            {/* Abstract visual representation of rewards */}
            <div className="flex-1 w-full h-[300px] bg-surface-2 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-24 h-24 rounded-full border border-white/20 backdrop-blur-xl flex items-center justify-center bg-surface-1/50 shadow-floating`} style={{ zIndex: 4 - i }}>
                    <span className="text-white font-medium">{i * 100}pt</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 md:py-32 px-6 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="display-section text-white mb-6">
              Trusted by change-makers.
            </h2>
            <p className="body-editorial max-w-2xl mx-auto">
              Join thousands who are already making a difference worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "EcoQuest made sustainability fun. I've recycled more e-waste in 3 months than I had in 3 years.",
                author: "Sarah Chen",
                role: "Environmental Engineer",
              },
              {
                quote: "The gamification aspect is brilliant. My whole family is now competing to see who can earn the most points.",
                author: "Marcus Johnson",
                role: "Tech Entrepreneur",
              },
              {
                quote: "Finally, a platform that makes environmental action feel rewarding rather than overwhelming.",
                author: "Dr. Priya Patel",
                role: "Sustainability Researcher",
              },
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card-surface p-8 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="text-accent mb-6">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                    <path d="M13.4615 13.8462H8.53846C8.53846 11.1231 10.7462 8.91538 13.4615 8.91538V4C8.02308 4 3.61538 8.40769 3.61538 13.8462V20H13.4615V13.8462ZM28.2308 13.8462H23.3077C23.3077 11.1231 25.5154 8.91538 28.2308 8.91538V4C22.7923 4 18.3846 8.40769 18.3846 13.8462V20H28.2308V13.8462Z" />
                  </svg>
                </div>
                <p className="text-lg text-white/90 leading-relaxed flex-grow mb-8 font-medium">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-medium text-white tracking-tight">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-ink-muted">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 md:py-48 px-6 text-center border-t border-white/5 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-spotlight-teal blur-3xl mix-blend-screen" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h2 className="display-section text-white mb-8">
            Ready to build the future?
          </h2>
          <p className="body-editorial mb-12 max-w-2xl mx-auto">
            Join the movement that's making sustainability engaging, rewarding, and accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-primary px-10 py-4 text-base">
              Get Started Free
            </Link>
          </div>
          <p className="mt-8 text-sm text-ink-muted">
            No credit card required. Free forever. Start making an impact today.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
