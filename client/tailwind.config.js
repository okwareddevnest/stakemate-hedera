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
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce-subtle 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      transitionTimingFunction: {
        'bounce-custom': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      // Add utility classes for animation delays
      utilities: {
        '.animation-delay-1000': {
          'animation-delay': '1000ms',
        },
        '.animation-delay-2000': {
          'animation-delay': '2000ms',
        },
        '.animation-delay-3000': {
          'animation-delay': '3000ms',
        },
      },
    },
  },
  plugins: [],
} 