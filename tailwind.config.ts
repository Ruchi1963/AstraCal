import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B1020',
        mist: '#F6F7FB',
        astro: {
          50: '#EEF7FF', 100: '#D9EEFF', 500: '#2C82F6', 600: '#1C6BDD'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(10,16,30,0.08)'
      }
    },
  },
  plugins: [],
} satisfies Config
