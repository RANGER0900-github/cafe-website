/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0b08', // Deep coffee brown/black
        primary: '#d4a574', // Warm caramel/latte
        secondary: '#c7956d', // Coffee cream
        accent: '#8b6f47', // Rich coffee brown
        text: '#e8dcc8', // Cream white
        'card-bg': '#1a1512', // Dark wood brown
        'cafe-gold': '#d4a574',
        'cafe-cream': '#f5ebe0',
        'cafe-dark': '#2c1810',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff' },
          '50%': { boxShadow: '0 0 20px #00f3ff, 0 0 40px #00f3ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}

