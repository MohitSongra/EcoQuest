import React from "react";
import Navigation from "./Navigation";

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
			className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-primary font-satoshi`}
		>
			<Navigation />
			<main>{children}</main>

			{/* Enhanced Footer */}
			<footer className="relative bg-dark-gradient text-neutral-300 overflow-hidden border-t border-neon-green/20">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-20">
					<div className="absolute inset-0 gradient-mesh" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,255,136,0.1)_1px,transparent_0)] bg-[length:30px_30px]" />
				</div>

				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						{/* Brand Section */}
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 glass-neon rounded-2xl flex items-center justify-center shadow-neon-green">
									<span className="text-neon-green font-bold text-xl animate-pulse">♻</span>
								</div>
								<div>
									<h3 className="font-clash text-xl font-bold text-gradient">EcoQuest</h3>
									<p className="text-neutral-400 text-sm font-satoshi">
										Making recycling fun and rewarding
									</p>
								</div>
							</div>
							<p className="text-neutral-400 max-w-md font-satoshi">
								Join thousands of environmental champions in the mission to
								reduce e-waste and create a sustainable future for our planet.
							</p>
						</div>

						{/* Quick Links */}
						<div>
							<h4 className="font-clash font-semibold mb-4 text-neutral-300">Quick Links</h4>
							<ul className="space-y-2">
								<li>
									<a
										href="/dashboard"
										className="text-neutral-400 hover:text-neon-green transition-colors font-satoshi"
									>
										Dashboard
									</a>
								</li>
								<li>
									<a
										href="/challenges"
										className="text-neutral-400 hover:text-neon-cyan transition-colors font-satoshi"
									>
										Challenges
									</a>
								</li>
								<li>
									<a
										href="/quizzes"
										className="text-neutral-400 hover:text-neon-purple transition-colors font-satoshi"
									>
										Quizzes
									</a>
								</li>
								<li>
									<a
										href="/admin"
										className="text-neutral-400 hover:text-neon-pink transition-colors font-satoshi"
									>
										Admin
									</a>
								</li>
							</ul>
						</div>

						{/* Contact */}
						<div>
							<h4 className="font-clash font-semibold mb-4 text-neutral-300">Get in Touch</h4>
							<ul className="space-y-2">
								<li className="flex items-center space-x-2 text-neutral-400 font-satoshi">
									<span className="text-neon-green">📧</span>
									<span>hello@ecoquest.app</span>
								</li>
								<li className="flex items-center space-x-2 text-neutral-400 font-satoshi">
									<span className="text-neon-cyan">🌐</span>
									<span>www.ecoquest.app</span>
								</li>
								<li className="flex items-center space-x-2 text-neutral-400 font-satoshi">
									<span className="text-neon-purple">📱</span>
									<span>+1 (555) 123-4567</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Section */}
					<div className="border-t border-neon-green/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-neutral-500 text-sm text-center md:text-left font-satoshi">
							♻ Making e-waste recycling fun and rewarding since 2024
						</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<a
								href="#"
								className="text-neutral-400 hover:text-neon-green transition-colors"
								aria-label="Facebook"
							>
								📘
							</a>
							<a
								href="#"
								className="text-neutral-400 hover:text-neon-cyan transition-colors"
								aria-label="Twitter"
							>
								🐦
							</a>
							<a
								href="#"
								className="text-neutral-400 hover:text-neon-purple transition-colors"
								aria-label="Instagram"
							>
								📷
							</a>
							<a
								href="#"
								className="text-neutral-400 hover:text-neon-pink transition-colors"
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
