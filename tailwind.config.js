/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'decide-red': '#BF1F1F', // Color rojo principal del proyecto
      }
    },
  },
  plugins: [],
}