/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Orange (Primary)
        primary: { DEFAULT: '#EA580C', 50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C', 800: '#9A3412', 900: '#7C2D12' },
        // Secondary (Muted gray/blue for contrast)
        secondary: { DEFAULT: '#475569', 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155' },
        accent: { DEFAULT: '#FFEDD5', 500: '#FFEDD5' },
        success: { DEFAULT: '#22C55E', 500: '#22C55E' },
        warning: { DEFAULT: '#EAB308', 500: '#EAB308' },
        danger: { DEFAULT: '#EF4444', 500: '#EF4444' },
        // Pure Black Dark Theme
        dark: { bg: '#000000', card: '#0A0A0A', border: '#1F1F1F', text: '#FAFAFA', muted: '#A1A1AA' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'merge': 'merge 4s ease-in-out infinite',
        'count-up': 'countUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 20px rgba(14,165,233,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(14,165,233,0.6)' } },
        merge: { '0%': { transform: 'translateX(-60px)', opacity: '0.7' }, '40%': { transform: 'translateX(0)', opacity: '1' }, '60%': { transform: 'translateX(0)', opacity: '1' }, '100%': { transform: 'translateX(-60px)', opacity: '0.7' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
