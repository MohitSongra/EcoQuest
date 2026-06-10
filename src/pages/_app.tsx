// src/pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { AuthProvider } from "../contexts/AuthContext";
import { useEffect } from "react";
import Lenis from "lenis";

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		// Lenis provides buttery-smooth scrolling with lerp-based interpolation.
		// This is the industry-standard approach used by Apple, Stripe, Linear,
		// Framer, and Awwwards-winning sites to make scroll-driven animations
		// feel locked to the user's input rather than flying past.
		const lenis = new Lenis({
			// lerp controls the interpolation factor (0 = frozen, 1 = native).
			// Lower values = smoother/slower deceleration. 0.08–0.12 is the sweet
			// spot for scroll-driven animations.
			lerp: 0.09,

			// Duration fallback when lerp isn't used (not active with lerp set,
			// but good to define for completeness).
			duration: 1.2,

			// Use native smooth-scroll for programmatic scrollTo calls
			smoothWheel: true,

			// Normalize wheel delta across browsers and input devices. This is
			// critical for trackpads which can send wildly different deltas.
			wheelMultiplier: 0.8,

			// Normalize touch velocity
			touchMultiplier: 1.5,
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		// Expose lenis globally so other components can use it if needed
		(window as any).__lenis = lenis;

		return () => {
			lenis.destroy();
			delete (window as any).__lenis;
		};
	}, []);

	return (
		<AuthProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</AuthProvider>
	);
}

export default MyApp;
