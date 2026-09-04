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
        fog: {
          950: '#070708',
          900: '#0A0A0C', // Obsidian Black
          850: '#111114', // Deep Midnight Graphite
          800: '#16161A', // Matte Charcoal
          750: '#1E1E24',
          700: '#282830',
          stone: '#F4F2EE', // Warm Limestone Stone
          bone: '#FAF9F6',  // Architectural Bone Off-White
          sand: '#EAE7E1',
          gold: '#C8B896',  // Understated Champagne Gold
          muted: '#8A8782',
        },
        studio: {
          950: '#070708',
          900: '#0A0A0C',
          850: '#111114',
          800: '#16161A',
          750: '#1E1E24',
          700: '#282830',
          600: '#3D3D48',
          500: '#5C5C6B',
        },
        surface: {
          50: '#FAF9F6',
          100: '#F4F2EE',
          200: '#EAE7E1',
          300: '#D6D2C8',
          400: '#8A8782',
          text: '#0E0E10',
          muted: '#716F6A',
        },
        brand: {
          purple: '#1E1E24', // Fear of God refined obsidian
          blue: '#16161A',
          cyan: '#C8B896',   // Champagne luxury accent
          pink: '#8A8782',
          orange: '#C8B896',
          yellow: '#D4AF37',
          emerald: '#10B981',
          50: '#F5F4F0',
          100: '#EAE7E1',
          200: '#D6D2C8',
          300: '#B8B3A7',
          400: '#8A8782',
          500: '#16161A',
          600: '#0A0A0C',
          700: '#070708',
          accent: '#C8B896',
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
