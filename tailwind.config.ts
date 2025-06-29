module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Ajuste conforme necessário
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-in-out',
        'fade-in-delay': 'fade-in 1s ease-in-out 0.5s',
      },
    },
  },
  plugins: [],
};
