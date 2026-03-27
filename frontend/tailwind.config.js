/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgStart: "#f0fdfa", // vibrant light teal
        bgEnd: "#fdf4ff",   // vibrant light pink
        mainContent: "#ffffff",
        primary: "#ffde00", // vibrant yellow
        secondary: "#ff4da6", // vibrant pink
        accent: "#3b82f6", // vibrant blue
        dark: "#1a1a1a",
      },
      boxShadow: {
        brutal: "6px 6px 0px 0px rgba(26, 26, 26, 1)",
        "brutal-hover": "3px 3px 0px 0px rgba(26, 26, 26, 1)",
        "brutal-sm": "4px 4px 0px 0px rgba(26, 26, 26, 1)",
        "brutal-lg": "12px 12px 0px 0px rgba(26, 26, 26, 1)",
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '25%': { transform: 'rotate(2deg)' },
          '50%': { transform: 'rotate(-6deg)' },
          '75%': { transform: 'rotate(2deg)' },
        }
      },
      animation: {
        shake: 'shake 0.4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
