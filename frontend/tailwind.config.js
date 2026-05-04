/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "waitlist-container": "#a2ed00d8",
        "surface-dim": "#0e0e0e",
        "surface-tint": "#deffab",
        "on-primary-fixed": "#2e4800",
        "surface": "#0e0e0e",
        "on-tertiary-fixed-variant": "#6a006a",
        "error-container": "#b92902",
        "surface-container-lowest": "#000000",
        "secondary-container": "#1c19f5",
        "primary": "#deffab",
        "tertiary-dim": "#ff51fa",
        "surface-container": "#1a1a1a",
        "surface-variant": "#262626",
        "secondary-fixed": "#cdceff",
        "inverse-primary": "#456900",
        "error": "#ff7351",
        "on-surface": "#ffffff",
        "tertiary": "#ff51fa",
        "tertiary-contact-container": "#d62fecf6",
        "surface-container-highest": "#262626",
        "error-dim": "#d53d18",
        "on-tertiary-fixed": "#320032",
        "primary-fixed": "#abfc01",
        "inverse-surface": "#fcf9f8",
        "primary-container": "#abfc01",
        "outline-variant": "#484847",
        "secondary-dim": "#595fff",
        "on-secondary-fixed-variant": "#2120f7",
        "surface-bright": "#2c2c2c",
        "primary-fixed-dim": "#a0ed00",
        "tertiary-fixed": "#ff81f5",
        "background": "#0e0e0e",
        "on-secondary-fixed": "#0800b7",
        "on-error": "#450900",
        "on-secondary-container": "#d8d8ff",
        "surface-container-low": "#131313",
        "on-surface-variant": "#adaaaa",
        "secondary-fixed-dim": "#bcbeff",
        "secondary": "#8e94ff",
        "on-primary": "#436600",
        "outline": "#767575",
        "on-secondary": "#03007b",
        "on-tertiary-container": "#230023",
        "tertiary-fixed-dim": "#ff61f8",
        "on-error-container": "#ffd2c8",
        "primary-dim": "#a0ed00",
        "tertiary-container": "#fe00fe",
        "on-background": "#ffffff",
        "inverse-on-surface": "#565555",
        "on-tertiary": "#400040",
        "surface-container-high": "#20201f",
        "on-primary-container": "#3c5c00",
        "on-primary-fixed-variant": "#446700"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Space Grotesk", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
      keyframes: {
        "spin-slow": {
          "from": { "transform": "rotate(0deg)" },
          "to": { "transform": "rotate(360deg)" }
        },
        "fade-in-up": {
          "0%": { "opacity": "0", "transform": "translate(-50%, 10px)" },
          "100%": { "opacity": "1", "transform": "translate(-50%, 0)" }
        }
      },
      animation: {
        "spin-slow": "spin-slow 20s linear infinite",
        "fade-in-up": "fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }
    },
  },
  plugins: [],
}
