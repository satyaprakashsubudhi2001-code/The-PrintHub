/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#111726',
          800: '#161f33',
          750: '#1c2842',
          700: '#243252',
          600: '#33456e',
          500: '#475d8f',
        },
        surface: {
          50: '#f8f9fc',
          100: '#f1f3f9',
          200: '#e2e7f1',
          300: '#cbd4e6',
          400: '#94a3b8',
          text: '#171725',
          muted: '#667085',
        },
        brand: {
          purple: '#6C4DF6', // Primary Brand / CTA
          blue: '#2563EB',   // Interactive Elements
          cyan: '#06B6D4',   // Customization / Tech
          pink: '#EC4899',   // Creative Accents
          orange: '#F97316', // Printing / Highlights
          yellow: '#FACC15', // Badges / Offers
          emerald: '#10B981',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6C4DF6',
          600: '#5835e5',
          700: '#4723ca',
          accent: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -4px rgba(99, 102, 241, 0.45)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.45)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.45)',
        'glow-violet': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'studio-card': '0 12px 36px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'studio-subtle': '0 4px 24px -2px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
