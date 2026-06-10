import React from "react";
import Navigation from "./Navigation";
import Link from "next/link";
import Head from "next/head";

import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-clash-display",
	display: "swap",
	weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-satoshi",
	display: "swap",
	weight: ["300", "400", "500", "700"],
});

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div
			className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-primary font-[family-name:var(--font-satoshi)]`}
		>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#000000" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{/* Skip to content for accessibility */}
			<a href="#main-content" className="skip-to-content">
				Skip to content
			</a>

			<Navigation />
			<main id="main-content">{children}</main>

			{/* Enhanced Footer */}
			<footer className="relative bg-primary text-neutral-300 overflow-hidden border-t border-[rgba(0,255,136,0.15)]">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10 pointer-events-none">
					<div className="absolute inset-0 gradient-mesh" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,255,136,0.15)_1px,transparent_0)] bg-[length:30px_30px]" />
				</div>

				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						{/* Brand Section */}
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 glass-neon rounded-2xl flex items-center justify-center shadow-neon-green">
									<span className="text-[#00ff88] font-bold text-xl" aria-hidden="true">♻</span>
								</div>
								<div>
									<h3 className="font-[family-name:var(--font-clash-display)] text-xl font-bold text-gradient">EcoQuest</h3>
									<p className="text-neutral-500 text-sm font-[family-name:var(--font-satoshi)]">
										Making recycling fun and rewarding
									</p>
								</div>
							</div>
							<p className="text-neutral-400 max-w-md font-[family-name:var(--font-satoshi)]">
								Join thousands of environmental champions in the mission to
								reduce e-waste and create a sustainable future for our planet.
							</p>
						</div>

						{/* Quick Links */}
						<div>
							<h4 className="font-[family-name:var(--font-clash-display)] font-semibold mb-4 text-neutral-200">Quick Links</h4>
							<ul className="space-y-2">
								<li>
									<Link
										href="/dashboard"
										className="text-neutral-400 hover:text-[#00ff88] transition-colors font-[family-name:var(--font-satoshi)]"
									>
										Dashboard
									</Link>
								</li>
								<li>
									<Link
										href="/rewards"
										className="text-neutral-400 hover:text-[#00ffff] transition-colors font-[family-name:var(--font-satoshi)]"
									>
										Rewards
									</Link>
								</li>
								<li>
									<Link
										href="/login"
										className="text-neutral-400 hover:text-[#ff00ff] transition-colors font-[family-name:var(--font-satoshi)]"
									>
										Get Started
									</Link>
								</li>
							</ul>
						</div>

						{/* Contact */}
						<div>
							<h4 className="font-[family-name:var(--font-clash-display)] font-semibold mb-4 text-neutral-200">Get in Touch</h4>
							<ul className="space-y-2">
								<li className="flex items-center space-x-2 text-neutral-400 font-[family-name:var(--font-satoshi)]">
									<span className="text-[#00ff88]" aria-hidden="true">📧</span>
									<a href="mailto:hello@ecoquest.app" className="hover:text-[#00ff88] transition-colors">hello@ecoquest.app</a>
								</li>
								<li className="flex items-center space-x-2 text-neutral-400 font-[family-name:var(--font-satoshi)]">
									<span className="text-[#00ffff]" aria-hidden="true">🌐</span>
									<span>www.ecoquest.app</span>
								</li>
								<li className="flex items-center space-x-2 text-neutral-400 font-[family-name:var(--font-satoshi)]">
									<span className="text-[#ff00ff]" aria-hidden="true">📱</span>
									<a href="tel:+15551234567" className="hover:text-[#ff00ff] transition-colors">+1 (555) 123-4567</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Section */}
					<div className="border-t border-[rgba(0,255,136,0.15)] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-neutral-500 text-sm text-center md:text-left font-[family-name:var(--font-satoshi)]">
							♻ Making e-waste recycling fun and rewarding since 2024
						</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<a
								href="#"
								className="text-neutral-500 hover:text-[#00ff88] transition-colors text-lg"
								aria-label="Facebook"
							>
								📘
							</a>
							<a
								href="#"
								className="text-neutral-500 hover:text-[#00ffff] transition-colors text-lg"
								aria-label="Twitter"
							>
								🐦
							</a>
							<a
								href="#"
								className="text-neutral-500 hover:text-[#ff00ff] transition-colors text-lg"
								aria-label="Instagram"
							>
								📷
							</a>
							<a
								href="#"
								className="text-neutral-500 hover:text-[#ff00aa] transition-colors text-lg"
								aria-label="LinkedIn"
							>
								💼
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Layout;
