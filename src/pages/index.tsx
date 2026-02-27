import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import LifeCycleScroll from "../components/LifeCycleScroll";

export default function Home() {
	const [isVisible, setIsVisible] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const { currentUser, userRole } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 100);

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			clearTimeout(timer);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

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
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Redirecting...</p>
				</div>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-primary particle-bg">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
				{/* Animated Background */}
				<div className="absolute inset-0">
					<div className="absolute inset-0 gradient-mesh opacity-20" />
					<div
						className="absolute w-96 h-96 rounded-full bg-neon-green/20 blur-3xl"
						style={{
							left: mousePosition.x - 192,
							top: mousePosition.y - 192,
							transition: "all 0.3s ease-out",
						}}
					/>
					<div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-neon-cyan/10 blur-3xl animate-float" />
					<div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-neon-purple/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
				</div>

				{/* Floating Elements */}
				<div className="absolute top-20 left-1/4 w-2 h-2 bg-neon-green rounded-full animate-float shadow-neon-green" />
				<div
					className="absolute top-1/3 right-1/4 w-1 h-1 bg-neon-cyan rounded-full animate-float shadow-neon-cyan"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-neon-purple rounded-full animate-float shadow-neon-purple"
					style={{ animationDelay: "2s" }}
				/>

				<div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
						className="space-y-8"
					>
						{/* Badge */}
						<motion.div 
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="inline-flex items-center gap-2 px-4 py-2 glass-neon rounded-full text-sm font-medium text-neon-green mb-8"
						>
							<span className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-neon-green" />
							Turning waste into wins
						</motion.div>

						{/* Main Heading */}
						<motion.h1 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.8 }}
							className="font-clash text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] mb-6 text-balance max-w-4xl mx-auto"
						>
							The future of{" "}
							<motion.span className="font-satoshi font-thin text-gradient">e-waste</motion.span>
							<br />
							starts with <em className="font-clash not-italic text-neon-cyan">you</em>
						</motion.h1>

						{/* Description */}
						<motion.p 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.8 }}
							className="text-base sm:text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed font-satoshi"
						>
							Join a global movement turning electronic waste into environmental
							wins. Gamified challenges, real impact, meaningful rewards.
						</motion.p>

						{/* CTA Buttons */}
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8, duration: 0.8 }}
							className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
						>
							<Link href="/login" className="btn btn-primary group w-full sm:w-auto">
								Start your journey
								<svg
									className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
							</Link>
							<Link href="/admin/login" className="btn btn-outline w-full sm:w-auto">
								Admin Access
							</Link>
						</motion.div>

						{/* Trust Indicators */}
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1, duration: 0.8 }}
							className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-neutral-500"
						>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-neon-green">50K+</span>
								<span>active users</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-neon-cyan">1M+</span>
								<span>challenges completed</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-neon-purple">500+</span>
								<span>cities worldwide</span>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Scroll Indicator */}
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2, duration: 0.8 }}
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
				>
					<div className="w-px h-16 bg-neon-green/50 relative">
						<div className="w-1 h-1 bg-neon-green rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse shadow-neon-green" />
					</div>
				</motion.div>
			</section>

			{/* LifeCycle Scroll Animation */}
			<LifeCycleScroll />

			{/* Mission Statement */}
			<section className="py-12 md:py-20 lg:py-24 bg-dark-gradient">
				<motion.div 
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-4xl mx-auto px-6 text-center"
				>
					<h2 className="font-clash text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neutral-300 mb-6 transition-all duration-1000 leading-tight">
						Every device has a story.{" "}
						<motion.span className="font-satoshi font-bold text-gradient">
							Every action
						</motion.span>{" "}
						has an impact.
					</h2>
					<p className="text-base md:text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto font-satoshi">
						We're transforming how the world thinks about electronic waste.
						Through gamification, education, and community action, we're making
						sustainability accessible, engaging, and rewarding.
					</p>
				</motion.div>
			</section>

			{/* Features Grid */}
			<section className="py-12 md:py-20 lg:py-24 bg-primary">
				<div className="max-w-6xl mx-auto px-6">
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16"
					>
						{/* Feature 1 */}
						<motion.div 
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1, duration: 0.6 }}
							className="space-y-4 lg:space-y-6 group"
						>
							<div className="w-12 h-12 bg-gradient-to-br from-neon-green to-neon-cyan rounded-xl flex items-center justify-center shadow-neon-green group-hover:scale-110 transition-transform duration-300">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
									/>
								</svg>
							</div>
							<div className="space-y-3">
								<h3 className="font-clash text-xl md:text-2xl lg:text-3xl text-neutral-300 leading-tight">
									Gamified Progress
								</h3>
								<p className="text-neutral-400 leading-relaxed text-base md:text-lg font-satoshi">
									Turn environmental action into an engaging experience. Earn
									points, unlock achievements, and climb leaderboards while
									making a real difference.
								</p>
								<Link
									href="/login"
									className="inline-flex items-center text-neon-green font-medium hover:text-neon-cyan transition-colors group font-satoshi"
								>
									Start earning points
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</motion.div>

						{/* Feature 2 */}
						<motion.div 
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="space-y-4 lg:space-y-6 group"
						>
							<div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-neon-cyan group-hover:scale-110 transition-transform duration-300">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<div className="space-y-3">
								<h3 className="font-clash text-xl md:text-2xl lg:text-3xl text-neutral-300 leading-tight">
									Impact Analytics
								</h3>
								<p className="text-neutral-400 leading-relaxed text-base md:text-lg font-satoshi">
									Track your environmental impact with detailed analytics. See
									exactly how your actions contribute to global sustainability
									goals.
								</p>
								<Link
									href="/login"
									className="inline-flex items-center text-neon-cyan font-medium hover:text-neon-purple transition-colors group font-satoshi"
								>
									View your impact
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</motion.div>

						{/* Feature 3 */}
						<motion.div 
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.6 }}
							className="space-y-4 lg:space-y-6 group"
						>
							<div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center shadow-neon-purple group-hover:scale-110 transition-transform duration-300">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.477 6.936 9 8.519 9 11v7a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.253l-4-4z"
									/>
								</svg>
							</div>
							<div className="space-y-3">
								<h3 className="font-clash text-xl md:text-2xl lg:text-3xl text-neutral-300 leading-tight">
									Expert Education
								</h3>
								<p className="text-neutral-400 leading-relaxed text-base md:text-lg font-satoshi">
									Learn from sustainability experts through interactive content,
									quizzes, and practical guides that make complex topics
									accessible.
								</p>
								<Link
									href="/login"
									className="inline-flex items-center text-neon-purple font-medium hover:text-neon-pink transition-colors group font-satoshi"
								>
									Start learning
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</motion.div>

						{/* Feature 4 */}
						<motion.div 
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.6 }}
							className="space-y-4 lg:space-y-6 group"
						>
							<div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-green rounded-xl flex items-center justify-center shadow-neon-pink group-hover:scale-110 transition-transform duration-300">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.477 6.936 9 8.519 9 11v7a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6.253l-4-4z"
									/>
								</svg>
							</div>
							<div className="space-y-3">
								<h3 className="font-clash text-xl md:text-2xl lg:text-3xl text-neutral-300 leading-tight">
									Expert Education
								</h3>
								<p className="text-neutral-400 leading-relaxed text-base md:text-lg font-satoshi">
									Learn from sustainability experts through interactive content,
									quizzes, and practical guides that make complex topics
									accessible.
								</p>
								<Link
									href="/login"
									className="inline-flex items-center text-neon-pink font-medium hover:text-neon-green transition-colors group font-satoshi"
								>
									Start learning
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</motion.div>
				</motion.div>
			</div>
			</section>
			<section className="py-12 md:py-20 lg:py-24 bg-dark-gradient">
				<motion.div 
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-6xl mx-auto px-6"
				>
					<div className="text-center mb-10 md:mb-12">
						<h2 className="font-clash text-2xl sm:text-3xl md:text-4xl text-neutral-300 mb-4 leading-tight">
							Trusted by change-makers worldwide
						</h2>
						<p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto font-satoshi">
							Join thousands who are already making a difference
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								quote:
									"EcoQuest made sustainability fun and achievable. I've recycled more e-waste in 3 months than I had in 3 years.",
								author: "Sarah Chen",
								role: "Environmental Engineer",
							},
							{
								quote:
								"The gamification aspect is brilliant. My whole family is now competing to see who can earn the most points.",
								author: "Marcus Johnson",
								role: "Tech Entrepreneur",
							},
							{
								quote:
								"Finally, a platform that makes environmental action feel rewarding rather than overwhelming.",
								author: "Dr. Priya Patel",
								role: "Sustainability Researcher",
							},
					].map((testimonial, index) => (
							<motion.div 
							key={index} 
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className="card p-6 h-full flex flex-col hover-lift"
							>
							<p className="text-neutral-400 mb-4 leading-relaxed flex-grow font-satoshi">
								"{testimonial.quote}"
							</p>
							<div className="mt-auto pt-4">
								<div className="font-semibold text-neutral-300 font-clash">
									{testimonial.author}
							</div>
							<div className="text-sm text-neutral-500 font-satoshi">
								{testimonial.role}
							</div>
							</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>
			{/* Final CTA */}
			<section className="py-16 md:py-24 lg:py-32 bg-primary text-white relative overflow-hidden">
				<div className="absolute inset-0 gradient-mesh opacity-10" />

				<motion.div 
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="relative z-10 max-w-5xl mx-auto text-center px-6"
				>
					<h2 className="font-clash text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-8 text-balance leading-tight">
						Ready to transform{" "}
						<motion.span className="font-satoshi font-bold text-gradient">
							the future
						</motion.span>
						?
					</h2>
					<p className="text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto font-satoshi">
						Join the movement that's making sustainability engaging, rewarding,
						and accessible to everyone.
					</p>

					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.6 }}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
					>
						<Link
							href="/login"
							className="btn btn-primary group w-full sm:w-auto"
						>
							Get started free
							<svg
								className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
						</Link>
						<Link
							href="/admin/login"
							className="btn btn-outline w-full sm:w-auto"
						>
							Admin Access
						</Link>
					</motion.div>

					<motion.div 
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						className="text-neutral-500 text-sm font-satoshi"
					>
						No credit card required • Free forever • Start making an impact
						today
					</motion.div>
				</motion.div>
			</section>
		</main>
	);
}
