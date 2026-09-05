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
        printhub: {
          yellow: '#F2CB30',
          pink: '#DA0090',
          purple: '#2C0E63',
          plum: '#12002E',
        },
        navy: {
          DEFAULT: '#2C0E63',
          950: '#12002E',
          900: '#2C0E63',
          800: '#12002E',
          700: '#2C0E63',
          600: '#3A1480',
        },
        orange: {
          DEFAULT: '#F2CB30',
          accent: '#F2CB30',
          hover: '#E0BA22',
          light: '#F8D858',
        },
        gray: {
          soft: '#E5E5E5',
        },
        studio: {
          950: '#12002E',
          900: '#2C0E63',
          850: '#1F0B46',
          800: '#2C0E63',
          750: '#38127D',
          700: '#45179B',
          600: '#5A1FC9',
          500: '#7333E8',
        },
        brand: {
          navy: '#2C0E63',
          plum: '#12002E',
          purple: '#2C0E63',
          pink: '#DA0090',
          yellow: '#F2CB30',
          orange: '#F2CB30',
          white: '#FFFFFF',
          gray: '#E5E5E5',
          black: '#12002E',
          accent: '#F2CB30',
          creative: '#DA0090',
          blue: '#2C0E63',
          cyan: '#F2CB30',
          emerald: '#10B981',
          50: '#FFFFFF',
          100: '#F8F6FC',
          200: '#EBE5F7',
          300: '#D5C7F0',
          400: '#A98EE0',
          500: '#2C0E63',
          600: '#230B50',
          700: '#12002E',
        }
      },
      letterSpacing: {
        fashion: '0.22em',
        'fashion-wide': '0.3em',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Cinzel', 'serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -4px rgba(252, 163, 17, 0.45)',
        'glow-orange': '0 0 25px -4px rgba(252, 163, 17, 0.45)',
        'glow-cyan': '0 0 25px -4px rgba(252, 163, 17, 0.45)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.45)',
        'glow-violet': '0 0 25px -4px rgba(252, 163, 17, 0.45)',
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
