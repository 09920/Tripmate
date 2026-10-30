/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0D9488', // Ocean teal primary
          600: '#0F766E',
          700: '#115E59',
          800: '#134E4A',
          900: '#163047',
        },
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#A7F3D0', // Fresh mint accent
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0D9488', // Primary ocean teal
          600: '#0F766E',
          700: '#115E59',
          800: '#134E4A',
          900: '#163047', // Deep navy
          950: '#0B1E2E',
        },
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8', // Secondary sky blue
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
        },
        mint: {
          50: '#F2FDF8',
          100: '#D1FAE5',
          200: '#A7F3D0', // Accent fresh mint
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          500: '#64748B',
          700: '#334155',
          800: '#1E293B',
          900: '#163047', // Deep navy main text
          950: '#0E1F2E',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px -2px rgba(22, 48, 71, 0.05), 0 1px 3px 0 rgba(22, 48, 71, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(13, 148, 136, 0.14), 0 4px 12px -2px rgba(22, 48, 71, 0.06)',
        'teal-sm': '0 2px 8px -1px rgba(13, 148, 136, 0.25)',
        'teal': '0 4px 14px -1px rgba(13, 148, 136, 0.35)',
      },
      animation: {
        'shimmer': 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
