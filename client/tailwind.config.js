/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        "primary-dark": "#2563EB",
        "primary-light": "#DBEAFE",
        secondary: "#10B981",
        "secondary-dark": "#059669",
        "secondary-light": "#D1FAE5",
        accent: "#8B5CF6",
        "accent-dark": "#7C3AED",
        "accent-light": "#EDE9FE",
        background: "#F9FAFB",
        darkBg: "#1F2937",
        warning: "#F59E0B",
        danger: "#EF4444",
        success: "#10B981",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 