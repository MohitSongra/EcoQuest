import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
	const [isVisible, setIsVisible] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
				{/* Animated Background */}
				<div className="absolute inset-0">
					<div className="absolute inset-0 gradient-mesh opacity-5" />
					<div
						className="absolute w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl"
						style={{
							left: mousePosition.x - 192,
							top: mousePosition.y - 192,
							transition: "all 0.3s ease-out",
						}}
					/>
				</div>

				{/* Floating Elements */}
				<div className="absolute top-20 left-1/4 w-2 h-2 bg-black rounded-full animate-float" />
				<div
					className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-500 rounded-full animate-float"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-black rounded-full animate-float"
					style={{ animationDelay: "2s" }}
				/>

				<div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
					<div
						className={`transition-all duration-1000 ease-out ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
					>
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm font-medium text-neutral-600 mb-8">
							<span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
							Turning waste into wins
						</div>

						{/* Main Heading */}
						<h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.1] mb-6 text-balance max-w-4xl mx-auto">
							The future of{" "}
							<span className="font-sans font-thin text-gradient">e-waste</span>
							<br />
							starts with <em className="font-serif not-italic">you</em>
						</h1>

						{/* Description */}
						<p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
							Join a global movement turning electronic waste into environmental
							wins. Gamified challenges, real impact, meaningful rewards.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
							<Link href="/dashboard" className="btn btn-primary group w-full sm:w-auto">
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
							<Link href="/challenges" className="btn btn-outline w-full sm:w-auto">
								Explore challenges
							</Link>
						</div>

						{/* Trust Indicators */}
						<div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-neutral-500">
							<div className="flex items-center gap-2">
								<span className="font-semibold text-neutral-900">50K+</span>
								<span>active users</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-neutral-900">1M+</span>
								<span>challenges completed</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-semibold text-neutral-900">500+</span>
								<span>cities worldwide</span>
							</div>
						</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
					<div className="w-px h-16 bg-neutral-200 relative">
						<div className="w-1 h-1 bg-neutral-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse" />
					</div>
				</div>
			</section>

			{/* Mission Statement */}
			<section className="py-12 md:py-20 lg:py-24 bg-neutral-50">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<h2
						className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-6 transition-all duration-1000 leading-tight ${
							isVisible ? "animate-fade-up" : "opacity-0"
						}`}
					>
						Every device has a story.{" "}
						<span className="font-sans font-bold text-gradient">
							Every action
						</span>{" "}
						has an impact.
					</h2>
					<p className="text-base md:text-lg lg:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
						We're transforming how the world thinks about electronic waste.
						Through gamification, education, and community action, we're making
						sustainability accessible, engaging, and rewarding.
					</p>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-12 md:py-20 lg:py-24 bg-white">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
						{/* Feature 1 */}
						<div className="space-y-4 lg:space-y-6">
							<div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
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
								<h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-neutral-900 leading-tight">
									Gamified Progress
								</h3>
								<p className="text-neutral-600 leading-relaxed text-base md:text-lg">
									Turn environmental action into an engaging experience. Earn
									points, unlock achievements, and climb leaderboards while
									making a real difference.
								</p>
								<Link
									href="/dashboard"
									className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors group"
								>
									Start earning points
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="space-y-4 lg:space-y-6">
							<div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
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
								<h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-neutral-900 leading-tight">
									Impact Analytics
								</h3>
								<p className="text-neutral-600 leading-relaxed text-base md:text-lg">
									Track your environmental impact with detailed analytics. See
									exactly how your actions contribute to global sustainability
									goals.
								</p>
								<Link
									href="/dashboard"
									className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors group"
								>
									View your impact
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</div>

						{/* Feature 3 */}
						<div className="space-y-4 lg:space-y-6">
							<div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</div>
							<div className="space-y-3">
								<h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-neutral-900 leading-tight">
									Global Community
								</h3>
								<p className="text-neutral-600 leading-relaxed text-base md:text-lg">
									Connect with environmentally conscious individuals worldwide.
									Share achievements, learn from others, and amplify your
									impact.
								</p>
								<Link
									href="/challenges"
									className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors group"
								>
									Join the community
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</div>

						{/* Feature 4 */}
						<div className="space-y-4 lg:space-y-6">
							<div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<div className="space-y-3">
								<h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-neutral-900 leading-tight">
									Expert Education
								</h3>
								<p className="text-neutral-600 leading-relaxed text-base md:text-lg">
									Learn from sustainability experts through interactive content,
									quizzes, and practical guides that make complex topics
									accessible.
								</p>
								<Link
									href="/quizzes"
									className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors group"
								>
									Start learning
									<svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Social Proof */}
			<section className="py-12 md:py-20 lg:py-24 bg-neutral-50">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center mb-10 md:mb-12">
						<h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight">
							Trusted by change-makers worldwide
						</h2>
						<p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
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
							<div key={index} className="card p-6 h-full flex flex-col">
								<p className="text-neutral-700 mb-4 leading-relaxed flex-grow">
									"{testimonial.quote}"
								</p>
								<div className="mt-auto pt-4">
									<div className="font-semibold text-neutral-900">
										{testimonial.author}
									</div>
									<div className="text-sm text-neutral-500">
										{testimonial.role}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-16 md:py-24 lg:py-32 bg-black text-white relative overflow-hidden">
				<div className="absolute inset-0 gradient-mesh opacity-10" />

				<div className="relative z-10 max-w-5xl mx-auto text-center px-6">
					<h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-8 text-balance leading-tight">
						Ready to transform{" "}
						<span className="font-sans font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
							the future
						</span>
						?
					</h2>
					<p className="text-lg md:text-xl text-neutral-300 mb-12 leading-relaxed max-w-3xl mx-auto">
						Join the movement that's making sustainability engaging, rewarding,
						and accessible to everyone.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
						<Link
							href="/dashboard"
							className="btn bg-white text-black hover:bg-neutral-100 w-full sm:w-auto"
						>
							Get started free
						</Link>
						<Link
							href="/challenges"
							className="btn bg-transparent text-white border-2 border-white hover:bg-white hover:text-black w-full sm:w-auto"
						>
							Explore challenges
						</Link>
					</div>

					<div className="text-neutral-400 text-sm">
						No credit card required • Free forever • Start making an impact
						today
					</div>
				</div>
			</section>
		</main>
	);
}
