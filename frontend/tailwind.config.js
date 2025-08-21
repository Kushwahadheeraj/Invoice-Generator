// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        'brand': '#7C5DFA',
        'brand-light': '#9277FF',
        'dark-1': '#1E2139',
        'dark-2': '#252945',
        'light-1': '#DFE3FA',
        'light-2': '#888EB0',
        'light-bg': '#F8F8FB',
        'status-paid': 'rgb(51, 214, 159)',
        'status-pending': 'rgb(255, 143, 0)',
        'status-draft': 'rgb(55, 59, 83)',
      }
    },
  },
  plugins: [],
}