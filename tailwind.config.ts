/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces (Framer style)
        canvas: "#090909",
        "surface-1": "#141414",
        "surface-2": "#1c1c1c",
        "surface-3": "#262626",
        
        // Text
        ink: "#ffffff",
        "ink-muted": "#999999",
        
        // Accents (EcoQuest identity)
        accent: "#10B981", // Emerald
        "accent-focus": "#059669",
        "accent-glow": "rgba(16, 185, 129, 0.15)",

        // Spotlight Gradients (Framer style atmosphere)
        "gradient-emerald": "#059669",
        "gradient-teal": "#0D9488",
        "gradient-ocean": "#0284C7",
      },
      fontFamily: {
        // Using Inter as the system font (SF Pro / Inter Variable replacement)
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        "tighter-xl": "-0.04em",
        "tighter-2xl": "-0.05em",
        "tighter-3xl": "-0.06em",
      },
      backgroundImage: {
        "spotlight-emerald": "radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
        "spotlight-teal": "radial-gradient(circle at center, rgba(13, 148, 136, 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "light-edge": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "floating": "0 20px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "focus-ring": "0 0 0 2px rgba(16, 185, 129, 0.3)",
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 1s ease-out forwards",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
