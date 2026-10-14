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
        // Strict 4-color system:
        // Primary Dark Green: #183630
        // Primary Beige: #E5DAC9
        // Primary Soft Gold: #E5C690
        // Highlight Taupe: #B8A98F
        ph: {
          dark: '#183630',
          beige: '#E5DAC9',
          gold: '#E5C690',
          taupe: '#B8A98F',
        },
        printhub: {
          DEFAULT: '#183630',
          dark: '#183630',
          beige: '#E5DAC9',
          gold: '#E5C690',
          taupe: '#B8A98F',
        },
        brand: {
          dark: '#183630',
          beige: '#E5DAC9',
          gold: '#E5C690',
          taupe: '#B8A98F',
          DEFAULT: '#183630',
          primary: '#183630',
          secondary: '#E5C690',
          accent: '#B8A98F',
          surface: '#E5DAC9',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'ph-subtle': '0 4px 20px -2px rgba(24, 54, 48, 0.08)',
        'ph-card': '0 8px 30px -4px rgba(24, 54, 48, 0.12)',
        'ph-elevated': '0 16px 40px -8px rgba(24, 54, 48, 0.18)',
        'bracket-glow': '0 0 14px rgba(184, 169, 143, 0.45)',
        'bracket-glow-sm': '0 0 8px rgba(184, 169, 143, 0.35)',
        'gold-glow': '0 0 16px rgba(229, 198, 144, 0.35)',
      },
      transitionDuration: {
        '250': '250ms',
      },
    },
  },
  plugins: [],
}

